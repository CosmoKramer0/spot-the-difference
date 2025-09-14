import React, { useState, useEffect } from 'react';
import { gameApi } from '../utils/api';
import QRCodeImage from '../assets/QR Code.png';

interface LeaderboardEntry {
  rank: number;
  name: string;
  phone: string;
  time: number;
  completedAt: string;
}

interface DisplayStats {
  totalGamesPlayed: number;
  averageTime: number;
}

const Display: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<DisplayStats>({
    totalGamesPlayed: 0,
    averageTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchData();

    // Auto-refresh every 3 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await gameApi.getLeaderboard();
      setLeaderboard(response.leaderboard || []);

      const leaderboardData = response.leaderboard || [];
      setStats({
        totalGamesPlayed: response.totalGames || leaderboardData.length,
        averageTime: leaderboardData.length > 0
          ? leaderboardData.reduce((sum: number, player: LeaderboardEntry) => sum + player.time, 0) / leaderboardData.length
          : 0
      });

      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setIsLoading(false);
    }
  };

  const formatTime = (timeValue: number): string => {
    const totalSeconds = Math.floor(timeValue / 100);
    const milliseconds = timeValue % 100;
    return `${totalSeconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#0B63DD';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className="flex items-center justify-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className="font-bold text-xs sm:text-sm lg:text-base">{rank}</span>
        </div>
      );
    }
    return <span className="font-bold text-sm sm:text-base lg:text-lg xl:text-xl">{rank}</span>;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
      <div className="w-full h-full flex">

        {/* Left Section - QR Code & Instructions */}
        <div className="w-full sm:w-2/5 lg:w-1/3 flex flex-col justify-center items-center p-2 sm:p-4 lg:p-6 xl:p-8">
          {/* Title and Instructions */}
          <div className="text-center mb-4 lg:mb-6 xl:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-2 lg:mb-4">
              Scan. Win. Share.
            </h1>
            <p className="text-xs sm:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-300 mb-4 lg:mb-6 xl:mb-8 leading-relaxed">
              Scan this QR code to play<br />
              <span style={{color: '#0B63DD'}} className="font-bold text-sm sm:text-base lg:text-2xl xl:text-3xl 2xl:text-4xl">The Search Game</span><br />
              <span className="text-yellow-400 font-semibold">2 tries per user</span> • Win exciting prizes!
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-1 sm:p-2 lg:p-3 xl:p-4 rounded-xl lg:rounded-2xl shadow-2xl mb-4 lg:mb-6 xl:mb-8">
            <img
              src={QRCodeImage}
              alt="QR Code to play The Search Game"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 xl:w-64 xl:h-64 2xl:w-72 2xl:h-72 mx-auto"
            />
          </div>

          {/* Game Stats */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 lg:p-4 xl:p-6 w-full max-w-xs lg:max-w-sm">
            <div className="grid grid-cols-1 gap-2 lg:gap-3 xl:gap-4 text-center">
              <div>
                <div className="text-lg sm:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold" style={{color: '#0B63DD'}}>
                  {stats.totalGamesPlayed}
                </div>
                <div className="text-xs sm:text-xs lg:text-sm xl:text-base text-gray-300">Games Completed</div>
              </div>
              {stats.averageTime > 0 && (
                <div>
                  <div className="text-lg sm:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-yellow-400">
                    {formatTime(Math.round(stats.averageTime))}
                  </div>
                  <div className="text-xs sm:text-xs lg:text-sm xl:text-base text-gray-300">Average Time</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Leaderboard */}
        <div className="hidden sm:flex sm:w-3/5 lg:w-2/3 flex-col p-2 sm:p-4 lg:p-6 xl:p-8 min-h-0">
          <div className="text-center mb-3 lg:mb-4 xl:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-1 lg:mb-2">Live Leaderboard</h2>
            <p className="text-xs sm:text-sm lg:text-lg xl:text-xl text-gray-300">Top 10 Champions</p>
            <div className="text-xs lg:text-sm text-gray-400 mt-1 lg:mt-2">
              Last updated: {lastUpdate.toLocaleTimeString()}
              {isLoading && <span className="ml-2 inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-green-400 rounded-full animate-pulse"></span>}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {leaderboard.length > 0 ? (
              <div className="h-full">
                <div
                  className="space-y-1 sm:space-y-1.5 lg:space-y-2 xl:space-y-3 2xl:space-y-4 h-full overflow-y-auto pr-2 leaderboard-scroll"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4B5563 transparent'
                  }}
                >
                  {leaderboard.slice(0, 10).map((player) => (
                    <div
                      key={`${player.rank}-${player.phone}`}
                      className={`
                        flex items-center p-1.5 sm:p-2 lg:p-3 xl:p-4 2xl:p-6 rounded-lg xl:rounded-xl border-2 transition-all duration-300 max-h-16 sm:max-h-20 lg:max-h-24 xl:max-h-28 2xl:max-h-32
                        ${player.rank === 1 ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-500/50 shadow-lg shadow-yellow-500/20' :
                          player.rank === 2 ? 'bg-gradient-to-r from-gray-700/30 to-gray-600/30 border-gray-400/50 shadow-lg shadow-gray-400/20' :
                          player.rank === 3 ? 'bg-gradient-to-r from-orange-900/30 to-orange-800/30 border-orange-500/50 shadow-lg shadow-orange-500/20' :
                          'bg-gray-800/50 border-gray-600/50'
                        }
                      `}
                    >
                      {/* Rank */}
                      <div
                        className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 rounded-full text-white font-bold mr-2 sm:mr-3 lg:mr-4 xl:mr-6 shadow-lg text-xs sm:text-sm lg:text-base xl:text-lg"
                        style={{backgroundColor: getRankColor(player.rank)}}
                      >
                        {getRankIcon(player.rank)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-xs sm:text-sm lg:text-lg xl:text-xl 2xl:text-2xl mb-0 lg:mb-1 truncate">
                          {player.name}
                        </h3>
                        <p className="text-gray-400 text-xs lg:text-sm xl:text-base truncate">
                          {new Date(player.completedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="text-right flex-shrink-0">
                        <div
                          className="text-xs sm:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl font-bold"
                          style={{color: getRankColor(player.rank)}}
                        >
                          {formatTime(player.time)}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-400">
                          Completion Time
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 xl:mb-6">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2 lg:mb-4">
                    No Champions Yet!
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-300">
                    Be the first to complete the challenge<br />
                    and claim the top spot!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-2 sm:mt-3 lg:mt-4 xl:mt-6 text-center">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg xl:rounded-xl p-2 lg:p-3 xl:p-4 border border-blue-500/30">
              <p className="text-white text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold">
                🏆 Complete all 6 rounds and compete for exciting prizes! 🏆
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-only leaderboard overlay */}
        <div className="sm:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 p-4 hidden">
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Live Leaderboard</h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              {leaderboard.slice(0, 10).map((player) => (
                <div key={player.rank} className="bg-gray-800/80 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm"
                      style={{backgroundColor: getRankColor(player.rank)}}
                    >
                      {player.rank}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{player.name}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(player.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{color: getRankColor(player.rank)}}>
                      {formatTime(player.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;