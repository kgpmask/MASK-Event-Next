import { quizState } from "@/utils/quizState";

/**
 * Pre-flights a question start and rejects it if a question is already running.
 * The actual question lifecycle is started by the admin socket "question" emit.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {object} The HTTP response.
 */
export default function startQuestionHandler(req, res) {
	if (quizState.isQuestionRunning) {
		return res
			.status(401)
			.send(
				`Question ${quizState.currentQuestionNo} is running. Wait for it to be done.`
			);
	}
	return res.status(200).send("Question updated");
}
