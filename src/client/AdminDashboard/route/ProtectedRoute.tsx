import React, { ComponentType, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation added
import LoginContext from "../store/loginContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../client/firebase";

interface ProtectedRouteProps {
  component: ComponentType<any>; // Accepts any component type
  [key: string]: any;            // Allows passing additional props
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const loginCtx = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const auth = getAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data()?.admin) {
            setIsAdmin(true);
            loginCtx.toggleLogin();
          } else {
            setIsAdmin(false);
            navigate("/login", {
              replace: true,
              state: { from: location.pathname }, // Pass the current path to login
            });
          }
        } catch (error) {
          setIsAdmin(false);
          navigate("/login", {
            replace: true,
            state: { from: location.pathname }, // Pass the current path to login
          });
        } finally {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
        navigate("/login", {
          replace: true,
          state: { from: location.pathname }, // Pass the current path to login
        });
      }
    });

    return () => unsubscribe();
  }, [auth, loginCtx, navigate, location]);

  if (loading) {
    return <div>Loading...</div>; // Replace with your LoadingSpinner
  }

  if (!isAdmin) {
    return null; // No need to render anything if not admin
  }

  // Render the passed component when user is an admin
  return <Component {...rest} />;
};

export default ProtectedRoute;
