// import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
// import { useEffect } from "react";

// const useAuthTokenExpiration = () => {
//   useEffect(() => {
//     const auth = getAuth();
//     const logoutUser = () => {
//       signOut(auth)
//         .then(() => {
//           console.log("User has been logged out");
//         })
//         .catch((error) => {
//           console.error("Error signing out:", error);
//         });
//     };

//     const monitorToken = async (user: any) => {
//       if (user) {
//         const tokenResult = await user.getIdTokenResult();
//         const expirationTime = new Date(tokenResult.expirationTime).getTime();
//         const currentTime = new Date().getTime();
//         const timeUntilExpiration = expirationTime - currentTime;

//         // Set a timeout to log out the user when the token expires
//         setTimeout(() => {
//           console.log("Token expired, logging out...");
//           logoutUser();
//         }, timeUntilExpiration);
//       }
//     };

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         monitorToken(user);
//       }
//     });

//     return () => unsubscribe();
//   }, []);
// };

// export default useAuthTokenExpiration;

import { Auth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";

// Pass the Firebase auth instance into the hook
const useAuthTokenExpiration = (auth: Auth) => {
  useEffect(() => {
    const logoutUser = () => {
      signOut(auth)
        .then(() => {
          console.log("User has been logged out");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    };

    const refreshUserToken = async (user: any) => {
      if (user) {
        try {
          // Force token refresh
          const token = await user.getIdToken(true);
          console.log("Token refreshed:", token);
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    };

    const monitorToken = async (user: any) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const expirationTime = new Date(tokenResult.expirationTime).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiration = expirationTime - currentTime;

        console.log(`Token will expire in ${timeUntilExpiration}ms`);

        // Set a timeout to refresh token shortly before expiration
        const refreshTimeout = setTimeout(() => {
          console.log("Token is about to expire, refreshing...");
          refreshUserToken(user);
        }, timeUntilExpiration - 5 * 60 * 1000); // Refresh 5 minutes before expiration

        // Set a timeout to log out the user when the token expires
        const logoutTimeout = setTimeout(() => {
          console.log("Token expired, logging out...");
          logoutUser();
        }, timeUntilExpiration);

        return () => {
          clearTimeout(refreshTimeout);
          clearTimeout(logoutTimeout);
        };
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        monitorToken(user);
      } else {
        console.log("No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, [auth]);
};

export default useAuthTokenExpiration;
