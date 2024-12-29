import React, { useState } from "react";
import Menu from "./components/Menu";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [view, setView] = useState("menu");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Maze Runner
          </h1>
          <div className="h-1 w-32 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto">
          {/* Dynamic Content Based on View State */}
          <div className="transition-all duration-300 ease-in-out">
            {view === "menu" && (
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8">
                <Menu 
                  onStartGame={() => setView("game")} 
                  onViewLeaderboard={() => setView("leaderboard")} 
                />
              </div>
            )}
            {view === "game" && (
              <Game onExit={() => setView("menu")} />
            )}
            {view === "leaderboard" && (
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8">
                <Leaderboard onExit={() => setView("menu")} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/80 text-sm">
          <p>© 2024 Maze Runner. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
