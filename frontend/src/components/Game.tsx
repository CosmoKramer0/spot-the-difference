import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { iconApi, gameApi, ApiError } from '../utils/api';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const {
    currentRound,
    totalRounds,
    sessionId,
    isGameActive,
    isGameComplete,
    currentIconSet,
    setIconSets,
    nextRound,
    endGame,
    selectIcon,
    resetGame
  } = useGameStore();

  const timer = useTimer();
  const { playCorrectSound, playIncorrectSound, playGameCompleteSound } = useSound();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);

  useEffect(() => {
    if (!token || !sessionId) {
      navigate('/');
      return;
    }

    loadIconSets();
    timer.start();
  }, [token, sessionId]);

  useEffect(() => {
    if (isGameComplete) {
      timer.stop();
      playGameCompleteSound();
      completeGame();
    }
  }, [isGameComplete]);

  const loadIconSets = async () => {
    try {
      setIsLoading(true);
      const response = await iconApi.getRandomSets(totalRounds);
      setIconSets(response.iconSets);
    } catch (err) {
      setError('Failed to load game data');
    } finally {
      setIsLoading(false);
    }
  };

  const completeGame = async () => {
    if (!token || !sessionId) return;

    try {
      await gameApi.completeGame(token, sessionId, timer.time);
      setTimeout(() => navigate('/leaderboard'), 2000);
    } catch (err) {
      console.error('Failed to save game result:', err);
    }
  };

  const handleIconClick = (iconIndex: number) => {
    if (!currentIconSet || !isGameActive) return;

    const isCorrect = selectIcon(iconIndex);

    // Play sound effects
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? '✅ Correct!' : '❌ Try again!'
    });

    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        if (currentRound >= totalRounds) {
          endGame();
        } else {
          nextRound();
        }
      }, 1000);
    } else {
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleQuitGame = () => {
    timer.stop();
    resetGame();
    navigate('/start');
  };

  if (!token || !sessionId) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/start')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Back to Start
          </button>
        </div>
      </div>
    );
  }

  if (isGameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Complete!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Time: {timer.getFormattedTime()}
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to leaderboard...
          </div>
        </div>
      </div>
    );
  }

  if (!currentIconSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No icon set available</p>
      </div>
    );
  }

  const progress = (currentRound / totalRounds) * 100;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">
                  Round {currentRound} of {totalRounds}
                </h2>
                <button
                  onClick={handleQuitGame}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium transition duration-200"
                >
                  Quit Game
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right ml-6">
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-2xl font-bold text-blue-600">{timer.getFormattedTime()}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {currentIconSet.name}
            </h3>
            <p className="text-gray-600">{currentIconSet.description}</p>
          </div>

          {feedback && (
            <div className={`text-center mb-6 p-4 rounded-lg ${
              feedback.type === 'correct' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <p className="text-lg font-semibold">{feedback.message}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {currentIconSet.icons.map((icon, index) => (
              <button
                key={index}
                onClick={() => handleIconClick(index)}
                disabled={!isGameActive || feedback !== null}
                className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:from-blue-50 hover:to-blue-100 transition duration-200 flex items-center justify-center text-5xl hover:scale-105 transform shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Difficulty Level: {currentIconSet.difficulty} ⭐
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;