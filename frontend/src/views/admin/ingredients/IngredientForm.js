import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addIngredient, editIngredient, fetchIngredientById } from '../../../store/slices/ingredientSlice';
import { toast } from 'react-toastify';
import { translations } from '../../../config/translations';

const IngredientForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error } = useSelector((state) => state.ingredients);
  const selectedIngredient = useSelector((state) => 
    state.ingredients.items.find(item => item._id === id)
  );

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (id) {
      if (selectedIngredient) {
        setFormData({
          name: selectedIngredient.name,
          price: selectedIngredient.price,
          stock: selectedIngredient.stock,
          description: selectedIngredient.description || ''
        });
      } else {
        dispatch(fetchIngredientById(id));
      }
    }
  }, [id, selectedIngredient, dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'نام ماده غذایی الزامی است';
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      errors.price = 'قیمت باید یک عدد مثبت باشد';
    }
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
      errors.stock = 'موجودی باید یک عدد غیر منفی باشد';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const ingredientData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (id) {
        await dispatch(editIngredient({ id, data: ingredientData })).unwrap();
        toast.success('ماده غذایی با موفقیت بروزرسانی شد');
      } else {
        await dispatch(addIngredient(ingredientData)).unwrap();
        toast.success('ماده غذایی با موفقیت اضافه شد');
      }
      navigate('/admin/ingredients');
    } catch (error) {
      toast.error('خطا در ذخیره ماده غذایی');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persian-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {id ? 'ویرایش ماده غذایی' : 'افزودن ماده غذایی جدید'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {id 
                ? 'اطلاعات ماده غذایی را بروزرسانی کنید.'
                : 'اطلاعات ماده غذایی جدید را وارد کنید.'}
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    نام ماده غذایی
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-persian-blue focus:border-persian-blue block w-full sm:text-sm border-gray-300 rounded-md ${
                        formErrors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    قیمت
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`shadow-sm focus:ring-persian-blue focus:border-persian-blue block w-full sm:text-sm border-gray-300 rounded-md ${
                        formErrors.price ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.price && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.price}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    موجودی
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`shadow-sm focus:ring-persian-blue focus:border-persian-blue block w-full sm:text-sm border-gray-300 rounded-md ${
                        formErrors.stock ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.stock && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.stock}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    توضیحات
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-persian-blue focus:border-persian-blue block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-persian-blue hover:bg-persian-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-persian-blue"
                >
                  {id ? 'بروزرسانی' : 'ذخیره'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IngredientForm; 