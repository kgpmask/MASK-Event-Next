import User from "@/database/models/User";
import Session from "@/database/models/Session";

const updateProfileHandler = async (req, res) => {
    // const { username } = req.body;
	let user;

	if (req.cookies.isAdmin) {
		user = await User.findOne({ username });
	}
	else {
		user = await User.findById((await Session.findById(req.cookies.sessionId))?.userId)
	}

	if (!user) return res.status(401).send('You are NOT an admin or a registered user. Go away immediately.');

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.profilePic !== undefined) user.profilePic = req.body.profilePic;

    await user.save();
    return res.status(200).send('Profile successfully updated!');
}

export default updateProfileHandler