import quizState from "@/utils/quizState";
import dbInit from "@/database/dbInit";
import Question from "@/database/models/Question";

const getCurrentQuestionHandler = async (req, res) => {
	if (!req.cookies.sessionId)
		return res
			.status(401)
			.send("You are not logged in. Please login to continue.");
	if (!quizState.isQuestionRunning) return res.status(204).end();

	await dbInit();
	const question = await Question.findOne({
		quizId: quizState.quizId,
		questionNo: quizState.currentQuestionNo,
	}).lean({ defaults: true });

	if (!question) return res.status(404).send("Current question not found");

	const { answer, _id, __v, ...safeQuestion } = question;
	return res.status(200).json(safeQuestion);
};

export default getCurrentQuestionHandler;
