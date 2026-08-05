import React, { useEffect, useState } from "react";
import nextImage from "next/image";
import Styles from "@/styles/Profile.module.css";
import { FaCamera } from "react-icons/fa";
import { LogOutModal } from "@/components/profile/LogOutModal";
import { EditProfilePicModal } from "@/components/profile/EditProfilePicModal";
import { useRouter } from "next/router";

const Image = nextImage.default || nextImage;

/**
 * Profile page that displays the logged-in user's details and lets them change their profile picture.
 * @returns {JSX.Element} The profile page markup.
 */
export default function Profile() {
	const [showLogOutModal, setShowLogOutModal] = useState(false);
	const [showProfilePicModal, setShowProfilePicModal] = useState(false);
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [profilePic, setProfilePic] = useState("/default");
	const router = useRouter();

	useEffect(() => {
		let isMounted = true;

		/**
		 * Loads the user's stored details into state or redirects to login if absent.
		 */
		async function fetchData() {
			const storedUser = localStorage.getItem("username");
			if (storedUser) {
				setUsername(localStorage.getItem("username"));
				setName(localStorage.getItem("name"));
				setProfilePic(localStorage.getItem("profilePic") || "/default");
			} else if (isMounted) {
				return router.push("/login");
			}
		}
		fetchData();

		return () => {
			isMounted = false;
		};
	}, [router]);

	/**
	 * Sends the updated profile picture to the server and updates local state.
	 * @param {object} ctx - The update context containing the new profilePic.
	 * @param {string} ctx.profilePic - The newly selected profile picture value.
	 */
	async function submitFunction(ctx) {
		try {
			const response = await fetch("/api/update-profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					profilePic,
				}),
			});
			if (response.status >= 400) throw await response.text();
			if (ctx.profilePic !== undefined) {
				setProfilePic(ctx.profilePic);
				localStorage.setItem("profilePic", ctx.profilePic);
			}
		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		}
	}

	/**
	 * Opens the logout confirmation modal.
	 */
	const handleLogout = () => {
		setShowLogOutModal(true);
	};

	/**
	 * Opens the profile picture selection modal.
	 */
	const handleProfilePicModal = () => {
		setShowProfilePicModal(true);
	};

	return (
		<div className={Styles["container"]}>
			<div className={Styles["wrapper"]}>
				<div style={{ borderRadius: "10px" }}>
					<div className={Styles["block"]}>
						<Image
							src={`/profile-pics/${profilePic}.webp`}
							alt="MASK"
							width={350}
							height={120}
						/>
					</div>
					<div
						className={Styles["profile-img-wrapper"]}
						onClick={handleProfilePicModal}
					>
						<Image
							src={`/profile-pics/${profilePic}.webp`}
							alt="MASK"
							className={Styles["profile-img"]}
							width={100}
							height={100}
						/>
						<FaCamera className={Styles["camera-icon"]} />
					</div>
				</div>
				<div className={Styles["bottom-content"]}>
					<div className={Styles["profile-info"]}>
						<div
							style={{
								display: "flex",
								gap: "10px",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<h1>{name}</h1>
						</div>
						<span>{username}</span>
					</div>
					<button onClick={handleLogout} className={Styles["logout-btn"]}>
						Log Out
					</button>
				</div>
			</div>
			{showLogOutModal && <LogOutModal showModal={setShowLogOutModal} />}
			{showProfilePicModal && (
				<EditProfilePicModal
					showModal={setShowProfilePicModal}
					profilePic={profilePic}
					submitFunction={submitFunction}
				/>
			)}
		</div>
	);
}
