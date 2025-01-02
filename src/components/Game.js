import React, { useState, useEffect } from "react";
import PhaserMazeGame from "./Game/PhaserMazeGame";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook


function Game() {

  const navigate = useNavigate(); // Initialize useNavigate

  // State to hold player details
  const [playerDetails, setPlayerDetails] = useState(() => {
    const savedDetails = localStorage.getItem("playerDetails");
    return savedDetails ? JSON.parse(savedDetails) : {};
  });

   // Function to handle updating player details in localStorage and state
   const updatePlayerDetails = (newDetails) => {
    // Update player details in localStorage
    localStorage.setItem("playerDetails", JSON.stringify(newDetails));

    // Update state to reflect changes immediately
    setPlayerDetails(newDetails);
  };



   // Exit game handler
   const handleExit = () => {
    localStorage.removeItem("playerDetails"); // Clear player details from localStorage
    navigate("/"); // Redirect to the home page
  };

  // Render player details dynamically
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                  Maze Runner
                </h1>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Name: </span>
                <span className="text-white">{playerDetails.PlayerName || "N/A"}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Level: </span>
                <span className="text-white">{playerDetails.PlayerLevel || "N/A"}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Time: </span>
                <span className="text-white">{playerDetails.PlayerTime || "00:00"}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Game Content */}
      <div className="flex-50 overflow-hidden p-8">
        <div className="h-[90vh] w-[90vw] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <PhaserMazeGame  updatePlayerDetails={updatePlayerDetails} />
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Controls</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-white/80">
              <kbd className="px-2 py-1 bg-white/10 rounded">↑</kbd>
              <span>Move Up</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <kbd className="px-2 py-1 bg-white/10 rounded">↓</kbd>
              <span>Move Down</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
              <span>Move Left</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
              <span>Move Right</span>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Objective</h3>
          <p className="text-white/80 text-sm">
            Navigate through the maze to reach the exit. Collect power-ups and avoid obstacles. 
            Complete the level as quickly as possible to earn higher scores.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex items-center justify-center space-x-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg 
                      hover:scale-105 transition-all duration-200">
            Restart Level
          </button>
          <button
            onClick={handleExit}
            className="px-6 py-2 bg-white/10 text-white rounded-lg">
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
