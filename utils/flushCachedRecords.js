import quizState from "./quizState.js";
import Record from "../database/models/Record.js";

const flushCachedRecords = async () => {
	const count = quizState.cachedRecords.length;
	if (!count) return 0;
	await Record.insertMany(quizState.cachedRecords);
	quizState.cachedRecords = [];
	return count;
};

export default flushCachedRecords;
