import { User } from "@/database/models/User";
import { toAdminUser } from "@/utils/clientPayloads";

/**
 * Fetches a single user by id (password excluded), invoked via a GET request.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const { userId } = req.query;
			const user = await User.findById(userId).lean();
			if (!user) return res.status(404).json({ message: "User not found" });

			return res.status(200).json(toAdminUser(user));
		} catch (error) {
			console.error("Error fetching user:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	} else {
		return res.status(405).json({ message: "Method not allowed" });
	}
}
