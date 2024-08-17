import { useState, useEffect } from "react";
import DummyQuizContainer from "@/components/Quiz/DummyQuizContainer";

const dummyApiResponse = {
  questions: [
    {
      questionNo: 1,
      title: "Sample Round",
      question: "Who is the protagonist of 'Naruto'?",
      options: [
        "Sasuke Uchiha",
        "Naruto Uzumaki",
        "Sakura Haruno",
        "Kakashi Hatake",
      ],
      type: "mcq",
      answer: 1,
    },
    {
      questionNo: 2,
      title: "Sample Round",
      question:
        "In 'Attack on Titan', what is Eren Yeager's Titan form called?",
      options: [
        "Colossal Titan",
        "Armored Titan",
        "Attack Titan",
        "Beast Titan",
      ],
      type: "mcq",
      answer: 2,
    },
    {
      questionNo: 3,
      title: "Sample Round",
      question: "Which anime features the character 'Light Yagami'?",
      options: ["Death Note", "Bleach", "One Piece", "Tokyo Ghoul"],
      type: "mcq",
      answer: 0,
    },
    {
      questionNo: 4,
      title: "Sample Round",
      question: "In 'Dragon Ball Z', what is Goku's Saiyan name?",
      options: ["Vegeta", "Raditz", "Kakarot", "Nappa"],
      type: "mcq",
      answer: 2,
    },
    {
      questionNo: 5,
      title: "Sample Round",
      question: "Which anime involves 'Alchemy' as a central theme?",
      options: ["Naruto", "Fullmetal Alchemist", "One Punch Man", "Fairy Tail"],
      type: "mcq",
      answer: 1,
    },
  ],
};

export default function SampleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [time, setTime] = useState(15);

  useEffect(() => {
    if (currentQuestion >= dummyApiResponse.questions.length) {
      alert(
        `Quiz finished! Your score: ${score}/${
          dummyApiResponse.questions.length * 10
        }`
      );
      return;
    }

    const timerDuration =
      dummyApiResponse.questions[currentQuestion].type === "mcq" ? 15 : 25;
    setTime(timerDuration);

    const timer = setTimeout(() => {
      submitAnswer({ timeout: true });
    }, timerDuration * 1000);

    return () => clearTimeout(timer);
  }, [currentQuestion]);

  const submitAnswer = ({ timeout }) => {
    if (!timeout) {
      const correctAnswer = dummyApiResponse.questions[currentQuestion].answer;
      if (userAnswer === correctAnswer) {
        setScore((prevScore) => prevScore + 10);
      }
    }

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    setCurrentQuestion((prevIndex) => prevIndex + 1);
    setUserAnswer(null);
  };

  const updateAnswer = (answer) => {
    setUserAnswer(answer);
  };

  return (
    <>
      {currentQuestion < dummyApiResponse.questions.length ? (
        <DummyQuizContainer
          question={dummyApiResponse.questions[currentQuestion]}
          time={time}
          submitAnswer={submitAnswer}
          updateAnswer={updateAnswer}
        />
      ) : (
        <p>
          Quiz finished! Your score: {score}/
          {dummyApiResponse.questions.length * 10}
        </p>
      )}
    </>
  );
}
