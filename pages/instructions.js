import Head from "next/head";
import Link from "next/link";
import TextArea from "@/components/Base/TextArea";
import styles from "@/styles/Instructions.module.css"

export default function Instructions(){
    return (
        <>
            <Head>
                <title>OCAQ-Instructions</title>
            </Head>
            <TextArea title="Instructions">
                <div className={styles["instructions"]}>
                <h3>Website Instructions</h3>
                <ol>
                    <li><p>For a bug-less experience, please do not refresh or go back during the quiz. This might lead to a loss of progress and glitches in the quiz.</p></li>
                    <li><p>Please ensure that you have a stable internet connection during the quiz. If the internet connection is lost, you'll be forced to reload, which is undesirable.</p></li>
                    <li><p>There are two types of questions: MCQs and text-based. Only the answer part will be displayed on the website.</p></li>
                    <li><p>Each question is scored out of 100 points, except for the last round.</p></li>
                </ol>
                <br />

                <h3>Quiz instructions:</h3>
                <ol>
                    <li><p>The quiz consists of five rounds.</p></li>
                    <li><p>Each round has a specific theme, which will be revealed at the start of each round.</p></li>
                    <li><p>Each round, except the last, has 10 questions, and each question is worth 100 points.</p></li>
                    <li><p>The fifth round will consist of only 5 questions, but each is worth twice as many points due to increased difficulty.</p></li>
                    <li><p>Questions will be displayed on the PPT, and you must answer them on your laptop/phone.</p></li>
                    <li><p>Only the options (if any) or text box will be displayed on your laptop/phone. The question will not be shown in the quiz interface, it can only be seen on this PPT.</p></li>
                    <li>
                        <p>After the anchors have read the questions and the answer options (if any), you will be given a <b>fixed time</b> to answer the questions.</p>
                        <ol type='a'>
                            <li><p>MCQ-based questions: 30 seconds.</p></li>
                            <li><p>Text-based questions: 60 seconds.</p></li>
                        </ol>
                    </li>
                    <li><p>In text-based, there will be partial marking for typing errors. As the given answer deviates from the actual answer, lesser points will be given.</p></li>
                    <li><p>Both Japanese and English names of shows will be valid. Eg. My Hero Academia and Boku no Hero Academia are both valid answers.</p></li>
                    <li><p>Popular short names of shows will also be valid. Eg. MHA or BNHA is accepted as the answer</p></li>
                </ol>
                </div>
            </TextArea>

            {/* Add go back button outside instructions.*/}
        </>
    )
}