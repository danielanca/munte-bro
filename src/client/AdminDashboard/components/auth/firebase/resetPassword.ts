// src/auth.ts
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebase";

// Function to reset password by sending an email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Error sending password reset email:", (error as Error).message);
  }
};
