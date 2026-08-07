import { dbInit } from "@/database/dbInit";
import { Question } from "@/database/models/Question";
import { toClientQuestion } from "@/utils/clientPayloads";

/**
 * Returns all questions for the current quiz ordered by question number.
 * @param {object} _req The incoming HTTP request (unused).
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function getQuestionsHandler(_req, res) {
	await dbInit();
	const questions = await Question.find({ quizId: process.env.QUIZ_ID })
		.select("questionNo title question type options difficulty")
		.lean({ defaults: true })
		.sort({ questionNo: "asc" });
	return res.status(201).json(questions.map(toClientQuestion));
}
