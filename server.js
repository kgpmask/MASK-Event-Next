import "dotenv/config";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import mongoose from "mongoose";
import dbInit from "./database/dbInit.js";
import flushCachedRecords from "./utils/flushCachedRecords.js";
import quizState from "./utils/quizState.js";
import checkAdmin from "./utils/checkAdmin.js";
import { serverQuestionTime } from "./utils/questionTiming.js";

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
			io.to(process.env.QUIZ_ID).emit("question", question);
			quizState.scheduleClientTimeout(
				() => {
					io.to(process.env.QUIZ_ID).emit("timeout", "");
				},
				serverQuestionTime(question.type, question.difficulty) * 1000
			);
		});

		socket.on("end-quiz", () => {
			if (!socket.isAdmin) {
				console.warn(
					`Unauthorized 'end-quiz' emit rejected from socket ${socket.id}`
				);
				return socket.emit("unauthorized", "Only admins can end the quiz");
			}
			quizState.markEnded();
			io.to(process.env.QUIZ_ID).emit("end-quiz", "");
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
