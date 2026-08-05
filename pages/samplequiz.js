import { useState, useMemo, useRef, useCallback } from "react";
import { DummyQuizContainer } from "@/components/Quiz/DummyQuizContainer";
import { WaitingMessage } from "@/components/Quiz/WaitingMessage";
import { TimeoverMessage } from "@/components/Quiz/TimeoverMessage";
import { MessageCard } from "@/components/Quiz/MessageCard";
import { SubmitMessage } from "@/components/Quiz/SubmitMessage";
import { SampleInstructions } from "@/components/Quiz/SampleInstructions";
import { questionTime } from "@/utils/questionTiming";
import { evaluateAnswer } from "@/utils/evaluateAnswer";

const dummyApiResponse = {
	questions: [
		{
			questionNo: 1,
			title: "Sample Round",
			question: "Who is the protagonist of 'Naruto'?",
			options: "Sasuke Uchiha,Naruto Uzumaki,Sakura Haruno,Kakashi Hatake",
			type: "mcq",
			answer: "1",
			difficulty: "easy",
			score: 100,
		},
		{
			questionNo: 2,
			title: "Sample Round",
			question:
				"In 'Attack on Titan', what is Eren Yeager's Titan form called?",
			options: "Colossal Titan,Armored Titan,Attack Titan,Beast Titan",
			type: "mcq",
			answer: "2",
			difficulty: "medium",
			score: 200,
		},
		{
			questionNo: 3,
			title: "Sample Round",
			question: "Which anime features the character 'Light Yagami'?",
			options: "Death Note,Bleach,One Piece,Tokyo Ghoul",
			type: "mcq",
			answer: "0",
			difficulty: "medium",
			score: 200,
		},
		{
			questionNo: 4,
			title: "Sample Round",
			question: "In 'Dragon Ball Z', what is Goku's Saiyan name?",
			options: "Vegeta,Raditz,Kakarot,Nappa",
			type: "mcq",
			answer: "2",
			difficulty: "hard",
			score: 300,
		},
		{
			questionNo: 5,
			title: "Sample Round",
			question: "Which anime involves 'Alchemy' as a central theme?",
			options: "Naruto,Fullmetal Alchemist,One Punch Man,Fairy Tail",
			type: "mcq",
			answer: "1",
			difficulty: "insane",
			score: 400,
		},
		{
			questionNo: 6,
			title: "Sample Round",
			question: "Match each character to their series.",
			options:
				"Light Yagami,Monkey D. Luffy,Itachi Uchiha|Death Note,One Piece,Naruto,Bleach,Dragon Ball Z",
			type: "mtf",
			answer: "0,1,2",
			difficulty: "hard",
			score: 300,
		},
		{
			questionNo: 7,
			title: "Sample Round",
			question: "Select all of the 'Big Three' anime series (multi-select).",
			options: "Naruto,One Piece,Bleach,Death Note",
			type: "multi-mcq",
			answer: "0,1,2",
			difficulty: "medium",
			score: 300,
		},
		{
			questionNo: 8,
			title: "Sample Round",
			question: "Select the Weekly Shonen Jump series (partial credit).",
			options: "Naruto,Attack on Titan,One Piece,Fullmetal Alchemist",
			type: "part-multi-mcq",
			answer: "0,2",
			difficulty: "medium",
			score: 200,
		},
		{
			questionNo: 9,
			title: "Sample Round",
			question: "Match each villain to their series (partial credit).",
			options:
				"Madara Uchiha,Shigaraki Tomura|Naruto,My Hero Academia,One Piece",
			type: "part-mtf",
			answer: "0,1",
			difficulty: "hard",
			score: 300,
		},
	],
};

/**
 * Complete component that shows the final score once the sample quiz finishes.
 * @param {object} props - The component props.
 * @param {number} props.score - The user's total score.
 * @returns {JSX.Element} The completion message markup.
 */
function Complete({ score }) {
	return (
		<MessageCard>
			<p>
				Dummy Quiz complete, please head on over to Quiz Portal for the real
				quiz
			</p>
			<br />
			<p>
				Score: {score}/{maxScore}
			</p>
		</MessageCard>
	);
}

const maxScore = dummyApiResponse.questions.reduce(
	(total, q) => total + q.score,
	0
);

/**
 * SampleQuiz page that runs the interactive sample quiz with timed questions and scoring.
 * @returns {JSX.Element} The sample quiz page markup.
 */
export default function SampleQuiz() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const userAnswer = useRef("");
	const [time, setTime] = useState(0);
	const [state, setState] = useState("before-start");

	const [renderComponent, setRenderComponent] = useState(
		<SampleInstructions />
	);

	/**
	 * Checks the submitted answer against the correct answer and updates the score and state.
	 * @param {object} args - The submission arguments.
	 * @param {boolean} args.timeout - Whether the submission was due to a timeout.
	 */
	const submitAnswer = useCallback(
		({ timeout }) => {
			const question = dummyApiResponse.questions[currentQuestion];
			setScore(
				(prevScore) =>
					prevScore +
					evaluateAnswer(
						userAnswer.current,
						question.answer,
						question.type,
						question.score
					)
			);
			setState(timeout ? "timeout" : "submitted");
		},
		[currentQuestion]
	);

	/**
	 * Stores the current answer in a ref so it is available at submission time.
	 * @param {string|Array<number>} answer - The current answer value.
	 */
	const updateAnswer = (answer) => {
		userAnswer.current = answer;
	};

	/**
	 * Starts the sample quiz and schedules question transitions, waiting and completion states.
	 */
	const startQuiz = () => {
		let idx = 0;
		/**
		 * Loads the question at the current index and schedules the next question transition.
		 */
		function question() {
			userAnswer.current = "";
			setCurrentQuestion(idx);
			setState("attempting");
			setTime(questionTime(dummyApiResponse.questions[idx].type));

			setTimeout(
				() => {
					setTimeout(() => {
						setState("waiting");
						setTimeout(() => {
							idx++;
							if (idx >= dummyApiResponse.questions.length) {
								setState("complete");
								return;
							}
							question();
						}, 4000);
					}, 2000);
				},
				questionTime(dummyApiResponse.questions[idx].type) * 1000
			);
		}
		question();
	};

	useMemo(() => {
		switch (state) {
			case "before-start":
				setRenderComponent(<SampleInstructions onClick={startQuiz} />);
				break;
			case "waiting":
				setRenderComponent(<WaitingMessage />);
				break;
			case "attempting":
				setRenderComponent(
					<DummyQuizContainer
						question={dummyApiResponse.questions[currentQuestion]}
						time={time}
						submitAnswer={submitAnswer}
						updateAnswer={updateAnswer}
					/>
				);
				break;
			case "submitted":
				setRenderComponent(<SubmitMessage />);
				break;
			case "timeout":
				setRenderComponent(<TimeoverMessage />);
				break;
			case "complete":
				setRenderComponent(<Complete score={score} />);
				break;
			default:
				setRenderComponent(
					<MessageCard message="Why did you even reach here, this is not supposed to be visible to mortal eyes" />
				);
		}
	}, [state, score, currentQuestion, submitAnswer, time]);

	return <>{renderComponent}</>;
}
