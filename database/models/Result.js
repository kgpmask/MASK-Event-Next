import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	quizId: { type: String, required: true, default: 'OCAQ-2024' },
	score: { type: Number, required: true, default: 0 }
}, { collection: 'ocaq-results' });

export default mongoose.models.Result || mongoose.model('Result', resultSchema);