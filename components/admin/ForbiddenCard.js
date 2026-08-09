import { useRouter } from "next/router";
import styles from "@/styles/Admin.module.css";

/**
 * ForbiddenCard component that shows a message when a user lacks access to a resource.
 * @returns {JSX.Element} The forbidden message markup.
 */
export function ForbiddenCard() {
	const router = useRouter();

	/**
	 * Navigates the user back to the main website.
	 */
	const handleGoHome = () => {
		router.push("/");
	};

	return (
		<div className={styles["forbidden-container"]}>
			<h1>Forbidden Resource (×_×;)</h1>
			<p>You do not have permission to access this page.</p>
			<button onClick={handleGoHome} className={styles["home-redirect"]}>
				Go to Main Website
			</button>
		</div>
	);
}
