import { MessageCard } from "./MessageCard";

/**
 * EndedNotStartedMessage component that shows whether the quiz has ended or not yet started.
 * @param {object} props - The component props.
 * @param {boolean} props.isEarly - True if the quiz has not started yet, false if it has ended.
 * @returns {JSX.Element} The message card markup.
 */
export const EndedNotStartedMessage = ({ isEarly }) => {
	return (
		<MessageCard
			message={isEarly ? "Quiz has not started yet" : "Quiz has already ended"}
		/>
	);
};
