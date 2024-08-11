const mongoose = require("mongoose");

const dbInit = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  return "Successfully connected to MASK database!";
};

module.exports = dbInit;
