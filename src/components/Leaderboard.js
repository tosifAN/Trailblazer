import React, { useEffect, useState } from "react";

const Leaderboard = ({ onExit }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('all'); // 'all', 'weekly', 'monthly'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://<YOUR_API_GATEWAY_URL>/leaderboard");
        const data = await response.json();
        setScores(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            Leaderboard
          </h1>
          <p className="text-white/60 mt-2">Top players and their achievements</p>
        </div>

        {/* Time Frame Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-lg p-1">
            {['all', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                          ${timeFrame === period 
                            ? 'bg-purple-500 text-white shadow-lg' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {scores.map((score, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                'bg-orange-500/20 text-orange-400'}`}>
                              <span className="text-lg font-bold">{index + 1}</span>
                            </div>
                          ) : (
                            <span className="text-white/60 font-medium">{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {score.PlayerID.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="ml-3 text-white font-medium">{score.PlayerID}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-semibold">{score.Score}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/80">
                        {score.Time || "00:00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/60">
                        {new Date(score.Date || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg
                     hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Back to Menu
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg
                     hover:bg-white/20 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Refresh
          </button>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{scores.length}</div>
            <div className="text-white/60 text-sm">Total Players</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">
              {scores.length > 0 ? Math.max(...scores.map(s => s.Score)) : 0}
            </div>
            <div className="text-white/60 text-sm">Highest Score</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {scores.length > 0 ? Math.round(scores.reduce((acc, curr) => acc + curr.Score, 0) / scores.length) : 0}
            </div>
            <div className="text-white/60 text-sm">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
