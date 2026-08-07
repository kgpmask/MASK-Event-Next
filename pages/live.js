import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";

import { QuizContainer } from "@/components/Quiz/QuizContainer";
import { MessageCard } from "@/components/Quiz/MessageCard";
import { EndedNotStartedMessage } from "@/components/Quiz/EndedNotStartedMessage";
import { SubmitMessage } from "@/components/Quiz/SubmitMessage";
import { WaitingMessage } from "@/components/Quiz/WaitingMessage";
import { TimeoverMessage } from "@/components/Quiz/TimeoverMessage";
import { LiveInstructions } from "@/components/Quiz/LiveInstructions";
import { questionTime } from "@/utils/questionTiming";

import { socket } from "@/socket";

const QUESTION_ORDER_STORAGE_PREFIX = "ocaq-question-order";

const LivePageHead = () => (
	<Head>
		<title>Live Quiz Portal</title>
		<meta name="description" content="Quiz is starting, good luck!" />
	</Head>
);

/**
 * Returns the participant-facing number for a question within its round. The
 * database number remains the stable ID used when recording answers.
 * @param {object} question The incoming live question.
 * @returns {number} The question's number within its round for this browser.
 */
const getRoundQuestionNumber = (question) => {
	if (typeof window === "undefined") return 1;
	const storageKey = `${QUESTION_ORDER_STORAGE_PREFIX}:${question.quizId ?? "live"}`;
	const round = question.title?.split(":")[0]?.trim() || "Quiz";
	let order = { rounds: {}, questions: {} };

	try {
		order = JSON.parse(localStorage.getItem(storageKey)) || order;
	} catch {
		// A malformed old value should not prevent a participant from joining.
	}

	const questionKey = String(question.questionNo);
	if (order.questions[questionKey] != null) return order.questions[questionKey];
	const number = (order.rounds[round] || 0) + 1;
	order.rounds[round] = number;
	order.questions[questionKey] = number;
	localStorage.setItem(storageKey, JSON.stringify(order));
	return number;
};

