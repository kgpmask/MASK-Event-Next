import { quizState } from "./quizState.js";
import { Record } from "../database/models/Record.js";

/**
 * Writes all cached records to the database and clears the cache.
 * The batch is claimed (removed from the cache) synchronously before the
 * async insert, so concurrent flushes can never insert the same response
 * twice. Duplicate responses within the batch are also skipped, and records
 * that already exist in the database are rejected silently instead of being
 * re-queued or thrown.
 * @returns {Promise<number>} The number of records inserted, or 0 if none.
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
		const result = await Record.insertMany(uniqueRecords, { ordered: false });
		return result.length;
	} catch (error) {
		// Each write error's `index` is the position of the failing document in
		// the array passed to insertMany, so it maps directly onto
		// `uniqueRecords` regardless of the unique index's field names/order —
		// unlike reconstructing a key from `keyValue`, this can't silently
		// fail to match and leave duplicates stuck in the cache forever.
		const failuresByIndex = new Map(
			(error.writeErrors ?? []).map((writeError) => [
				writeError.index,
				writeError,
			])
		);
		// With `ordered: false`, non-conflicting records are still inserted even
		// when others fail. Re-queue only records that failed for reasons other
		// than already existing in the database; every record whose write
		// failed with a duplicate-key error (11000) is dropped silently.
		let insertedCount = 0;
		const requeue = [];
		uniqueRecords.forEach((record, index) => {
			const writeError = failuresByIndex.get(index);
			if (!writeError) {
				insertedCount++;
				return;
			}
			if (writeError.code !== 11000) {
				requeue.push(record);
			}
		});
		if (requeue.length) {
			quizState.cachedRecords = [...requeue, ...quizState.cachedRecords];
			throw error;
		}
		return insertedCount;
	}
};
