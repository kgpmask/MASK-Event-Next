import { useRouter } from "next/router";
import Image from "next/image";
import styles from "@/styles/Admin.module.css";

/**
 * UserCard component that displays a user's details with edit and delete actions.
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing name, username and profilePic.
 * @param {function} props.fetchUsers - Callback invoked to refresh the users list after deletion.
 * @returns {JSX.Element} The user card markup.
 */
export function UserCard({ user, fetchUsers }) {
	const router = useRouter();

	/**
	 * Navigates to the edit page for the given user.
	 */
	const handleEdit = () => {
		router.push(`/admin/edit-user/${user?._id}`);
	};

	/**
	 * Deletes the user with the given id after confirmation and refreshes the list.
	 * @param {string} userId - The id of the user to delete.
	 */
	const handleDelete = async (userId) => {
		if (confirm("Are you sure you want to delete this user?")) {
			try {
				const response = await fetch("/api/admin/delete-user", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userId }),
				});

				if (response.ok) {
					alert("User deleted successfully.");
					fetchUsers();
				} else {
					const errorMessage = await response.json();
					alert(`Failed to delete user: ${errorMessage.message}`);
				}
			} catch (error) {
				console.error("Error deleting user:", error);
				alert("An error occurred while deleting the user.");
			}
		}
	};

	return (
		<div className={styles["card"]}>
			<div className={styles["user-img"]}>
				<Image src={user.profilePic} alt="" />
			</div>
			<div className={styles["user"]}>
				<div className={styles["user-info"]}>
					<h3>{user?.name}</h3>
					<p>{user?.username}</p>
				</div>

				<div className={styles["buttonContainer"]}>
					<button
						onClick={handleEdit}
						className={`${styles["button"]} ${styles["edit-btn"]}`}
					>
						Edit
					</button>
					<button
						onClick={() => handleDelete(user._id)}
						className={`${styles["button"]} ${styles["delete-btn"]}`}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
