import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

export default function UserCard({ user, fetchUsers }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/edit-user/${user?._id}`);
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch("/api/delete-user", {
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
        <img src={user.profilePic} />
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
