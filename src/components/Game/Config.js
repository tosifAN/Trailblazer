import MazeScene from "./MazeScene";
import Phaser from "phaser";
  
  export const Config = (gameWidth, gameHeight, gameContainerRef) => ({
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: gameContainerRef.current,
      backgroundColor: '#ffffff',
      scene: MazeScene
    });


  export const gameOptions = {
        mazeWidth: 21,
        mazeHeight: 21,
        tileSize: 20,
      };