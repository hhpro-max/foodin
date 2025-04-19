import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../store/slices/cartSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { createNewOrder } from '../../store/slices/orderSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('pay_in_place'); // Default payment method
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'نام الزامی است';
    if (!formData.email) newErrors.email = 'ایمیل الزامی است';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'ایمیل نامعتبر است';
    if (!formData.address) newErrors.address = 'آدرس الزامی است';
    if (!formData.city) newErrors.city = 'شهر الزامی است';
    if (!formData.state) newErrors.state = 'استان الزامی است';
    if (!formData.zipCode) newErrors.zipCode = 'کد پستی الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('برای ادامه لطفا وارد شوید.');
      navigate('/login');
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          ingredient: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'pay_in_place' ? 'pending' : 'pending',
      };

      await dispatch(createNewOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success('سفارش با موفقیت ثبت شد!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.message || 'خطا در ثبت سفارش');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">تکمیل خرید</h1>
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">سبد خرید شما خالی است.</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ادامه خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">تکمیل خرید</h1>
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">اطلاعات ارسال</h2>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    نام و نام خانوادگی
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    ایمیل
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.email ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    آدرس
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.address ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    شهر
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.city ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    استان
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.state ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    کد پستی
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.zipCode ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">روش پرداخت</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    id="pay_in_place"
                    name="payment_method"
                    type="radio"
                    checked={paymentMethod === 'pay_in_place'}
                    onChange={() => handlePaymentMethodChange('pay_in_place')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="pay_in_place" className="ml-3 block text-sm font-medium text-gray-700">
                    پرداخت در محل
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="online_payment"
                    name="payment_method"
                    type="radio"
                    checked={paymentMethod === 'online_payment'}
                    onChange={() => handlePaymentMethodChange('online_payment')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="online_payment" className="ml-3 block text-sm font-medium text-gray-700">
                    پرداخت آنلاین
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="credit_payment"
                    name="payment_method"
                    type="radio"
                    checked={paymentMethod === 'credit_payment'}
                    onChange={() => handlePaymentMethodChange('credit_payment')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="credit_payment" className="ml-3 block text-sm font-medium text-gray-700">
                    پرداخت اعتباری
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'online_payment' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-700">
                    پرداخت آنلاین به زودی در دسترس خواهد بود.
                  </p>
                </div>
              )}
              
              {paymentMethod === 'credit_payment' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-700">
                    پرداخت اعتباری به زودی در دسترس خواهد بود.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900">خلاصه سفارش</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.image || 'https://via.placeholder.com/150x150?text=No+Image'}
                      alt={item.name}
                      className="h-16 w-16 object-center object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">تعداد: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-900">مجموع</p>
                  <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting || paymentMethod !== 'pay_in_place'}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'در حال پردازش...' : 'ثبت سفارش'}
              </button>
            </div>
            {errors.submit && (
              <div className="mt-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 