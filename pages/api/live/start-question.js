import handlerContext from "@/utils/handlerContext";
import Record from "@/database/models/Record";
import checkAdmin from "@/utils/checkAdmin";

const startQuestionHandler = async (req, res) => {
	if (!(await checkAdmin(req.cookies.sessionId)))
		return res.status(403).send("You are NOT an admin. Go away immediately.");
	if (process.env.QUES_NO !== 'null'){
		return res
			.status(401)
			.send(
				`Question ${handlerContext.currentQuestion} is running. Wait for it to be done.`
			);
	}
	// console.log(req.body);
	process.env.QUES_NO = ~~req.body.questionNo;
	// console.log("START:", handlerContext);
	setTimeout(
		() => {
			console.log("BEFORE CLEAR:", handlerContext)
			process.env.QUES_NO = 'null';
			Record.insertMany(handlerContext.cachedRecords)
			.then(() => handlerContext.cachedRecords = []);
		},
		req.body.type === "mcq" ? 25000 : 35000
	);

	return res.status(200).send("Question updated");
};

export default startQuestionHandler;
