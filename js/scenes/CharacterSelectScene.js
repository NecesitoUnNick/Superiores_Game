export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
        this.characters = [
            { name: 'El Abogado', key: 'player_abogado' },
            { name: 'El Financiero', key: 'player_financiero' },
            { name: 'El Cientista de Datos', key: 'player_cientista' },
            { name: 'El Trader', key: 'player_trader' },
            { name: 'El Consultor', key: 'player_consultor' },
            { name: 'El Diseñador', key: 'player_disenador' },
            { name: 'El Comercial', key: 'player_comercial' },
            { name: 'El Canadiense*', key: 'player_canadiense', locked: true } // El Canadiense is now locked
        ];
        this.selectedCharacterIndex = 0;
        this.cursor = null;
        this.characterSprites = [];
        this.cols = 4; // Number of columns
        this.rows = 2; // Adjusted for 8 characters (4x2)
    }

    preload() {
        this.load.image('black_bg', 'assets/images/ui/black_bg.png');
        this.load.spritesheet('player_abogado', 'assets/images/characters/el_abogado/player_abogado.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player_financiero', 'assets/images/characters/el_financiero/player_financiero.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player_cientista', 'assets/images/characters/el_cientista/player_cientista.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player_trader', 'assets/images/characters/el_trader/player_trader.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player_consultor', 'assets/images/characters/el_consultor/player_consultor.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player_disenador', 'assets/images/characters/el_disenador/player_disenador.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('player_comercial', 'assets/images/characters/el_comercial/player_comercial.png', { frameWidth: 16, frameHeight: 16 });
        // Removed player_futbolista
        this.load.spritesheet('player_canadiense', 'assets/images/characters/el_canadiense/player_canadiense.png', { frameWidth: 16, frameHeight: 16 }); // New character sprite

        // Create cursor graphic
        let cursorGraphics = this.make.graphics({ x: 0, y: 0 });
        cursorGraphics.fillStyle(0xffffff, 1);
        cursorGraphics.fillTriangle(0, 0, 8, 8, 0, 16);
        cursorGraphics.generateTexture('cursor', 8, 16);
        cursorGraphics.destroy();
    }

    create() {
        this.add.image(320, 240, 'black_bg').setDepth(-1); // Add black background, centered for 640x480

        this.add.text(320, 50, 'Selecciona tu Personaje', { fontSize: '40px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5); // Adjusted Y position

        const startX = 80; // Adjusted for 4 columns
        const startY = 200; // Adjusted for 2 rows
        const colSpacing = 160; // Spacing between columns
        const rowSpacing = 150; // Spacing between rows

        this.characters.forEach((char, index) => {
            const x = startX + (index % this.cols) * colSpacing;
            const y = startY + Math.floor(index / this.cols) * rowSpacing;
            // Display character sprite
            const sprite = this.add.sprite(x, y, char.key);
            this.characterSprites.push(sprite);
            // Display character name
            this.add.text(x, y + 80, char.name, { fontSize: '20px', fill: '#fff', align: 'center', fontFamily: 'Arial' }).setOrigin(0.5);

            // Add "caracter desbloqueable" text for El Canadiense
            if (char.name === 'El Canadiense') {
                this.add.text(x, y - 40, '¡Personaje Desbloqueable!', { fontSize: '11px', fill: '#0f0', fontFamily: 'Arial' }).setOrigin(0.5);
            }
        });

        // Add cursor
        this.cursor = this.add.sprite(0, 0, 'cursor');
        this.updateCursorPosition();

        // Input handling
        const cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-ENTER', this.confirmSelection, this);
        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1), this);
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1), this);
        this.input.keyboard.on('keydown-UP', () => this.moveSelection(-this.cols), this); // New: Up arrow
        this.input.keyboard.on('keydown-DOWN', () => this.moveSelection(this.cols), this); // New: Down arrow

        // Add disclaimer at the bottom
        this.add.text(120, 460, '*Paga 1 BTC para desbloquear este personaje.', { fontSize: '10 px', fill: '#ff0000', fontFamily: 'Arial' }).setOrigin(0.5);
    }

    moveSelection(change) {
        this.selectedCharacterIndex += change;

        // Handle wrapping for 8 characters (4 columns, 2 rows)
        if (this.selectedCharacterIndex < 0) {
            this.selectedCharacterIndex = this.characters.length + this.selectedCharacterIndex;
        } else if (this.selectedCharacterIndex >= this.characters.length) {
            this.selectedCharacterIndex = this.selectedCharacterIndex - this.characters.length;
        }
        this.updateCursorPosition();
    }

    updateCursorPosition() {
        const selectedSprite = this.characterSprites[this.selectedCharacterIndex];
        this.cursor.x = selectedSprite.x - 60; // Adjusted for larger sprites/spacing
        this.cursor.y = selectedSprite.y;
    }

    confirmSelection() {
        const selectedCharacter = this.characters[this.selectedCharacterIndex];
        if (selectedCharacter.locked) {
            // Optionally play a sound or show a message that character is locked
            console.log('Character is locked!');
            return; // Prevent selection
        }
        this.scene.start('GameScene', { character: selectedCharacter.name, characterTexture: selectedCharacter.key });
    }
}