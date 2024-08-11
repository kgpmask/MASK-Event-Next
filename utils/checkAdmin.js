import dbInit from "@/database/dbInit";
import User from "@/database/models/User";
import Session from "@/database/models/Session";

const checkAdmin = async (sessionId) => {
	try {
		await dbInit();

		const session = await Session.findById(sessionId);
		// console.log(session._id, sessionId);
		const userId = session.userId;
		const user = await User.findById(userId).lean();
		// console.log(user.username);
		if(!user) return false;
		return user.isAdmin;
	} catch (e) {
		return false;
	}
}

export default checkAdmin;