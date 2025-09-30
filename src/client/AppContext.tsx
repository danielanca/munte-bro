import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCartItems } from "./components/CartPage/CartPage1";

// Define the shape of your context state
interface AppContextType {
  cartItems: number;
  setCartItems: (val: number) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return getCartItems() ?? 0;
    }
    return 0;
  });

  useEffect(() => {
    // Function to update cart items
    const updateCartItems = () => {
      const totalItems = getCartItems() ?? 0;
      setCartItems(totalItems);
    };

    // Perform an initial fetch of the cart items with a slight delay for safety
    const initialFetch = setTimeout(() => {
      const cartFirstTime = getCartItems() ?? 0;
      if (cartItems === 0) {
        setCartItems(cartFirstTime);
      }
    }, 1500);

    // Event listener for localStorage changes (to handle changes in other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cartData") {
        updateCartItems();
      }
    };

    // Custom event listener for cart updates within the same tab
    const handleCartUpdate = () => {
      updateCartItems();
    };

    // Listen for storage changes (cross-tab sync)
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for custom cart update events (same tab)
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup: clear the timeout and remove event listeners when component unmounts
    return () => {
      clearTimeout(initialFetch);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [cartItems]);

  return (
    <AppContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};