import { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import ErrorPage from "@/pages/_error";
import Timer from "@/components/Quiz/Timer";
import DifficultyBadge from "@/components/Quiz/DifficultyBadge";
import { serverQuestionTime } from "@/utils/questionTiming";
import styles from "@/styles/Admin.module.css";

import socket from "@/socket";

export default function QuizPortalPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [questionState, setQuestionState] = useState("Start Question");
  const [currentQ, setCurrentQ] = useState(0);
  const [start, setStart] = useState(false);
  const [resumeTime, setResumeTime] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketTransport, setSocketTransport] = useState("N/A");

  useEffect(() => {
    if (!localStorage.getItem("username")) router.push("/login");

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

    return () => {
      socket.off("connect", onSocketConnect);
      socket.off("disconnect", onSocketDisconnect);
    };
  }, []);

  const onTimeEnd = () => {
    setDisabled(false);
    setQuestionState("Start Question");
    setResumeTime(null);
  };

  // useEffect(() => {
  // 	setHasChecked(localStorage.getItem("is-admin"));
  // 	setIsAdmin(eval(localStorage.getItem("is-admin") || "false"));
  // }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = (await (await fetch("/api/admin/check-admin")).json())
          .isAdmin;
        setIsAdmin(response);
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    checkAdmin();
  }, []);

  const loadQuestions = useCallback(async () => {
    try {
      let storedQuestions = JSON.parse(localStorage.getItem("questions") ?? "[]");
      if (
        !storedQuestions ||
        !storedQuestions.length
      ) {
        const response = await fetch("/api/admin/live/get-questions");
        if (response.status !== 201) throw new Error(await response.text());

        const fetchedQuestions = await response.text();
        localStorage.setItem("questions", fetchedQuestions);
        storedQuestions = JSON.parse(fetchedQuestions);
      }

      setQuestions(storedQuestions);
      return storedQuestions;
    } catch (err) {
      console.error("Error fetching questions:", err);
      return [];
    }
  }, []);

  const startQuiz = () => {
    loadQuestions().then((loaded) => {
      if (loaded.length) setStart(true);
    });
  };

  useEffect(() => {
    if (!isAdmin) return;

    const resume = async () => {
      try {
        const stateResponse = await fetch("/api/live/get-quiz-state");
        if (stateResponse.status !== 200) return;
        const state = await stateResponse.json();
        if (state.currentQuestionNo == null && !state.lastQuestionNo) return;

        const loadedQuestions = await loadQuestions();
        if (!loadedQuestions.length) return;

        setCurrentQ(state.currentQuestionNo ?? state.lastQuestionNo);
        setStart(true);

        if (state.currentQuestionNo != null) {
          setDisabled(true);
          setQuestionState("Timer Started");
          setResumeTime(state.timeRemaining);
        }
      } catch (err) {
        console.error("Error resuming quiz:", err);
      }
    };

    resume();
  }, [isAdmin, loadQuestions]);

  // useEffect(() => {
  //   console.log(currentQ);
  // }, [currentQ]);

  const startQuestion = async () => {
    try {
      const question = questions[currentQ];
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

  if (!isAdmin) return <ErrorPage statusCode={404} />;

  return (
    <>
      <div className={styles["questions-navigator"]}>
        {start && (
          <div className={styles["question-info"]}>
            <div className={styles["round-info"]}>
              <p>
                {currentQ
                  ? questions[currentQ]?.title.split(":")[0].trim()
                  : questions[currentQ]?.title}
              </p>
              <h2>Shiri Masu Ka?</h2>
              <p>{`Question #${currentQ}`}</p>
              <DifficultyBadge difficulty={questions[currentQ]?.difficulty} />
            </div>
            {questionState === "Timer Started" && (
              <Timer
                time={resumeTime ?? serverQuestionTime(questions[currentQ]?.type, questions[currentQ]?.difficulty)}
                onTimeEnd={onTimeEnd}
              />
            )}
          </div>
        )}
        <div className={styles["question"]}>
          <p>{questions[currentQ]?.question}</p>
          {start ? (
            <div className={styles["quiz-nav-buttons"]}>
              <button
                className={currentQ ? "" : styles["disabled"]}
                onClick={() => (currentQ ? setCurrentQ(currentQ - 1) : null)}
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
                  questions.length - (currentQ + 1) ? "" : styles["disabled"]
                }
                onClick={() =>
                  questions.length - (currentQ + 1)
                    ? setCurrentQ(currentQ + 1)
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
            className={[styles["end-quiz"], !start ? styles["disabled"] : ""].join(" ")}
          >
            End Quiz
          </button>
        </div>
      </div>
    </>
  );
}
