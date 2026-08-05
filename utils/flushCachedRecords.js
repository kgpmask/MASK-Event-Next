import { quizState } from "./quizState.js";
import { Record } from "../database/models/Record.js";

/**
 * Writes all cached records to the database and clears the cache.
 * The batch is claimed (removed from the cache) synchronously before the
 * async insert, so concurrent flushes can never insert the same response
 * twice. Duplicate responses within the batch are also skipped.
 * @returns {Promise<number>} The number of records flushed, or 0 if none.
 */
export const flushCachedRecords = async () => {
	const records = quizState.cachedRecords;
	if (!records.length) return 0;
	quizState.cachedRecords = [];

	const seen = new Set();
	const uniqueRecords = records.filter(({ quizId, userId, questionNo }) => {
		const key = `${quizId}:${userId}:${questionNo}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	try {
		await Record.insertMany(uniqueRecords);
	} catch (error) {
		quizState.cachedRecords = [...records, ...quizState.cachedRecords];
		throw error;
	}
	return uniqueRecords.length;
};
