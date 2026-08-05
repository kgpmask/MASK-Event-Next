import { useCallback, useEffect, useState } from "react";

import { UserCard } from "@/components/admin/UserCard";
import styles from "@/styles/Admin.module.css";

/**
 * ListUsersPage that displays all registered users as editable cards.
 * @returns {JSX.Element} The users list page markup.
 */
export default function ListUsersPage() {
	const [users, setUsers] = useState([]);

	/**
	 * Fetches the list of users from the admin API and stores it in state.
	 */
	const fetchUsers = useCallback(async () => {
		try {
			const response = await fetch("/api/admin/users");
			const usersData = await response.json();
			setUsers(usersData);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return (
		<>
			<div className={styles["users-list"]}>
				{users.map((user) => (
					<UserCard key={user.id} user={user} fetchUsers={fetchUsers} />
				))}
			</div>
		</>
	);
}
