import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { gameApi, ApiError } from '../utils/api';

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
          text: `I just completed the Spot the Difference game with ${correctAnswers}/10 correct answers and ${score} points!`,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I just completed the Spot the Difference game with ${correctAnswers}/10 correct answers and ${score} points! Play at ${window.location.origin}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      }).catch(() => {
        alert('Share not supported on this browser');
      });
    }
  };

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getRankStyle = (rank: number): string => {
    switch (rank) {
      case 1: return 'bg-yellow-50 border-yellow-200 shadow-lg';
      case 2: return 'bg-gray-50 border-gray-300 shadow-md';
      case 3: return 'bg-orange-50 border-orange-200 shadow-md';
      default: return 'bg-white border-gray-200';
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
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-600">Top 5 fastest players</p>
            {user && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-semibold">Your Performance</p>
                <p className="text-blue-600">
                  {correctAnswers}/10 correct • {score} points
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
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
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold mr-4 shadow-md">
                    {player.rank <= 3 ? getRankIcon(player.rank) : player.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {player.name}
                      {user?.phone === player.phone && (
                        <span className="ml-2 text-blue-600 text-sm">(You)</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {player.phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1-***-***-$4')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
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
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No games completed yet
                </h3>
                <p className="text-gray-600">
                  Be the first to complete the game and claim the top spot!
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              🎮 Play Again
            </button>
            <button
              onClick={handleShareResults}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200 shadow-md hover:shadow-lg"
            >
              📱 Share Results
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 text-sm transition duration-200"
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