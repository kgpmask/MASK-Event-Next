import { useEffect, useState } from "react";

import UserCard from "@/components/admin/UserCard";
import ErrorPage from "@/pages/_error";
import styles from "@/styles/Admin.module.css";

export default function ListUsersPage() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = (await (await fetch("/api/admin/check-admin")).json())
					.isAdmin;
				setIsAdmin(response);
			} catch (err) {
				console.error("Error checking admin status:", err);
			}
		};

		checkAdmin();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch("/api/admin/users");
			const usersData = await response.json();
			setUsers(usersData);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};
	useEffect(() => {
		if (isAdmin) {
			fetchUsers();
		}
	}, [isAdmin]);

	if (!isAdmin) return <ErrorPage statusCode={404} />;

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
