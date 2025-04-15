import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { translations } from '../config/translations';

const AdminLayout = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-persian-gold text-white' : 'text-persian-gold hover:bg-persian-red';
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <nav className="bg-persian-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/admin" className="text-white font-bold text-xl">
                  پنل مدیریت فودین
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="mr-10 flex items-baseline space-x-4">
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin')}`}
                  >
                    داشبورد
                  </Link>
                  <Link
                    to="/admin/ingredients"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/ingredients')}`}
                  >
                    مواد غذایی
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/orders')}`}
                  >
                    سفارش‌ها
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="max-w-xs bg-persian-gold rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-persian-blue focus:ring-white"
                  >
                    <span className="sr-only">باز کردن منوی کاربر</span>
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                      <span className="text-persian-gold font-medium">
                        {user?.name?.charAt(0) || 'ا'}
                      </span>
                    </div>
                  </button>
                </div>
                
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      بازگشت به سایت
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 