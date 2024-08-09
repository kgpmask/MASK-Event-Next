import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

const AdminContent = () => {
  const router = useRouter();
  return (
    <>
      <div className={styles["admin-content"]}>
        <h1>Admin Portal</h1>
        <p>
          Welcome to the Admin Dashboard. Here, you may manage the users or
          access the Quiz Portal as the Quizmaster.
        </p>
        <div className={styles["buttons"]}>
          <button onClick={() => router.push("/admin/list-users")}>
            Users Portal
          </button>
          <button onClick={() => router.push("/admin/quiz-portal")}>
            Quiz Portal
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminContent;
