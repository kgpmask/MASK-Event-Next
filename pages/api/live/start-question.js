import handlerContext from "@/utils/handlerContext";
import Record from "@/database/models/Record";

const startQuestionHandler = async (req, res) => {
    if (!req.cookies.isAdmin) return res.status(403).send('You are NOT an admin. Go away immediately.');
    if (handlerContext.currentQuestion) return res.status(401).send(`Question ${handlerContext.currentQuestion} is running. Wait for it to be done.`);

    handlerContext.currentQuestion = ~~req.body.questionNo;
    console.log(handlerContext);
    setTimeout(async () => {
        handlerContext.currentQuestion = null;
        await Record.insertMany(handlerContext.cachedRecords)
        handlerContext.cachedRecords = [];
    }, req.body.type === 'mcq' ? 15000 : 25000);

    return res.status(200).send('Question updated');
}

export default startQuestionHandler