import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white px-4">
      {/* Game Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-4">
          Maze Game
        </h1>
        <p className="text-base md:text-lg text-white/80 font-light">
          Navigate through challenging mazes and beat the clock!
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-6 w-full max-w-sm">
        {/* Start Game Button */}
        <button
          onClick={() => navigate("/player-form")}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold text-lg md:text-xl hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Start Game
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={() => navigate("/leaderboard")}
          className="w-full py-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold text-lg md:text-xl hover:from-purple-500 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Leaderboard
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-white/60 text-sm">
        <p>Designed for fun and challenge. Play now!</p>
      </div>
    </div>
  );
};

export default Menu;
