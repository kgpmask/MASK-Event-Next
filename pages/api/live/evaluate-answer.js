import quizState from '@/utils/quizState';
import cachedResults from '@/utils/cachedResults';
import evaluateAnswer from '@/utils/evaluateAnswer';
import dbInit from '@/database/dbInit';
import Question from '@/database/models/Question';
import Record from '@/database/models/Record';
import Result from '@/database/models/Result';
import User from '@/database/models/User';
import flushCachedRecords from '@/utils/flushCachedRecords';
import checkAdmin from '@/utils/checkAdmin';

const evaluateAnswerHandler = async (req, res) => {
	if (!(await checkAdmin(req.cookies.sessionId))) return res.status(401).send('You are NOT an admin. Go away immediately.');

	const quizId = quizState.quizId;
	const results = [];

	await dbInit();
	await flushCachedRecords();
	const users = await User.find().lean();
	const questions = await Question.find({ quizId })
		.lean({ defaults: true })
		.sort({ questionNo: 'asc' });
	const records = await Record.find({ quizId }).lean();

	records.forEach(({ userId, questionNo, response }) => {
		if (~~questionNo <= 0) return;
		const user = users.find((u) => u._id === userId);
		if (!user) return;
		const ques = questions.find((q) => q.questionNo === questionNo);
		if (!ques) return;
		let result = results.find((obj) => obj.userId === userId);
		if (!result) {
			result = { userId, username: user.username, name: user.name, points: 0 };
			results.push(result);
		}
		result.points += evaluateAnswer(response, ques.answer, ques.type, ques.score);
	});

	cachedResults.results = results;
	await Promise.all(
		results.map(async ({ userId, points }) => {
			const result = (await Result.findOne({ userId, quizId })) || new Result({ userId, quizId });
			result.score = points;
			return await result.save();
		})
	);

	return res.status(201).send('Evaluation successful!');
};

export default evaluateAnswerHandler;
