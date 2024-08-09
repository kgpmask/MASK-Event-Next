import User, { getUserFromSession } from "@/database/models/User";

export default async function updateProfileHandler(req, res) {
  try {
    const { username, name, profilePic } = req.body;

    const userSession = await getUserFromSession(req.cookies.sessionId);
    const isAdmin = JSON.parse(req.cookies.isAdmin || "false");

    if (!isAdmin && userSession.username !== username) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    if (name !== undefined) user.name = name;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    return res.status(200).json({ message: "Successfully updated." });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
