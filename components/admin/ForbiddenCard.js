import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

export default function ForbiddenCard() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className={styles["forbidden-container"]}>
      <h1>Forbidden Resource (×_×;）</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={handleGoHome} className={styles["home-redirect"]}>
        Go to Main Website
      </button>
    </div>
  );
}
