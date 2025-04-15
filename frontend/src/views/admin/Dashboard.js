import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../../store/slices/ingredientSlice';
import { fetchOrders } from '../../store/slices/orderSlice';
import { translations } from '../../config/translations';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: ingredients = [], loading: ingredientsLoading } = useSelector((state) => state.ingredients);
  const { items: orders = [], loading: ordersLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchOrders());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'در انتظار';
      case 'processing':
        return 'در حال پردازش';
      case 'shipped':
        return 'ارسال شده';
      case 'delivered':
        return 'تحویل داده شده';
      case 'cancelled':
        return 'لغو شده';
      default:
        return status;
    }
  };

  const getOrderStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const pendingOrders = getOrderStatusCount('pending');
  const processingOrders = getOrderStatusCount('processing');
  const shippedOrders = getOrderStatusCount('shipped');
  const deliveredOrders = getOrderStatusCount('delivered');
  const cancelledOrders = getOrderStatusCount('cancelled');

  const totalOrders = orders.length;
  const totalIngredients = ingredients.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">داشبورد مدیریت</h1>
      
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">کل سفارش‌ها</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalOrders}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders" className="font-medium text-persian-gold hover:text-persian-red">
                مشاهده همه سفارش‌ها
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">کل مواد غذایی</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{totalIngredients}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/ingredients" className="font-medium text-persian-gold hover:text-persian-red">
                مشاهده همه مواد غذایی
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">درآمد کل</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders" className="font-medium text-persian-gold hover:text-persian-red">
                مشاهده جزئیات
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">سفارش‌های در انتظار</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{pendingOrders}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/orders" className="font-medium text-persian-gold hover:text-persian-red">
                پردازش سفارش‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">سفارش‌های اخیر</h2>
          </div>
          <div className="border-t border-gray-200">
            {orders.length === 0 ? (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-500">هیچ سفارشی یافت نشد.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <li key={order.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-persian-gold truncate">
                          سفارش #{order.id}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          ثبت شده در {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mr-4 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          مجموع: ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-persian-gold hover:text-persian-red"
                        >
                          مشاهده جزئیات
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <div className="text-sm">
              <Link to="/admin/orders" className="font-medium text-persian-gold hover:text-persian-red">
                مشاهده همه سفارش‌ها
              </Link>
            </div>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">خلاصه وضعیت سفارش‌ها</h2>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        در انتظار
                      </span>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{pendingOrders} سفارش</div>
                    </div>
                  </div>
                  <div className="mr-4 flex-shrink-0">
                    <div className="text-sm text-gray-500">{Math.round((pendingOrders / totalOrders) * 100) || 0}%</div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        در حال پردازش
                      </span>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{processingOrders} سفارش</div>
                    </div>
                  </div>
                  <div className="mr-4 flex-shrink-0">
                    <div className="text-sm text-gray-500">{Math.round((processingOrders / totalOrders) * 100) || 0}%</div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ارسال شده
                      </span>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{shippedOrders} سفارش</div>
                    </div>
                  </div>
                  <div className="mr-4 flex-shrink-0">
                    <div className="text-sm text-gray-500">{Math.round((shippedOrders / totalOrders) * 100) || 0}%</div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        تحویل داده شده
                      </span>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{deliveredOrders} سفارش</div>
                    </div>
                  </div>
                  <div className="mr-4 flex-shrink-0">
                    <div className="text-sm text-gray-500">{Math.round((deliveredOrders / totalOrders) * 100) || 0}%</div>
                  </div>
                </div>
              </li>
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        لغو شده
                      </span>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{cancelledOrders} سفارش</div>
                    </div>
                  </div>
                  <div className="mr-4 flex-shrink-0">
                    <div className="text-sm text-gray-500">{Math.round((cancelledOrders / totalOrders) * 100) || 0}%</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 