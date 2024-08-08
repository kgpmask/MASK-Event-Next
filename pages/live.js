import Head from "next/head";
import Link from 'next/link';
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

import QuizContainer from "@/components/Quiz/QuizContainer";
import MessageCard from "@/components/Quiz/MessageCard";
import EndedNotStartedMessage from "@/components/Quiz/EndedNotStartedMessage";
import SubmitMessage from "@/components/Quiz/SubmitMessage";
import WaitingMessage from "@/components/Quiz/WaitingMessage";
import TimeoverMessage from "@/components/Quiz/TimeoverMessage";
import LiveInstructions from "@/components/Quiz/LiveInstructions";

import socket from '@/socket';

const LivePageHead = () => {
	return (
		<Head>
			<title>Live Quiz Portal</title>
			<meta name="description" content="Quiz is starting, good luck!" />
		</Head>
	);
}

// let idx = 0;
const LivePage = () => {
	const [state, setState] = useState('instructions');
	const [timeRemaining, setTimeRemaining] = useState(0);

	const [renderComponent, setRenderComponent] = useState(<LiveInstructions />);

	const [question, setQuestion] = useState(null);
	const answer = useRef(null);
	const [timeoutId, setTimeoutId] = useState(null);

	const [socketConnected, setSocketConnected] = useState(false);
	const [socketTransport, setSocketTransport] = useState("N/A");

	const router = useRouter();

	const questionHandler = (question) => {
		if (state !== 'waiting') return;

		const type = question.type;
		setQuestion(question);
		answer.current = null;
		
		setTimeRemaining(type === 'mcq' ? 10 : 20);
		setState('attempting');
	}

	const submissionHandler = useCallback((args) => {
		// const questionNo = question.questionNo;
		// const response = answer.current;

		// // console.log({questionNo, response});

		// fetch('/api/live/save-response', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ questionNo, response })
		// }).then(res => res.text()).then(res => {
		// 	// console.log(res);
		// 	setTimeRemaining(0);
		// 	setQuestion(null);
		// 	setState(args?.timeover ? 'timeover' : 'submitted');
		// });

		console.log("Wah bete");
	});

	const sampleQuestion = {
		question : 'Who tf made this question',
		questionNo : 1,
	}

	const timeoutSubmit = useCallback(() => {
		if (state !== 'attempting') return;
		submissionHandler({ timeover: true });
	});

	useEffect(() => {
		// if (!localStorage.getItem('username')) router.push('/login');

		const onSocketConnect = () => {
			setSocketConnected(true);
			setSocketTransport(socket.io.engine.transport.name);
		}

		const onSocketDisconnect = () => {
			setSocketConnected(false);
			setSocketTransport("N/A");
		}

		if (socket.connected) onSocketConnect();

		socket.on('connect', onSocketConnect);
		socket.on('disconnect', onSocketDisconnect);
		socket.on('timeout', timeoutSubmit);
		socket.on('start-quiz', () => setState('instructions'));
		socket.on('end-quiz', () => router.push('/results'));

		return (
			() => {
				socket.off('connect', onSocketConnect);
				socket.off('disconnect', onSocketDisconnect);
			}
		)
	}, []);

	useMemo(() => {
		if (state !== 'attempting') return setTimeRemaining(0);
		if (timeRemaining) {
			setTimeoutId(setTimeout(() => console.log({timeRemaining}) || timeRemaining && setTimeRemaining((timeRemaining || 1) - 1), 1_000));
			return () => clearTimeout(timeoutId);
		}
		submissionHandler({timeout: true});
	}, [timeRemaining])

	useMemo(() => {
		switch (state) {
			case 'early':
				setRenderComponent(
					<EndedNotStartedMessage isEarly={true} />
				)
				break;
			case 'late':
				setRenderComponent(
					<EndedNotStartedMessage />
				)
				break;
			case 'instructions':
				setRenderComponent(
					<LiveInstructions buttonCallback={() => setState('waiting')} />
				);
				break;
			case 'waiting':
				socket.on('question', question => questionHandler(question));
				setRenderComponent(
					<WaitingMessage />
				);
				break;
			case 'attempting':
				setRenderComponent(
					<QuizContainer 
						question={sampleQuestion}
						round={1}
						time={timeRemaining}
						submitAnswer={submissionHandler}
					/>
				);
				break;
			case 'submitted':
				socket.listeners('question').splice(0, socket.listeners('question').length);
				clearTimeout(timeoutId);
				setRenderComponent(
					<SubmitMessage />
				);
				setTimeoutId(setTimeout(() => setState('waiting'), 3000));
				break;
			case 'timeover':
				socket.listeners('question').splice(0, socket.listeners('question').length);
				setRenderComponent(
					<TimeoverMessage />
				)
				setTimeoutId(setTimeout(() => setState('waiting'), 3_000));
				break;
			default:
				setRenderComponent(
					<MessageCard message={'Polayadi Mone'} />
				);
		}
	}, [state]);

	
	// const cycleState = () => {
	// 	const states = ['waiting', 'attempting', 'early', 'late', 'timeover', 'submitted', 'instructions']
	// 	idx = (idx + 1) % 7;
	// 	setState(states[idx]);
	// 	console.log('state: ', state)
	// 	console.log('arr state: ', states[idx]);
	// }

	return (
		<>
			<LivePageHead />
			{ renderComponent }
			{/* <button onClick={cycleState}>cycleNigga</button> */}
		</>
	);
}

export default LivePage;
