import Styles from "@/styles/Quiz.module.css";

export default function Option({ text, selected, onClick, index }) {
  const optionLetter = String.fromCharCode(65 + index);
  return (
    <button
      onClick={onClick}
      className={
        selected
          ? Styles["option-button"] + " " + Styles["selected"]
          : Styles["option-button"]
      }
    >
      <span className={Styles["option-numbering"]}>{optionLetter}</span>
      {text}
    </button>
  );
}
