import { Record } from "../database/models/Record.js";
import { quizState } from "./quizState.js";

/**
 * Determines whether a participant has already submitted a response for a
 * question. Responses remain in memory until the question closes, then are
 * persisted, so both locations must be checked.
 * @param {object} params The response identity to look up.
 * @param {string} params.userId The participant ID.
 * @param {string} params.quizId The quiz ID.
 * @param {number} params.questionNo The database question number.
 * @returns {Promise<boolean>} Whether the participant has already answered.
 */
export const hasAnsweredQuestion = async ({ userId, quizId, questionNo }) => {
	const hasCachedAnswer = quizState.cachedRecords.some(
		(record) =>
			String(record.userId) === String(userId) &&
			String(record.quizId) === String(quizId) &&
			Number(record.questionNo) === Number(questionNo)
	);
	if (hasCachedAnswer) return true;

	return Boolean(
		await Record.exists({
			userId: String(userId),
			quizId: String(quizId),
			questionNo: Number(questionNo),
		})
	);
};
