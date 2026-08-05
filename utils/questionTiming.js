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

/**
 * Computes the base duration in seconds for a question type and difficulty.
 * @param {string} type The question type ("text", "mcq", or "mtf").
 * @param {string} [difficulty] The question difficulty, defaulting to "medium".
 * @returns {number} The duration in seconds.
 */
export const questionTime = (type, difficulty = "medium") => {
	const base = CLIENT_SECONDS[type] || 30;
	return base + (HARD_BONUS[difficulty] || 0);
};

/**
 * Computes the server-side duration in seconds, adding a grace buffer.
 * @param {string} type The question type ("text", "mcq", or "mtf").
 * @param {string} [difficulty] The question difficulty, defaulting to "medium".
 * @returns {number} The server duration in seconds.
 */
export const serverQuestionTime = (type, difficulty = "medium") =>
	questionTime(type, difficulty) + 5;
