import styles from "@/styles/Results.module.css";
import { TextArea } from "@/components/Base/TextArea";
import { MessageCard } from "@/components/Quiz/MessageCard";
import { useCallback, useEffect, useState } from "react";

/**
 * Assigns competition ranks to the results based on points, using standard competition ranking.
 * @param {Array<object>} resultsJSON - Array of result objects with points fields.
 */
const assignRank = (resultsJSON) => {
	// Ranks will look like 1,1,3,4,5
	resultsJSON.sort((a, b) => b.points - a.points);
	if (resultsJSON.length > 0) {
		resultsJSON[0].rank = 1;
		for (let i = 1; i < resultsJSON.length; ++i) {
			if (resultsJSON[i - 1].points > resultsJSON[i].points) {
				resultsJSON[i].rank = i + 1;
			} else {
				resultsJSON[i].rank = resultsJSON[i - 1].rank;
			}
		}
	}
};

/**
 * Results page that evaluates and displays the quiz leaderboard with ranks.
 * @returns {JSX.Element} The results page markup.
 */
export default function Results() {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);

	/**
	 * Evaluates answers as admin if applicable and fetches the results list.
	 * @returns {Promise<Array<object>>} The list of result objects.
	 */
	const fetchResults = useCallback(async () => {
		try {
			const adminResponse = await fetch("/api/admin/check-admin");
			const isAdmin = (await adminResponse.json()).isAdmin;
			if (isAdmin) await fetch("/api/admin/live/evaluate-answer");
			const response = await fetch("/api/live/get-results");
			return await response.json();
		} catch (e) {
			return [];
		}
	}, []);

	useEffect(() => {
		let isMounted = true;

		/**
		 * Fetches the results, assigns ranks and updates state once data arrives.
		 */
		async function loadData() {
			setLoading(true);
			const data = await fetchResults();
			if (isMounted) {
				if (data && data.length > 0) {
					assignRank(data);
					setResults(data);
				}
				setLoading(false);
			}
		}

		loadData();

		return () => {
			isMounted = false;
		};
	}, [fetchResults]);

	if (loading || !results || !results.length) {
		return (
			<MessageCard
				message={"Results are yet to be evaluated. Try again later."}
			/>
		);
	}

	return (
		<div>
			<TextArea title="Results">
				<h4>Real results were the friends we made along the way. jk.</h4>

				<table className={styles["content-table"]}>
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Username</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						<tr onClick={() => window.open("/api/get-message", "_blank")}></tr>
						{results.map((elem) => {
							return (
								<tr key={elem.username}>
									<td>{elem.rank}</td>
									<td>{elem.name}</td>
									<td>{elem.username}</td>
									<td>{elem.points}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</TextArea>
		</div>
	);
}
