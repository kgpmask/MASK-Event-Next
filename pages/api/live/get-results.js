import handlerContext from "@/utils/handlerContext";
import cachedResults from "@/utils/cachedResults";
import dbInit from "@/database/dbInit";
import Result from "@/database/models/Result";
import User from "@/database/models/User";

const getResultsHandler = async (req, res) => {
  if (!req.cookies.sessionId)
    return res
      .status(401)
      .send("You are not logged in. Please log in to continue.");
  if (cachedResults.results.length == 0) {
    await dbInit();
    const users = await User.find().lean();
    const results = await Result.find({ quizId: handlerContext.quizId });
    cachedResults.results = results.map((obj) => {
      const result = { points: obj.points };
      result.username = users.find((u) => u._id === obj.userId).username;
      result.name = users.find((u) => u._id === obj.userId).name;
      return result;
    });
  }

  return res.status(201).json(cachedResults.results);
};

export default getResultsHandler;
