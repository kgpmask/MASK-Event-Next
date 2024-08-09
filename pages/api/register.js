import dbInit from "@/database/dbInit";
import User from "@/database/models/User";
import Session from "@/database/models/Session";
import bcrypt from "bcrypt";

const registerHandler = async (req, res) => {
  try {
    await dbInit();
    const { username, name, password } = req.body;
    // console.log(req.body);
    const existUser = await User.findOne({ username });
    // console.log(70);
    if (existUser) {
      return res.status(400).json({ message: "username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      _id: (Math.random() + 1).toString(36).substring(2, 12),
      username,
      name,
      password: hashedPassword,
    });
    await newUser.save();
    // console.log(69);
    const userId = newUser._id;
    const newSession = new Session({
      _id: [11, 6]
        .map((i) => (Math.random() + 1).toString(36).substring(2, 2 + i))
        .join("-"),
      userId,
    });
    await newSession.save();
    const sessionId = newSession._id;
    res.setHeader("Set-Cookie", `sessionId=${sessionId}; Path=/`);

    return res.status(201).send();
  } catch (error) {
    console.error("Error during sign-up:", error);
    return res.status(500).send("Internal Server Error", err);
  }
};

export default registerHandler;
