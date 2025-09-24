// Import scenes
import MenuScene from './scenes/MenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import GameScene from './scenes/GameScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: 1280,
        height: 720,
    },
    dom: {
        createContainer: true
    },
    pixelArt: true,
    backgroundColor: '#1a1a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false // Set to true for collision debugging
        }
    },
    scene: [
        // For now, we will add scenes here as we build them.
        // Let's start with a placeholder scene to test the setup.
        class BootScene extends Phaser.Scene {
            constructor() {
                super('BootScene');
            }
            preload() {
                this.load.image('initial_bg', 'assets/images/backgrounds/initial_bg.png');
            }
            create() {
                this.add.text(320, 240, 'Cargando...', { fontSize: '32px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
                this.scene.start('MenuScene');
            }
        },
        MenuScene,
        CharacterSelectScene,
        GameScene
    ]
};

// Initialize the game
const game = new Phaser.Game(config);

// We need to define the scenes, even if they are empty, for the import to work.
// Let's create empty classes for them in their respective files.
