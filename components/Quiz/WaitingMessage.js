import { useMemo, useState } from 'react';
import MessageCard from './MessageCard';

const WaitingMessage = () => {
	const [ellipse, setEllipse] = useState(1);

	useMemo(() => {
		setTimeout(() => setEllipse((ellipse % 3) + 1), 1000);
	}, [ellipse]);

	return (
		<MessageCard>
			<div>
				Waiting for the quizmaster{Array(ellipse).fill('.').join('')}
				{Array(3 - ellipse).fill('\u00A0').join('')}
			</div>
		</MessageCard>
	);
};

export default WaitingMessage;
