import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  
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
  const [loading, setLoading] = useState(false);
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
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.address.street) {
      newErrors['address.street'] = 'Street address is required';
    }
    
    if (!formData.address.city) {
      newErrors['address.city'] = 'City is required';
    }
    
    if (!formData.address.state) {
      newErrors['address.state'] = 'State is required';
    }
    
    if (!formData.address.zipCode) {
      newErrors['address.zipCode'] = 'ZIP code is required';
    }
    
    if (!formData.address.country) {
      newErrors['address.country'] = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setAlert(null);
    
    try {
      const result = await registerUser(formData);
      if (result.success) {
        navigate('/');
      } else {
        setAlert({
          type: 'error',
          message: result.message || 'Registration failed'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'An error occurred during registration'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your account
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
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Enter your full name"
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
              placeholder="Enter your email address"
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Create a password"
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              placeholder="Confirm your password"
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Shipping Address
              </h3>
              
              <Input
                label="Street Address"
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                error={errors['address.street']}
                required
                placeholder="Enter your street address"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  error={errors['address.city']}
                  required
                  placeholder="Enter your city"
                />
                
                <Input
                  label="State"
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  error={errors['address.state']}
                  required
                  placeholder="Enter your state"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP Code"
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  error={errors['address.zipCode']}
                  required
                  placeholder="Enter your ZIP code"
                />
                
                <Input
                  label="Country"
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  error={errors['address.country']}
                  required
                  placeholder="Enter your country"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 