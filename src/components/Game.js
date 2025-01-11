import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserMazeGame from './Game/PhaserMazeGame';

function Game() {
  const navigate = useNavigate();
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedDetails = localStorage.getItem("playerDetails");
    const savedPlayerDetails = sessionStorage.getItem("playerDetails");

    if (savedDetails && savedPlayerDetails) {
      setPlayerDetails(JSON.parse(savedDetails));
    } else {
      navigate("/");
    }

    setIsLoading(false);
  }, [navigate]);

  const updatePlayerDetails = (newDetails) => {
    localStorage.setItem("playerDetails", JSON.stringify(newDetails));
    setPlayerDetails(newDetails);
  };

  const handleExit = () => {
    localStorage.removeItem("playerDetails");
    navigate("/");
  };

  if (isLoading || !playerDetails) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col w-[100%] sm:w-[195%] md:w-full mx-auto">
      {/* Navigation Bar */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              Trailblazer
              </h1>
            </div>
            {/* Game Stats */}
            <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
              <div className="px-2 py-1 text-xs sm:text-sm rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Name: </span>
                <span className="text-white">{playerDetails.PlayerName || "N/A"}</span>
              </div>
              <div className="px-2 py-1 text-xs sm:text-sm rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Level: </span>
                <span className="text-white">{playerDetails.PlayerLevel || "N/A"}</span>
              </div>
              <div className="px-2 py-1 text-xs sm:text-sm rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Time: </span>
                <span className="text-white">{playerDetails.PlayerTime || "00:00"}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Game Content */}
      <div className="w-full overflow-hidden p-2 sm:p-4">
        <div className="w-[180%] sm:w-[200%] md:w-[210%] mx-auto rounded-lg overflow-hidden shadow-2xl border border-white/10">
          <PhaserMazeGame updatePlayerDetails={updatePlayerDetails} />
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-2 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Controls</h3>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2 text-white/80">
              <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/10 rounded">↑</kbd>
              <span>Move Up</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-white/80">
              <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/10 rounded">↓</kbd>
              <span>Move Down</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-white/80">
              <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/10 rounded">←</kbd>
              <span>Move Left</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-white/80">
              <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/10 rounded">→</kbd>
              <span>Move Right</span>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Objective</h3>
          <p className="text-white/80 text-xs sm:text-sm">
            Navigate through the maze to reach the exit. Collect power-ups and avoid obstacles.
            Complete the level as quickly as possible to earn higher scores.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm sm:text-base font-medium rounded-lg 
                      hover:scale-105 transition-all duration-200">
            Restart Level
          </button>
          <button
            onClick={handleExit}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-white/10 text-white text-sm sm:text-base rounded-lg">
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;