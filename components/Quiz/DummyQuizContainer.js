import Styles from "@/styles/Quiz.module.css";
import OptionContainer from "./OptionContainer";
import TextInput from "./TextInput";
import MatchTheFollowing from "./MatchTheFollowing";
import { mcqOptions } from "@/utils/questionOptions";
import Timer from "./Timer";
import DifficultyBadge from "./DifficultyBadge";
import { useState, useEffect } from "react";

export default function QuizContainer({
  question,
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
  }, [answer, updateAnswer]);

  return (
    <div className={Styles["container"]}>
      <div className={Styles["card"]}>
        <div className={Styles["header"]}>
          <div className={Styles["info"]}>
            <p className={Styles["round-no"]}>Sample Quiz</p>
            <p className={Styles["round-name"]}>
              Question #{question.questionNo}
            </p>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>
          <Timer time={time} onTimeEnd={() => submitHandler(true)} />
        </div>
        <div className={Styles["content"]}>
          <p className={Styles["question-text"]}>{question.question}</p>
          {question.type === "mcq" ? (
            <OptionContainer
              selected={answer}
              setSelected={setAnswer}
              options={mcqOptions(question.options)}
            />
          ) : question.type === "mtf" ? (
            <MatchTheFollowing options={question.options} onChange={setAnswer} />
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
