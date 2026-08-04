import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import QuizContainer from "@/components/Quiz/QuizContainer";
import MessageCard from "@/components/Quiz/MessageCard";
import EndedNotStartedMessage from "@/components/Quiz/EndedNotStartedMessage";
import SubmitMessage from "@/components/Quiz/SubmitMessage";
import WaitingMessage from "@/components/Quiz/WaitingMessage";
import TimeoverMessage from "@/components/Quiz/TimeoverMessage";
import LiveInstructions from "@/components/Quiz/LiveInstructions";
import questionTime from "@/utils/questionTiming";

import socket from "@/socket";

const LivePageHead = () => {
  return (
    <Head>
      <title>Live Quiz Portal</title>
      <meta name="description" content="Quiz is starting, good luck!" />
    </Head>
  );
};

const LivePage = () => {
  const [state, setState] = useState("instructions");
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [renderComponent, setRenderComponent] = useState(<LiveInstructions />);

  const [question, setQuestion] = useState(null);
  const answer = useRef(null);

  const router = useRouter();

  const stateRef = useRef(state);

  const questionHandler = (question) => {
    console.log(question);
    const type = question.type;
    setQuestion(question);
    answer.current = null;

    setTimeRemaining(questionTime(type, question.difficulty));
    setState("attempting");
  };

  const submissionHandler = useCallback((args) => {
    const questionNo = question.questionNo;
    const response =
      question.type === "text"
        ? answer.current.trim()
        : answer.current;
    fetch("/api/live/submit-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionNo, response }),
    })
      .then((res) => res.text())
      .then((_res) => {
        setTimeRemaining(0);
        setQuestion(null);
        setState(args?.timeout && response === "" ? "timeover" : "submitted");
      });
  }, [question]);

  const onStartQuiz = () => setState("instructions");
  const onEndQuiz = useCallback(() => router.push("/results"), [router]);
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
      document.cookie.split("sessionId=").pop().split(";")[0] === "") && isMounted
    ) {
      router.push("/login");
    }

    const onTimeout = () => {
      if (stateRef.current === "attempting") {
        setState("timeover");
      }
    };

    socket.on("timeout", onTimeout);
    socket.on("start-quiz", onStartQuiz);
    socket.on("end-quiz", onEndQuiz);
    socket.on("question", onQuestion);

    return () => {
      isMounted = false;
      socket.off("timeout", onTimeout);
      socket.off("start-quiz", onStartQuiz);
      socket.off("end-quiz", onEndQuiz);
      socket.off("question", onQuestion);
    };
  }, [onEndQuiz, router]);

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
            updateAnswer={(val) => answer.current = val}
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
};

export default LivePage;
