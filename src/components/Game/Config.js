import MazeScene from "./MazeScene";
import Phaser from "phaser";
  
export const gameOptions = {
    mazeWidth: 21,
    mazeHeight: 21,
    tileSize: 20,
  };

export const Config = (gameContainerRef) => {
    const gameWidth = gameOptions.mazeWidth * gameOptions.tileSize + 800;
    const gameHeight = gameOptions.mazeHeight * gameOptions.tileSize + 420;
    return {
      type: Phaser.CANVAS,
      width: gameWidth,
      height: gameHeight,
      parent: gameContainerRef.current,
      backgroundColor: '#ffffff',
      scene: MazeScene,
      callbacks: {
        postBoot: (game) => {
          console.log('Game booted', game);
        },
      },
};
};
