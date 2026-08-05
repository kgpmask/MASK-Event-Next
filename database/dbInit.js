import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using MONGO_URL.
 * @returns {Promise<string>} A success message on connection.
 */
export const dbInit = async () => {
	await mongoose.connect(process.env.MONGO_URL);
	return "Successfully connected to MASK database!";
};
