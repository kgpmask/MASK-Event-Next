import dbInit from "@/database/dbInit";
import User from "@/database/models/User";

const checkisAdminHandler = async (req, res) => {
	if (!req.cookies.sessionId) return res.status(403).send('You are not logged in. Please login to continue.');

	await dbInit();
	const user = User.findById((await Session.findById(req.cookies.sessionId))?.userId);
	if (!user) return res.status(403).send('Bruh');

    res.setHeader('Set-Cookie', `isAdmin=${Boolean(user.isAdmin)}; path=/;`);
	return res.status(201).send(Boolean(user.isAdmin));
}

export default checkisAdminHandler;