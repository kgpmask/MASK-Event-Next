import { IoIosArrowDown } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useState } from "react";
import Styles from "@/styles/FAQ.module.css";
import { FaRegCircleCheck } from "react-icons/fa6";
import Link from "next/link";

/**
 * FAQ component that renders a single collapsible question-answer item.
 * @param {object} props - The component props.
 * @param {string} props.heading - The FAQ question heading.
 * @param {string} props.description - The FAQ answer description.
 * @param {function} props.onClick - Callback fired when the question is clicked.
 * @param {boolean} props.expanded - Whether the answer section is expanded.
 * @returns {JSX.Element} The FAQ item markup.
 */
export function FAQ({ heading, description, onClick, expanded }) {
	return (
		<div className={Styles["FAQs"]}>
			<div className={Styles["Qna"]} onClick={onClick}>
				<FaRegCircleCheck style={{ marginRight: "10px" }} />
				<p>{heading}</p>
				<IoIosArrowDown
					style={{
						transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
						transition: "all 0.5s ease",
					}}
				/>
			</div>
			<div
				className={
					expanded ? Styles["Ans"] + " " + Styles["open"] : Styles["Ans"]
				}
			>
				<p>
					{description}{" "}
					{heading.toLowerCase().includes("register") ? (
						<Link href="/login" style={{ color: "var(--red)" }}>
							{" "}
							here{" "}
						</Link>
					) : null}
				</p>
			</div>
		</div>
	);
}
