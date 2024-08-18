import handlerContext from "@/utils/handlerContext";

const getLastQuestionHandler = async (req, res) => {
	return res.status(200).json({
		lastQuestion: handlerContext.lastQuestion,
	});
};

export default getLastQuestionHandler;
