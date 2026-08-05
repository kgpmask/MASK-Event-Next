import { useMemo, useState } from "react";
import Image from "next/image";
import { MessageCard } from "./MessageCard";
import styles from "@/styles/Quiz.module.css";

/**
 * WaitingMessage component that shows an animated waiting indicator while the quizmaster prepares.
 * @returns {JSX.Element} The waiting message markup.
 */
export const WaitingMessage = () => {
	const [ellipse, setEllipse] = useState(1);

	/**
	 * Cycles the animated ellipsis dots every second.
	 * @param {number} ellipse - The current number of dots displayed.
	 */
	useMemo(() => {
		setTimeout(() => setEllipse((ellipse % 3) + 1), 1000);
	}, [ellipse]);

	return (
		<MessageCard>
			<div className={styles["waiting-card"]}>
				<p>Waiting for the quizmaster</p>
				{Array(ellipse).fill(".").join("")}
				{Array(3 - ellipse)
					.fill("\u00A0")
					.join("")}
				<div className={styles["imgdiv"]}>
					<Image src="/waiting.gif" alt="Waiting..." />
				</div>
			</div>
		</MessageCard>
	);
};
