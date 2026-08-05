import handlerContext from "./handlerContext.js";
import Record from "../database/models/Record.js";

const flushCachedRecords = async () => {
	const count = handlerContext.cachedRecords.length;
	if (!count) return 0;
	await Record.insertMany(handlerContext.cachedRecords);
	handlerContext.cachedRecords = [];
	return count;
};

export default flushCachedRecords;
