export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Preload assets for the menu
    }

    create() {
        // Add background image
        this.add.image(400, 300, 'initial_bg'); // Centered for 800x600

        // Create menu elements
        this.add.text(400, 100, 'Superiores', { fontSize: '80px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(400, 200, 'Escapando de la prisión inferior', { fontSize: '40px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(400, 450, 'Presiona ENTER para Iniciar', { fontSize: '32px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);

        // Input handling
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}
