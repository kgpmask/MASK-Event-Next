import mongoose from 'mongoose';
import dbInit from '../dbInit';

const userSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String, required: false},
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	profilePic: { type: String, required: false },
	isAdmin: { type: Boolean, required: false}
}, { collection: 'users' });

export default mongoose.model('User', userSchema);