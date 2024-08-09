import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

export default function UserCard({ user }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/edit-user/${user?._id}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className={styles["card"]}>
      <div className={styles["userInfo"]}>
        <h3>Ankan Saha</h3>
        <p>ankantest</p>
      </div>
      <div className={styles["buttonContainer"]}>
        <button
          onClick={handleEdit}
          className={`${styles["button"]} ${styles["edit-btn"]}`}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className={`${styles["button"]} ${styles["delete-btn"]}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
