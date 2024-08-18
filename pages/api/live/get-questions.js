import dbInit from "@/database/dbInit";
import Question from "@/database/models/Question";
import checkAdmin from "@/utils/checkAdmin";

const getQuestionsHandler = async (req, res) => {
	if (!(await checkAdmin(req.cookies.sessionId)))
		return res.status(403).send("You are NOT an admin. Go away immediately.");
	await dbInit();
	const questions = await Question.find({ quizId: process.env.QUIZ_ID })
		.lean()
		.sort({ questionNo: "asc" });
	return res.status(201).json(questions);
};

export default getQuestionsHandler;
