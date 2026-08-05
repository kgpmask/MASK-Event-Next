import Styles from "@/styles/Quiz.module.css";

/**
 * MessageCard component that renders a styled card with a message or children content.
 * @param {object} props - The component props.
 * @param {string} props.message - The message text to display.
 * @param {JSX.Element} props.children - Optional content rendered instead of the message.
 * @returns {JSX.Element} The message card markup.
 */
export const MessageCard = ({ message, children }) => {
	return (
		<>
			<div className={Styles["message-card"]}>{message || children}</div>
		</>
	);
};
