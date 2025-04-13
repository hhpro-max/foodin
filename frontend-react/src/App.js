import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layouts
import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';

// Public views
import Home from './views/Home';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import IngredientDetails from './views/ingredients/IngredientDetails';
import Cart from './views/cart/Cart';
import Checkout from './views/cart/Checkout';
import OrderHistory from './views/orders/OrderHistory';
import OrderDetails from './views/orders/OrderDetails';
import TestPage from './views/TestPage';

// Admin views
import AdminDashboard from './views/admin/Dashboard';
import IngredientList from './views/admin/ingredients/IngredientList';
import IngredientForm from './views/admin/ingredients/IngredientForm';
import OrderList from './views/admin/orders/OrderList';

// Auth guard component
const PrivateRoute = ({ children, requiresAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiresAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Guest route component (for login/register)
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } />
              <Route path="register" element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              } />
              <Route path="ingredients/:id" element={<IngredientDetails />} />
              <Route path="cart" element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } />
              <Route path="checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              <Route path="orders" element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              } />
              <Route path="orders/:id" element={
                <PrivateRoute>
                  <OrderDetails />
                </PrivateRoute>
              } />
              <Route path="test" element={<TestPage />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <PrivateRoute requiresAdmin={true}>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="ingredients" element={<IngredientList />} />
              <Route path="ingredients/create" element={<IngredientForm />} />
              <Route path="ingredients/:id/edit" element={<IngredientForm />} />
              <Route path="orders" element={<OrderList />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 