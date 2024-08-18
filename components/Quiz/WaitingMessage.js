import { useMemo, useState } from "react";
import MessageCard from "./MessageCard";
import styles from "@/styles/Quiz.module.css";

const WaitingMessage = () => {
  const [ellipse, setEllipse] = useState(1);

  useMemo(() => {
    setTimeout(() => setEllipse((ellipse % 3) + 1), 1000);
  }, [ellipse]);

  return (
    <MessageCard>
      <div className={styles["waiting-card"]}>
        <p>Waiting for the quizmaster</p>
        {Array(ellipse).fill(".").join("")}
        {Array(3 - ellipse)
          .fill("\u00A0")
          .join("")}
        <div className={styles["imgdiv"]}>
          <img src="/waiting.gif" />
        </div>
      </div>
    </MessageCard>
  );
};

export default WaitingMessage;
