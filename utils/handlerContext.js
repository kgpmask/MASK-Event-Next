const handlerContext = {
	quizStatus: 'started',
	quizId: process.env.QUIZ_ID,
	currentQuestion: '',
	cachedRecords: []
};

export default handlerContext;