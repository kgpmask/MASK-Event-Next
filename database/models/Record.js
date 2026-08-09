import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		quizId: {
			type: String,
			required: true,
			default: () => process.env.QUIZ_ID,
		},
		questionNo: { type: Number, required: true },
		// Response text. MCQ stores the chosen index as a string, MTF stores the
		// chosen right-list indices comma-joined (e.g. "0,2,1").
		response: { type: String, required: false },
	},
	{ collection: "ocaq-records" }
);

// One response per user per question per quiz. Duplicate writes are rejected
// by the database even if a flush race slips past the in-memory guards.
recordSchema.index({ quizId: 1, userId: 1, questionNo: 1 }, { unique: true });

export const Record =
	mongoose.models.Record || mongoose.model("Record", recordSchema);
