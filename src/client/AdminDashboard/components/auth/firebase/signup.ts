// src/auth.ts
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebase"; // Ensure the correct path to your firebase config
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

// Define the function to sign up users
export const signup = async (email: string, password: string, isAdmin: boolean): Promise<void> => {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // After successful user creation, store additional fields in Firestore
    const userDocRef = doc(db, "users", user.uid); // Reference to Firestore doc for the user

    // Create the user document in Firestore
    await setDoc(userDocRef, {
      email: user.email,
      admin: isAdmin,
      createdAt: new Date(),
    });

    console.log("User data successfully added to Firestore for UID:", user.uid);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

// Function to update the user document in Firestore
export const updateUser = async (
  userId: string,
  updatedData: Partial<{ email: string; admin: boolean }>
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId); // Firestore document reference for the user

    // Update the user document
    await updateDoc(userDocRef, updatedData);

    console.log(`User data for UID ${userId} updated successfully.`);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

// Function to fetch user data from Firestore
export const getUserData = async (userId: string): Promise<any> => {
  try {
    const userDocRef = doc(db, "users", userId); // Firestore document reference for the user
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log("User data from Firestore:", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No user data found in Firestore for UID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};
