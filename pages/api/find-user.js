import User from "@/database/models/User";
import Session from "@/database/models/Session";

const findUserHandler = async (req, res) => {
    if(!req.cookies.sessionId) return res.status(204).send('No sessionId');
    const user = await User.findById((await Session.findById(req.cookies.sessionId))?.userId);
    return res.status(200).json(user);
}

export default findUserHandler;