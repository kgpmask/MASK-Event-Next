import Styles from '@/styles/Quiz.module.css'
import { useState, useMemo } from 'react';

export default function Timer({ time, onTimeEnd }) {
	const [timeLeft, setTimeLeft] = useState(time);

	useMemo(() => setTimeout(() => setTimeLeft((timeLeft || 1) - 1), 1_000), [timeLeft]);

	return (
		<div className={Styles["timer"]}>
			<p className={Styles["timer-text"]}>Time Left:</p>
			<p className={Styles["timer-time"]}>00:{timeLeft < 10 && '0'}{timeLeft}</p>
		</div>
	)
}
