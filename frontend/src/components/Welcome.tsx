import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoatRewardImage from '../assets/Boat_Reward.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const elasticsearchFacts = [
    "Elasticsearch is the most widely deployed, open source vector database.",
    "Elasticsearch delivers up to 12x faster vector search compared to previous generations, enabling real-time AI and semantic search at scale.",
    "Elasticsearch goes beyond vectors — it's a full-featured search and analytics platform, trusted and loved by developers worldwide."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % elasticsearchFacts.length);
    }, 4000); // Change fact every 4 seconds
    return () => clearInterval(interval);
  }, [elasticsearchFacts.length]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/20 p-6 w-full max-w-lg text-center">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{backgroundColor: '#0B64DD'}}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            Play<br />
            <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(to right, #0B64DD, #0B64DD)', WebkitBackgroundClip: 'text'}}>
              The Search Game
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-4">
            Test your visual skills with <span className="font-semibold" style={{color: '#0B64DD'}}>Elastic</span> and win
          </p>
        </div>

        {/* Prize Section */}
        <div className="rounded-xl p-4 mb-6 border shadow-lg" style={{backgroundColor: 'rgba(11, 100, 221, 0.1)', borderColor: 'rgba(11, 100, 221, 0.3)'}}>
          <div className="flex items-center justify-center mb-3">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mr-4 shadow-lg p-2">
              <img
                src={BoatRewardImage}
                alt="boAt Nirvanaa 751 ANC"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">boAt Nirvanaa 751 ANC</h3>
              <p className="text-sm font-medium" style={{color: '#0B64DD'}}>Premium Headphones</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs">
            Complete the challenge and compete for prizes!
          </p>
        </div>

        {/* Elasticsearch Facts Section */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-600/50">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{backgroundColor: '#0B64DD'}}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-sm">Did you know?</h3>
          </div>
          <div className="text-xs text-gray-300 leading-relaxed px-2 min-h-[3rem] flex items-center justify-center transition-all duration-500">
            {elasticsearchFacts[currentFactIndex]}
          </div>
          <div className="flex justify-center mt-3 space-x-1">
            {elasticsearchFacts.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFactIndex ? 'bg-blue-400' : 'bg-gray-600'
                }`}
                style={index === currentFactIndex ? {backgroundColor: '#0B64DD'} : {}}
              />
            ))}
          </div>
        </div>

        {/* Game Features - Simplified */}
        <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: 'rgba(11, 100, 221, 0.2)'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#0B64DD'}}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium text-xs sm:text-sm">6 Rounds</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: 'rgba(11, 100, 221, 0.2)'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#0B64DD'}}>
                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-white font-medium text-xs sm:text-sm">Compete</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: 'rgba(11, 100, 221, 0.2)'}}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#0B64DD'}}>
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
          style={{backgroundColor: '#0B64DD'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#094fb8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0B64DD'}
        >
          <span className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            I'm Ready - Let's Do This!
          </span>
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Complete all 6 rounds and compete for exciting prizes!
        </p>
      </div>
    </div>
  );
};

export default Welcome;