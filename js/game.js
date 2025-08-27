// Import scenes
import MenuScene from './scenes/MenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import GameScene from './scenes/GameScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    parent: 'game-container', // Optional: if you have a div for the game
    pixelArt: true,
    zoom: 3, // Scale up the game
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
            create() {
                this.add.text(160, 120, 'Loading...', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
                // In a real scenario, you would load assets here.
                // For now, just transitioning to a placeholder MenuScene.
                // Since MenuScene is empty, this will just show a black screen.
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
