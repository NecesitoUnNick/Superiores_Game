export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Preload assets for the menu
    }

    create() {
        // Create menu elements
        this.add.text(160, 100, 'Superiores: Escape', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(160, 140, 'Press ENTER to Start', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);

        // Input handling
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}
