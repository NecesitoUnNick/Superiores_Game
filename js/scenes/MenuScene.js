export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Preload assets for the menu
    }

    create() {
        // Add background image
        this.add.image(320, 240, 'initial_bg'); // Centered for 640x480

        // Create menu elements
        this.add.text(320, 80, 'Superiores', { fontSize: '80px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(320, 170, 'Escapando de la prisión inferior', { fontSize: '40px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.add.text(320, 370, 'Presiona ENTER para Iniciar', { fontSize: '32px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);

        // Input handling
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}
