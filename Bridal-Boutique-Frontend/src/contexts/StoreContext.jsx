import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const StoreContext = createContext();
const guestId = () => localStorage.getItem("bridal_guest_id") || `guest-${Date.now()}`;

export function StoreProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const refreshCounts = async () => {
    const id = guestId();
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        axios.get(`http://localhost/bridal-boutique/Bridal-Boutique-backend/api/cart/get.php?guest_id=${id}`),
        axios.get(`http://localhost/bridal-boutique/Bridal-Boutique-backend/api/wishlist/get.php?guest_id=${id}`),
      ]);

      if (cartRes.data?.status) {
        setCartItems(cartRes.data.data || []);
        setCartCount((cartRes.data.data || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0));
      }

      if (wishlistRes.data?.status) {
        setWishlistItems(wishlistRes.data.data || []);
        setWishlistCount((wishlistRes.data.data || []).length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("bridal_guest_id", guestId());
    refreshCounts();
  }, []);

  const value = useMemo(() => ({
    cartCount,
    wishlistCount,
    cartItems,
    wishlistItems,
    refreshCounts,
    guestId,
  }), [cartCount, wishlistCount, cartItems, wishlistItems]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
