import Head from "next/head";
import Link from "next/link";
import TextArea from "@/components/Base/TextArea";
import styles from "@/styles/Instructions.module.css";

export default function Instructions({ buttonCallback }) {
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
                There are two types of questions: MCQs and text-based. Only the
                answer part will be displayed on the website for main quiz.
              </p>
            </li>
            <li>
              <p>
                It&apos;s advised not to rely on the auto-submit feature of MCQs and to use the submit button.
              </p>
            </li>
          </ul>
          <br />

          <h3>Quiz instructions:</h3>
          <div className={styles["hr"]} />
          <ul>
            <li>
              <p>
                The sample quiz consists of 5 questions.
              </p>
            </li>
            <li>
              <p>
                Each question is worth 200 points.
              </p>
            </li>
            <li>
              <p>
                In the text-based questions, one-letter mistakes are tolerable. If you have 2 letters wrong, you will get 150 marks. And for 3 errors, there will be 100 marks. Any more errors will not be tolerated.
              </p>
            </li>
            <li>
              <p>
                For the main quiz, the questions will be on PPT. For this quiz however the questions are given with question.
              </p>
            </li>
            <li>
              <p>
                The time limits for the questions are as follows
              </p>
              <ol type="a">
                <li>
                  <p>MCQ-based questions: 25 seconds.</p>
                </li>
                <li>
                  <p>Text-based questions: 45 seconds.</p>
                </li>
              </ol>
            </li>
            <li>
              <p>
                Both Japanese and English names of shows will be valid. Eg. My Hero Academia and Boku no Hero Academia are both valid answers.
              </p>
            </li>
            <li>
              <p>
                Popular short names of shows will also be valid. Eg. MHA or BNHA is accepted as the answer.
              </p>
            </li>
          </ul>
        </div>
        <button className={styles["submit-btn"]} onClick={buttonCallback}>
          Start Quiz
        </button>
      </TextArea>
    </>
  );
}
