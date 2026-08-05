import User from "@/database/models/User";
import checkAdmin from "@/utils/checkAdmin";

export default async function handler(req, res) {
  try {
    if (req.method === "DELETE") {
      const { userId } = req.body;

      /*if (!checkAdmin(req.cookies.sessionId)) {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }
    */

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
