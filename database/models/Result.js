import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	quizId: { type: String, required: true, default: 'OCAQ-2024' },
	score: { type: Number, required: false }
}, { collection: 'ocaq-results' });

export default mongoose.models.Result || mongoose.model('Result', resultSchema);