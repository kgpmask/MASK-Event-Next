import Styles from "@/styles/Quiz.module.css";
import Option from "./Option";

export default function OptionContainer({ options, selected, setSelected }) {
  return (
    <div className={Styles["options"]}>
      {options.map((e, i) => (
        <Option
          key={i}
          text={e}
          selected={selected === i}
          onClick={() => setSelected(i)}
          index={i}
        />
      ))}
    </div>
  );
}
