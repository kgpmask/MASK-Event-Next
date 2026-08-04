const handlerContext = {
	quizStatus: 'started',
	quizId: process.env.QUIZ_ID,
	currentQuestion: process.env.QUES_NO,
	cachedRecords: [],
	lastQuestion: 0
};

module.exports = handlerContext;
