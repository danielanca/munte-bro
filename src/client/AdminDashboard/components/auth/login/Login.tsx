import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./Login.module.css";
import { login } from "../firebase/login";
import { useAppContext } from "../../../../Context"; // Access the updated context

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleLogin } = useAppContext(); // Use the context to toggle login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      await login(email, password);
      console.log("Login successful");
      toggleLogin(); // Call toggleLogin on successful login

      // Redirect to the path the user came from, or default to /admin
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
          required
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      <p className={styles.signupText}>
        Don't have an account? <Link to="/admin/signup" className={styles.signupLink}>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
