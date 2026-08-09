import { FAQContainer } from "./FAQContainer";
import FAQs from "./FAQs.json";
import Styles from "@/styles/FAQ.module.css";
import { useRouter } from "next/router";

/**
 * EventInfo component that renders event details, the FAQ list and contact information.
 * @returns {JSX.Element} The event info markup.
 */
export function EventInfo() {
	const router = useRouter();
	return (
		<div className={Styles["body-container"]}>
			<div className={Styles["Event_info"]}>
				<div className={Styles["Top_header"]}>
					<div>
						<h1>Event Information</h1>
						<p className={Styles["para"]}>
							Date/Time: 24th August, 2025, 12:30 PM
						</p>
						<p>Venue: Kalidas Auditorium</p>
					</div>
					<button onClick={() => router.push("/live")}>Quiz Portal</button>
				</div>

				<FAQContainer FAQs={FAQs} />

				<div className={Styles["contact-info"]}>
					<p>More Questions? Contact us:</p>
					<div>Binaya: 72059 26337</div>
					<div>Nayandeep: 81309 70929</div>
				</div>
			</div>
		</div>
	);
}
