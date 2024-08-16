import { useEffect, useState } from "react";

import ForbiddenCard from "@/components/admin/ForbiddenCard";
import UserCard from "@/components/admin/UserCard";
import styles from "@/styles/Admin.module.css";
//import MessageCard from "@/components/live/utils/MessageCard";

export default function ListUsersPage() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = (await (await fetch("/api/check-admin")).json())
					.isAdmin;
				setIsAdmin(response);
			} catch (err) {
				console.error("Error checking admin status:", err);
			}
		};

		checkAdmin();
	}, []);

	//   useEffect(() => {
	//     const checkAdminStatus = async () => {
	//       const isAdmin = JSON.parse(localStorage.getItem("is-admin") || "{}").isAdmin;
	//       if (!localStorage.getItem("username")) {
	//         setIsAdmin(false);
	//         return;
	//       }

	//       if (!isAdmin) {
	//         try {
	//           const response = await fetch("/api/check-admin");
	//           const isAdminResponse = await response.json();
	//           localStorage.setItem("is-admin", JSON.stringify(isAdminResponse));
	//           setIsAdmin(isAdminResponse);
	//         } catch (error) {
	//           console.error("Error checking admin status:", error);
	//           setIsAdmin(false);
	//         }
	//       } else {
	//         setIsAdmin(isAdmin);
	//       }
	//     };

	//     checkAdminStatus();
	//   }, []);
	const fetchUsers = async () => {
		try {
			const response = await fetch("/api/users");
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

	if (!isAdmin) return <ForbiddenCard />;

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