/** Live quiz page that receives questions and records participant answers. */
export default function LivePage() {
	const [state, setState] = useState("instructions");
	const [question, setQuestion] = useState(null);
	const [displayQuestionNo, setDisplayQuestionNo] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const answer = useRef(null);
	const questionRef = useRef(null);
	const stateRef = useRef(state);
	const waitingTimerRef = useRef(null);
	const completedQuestionsRef = useRef(new Set());
	const activeQuestionNoRef = useRef(null);
	const submittingRef = useRef(false);
	const router = useRouter();

	const clearWaitingTimer = useCallback(() => {
		if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current);
		waitingTimerRef.current = null;
	}, []);

	const scheduleWaiting = useCallback(() => {
		clearWaitingTimer();
		waitingTimerRef.current = setTimeout(() => {
			waitingTimerRef.current = null;
			setState("waiting");
		}, 10_000);
	}, [clearWaitingTimer]);

	/** Displays a newly received question without re-starting an answered one. */
	const questionHandler = useCallback(
		(incomingQuestion) => {
			const questionNo = String(incomingQuestion?.questionNo);
			if (
				!incomingQuestion ||
				completedQuestionsRef.current.has(questionNo) ||
				activeQuestionNoRef.current === questionNo
			)
				return;
			clearWaitingTimer();
			activeQuestionNoRef.current = questionNo;
			submittingRef.current = false;
			answer.current = null;
			setTimeRemaining(
				Number.isFinite(incomingQuestion.timeRemaining)
					? Math.max(0, incomingQuestion.timeRemaining)
					: questionTime(incomingQuestion.type, incomingQuestion.difficulty)
			);
			setDisplayQuestionNo(getRoundQuestionNumber(incomingQuestion));
			setQuestion(incomingQuestion);
			setState("attempting");
		},
		[clearWaitingTimer]
	);

	/** Restores the visible server state after a page load or socket reconnect. */
	const resumeQuiz = useCallback(async () => {
		try {
			const stateResponse = await fetch("/api/live/get-quiz-state");
			if (!stateResponse.ok) return;
			const quizState = await stateResponse.json();
			if (quizState.quizStatus === "idle") return setState("early");
			if (quizState.quizStatus === "started") return setState("instructions");
			if (quizState.currentQuestionNo == null) return setState("waiting");

			const questionResponse = await fetch("/api/live/get-current-question");
			if (!questionResponse.ok) return;
			questionHandler({
				...(await questionResponse.json()),
				timeRemaining: quizState.clientTimeRemaining,
			});
		} catch (error) {
			console.error("Error resuming live quiz:", error);
		}
	}, [questionHandler]);

	const submissionHandler = useCallback(
		({ timeout } = {}) => {
			if (!question || submittingRef.current) return;
			const currentAnswer = answer.current;
			const response =
				question.type === "text"
					? String(currentAnswer ?? "").trim()
					: currentAnswer;
			if (!timeout && (response == null || response === "")) return;

			submittingRef.current = true;
			const questionNo = question.questionNo;
			completedQuestionsRef.current.add(String(questionNo));
			if (timeout) setState("timeover");

			void (async () => {
				try {
					if (response != null && response !== "") {
						await fetch("/api/live/submit-answer", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ questionNo, response }),
						});
					}
				} catch (error) {
					console.error("Error submitting answer:", error);
				} finally {
					setQuestion(null);
					if (!timeout) setState("submitted");
				}
			})();
		},
		[question]
	);

	useEffect(() => {
		stateRef.current = state;
	}, [state]);

	useEffect(() => {
		questionRef.current = question;
	}, [question]);

	useEffect(() => {
		if (!document.cookie.match(/(?:^|; )sessionId=([^;]*)/)?.[1]) {
			router.push("/login");
			return;
		}

		const onTimeout = () => {
			if (stateRef.current === "attempting") {
				if (questionRef.current) {
					completedQuestionsRef.current.add(
						String(questionRef.current.questionNo)
					);
				}
				setQuestion(null);
				setState("timeover");
			}
			scheduleWaiting();
		};
		const onStartQuiz = () =>
			setState((current) => (current === "early" ? "instructions" : current));
		const onEndQuiz = () => router.push("/results");

		socket.on("timeout", onTimeout);
		socket.on("start-quiz", onStartQuiz);
		socket.on("end-quiz", onEndQuiz);
		socket.on("question", questionHandler);
		socket.on("connect", resumeQuiz);
		if (socket.connected) void resumeQuiz();

		return () => {
			clearWaitingTimer();
			socket.off("timeout", onTimeout);
			socket.off("start-quiz", onStartQuiz);
			socket.off("end-quiz", onEndQuiz);
			socket.off("question", questionHandler);
			socket.off("connect", resumeQuiz);
		};
	}, [clearWaitingTimer, questionHandler, resumeQuiz, router, scheduleWaiting]);

	let content;
	switch (state) {
		case "early":
			content = <EndedNotStartedMessage isEarly />;
			break;
		case "instructions":
			content = <LiveInstructions />;
			break;
		case "waiting":
			content = <WaitingMessage />;
			break;
		case "attempting":
			content = question ? (
				<QuizContainer
					key={question.questionNo}
					question={question}
					displayQuestionNo={displayQuestionNo}
					time={timeRemaining}
					submitAnswer={submissionHandler}
					updateAnswer={(value) => (answer.current = value)}
				/>
			) : (
				<WaitingMessage />
			);
			break;
		case "submitted":
			content = <SubmitMessage />;
			break;
		case "timeover":
			content = <TimeoverMessage />;
			break;
		default:
			content = <MessageCard message="Something went wrong loading the quiz." />;
	}

	return (
		<>
			<LivePageHead />
			{content}
		</>
	);
}
