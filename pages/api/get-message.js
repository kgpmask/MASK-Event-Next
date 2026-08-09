/**
 * Returns the static welcome message for the home screen.
 * @param {object} req The incoming HTTP request.
 * @param {object} res The outgoing HTTP response.
 * @returns {Promise<object>} The HTTP response.
 */
export default async function getMessageHandler(_req, res) {
	return res.status(200).json({
		_id: "I4m4t0mic",
		name: "??????",
		username: "??????",
		message:
			"My name is Shadow: he who lurks in the shadows to hunt the shadows.",
	});
}
