import React, { useState, useEffect } from 'react';
import { getAllIngredients } from '../services/ingredientService';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const CATEGORIES = ['dairy', 'meat', 'vegetables', 'spices', 'grains', 'other'];

const Home = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  useEffect(() => {
    fetchIngredients();
  }, []);
  
  const fetchIngredients = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllIngredients(filters);
      if (response.success) {
        setIngredients(response.data);
      } else {
        setError('Failed to fetch ingredients');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching ingredients');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchIngredients({ search: term, category: selectedCategory });
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchIngredients({ search: searchTerm, category });
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fresh Ingredients for Your Kitchen
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our wide selection of high-quality ingredients for your culinary adventures.
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-center">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search ingredients..."
          />
        </div>
        
        <div className="flex justify-center">
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      
      {/* Ingredients Grid */}
      {ingredients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ingredients.map((ingredient) => (
            <ProductCard
              key={ingredient._id}
              ingredient={ingredient}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No ingredients found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Home; 