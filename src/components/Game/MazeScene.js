// src/components/MazeScene.js
import Phaser from 'phaser';

const gameOptions = {
    mazeWidth: 21,
    mazeHeight: 21,
    tileSize: 20,
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

export default MazeScene;
