const editDistance = (a, b) => {
    const lenA = a.length, lenB = b.length;
    const dp = Array.from({ length: lenA + 1 }, (_, i) => Array(lenB + 1).fill(0));

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

const evaluatedPoints = (response, solutions) => {
	const normalisedDistances = solutions.map(answer => {
		const minDistance = editDistance(response.toLowerCase(), answer.toLowerCase());
		return minDistance / answer.length;
	}).sort((a, b) => -(a < b))[0];
	if (normalisedDistances === 0) return 200;
	if (normalisedDistances <= 0.2) return 150;
	if (normalisedDistances <= 0.4) return 100;
	return 0;
}

const evaluateAnswer = (response, answer, type) => {
	switch (type) {
		case 'mcq':
			return 100 * (~~response === ~~answer);
		case 'text':
			return evaluatedPoints(response, answer);
		default:
			return 0;
	}
}

export default evaluateAnswer;