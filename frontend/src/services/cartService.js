// Cart service to manage shopping cart using localStorage

// Get cart items from localStorage
export const getCartItems = () => {
  const cartItems = localStorage.getItem('cartItems');
  return cartItems ? JSON.parse(cartItems) : [];
};

// Save cart items to localStorage
const saveCartItems = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

// Add item to cart
export const addItemToCart = (item) => {
  const cartItems = getCartItems();
  
  // Check if item already exists in cart
  const existingItemIndex = cartItems.findIndex(cartItem => cartItem.ingredient._id === item.ingredient._id);
  
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cartItems[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item if it doesn't exist
    cartItems.push(item);
  }
  
  saveCartItems(cartItems);
  return cartItems;
};

// Remove item from cart
export const removeItemFromCart = (itemId) => {
  const cartItems = getCartItems();
  const updatedCartItems = cartItems.filter(item => item.ingredient._id !== itemId);
  saveCartItems(updatedCartItems);
  return updatedCartItems;
};

// Update item quantity in cart
export const updateItemQuantity = (itemId, quantity) => {
  const cartItems = getCartItems();
  
  const updatedCartItems = cartItems.map(item => {
    if (item.ingredient._id === itemId) {
      return { ...item, quantity };
    }
    return item;
  });
  
  saveCartItems(updatedCartItems);
  return updatedCartItems;
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem('cartItems');
  return [];
};

// Calculate cart total
export const calculateCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + (item.ingredient.price * item.quantity), 0);
};

// Get cart item count
export const getCartItemCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}; 