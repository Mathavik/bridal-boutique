import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const StoreContext = createContext();

const createGuestId = () => {
  let id = localStorage.getItem("bridal_guest_id");
  if (!id) {
    id = `guest-${Date.now()}`;
    localStorage.setItem("bridal_guest_id", id);
  }
  return id;
};

export function StoreProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [guestIdValue] = useState(createGuestId);

  const guestId = () => guestIdValue;

  // In StoreContext.js, update the refreshCounts function to force re-render

const refreshCounts = async () => {
  const id = guestIdValue;
  
  try {
    const cartRes = await axios.get(`http://localhost/bridal-boutique/Bridal-Boutique-backend/api/cart/get.php?guest_id=${id}`);
    if (cartRes.data?.status) {
      const items = cartRes.data.data || [];
      setCartItems(items);
      const totalCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      setCartCount(totalCount);
    }
  } catch (error) {
    console.error("Cart count refresh failed:", error);
  }

  try {
    const wishlistRes = await axios.get(`http://localhost/bridal-boutique/Bridal-Boutique-backend/api/wishlist/get.php?guest_id=${id}`);
    if (wishlistRes.data?.status) {
      const items = wishlistRes.data.data || [];
      setWishlistItems(items);
      setWishlistCount(items.length);
    }
  } catch (error) {
    console.error("Wishlist count refresh failed:", error);
  }
};

  const changeCartCount = (delta = 1) => {
    setCartCount((prev) => Math.max(0, prev + delta));
  };

  const changeWishlistCount = (delta = 1) => {
    setWishlistCount((prev) => Math.max(0, prev + delta));
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  const value = useMemo(() => ({
    cartCount,
    wishlistCount,
    cartItems,
    wishlistItems,
    refreshCounts,
    changeCartCount,
    changeWishlistCount,
    incrementCartCount: changeCartCount,
    incrementWishlistCount: changeWishlistCount,
    guestId,
  }), [cartCount, wishlistCount, cartItems, wishlistItems]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
