// src/client/AdminDashboard/components/auth/signup/Signup.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { signup } from '../firebase/signup';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      await signup(email, password, isAdmin);
      console.log('Signup successful');
      // Redirect to the admin dashboard or login page after successful signup
      navigate('/admin/login');
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Admin Signup</h2>
      <form onSubmit={handleSignup} className={styles.form}>
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
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className={styles.checkbox}
          />
          Is Admin
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
