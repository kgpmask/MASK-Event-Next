import mongoose from "mongoose";
import dbInit from "../dbInit";

const sessionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { collection: "sessions" }
);

export default mongoose.model("Session", sessionSchema);
