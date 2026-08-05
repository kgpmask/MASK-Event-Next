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

export const Record =
	mongoose.models.Record || mongoose.model("Record", recordSchema);
