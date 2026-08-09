import { quizState } from "@/utils/quizState";
import { calculateLeaderboard } from "@/utils/calculateLeaderboard";
import { dbInit } from "@/database/dbInit";
import { Question } from "@/database/models/Question";
import { Record } from "@/database/models/Record";
import { User } from "@/database/models/User";

/**
 * Returns an admin-only in-progress leaderboard without writing Result rows.
 * Cached responses are included so the preview immediately reflects answers
 * submitted for the currently running question.
 */
export default async function previewResultsHandler(_req, res) {
	try {
		await dbInit();
		const quizId = quizState.quizId;
		const [users, questions, storedRecords] = await Promise.all([
			User.find().lean(),
			Question.find({ quizId }).lean({ defaults: true }),
			Record.find({ quizId }).lean(),
		]);
		const cachedRecords = quizState.cachedRecords.filter(
			(record) => record.quizId === quizId
		);
		return res
			.status(200)
			.json(
				calculateLeaderboard({
					records: [...storedRecords, ...cachedRecords],
					users,
					questions,
				})
			);
	} catch (error) {
		console.error("Error calculating live leaderboard:", error);
		return res.status(500).send("Unable to calculate live leaderboard");
	}
}
