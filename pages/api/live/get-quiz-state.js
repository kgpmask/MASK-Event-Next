import quizState from "@/utils/quizState";

const getQuizStateHandler = async (_req, res) => {
	return res.status(200).json(quizState.toClient());
};

export default getQuizStateHandler;
