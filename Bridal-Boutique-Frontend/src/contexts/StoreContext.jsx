import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";
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
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [guestIdValue, setGuestIdValue] = useState(createGuestId);
  const [loading, setLoading] = useState(false);
  const previousUserRef = useRef(user);

  const guestId = () => {
    if (user && user.id) {
      return `user_${user.id}`;
    }
    return guestIdValue;
  };

  const resetStore = useCallback(() => {
    setCartItems([]);
    setWishlistItems([]);
    setCartCount(0);
    setWishlistCount(0);
    setLoading(false);
    localStorage.removeItem("bridal_cart");
    localStorage.removeItem("bridal_wishlist");

    const newId = `guest-${Date.now()}`;
    setGuestIdValue(newId);
    localStorage.setItem("bridal_guest_id", newId);
  }, []);

  useEffect(() => {
    const previousUser = previousUserRef.current;

    if (previousUser && !user) {
      resetStore();
    } else if (previousUser && user && previousUser.id !== user.id) {
      resetStore();
    }

    previousUserRef.current = user;
  }, [user, resetStore]);

  // Refresh cart and wishlist counts
  const refreshCounts = useCallback(async () => {
    const id = guestId();
    
    try {
      const cartRes = await axios.get(`${API_BASE}/cart/get.php?guest_id=${id}`);
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
      const wishlistRes = await axios.get(`${API_BASE}/wishlist/get.php?guest_id=${id}`);
      if (wishlistRes.data?.status) {
        const items = wishlistRes.data.data || [];
        setWishlistItems(items);
        setWishlistCount(items.length);
      }
    } catch (error) {
      console.error("Wishlist count refresh failed:", error);
    }
  }, [user, guestIdValue]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  // Clear cart function
  const clearCart = async () => {
    setLoading(true);
    try {
      const id = guestId();
      // Clear from server
      await axios.delete(`${API_BASE}/cart/clear.php?guest_id=${id}`);
      
      // Clear from state
      setCartItems([]);
      setCartCount(0);
      
      // Clear from localStorage
      localStorage.removeItem("bridal_cart");
      
      return { status: true, message: "Cart cleared successfully" };
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Even if server fails, clear local state
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem("bridal_cart");
      return { status: false, message: "Failed to clear cart" };
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1, price = 0) => {
    try {
      const id = guestId();
      const response = await axios.post(`${API_BASE}/cart/add.php`, {
        guest_id: id,
        product_id: productId,
        quantity: quantity,
        price: price
      });
      
      if (response.data?.status) {
        await refreshCounts();
        return { status: true, message: "Added to cart" };
      } else {
        return { status: false, message: response.data?.message || "Failed to add to cart" };
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      return { status: false, message: "Error adding to cart" };
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/cart/delete.php?id=${cartItemId}`);
      await refreshCounts();
      return { status: true, message: "Removed from cart" };
    } catch (error) {
      console.error("Remove from cart error:", error);
      return { status: false, message: "Failed to remove from cart" };
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (cartItemId, quantity) => {
    try {
      await axios.post(`${API_BASE}/cart/update.php`, {
        id: cartItemId,
        quantity: quantity
      });
      await refreshCounts();
      return { status: true, message: "Cart updated" };
    } catch (error) {
      console.error("Update cart error:", error);
      return { status: false, message: "Failed to update cart" };
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      const id = guestId();
      const response = await axios.post(`${API_BASE}/wishlist/add.php`, {
        guest_id: id,
        product_id: productId
      });
      
      if (response.data?.status) {
        await refreshCounts();
        return { status: true, message: "Added to wishlist" };
      } else {
        return { status: false, message: response.data?.message || "Failed to add to wishlist" };
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
      return { status: false, message: "Error adding to wishlist" };
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await axios.delete(`${API_BASE}/wishlist/delete.php?id=${wishlistItemId}`);
      await refreshCounts();
      return { status: true, message: "Removed from wishlist" };
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      return { status: false, message: "Failed to remove from wishlist" };
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  // Change cart count (for manual updates)
  const changeCartCount = (delta = 1) => {
    setCartCount((prev) => Math.max(0, prev + delta));
  };

  // Change wishlist count (for manual updates)
  const changeWishlistCount = (delta = 1) => {
    setWishlistCount((prev) => Math.max(0, prev + delta));
  };

  const value = useMemo(() => ({
    cartCount,
    wishlistCount,
    cartItems,
    wishlistItems,
    loading,
    refreshCounts,
    clearCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    changeCartCount,
    changeWishlistCount,
    incrementCartCount: changeCartCount,
    incrementWishlistCount: changeWishlistCount,
    guestId,
    clearStore: resetStore,
  }), [cartCount, wishlistCount, cartItems, wishlistItems, loading, resetStore]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);