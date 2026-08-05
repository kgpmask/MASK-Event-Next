import { useEffect, useState } from "react";

import AdminContent from "@/components/admin/AdminContent";
import ErrorPage from "@/pages/_error";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdmin = JSON.parse(localStorage.getItem("is-admin") || "{}").isAdmin;
	  // console.log(isAdmin);
      if (!localStorage.getItem("username")) {
        setIsAdmin(false);
        return;
      }

      if (!isAdmin) {
        try {
          const response = await fetch("/api/admin/check-admin");
          const isAdminResponse = await response.json();
          localStorage.setItem("is-admin", JSON.stringify(isAdminResponse));
          setIsAdmin(isAdminResponse.isAdmin);
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

  if (!isAdmin) return <ErrorPage statusCode={404} />;

  return (
    <>
      <AdminContent />
    </>
  );
}
