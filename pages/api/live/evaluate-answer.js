import handlerContext from "@/utils/handlerContext";
import cachedResults from "@/utils/cachedResults";
import evaluateAnswer from "@/utils/evaluateAnswer"
import dbInit from "@/database/dbInit";
import Question from "@/database/models/Question";
import Record from "@/database/models/Record";
import Result from "@/database/models/Result";
import User from "@/database/models/User";

const evaluateAnswerHandler = async (req, res) => {
	if (!req.cookies.isAdmin) return res.status(401).send('You are NOT an admin. Go away immediately.');

	const quizId = handlerContext.quizId;
	const results  = [];
	
	await dbInit();
	const users = await User.find({ quizId }).lean();
    const questions = await Question.find({ quizId }).lean().sort({ questionNo: 'asc' });
	const records = await Record.find({ quizId }).lean();

	records.forEach(({ userId, questionNo, response }) => {
		if (!results.find(obj => obj.userId === userId)) results.push({
			userId,
			username: users.find(u => u._id === userId).username,
			name: users.find(u => u._id === userId).name,
			points: 0
		});
		const { answer, type } = questions.find(q => q.questionNo === questionNo);
        const user = results.find(obj => obj.userId === userId);
		user.points += evaluateAnswer(response, answer, type);
	});

	cachedResults.results = results;
	await Promise.all(results.map(async ({userId, points}) => {
        const result = (await Result.findOne({ userId, quizId })) || new Result({ userId, quizId });
        result.points = points;
		return await result.save();
    }));
    
	return res.status(201).send('Evaluation successful!');
}

export default evaluateAnswerHandler;