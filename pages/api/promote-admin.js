import User from "@/database/models/User";

export default async function adminPromoteHandler(req, res) {
  try {
    if (req.body.secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid secret key." });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    user.isAdmin = true;
    await user.save();

    console.log(`User ${user.username} promoted to admin.`);

    return res.status(200).json({ message: "User promoted to admin." });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
