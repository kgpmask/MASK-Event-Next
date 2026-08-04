import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef } from "react";

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

  const questionHandler = (question) => {
    console.log(question);
    const type = question.type;
    setQuestion(question);
    answer.current = null;

    setTimeRemaining(questionTime(type, question.difficulty));
    setState("attempting");
  };

  const submissionHandler = (args) => {
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
        // console.log(res);
        setTimeRemaining(0);
        setQuestion(null);
        setState(args?.timeout && response === "" ? "timeover" : "submitted");
      });
  };

  useEffect(() => {
    let isMounted = true;

    if (
      (!document.cookie.includes("sessionId=") ||
      document.cookie.split("sessionId=").pop().split(";")[0] === "") && isMounted
    ) {
      router.push("/login");
    }

    socket.on("connect", () => {
      // Get the current game state from the server
    });
    socket.on("disconnect", () => {

    });
    socket.on("timeout", () => {
      if (state === "attempting") {
        setState("timeover");
      }
    });
    socket.on("start-quiz", () => setState("instructions"));
    socket.on("end-quiz", () => router.push("/results"));
    socket.on("question", questionHandler);

    return () => {
      isMounted = false;
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

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
        socket
          .listeners("question")
          .splice(0, socket.listeners("question").length);
        setRenderComponent(<SubmitMessage />);
        break;
      case "timeover":
        socket
          .listeners("question")
          .splice(0, socket.listeners("question").length);
        setRenderComponent(<TimeoverMessage />);
        break;
      default:
        setRenderComponent(<MessageCard message={"Polayadi Mone"} />);
    }
  }, [state, question, /* questionHandler, submissionHandler, timeRemaining, timeoutId */]);

  return (
    <>
      <LivePageHead />
      {renderComponent}
    </>
  );
};

export default LivePage;
