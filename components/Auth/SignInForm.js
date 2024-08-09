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
      setUsername("");
      setPassword("");
      if (response.status == 400) {
        alert("Incorrect Username or Password. Please try again");
        return;
      }
      const { username, name } = response.json();
      localStorage.setItem("username", username);
      localStorage.setItem("name", name);
      alert("Sucessfully Logged In");
      router.push("/");
    } catch (error) {
      alert("Server error");
    }
  };
  return (
    <div className={styles.ContentWrapper}>
      {" "}
      <p>
        Sign Up now to participate in our exciting event. Please fill in the
        details below to create your account
      </p>{" "}
      <form
        className={styles.inputWrapper}
        onSubmit={handleSubmit}
        method="POST">
        {" "}
        <input
          type="text"
          placeholder="Choose your Username..."
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Choose your Password..."
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
