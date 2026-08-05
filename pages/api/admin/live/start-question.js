import quizState from "@/utils/quizState";
import flushCachedRecords from "@/utils/flushCachedRecords";

const startQuestionHandler = async (req, res) => {
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
