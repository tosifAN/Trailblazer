import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { GameContainer, GameWrapper, StatItem, StatsPanel } from "./Style/GameContainer";
import { formatTime } from "./FormatTime";
import { Config} from "./Config";
import { updatePlayer } from "../../api/gameAPI";

const PhaserMazeGame = ({ updatePlayerDetails })=> {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const timeLeftRef = useRef(timeLeft);

useEffect(() => {
  timeLeftRef.current = timeLeft; // Keep the ref updated with the latest state
}, [timeLeft]);

  useEffect(() => {
    handlePlayAgain();
    if (!phaserGameRef.current) {
      const config = Config(gameContainerRef);
  
      // Add callback to listen for custom events
      config.callbacks = {
        ...config.callbacks,
        postBoot: (game) => {
          // Listen for custom events from the game instance
          game.events.on('playerWin', handlePlayerWin);
        },
      };
  
      phaserGameRef.current = new Phaser.Game(config);
    }
  
    return () => {
      if (phaserGameRef.current) {
        // Cleanup event listeners and destroy the Phaser game instance
        phaserGameRef.current.events.off('playerWin', handlePlayerWin);
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }

    };
  }, [currentLevel]);
  

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

  const handlePlayerWin = async () => {
    setIsPaused(true);
    setGameOverMessage("You Win! 🎉");
    
    console.log("Player time", timeLeftRef.current); // Access real-time value from the ref

  
    const savedDetails = JSON.parse(localStorage.getItem("playerDetails"));

    const updatedDetails = {
      ...savedDetails,
      PlayerLevel: currentLevel + 1,
      PlayerTime: savedDetails.PlayerTime + 300 - timeLeftRef.current,
    };
  
    // Update player details in both localStorage and parent state
    updatePlayerDetails(updatedDetails);
  
    if (savedDetails) {
      // Update PlatrueyerLevel and PlayerTime based on game state
      const updatedDetails = {
        ...savedDetails,
        PlayerLevel: currentLevel + 1, // Increment level
        PlayerTime: savedDetails.PlayerTime + 300 - timeLeftRef.current,
      };

      // Save updated details to localStorage
      localStorage.setItem("playerDetails", JSON.stringify(updatedDetails));
  
      console.log("Player details updated:", updatedDetails);
      
      // Optionally update the player data on the server
      try {
        await updatePlayer(savedDetails.PlayerID, {
          PlayerLevel: updatedDetails.PlayerLevel,
          PlayerTime: updatedDetails.PlayerTime,
        });
      } catch (error) {
        console.error("Error updating player details on the server:", error);
      }
    }
    setCurrentLevel(prev => prev + 1);
  };

  const handleGameOver = async () => {
    const savedDetails = JSON.parse(localStorage.getItem("playerDetails"));
    // Ensure savedDetails exist to avoid errors
    if (savedDetails) {
      const playerID = savedDetails.PlayerID; // Extract PlayerID
      const requestBody = {
        PlayerLevel: savedDetails.PlayerLevel, // Extract PlayerLevel from localStorage
        PlayerTime: savedDetails.PlayerTime + 300 - timeLeftRef.current,
      };
  
      // Call updatePlayer with the extracted parameters
      await updatePlayer(playerID, requestBody);
    }
    sessionStorage.removeItem("playerDetails");
    localStorage.removeItem('playerDetails'); //remove existing player details
    setIsPaused(true);
    setGameOverMessage("Time's Up! Game Over 😢");
  };

  const handlePlayAgain = () => {
    setTimeLeft(300);
    setGameOverMessage('');
    setIsPaused(false);
  };

  return (
    <GameContainer>
      <StatsPanel>
        <StatItem>
          <h3>Time</h3>
          <p>{formatTime(timeLeft)}</p>
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
          {gameOverMessage.includes('Win')}
        </div>
      )}
    </GameContainer>
  );
};

export default PhaserMazeGame;