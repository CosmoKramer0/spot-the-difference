import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { iconApi, gameApi } from '../utils/api';
import SvgIcon from './SvgIcon';
import { getAllIcons } from '../data/svgIcons';
import Watermark from './Watermark';

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
  const [svgIconsData] = useState(() => getAllIcons());

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
      setIconSets((response as any).iconSets);
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
      // Temporarily disable game to prevent double-clicking
      const { setGameActive } = useGameStore.getState();
      setGameActive(false);
      
      // Advance to next round after a brief delay
      setTimeout(() => {
        if (currentRound >= totalRounds) {
          endGame();
        } else {
          nextRound();
        }
      }, 500);
    } else {
      playIncorrectSound();
      // Don't advance - let user keep trying
    }
  };

  const handleQuitGame = () => {
    timer.stop();
    resetGame();
    navigate('/start');
  };

  const getSvgIconData = (iconId: string) => {
    return svgIconsData.find(icon => icon.id === iconId);
  };

  if (!token || !sessionId) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
        <Watermark />
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse mx-auto mb-6 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-medium text-white mb-2">Preparing your challenge...</p>
          <p className="text-gray-300">Loading visual patterns</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
        <Watermark />
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Challenge Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/start')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg"
          >
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
        <Watermark />
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Challenge Complete!
          </h2>
          <div className="bg-gray-700/50 rounded-xl p-4 mb-6 border border-gray-600/50">
            <p className="text-lg font-bold text-white mb-2">Final Time</p>
            <p className="text-3xl font-bold text-cyan-400">
              {timer.getFormattedTime()}
            </p>
          </div>
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-cyan-400 rounded-full mr-2"></div>
            Saving your score...
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col">
      <Watermark />
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-sm shadow-lg border-b border-gray-600/20 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white">
              Round {currentRound} of {totalRounds}
            </h1>
            <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold shadow-lg">
              Level {currentIconSet.difficulty}
            </div>
            <div className="w-40 bg-gray-600/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">Time</p>
              <p className="text-xl font-bold text-white">
                {timer.getFormattedTime()}
              </p>
            </div>
            <button
              onClick={handleQuitGame}
              className="px-4 py-2 text-white/80 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Game Area - Full height */}
      <div className="flex-1 container mx-auto p-4 flex flex-col">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {currentIconSet.name}
          </h2>
          <p className="text-gray-300 font-medium text-lg">Find the different {currentIconSet.name.toLowerCase()} icon</p>
        </div>

        {/* Icon Grid - Optimized for no scrolling */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-10 gap-3 max-w-6xl mx-auto">
            {currentIconSet.icons.map((iconData: any, index) => {
              const iconInfo = getSvgIconData(iconData.id);
              
              return (
                <button
                  key={index}
                  onClick={() => handleIconClick(index)}
                  disabled={!isGameActive}
                  className="hover:scale-105 transform transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none p-1"
                >
                  {iconInfo ? (
                    <SvgIcon
                      iconData={iconInfo}
                      size={52}
                      variant={iconData.variant}
                      className="transition-all duration-150"
                    />
                  ) : (
                    <div className="w-13 h-13 bg-slate-200 rounded flex items-center justify-center text-slate-400">
                      ?
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;