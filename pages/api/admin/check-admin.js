import { checkAdmin } from "@/utils/checkAdmin";

/**
 * Checks whether the requesting session belongs to an admin user.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function checkAdminHandler(req, res) {
	try {
		const { sessionId } = req.cookies;
		if (!sessionId) {
			return res.status(403).json({ message: "Forbidden resource." });
		}
		const isAdmin = await checkAdmin(sessionId);
		return res.status(200).json({ isAdmin });
	} catch (error) {
		console.error("Error checking admin status:", error);
		return res.status(500).json({ message: "Internal server error." });
	}
}
