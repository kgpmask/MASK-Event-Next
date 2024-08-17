import Styles from "@/styles/Quiz.module.css";
import OptionContainer from "./OptionContainer";
import TextInput from "./TextInput";
import Timer from "./Timer";
import { useState, useEffect } from "react";

export default function QuizContainer({
  question,
  round,
  time,
  submitAnswer,
  updateAnswer,
}) {
  const [answer, setAnswer] = useState("");

  const submitHandler = (timeout) => {
    return submitAnswer({ timeout });
  };

  useEffect(() => {
    updateAnswer(answer);
  }, [answer]);

  return (
    <div className={Styles["container"]}>
      <div className={Styles["card"]}>
        <div className={Styles["header"]}>
          <div className={Styles["info"]}>
            <p className={Styles["round-no"]}>
              {question.title.split(":")[0].trim()}
            </p>
            <p className={Styles["round-name"]}>Sample Quiz</p>
            <p className={Styles["question-no"]}>
              Question #{question.questionNo}
            </p>
          </div>
          <Timer time={time} onTimeEnd={() => submitHandler(true)} />
        </div>
        <div className={Styles["content"]}>
          <p className={Styles["question-text"]}>{question.question}</p>
          {question.type === "mcq" ? (
            <OptionContainer
              selected={answer}
              setSelected={setAnswer}
              options={question.options}
            />
          ) : (
            <TextInput text={answer} setText={setAnswer} />
          )}
        </div>
        <button
          className={Styles["submit-btn"]}
          onClick={() => submitHandler(false)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
