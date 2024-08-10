import User from "@/database/models/User";
import checkAdmin from "@/utils/checkAdmin";

const updateProfileHandler = async (req, res) => {
  const { username } = req.body;

  if (!checkAdmin(req.cookies.sessionId)) {
    const user = await User.findById(
      (
        await Session.findById(req.cookies.sessionId)
      )?.userId
    ).username;
    if (user !== username)
      return res
        .status(401)
        .send(
          "You are NOT an admin or a registered user. Go away immediately."
        );
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(404).send("No user found.");

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.profilePic !== undefined) user.profilePic = req.body.profilePic;

  await user.save();
  return res.status(200).send("Profile successfully updated!");
};

export default updateProfileHandler;
