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
								Please ensure that you have a stable internet connection during
								the quiz.
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
								The quiz consists of four rounds, each more difficult than the
								previous and hence more rewarding.
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
								In the text-based answers, both Japanese and English names of shows
								will be valid. Eg. My Hero Academia, Boku no Hero Academia, MHA
								and BNHA are all valid answers.
							</p>
						</li>
						<li>
							<p>
								Also note that minor spelling mistakes may lead to partial marks.
							</p>
						</li>
						<li>
							<p>
								If you face any difficulty with the interface or any other thing,
								kindly raise your hand and the nearest coordinator will reach you
								to resolve your issue.
							</p>
						</li>
						<li>
							<p>
								<b>DO NOT</b> open other tabs as it might force the website to log
								you out.
							</p>
						</li>
					</ul>
				</div>
			</TextArea>
		</>
	);
}
