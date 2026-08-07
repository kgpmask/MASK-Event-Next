import Head from "next/head";
import { TextArea } from "@/components/Base/TextArea";
import styles from "@/styles/Instructions.module.css";

/**
 * LiveInstructions component that renders the instructions page for the live quiz.
 * @returns {JSX.Element} The instructions markup.
 */
export function LiveInstructions() {
	return (
		<>
			<Head>
				<title>OCAQ-Instructions</title>
			</Head>
			<TextArea title="Instructions">
				<div className={styles["instructions"]}>
					<h3>Website Instructions</h3>
					<div className={styles["hr"]} />
					<ul>
						<li>
							<p>
								For a bug-less experience, please do not refresh or go back
								during the quiz. This might lead to a loss of progress and
								glitches in the quiz.
							</p>
						</li>
						<li>
							<p>
								Please ensure that you have a stable internet connection during
								the quiz. If the internet connection is lost, you&apos;ll be
								forced to reload, which is undesirable.
							</p>
						</li>
						<li>
							<p>
								There are various types of questions: MCQs, text-based, match the
								following, etc. Only the answer part will be displayed on the
								website.
							</p>
						</li>
						<li>
							<p>
								It’s advised not to rely on the auto-submit feature of MCQs and
								to use the submit button.
							</p>
						</li>
						<li>
							<p>
								The progress is saved after each question, so do not panic if the
								page refreshes.
							</p>
						</li>
					</ul>
					<br />

					<h3>Quiz instructions:</h3>
					<div className={styles["hr"]} />
					<ul>
						<li>
							<p>
								The quiz consists of four rounds — easy, medium, hard, and insane
								— designating the level of difficulty.
							</p>
						</li>
						<li>
							<p>
								The rounds have 15, 15, 12, and 10 questions respectively.
							</p>
						</li>
						<li>
							<p>
								Every correct answer is worth 10, 15, 20, and 30 points
								respectively.
							</p>
						</li>
						<li>
							<p>
								In the text-based questions, 10% errors are tolerable. If your
								answer has an error of 20% or less, you will get full marks; for
								errors of 30% or less, there will be partial marks. Any more
								errors will not be tolerated.
							</p>
						</li>
						<li>
							<p>
								Questions will be displayed on the PPT, and you must answer them
								on your laptop/phone.
							</p>
						</li>
						<li>
							<p>
								Only the options (if any) or text box will be displayed on your
								laptop/phone. The full question will not be shown in the quiz
								interface; it can only be seen in this PPT.
							</p>
						</li>
						<li>
							<p>
								After the anchors have read the questions and the answer options
								(if any), you will be given a fixed time to answer the questions.
								Time allotted per question is dynamic and depends on the difficulty
								level and question type. Kindly note the timer at the start of every
								question.
							</p>
						</li>
						<li>
							<p>
								Both Japanese and English names of shows will be valid. Eg. My
								Hero Academia and Boku no Hero Academia are both valid answers.
							</p>
						</li>
						<li>
							<p>
								Popular short names of shows will also be valid. Eg. MHA or BNHA
								is accepted as the answer.
							</p>
						</li>
						<li>
							<p>
								If you face any difficulty with the interface or anything else,
								kindly raise your hand and the nearest coordinator will reach you
								to resolve your issue.
							</p>
						</li>
						<li>
							<p>
								<b>DO NOT</b> use the Gemini shortcut or open other tabs, as it
								might force the website to give a penalty of -400 points.
							</p>
						</li>
					</ul>
				</div>
			</TextArea>
		</>
	);
}
