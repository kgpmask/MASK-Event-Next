import { quizState } from "@/utils/quizState";

/**
 * Returns a client-safe snapshot of the current quiz state.
 * @param {object} _req The incoming HTTP request (unused).
 * @param {object} res The outgoing HTTP response.
 * @returns {object} The HTTP response.
 */
export default async function getQuizStateHandler(_req, res) {
	return res.status(200).json(quizState.toClient());
}
