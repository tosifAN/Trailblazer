import Phaser from 'phaser';
import {getObstaclePositions} from './dynamicobstacles'


const gameOptions = {
  mazeWidth: 29,  // Any odd number ≥ 7
  mazeHeight: 21, // Any odd number ≥ 7
  tileSize: 20    // Adjust based on your display size
};

class MazeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MazeScene' });
    this.isAudioResumed = false;
    this.isAudioPlaying = false; // Add a flag for audio state
      }



    preload() {
        // Change the background color to be lighter
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x2c3e50, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        const progressBar = this.add.graphics();
      
        // Track progress more granularly
        let progress = 0;
        let currentProgress = 0;
        const updateProgressBar = () => {
            if (currentProgress < progress) {
                currentProgress += 0.01;
                progressBar.clear();
                progressBar.fillStyle(0x3498db, 1);
                progressBar.fillRect(250, 280, 300 * currentProgress, 30);
                
                requestAnimationFrame(updateProgressBar);
            }
        };
        
        this.load.on('progress', (value) => {
            progress = value;
            requestAnimationFrame(updateProgressBar);
        });

        this.load.on('complete', () => {
          progressBar.destroy();
          progressBox.destroy();
      });
        
        // Make sure all your assets are loaded after setting up the progress bar
        this.load.audio('game_music', 'https://mygameaws.s3.us-east-1.amazonaws.com/game.mp3', {
            stream: true,
            audioPlayType: 'webaudio'
        });
    }
    

  
  // Add necessary class properties
  init() {

    this.mazeGraphics = null;
    this.cursors = null;
    this.player = null;
    this.destinationMarker = null; // Add this line
    this.maze = [];
  }

  create() {
    // Initialize graphics and input
    this.mazeGraphics = this.add.graphics();
    this.cursors = this.input.keyboard.createCursorKeys();

    // Generate and draw maze
    this.generateMaze();
    this.createPlayer();
    this.createDestination();
    this.ensurePathToDestination();
    this.createControls();
    this.startObstacleUpdate();

    // Add audio
    this.gameMusic = this.sound.add('game_music', { loop: true });

    // Create the audio toggle button
    this.createStyledButton(150, gameOptions.mazeHeight * gameOptions.tileSize + 80, "🔇", () => {
      this.handleAudioToggle();
    });

    // Resume audio context on any pointerdown event
    this.input.on('pointerdown', () => {
      if (!this.isAudioResumed) {
        this.sound.context.resume().then(() => {
          console.log("Audio context resumed");
          this.isAudioResumed = true;
        });
      }
    });
  }

  handleAudioToggle() {
    if (!this.isAudioResumed) {
      this.sound.context.resume().then(() => {
        console.log("Audio context resumed via button");
        this.isAudioResumed = true;
      });
    }

    if (this.isAudioPlaying) {
      this.gameMusic.pause();
      this.audioButton.setText("🔇");
    } else {
      this.gameMusic.play();
      this.audioButton.setText("🔊");
    }

    this.isAudioPlaying = !this.isAudioPlaying;
  }

  // Helper function to create styled buttons
  createStyledButton(x, y, label, onClick) {
    this.audioButton = this.add
      .text(x, y, label, {
        font: "bold 16px Arial",
        backgroundColor: "#007BFF",
        color: "#FFFFFF",
        padding: { x: 10, y: 6 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.audioButton.on("pointerdown", onClick);
  }
  async generateMaze() {
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

    // Add additional random paths to create multiple routes
  for (let i = 1; i < gameOptions.mazeHeight - 1; i++) {
    for (let j = 1; j < gameOptions.mazeWidth - 1; j++) {
      if (this.maze[i][j] === 1 && Math.random() < 0.2) { // 20% chance to open a wall
        this.maze[i][j] = 0;
      }
    }
  }
    this.drawMaze();
  }

  ensurePathToDestination() {
    const visited = new Set();
    const stack = [[1, 1]]; // Starting position
    visited.add(`1,1`);
  
    while (stack.length > 0) {
      const [x, y] = stack.pop();
  
      if (x === this.destination.y && y === this.destination.x) {
        return; // Destination is reachable
      }
  
      // Check all neighbors
      const directions = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];
  
      for (const [nx, ny] of directions) {
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < gameOptions.mazeHeight &&
          ny < gameOptions.mazeWidth &&
          this.maze[nx][ny] === 0 &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          stack.push([nx, ny]);
        }
      }
    }
  
    // If no path, carve one directly
    this.carvePathToDestination();
  }
  
  carvePathToDestination() {
    let [x, y] = [1, 1]; // Starting position
    while (x !== this.destination.y || y !== this.destination.x) {
      if (x < this.destination.y) x++;
      else if (x > this.destination.y) x--;
      else if (y < this.destination.x) y++;
      else if (y > this.destination.x) y--;
  
      this.maze[x][y] = 0; // Carve the path
    }
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

  async createPlayer() {
    this.player = this.add.circle(
      gameOptions.tileSize * 1.5,
      gameOptions.tileSize * 1.5,
      gameOptions.tileSize / 3,
      0x00ff00
    );
    this.player.posX = 1;
    this.player.posY = 1;

    this.destination = {
      x: gameOptions.mazeHeight - 2,
      y: gameOptions.mazeWidth - 2
    };

    const obstacles = await getObstaclePositions(gameOptions, this.player, this.maze);
    console.log("Obstacles:", obstacles);
  }
  

  // Add this new method
  createDestination() {
    // Ensure the maze is initialized
    if (!this.maze || this.maze.length === 0) {
      console.error("Maze data is not initialized correctly.");
      return;
    }

    // Function to get a random valid position
    const getRandomValidPosition = () => {
      while (true) {
        const randomY = Math.floor(Math.random() * this.maze.length);
        const randomX = Math.floor(Math.random() * this.maze[randomY].length);

        // Check if the selected position is a path
        if (this.maze[randomY][randomX] === 0) {
          return { x: randomX, y: randomY };
        }
      }
    };

    // Get a valid destination
    this.destination = getRandomValidPosition();

    // Calculate tile position
    const destX = (this.destination.x * gameOptions.tileSize) + (gameOptions.tileSize / 2);
    const destY = (this.destination.y * gameOptions.tileSize) + (gameOptions.tileSize / 2);

    // Create a star shape at the destination
    this.destinationMarker = this.add.star(
      destX,
      destY,
      5, // number of points
      gameOptions.tileSize / 3, // inner radius
      gameOptions.tileSize / 2, // outer radius
      0xFFD700, // gold color
      1 // alpha
    );

    // Add animation to make it more visible
    this.tweens.add({
      targets: this.destinationMarker,
      scale: 1.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Add text label
    this.add.text(
      destX,
      destY - gameOptions.tileSize,
      'EXIT',
      {
        font: '12px Arial',
        fill: '#FFD700',
        align: 'center'
      }
    ).setOrigin(0.5);
  }


  createControls() {
    // Create a container for controls with initial position
    const controlsContainer = this.add.container(
      70,
      gameOptions.mazeHeight * gameOptions.tileSize
    );

    // Load saved container position if exists
    const savedContainerPos = localStorage.getItem("controls_position");
    if (savedContainerPos) {
      const pos = JSON.parse(savedContainerPos);
      controlsContainer.setPosition(pos.x, pos.y);
    }

    // Helper function to create styled buttons
    const createStyledButton = (x, y, label, onClick) => {
      const button = this.add
        .text(x, y, label, {
          font: "bold 50px Arial",
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          padding: { x: 20, y: 20},
          borderRadius: 12,
          align: "center",
        })
        .setOrigin(0.5)
        .setInteractive();

      button.on("pointerdown", onClick);

      return button;
    };

    // Create control buttons
    const upButton = createStyledButton(0, -80, "⬆", () => this.movePlayer("up"));
    const downButton = createStyledButton(0, 80, "⬇", () => this.movePlayer("down"));
    const leftButton = createStyledButton(-80, 0, "⬅", () => this.movePlayer("left"));
    const rightButton = createStyledButton(80, 0, "➡", () => this.movePlayer("right"));

    // Add buttons to container
    controlsContainer.add([upButton, downButton, leftButton, rightButton]);

    // Add reset position button
    const resetButton = this.add
      .text(50, gameOptions.mazeHeight * gameOptions.tileSize + 80, "Reset", {
        font: "14px Arial",
        backgroundColor: "#FF5722",
        color: "#FFFFFF",
        padding: { x: 10, y: 6 },
        borderRadius: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive();

    resetButton.on("pointerdown", () => {
      // Reset container position
      controlsContainer.setPosition(
        170,
        gameOptions.mazeHeight * gameOptions.tileSize + 20
      );

      // Clear saved position
      localStorage.removeItem("controls_position");
    });

    this.add.existing(resetButton);

    // Make the container draggable
    controlsContainer.setInteractive(new Phaser.Geom.Rectangle(-80, -80, 160, 160), Phaser.Geom.Rectangle.Contains);
    this.input.setDraggable(controlsContainer);

    // Add drag events to container
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      // Save container position
      localStorage.setItem("controls_position", JSON.stringify({ x: gameObject.x, y: gameObject.y }));
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
        if (this.maze[this.player.posX - 1][this.player.posY] === 0) {
          newX--;
        }
        break;
      case "down":
        if (this.maze[this.player.posX + 1][this.player.posY] === 0) {
          newX++;
        }
        break;
      case "left":
        if (this.maze[this.player.posX][this.player.posY - 1] === 0) {
          newY--;
        }
        break;
      case "right":
        if (this.maze[this.player.posX][this.player.posY + 1] === 0) {
          newY++;
        }
        break;
    }

    if (newX !== this.player.posX || newY !== this.player.posY) {
      this.player.posX = newX;
      this.player.posY = newY;
      this.player.x = this.player.posY * gameOptions.tileSize + gameOptions.tileSize / 2;
      this.player.y = this.player.posX * gameOptions.tileSize + gameOptions.tileSize / 2;

      // Check win condition after movement
      this.checkWinCondition();
    }
  }

  checkWinCondition() {


    console.log("Player position:", this.player.posX, this.player.posY);
    console.log("Destination:", this.destination.x, this.destination.y);
    if (this.player.posX === this.destination.y &&
      this.player.posY === this.destination.x) {

      // Create a victory effect
      this.createVictoryEffect();

      // Emit the win event
      this.game.events.emit('playerWin');
    }
  }

  createVictoryEffect() {
    // Create particle effect
    const particles = this.add.particles(this.player.x, this.player.y, 'particle', {
      speed: { min: -100, max: 100 },
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      quantity: 50
    });

    // Stop and destroy the particles after 1 second
    this.time.delayedCall(1000, () => {
      particles.destroy();
    });
  }

  // Inside the MazeScene class
async createSingleObstacle() {
  try {
    // Get obstacle positions (but pick only one)
    const obstacles = await getObstaclePositions(gameOptions, this.player, this.maze);
    
    // Check if obstacles exist and have valid positions
    if (!obstacles || !obstacles.obstaclePositions || !obstacles.obstaclePositions.length) {
      console.log("No valid obstacles generated");
      return;
    }

    const obstacle = obstacles.obstaclePositions[0]; // Choose the first obstacle
    
    // Validate obstacle object
    if (!obstacle || typeof obstacle.x !== 'number' || typeof obstacle.y !== 'number') {
      console.log("Invalid obstacle position");
      return;
    }

    // Place the new obstacle
    this.currentObstacle = obstacle;
    
    // Check if mazeGraphics exists before drawing
    if (this.mazeGraphics && typeof this.mazeGraphics.fillCircle === 'function') {
      this.mazeGraphics.fillCircle(
        obstacle.y * gameOptions.tileSize,
        obstacle.x * gameOptions.tileSize,
        gameOptions.tileSize,
        gameOptions.tileSize
      );
    }
  } catch (error) {
    // Log the error to console but don't show in UI
    console.log("Error in createSingleObstacle:", error);
    
    // Optionally reset any state if needed
    this.currentObstacle = null;
  }
}


// Call this function every 30 seconds
startObstacleUpdate() {
  this.time.addEvent({
    delay: 10000, // 30 seconds
    callback: this.createSingleObstacle,
    callbackScope: this,
    loop: true,
  });
}

}

export default MazeScene;