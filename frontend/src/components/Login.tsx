import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import { authApi, ApiError } from '../utils/api';

interface LoginForm {
  name: string;
  phone: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.register(data.name.trim(), data.phone.trim());
      setAuth(response.user, response.token!);
      navigate('/start');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-6 sm:p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Spot the Difference
          </h1>
          <p className="text-sm sm:text-base text-gray-300">Enter your details to start the challenge</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600/50 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              type="text"
              className={`w-full px-3 py-3 sm:px-4 bg-gray-700 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-white placeholder-gray-400 text-base ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              style={{'--tw-ring-color': '#0B63DD'} as any}
              onFocus={(e) => e.target.style.borderColor = '#0B63DD'}
              onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#6b7280'}
              placeholder="Enter your name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              type="tel"
              className={`w-full px-3 py-3 sm:px-4 bg-gray-700 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-white placeholder-gray-400 text-base ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              }`}
              style={{'--tw-ring-color': '#0B63DD'} as any}
              onFocus={(e) => e.target.style.borderColor = '#0B63DD'}
              onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#6b7280'}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg disabled:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 mt-6"
            style={{backgroundColor: isLoading ? '#6b7280' : '#0B63DD'}}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#094fb8')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#0B63DD')}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Joining Challenge...
              </div>
            ) : (
              'Begin Challenge'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;