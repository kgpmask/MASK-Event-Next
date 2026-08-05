import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		quizId: {
			type: String,
			required: true,
			default: () => process.env.QUIZ_ID,
		},
		score: { type: Number, required: true, default: 0 },
	},
	{ collection: "ocaq-results" }
);

export const Result =
	mongoose.models.Result || mongoose.model("Result", resultSchema);
