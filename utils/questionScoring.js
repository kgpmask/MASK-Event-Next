const QUESTION_SCORES = {
	easy: 10,
	medium: 15,
	hard: 20,
	insane: 25,
};

const NEGATIVE_MARKING = {
	easy: 0,
	medium: 0,
	hard: -10,
	insane: -10,
};

/**
 * Returns the base score for a question difficulty.
 * @param {string} [difficulty] The question difficulty, defaulting to "medium".
 * @returns {number} The score awarded for the question.
 */
export const questionScore = (difficulty = "medium") =>
	QUESTION_SCORES[difficulty] ?? QUESTION_SCORES.medium;

/**
 * Returns the points deducted for a wrong answer at the given difficulty.
 * @param {string} [difficulty] The question difficulty, defaulting to "medium".
 * @returns {number} The negative marking for the question.
 */
export const questionNegativeMarking = (difficulty = "medium") =>
	NEGATIVE_MARKING[difficulty] ?? 0;
