import { dbInit } from "../database/dbInit.js";
import { User } from "../database/models/User.js";
import { Session } from "../database/models/Session.js";

/**
 * Checks whether the given session belongs to an admin user.
 * @param {string} sessionId The session id to look up.
 * @returns {Promise<boolean>} True when the session's user is an admin.
 */
export const checkAdmin = async (sessionId) => {
	try {
		await dbInit();

		const session = await Session.findById(sessionId);
		const userId = session.userId;
		const user = await User.findById(userId).lean();
		if (!user) return false;
		return Boolean(user.isAdmin);
	} catch (e) {
		return false;
	}
};
