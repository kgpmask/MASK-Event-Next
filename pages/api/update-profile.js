import { User } from "@/database/models/User";
import { Session } from "@/database/models/Session";
import bcrypt from "bcrypt";

/**
 * Updates the profile of the logged-in user or the targeted user when admin.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function updateProfileHandler(req, res) {
	try {
		let user;

		const { name, username, password, profilePic } = req.body;

		if (req.cookies.isAdmin) {
			user = await User.findOne({ username });
		} else {
			user = await User.findById(
				(await Session.findById(req.cookies.sessionId))?.userId
			);
		}

		if (!user)
			return res
				.status(401)
				.send(
					"You are NOT an admin or a registered user. Go away immediately."
				);

		if (name !== undefined) user.name = name;
		if (profilePic !== undefined) user.profilePic = profilePic;

		if (password !== undefined) {
			const salt = 10;
			user.password = await bcrypt.hash(password, salt);
		}

		await user.save();

		return res.status(200).send("Profile updated successfully!");
	} catch (error) {
		console.error("Error updating profile:", error);
		return res
			.status(500)
			.send("an error occurred while updating the profile.");
	}
}
