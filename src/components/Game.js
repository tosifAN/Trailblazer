import React from "react";
import PhaserMazeGame from "./PhaserMazeGame";

function Game() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* Navigation Bar */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Logo/Title */}
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                  Maze Runner
                </h1>
              </div>
            </div>
            
            {/* Game Stats */}
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Level: </span>
                <span className="text-white">1</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Time: </span>
                <span className="text-white">00:00</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-yellow-400 font-medium">Score: </span>
                <span className="text-white">0</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Game Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Game Canvas Container */}
          <div className="relative bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-2xl 
                          border border-white/10 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            
            {/* Game Component */}
            <div className="relative">
              <PhaserMazeGame />
            </div>
          </div>

          {/* Controls Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Controls */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Controls
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Objective
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Navigate through the maze to reach the exit. Collect power-ups and avoid obstacles. 
                Complete the level as quickly as possible to earn higher scores.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg 
                             hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 
                             focus:ring-2 focus:ring-purple-400 focus:outline-none">
              Restart Level
            </button>
            <button className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg 
                             hover:scale-105 transition-all duration-200 hover:bg-white/20 
                             focus:ring-2 focus:ring-white/50 focus:outline-none">
              Exit Game
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-white/50 text-sm">
        <p>Press ESC to pause the game</p>
      </footer>
    </div>
  );
}

export default Game;
