import MessageCard from './MessageCard';

const EndedNotStartedMessage = ({ isEarly }) => {
	return <MessageCard message={isEarly ? 'Quiz has not started yet' : 'Quiz has already ended'} />;
};

export default EndedNotStartedMessage;
