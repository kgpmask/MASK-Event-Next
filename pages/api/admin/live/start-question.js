import quizState from "@/utils/quizState";
import checkAdmin from "@/utils/checkAdmin";
import flushCachedRecords from "@/utils/flushCachedRecords";

const startQuestionHandler = async (req, res) => {
	if (!(await checkAdmin(req.cookies.sessionId)))
		return res.status(403).send("You are NOT an admin. Go away immediately.");
	if (quizState.isQuestionRunning) {
		return res
			.status(401)
			.send(
				`Question ${quizState.currentQuestionNo} is running. Wait for it to be done.`
			);
	}
	const { questionNo, type, difficulty } = req.body;
	quizState.startQuestion({ questionNo, type, difficulty });
	quizState.scheduleFlush(() => {
		quizState.endQuestion();
		flushCachedRecords();
	});

	return res.status(200).send("Question updated");
};

export default startQuestionHandler;
