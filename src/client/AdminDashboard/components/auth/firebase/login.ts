// src/auth.ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase";

// Define the function to log in users
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Error logging in:", (error as Error).message);
  }
};
