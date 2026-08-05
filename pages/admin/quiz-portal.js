import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Timer } from "@/components/Quiz/Timer";
import { DifficultyBadge } from "@/components/Quiz/DifficultyBadge";
import { serverQuestionTime } from "@/utils/questionTiming";
import styles from "@/styles/Admin.module.css";

import { socket } from "@/socket";

/**
 * QuizPortalPage that lets the quizmaster start, time and navigate live quiz questions.
 * @returns {JSX.Element} The quiz portal page markup.
 */
export default function QuizPortalPage() {
	const router = useRouter();
	const [disabled, setDisabled] = useState(false);
	const [questionState, setQuestionState] = useState("Start Question");
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [start, setStart] = useState(false);
	const [resumeTime, setResumeTime] = useState(null);
	const [questions, setQuestions] = useState([]);

	/**
	 * Resets the question controls when the current question's timer ends.
	 */
	const onTimeEnd = () => {
		setDisabled(false);
		setQuestionState("Start Question");
		setResumeTime(null);
	};

	useEffect(() => {
		let isMounted = true;

		/**
		 * Restores the in-progress question state when the page loads or reconnects.
		 */
		const resume = async () => {
			try {
				const stateResponse = await fetch("/api/live/get-quiz-state");
				if (stateResponse.status !== 200) return;
				const state = await stateResponse.json();
				if (state.currentQuestionNumber == null && !state.lastQuestionNo)
					return;

				if (isMounted) {
					setCurrentQuestion(
						state.currentQuestionNumber ?? state.lastQuestionNo
					);
					setStart(true);

					if (state.currentQuestionNumber != null) {
						setDisabled(true);
						setQuestionState("Timer Started");
						setResumeTime(state.timeRemaining);
					}
				}
			} catch (err) {
				console.error("Error resuming quiz:", err);
			}
		};

		/**
		 * Loads the question list from localStorage or the admin API and caches it.
		 */
		const loadQuestions = async () => {
			try {
				let storedQuestions = JSON.parse(
					localStorage.getItem("questions") ?? "[]"
				);
				if (!storedQuestions || !storedQuestions.length) {
					const response = await fetch("/api/admin/live/get-questions");
					if (response.status !== 201) throw new Error(await response.text());

					const fetchedQuestions = await response.text();
					localStorage.setItem("questions", fetchedQuestions);
					storedQuestions = JSON.parse(fetchedQuestions);
				}

				if (isMounted) {
					setQuestions(storedQuestions);
				}
			} catch (err) {
				console.error("Error fetching questions:", err);
			}
		};

		loadQuestions();
		resume();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		/**
		 * Alerts the quizmaster and resets controls when an unauthorized action is attempted.
		 * @param {string} message - The unauthorized message received from the socket.
		 */
		const onUnauthorized = (message) => {
			alert(message);
			setDisabled(false);
			setQuestionState("Start Question");
		};
		socket.on("unauthorized", onUnauthorized);
		return () => {
			socket.off("unauthorized", onUnauthorized);
		};
	}, []);

	/**
	 * Starts the current question by notifying the server and emitting it over the socket.
	 */
	const startQuestion = async () => {
		try {
			const question = questions[currentQuestion];
			if (!question) return;
			const response = await fetch("/api/admin/live/start-question", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					questionNo: question.questionNo,
					type: question.type,
					difficulty: question.difficulty,
				}),
			});

			if (response.status < 400) {
				socket.emit("question", question);
				setDisabled(true);
				setQuestionState("Timer Started");
				setResumeTime(null);
			}
		} catch (error) {
			console.error("Error starting question:", error);
		}
	};

	/**
	 * Marks the quiz as started, enabling the question controls.
	 */
	const startQuiz = () => {
		setStart(true);
	};

	/**
	 * Evaluates answers, emits the end-quiz event and navigates to the results page.
	 */
	const endQuiz = async () => {
		if (!start) return;
		try {
			await fetch("/api/admin/live/evaluate-answer");
		} catch (err) {
			console.error("Error evaluating answers:", err);
		}
		socket.emit("end-quiz");
		router.push("/results");
	};

	if (start && !questions.length) return <div>Loading...</div>;

	return (
		<>
			<div className={styles["questions-navigator"]}>
				{start && (
					<div className={styles["question-info"]}>
						<div className={styles["round-info"]}>
							<p>
								{currentQuestion
									? questions[currentQuestion]?.title?.split(":")?.[0]?.trim()
									: questions[currentQuestion]?.title}
							</p>
							<h2>Shiri Masu Ka?</h2>
							<p>{`Question #${questions[currentQuestion]?.questionNo}`}</p>
							<DifficultyBadge
								difficulty={questions[currentQuestion]?.difficulty}
							/>
						</div>
						{questionState === "Timer Started" && (
							<Timer
								time={
									resumeTime ??
									serverQuestionTime(
										questions[currentQuestion]?.type,
										questions[currentQuestion]?.difficulty
									)
								}
								onTimeEnd={onTimeEnd}
							/>
						)}
					</div>
				)}
				<div className={styles["question"]}>
					{start ? (
						<div className={styles["quiz-nav-buttons"]}>
							<button
								className={currentQuestion ? "" : styles["disabled"]}
								onClick={() =>
									currentQuestion
										? setCurrentQuestion(currentQuestion - 1)
										: null
								}
							>
								Previous
							</button>
							<button
								disabled={disabled}
								className={styles["start-question"]}
								onClick={startQuestion}
							>
								{questionState}
							</button>
							<button
								className={
									questions.length - (currentQuestion + 1)
										? ""
										: styles["disabled"]
								}
								onClick={() =>
									questions.length - (currentQuestion + 1)
										? setCurrentQuestion(currentQuestion + 1)
										: null
								}
							>
								Next
							</button>
						</div>
					) : (
						<button onClick={startQuiz} className={styles["end-quiz"]}>
							Start Quiz
						</button>
					)}
					<button
						onClick={endQuiz}
						disabled={!start}
						className={[
							styles["end-quiz"],
							!start ? styles["disabled"] : "",
						].join(" ")}
					>
						End Quiz
					</button>
				</div>
			</div>
		</>
	);
}
