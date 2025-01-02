import Phaser from "phaser";
import MazeScene from "./MazeScene";

export const gameOptions = {
  mazeWidth: 21,
  mazeHeight: 21,
  tileSize: 28
};

export const createGameConfig = (containerRef) => {
  const gameWidth = gameOptions.mazeWidth * gameOptions.tileSize;
  const gameHeight = gameOptions.mazeHeight * gameOptions.tileSize;
  
  return {
    type: Phaser.CANVAS,
    width: gameWidth,
    height: gameHeight,
    parent: containerRef,
    backgroundColor: '#FFFFFF',
    scene: [MazeScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    fps: {
      target: 90,
      forceSetTimeOut: true,
      min: 30
    },
    disableContextMenu: true,
    powerPreference: 'high-performance',
    //clearBeforeRender: false,
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true
    },
    scale: {
     // mode: Phaser.Scale.FIT,
     // autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
};