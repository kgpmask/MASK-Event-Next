import { quizState } from "@/utils/quizState";
import { flushCachedRecords } from "@/utils/flushCachedRecords";

/**
 * Starts the given question and schedules a flush when its duration elapses.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function startQuestionHandler(req, res) {
	if (quizState.isQuestionRunning) {
		return res
			.status(401)
			.send(
				`Question ${quizState.currentQuestionNo} is running. Wait for it to be done.`
			);
	}
	const { questionNo, type, difficulty } = req.body;
	quizState.startQuestion({ questionNo, type, difficulty });
	quizState.scheduleFlush(() => {
		quizState.endQuestion();
		flushCachedRecords();
	});

	return res.status(200).send("Question updated");
}
