import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	quizId: { type: String, required: true, default: 'OCAQ-2024' },
	score: { type: Number, required: false }
}, { collection: 'results' });

export default mongoose.model('Result', resultSchema);