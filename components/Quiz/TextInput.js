import Styles from "@/styles/Quiz.module.css";

/**
 * TextInput component that renders a text input for a text-based quiz answer.
 * @param {object} props - The component props.
 * @param {string} props.text - The current answer value.
 * @param {function} props.setText - Callback invoked with the new answer value.
 * @returns {JSX.Element} The text input markup.
 */
export function TextInput({ text, setText }) {
	return (
		<input
			className={Styles["text-input"]}
			type="text"
			placeholder="Type you answer here..."
			value={text}
			onChange={(e) => setText(e.target.value)}
		/>
	);
}
