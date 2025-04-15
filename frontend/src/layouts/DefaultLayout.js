import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { selectCartItemCount } from '../store/slices/cartSlice';

const DefaultLayout = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 persian-pattern">
      {/* Navigation */}
      <nav className="bg-[#2C3E50] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-white">
                  فودین
                </Link>
              </div>
              <div className="hidden sm:mr-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-transparent text-white hover:border-[#F1C40F] hover:text-[#F1C40F] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  صفحه اصلی
                </Link>
                <Link
                  to="/ingredients"
                  className="border-transparent text-white hover:border-[#F1C40F] hover:text-[#F1C40F] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  مواد غذایی
                </Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-[#E74C3C] text-white hover:bg-[#C0392B] px-3 py-1 rounded-md text-sm font-medium inline-flex items-center"
                  >
                    پنل مدیریت
                  </Link>
                )}
                {isAuthenticated && (
                  <Link
                    to="/orders"
                    className="border-transparent text-white hover:border-[#F1C40F] hover:text-[#F1C40F] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    سفارش‌ها
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              {isAuthenticated && (
                <Link to="/cart" className="p-2 text-white hover:text-[#F1C40F] relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#E74C3C] rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center text-white hover:text-[#F1C40F] focus:outline-none"
                  >
                    <span className="ml-2">{user?.name || 'کاربر'}</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        پروفایل شما
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        سفارش‌های شما
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        خروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:text-[#F1C40F] px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ورود
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#E74C3C] text-white hover:bg-[#C0392B] px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ثبت نام
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-[#2C3E50] shadow-md mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white text-sm">
            &copy; {new Date().getFullYear()} فودین. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DefaultLayout; 