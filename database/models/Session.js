import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	userId: { type: String, required: true }
}, { collection: 'ocaq-sessions' });

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);