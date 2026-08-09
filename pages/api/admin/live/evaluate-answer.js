import { quizState } from "@/utils/quizState";
import { cachedResults } from "@/utils/cachedResults";
import { calculateLeaderboard } from "@/utils/calculateLeaderboard";
import { dbInit } from "@/database/dbInit";
import { Question } from "@/database/models/Question";
import { Record } from "@/database/models/Record";
import { Result } from "@/database/models/Result";
import { User } from "@/database/models/User";
import { flushCachedRecords } from "@/utils/flushCachedRecords";

let answerEvaluationLock = false;

/**
 * Evaluates all recorded answers, writes results, and caches the leaderboard.
 * @param {object} _req The incoming HTTP request (unused).
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function evaluateAnswerHandler(_req, res) {
	if (answerEvaluationLock)
		return res.status(201).send("Evaluation successful!");
	answerEvaluationLock = true;

	try {
		const quizId = quizState.quizId;
		await dbInit();
		await flushCachedRecords();
		const users = await User.find().lean();
		const questions = await Question.find({ quizId })
			.lean({ defaults: true })
			.sort({ questionNo: "asc" });
		const records = await Record.find({ quizId }).lean();

		const results = calculateLeaderboard({ records, users, questions });

		cachedResults.results = results;
		await Promise.all(
			results.map(async ({ userId, points }) => {
				const result =
					(await Result.findOne({ userId, quizId })) ||
					new Result({ userId, quizId });
				result.score = points;
				return await result.save();
			})
		);

		return res.status(201).send("Evaluation successful!");
	} catch (error) {
		console.error("Error evaluating answers:", error);
		return res.status(500).send("Evaluation failed. Please try again.");
	} finally {
		answerEvaluationLock = false;
	}
}
