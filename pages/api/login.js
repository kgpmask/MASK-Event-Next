import dbInit from "@/database/dbInit";
import User from "@/database/models/User";
import Session from "@/database/models/Session";
import bcrypt from "bcrypt";

const loginHandler = async (req, res) => {
	await dbInit();
	if (req.cookies.sessionId)
		return res.status(403).send("You are already logged in...");

	const { username, password } = req.body;
	try {
		await dbInit();
		const user = await User.findOne({ username });
		// console.log(user);
		if (!user) return res.status(404).send("User does not exist");
		if (!(await bcrypt.compare(password, user.password)))
			return res.status(404).send("Invalid credentials");

		console.log(user._id)
		const newSession = new Session({
			_id: [11, 6]
				.map((i) => (Math.random() + 1).toString(36).substring(2, 2 + i))
				.join("-"),
			userId: user._id,
		});
		await newSession.save();
		const sessionId = newSession._id;
		res.setHeader("Set-Cookie", `sessionId=${sessionId}; Path=/`);
		return res.status(201).send({ username, name: user.name });
	} catch (err) {
		console.log(err);

		return res.status(500).send("Internal Server Error", err);
	}
};

export default loginHandler;
