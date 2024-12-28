import React from "react";

const Menu = ({ onStartGame, onViewLeaderboard }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
      {/* Game Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-4">
          Maze Game
        </h1>
        <p className="text-lg text-white/80 font-light">
          Navigate through challenging mazes and beat the clock!
        </p>
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* Start Game Button */}
        <button 
          onClick={onStartGame}
          className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 
          text-white font-semibold rounded-lg transform transition-all duration-200 
          hover:scale-105 hover:shadow-[0_0_20px_rgba(167,139,250,0.5)] 
          focus:ring-2 focus:ring-purple-400 focus:outline-none active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <svg 
              className="w-6 h-6 group-hover:animate-pulse" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Start Game
          </span>
        </button>

        {/* Leaderboard Button */}
        <button 
          onClick={onViewLeaderboard}
          className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white 
          font-semibold rounded-lg transform transition-all duration-200 
          hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
          focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <svg 
              className="w-6 h-6 group-hover:animate-bounce" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
            View Leaderboard
          </span>
        </button>
      </div>

      {/* Game Features */}
      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg">
          <div className="text-yellow-300 mb-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Fast-Paced</h3>
          <p className="text-white/70 text-sm">Challenge yourself with time-based gameplay</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg">
          <div className="text-pink-300 mb-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Multiple Levels</h3>
          <p className="text-white/70 text-sm">Progress through increasingly difficult mazes</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-white/50 text-sm">
        Press ESC anytime to pause the game
      </div>
    </div>
  );
};

// Add these animations to your tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0', transform: 'translateY(10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         }
//       },
//       animation: {
//         fadeIn: 'fadeIn 0.5s ease-out',
//       }
//     }
//   }
// }

export default Menu;
