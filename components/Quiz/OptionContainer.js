import Styles from "@/styles/Quiz.module.css";
import { Option } from "./Option";

/**
 * OptionContainer component that renders a list of MCQ answer options.
 * @param {object} props - The component props.
 * @param {Array<string>} props.options - The list of option texts to display.
 * @param {number} props.selected - The index of the currently selected option.
 * @param {function} props.setSelected - Callback invoked with the selected option index.
 * @returns {JSX.Element} The options list markup.
 */
export function OptionContainer({ options, selected, setSelected }) {
	return (
		<div className={Styles["options"]}>
			{options.map((e, i) => (
				<Option
					key={i}
					letter={String.fromCharCode(65 + i)}
					text={e}
					selected={selected === i}
					onClick={() => setSelected(i)}
				/>
			))}
		</div>
	);
}
