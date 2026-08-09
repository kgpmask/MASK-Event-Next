/**
 * Clears the session cookie to log the user out.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {object} The HTTP response.
 */
export default async function logoutHandler(req, res) {
	if (!req.cookies.sessionId)
		return res.status(403).send(`You aren't logged in.`);
	res.setHeader("Set-Cookie", `sessionId=; path=/;`);
	res.status("201").send("Sayonara");
}
