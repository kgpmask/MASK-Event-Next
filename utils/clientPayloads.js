/**
 * Builds the only question shape that may be sent to a browser. In particular,
 * answer keys and database metadata must remain server-side.
 * @param {object} question A question document or lean question object.
 * @returns {object} The client-safe question fields.
 */
export const toClientQuestion = ({
	questionNo,
	title,
	question,
	type,
	options,
	difficulty,
}) => ({ questionNo, title, question, type, options, difficulty });

/**
 * Builds the public profile shape needed by regular users.
 * @param {object} user A user document or lean user object.
 * @returns {object} The client-safe user fields.
 */
export const toClientUser = ({ _id, name, username, profilePic }) => ({
	_id: String(_id),
	name,
	username,
	profilePic,
});

/**
 * Builds the limited user shape required by the admin user-management UI.
 * @param {object} user A user document or lean user object.
 * @returns {object} The client-safe admin user fields.
 */
export const toAdminUser = (user) => ({
	...toClientUser(user),
	isAdmin: Boolean(user.isAdmin),
});
