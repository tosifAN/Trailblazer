import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { GameContainer, GameWrapper, StatItem, StatsPanel } from "./Style/GameContainer";
import { formatTime } from "./Game/FormatTime";
import MazeScene from "./Game/MazeScene";
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
    const gameWidth = gameOptions.mazeWidth * gameOptions.tileSize;
    const gameHeight = gameOptions.mazeHeight * gameOptions.tileSize + 100; // Extra space for controls

    let player;
    const destination = {
      x: gameOptions.mazeWidth - 2,
      y: gameOptions.mazeHeight - 2,
    };

    // Only create a new game instance if one doesn't exist
    if (!phaserGameRef.current) {
      phaserGameRef.current = new Phaser.Game(Config(gameWidth, gameHeight, gameContainerRef));
    }
     // Timer logic
    const timer = setInterval(() => {
      if (!isPaused && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);

    

    return () => {
      clearInterval(timer);
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

   // Timer effect
   useEffect(() => {
    if (timeLeft <= 0) {
      setGameOverMessage("Time's Up!");
      return;
    }

    if (!isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused]);

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
          <button onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      )}
    </GameContainer>
  );
};

export default PhaserMazeGame;