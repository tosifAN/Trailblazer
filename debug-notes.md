## Scene Constructor Issue Analysis

The error "scene is not a constructor" typically occurs when Phaser can't properly instantiate a scene class. Looking at the implementation:

1. The scene configuration in PhaserMazeGame.js is correct:
   ```javascript
   scene: [MazeScene, GameOver]
   ```

2. The MazeScene class is properly:
   - Exported using `export class MazeScene`
   - Extends `Phaser.Scene`
   - Has a constructor calling `super({ key: 'MazeScene' })`

Potential issues to check:
1. Ensure all necessary Phaser.Scene lifecycle methods are properly implemented
2. Verify the import/export chain is working correctly
3. Make sure there are no circular dependencies

Recommendation:
Try explicitly specifying the scene configuration using the full scene config object:

```javascript
scene: [
    {
        key: 'MazeScene',
        active: true,
        visible: true,
        class: MazeScene
    },
    {
        key: 'GameOver',
        active: false,
        visible: false,
        class: GameOver
    }
]
```