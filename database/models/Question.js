import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	quizId: { type: String, required: true },
	questionNo: { type: Number, required: true },
	title: { type: String, required: false },
	question: { type: String, required: false },
	type: { type: String, required: true, enum: ['text', 'mcq'] },
	options: [String],
	answer: { type: [Number, [String]], required: true },
	difficulty: {
		type: String,
		enum: ['easy', 'medium', 'hard', 'insane'],
		default: 'medium',
		required: false,
	},
	score: { type: Number, default: 200, required: false },

	// DEPRECATED: deprecated since OCAQ 2026. Replaced by difficulty + score.
	isHard: { type: Boolean, required: false },
}, { collection: 'ocaq-questions' });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
