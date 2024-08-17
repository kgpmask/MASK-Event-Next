import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import ForbiddenCard from "@/components/admin/ForbiddenCard";
import AdminContent from "@/components/admin/AdminContent";
import Timer from "@/components/Quiz/Timer";
import styles from "@/styles/Admin.module.css";

import socket from "@/socket";

export default function QuizPortalPage() {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
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
        if (
          !localStorage.getItem("questions") ||
          !localStorage.getItem("questions").length
        ) {
          const response = await fetch("/api/live/get-questions");
          if (response.status !== 201) throw new Error(await response.text());

          const fetchedQuestions = await response.text();
          localStorage.setItem("questions", fetchedQuestions);
        }

        setQuestions(JSON.parse(localStorage.getItem("questions")));
        setStart(true);
      } catch (err) {
        console.error("Error fetching questions:", err);
        //alert("Something went wrong while fetching questions.");
      }
    };

    fetchQuestions();
  };

  useEffect(() => {
    console.log(currentQ);
  }, [currentQ]);

  const startQuestion = async () => {
    try {
      const question = questions[currentQ];
      const response1 = await fetch("/api/live/start-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionNo: question.questionNo,
          type: question.type,
        }),
      });

      const result1 = await response1.text();
      console.log(result1);

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
        console.log(result2);
        setTimeout(
          () => {
            setDisabled(false);
            setQuestionState("Start Question");
          },
          question.type === "mcq" ? 25000 : 45000
        );
      }
    } catch (error) {
      console.error("Error starting question:", error);
    }
  };

  if (!isAdmin) return <ForbiddenCard />;

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
            </div>
            {questionState === "Timer Started" && (
              <Timer time={questions[currentQ]?.type === "mcq" ? 25 : 45} />
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
          <button className={styles["end-quiz"]}>End Quiz</button>
        </div>
      </div>
    </>
  );
}
