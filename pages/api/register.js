import { dbInit } from "@/database/dbInit";
import { User } from "@/database/models/User";
import { Session } from "@/database/models/Session";
import bcrypt from "bcrypt";

/**
 * Registers a new user, creates a session, and sets the session cookie.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function registerHandler(req, res) {
	try {
		await dbInit();
		const { username, name, password } = req.body;
		if (!username.match(/^[A-Za-z0-9_]+$/))
			return res.status(600).send("Username not valid");
		if (password.length < 5 || password.length > 12)
			return res.status(601).send("Password not valid");

		const existUser = await User.findOne({ username });
		if (existUser) {
			return res.status(400).json({ message: "username already exists" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			_id: (Math.random() + 1).toString(36).substring(2, 12),
			username,
			name,
			password: hashedPassword,
		});
		await newUser.save();
		const userId = newUser._id;
		const newSession = new Session({
			_id: [11, 6]
				.map((i) => (Math.random() + 1).toString(36).substring(2, 2 + i))
				.join("-"),
			userId,
		});
		await newSession.save();
		const sessionId = newSession._id;
		res.setHeader("Set-Cookie", `sessionId=${sessionId}; Path=/`);

		return res.status(201).send();
	} catch (error) {
		console.error("Error during sign-up:", error);
		return res.status(500).send("Internal Server Error", error);
	}
}
