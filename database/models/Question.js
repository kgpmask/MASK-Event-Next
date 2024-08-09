import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	quizId: { type: String, required: true },
	questionNo: { type: Number, required: true },
	title: { type: String, required: false },
	question: { type: String, required: false },
	type: { type: String, required: true, enum: ['text', 'mcq'] },
	options: [String],
	answer: { type: [Number, [String]], required: true },
	isHard: { type: Boolean, required: false }
}, { collection: 'ocaq-questions' });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);