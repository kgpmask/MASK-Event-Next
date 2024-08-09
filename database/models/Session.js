import mongoose from "mongoose";
import connectToDb from "../connect.js";

const sessionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { collection: "sessions" }
);

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;

export async function generateSession(userId) {
  try {
    await connectToDb();

    const generateSessionId = () => {
      return [11, 6]
        .map((len) =>
          Array.from({ length: len }, () =>
            String.fromCharCode(
              Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)
            )
          ).join("")
        )
        .join("-");
    };

    const sessionId = generateSessionId();

    const newSession = new Session({
      _id: sessionId,
      userId,
    });

    await newSession.save();

    return sessionId;
  } catch (error) {
    console.error("Error generating session:", error);
    return null;
  }
}
