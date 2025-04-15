import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredientById } from '../../store/slices/ingredientSlice';
import { addItem } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const IngredientDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedIngredient: ingredient, loading, error } = useSelector(state => state.ingredients);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      console.log('Fetching ingredient with ID:', id);
      dispatch(fetchIngredientById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (ingredient && ingredient.stock > 0) {
      dispatch(addItem({
        _id: ingredient._id,
        name: ingredient.name,
        price: parseFloat(ingredient.price),
        quantity: parseInt(quantity)
      }));
      toast.success(`${quantity} ${ingredient.name} added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-900">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> The ingredient you're looking for doesn't exist.</span>
        </div>
        <div className="mt-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-900">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = ingredient.stock > 0;
  const hasEnoughStock = ingredient.stock >= quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
            <img
              src={ingredient.image || 'https://via.placeholder.com/500x500?text=No+Image'}
              alt={ingredient.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Ingredient info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{ingredient.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Ingredient information</h2>
            <p className="text-3xl text-gray-900">
              ${typeof ingredient.price === 'number' ? ingredient.price.toFixed(2) : '0.00'}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              {ingredient.description && (
                <p className="text-gray-500">{ingredient.description}</p>
              )}
              <p>Category: {ingredient.category || 'N/A'}</p>
              <p>Stock: {ingredient.stock || 0} units</p>
              <p>Availability: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAvailable ? 'In Stock' : 'Out of Stock'}
              </span></p>
            </div>
          </div>

          <div className="mt-8 flex">
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-700">Quantity</label>
              <select
                id="quantity"
                name="quantity"
                className="rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                disabled={!isAvailable}
              >
                {[...Array(Math.min(10, ingredient.stock))].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable || !hasEnoughStock}
              className={`w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                !isAvailable || !hasEnoughStock ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add to cart
            </button>
          </div>

          {!isAvailable && (
            <p className="mt-2 text-sm text-red-600">This ingredient is currently out of stock.</p>
          )}
          {isAvailable && !hasEnoughStock && (
            <p className="mt-2 text-sm text-red-600">Not enough stock available. Only {ingredient.stock} units left.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails; 