import { quizState } from "@/utils/quizState";
import { dbInit } from "@/database/dbInit";
import { User } from "@/database/models/User";
import { Session } from "@/database/models/Session";

/**
 * Records a submitted answer for the running question into the cached records.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function submitAnswerHandler(req, res) {
	try {
		if (!req.cookies.sessionId)
			return res
				.status(401)
				.send("You are not logged in. Please login to continue.");

		await dbInit();
		const session = await Session.findById(req.cookies.sessionId);
		if (!session)
			return res.status(401).send("Invalid session. Please login again.");

		const user = await User.findById(session.userId);
		if (!user)
			return res.status(401).send("Invalid session. Please login again.");

		const { questionNo, response } = req.body;
		if (response === "" || response == null)
			return res.status(400).send("Empty Response");

		if (
			!quizState.isQuestionRunning ||
			Number(quizState.currentQuestionNo) !== Number(questionNo)
		)
			return res.status(400).send("Questions not in sync");

		if (
			quizState.cachedRecords.some(
				(e) =>
					e.userId === user._id && Number(e.questionNo) === Number(questionNo)
			)
		)
			return res.status(400).send("Already answered");

		const record = {
			quizId: quizState.quizId,
			userId: user._id,
			questionNo,
			response: Array.isArray(response) ? response.join(",") : response,
		};
		quizState.cachedRecords.push(record);

		return res.status(201).send("Response recorded");
	} catch (error) {
		console.error("Error recording answer:", error);
		return res.status(500).send("Internal Server Error");
	}
}
