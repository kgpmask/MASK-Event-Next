import { cachedResults } from "@/utils/cachedResults";
import { dbInit } from "@/database/dbInit";
import { Record } from "@/database/models/Record";
import { Result } from "@/database/models/Result";
import { quizState } from "@/utils/quizState";

/**
 * Deletes this quiz's saved responses and results while the quiz is idle.
 * The client then broadcasts the reset over the authenticated admin socket so
 * connected participants immediately return to the pre-quiz screen.
 *
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function resetQuizHandler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	if (quizState.quizStatus !== "idle") {
		return res.status(409).json({
			message: "The quiz can only be reset before it starts or after it ends.",
		});
	}

	try {
		const quizId = quizState.quizId;
		await dbInit();
		await Promise.all([
			Record.deleteMany({ quizId }),
			Result.deleteMany({ quizId }),
		]);
		// Reset all live quiz lifecycle fields (status, question, timers,
		// navigation, and respondent tracking). Users, questions, and sessions
		// are separate collections and are intentionally left untouched.
		quizState.resetForNextQuiz();
		quizState.cachedRecords = [];
		cachedResults.results = [];

		return res.status(200).json({ message: "Quiz responses and results reset" });
	} catch (error) {
		console.error("Error resetting quiz:", error);
		return res.status(500).json({ message: "Unable to reset quiz" });
	}
}
