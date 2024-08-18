import Styles from "@/styles/Quiz.module.css";
import OptionContainer from "./OptionContainer";
import TextInput from "./TextInput";
import { useState, useEffect } from "react";
import Timer from "./Timer";
import WaitingMessage from "./WaitingMessage";

export default function QuizContainer({
  question,
  round,
  time,
  submitAnswer,
  updateAnswer,
}) {
  const [answer, setAnswer] = useState("");
  const [disabled, setDisabled] = useState(false);

  const submitHandler = (timeout) => {
    setDisabled(true);
    return submitAnswer({ timeout });
  };

  useEffect(() => {
    updateAnswer(answer);
  }, [answer]);

  // useEffect(() => {
  //   console.log(disabled);
  // }, [disabled]);

  return (
    <div className={Styles["container"]}>
      <div className={Styles["card"]}>
        {/* <WaitingMessage /> */}
        <div className={Styles["header"]}>
          <div className={Styles["info"]}>
            <p className={Styles["round-no"]}>
              {question.title.split(":")[0].trim()}
            </p>
            <p className={Styles["round-name"]}>Question #{question.questionNo}</p>
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
          className={
            !disabled
              ? Styles["submit-btn"]
              : Styles["submit-btn"] + " " + Styles["disabled"]
          }
          onClick={() => submitHandler(false)}
          disabled={disabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
