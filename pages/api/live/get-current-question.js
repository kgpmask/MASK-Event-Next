import { quizState } from "@/utils/quizState";
import { dbInit } from "@/database/dbInit";
import { Question } from "@/database/models/Question";
import { Session } from "@/database/models/Session";
import { hasAnsweredQuestion } from "@/utils/hasAnsweredQuestion";
import { toClientQuestion } from "@/utils/clientPayloads";

/**
 * Returns the currently running question with its answer stripped out.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function getCurrentQuestionHandler(req, res) {
	if (!req.cookies.sessionId)
		return res
			.status(401)
			.send("You are not logged in. Please login to continue.");
	if (!quizState.isQuestionRunning) return res.status(204).end();

	await dbInit();
	const session = await Session.findById(req.cookies.sessionId).lean();
	if (!session)
		return res.status(401).send("Invalid session. Please login again.");

	const hasAnswered = await hasAnsweredQuestion({
		userId: session.userId,
		quizId: quizState.quizId,
		questionNo: quizState.currentQuestionNo,
	});
	if (hasAnswered) return res.status(200).json({ hasAnswered: true });

	const question = await Question.findOne({
		quizId: quizState.quizId,
		questionNo: quizState.currentQuestionNo,
	}).lean({ defaults: true });

	if (!question) return res.status(404).send("Current question not found");

	return res.status(200).json({
		hasAnswered: false,
		...toClientQuestion(question),
	});
}
