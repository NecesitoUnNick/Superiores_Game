export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Preload assets for the menu
    }

    create() {
        // Add background image
        this.add.image(300, 400, 'initial_bg'); // Centered for 600x800

        // Create menu elements
        this.add.text(300, 150, 'Superiores', { fontSize: '80px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(300, 250, 'Escapando de la prisión inferior', { fontSize: '40px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(300, 600, 'Presiona ENTER para Iniciar', { fontSize: '32px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);

        // Input handling
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}
