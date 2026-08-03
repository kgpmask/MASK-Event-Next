import { useState } from "react";
import Styles from "@/styles/Quiz.module.css";
import { mtfOptions } from "@/utils/questionOptions";

export default function MatchTheFollowing({ options, onChange }) {
	const [lefts = [], rights = []] = mtfOptions(options);
	const [selections, setSelections] = useState(lefts.map(() => -1));

	const handleSelect = (leftIdx, rightIdx) => {
		const next = selections.map((val, i) => {
			if (i === leftIdx) return rightIdx;
			return val === rightIdx ? -1 : val;
		});
		setSelections(next);
		onChange(next);
	};

	return (
		<div className={Styles["mtf"]}>
			{lefts.map((left, i) => (
				<div key={i} className={Styles["mtf-row"]}>
					<span className={Styles["mtf-left"]}>{left}</span>
					<select
						className={Styles["mtf-select"]}
						value={selections[i]}
						onChange={(e) => handleSelect(i, ~~e.target.value)}
					>
						<option value={-1}>Select</option>
						{rights.map((right, j) => (
							<option key={j} value={j}>
								{right}
							</option>
						))}
					</select>
				</div>
			))}
		</div>
	);
}
