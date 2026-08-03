import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import ErrorPage from "@/pages/_error";
import Timer from "@/components/Quiz/Timer";
import DifficultyBadge from "@/components/Quiz/DifficultyBadge";
import questionTime from "@/utils/questionTiming";
import styles from "@/styles/Admin.module.css";

import socket from "@/socket";

export default function QuizPortalPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [questionState, setQuestionState] = useState("Start Question");
  const [currentQ, setCurrentQ] = useState(0);
  const [start, setStart] = useState(false);

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
    setQuestionState("Start Question");
  };

  const toggleQuestionState = () => {
    setQuestionState("Timer Started");
  };

  // useEffect(() => {
  // 	setHasChecked(localStorage.getItem("is-admin"));
  // 	setIsAdmin(eval(localStorage.getItem("is-admin") || "false"));
  // }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = (await (await fetch("/api/check-admin")).json())
          .isAdmin;
        setIsAdmin(response);
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    checkAdmin();
  }, []);

  const startQuiz = () => {
    const fetchQuestions = async () => {
      try {
        if (questions.length) return;
        let storedQuestions = JSON.parse(localStorage.getItem("questions") ?? "[]");
        if (
          !storedQuestions ||
          !storedQuestions.length
        ) {
          const response = await fetch("/api/live/get-questions");
          if (response.status !== 201) throw new Error(await response.text());

          const fetchedQuestions = await response.text();
          localStorage.setItem("questions", fetchedQuestions);
          storedQuestions = JSON.parse(fetchedQuestions);
        }

        setQuestions(storedQuestions);
        setStart(true);
      } catch (err) {
        console.error("Error fetching questions:", err);
        //alert("Something went wrong while fetching questions.");
      }
    };

    fetchQuestions();
  };

  // useEffect(() => {
  //   console.log(currentQ);
  // }, [currentQ]);

  const startQuestion = async () => {
    try {
      const question = questions[currentQ];
      const response1 = await fetch("/api/live/start-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionNo: question.questionNo,
          type: question.type,
          difficulty: question.difficulty,
        }),
      });

      const result1 = await response1.text();
      // console.log(result1);

      // const response = { status: 0 };
      if (response1.status < 400) {
        socket.emit("question", question);
        setDisabled(true);
        setQuestionState("Timer Started");
        const response2 = await fetch("/api/live/start-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionNo: question.questionNo,
            type: question.type,
          }),
        });
        const result2 = await response2.text();
        // console.log(result2);
        setTimeout(
          () => {
            setDisabled(false);
            setQuestionState("Start Question");
          },
          questionTime(question.type, question.difficulty) * 1000
        );
      }
    } catch (error) {
      console.error("Error starting question:", error);
    }
  };

  const endQuiz = async () => {
    if (!start) return;
    try {
      await fetch("/api/live/evaluate-answer");
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
              <Timer time={questionTime(questions[currentQ]?.type, questions[currentQ]?.difficulty)} />
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
