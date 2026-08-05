import User from "@/database/models/User";

export default async function fetchAllUsers(req, res) {
  try {
    if (req.method === "GET") {
      const users = await User.find({});

      return res.status(200).json(users);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
