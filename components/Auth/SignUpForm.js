import React from "react";
import { useState } from "react";
import styles from "@/styles/Auth.module.css";
import axios from "axios";
import { useRouter } from "next/router";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    // console.log(username, name, password);
    e.preventDefault();

    if (password !== confirmPass) {
      return alert("Password and Confirm Password donot match");
    }
    try {
      // console.log(username, name, password);

      const response = await axios.post("/api/register", {
        username,
        name,
        password,
        confirmPass,
      });

      localStorage.setItem("username", username);
      localStorage.setItem("name", name);
      alert(`Sucessfully Logged In as ${name}`);
      router.push("/");
    } catch (error) {
      if (error.request.status === 400) {
        alert("Username already in use!");
        return;
      } else if (error.request.status === 600) {
        alert("Username can only contain alphabets, numbers or underscore(_)");
      } else if (error.request.status === 601) {
        alert("Password should be of length 5 to 12 characters");
      } else {
        alert("Internal Server Error");
      }
    }
  };
  return (
    <div className={styles.ContentWrapper}>
      {" "}
      <p>
        Sign up now to participate in our exciting event. Please fill in the
        details below to create your account:
      </p>{" "}
      <form className={styles.inputWrapper} onSubmit={handleSubmit}>
        {" "}
        <input
          type="text"
          placeholder="Enter your Name..."
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Username..."
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Choose your Password..."
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password..."
          name="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
