import mongoose from 'mongoose';
import dbInit from '../dbInit';

const recordSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	quizId: { type: String, required: true, default: 'OCAQ-2024' },
	questionNo: { type: Number, required: true },
	response: { type: String, required: false}
}, { collection: 'records' });

export default mongoose.model('Record', recordSchema);
