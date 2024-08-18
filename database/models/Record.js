import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	quizId: { type: String, required: true, default: 'OCAQ-2024' },
	questionNo: { type: Number, required: true },
	response: { type: String, required: false}
}, { collection: 'ocaq-records' });

export default mongoose.models.Record || mongoose.model('Record', recordSchema);
