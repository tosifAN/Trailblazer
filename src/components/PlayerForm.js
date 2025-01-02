import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePlayer } from '../api/gameAPI';

// Move generatePlayerID outside component to avoid reference error
const generatePlayerID = () => {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

const PlayerForm = () => {
  const [formData, setFormData] = useState({
    PlayerID: generatePlayerID(),
    PlayerEmailID: '',
    PlayerName: '',
    PlayerLevel: '1',
    PlayerTime: '0',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!validateEmail(formData.PlayerEmailID)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate name
    if (!formData.PlayerName.trim()) {
      setError('Please enter your name');
      return;
    }

    // Validate PlayerLevel
    const level = parseInt(formData.PlayerLevel);
    if (isNaN(level) || level < 1 || level > 10) {
      setError('Player level must be between 1 and 10');
      return;
    }
    formData.PlayerLevel = String(level);

    // Validate PlayerTime
    const time = parseInt(formData.PlayerTime);
    if (isNaN(time) || time < 0) {
      setError('Player time must be a non-negative number');
      return;
    }
    formData.PlayerTime = String(time);
    
    try {
      setIsSubmitting(true);
      sessionStorage.removeItem("playerDetails");
      localStorage.removeItem('playerDetails'); //remove existing player details
      localStorage.setItem("playerDetails", JSON.stringify(formData));
      sessionStorage.setItem("playerDetails", JSON.stringify(formData));
      await savePlayer(
        formData.PlayerID,
        formData.PlayerEmailID,  
        formData.PlayerName,
        formData.PlayerLevel,
        formData.PlayerTime
      );
      
      // Navigate to game with player info
      navigate('/game');
    } catch (error) {
      setError('Failed to register player. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black py-8 px-4">
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            Player Registration
          </h2>
          <p className="mt-2 text-white/60">
            Enter your details to start playing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Player Name Field */}
          <div>
            <label 
              htmlFor="PlayerName" 
              className="block text-white/80 text-sm font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="PlayerName"
              name="PlayerName"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white 
                         placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              placeholder="Enter your name"
              value={formData.PlayerName}
              onChange={handleInputChange}
              minLength={2}
              maxLength={50}
            />
          </div>

          {/* Email Field */}
          <div>
            <label 
              htmlFor="PlayerEmailID" 
              className="block text-white/80 text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="PlayerEmailID"
              name="PlayerEmailID"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white 
                         placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              value={formData.PlayerEmailID}
              onChange={handleInputChange}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white
                      bg-gradient-to-r from-purple-500 to-pink-500
                      hover:from-purple-600 hover:to-pink-600
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                      focus:ring-offset-black transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${isSubmitting ? 'animate-pulse' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </div>
            ) : (
              'Start Playing'
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center text-white/40 text-sm">
          <p>By registering, you agree to our terms and conditions</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerForm;
