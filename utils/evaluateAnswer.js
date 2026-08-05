/**
 * Computes the Levenshtein edit distance between two strings.
 * @param {string} a The first string.
 * @param {string} b The second string.
 * @returns {number} The edit distance between the strings.
 */
const editDistance = (a, b) => {
	const lenA = a.length,
		lenB = b.length;
	const dp = Array.from({ length: lenA + 1 }, (_, _i) =>
		Array(lenB + 1).fill(0)
	);

	for (let i = 0; i <= lenA; i++) dp[i][0] = i;
	for (let j = 0; j <= lenB; j++) dp[0][j] = j;

	for (let i = 1; i <= lenA; i++) {
		for (let j = 1; j <= lenB; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1,
				dp[i][j - 1] + 1,
				dp[i - 1][j - 1] + cost
			);
		}
	}

	return dp[lenA][lenB];
};

/**
 * Awards partial or full score based on how close a text response is to the answers.
 * @param {string} response The submitted text response.
 * @param {string[]} solutions The accepted answer strings.
 * @param {number} score The maximum score for the question.
 * @returns {number} The awarded points.
 */
const evaluatedPoints = (response, solutions, score) => {
	const normalisedDistances = solutions
		.map((answer) => {
			const minDistance = editDistance(
				response.toLowerCase(),
				answer.toLowerCase()
			);
			return minDistance / answer.length;
		})
		.sort((a, b) => -(a < b))[0];
	if (normalisedDistances <= 0.1) return score;
	if (normalisedDistances <= 0.2) return Math.round(0.75 * score);
	if (normalisedDistances <= 0.3) return Math.round(0.5 * score);
	return 0;
};

/**
 * Normalises a list-like value into an array of numbers.
 * @param {unknown} value An array or comma-separated string.
 * @returns {number[]} The parsed array of numbers.
 */
const parseList = (value) =>
	Array.isArray(value) ? value : String(value).split(",").map(Number);

/**
 * Normalises a list-like value into a set of its numeric elements.
 * @param {unknown} value An array or comma-separated string.
 * @returns {Set<number>} The set of parsed numbers.
 */
const parseSet = (value) => new Set(parseList(value));

/**
 * Evaluates a response against a question's answer for the given type.
 * @param {unknown} response The submitted response.
 * @param {unknown} answer The expected answer.
 * @param {string} type The question type ("text", "mcq", "mtf",
 *   "multi-mcq", "part-multi-mcq", or "part-mtf").
 * @param {number} [score] The maximum score for the question.
 * @returns {number} The awarded points.
 */
export const evaluateAnswer = (response, answer, type, score = 200) => {
	if (response == null || response === "") return 0;
	switch (type) {
		case "mcq": {
			if (typeof response !== "number" && !/^\d+$/.test(String(response)))
				return 0;
			return score * (~~response === ~~answer);
		}
		case "multi-mcq": {
			const responseSet = parseSet(response);
			const answerSet = parseSet(answer);
			if (!answerSet.size || responseSet.size !== answerSet.size) return 0;
			return [...responseSet].every((val) => answerSet.has(val)) ? score : 0;
		}
		case "part-multi-mcq": {
			const responseSet = parseSet(response);
			const answerSet = parseSet(answer);
			if (!answerSet.size) return 0;
			const correctPicks = [...responseSet].filter((val) =>
				answerSet.has(val)
			).length;
			return Math.floor((correctPicks / answerSet.size) * score);
		}
		case "mtf":
		case "part-mtf": {
			if (!Array.isArray(response) && typeof response !== "string") return 0;
			const responseList = parseList(response);
			const answerList = parseList(answer);
			if (!answerList.length || responseList.length !== answerList.length)
				return 0;
			const correctMatches = responseList.filter(
				(val, i) => +val === +answerList[i]
			).length;
			return type === "mtf"
				? correctMatches === answerList.length
					? score
					: 0
				: Math.floor((correctMatches / answerList.length) * score);
		}
		case "text": {
			if (typeof response !== "string") return 0;
			const solutions = Array.isArray(answer) ? answer : [answer];
			return evaluatedPoints(response, solutions, score);
		}
		default:
			return 0;
	}
};
