import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import PlayerForm from "./components/PlayerForm";

function App() {
  return (
    <Router>
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
            {/* Routes */}
            <div className="transition-all duration-300 ease-in-out">
              <Routes>
                <Route path="/" element={
                  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8">
                    <Menu />
                  </div>
                } />
                <Route path="/player-form" element={<PlayerForm/>} />
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboard" element={
                  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8">
                    <Leaderboard />
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-white/80 text-sm">
            <p>© 2024 Maze Runner. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
