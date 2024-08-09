const handlerContext = {
	quizStatus: 'started',
	quizId: process.env.QUIZ_ID,
	currentQuestion: null,
	cachedRecords: []
};

export default handlerContext;