import "dotenv/config";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import mongoose from "mongoose";
import { dbInit } from "./database/dbInit.js";
import { flushCachedRecords } from "./utils/flushCachedRecords.js";
import { quizState } from "./utils/quizState.js";
import { checkAdmin } from "./utils/checkAdmin.js";
import { Question } from "./database/models/Question.js";
import { Session } from "./database/models/Session.js";
import { hasAnsweredQuestion } from "./utils/hasAnsweredQuestion.js";
import { toClientQuestion } from "./utils/clientPayloads.js";

/**
 * Parses a raw Cookie header string into a key-value object.
 * @param {string} [header] The Cookie request header value.
 * @returns {Record<string, string>} The parsed cookies.
 */
const parseCookies = (header = "") =>
	Object.fromEntries(
		header
			.split(";")
			.map((pair) => pair.trim().split("="))
			.filter(([key]) => key)
			.map(([key, ...rest]) => [key, rest.join("=")])
	);

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
	const httpServer = createServer(handler);
	await dbInit();
	const io = new Server(httpServer);

	io.use(async (socket, next) => {
		try {
			const { sessionId } = parseCookies(socket.request.headers.cookie);
			const session = sessionId ? await Session.findById(sessionId).lean() : null;
			socket.userId = session?.userId ?? null;
			socket.isAdmin = sessionId ? await checkAdmin(sessionId) : false;
		} catch (error) {
			socket.isAdmin = false;
			console.error("Error authenticating socket:", error);
		}
		next();
	});

	io.on("connection", (socket) => {
		console.log("Connection count:", io.engine.clientsCount);
		if (!process.env.QUIZ_ID) {
			console.error("QUIZ_ID is not set. Socket could not join a room.");
			return socket.disconnect(true);
		}
		socket.join(process.env.QUIZ_ID);
		if (socket.isAdmin) socket.join("admins");
		const toTimedClientQuestion = (question) => {
			return {
				...toClientQuestion(question),
				timeRemaining: quizState.clientTimeRemaining(),
			};
		};

		// Socket events are not replayed for a participant who reconnects. Send
		// the active question directly so they do not get stuck on the waiting
		// screen while the question is still open.
		const sendCurrentQuestion = async () => {
			if (!quizState.isQuestionRunning || !socket.userId) return;
			try {
				const hasAnswered = await hasAnsweredQuestion({
					userId: socket.userId,
					quizId: quizState.quizId,
					questionNo: quizState.currentQuestionNo,
				});
				if (hasAnswered) return socket.emit("question", { hasAnswered: true });

				const question = await Question.findOne({
					quizId: quizState.quizId,
					questionNo: quizState.currentQuestionNo,
				}).lean({ defaults: true });
				if (!question) return;
				socket.emit("question", {
					hasAnswered: false,
					...toTimedClientQuestion(question),
				});
			} catch (error) {
				console.error("Error restoring current question for socket:", error);
			}
		};
		const sendQuizState = () => socket.emit("quiz-state", quizState.toClient());
		socket.on("get-quiz-state", () => {
			sendQuizState();
			void sendCurrentQuestion();
		});
		sendQuizState();
		void sendCurrentQuestion();

		socket.on("question", (question) => {
			if (!socket.isAdmin) {
				console.warn(
					`Unauthorized 'question' emit rejected from socket ${socket.id}`
				);
				return socket.emit(
					"unauthorized",
					"Only admins can broadcast questions"
				);
			}
			if (quizState.isQuestionRunning) {
				return socket.emit(
					"unauthorized",
					`Question ${quizState.currentQuestionNo} is running. Wait for it to be done.`
				);
			}
			quizState.startQuestion({
				questionNo: question.questionNo,
				type: question.type,
				difficulty: question.difficulty,
			});
			io.to(process.env.QUIZ_ID).emit("quiz-state", quizState.toClient());
			io.to(process.env.QUIZ_ID).emit(
				"question",
				toTimedClientQuestion(question)
			);
			quizState.scheduleFlush(() => {
				io.to(process.env.QUIZ_ID).emit("timeout", "");
				io.to(process.env.QUIZ_ID).emit("quiz-state", quizState.toClient());
				io.to("admins").emit("question-respondents", {
					questionNo: quizState.lastQuestionNo,
					count: quizState.respondentCount(quizState.lastQuestionNo),
				});
				quizState.endQuestion();
				flushCachedRecords().catch((err) =>
					console.error("Error flushing cached records:", err)
				);
			});
		});

		socket.on("start-quiz", () => {
			if (!socket.isAdmin) {
				console.warn(
					`Unauthorized 'start-quiz' emit rejected from socket ${socket.id}`
				);
				return socket.emit("unauthorized", "Only admins can start the quiz");
			}
			quizState.markStarted();
			io.to(process.env.QUIZ_ID).emit("quiz-state", quizState.toClient());
			io.to(process.env.QUIZ_ID).emit("start-quiz", "");
		});

		socket.on("end-quiz", () => {
			if (!socket.isAdmin) {
				console.warn(
					`Unauthorized 'end-quiz' emit rejected from socket ${socket.id}`
				);
				return socket.emit("unauthorized", "Only admins can end the quiz");
			}
			quizState.resetForNextQuiz();
			io.to(process.env.QUIZ_ID).emit("quiz-state", quizState.toClient());
			io.to(process.env.QUIZ_ID).emit("end-quiz", "");
		});

		// Database cleanup is performed by the protected reset API before this
		// event is emitted. This keeps every connected client in sync afterwards.
		socket.on("reset-quiz", () => {
			if (!socket.isAdmin) {
				console.warn(
					`Unauthorized 'reset-quiz' emit rejected from socket ${socket.id}`
				);
				return socket.emit("unauthorized", "Only admins can reset the quiz");
			}
			if (quizState.quizStatus !== "idle") {
				return socket.emit(
					"unauthorized",
					"The quiz can only be reset before it starts or after it ends."
				);
			}
			quizState.resetForNextQuiz();
			io.to(process.env.QUIZ_ID).emit("quiz-state", quizState.toClient());
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`Ready on http://${hostname}:${port}`);
		});

	let shuttingDown = false;

	/**
	 * Flushes cached records and shuts the server down on a signal.
	 * @param {string} signal The received process signal name.
	 */
	const flushAndShutdown = (signal) => {
		if (shuttingDown) return;
		shuttingDown = true;
		console.log(`Received ${signal}, flushing cached records...`);

		const forceExit = setTimeout(() => {
			console.error("Shutdown timed out while flushing, exiting anyway.");
			process.exit(1);
		}, 5_000);

		const flush = async () => {
			const count = await flushCachedRecords();
			if (count)
				console.log(`${count} cached records flushed to the database.`);
			clearTimeout(forceExit);
			await mongoose.connection.close();
			process.exit(0);
		};

		flush().catch((err) => {
			clearTimeout(forceExit);
			console.error("Error flushing cached records:", err);
			process.exit(1);
		});
	};

	process.on("SIGINT", () => flushAndShutdown("SIGINT"));
	process.on("SIGTERM", () => flushAndShutdown("SIGTERM"));
	process.on("SIGUSR2", () => flushAndShutdown("SIGUSR2"));
});
