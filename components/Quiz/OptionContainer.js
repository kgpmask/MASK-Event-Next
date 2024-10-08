import Styles from "@/styles/Quiz.module.css";
import Option from "./Option";

export default function OptionContainer({ options, selected, setSelected }) {
	const letters = ['A', 'B', 'C', 'D'];
	return (
		<div className={Styles["options"]} >
			{options.map((e, i) => <Option key={i} letter={letters[i]} text={e} selected={selected === i} onClick={() => setSelected(i)}/>)}
		</div >
	)
}
