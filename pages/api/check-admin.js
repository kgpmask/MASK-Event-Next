import connectToDb from "@/database/connect";
import { getUserFromSession } from "@/database/models/User";

export default async function checkAdminHandler(req, res) {
  try {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return res.status(403).json({ message: "Forbidden resource." });
    }

    await connectToDb();

    const user = await getUserFromSession(sessionId);
    if (!user) {
      return res.status(403).json({ message: "Forbidden resource." });
    }
    const isAdmin = Boolean(user.isAdmin);

    res.setHeader(
      "Set-Cookie",
      `isAdmin=${isAdmin}; path=/; HttpOnly; SameSite=Strict`
    );

    return res.status(200).json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
