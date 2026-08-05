import dbInit from "@/database/dbInit";
import Question from "@/database/models/Question";

const getQuestionsHandler = async (req, res) => {
	await dbInit();
	const questions = await Question.find({ quizId: process.env.QUIZ_ID })
		.lean({ defaults: true })
		.sort({ questionNo: "asc" });
	return res.status(201).json(questions);
};

export default getQuestionsHandler;
