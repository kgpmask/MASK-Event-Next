import handlerContext from "@/utils/handlerContext";
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
	const { questionNo, response } = req.body;
	console.log("REQ BODY:", req.body, handlerContext);
	if (response === '') return res.status(400).send("Empty Response");

	if (Number(process.env.QUES_NO) !== questionNo)
		return (
			console.log({
				serverQuestionNo: Number(process.env.QUES_NO),
				clientQuestionNo: questionNo,
			}) || res.status(400).send("Questions not in sync")
		);
	handlerContext.cachedRecords.push({
		quizId: handlerContext.quizId,
		userId: user._id,
		questionNo,
		response,
	});

	console.log(handlerContext.cachedRecords);

	return res.status(201).send("Response recorded");
};

export default submitAnswerHandler;
