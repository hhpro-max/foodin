import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../store/slices/ingredientSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { addItem, removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { selectCartItems, selectCartSubtotal, selectCartTotal } from '../store/slices/cartSlice';

const TestPage = () => {
  const dispatch = useDispatch();
  const { ingredients, loading: ingredientsLoading, error: ingredientsError } = useSelector((state) => state.ingredients);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const tax = total - subtotal;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleAddToCart = (ingredient) => {
    dispatch(addItem({
      _id: ingredient._id,
      name: ingredient.name,
      price: ingredient.price,
      image: ingredient.image,
      quantity: 1
    }));
  };

  const handleRemoveFromCart = (_id) => {
    dispatch(removeItem(_id));
  };

  const handleUpdateQuantity = (_id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ _id, quantity: parseInt(quantity) }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Test Page</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Ingredients Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Ingredients</h2>
          </div>
          <div className="border-t border-gray-200">
            {ingredientsLoading ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              </div>
            ) : ingredientsError ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {ingredientsError}</span>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {ingredients.map((ingredient) => (
                  <li key={ingredient._id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={ingredient.image || 'https://via.placeholder.com/150x150?text=No+Image'}
                            alt={ingredient.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">${ingredient.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(ingredient)}
                        className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Orders</h2>
          </div>
          <div className="border-t border-gray-200">
            {ordersLoading ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              </div>
            ) : ordersError ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {ordersError}</span>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Order #{order.id}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Total: ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
          </div>
          <div className="border-t border-gray-200">
            {cartItems.length === 0 ? (
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-500">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={item.image || 'https://via.placeholder.com/150x150?text=No+Image'}
                              alt={item.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <select
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item._id, e.target.value)}
                            className="mr-2 rounded-md border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                    <dd className="text-sm text-gray-900">${subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between mt-2">
                    <dt className="text-sm font-medium text-gray-500">Tax (10%)</dt>
                    <dd className="text-sm text-gray-900">${tax.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                    <dt className="text-base font-medium text-gray-900">Total</dt>
                    <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleClearCart}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 