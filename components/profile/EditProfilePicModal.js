import React, { useState } from "react";
import Image from "next/image";
import Styles from "@/styles/Profile.module.css";
import { IoClose } from "react-icons/io5";

const profilePictures = [
	null,
	...Array.from({ length: 13 }, (_e, i) => String(i + 1)),
];

/**
 * EditProfilePicModal component that lets the user pick a new profile picture and submit it.
 * @param {object} props - The component props.
 * @param {function} props.showModal - Callback used to open/close the modal.
 * @param {string} props.profilePic - The currently selected profile picture.
 * @param {function} props.submitFunction - Async callback invoked with the selected profile picture.
 * @returns {JSX.Element} The modal markup.
 */
export function EditProfilePicModal({ showModal, profilePic, submitFunction }) {
	/**
	 * Closes the modal by calling showModal with false.
	 */
	const handleClose = () => {
		showModal(false);
	};
	const [selected, setSelected] = useState(profilePic);

	/**
	 * Toggles the selection of the given picture value.
	 * @param {string} value - The picture value to toggle.
	 */
	function toggleSelect(value) {
		if (selected === value) setSelected(null);
		else setSelected(value);
	}

	/**
	 * Submits the selected profile picture and closes the modal.
	 */
	async function submit() {
		await submitFunction({ profilePic: selected });
		showModal(false);
	}
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
					<div className={Styles["profile-pics-array"]}>
						{profilePictures.map((pic) => (
							<Image
								key={pic}
								alt=""
								src={
									pic != null
										? `/profile-pics/${pic}.webp`
										: `/profile-pics/default.webp`
								}
								className={selected == pic ? Styles["selected"] : ""}
								onClick={() => toggleSelect(pic)}
							/>
						))}
					</div>
				</div>
				<div style={{ textAlign: "center" }}>
					<button className={Styles["edit-profilepic-btn"]} onClick={submit}>
						{" "}
						Update{" "}
					</button>
				</div>
			</div>
		</div>
	);
}
