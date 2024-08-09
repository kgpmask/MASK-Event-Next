import Styles from '@/styles/Quiz.module.css';

const MessageCard = ({ message, children }) => {
	return (
		<>
			<div className={Styles['message-card']}>{message || children}</div>
		</>
	);
};

export default MessageCard;
