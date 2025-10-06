import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";

import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import "firebase/storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


let analytics: any;


const firebaseConfig = {
  apiKey: "AIzaSyBU-XLXRpmXuGWH8D0XLFRGU4-UA-b_fbg",
  authDomain: "sapunmontan.firebaseapp.com",
  databaseURL: "https://sapunmontan-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sapunmontan",
  storageBucket: "sapunmontan.appspot.com",
  messagingSenderId: "763434878339",
  appId: "1:763434878339:web:287dd37cd472f368b5a2b6",
  measurementId: "G-71TJGXC0TV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Initialize Firebase Authentication
const auth = getAuth(app);
const db = getFirestore(app);


if (typeof window !== "undefined") {
  analyticsIsSupported().then(isSupported => {
    if (isSupported) {
      analytics = getAnalytics(app);
    }
  });
}


// A function to monitor authentication state
export const monitorAuthState = (onLogout: () => void) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const tokenResult = await getIdTokenResult(user);
        const expirationTime = tokenResult.expirationTime;

        // You can use this information to check expiration
        console.log("Token expiration time:", expirationTime);

        // Set up logic to refresh the token or handle logout
        // Firebase will handle automatic token refreshing by default.
      } catch (error) {
        console.error("Error fetching token result:", error);
      }
    } else {
      console.log("User is logged out");
      onLogout(); // Perform logout logic
    }
  });
};



export { auth,db,storage };
export default app;
