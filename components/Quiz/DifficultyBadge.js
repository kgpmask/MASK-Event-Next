import Styles from "@/styles/DifficultyBadge.module.css";

const difficultyLabels = {
	easy: "Easy",
	medium: "Medium",
	hard: "Hard",
	insane: "Insane",
};

export default function DifficultyBadge({ difficulty = "medium" }) {
	const label = difficultyLabels[difficulty] || "Medium";
	const key = difficultyLabels[difficulty] ? difficulty : "medium";

	return (
		<span className={`${Styles["difficulty-badge"]} ${Styles[key]}`}>
			{label}
		</span>
	);
}
