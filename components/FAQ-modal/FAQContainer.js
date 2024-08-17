import { useState } from "react";
import FAQ from "./FAQ";
import Styles from '@/styles/FAQ.module.css'

export default function FAQContainer({ FAQs }) {
	const [expanded, setExpanded] = useState();

	const clickHandler = (el) => {
		if (expanded === el) setExpanded(null);
		else setExpanded(el);
	}

	return (
		<div className={Styles["FAQ"]}>
			{FAQs.map((value, i) => (
				<FAQ key={i} heading={value.heading} description={value.description} onClick={() => clickHandler(i)} expanded={expanded === i}/>
			))}
		</div>
	)
}