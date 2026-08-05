import React, { useEffect, useState } from "react";
import nextImage from "next/image";
import Styles from "@/styles/Profile.module.css";
import { FaCamera } from "react-icons/fa";
import LogOutModal from "@/components/profile/LogOutModal";
import ProfilePicModal from "@/components/profile/EditProfilePicModal";
import { useRouter } from "next/router";

const Image = nextImage.default || nextImage;

function Profile() {
	const [showLogOutModal, setShowLogOutModal] = useState(false);
	const [showProfilePicModal, setShowProfilePicModal] = useState(false);
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [profilePic, setProfilePic] = useState("/default");
	const router = useRouter();

	// getting user data on page load
	useEffect(() => {
		let isMounted = true;

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

	// sending updated data to server
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

	const handleLogout = () => {
		setShowLogOutModal(true);
	};

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
				<ProfilePicModal
					showModal={setShowProfilePicModal}
					profilePic={profilePic}
					submitFunction={submitFunction}
				/>
			)}
		</div>
	);
}

export default Profile;
