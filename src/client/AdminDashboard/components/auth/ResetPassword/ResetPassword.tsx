// src/components/ResetPassword.tsx
import React, { useState } from "react";
import styles from "./ResetPassword.module.css"; // Import the CSS module
import { resetPassword } from "../firebase/resetPassword";
const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.inputField}
          required
        />
        <button type='submit' className={styles.button}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
