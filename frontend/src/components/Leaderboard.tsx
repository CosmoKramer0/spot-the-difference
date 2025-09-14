import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { gameApi } from '../utils/api';

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
  const { correctAnswers, score } = useGameStore();
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

  const formatTime = (timeValue: number): string => {
    const totalSeconds = Math.floor(timeValue / 100);
    const milliseconds = timeValue % 100;
    return `${totalSeconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };


  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Search Game - My Score!',
          text: `I just completed The Search Game challenge with ${correctAnswers}/6 correct answers and ${score} points!`,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I just completed The Search Game challenge with ${correctAnswers}/6 correct answers and ${score} points! Play at ${window.location.origin}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      }).catch(() => {
        alert('Share not supported on this browser');
      });
    }
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
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{borderColor: '#0B63DD', borderTopColor: 'transparent'}}></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-4 sm:p-6">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Leaderboard</h1>
            <p className="text-sm sm:text-base text-gray-300">Top 5 fastest players</p>
            {user && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
                <p className="text-sm sm:text-base text-white font-semibold">Your Performance</p>
                <p className="text-xs sm:text-sm text-gray-300">
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

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {leaderboard.length > 0 ? (
              leaderboard.map((player) => (
                <div
                  key={`${player.rank}-${player.phone}`}
                  className={`flex items-center p-3 sm:p-4 rounded-lg border-2 transition duration-200 hover:shadow-md ${getRankStyle(player.rank)}`}
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white font-bold mr-3 sm:mr-4 shadow-md text-sm sm:text-base" style={{backgroundColor: '#0B63DD'}}>
                    {player.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {player.name}
                      {user?.phone === player.phone && (
                        <span className="ml-2 text-xs sm:text-sm" style={{color: '#0B63DD'}}>(You)</span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {player.phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1-***-***-$4')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-lg font-bold" style={{color: '#0B63DD'}}>
                      {formatTime(player.time)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(player.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  No games completed yet
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Be the first to complete the challenge and claim the top spot!
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleShareResults}
              className="backdrop-blur-sm text-white py-3 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600/30 transform hover:scale-105"
              style={{backgroundColor: 'rgba(11, 99, 221, 0.6)'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(11, 99, 221, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(11, 99, 221, 0.6)'}
            >
              Share Results
            </button>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
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