import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-6 w-full max-w-lg text-center">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{backgroundColor: '#0B63DD'}}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            Play the Spot the<br />
            <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(to right, #0B63DD, #0B63DD)', WebkitBackgroundClip: 'text'}}>
              Difference Game
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-4">
            Test your visual skills with <span className="font-semibold" style={{color: '#0B63DD'}}>Elastic</span> and win
          </p>
        </div>

        {/* Prize Section */}
        <div className="rounded-xl p-4 mb-6 border shadow-lg" style={{backgroundColor: 'rgba(11, 99, 221, 0.1)', borderColor: 'rgba(11, 99, 221, 0.3)'}}>
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-md">
              {/* Apple logo */}
              <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">Apple AirPods</h3>
              <p className="text-sm font-medium" style={{color: '#0B63DD'}}>Brand New</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs">
            Complete the challenge and compete for prizes!
          </p>
        </div>

        {/* Game Features - Simplified */}
        <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: 'rgba(11, 99, 221, 0.2)'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#0B63DD'}}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium text-xs sm:text-sm">6 Rounds</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: 'rgba(11, 99, 221, 0.2)'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#0B63DD'}}>
                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium text-xs sm:text-sm">Compete</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: 'rgba(11, 99, 221, 0.2)'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#0B63DD'}}>
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium text-xs sm:text-sm">Win Prizes</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{backgroundColor: '#0B63DD'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#094fb8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0B63DD'}
        >
          <span className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            I'm Ready - Let's Do This!
          </span>
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Free to play • No purchase necessary • Test your skills now
        </p>
      </div>
    </div>
  );
};

export default Welcome;