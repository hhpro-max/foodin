import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../../store/slices/ingredientSlice';

const IngredientList = () => {
  const dispatch = useDispatch();
  const { items: ingredients, loading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Ingredients</h1>
          <p className="mt-2 text-sm text-gray-700">
            Browse all available ingredients in our system.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ingredient) => (
          <div key={ingredient._id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {ingredient.image ? (
                    <img 
                      className="h-12 w-12 rounded-full object-cover" 
                      src={ingredient.image} 
                      alt={ingredient.name} 
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-lg">
                        {ingredient.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {ingredient.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ${ingredient.price.toFixed(2)}
                  </p>
                </div>
              </div>
              {ingredient.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {ingredient.description}
                  </p>
                </div>
              )}
              <div className="mt-4">
                <Link
                  to={`/ingredients/${ingredient._id}`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-gray-500">Stock: </span>
                <span className={`font-medium ${ingredient.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ingredient.stock > 0 ? `${ingredient.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientList; 