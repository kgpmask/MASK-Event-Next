import { MessageCard } from "./MessageCard";

/**
 * TimeoverMessage component that notifies the user that the time for the question has elapsed.
 * @returns {JSX.Element} The message card markup.
 */
export const TimeoverMessage = () => {
	return <MessageCard message="Womp Womp, Time is Over!" />;
};
