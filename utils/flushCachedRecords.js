import { quizState } from "./quizState.js";
import { Record } from "../database/models/Record.js";

/**
 * Writes all cached records to the database and clears the cache.
 * @returns {Promise<number>} The number of records flushed, or 0 if none.
 */
export const flushCachedRecords = async () => {
	const count = quizState.cachedRecords.length;
	if (!count) return 0;
	await Record.insertMany(quizState.cachedRecords);
	quizState.cachedRecords = [];
	return count;
};
