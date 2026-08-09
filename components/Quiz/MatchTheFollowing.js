import { useState } from "react";
import Styles from "@/styles/Quiz.module.css";
import { mtfOptions } from "@/utils/questionOptions";

/**
 * MatchTheFollowing component that renders a match-the-following question with select dropdowns.
 * @param {object} props - The component props.
 * @param {string} props.options - Pipe-separated string of left and right items.
 * @param {function} props.onChange - Callback invoked with the updated selections.
 * @returns {JSX.Element} The match-the-following markup.
 */
export function MatchTheFollowing({ options, onChange }) {
	const [lefts = [], rights = []] = mtfOptions(options);
	const [selections, setSelections] = useState(lefts.map(() => -1));

	/**
	 * Updates the selection for a left item and notifies the parent.
	 * @param {number} leftIdx - Index of the left item being matched.
	 * @param {number} rightIdx - Index of the selected right item.
	 */
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
