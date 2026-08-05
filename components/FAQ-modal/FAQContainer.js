import { useState } from "react";
import { FAQ } from "./FAQ";
import Styles from "@/styles/FAQ.module.css";

/**
 * FAQContainer component that renders a list of collapsible FAQ items.
 * @param {object} props - The component props.
 * @param {Array<object>} props.FAQs - Array of FAQ objects with heading and description fields.
 * @returns {JSX.Element} The FAQ list markup.
 */
export function FAQContainer({ FAQs }) {
	const [expanded, setExpanded] = useState();

	/**
	 * Toggles the expanded state for the clicked FAQ index.
	 * @param {number} el - The index of the clicked FAQ item.
	 */
	const clickHandler = (el) => {
		if (expanded === el) setExpanded(null);
		else setExpanded(el);
	};

	return (
		<div className={Styles["FAQ"]}>
			{FAQs.map((value, i) => (
				<FAQ
					key={i}
					heading={value.heading}
					description={value.description}
					onClick={() => clickHandler(i)}
					expanded={expanded === i}
				/>
			))}
		</div>
	);
}
