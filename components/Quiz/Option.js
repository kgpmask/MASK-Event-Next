import Styles from "@/styles/Quiz.module.css";

/**
 * Option component that renders a selectable answer option button.
 * @param {object} props - The component props.
 * @param {string} props.text - The option text to display.
 * @param {boolean} props.selected - Whether the option is currently selected.
 * @param {string} props.letter - The option letter label (A, B, C or D).
 * @param {function} props.onClick - Callback invoked when the option is clicked.
 * @returns {JSX.Element} The option button markup.
 */
export function Option({ text, selected, letter, onClick }) {
	return (
		<button
			onClick={onClick}
			className={
				selected
					? Styles["option-button"] + " " + Styles["selected"]
					: Styles["option-button"]
			}
		>
			<span className={Styles["option-numbering"]}>{letter}</span>
			{text}
		</button>
	);
}
