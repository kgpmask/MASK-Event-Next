import quizState from "@/utils/quizState";
import dbInit from "@/database/dbInit";
import User from "@/database/models/User";
import Session from "@/database/models/Session";

const submitAnswerHandler = async (req, res) => {
	if (!req.cookies.sessionId)
		return res
			.status(401)
			.send("You are not logged in. Please login to continue.");

	await dbInit();
	const user = await User.findById(
		(await Session.findById(req.cookies.sessionId))?.userId
	);
	const obj = quizState.cachedRecords.filter(e => e.userId === user._id && e.questionNo === '0');
	if(obj.length) return res.status(400).send();

	const { questionNo, response } = req.body;
	if (response === '') return res.status(400).send("Empty Response");

	if (!quizState.isQuestionRunning || Number(quizState.currentQuestionNo) !== questionNo)
		return (
			console.log({
				serverQuestionNo: quizState.currentQuestionNo,
				clientQuestionNo: questionNo,
			}) || res.status(400).send("Questions not in sync")
		);
	const record = {
		quizId: quizState.quizId,
		userId: user._id,
		questionNo,
		response,
	}
	quizState.cachedRecords.push(record);

	return res.status(201).send("Response recorded");
};

export default submitAnswerHandler;
