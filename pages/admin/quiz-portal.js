import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import ForbiddenCard from "@/components/admin/ForbiddenCard";
import AdminContent from "@/components/admin/AdminContent";
import QuestionNavigator from "@/components/admin/QuestionNavigator";

import socket from "@/socket";

export default function QuizPortalPage() {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Socket Connection state
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketTransport, setSocketTransport] = useState("N/A");

  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    setHasChecked(localStorage.getItem("is-admin"));
    setIsAdmin(eval(localStorage.getItem("is-admin") || "false"));
  }, []);

  useEffect(() => {
    // Needs to be logged in
    if (!localStorage.getItem("username")) {
      router.push("/login");
      return;
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

    return () => {
      socket.off("connect", onSocketConnect);
      socket.off("disconnect", onSocketDisconnect);
    };
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
        alert("Something went wrong while fetching questions.");
      }
    };

    fetchQuestions();
  }, [questions]);

  if (!isAdmin) return <ForbiddenCard />;

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
        socket.emit("question", question);
        setDisabled(true);
        setTimeout(
          () => setDisabled(false),
          question.type === "mcq" ? 15000 : 25000
        );
      }
    } catch (err) {
      console.error("Error starting question:", err);
    }
  };

  return (
    <>
      <h1>Quiz Portal</h1>

      <p>Quiz in progress:</p>

      {questions ? (
        <QuestionNavigator
          questions={questions}
          startQuestion={startQuestion}
          disabled={disabled}
        />
      ) : (
        <p>Fetching Questions...</p>
      )}
    </>
  );
}
