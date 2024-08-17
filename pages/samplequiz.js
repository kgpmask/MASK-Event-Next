import { useState, useEffect, useMemo } from "react";
import DummyQuizContainer from "@/components/Quiz/DummyQuizContainer";
import WaitingMessage from "@/components/Quiz/WaitingMessage";
import TimeoverMessage from "@/components/Quiz/TimeoverMessage";
import MessageCard from "@/components/Quiz/MessageCard";
import SubmitMessage from "@/components/Quiz/SubmitMessage";


const dummyApiResponse = {
	questions: [
		{
			questionNo: 1,
			title: "Sample Round",
			question: "Who is the protagonist of 'Naruto'?",
			options: [
				"Sasuke Uchiha",
				"Naruto Uzumaki",
				"Sakura Haruno",
				"Kakashi Hatake",
			],
			type: "mcq",
			answer: 1,
		},
		{
			questionNo: 2,
			title: "Sample Round",
			question:
				"In 'Attack on Titan', what is Eren Yeager's Titan form called?",
			options: [
				"Colossal Titan",
				"Armored Titan",
				"Attack Titan",
				"Beast Titan",
			],
			type: "mcq",
			answer: 2,
		},
		{
			questionNo: 3,
			title: "Sample Round",
			question: "Which anime features the character 'Light Yagami'?",
			options: ["Death Note", "Bleach", "One Piece", "Tokyo Ghoul"],
			type: "mcq",
			answer: 0,
		},
		{
			questionNo: 4,
			title: "Sample Round",
			question: "In 'Dragon Ball Z', what is Goku's Saiyan name?",
			options: ["Vegeta", "Raditz", "Kakarot", "Nappa"],
			type: "mcq",
			answer: 2,
		},
		{
			questionNo: 5,
			title: "Sample Round",
			question: "Which anime involves 'Alchemy' as a central theme?",
			options: ["Naruto", "Fullmetal Alchemist", "One Punch Man", "Fairy Tail"],
			type: "mcq",
			answer: 1,
		},
	],
};

function BeforeStart({ onClick }) {
	return (
		<MessageCard>
			<p>Press the button to start dummy quiz</p>
			<button onClick={onClick}>Start</button>
		</MessageCard>
	)
}

function Complete({ score }) {
	return (
		<MessageCard>
			<p>Dummy Quiz Complete, please head on over to Quiz Portal for the real quiz</p>
			<hr/>
			<p>Score: {score}/50</p>
		</MessageCard>
	)
}

export default function SampleQuiz() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [userAnswer, setUserAnswer] = useState(null);
	const [time, setTime] = useState(0);
	const [state, setState] = useState('before-start');

	const [renderComponent, setRenderComponent] = useState(<BeforeStart />);

	const submitAnswer = ({ timeout }) => {
		const correctAnswer = dummyApiResponse.questions[currentQuestion].answer;
		if (userAnswer === correctAnswer) {
			setScore((prevScore) => prevScore + 10);
		}
		setState(timeout ? 'timeout' : 'submitted');
	};

	const moveToNextQuestion = () => {
		setCurrentQuestion((prevIndex) => prevIndex + 1);
		setUserAnswer(null);
	};

	const updateAnswer = (answer) => {
		setUserAnswer(answer);
	};

	const startQuiz = () => {
		let idx = 0;
		function question() {
			if (idx >= dummyApiResponse.questions.length) {
				setState('complete');
				return;
			}
			setCurrentQuestion(idx);
			setUserAnswer(null);
			setState('attempting');
			setTime(dummyApiResponse.questions[idx].type === "mcq" ? 15 : 25)

			setTimeout(() => {
				setTimeout(() => {
					setState('waiting');
					setTimeout(() => {
						idx++;
						question();
					}, 7000);
				}, 3000);
			}, dummyApiResponse.questions[idx].type === "mcq" ? 15000 : 25000)
		}
		question();
	}


	useMemo(() => {
		console.log(state, currentQuestion, time)
		switch (state) {
			case "before-start":
				setRenderComponent(
					<BeforeStart onClick={startQuiz} />
				);
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
				setRenderComponent(<MessageCard message="Why did you even reach here, this is not supposed to be visible to mortal eyes"/>);
		}
	}, [state]);

	// useEffect(() => {
	// 	if (currentQuestion >= dummyApiResponse.questions.length) {
	// 		alert(
	// 			`Quiz finished! Your score: ${score}/${dummyApiResponse.questions.length * 10
	// 			}`
	// 		);
	// 		return;
	// 	}

	// 	const timerDuration = dummyApiResponse.questions[currentQuestion].type === "mcq" ? 15 : 25;
	// 	setTime(timerDuration);

	// 	const timer = setTimeout(() => {
	// 		submitAnswer({ timeout: true });
	// 	}, timerDuration * 1000);

	// 	return () => clearTimeout(timer);
	// }, [currentQuestion]);


	return (
		<>
			{renderComponent}
		</>
	);
}