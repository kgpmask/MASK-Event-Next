import handlerContext from "@/utils/handlerContext";
import checkAdmin from "@/utils/checkAdmin";
import flushCachedRecords from "@/utils/flushCachedRecords";
import { serverQuestionTime } from "@/utils/questionTiming";

const startQuestionHandler = async (req, res) => {
	if (!(await checkAdmin(req.cookies.sessionId)))
		return res.status(403).send("You are NOT an admin. Go away immediately.");
	if (process.env.QUES_NO !== undefined && process.env.QUES_NO !== null && process.env.QUES_NO !== 'null'){
		return res
			.status(401)
			.send(
				`Question ${handlerContext.currentQuestion} is running. Wait for it to be done.`
			);
	}
	process.env.QUES_NO = ~~req.body.questionNo;
	handlerContext.lastQuestion = req.body.questionNo;
	setTimeout(
		() => {
			console.log("BEFORE CLEAR:", handlerContext)
			process.env.QUES_NO = 'null';
			flushCachedRecords();
		},
		serverQuestionTime(req.body.type, req.body.difficulty) * 1000
	);

	return res.status(200).send("Question updated");
};

export default startQuestionHandler;
