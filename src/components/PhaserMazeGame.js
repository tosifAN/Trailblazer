import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { GameContainer, GameWrapper, StatItem, StatsPanel } from "./Style/GameContainer";
import { formatTime } from "./Game/FormatTime";
import { Config, gameOptions } from "./Game/Config";

const PhaserMazeGame = () => {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Calculate game dimensions
    const gameWidth = gameOptions.mazeWidth * gameOptions.tileSize + 800;
    const gameHeight = gameOptions.mazeHeight * gameOptions.tileSize + 220;

    // Only create a new game instance if one doesn't exist
    if (!phaserGameRef.current) {
      const config = Config(gameWidth, gameHeight, gameContainerRef);
      
      // Add event handling to the config
      config.callbacks = {
        ...config.callbacks,
        add: {
          game: (game) => {
            // Listen for custom events from the MazeScene
            game.events.on('playerWin', handlePlayerWin);
          }
        }
      };
      
      phaserGameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleGameOver();
      return;
    }

    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused]);

  const handlePlayerWin = () => {
    setIsPaused(true);
    setGameOverMessage("You Win! 🎉");
    // Add bonus points based on remaining time
    const timeBonus = Math.floor(timeLeft * 10);
    setScore(prevScore => prevScore + timeBonus);
  };

  const handleGameOver = () => {
    setIsPaused(true);
    setGameOverMessage("Time's Up! Game Over 😢");
  };

  const handlePlayAgain = () => {
    setTimeLeft(300);
    setScore(0);
    setCurrentLevel(1);
    setGameOverMessage('');
    setIsPaused(false);
    window.location.reload();
  };

  return (
    <GameContainer>
      <StatsPanel>
        <StatItem>
          <h3>Time</h3>
          <p>{formatTime(timeLeft)}</p>
        </StatItem>
        <StatItem>
          <h3>Level</h3>
          <p>{currentLevel}</p>
        </StatItem>
        <StatItem>
          <h3>Score</h3>
          <p>{score}</p>
        </StatItem>
      </StatsPanel>

      <GameWrapper ref={gameContainerRef} />

      {gameOverMessage && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>{gameOverMessage}</h2>
          {gameOverMessage.includes('Win') && (
            <p>Bonus points: {Math.floor(timeLeft * 10)}</p>
          )}
          <button 
            onClick={handlePlayAgain}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </GameContainer>
  );
};

export default PhaserMazeGame;
