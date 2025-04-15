import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../store/slices/ingredientSlice';
import ProductCard from '../components/ProductCard';
import { translations } from '../config/translations';

const CATEGORIES = [
  { id: 'dairy', name: 'لبنیات' },
  { id: 'meat', name: 'گوشت' },
  { id: 'vegetables', name: 'سبزیجات' },
  { id: 'spices', name: 'ادویه‌جات' },
  { id: 'grains', name: 'غلات' },
  { id: 'other', name: 'سایر' }
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { items: ingredients, loading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    console.log('Current state:', { selectedCategory, searchTerm });
    dispatch(fetchIngredients({ category: selectedCategory, search: searchTerm }));
  }, [dispatch, selectedCategory, searchTerm]);

  useEffect(() => {
    console.log('Ingredients state:', { ingredients, loading, error });
  }, [ingredients, loading, error]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persian-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-persian-red text-center">
          <p className="text-xl font-semibold">خطا در بارگذاری مواد غذایی</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="جستجوی مواد غذایی..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-persian-gold focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-persian-blue text-white'
                    : 'bg-persian-light text-persian-blue hover:bg-persian-gold hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ingredients Grid */}
      {ingredients && ingredients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ingredients.map((ingredient) => (
            <ProductCard key={ingredient._id} ingredient={ingredient} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">هیچ ماده غذایی یافت نشد</p>
        </div>
      )}
    </div>
  );
};

export default Home; 