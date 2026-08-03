const CLIENT_SECONDS = {
	mcq: 20,
	mtf: 40,
	text: 30,
};

const HARD_BONUS = {
	easy: 0,
	medium: 0,
	hard: 10,
	insane: 20,
};

const questionTime = (type, difficulty = "medium") => {
	const base = CLIENT_SECONDS[type] || 30;
	return base + (HARD_BONUS[difficulty] || 0);
};

export const serverQuestionTime = (type, difficulty = "medium") =>
	questionTime(type, difficulty) + 5;

export default questionTime;
