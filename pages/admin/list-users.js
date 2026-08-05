import { useCallback, useEffect, useState } from "react";

import UserCard from "@/components/admin/UserCard";
import styles from "@/styles/Admin.module.css";

export default function ListUsersPage() {
	const [users, setUsers] = useState([]);

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
