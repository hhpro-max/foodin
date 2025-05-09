import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/vazirmatn';
import { fetchCurrentUser } from './store/slices/authSlice';

// Layouts
import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';

// Public views
import Home from './views/Home';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import IngredientDetails from './views/ingredients/IngredientDetails';
import IngredientList from './views/ingredients/IngredientList';
import Cart from './views/cart/Cart';
import Checkout from './views/cart/Checkout';
import OrderHistory from './views/orders/OrderHistory';
import OrderDetails from './views/orders/OrderDetails';
import Profile from './views/profile/Profile';
import TestPage from './views/TestPage';

// Admin views
import AdminDashboard from './views/admin/Dashboard';
import AdminIngredientList from './views/admin/ingredients/IngredientList';
import IngredientForm from './views/admin/ingredients/IngredientForm';
import OrderList from './views/admin/orders/OrderList';
import AdminOrderDetails from './views/admin/orders/OrderDetails';

// Auth guard component
const PrivateRoute = ({ children, requiresAdmin = false }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiresAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Guest route component (for login/register)
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            rtl={true}
            theme="colored"
          />
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
              <Route path="ingredients" element={<IngredientList />} />
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
              <Route path="profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="test" element={<TestPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={
              <PrivateRoute requiresAdmin>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="ingredients" element={<AdminIngredientList />} />
              <Route path="ingredients/new" element={<IngredientForm />} />
              <Route path="ingredients/:id/edit" element={<IngredientForm />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App; 