import { User } from "@/database/models/User";
import { toAdminUser } from "@/utils/clientPayloads";

/**
 * Fetches all users (passwords excluded), invoked via a GET request.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function fetchAllUsers(req, res) {
	try {
		if (req.method === "GET") {
			const users = await User.find({}).lean();

			return res.status(200).json(users.map(toAdminUser));
		} else {
			return res.status(405).json({ message: "Method not allowed" });
		}
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}
