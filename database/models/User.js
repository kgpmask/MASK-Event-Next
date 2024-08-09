import mongoose from "mongoose";
import Session from "./Session.js";
import connectToDb from "../connect.js";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: String,
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePic: String,
    isAdmin: { type: Boolean, default: false },
  },
  { collection: "users" }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

export async function getUserFromSession(sessionId) {
  try {
    await connectToDb();

    const session = await Session.findById(sessionId);
    if (!session) return null;

    const user = await User.findById(session.userId).lean();
    return user;
  } catch (error) {
    console.error("Error retrieving user from session:", error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    await connectToDb();
    return await User.find().lean();
  } catch (error) {
    console.error("Error retrieving all users:", error);
    return [];
  }
}
