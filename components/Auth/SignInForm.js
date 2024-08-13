import React from "react";
import { useState } from "react";
import styles from "@/styles/Auth.module.css";
import axios from "axios";
import { useRouter } from "next/router";

const SignInForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/login", {
				username,
				password,
			});
			const res = response.data;
			localStorage.setItem("username", res.username);
			localStorage.setItem("name", res.name);
			if (res.profilePic) {
				localStorage.setItem("profilePic", res.profilePic);
			}
			alert("Sucessfully Logged In");
			router.push("/");
		} catch (error) {
			if(error.request.status === 404) {
				setUsername("");
				setPassword("");
				alert("Incorrect Username or Password. Please try again");
				return;
			} else {
				alert("Internal Server Error");
			}
		}
	};
	return (
		<div className={styles.ContentWrapper}>
			{" "}
			<p>
				Sign in to participate in our exciting event!
			</p>{" "}
			<form
				className={styles.inputWrapper}
				onSubmit={handleSubmit}
				method="POST">
				{" "}
				<input
					type="text"
					placeholder="Username..."
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password..."
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button>Sign In</button>
			</form>
		</div>
	);
};

export default SignInForm;
