import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// User context interface
export interface Context {
  name: string | null; // Make name nullable to handle no user state
  setName: (val: string | null) => void;
  isAdmin: boolean; // Admin status
  setIsAdmin: (val: boolean) => void;
  loading: boolean; // Loading state
  isLogin: boolean; // Login state
  toggleLogin: () => void; // Function to toggle login state
}

const defaultVal = {
  name: null, // No name by default
  setName: () => {},
  isAdmin: false, // Default isAdmin to false
  setIsAdmin: () => {},
  loading: true, // Initially set loading to true
  isLogin: false, // Default is not logged in
  toggleLogin: () => {}, // Default function does nothing
} as Context;

const context = React.createContext(defaultVal);

const { Provider } = context;

// **User and Authentication Context**
export const ContextWrapper = ({ children }: { children: any }) => {
  const [name, setName] = useState<string | null>(defaultVal.name);
  const [isAdmin, setIsAdmin] = useState(defaultVal.isAdmin);
  const [loading, setLoading] = useState(defaultVal.loading);
  const [isLogin, setIsLogin] = useState(defaultVal.isLogin); // Track login state

  // Function to toggle login state
  const toggleLogin = () => {
    setIsLogin(prev => !prev);
  };

  // User authentication and data fetching logic
  useEffect(() => {
    setLoading(true); // Start loading

    // Firebase authentication state listener
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        try {
          console.log("User is authenticated:", user); // Debugging log
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data from Firestore:", userData);
            setName(userData.email || null); // Set the user's name or null
            setIsAdmin(userData.admin || false); // Set the isAdmin status
            setIsLogin(true); // Mark the user as logged in
          } else {
            console.log("User document does not exist in Firestore.");
            setName(null); // No user document, no name
            setIsAdmin(false);
            setIsLogin(false); // Mark the user as not logged in
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      } else {
        console.log("No user is logged in.");
        setName(null); // Reset name to null
        setIsAdmin(false);
        setIsLogin(false); // Mark the user as not logged in
        setLoading(false); // No longer loading
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return <Provider value={{ name, setName, isAdmin, setIsAdmin, loading, isLogin, toggleLogin }}>{children}</Provider>;
};

export const useAppContext = () => useContext(context);

// **Products Context Interface and Provider**
interface ProductsContextType {
  ssProducts: any[]; // Replace 'any' with a more specific type if possible
  setSSproducts: React.Dispatch<React.SetStateAction<any[]>>; // Replace 'any' with a specific type
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

// **Default values for ProductsContext**
export const ProductsContext = React.createContext<ProductsContextType>({
  ssProducts: [],
  setSSproducts: () => {},
  cartCount: 0,
  setCartCount: () => {},
});

export const ProductsContextProvider = ({ children }: { children: any }) => {
  const [ssProducts, setSSproducts] = useState<any[]>([]); // Manage products
  const [cartCount, setCartCount] = useState<number>(0); // Manage cart count

  return (
    <ProductsContext.Provider value={{ ssProducts, setSSproducts, cartCount, setCartCount }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => useContext(ProductsContext);
