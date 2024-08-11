import dbInit from '@/database/dbInit';
import Record from '@/database/models/Record';

const yesHandler = async (req, res) => {
	const records = await Record.find({ questionNo: 0, quizId: process.env.QUIZ_ID }).lean();
	return res.status(200).send(records.map(e => {return { userId: e.userId, response: e.response }}))
};

export default yesHandler;
