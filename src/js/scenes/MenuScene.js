export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
        this.background = null;
        this.titleText = null;
        this.subtitleText = null;
        this.playButton = null;
    }

    create() {
        // Create background
        this.background = this.add.image(0, 0, 'initial_bg').setOrigin(0, 0);

        // Create menu elements
        const centerX = this.scale.width / 2;

        this.titleText = this.add.text(centerX, this.scale.height * 0.2, 'Superiores', {
            fontFamily: 'Arial',
            fill: '#fff'
        }).setOrigin(0.5);

        this.subtitleText = this.add.text(centerX, this.scale.height * 0.35, 'Escapando de la prisión inferior', {
            fontFamily: 'Arial',
            fill: '#fff'
        }).setOrigin(0.5);

        this.playButton = this.add.text(centerX, this.scale.height * 0.65, 'Jugar', {
            fontFamily: 'Arial',
            fill: '#fff',
            backgroundColor: '#555555',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // --- Button Interactivity ---
        this.playButton.on('pointerover', () => {
            this.playButton.setBackgroundColor('#777777');
        });

        this.playButton.on('pointerout', () => {
            this.playButton.setBackgroundColor('#555555');
        });

        this.playButton.on('pointerdown', () => {
            // Remove the listener to prevent multiple clicks
            this.playButton.disableInteractive();
            this.scene.start('CharacterSelectScene');
        });

        // Listen for the resize event
        this.scale.on('resize', this.handleResize, this);

        // Call the resize handler once to initially position and scale elements
        this.handleResize(this.scale.getViewPort());
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;
        const baseWidth = 1280;
        const baseHeight = 720;

        // Calculate a scale factor based on the smaller dimension relative to the base resolution.
        // This ensures that our UI elements scale proportionally in any aspect ratio.
        const scale = Math.min(width / baseWidth, height / baseHeight);

        // Scale and position background
        this.background.setDisplaySize(width, height);

        // --- Position and Scale UI Elements ---
        const centerX = width / 2;

        // Title
        this.titleText.setPosition(centerX, height * 0.2);
        this.titleText.setFontSize(96 * scale); // Base font size of 96px

        // Subtitle
        this.subtitleText.setPosition(centerX, height * 0.35);
        this.subtitleText.setFontSize(36 * scale); // Base font size of 36px

        // Play Button (TASK-03: Font size reduced)
        this.playButton.setPosition(centerX, height * 0.65);
        this.playButton.setFontSize(28 * scale); // Base font size of 28px
    }
}
