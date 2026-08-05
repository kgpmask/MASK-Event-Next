import { quizState } from "@/utils/quizState";

/**
 * Returns the number of the last question that was started.
 * @param {object} _req The incoming HTTP request (unused).
 * @param {object} res The outgoing HTTP response.
 * @returns {object} The HTTP response.
 */
export default async function getLastQuestionHandler(_req, res) {
	return res.status(200).json({
		lastQuestion: quizState.lastQuestionNo,
	});
}
