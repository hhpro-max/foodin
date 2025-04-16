import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../../store/slices/ingredientSlice';
import { translations } from '../../config/translations';

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
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{translations.fa.ingredients}</h1>
          <p className="mt-2 text-sm text-gray-700">
            همه مواد غذایی موجود در سیستم را مشاهده کنید.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ingredients.map((ingredient) => {
          // Handle image rendering
          let imageSrc = '/placeholder-image.jpg';
          if (ingredient.image) {
            if (typeof ingredient.image === 'string') {
              if (ingredient.image.startsWith('data:')) {
                imageSrc = ingredient.image;
              } else if (ingredient.image.length > 100) {
                imageSrc = `data:image/png;base64,${ingredient.image}`;
              } else {
                imageSrc = ingredient.image;
              }
            } else if (ingredient.image && ingredient.image.$binary) {
              imageSrc = `data:image/png;base64,${ingredient.image.$binary}`;
            }
          }
          return (
            <div key={ingredient._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-12 w-12 rounded-full object-cover" 
                      src={imageSrc} 
                      alt={ingredient.name} 
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {ingredient.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ingredient.price.toLocaleString('fa-IR')} تومان
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
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-persian-blue bg-persian-gold hover:bg-persian-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-persian-blue"
                  >
                    {translations.fa.view}
                  </Link>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">موجودی: </span>
                  <span className={`font-medium ${ingredient.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ingredient.stock > 0 ? `${ingredient.stock} عدد موجود` : 'ناموجود'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IngredientList; 