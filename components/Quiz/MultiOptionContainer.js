import Styles from "@/styles/Quiz.module.css";
import { Option } from "./Option";

/**
 * MultiOptionContainer component that renders a multi-select MCQ option list.
 * @param {object} props - The component props.
 * @param {Array<string>} props.options - The list of option texts to display.
 * @param {number[]} props.selected - The indices of the currently selected options.
 * @param {function} props.setSelected - Callback invoked with the updated indices.
 * @returns {JSX.Element} The multi-select options list markup.
 */
export function MultiOptionContainer({ options, selected, setSelected }) {
	const letters = ["A", "B", "C", "D"];

	/**
	 * Toggles an option's selection state and notifies the parent.
	 * @param {number} index - The option index being toggled.
	 */
	const toggle = (index) =>
		setSelected(
			selected.includes(index)
				? selected.filter((idx) => idx !== index)
				: [...selected, index]
		);

	return (
		<div className={Styles["options"]}>
			{options.map((option, i) => (
				<Option
					key={i}
					letter={letters[i]}
					text={option}
					selected={selected.includes(i)}
					onClick={() => toggle(i)}
				/>
			))}
		</div>
	);
}
