import quizState from "@/utils/quizState";

const getQuizStateHandler = async (req, res) => {
	return res.status(200).json(quizState.toClient());
};

export default getQuizStateHandler;
