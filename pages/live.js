import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import { QuizContainer } from "@/components/Quiz/QuizContainer";
import { MessageCard } from "@/components/Quiz/MessageCard";
import { EndedNotStartedMessage } from "@/components/Quiz/EndedNotStartedMessage";
import { SubmitMessage } from "@/components/Quiz/SubmitMessage";
import { WaitingMessage } from "@/components/Quiz/WaitingMessage";
import { TimeoverMessage } from "@/components/Quiz/TimeoverMessage";
import { LiveInstructions } from "@/components/Quiz/LiveInstructions";
import { questionTime } from "@/utils/questionTiming";

import { socket } from "@/socket";

/**
 * LivePageHead component that renders the page head with title and description.
 * @returns {JSX.Element} The head markup.
 */
const LivePageHead = () => {
	return (
		<Head>
			<title>Live Quiz Portal</title>
			<meta name="description" content="Quiz is starting, good luck!" />
		</Head>
	);
};

/**
 * LivePage page that streams live quiz questions over a socket and manages quiz states.
 * @returns {JSX.Element} The live quiz page markup.
 */
export default function LivePage() {
	const [state, setState] = useState("instructions");
	const [timeRemaining, setTimeRemaining] = useState(0);

	const [renderComponent, setRenderComponent] = useState(<LiveInstructions />);

	const [question, setQuestion] = useState(null);
	const answer = useRef(null);

	const router = useRouter();

	const stateRef = useRef(state);

	/**
	 * Fetches the current quiz state and question to restore an in-progress quiz.
	 */
	const resumeQuiz = useCallback(async () => {
		try {
			const stateResponse = await fetch("/api/live/get-quiz-state");
			if (stateResponse.status !== 200) return;
			const state = await stateResponse.json();
			if (state.currentQuestionNo == null) return;

			const questionResponse = await fetch("/api/live/get-current-question");
			if (questionResponse.status !== 200) return;
			const question = await questionResponse.json();

			const remaining = Math.max(0, state.timeRemaining - 5);
			setQuestion(question);
			answer.current = null;
			setTimeRemaining(remaining);
			setState(remaining > 0 ? "attempting" : "timeover");
		} catch (err) {
			console.error("Error resuming live quiz:", err);
		}
	}, []);

	/**
	 * Handles an incoming question event by setting the question and starting its timer.
	 * @param {object} question - The question object received from the socket.
	 */
	const questionHandler = (question) => {
		const type = question.type;
		setQuestion(question);
		answer.current = null;

		setTimeRemaining(questionTime(type, question.difficulty));
		setState("attempting");
	};

	/**
	 * Submits the current answer to the API and updates the quiz state.
	 * @param {object} args - The submission arguments.
	 * @param {boolean} args.timeout - Whether the submission was due to a timeout.
	 */
	const submissionHandler = useCallback(
		(args) => {
			const questionNo = question.questionNo;
			const response =
				question.type === "text" ? answer.current.trim() : answer.current;
			fetch("/api/live/submit-answer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ questionNo, response }),
			})
				.then((res) => Promise.all([res.status, res.text()]))
				.then(([status]) => {
					if (status < 200 || status >= 300) return;
					setTimeRemaining(0);
					setQuestion(null);
					setState(args?.timeout && response === "" ? "timeover" : "submitted");
				})
				.catch((err) => console.error("Error submitting answer:", err));
		},
		[question]
	);

	/**
	 * Resets the quiz to the instructions state.
	 */
	const onStartQuiz = () => setState("instructions");
	/**
	 * Navigates to the results page when the quiz ends.
	 */
	const onEndQuiz = useCallback(() => router.push("/results"), [router]);
	/**
	 * Forwards an incoming question event to the latest question handler.
	 * @param {object} question - The question object received from the socket.
	 */
	const onQuestion = (question) => questionHandlerRef.current(question);

	const questionHandlerRef = useRef(questionHandler);

	useEffect(() => {
		stateRef.current = state;
		questionHandlerRef.current = questionHandler;
	});

	useEffect(() => {
		let isMounted = true;

		if (
			(!document.cookie.includes("sessionId=") ||
				document.cookie.split("sessionId=").pop().split(";")[0] === "") &&
			isMounted
		) {
			router.push("/login");
		}

		/**
		 * Marks the quiz as time over when the timeout event fires during an attempt.
		 */
		const onTimeout = () => {
			if (stateRef.current === "attempting") {
				setState("timeover");
			}
		};

		socket.on("timeout", onTimeout);
		socket.on("start-quiz", onStartQuiz);
		socket.on("end-quiz", onEndQuiz);
		socket.on("question", onQuestion);
		socket.on("connect", resumeQuiz);

		if (socket.connected) resumeQuiz();

		return () => {
			isMounted = false;
			socket.off("timeout", onTimeout);
			socket.off("start-quiz", onStartQuiz);
			socket.off("end-quiz", onEndQuiz);
			socket.off("question", onQuestion);
			socket.off("connect", resumeQuiz);
		};
	}, [onEndQuiz, resumeQuiz, router]);

	useMemo(() => {
		switch (state) {
			case "early":
				setRenderComponent(<EndedNotStartedMessage isEarly={true} />);
				break;
			case "late":
				setRenderComponent(<EndedNotStartedMessage />);
				break;
			case "instructions":
				setRenderComponent(
					<LiveInstructions buttonCallback={() => setState("waiting")} />
				);
				break;
			case "waiting":
				setRenderComponent(<WaitingMessage />);
				break;
			case "attempting":
				setRenderComponent(
					<QuizContainer
						question={question}
						time={timeRemaining}
						submitAnswer={submissionHandler}
						updateAnswer={(val) => (answer.current = val)}
					/>
				);
				break;
			case "submitted":
				setRenderComponent(<SubmitMessage />);
				break;
			case "timeover":
				setRenderComponent(<TimeoverMessage />);
				break;
			default:
				setRenderComponent(<MessageCard message={"Polayadi Mone"} />);
		}
	}, [state, question, submissionHandler, timeRemaining]);

	return (
		<>
			<LivePageHead />
			{renderComponent}
		</>
	);
}
