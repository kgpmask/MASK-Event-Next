import Head from "next/head";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import QuizContainer from "@/components/Quiz/QuizContainer";
import MessageCard from "@/components/Quiz/MessageCard";
import EndedNotStartedMessage from "@/components/Quiz/EndedNotStartedMessage";
import SubmitMessage from "@/components/Quiz/SubmitMessage";
import WaitingMessage from "@/components/Quiz/WaitingMessage";
import TimeoverMessage from "@/components/Quiz/TimeoverMessage";
import LiveInstructions from "@/components/Quiz/LiveInstructions";

import socket from "@/socket";

const LivePageHead = () => {
  return (
    <Head>
      <title>Live Quiz Portal</title>
      <meta name="description" content="Quiz is starting, good luck!" />
    </Head>
  );
};

// let idx = 0;
const LivePage = () => {
  const [state, setState] = useState("instructions");
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [renderComponent, setRenderComponent] = useState(<LiveInstructions />);

  const [question, setQuestion] = useState(null);
  const answer = useRef(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketTransport, setSocketTransport] = useState("N/A");

  const router = useRouter();

  const questionHandler = (question) => {
    // console.log(question);
    if (state !== "waiting") return;

    const type = question.type;
    setQuestion(question);
    answer.current = null;

		setTimeRemaining(type === "mcq" ? 25 : 45);
		setState("attempting");
	};

  const submissionHandler = (args) => {
    const questionNo = question.questionNo;
    const response =
      question.type === "mcq" ? answer.current : answer.current.trim();
    console.log(args);
    // if(response == '') return;

    // console.log({questionNo, response});

    fetch("/api/live/submit-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionNo, response }),
    })
      .then((res) => res.text())
      .then((res) => {
        // console.log(res);
        setTimeRemaining(0);
        setQuestion(null);
        setState(args?.timeout && response === "" ? "timeover" : "submitted");
      });

    // fetch('/api/live/submit-answer', {
    // 	method: 'POST',
    // 	headers: { 'Content-Type': 'application/json' },
    // 	body: JSON.stringify({ questionNo, response })
    // }).then(res => res.text()).then(res => {
    // 	// console.log(res);
    // 	setTimeRemaining(0);
    // 	setQuestion(null);
    // 	setState(args?.timeout && (response === '') ? 'timeover' : 'submitted');
    // });
  };

  const timeoutSubmit = useCallback(() => {
    if (state !== "attempting") return;
    submissionHandler({ timeout: true });
  });

  useEffect(() => {
    if (
      !document.cookie.includes("sessionId=") ||
      document.cookie.split("sessionId=").pop().split(";")[0] === ""
    ) {
      router.push("/login");
    }

    const onSocketConnect = () => {
      setSocketConnected(true);
      setSocketTransport(socket.io.engine.transport.name);
    };

    const onSocketDisconnect = () => {
      setSocketConnected(false);
      setSocketTransport("N/A");
    };

    if (socket.connected) onSocketConnect();

		socket.on("connect", onSocketConnect);
		socket.on("disconnect", onSocketDisconnect);
		socket.on("timeout", () => setTimeout(() => {setState('waiting')}, 3000));
		socket.on("start-quiz", () => setState("instructions"));
		socket.on("end-quiz", () => router.push("/results"));

    return () => {
      socket.off("connect", onSocketConnect);
      socket.off("disconnect", onSocketDisconnect);
    };
  }, []);

  // useMemo(() => {
  // 	if (state !== "attempting") return setTimeRemaining(0);
  // 	if (timeRemaining) {
  // 		setTimeoutId(
  // 			setTimeout(
  // 				() =>
  // 					console.log({ timeRemaining }) ||
  // 					(timeRemaining && setTimeRemaining((timeRemaining || 1) - 1)),
  // 				1_000
  // 			)
  // 		);
  // 		return () => clearTimeout(timeoutId);
  // 	}
  // 	submissionHandler({ timeout: true });
  // }, [timeRemaining]);

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
				socket.on("question", (question) => questionHandler(question));
				setRenderComponent(<WaitingMessage />);
				break;
			case "attempting":
				setRenderComponent(
					<QuizContainer
						question={question}
						time={timeRemaining}
						submitAnswer={submissionHandler}
						updateAnswer={(val) => answer.current = val}
					/>
				);
				break;
			case "submitted":
				socket
					.listeners("question")
					.splice(0, socket.listeners("question").length);
				clearTimeout(timeoutId);
				setRenderComponent(<SubmitMessage />);
				// setTimeoutId(setTimeout(() => setState("waiting"), 3000));
				break;
			case "timeover":
				socket
					.listeners("question")
					.splice(0, socket.listeners("question").length);
				setRenderComponent(<TimeoverMessage />);
				setTimeoutId(setTimeout(() => setState("waiting"), 3_000));
				break;
			default:
				setRenderComponent(<MessageCard message={"Polayadi Mone"} />);
		}
	}, [state]);

	return (
		<>
			<LivePageHead />
			{renderComponent}
		</>
	);
};

export default LivePage;
