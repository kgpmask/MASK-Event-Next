import { MessageCard } from "./MessageCard";

/**
 * SubmitMessage component that confirms a quiz answer was submitted successfully.
 * @returns {JSX.Element} The message card markup.
 */
export const SubmitMessage = () => {
	return (
		<MessageCard message={"Your answer has been submitted successfully!"} />
	);
};
