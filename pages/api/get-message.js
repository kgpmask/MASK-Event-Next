const getMessageHandler = async (req, res) => {
	return res.status(200).json({
		_id: "I4m4t0mic",
		name: "??????",
		password: "$2b$10$WV2BZkiVbsNpgIHGlFB2Yeov2CHqMwwjkmn01selkfClLGdU9.Rpq",
		username: "??????",
		message: "My name is Shadow: he who lurks in the shadows to hunt the shadows."
	});
};

export default getMessageHandler;
