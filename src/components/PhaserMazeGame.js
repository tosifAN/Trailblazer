import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import styled from 'styled-components';


// Styled components for better UI
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
`;

const GameWrapper = styled.div`
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatsPanel = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.1em;
  }
  
  p {
    margin: 5px 0;
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
  }
`;



const PhaserMazeGame = () => {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);


   // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  

  useEffect(() => {
    const gameOptions = {
      mazeWidth: 21,
      mazeHeight: 21,
      tileSize: 20,
    };

    // Calculate game dimensions
    const gameWidth = gameOptions.mazeWidth * gameOptions.tileSize;
    const gameHeight = gameOptions.mazeHeight * gameOptions.tileSize + 100; // Extra space for controls

    let player;
    const destination = {
      x: gameOptions.mazeWidth - 2,
      y: gameOptions.mazeHeight - 2,
    };

    class MazeScene extends Phaser.Scene {
      constructor() {
        super({ key: 'PlayGame' });
      }
    
      // Add necessary class properties
      init() {
        this.mazeGraphics = null;
        this.cursors = null;
        this.player = null;
        this.maze = [];
      }
    
      create() {
        // Initialize graphics and input
        this.mazeGraphics = this.add.graphics();
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Generate and draw maze
        this.generateMaze();
        this.createPlayer();
        this.createControls();
      }

      generateMaze() {
        const moves = [];
        this.maze = [];
        for (let i = 0; i < gameOptions.mazeHeight; i++) {
          this.maze[i] = [];
          for (let j = 0; j < gameOptions.mazeWidth; j++) {
            this.maze[i][j] = 1;
          }
        }

        let posX = 1;
        let posY = 1;
        this.maze[posX][posY] = 0;
        moves.push(posY + posX * gameOptions.mazeWidth);

        while (moves.length) {
          let possibleDirections = "";
          if (
            posX + 2 > 0 &&
            posX + 2 < gameOptions.mazeHeight - 1 &&
            this.maze[posX + 2][posY] === 1
          ) {
            possibleDirections += "S";
          }
          if (
            posX - 2 > 0 &&
            posX - 2 < gameOptions.mazeHeight - 1 &&
            this.maze[posX - 2][posY] === 1
          ) {
            possibleDirections += "N";
          }
          if (
            posY - 2 > 0 &&
            posY - 2 < gameOptions.mazeWidth - 1 &&
            this.maze[posX][posY - 2] === 1
          ) {
            possibleDirections += "W";
          }
          if (
            posY + 2 > 0 &&
            posY + 2 < gameOptions.mazeWidth - 1 &&
            this.maze[posX][posY + 2] === 1
          ) {
            possibleDirections += "E";
          }

          if (possibleDirections) {
            const move = Phaser.Math.Between(0, possibleDirections.length - 1);
            switch (possibleDirections[move]) {
              case "N":
                this.maze[posX - 2][posY] = 0;
                this.maze[posX - 1][posY] = 0;
                posX -= 2;
                break;
              case "S":
                this.maze[posX + 2][posY] = 0;
                this.maze[posX + 1][posY] = 0;
                posX += 2;
                break;
              case "W":
                this.maze[posX][posY - 2] = 0;
                this.maze[posX][posY - 1] = 0;
                posY -= 2;
                break;
              case "E":
                this.maze[posX][posY + 2] = 0;
                this.maze[posX][posY + 1] = 0;
                posY += 2;
                break;
              default:
                break;
            }
            moves.push(posY + posX * gameOptions.mazeWidth);
          } else {
            const back = moves.pop();
            posX = Math.floor(back / gameOptions.mazeWidth);
            posY = back % gameOptions.mazeWidth;
          }
        }

        this.drawMaze();
      }

      drawMaze() {
        this.mazeGraphics.fillStyle(0x000000);
        for (let i = 0; i < gameOptions.mazeHeight; i++) {
          for (let j = 0; j < gameOptions.mazeWidth; j++) {
            if (this.maze[i][j] === 1) {
              this.mazeGraphics.fillRect(
                j * gameOptions.tileSize,
                i * gameOptions.tileSize,
                gameOptions.tileSize,
                gameOptions.tileSize
              );
            }
          }
        }
      }

      createPlayer() {
        this.player = this.add.circle(
          gameOptions.tileSize * 1.5,
          gameOptions.tileSize * 1.5,
          gameOptions.tileSize / 3,
          0x00ff00
        );
        this.player.posX = 1;
        this.player.posY = 1;
      
        this.destination = {
          x: gameOptions.mazeWidth - 2,
          y: gameOptions.mazeHeight - 2
        };
      }
      

      createControls() {
        // Create a container for controls with initial position
        const controlsContainer = this.add.container(
          50, 
          gameOptions.mazeHeight * gameOptions.tileSize + 10
        );
      
        // Load saved container position if exists
        const savedContainerPos = localStorage.getItem('controls_position');
        if (savedContainerPos) {
          const pos = JSON.parse(savedContainerPos);
          controlsContainer.setPosition(pos.x, pos.y);
        }
      
        // Create buttons (non-draggable)
        const upButton = this.add.text(0, -20, "Up", {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
      
        const downButton = this.add.text(0, 20, "Down", {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
      
        const leftButton = this.add.text(-40, 0, "Left", {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
      
        const rightButton = this.add.text(40, 0, "Right", {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
      
        // Add click handlers
        upButton.setInteractive().on("pointerdown", () => this.movePlayer("up"));
        downButton.setInteractive().on("pointerdown", () => this.movePlayer("down"));
        leftButton.setInteractive().on("pointerdown", () => this.movePlayer("left"));
        rightButton.setInteractive().on("pointerdown", () => this.movePlayer("right"));
      
        // Add buttons to container
        controlsContainer.add([upButton, downButton, leftButton, rightButton]);
      
        // Make the container draggable
        controlsContainer.setInteractive(new Phaser.Geom.Rectangle(-50, -30, 100, 60), 
          Phaser.Geom.Rectangle.Contains);
        
        this.input.setDraggable(controlsContainer);
      
        // Add drag events to container
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
          gameObject.x = dragX;
          gameObject.y = dragY;
        });
      
        this.input.on('dragend', (pointer, gameObject) => {
          // Save container position
          localStorage.setItem('controls_position', JSON.stringify({
            x: gameObject.x,
            y: gameObject.y
          }));
        });
      
        // Add reset position button
        const resetButton = this.add.text(
          gameOptions.mazeWidth * gameOptions.tileSize - 60,
          gameOptions.mazeHeight * gameOptions.tileSize + 10,
          "Reset Controls",
          {
            font: "14px Arial",
            fill: "#ffffff",
            backgroundColor: "#444444",
            padding: { x: 8, y: 4 }
          }
        ).setInteractive();
      
        resetButton.on('pointerdown', () => {
          // Reset container position
          controlsContainer.setPosition(
            50, 
            gameOptions.mazeHeight * gameOptions.tileSize + 10
          );
          
          // Clear saved position
          localStorage.removeItem('controls_position');
        });
      }
      

      update() {
        // Move player based on keyboard input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
          this.movePlayer("up");
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
          this.movePlayer("down");
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
          this.movePlayer("left");
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
          this.movePlayer("right");
        }
      }

      movePlayer(direction) {
        let newX = this.player.posX;
        let newY = this.player.posY;
      
        switch (direction) {
          case "up":
            newX -= 1;
            break;
          case "down":
            newX += 1;
            break;
          case "left":
            newY -= 1;
            break;
          case "right":
            newY += 1;
            break;
        }
      
        if (
          newX >= 0 &&
          newX < gameOptions.mazeHeight &&
          newY >= 0 &&
          newY < gameOptions.mazeWidth &&
          this.maze[newX][newY] === 0
        ) {
          this.player.posX = newX;
          this.player.posY = newY;
          this.player.setPosition(
            newY * gameOptions.tileSize + gameOptions.tileSize / 2,
            newX * gameOptions.tileSize + gameOptions.tileSize / 2
          );
      
          // Check if reached destination
          if (newX === this.destination.y && newY === this.destination.x) {
            this.events.emit('gameWin');
          }
        }
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: gameContainerRef.current,
      backgroundColor: '#ffffff',
      scene: MazeScene
    };

    // Only create a new game instance if one doesn't exist
    if (!phaserGameRef.current) {
      phaserGameRef.current = new Phaser.Game(config);
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