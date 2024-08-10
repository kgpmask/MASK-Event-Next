import dbInit from "@/database/dbInit";
import User from "@/database/models/User";
import checkAdmin from "@/utils/checkAdmin";

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
