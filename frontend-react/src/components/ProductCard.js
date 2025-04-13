import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import Button from './Button';

const ProductCard = ({ ingredient }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await dispatch(addItem({ 
        ingredientId: ingredient._id,
        quantity: 1
      })).unwrap();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/ingredients/${ingredient._id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full">
          <img
            src={ingredient.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={ingredient.name}
            className="w-full h-full object-center object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link 
          to={`/ingredients/${ingredient._id}`}
          className="block text-lg font-medium text-gray-900 hover:text-indigo-600 truncate"
        >
          {ingredient.name}
        </Link>
        
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">
            {ingredient.category}
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${ingredient.price.toFixed(2)}
          </span>
        </div>
        
        <div className="mt-4">
          <Button
            onClick={handleAddToCart}
            loading={loading}
            fullWidth
            variant="primary"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 