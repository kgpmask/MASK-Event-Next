import { User } from "@/database/models/User";
import { Session } from "@/database/models/Session";

/**
 * Returns the current logged-in user's public profile without the password.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function findUserHandler(req, res) {
	if (!req.cookies.sessionId) return res.status(204).send("No sessionId");
	const user = await User.findById(
		(await Session.findById(req.cookies.sessionId))?.userId
	).select("-password");
	return res.status(200).json(user);
}
