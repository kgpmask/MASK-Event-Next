const editDistance = (a, b) => {
	const lenA = a.length, lenB = b.length;
	const dp = Array.from({ length: lenA + 1 }, (_, _i) => Array(lenB + 1).fill(0));

	for (let i = 0; i <= lenA; i++) dp[i][0] = i;
	for (let j = 0; j <= lenB; j++) dp[0][j] = j;

	for (let i = 1; i <= lenA; i++) {
		for (let j = 1; j <= lenB; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
		}
	}

	return dp[lenA][lenB];
}

const evaluatedPoints = (response, solutions, score) => {
	const normalisedDistances = solutions.map(answer => {
		const minDistance = editDistance(response.toLowerCase(), answer.toLowerCase());
		return minDistance / answer.length;
	}).sort((a, b) => -(a < b))[0];
	if (normalisedDistances <= 0.1) return score;
	if (normalisedDistances <= 0.2) return Math.round(0.75 * score);
	if (normalisedDistances <= 0.3) return Math.round(0.5 * score);
	return 0;
}

const arraysMatch = (response, answer) =>
	Array.isArray(response) &&
	Array.isArray(answer) &&
	response.length === answer.length &&
	response.every((val, i) => +val === +answer[i]);

const parseList = (value) =>
	Array.isArray(value) ? value : String(value).split(',').map(Number);

const evaluateAnswer = (response, answer, type, score = 200) => {
	switch (type) {
		case 'mcq':
			return score * (~~response === ~~answer);
		case 'mtf':
			return arraysMatch(parseList(response), parseList(answer)) ? score : 0;
		case 'text': {
			const solutions = Array.isArray(answer) ? answer : [answer];
			return evaluatedPoints(response, solutions, score);
		}
		default:
			return 0;
	}
}

export default evaluateAnswer;
