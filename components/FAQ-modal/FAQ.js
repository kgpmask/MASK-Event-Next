import { IoIosArrowDown } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useState } from "react";
import Styles from "@/styles/FAQ.module.css";
import { FaRegCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function FAQ({ heading, description, onClick, expanded }) {
  return (
    <div className={Styles["FAQs"]}>
      <div className={Styles["Qna"]} onClick={onClick}>
					<FaRegCircleCheck style={{ marginRight: "10px" }} />
					<p>{heading}</p>
			</div>
				<div
						className={
								expanded ? Styles["Ans"] + " " + Styles["open"] : Styles["Ans"]
						}
				>
						<p>
								{description}
								{" "}
								{heading.toLowerCase().includes("register") ? <Link href="/login" style={{color: "var(--red)"}}> here </Link> : null}
						</p>
				</div>
		</div>
	);
}
