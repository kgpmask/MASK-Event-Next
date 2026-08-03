const CLIENT_SECONDS = {
	mcq: 20,
	mtf: 40,
	text: 30,
};

const questionTime = (type) => CLIENT_SECONDS[type] || 30;

export const serverQuestionTime = (type) => questionTime(type) + 5;

export default questionTime;
