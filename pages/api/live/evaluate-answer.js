import handlerContext from '@/utils/handlerContext';
import cachedResults from '@/utils/cachedResults';
import evaluateAnswer from '@/utils/evaluateAnswer';
import dbInit from '@/database/dbInit';
import Question from '@/database/models/Question';
import Record from '@/database/models/Record';
import Result from '@/database/models/Result';
import User from '@/database/models/User';
import checkAdmin from '@/utils/checkAdmin';

const evaluateAnswerHandler = async (req, res) => {
	if (!(await checkAdmin(req.cookies.sessionId))) return res.status(401).send('You are NOT an admin. Go away immediately.');

	const quizId = handlerContext.quizId;
	const results = [];

	await dbInit();
	const users = await User.find().lean();
	const questions = await Question.find({ quizId }).lean().sort({ questionNo: 'asc' });
	const records = await Record.find({ quizId }).lean();

	records.forEach(({ userId, questionNo, response }) => {
		if (~~questionNo <= 0 ) return;
		if (!results.find((obj) => obj.userId === userId))
			results.push({
				userId,
				username: users.find((u) => u._id === userId).username,
				name: users.find((u) => u._id === userId).name,
				points: 0,
			});
		// console.log("QUES NO:", questionNo);
		const ques = questions.find((q) => q.questionNo === questionNo);
		// console.log("LIST OF QUESTIONS", questions);
		// console.log(ques);
		const { answer, type, isHard } = questions.find((q) => q.questionNo === questionNo);
		const user = results.find((obj) => obj.userId === userId);
		const score = evaluateAnswer(response, answer, type);
		if(type === "mcq") user.points += isHard ? 4 * score : score;
		else user.points += isHard ? 2 * score : score;
	});


	console.log("RESULTS: ", results);

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
