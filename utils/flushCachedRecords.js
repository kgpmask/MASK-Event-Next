const handlerContext = require("./handlerContext.js");
const Record = require("../database/models/Record.js");

const flushCachedRecords = async () => {
	const count = handlerContext.cachedRecords.length;
	if (!count) return 0;
	await Record.insertMany(handlerContext.cachedRecords);
	handlerContext.cachedRecords = [];
	return count;
};

module.exports = flushCachedRecords;
