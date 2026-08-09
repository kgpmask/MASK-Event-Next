import { evaluateAnswer } from "./evaluateAnswer.js";

/**
 * Computes leaderboard rows from quiz records without persisting any results.
 * Question 0 is deliberately ignored because it is reserved for testing.
 * @param {object} input The records and reference data to evaluate.
 * @param {Array<object>} input.records Submitted quiz records.
 * @param {Array<object>} input.users Quiz users.
 * @param {Array<object>} input.questions Quiz questions.
 * @returns {Array<object>} Participant leaderboard rows.
 */
export const calculateLeaderboard = ({ records, users, questions }) => {
	const usersById = new Map(users.map((user) => [String(user._id), user]));
	const questionsByNo = new Map(
		questions.map((question) => [Number(question.questionNo), question])
	);
	const resultsByUser = new Map();
	const seenRecords = new Set();

	for (const { userId, questionNo, response } of records) {
		const recordKey = `${userId}:${questionNo}`;
		if (seenRecords.has(recordKey) || Number(questionNo) <= 0) continue;
		seenRecords.add(recordKey);
		const user = usersById.get(String(userId));
		const question = questionsByNo.get(Number(questionNo));
		if (!user || !question) continue;

		let result = resultsByUser.get(String(userId));
		if (!result) {
			result = {
				userId: String(userId),
				username: user.username,
				name: user.name,
				points: 0,
			};
			resultsByUser.set(String(userId), result);
		}
		result.points += evaluateAnswer(
			response,
			question.answer,
			question.type,
			question.difficulty
		);
	}

	return [...resultsByUser.values()];
};
