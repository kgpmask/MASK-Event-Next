import Styles from "@/styles/Quiz.module.css";
import { useState, useEffect, useRef } from "react";

/**
 * Timer component that counts down from a given time and triggers a callback on expiry.
 * @param {object} props - The component props.
 * @param {number} props.time - The initial time in seconds to count down from.
 * @param {function} props.onTimeEnd - Callback invoked when the timer reaches zero.
 * @returns {JSX.Element} The timer markup.
 */
export function Timer({ time, onTimeEnd }) {
	const [timeLeft, setTimeLeft] = useState(time);
	const hasEnded = useRef(false);

	useEffect(() => {
		hasEnded.current = false;
		setTimeLeft(Math.max(0, time));
	}, [time]);

	useEffect(() => {
		if (timeLeft <= 0) {
			if (!hasEnded.current) {
				hasEnded.current = true;
				onTimeEnd?.();
			}
			return;
		}

		const timer = setTimeout(() => setTimeLeft((current) => current - 1), 1_000);
		return () => clearTimeout(timer);
	}, [timeLeft, onTimeEnd]);

	return (
		<div className={Styles["timer"]}>
			<p className={Styles["timer-text"]}>Time Left:</p>
			<p className={Styles["timer-time"]}>
				00:{timeLeft < 10 && "0"}
				{timeLeft}
			</p>
		</div>
	);
}
