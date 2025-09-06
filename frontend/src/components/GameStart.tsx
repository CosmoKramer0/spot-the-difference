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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-6 sm:p-8 w-full max-w-lg text-center mx-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 font-medium">
            Test your visual perception with our modern pattern recognition challenge
          </p>
          
          <div className="bg-gray-700/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-600/50">
            <h3 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg">Game Objective:</h3>
            <ul className="text-sm text-gray-300 space-y-2 sm:space-y-3 text-left max-w-sm mx-auto">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#0B63DD'}}></span>
                <span>Identify the icon that differs from the others in each set</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#0B63DD'}}></span>
                <span>Click the unique icon to advance to the next round</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#0B63DD'}}></span>
                <span>Complete 6 rounds as quickly as possible</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#0B63DD'}}></span>
                <span>Compete for the fastest completion time and win rewards</span>
              </li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 backdrop-blur-sm border border-red-600/50 text-red-300 rounded-xl">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-full text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
          style={{backgroundColor: isLoading ? '#6b7280' : '#0B63DD'}}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#094fb8')}
          onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#0B63DD')}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Preparing Game...
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Start Challenge
            </span>
          )}
        </button>
        
        <div className="mt-4 sm:mt-6 flex justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
          <div className="text-center">
            <div className="font-bold text-white text-lg sm:text-xl">6</div>
            <div>Rounds</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white text-lg sm:text-xl">35</div>
            <div>Icons per Round</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white text-lg sm:text-xl">1</div>
            <div>Different Icon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStart;