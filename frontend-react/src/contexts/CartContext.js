import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getCartItems,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  calculateCartTotal,
  getCartItemCount
} from '../services/cartService';

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart on initial render
  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
    setCartTotal(calculateCartTotal());
    setItemCount(getCartItemCount());
  }, []);

  // Add item to cart
  const addItem = (item) => {
    const updatedItems = addItemToCart(item);
    setCartItems(updatedItems);
    setCartTotal(calculateCartTotal());
    setItemCount(getCartItemCount());
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedItems = removeItemFromCart(itemId);
    setCartItems(updatedItems);
    setCartTotal(calculateCartTotal());
    setItemCount(getCartItemCount());
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    const updatedItems = updateItemQuantity(itemId, quantity);
    setCartItems(updatedItems);
    setCartTotal(calculateCartTotal());
    setItemCount(getCartItemCount());
  };

  // Clear cart
  const clearCartItems = () => {
    clearCart();
    setCartItems([]);
    setCartTotal(0);
    setItemCount(0);
  };

  // Context value
  const value = {
    cartItems,
    cartTotal,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCartItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 