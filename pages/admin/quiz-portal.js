import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import ForbiddenCard from "@/components/admin/ForbiddenCard";
import AdminContent from "@/components/admin/AdminContent";
import QuestionNavigator from "@/components/admin/QuestionNavigator";
import styles from "@/styles/Admin.module.css";

import socket from "@/socket";

export default function QuizPortalPage() {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [questionState, setQuestionState] = useState("Start Question");

  const [questions, setQuestions] = useState(null);

  //socket stuff tum log karlena tysm

  const toggleQuestionState = () => {
    setQuestionState("Timer Started");
  };

  useEffect(() => {
    setHasChecked(localStorage.getItem("is-admin"));
    setIsAdmin(eval(localStorage.getItem("is-admin") || "false"));
  }, []);

  useEffect(() => {
    //if (!localStorage.getItem("username")) {
    //  router.push("/login");
    //  return;
    //}
  }, [router]);

  useMemo(() => {
    const checkAdmin = async () => {
      try {
        if (!hasChecked) {
          const username = localStorage.getItem("username");
          if (!username) {
            setIsAdmin(false);
            return;
          }
          const response = eval(await (await fetch("/api/check-admin")).text());
          localStorage.setItem("is-admin", response);
          setIsAdmin(response);
        } else {
          setIsAdmin(eval(localStorage.getItem("is-admin") || "false"));
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    checkAdmin();
  }, [hasChecked]);

  useMemo(() => {
    const fetchQuestions = async () => {
      try {
        if (questions) return;

        if (!localStorage.getItem("questions")) {
          const response = await fetch("/api/live/fetch-questions");
          if (response.status !== 201) throw new Error(await response.text());

          const fetchedQuestions = await response.text();
          localStorage.setItem("questions", fetchedQuestions);
        }

        setQuestions(JSON.parse(localStorage.getItem("questions")));
      } catch (err) {
        console.error("Error fetching questions:", err);
        //alert("Something went wrong while fetching questions.");
      }
    };

    fetchQuestions();
  }, [questions]);

  const startQuestion = async (question) => {
    try {
      const response = await fetch("/api/live/start-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionNo: question.questionNo,
          type: question.type,
        }),
      });

      const result = await response.text();
      console.log(result);

      if (response.status < 400) {
        //socket.emit("question", question);
        setDisabled(true);
        setTimeout(
          () => setDisabled(false),
          question.type === "mcq" ? 15000 : 25000
        );
      }
    } catch (error) {
      console.error("Error starting question:", error);
    }
  };

  //if (!isAdmin) return <ForbiddenCard />;

  return (
    <>
      <div className={styles["questions-navigator"]}>
        <div className={styles["question-info"]}>
          <div className={styles["round-info"]}>
            <p>Round 2</p>
            <h2>Shiri Masu Ka?</h2>
            <p>Question #5</p>
          </div>
          <div className={styles["time-left"]}>
            <p>Time Left:</p>
            <h2 className={styles["timer"]}>00:00</h2>
          </div>
        </div>
        <div className={styles["question"]}>
          <p>
            In the anime "Naruto," what is the name of Naruto's signature jutsu
            that creates multiple copies of himself?
          </p>
          <div className={styles["quiz-nav-buttons"]}>
            <button className={styles["disabled"]}>Previous</button>
            <button
              className={styles["start-question"]}
              onClick={toggleQuestionState}
            >
              {questionState}
            </button>
            <button>Next</button>
          </div>
          <button className={styles["end-quiz"]}>End Quiz</button>
        </div>
      </div>
    </>
  );
}
