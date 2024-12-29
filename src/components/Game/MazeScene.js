import Phaser from 'phaser';

const gameOptions = {
    mazeWidth: 29,  // Any odd number ≥ 7
    mazeHeight: 21, // Any odd number ≥ 7
    tileSize: 30    // Adjust based on your display size
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
                  x: gameOptions.mazeHeight - 2,
                  y: gameOptions.mazeWidth - 2
                };
              }
              
         // Add this new method
    createDestination() {
        // Create a star shape or flag at the destination
        const destY = (this.destination.x * gameOptions.tileSize) + (gameOptions.tileSize / 2);
        const destX = (this.destination.y * gameOptions.tileSize) + (gameOptions.tileSize / 2);

        // Create a star shape
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
            scale: 1.2,
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
             0,
             gameOptions.mazeHeight * gameOptions.tileSize + 100,
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
               70, 
               gameOptions.mazeHeight * gameOptions.tileSize + 30
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
            if (this.player.posX === this.destination.x && 
                this.player.posY === this.destination.y) {
                
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

}

export default MazeScene;
