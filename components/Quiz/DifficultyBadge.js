import Styles from "@/styles/DifficultyBadge.module.css";

const difficultyLabels = {
	easy: "Easy",
	medium: "Medium",
	hard: "Hard",
	insane: "Insane",
};

/**
 * DifficultyBadge component that renders a colored badge for a question's difficulty level.
 * @param {object} props - The component props.
 * @param {string} props.difficulty - The difficulty level (easy, medium, hard or insane).
 * @returns {JSX.Element} The badge markup.
 */
export function DifficultyBadge({ difficulty = "medium" }) {
	const label = difficultyLabels[difficulty] || "Medium";
	const key = difficultyLabels[difficulty] ? difficulty : "medium";

	return (
		<span className={`${Styles["difficulty-badge"]} ${Styles[key]}`}>
			{label}
		</span>
	);
}
