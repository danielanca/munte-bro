import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCartItems } from "./components/CartPage/CartPage";

// Define the shape of your context state
interface AppContextType {
  cartItems: number;
  setCartItems: (val: number) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<number>(() => getCartItems() ?? 0); // Provide fallback if null

  useEffect(() => {
    // Function to update cart items
    const updateCartItems = () => {
      const totalItems = getCartItems() ?? 0; // Provide fallback if null
      setCartItems(totalItems); // Update the state
    };

    // Perform an initial fetch of the cart items with a slight delay for safety (if needed)
    const initialFetch = setTimeout(() => {
      let cartFirstTime = getCartItems() ?? 0; // Provide fallback if null
      if (cartItems === 0) {
        setCartItems(cartFirstTime);
      }
    }, 1500); // You can adjust the delay time here if needed

    // Event listener for localStorage changes (to handle changes in other tabs)
    const handleStorageChange = () => {
      updateCartItems(); // Fetch the updated total items from localStorage
    };

    // Listen for storage changes (cross-tab sync)
    window.addEventListener("storage", handleStorageChange);

    // Cleanup: clear the timeout and remove event listener when component unmounts
    return () => {
      clearTimeout(initialFetch);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [cartItems]); // Empty dependency array ensures it runs only once after the component mounts

  return <AppContext.Provider value={{ cartItems, setCartItems }}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
