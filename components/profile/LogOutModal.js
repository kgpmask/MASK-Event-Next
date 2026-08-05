import React from "react";
import Styles from "@/styles/Profile.module.css";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/router";
import axios from "axios";

/**
 * LogOutModal component that confirms whether the user wants to log out.
 * @param {object} props - The component props.
 * @param {function} props.showModal - Callback used to open/close the modal.
 * @returns {JSX.Element} The modal markup.
 */
export function LogOutModal({ showModal }) {
	const router = useRouter();

	/**
	 * Closes the modal by calling showModal with false.
	 */
	const handleClose = () => {
		showModal(false);
	};

	/**
	 * Closes the modal and navigates back to the home page.
	 */
	const handleBackHome = () => {
		showModal(false);
		router.push("/");
	};

	/**
	 * Logs the user out via the logout API, clears localStorage and navigates home.
	 */
	const handleLogout = async () => {
		try {
			const response = await axios.post("/api/logout");
			localStorage.clear();
			showModal(false);
			router.push("/");
		} catch (e) {
			console.error("Error logging out:", e);
			alert("Server Error");
		}
	};
	return (
		<div className={Styles["modal-container"]}>
			<div className={Styles["modal-wrapper"]}>
				<div className={Styles["modal-block"]}>
					<div
						style={{
							display: "flex",
							justifyContent: "end",
							alignItems: "center",
						}}
					>
						<IoClose
							className={Styles["modal-cross"]}
							color="white"
							onClick={handleClose}
						/>
					</div>

					<div className={Styles["modal-text"]}>
						<h1>Log Out</h1>
						<p>Are you sure you want to logout?</p>
					</div>
					<div className={Styles["modal-btn"]}>
						<button
							className={Styles["modal-cancel-btn"]}
							onClick={handleBackHome}
						>
							No. Return to Home
						</button>
						<button
							className={Styles["modal-logout-btn"]}
							onClick={handleLogout}
						>
							Log Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
