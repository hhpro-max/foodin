import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatters';
import { translations } from '../config/translations';

const ProductCard = ({ ingredient }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem({
      _id: ingredient._id,
      name: ingredient.name,
      price: ingredient.price,
      image: ingredient.image,
      quantity: 1
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pb-[56.25%]">
        <img
          src={ingredient.image || '/placeholder-image.jpg'}
          alt={ingredient.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{ingredient.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ingredient.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-yellow-600">{formatPrice(ingredient.price)}</span>
          <span className="text-sm text-gray-500">موجودی: {ingredient.stock}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={ingredient.stock === 0}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              ingredient.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {ingredient.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
          </button>
          <button
            onClick={() => window.location.href = `/ingredients/${ingredient._id}`}
            className="flex-1 py-2 px-4 rounded-md font-medium bg-persian-blue text-white hover:bg-persian-red transition-colors duration-200"
          >
            مشاهده جزئیات
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 