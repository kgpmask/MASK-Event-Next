import { useEffect, useState } from "react";

import ForbiddenCard from "@/components/admin/ForbiddenCard";
import UserCard from "@/components/admin/UserCard";
import styles from "@/styles/Admin.module.css";
//import MessageCard from "@/components/live/utils/MessageCard";

export default function ListUsersPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdmin = JSON.parse(localStorage.getItem("is-admin") || "false");
      if (!localStorage.getItem("username")) {
        setIsAdmin(false);
        return;
      }

      if (!isAdmin) {
        try {
          const response = await fetch("/api/check-admin");
          const isAdminResponse = await response.json();
          localStorage.setItem("is-admin", JSON.stringify(isAdminResponse));
          setIsAdmin(isAdminResponse);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(isAdmin);
      }
    };

    checkAdminStatus();
  }, []);

  //if (!isAdmin) return <ForbiddenCard />;

  return (
    <>
      <div className={styles["users-list"]}>
        {/*map the users here*/}
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </>
  );
}
