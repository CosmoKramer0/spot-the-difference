import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { gameApi, ApiError } from '../utils/api';

const GameStart: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setGameSession = useGameStore((state) => state.setGameSession);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartGame = async () => {
    if (!token) {
      navigate('/');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await gameApi.startGame(token);
      setGameSession(response.sessionId!, new Date(response.startTime!));
      navigate('/game');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to start game. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome{user?.name ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Find the different icon in each set as fast as you can!
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">How to Play:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Look for the icon that's different from the others</li>
              <li>• Tap the different icon to proceed</li>
              <li>• Complete all 10 rounds as quickly as possible</li>
              <li>• Your time will be recorded for the leaderboard</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-green-400 transition duration-200 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Starting Game...
            </div>
          ) : (
            '🚀 Start Game'
          )}
        </button>
      </div>
    </div>
  );
};

export default GameStart;