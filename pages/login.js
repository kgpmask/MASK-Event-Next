import React from "react";
import styles from "@/styles/Auth.module.css";
import SignInForm from "@/components/Auth/SignInForm";
import SignUpForm from "@/components/Auth/SignUpForm";
import { useState } from "react";
const App = () => {
  const [authState, setAuthState] = useState("signup");

  return (
    <div className={styles.container}>
      <div className={styles.Wrapper}>
        <div className={styles.btnWrapper}>
          <button
            className={`${authState === "signup" ? styles.active : ""}`}
            onClick={() => setAuthState("signup")}
          >
            Sign Up
          </button>
          <button
            className={`${authState === "signin" ? styles.active : ""}`}
            onClick={() => setAuthState("signin")}
          >
            Sign In
          </button>
        </div>
        {authState === "signin" && <SignInForm />}
        {authState === "signup" && <SignUpForm />}
      </div>
    </div>
  );
};
export default App;
