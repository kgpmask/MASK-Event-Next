import quizState from "@/utils/quizState";

const getLastQuestionHandler = async (_req, res) => {
	return res.status(200).json({
		lastQuestion: quizState.lastQuestionNo,
	});
};

export default getLastQuestionHandler;
