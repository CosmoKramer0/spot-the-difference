import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { gameApi } from '../utils/api';
import Watermark from './Watermark';

interface LeaderboardEntry {
  rank: number;
  name: string;
  phone: string;
  time: number;
  completedAt: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { correctAnswers, score, resetGame } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await gameApi.getLeaderboard();
      setLeaderboard(response.leaderboard || []);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/start');
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spot the Difference - My Score!',
          text: `I just completed the Spot the Difference challenge with ${correctAnswers}/6 correct answers and ${score} points!`,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I just completed the Spot the Difference challenge with ${correctAnswers}/6 correct answers and ${score} points! Play at ${window.location.origin}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      }).catch(() => {
        alert('Share not supported on this browser');
      });
    }
  };

  const getRankIcon = (rank: number): string => {
    return `${rank}`;
  };

  const getRankStyle = (rank: number): string => {
    switch (rank) {
      case 1: return 'bg-yellow-900/30 border-yellow-500/50 shadow-lg';
      case 2: return 'bg-gray-700/50 border-gray-500/50 shadow-md';
      case 3: return 'bg-orange-900/30 border-orange-500/50 shadow-md';
      default: return 'bg-gray-800/50 border-gray-600/50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <Watermark />
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
            <p className="text-gray-300">Top 5 fastest players</p>
            {user && (
              <div className="mt-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
                <p className="text-white font-semibold">Your Performance</p>
                <p className="text-gray-300">
                  {correctAnswers}/6 correct • {score} points
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600/50 text-red-300 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-8">
            {leaderboard.length > 0 ? (
              leaderboard.map((player) => (
                <div
                  key={`${player.rank}-${player.phone}`}
                  className={`flex items-center p-4 rounded-lg border-2 transition duration-200 hover:shadow-md ${getRankStyle(player.rank)}`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold mr-4 shadow-md">
                    {player.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {player.name}
                      {user?.phone === player.phone && (
                        <span className="ml-2 text-cyan-400 text-sm">(You)</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {player.phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1-***-***-$4')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-400">
                      {formatTime(player.time)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(player.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No games completed yet
                </h3>
                <p className="text-gray-300">
                  Be the first to complete the challenge and claim the top spot!
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Play Again
            </button>
            <button
              onClick={handleShareResults}
              className="flex-1 bg-gray-700/60 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-gray-600/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600/30 transform hover:scale-105"
            >
              Share Results
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-300 text-sm transition duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;