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
	if (!user)
		return res.status(401).send("Invalid session. Please login again.");

	const { questionNo, response } = req.body;
	if (response === "" || response == null)
		return res.status(400).send("Empty Response");

	if (
		!quizState.isQuestionRunning ||
		Number(quizState.currentQuestionNo) !== Number(questionNo)
	)
		return (
			console.log({
				serverQuestionNo: quizState.currentQuestionNo,
				clientQuestionNo: questionNo,
			}) || res.status(400).send("Questions not in sync")
		);

	if (
		quizState.cachedRecords.some(
			(e) =>
				e.userId === user._id && Number(e.questionNo) === Number(questionNo)
		)
	)
		return res.status(400).send("Already answered");

	const record = {
		quizId: quizState.quizId,
		userId: user._id,
		questionNo,
		response: Array.isArray(response) ? response.join(",") : response,
	};
	quizState.cachedRecords.push(record);

	return res.status(201).send("Response recorded");
};

export default submitAnswerHandler;
