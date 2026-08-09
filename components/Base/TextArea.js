import React from "react";
import Styles from "@/styles/Base.module.css";

/**
 * TextArea component that renders a titled card container for its children.
 * @param {object} props - The component props.
 * @param {string} props.title - The title to display in the card heading.
 * @param {JSX.Element} props.children - The content to render inside the card.
 * @returns {JSX.Element} The card markup.
 */
export const TextArea = ({ title, children }) => (
	<div className={Styles["text-container"]}>
		<div className={Styles["card"]}>
			<h2
				style={{ marginBottom: "10px", color: "white" }}
				className={Styles["title"]}
			>
				{title}
			</h2>
			{children}
		</div>
	</div>
);
