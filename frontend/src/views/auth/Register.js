import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { translations } from '../../config/translations';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'نام الزامی است';
    }
    
    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'لطفا یک ایمیل معتبر وارد کنید';
    }
    
    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'لطفا رمز عبور را تایید کنید';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
    }
    
    if (!formData.address.street) {
      newErrors['address.street'] = 'آدرس خیابان الزامی است';
    }
    
    if (!formData.address.city) {
      newErrors['address.city'] = 'شهر الزامی است';
    }
    
    if (!formData.address.state) {
      newErrors['address.state'] = 'استان الزامی است';
    }
    
    if (!formData.address.zipCode) {
      newErrors['address.zipCode'] = 'کد پستی الزامی است';
    }
    
    if (!formData.address.country) {
      newErrors['address.country'] = 'کشور الزامی است';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setAlert(null);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const resultAction = await dispatch(register(registrationData));
      if (register.fulfilled.match(resultAction)) {
        navigate('/');
      } else {
        setAlert({
          type: 'error',
          message: resultAction.payload || 'ثبت نام ناموفق بود'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'خطایی در هنگام ثبت نام رخ داد'
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ایجاد حساب کاربری
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            یا{' '}
            <Link
              to="/login"
              className="font-medium text-persian-blue hover:text-persian-red"
            >
              ورود به حساب کاربری
            </Link>
          </p>
        </div>
        
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="نام کامل"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Input
              label="ایمیل"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="رمز عبور"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Input
              label="تکرار رمز عبور"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            <Input
              label="آدرس خیابان"
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              error={errors['address.street']}
              required
            />
            <Input
              label="شهر"
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              error={errors['address.city']}
              required
            />
            <Input
              label="استان"
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              error={errors['address.state']}
              required
            />
            <Input
              label="کد پستی"
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              error={errors['address.zipCode']}
              required
            />
            <Input
              label="کشور"
              type="text"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              error={errors['address.country']}
              required
            />
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'در حال ایجاد حساب...' : 'ایجاد حساب'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 