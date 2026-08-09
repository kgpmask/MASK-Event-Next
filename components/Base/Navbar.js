import nextImage from "next/image";
const Image = nextImage.default || nextImage;
import Styles from "@/styles/Navbar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LogOutModal } from "@/components/profile/LogOutModal.js";

/**
 * Navbar component that displays navigation links, login/logout actions and a responsive hamburger menu.
 * @returns {JSX.Element} The navbar markup.
 */
export const Navbar = () => {
	const [showLogOutModal, setShowLogOutModal] = useState(false);
	const [burgerOpen, setBurgerOpen] = useState(false);
	const [username, setUsername] = useState("");

	const navItems = [
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Sample Quiz",
			href: "/samplequiz",
		},
		{
			name: "Quiz Portal",
			href: "/live",
		},
		{
			name: "Profile",
			href: "/profile",
			hidden: true,
		},
	];

	const router = useRouter();
	const disableLogo = router.pathname.startsWith("/live");

	/**
	 * Toggles the burger-open class on the content wrapper whenever the burger menu state changes.
	 * @param {boolean} burgerOpen - Whether the burger menu is currently open.
	 */
	useEffect(() => {
		document.querySelector("#content-wrap").className = burgerOpen
			? "burger-open"
			: "";
	}, [burgerOpen]);

	/**
	 * Opens the logout confirmation modal.
	 */
	const handleLogout = () => {
		setShowLogOutModal(true);
	};

	/**
	 * Reads the logged-in user's details from localStorage on mount and updates the username state.
	 */
	useEffect(() => {
		if (
			!document.cookie.includes("sessionId=") ||
			document.cookie.split("sessionId=").pop().split(";")[0] === ""
		)
			return localStorage.clear() || setUsername("");
		const username = localStorage.getItem("username");
		if (!username) setUsername("");
		else setUsername(localStorage.getItem("name") || "User");
	}, []);

	return (
		<div className={Styles["container"]}>
			<div className={Styles["content"]}>
				{disableLogo ? (
					<div
						style={{
							padding: "16px 16px",
							verticalAlign: "middle",
						}}
						className="nohover"
					>
						<Image
							src="/logo.jpeg"
							alt="Logo"
							width={40}
							height={40}
							className={Styles["logo"]}
						/>
					</div>
				) : (
					<Link
						href="/"
						style={{
							padding: "16px 16px",
							verticalAlign: "middle",
						}}
						className="nohover"
						target="_self"
					>
						<Image
							src="/logo.jpeg"
							alt="Logo"
							width={40}
							height={40}
							className={Styles["logo"]}
						/>
					</Link>
				)}

				<ul className={Styles["list"]}>
					{navItems
						.filter(
							(item) =>
								(item.name === "Profile" && username) || item.name !== "Profile"
						)
						.map((item, index) => (
							<li key={index}>
								<Link href={item.href} className={Styles["navlink"]}>
									{item.name}
								</Link>
							</li>
						))}
					{username ? (
						<button className={Styles["list-item"]} onClick={handleLogout}>
							Logout
						</button>
					) : (
						<button
							className={Styles["list-item"]}
							onClick={() => {
								router.push("/login");
							}}
						>
							Login
						</button>
					)}
				</ul>
				<button
					onClick={() => setBurgerOpen(!burgerOpen)}
					className={
						burgerOpen
							? Styles["burger"] + " " + Styles["open"]
							: Styles["burger"]
					}
				>
					<div className={Styles["patty"]}></div>
				</button>
				<div
					className={
						burgerOpen
							? Styles["hamburger-menu"] + " " + Styles["slide"]
							: Styles["hamburger-menu"]
					}
				>
					{navItems
						.filter(
							(item) =>
								(item.name === "Profile" && username) || item.name !== "Profile"
						)
						.map((item, index) => (
							<li key={index}>
								<Link
									href={item.href}
									className={Styles["burger-link"]}
									onClick={() => setBurgerOpen(false)}
								>
									{item.name}
								</Link>
							</li>
						))}
					{username ? (
						<button
							style={{
								backgroundColor: "transparent",
								outline: "none",
								border: "none",
							}}
							className={Styles["burger-link"]}
							onClick={() => setShowLogOutModal(true)}
						>
							Logout
						</button>
					) : (
						<Link
							href="/login"
							className={Styles["burger-link"]}
							onClick={() => setBurgerOpen(false)}
						>
							Login
						</Link>
					)}
				</div>
			</div>
			{showLogOutModal && (
				<LogOutModal
					showModal={(val) => {
						setBurgerOpen(false);
						setShowLogOutModal(val);
					}}
				/>
			)}
		</div>
	);
};
