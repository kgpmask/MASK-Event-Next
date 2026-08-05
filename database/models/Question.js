import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
	{
		quizId: { type: String, required: true },
		questionNo: { type: Number, required: true },
		title: { type: String, required: false },
		question: { type: String, required: false },
		type: { type: String, required: true, enum: ["text", "mcq", "mtf"] },
		// Options, encoded per type:
		//   mcq  - comma-separated choices, e.g. "Naruto,Sasuke,Sakura,Kakashi"
		//   text - unused
		//   mtf  - left and right lists split by "|", commas within each,
		//          e.g. "L1,L2|R1,R2,R3" (right may have extra choices)
		options: { type: String, required: false },
		// Correct answer, encoded per type:
		//   mcq  - raw string of the option index, e.g. "2"
		//   text - raw accepted answer, e.g. "naruto"
		//   mtf  - comma-separated right-list index per left item, e.g. "0,1,2"
		answer: { type: String, required: false },
		difficulty: {
			type: String,
			enum: ["easy", "medium", "hard", "insane"],
			default: "medium",
			required: false,
		},
		score: { type: Number, default: 200, required: false },

		// DEPRECATED: deprecated since OCAQ 2026. Replaced by difficulty + score.
		isHard: { type: Boolean, required: false },
	},
	{ collection: "ocaq-questions" }
);

export const Question =
	mongoose.models.Question || mongoose.model("Question", questionSchema);
