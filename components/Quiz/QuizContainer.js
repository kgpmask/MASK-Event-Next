import Styles from "@/styles/Quiz.module.css";
import { OptionContainer } from "./OptionContainer";
import { MultiOptionContainer } from "./MultiOptionContainer";
import { TextInput } from "./TextInput";
import { MatchTheFollowing } from "./MatchTheFollowing";
import { mcqOptions } from "@/utils/questionOptions";
import { useState, useEffect } from "react";
import { Timer } from "./Timer";
import { DifficultyBadge } from "./DifficultyBadge";

/**
 * QuizContainer component that renders a live quiz question with a timer and answer input.
 * @param {object} props - The component props.
 * @param {object} props.question - The question object containing type, text, options and difficulty.
 * @param {number} props.time - The time in seconds allotted for the question.
 * @param {function} props.submitAnswer - Callback invoked to submit the answer.
 * @param {function} props.updateAnswer - Callback invoked when the answer changes.
 * @returns {JSX.Element} The quiz question markup.
 */
export function QuizContainer({ question, time, submitAnswer, updateAnswer }) {
	const [answer, setAnswer] = useState(
		question.type === "multi-mcq" || question.type === "part-multi-mcq"
			? []
			: ""
	);
	const [disabled, setDisabled] = useState(false);

	/**
	 * Disables the submit button and dispatches the submitAnswer callback.
	 * @param {boolean} timeout - Whether the submission is due to a timeout.
	 * @returns {*} The result of the submitAnswer call.
	 */
	const submitHandler = (timeout) => {
		setDisabled(true);
		return submitAnswer({ timeout });
	};

	/**
	 * Checks whether the current answer is complete enough to be submitted.
	 * @returns {boolean} Whether the answer is non-empty for the question type.
	 */
	const canSubmit = () => {
		if (question.type === "mcq") return answer !== "";
		if (question.type === "multi-mcq" || question.type === "part-multi-mcq")
			return Array.isArray(answer) && answer.length > 0;
		if (question.type === "mtf" || question.type === "part-mtf")
			return Array.isArray(answer) && answer.some((idx) => idx !== -1);
		return typeof answer === "string" && answer.trim() !== "";
	};

	/**
	 * Notifies the parent whenever the answer changes.
	 * @param {string} answer - The current answer value.
	 * @param {function} updateAnswer - The parent's answer update callback.
	 */
	useEffect(() => {
		updateAnswer(answer);
	}, [answer, updateAnswer]);

	return (
		<div className={Styles["container"]}>
			<div className={Styles["card"]}>
				<div className={Styles["header"]}>
					<div className={Styles["info"]}>
						<p className={Styles["round-no"]}>
							{question.title.split(":")[0].trim()}
						</p>
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
					) : question.type === "mtf" || question.type === "part-mtf" ? (
						<MatchTheFollowing
							options={question.options}
							onChange={setAnswer}
						/>
					) : question.type === "multi-mcq" ||
					  question.type === "part-multi-mcq" ? (
						<MultiOptionContainer
							selected={answer}
							setSelected={setAnswer}
							options={mcqOptions(question.options)}
						/>
					) : (
						<TextInput text={answer} setText={setAnswer} />
					)}
				</div>
				<button
					className={
						!disabled && canSubmit()
							? Styles["submit-btn"]
							: Styles["submit-btn"] + " " + Styles["disabled"]
					}
					onClick={() => submitHandler(false)}
					disabled={disabled || !canSubmit()}
				>
					Submit
				</button>
			</div>
		</div>
	);
}
