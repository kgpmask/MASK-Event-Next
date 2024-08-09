import mongoose from 'mongoose';
import dbInit from '../dbInit';

const questionSchema = new mongoose.Schema({
	quizId: { type: String, required: true },
	questionNo: { type: Number, required: true },
	title: { type: String, required: false },
	question: { type: String, required: false },
	type: { type: String, required: true, enum: ['text', 'mcq'] },
	options: [String],
	answer: { type: [Number, [String]], required: true },
	isHard: { type: Boolean, required: false }
}, { collection: 'questions' });

export default mongoose.model('Question', questionSchema);