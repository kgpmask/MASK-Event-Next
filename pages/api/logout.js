const logoutHandler = (req, res) => {
  if (!req.cookies.sessionId)
    return res.status(403).send(`You aren't logged in.`);
  res.setHeader("Set-Cookie", `sessionId=; path=/;`);
  res.status("201").send("Sayonara");
};
