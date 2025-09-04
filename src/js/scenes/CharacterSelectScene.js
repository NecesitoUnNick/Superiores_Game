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
            { name: 'El Canadiense', key: 'player_canadiense', locked: true } // El Canadiense is now locked
        ];
        this.selectedCharacterIndex = 0;
        this.cursor = null;
        this.characterSprites = [];
        this.cols = 4; // Number of columns
        this.rows = 2; // Adjusted for 8 characters (4x2)
    }

    preload() {
        this.load.image('black_bg', 'assets/images/ui/black_bg.png');

        const animations = [
            'idle'//, 'move_forward', 'move_backward', 'jump', 'throw_power', 'lose_life'
        ];

        this.characters.forEach(char => {
            const charName = 'el_' + char.key.replace('player_', '');
            animations.forEach(animName => {
                this.load.spritesheet(
                    `${char.key}_${animName}`,
                    `assets/images/characters/${charName}/sprite_${animName}.png`,
                    { frameWidth: 60, frameHeight: 64 }
                );
            });
        });

        // Create cursor graphic
        let cursorGraphics = this.make.graphics({ x: 0, y: 0 });
        cursorGraphics.fillStyle(0xffffff, 1);
        cursorGraphics.fillTriangle(0, 0, 8, 8, 0, 16);
        cursorGraphics.generateTexture('cursor', 8, 16);
        cursorGraphics.destroy();
    }

    create() {
        const { width, height } = this.sys.game.config;
        this.add.image(width / 2, height / 2, 'black_bg').setDepth(-1);

        this.add.text(width / 2, 80, 'Selecciona tu Personaje', { fontSize: '48px', fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);

        const colSpacing = 200;
        const rowSpacing = 220;
        const gridWidth = this.cols * colSpacing;
        const startX = (width - gridWidth) / 2 + (colSpacing / 2);
        const gridHeight = this.rows * rowSpacing;
        const startY = (height - gridHeight) / 2 + (rowSpacing / 2);


        this.characters.forEach((char, index) => {
            const x = startX + (index % this.cols) * colSpacing;
            const y = startY + Math.floor(index / this.cols) * rowSpacing;
            const sprite = this.add.sprite(x, y, `${char.key}_idle`);
            this.characterSprites.push(sprite);
            // Display character name
            this.add.text(x, y + 80, char.name, { fontSize: '20px', fill: '#fff', align: 'center', fontFamily: 'Arial' }).setOrigin(0.5);

            // Add "caracter desbloqueable" text for El Canadiense
            if (char.name === 'El Canadiense') {
                this.add.text(x, y - 40, '¡Personaje Desbloqueable!*', { fontSize: '10px', fill: '#0f0', fontFamily: 'Arial' }).setOrigin(0.5);
            }
        });

        // Add cursor
        this.cursor = this.add.sprite(0, 0, 'cursor');
        this.updateCursorPosition();

        // Input handling
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        this.enterKey.on('down', this.confirmSelection, this);
        this.leftKey.on('down', () => this.moveSelection(-1), this);
        this.rightKey.on('down', () => this.moveSelection(1), this);
        this.upKey.on('down', () => this.moveSelection(-this.cols), this);
        this.downKey.on('down', () => this.moveSelection(this.cols), this);

        // The clear button was here

        // Add disclaimer at the bottom
        this.add.text(width / 2, height - 40, '*Paga 1 BTC para desbloquear este personaje.', { fontSize: '14px', fill: '#ff0000', fontFamily: 'Arial' }).setOrigin(0.5);
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
            console.log('Character is locked!');
            return;
        }

        // Show "Selected" text and the Clear button
        if (!this.selectedText) {
            const selectedSprite = this.characterSprites[this.selectedCharacterIndex];
            this.selectedText = this.add.text(selectedSprite.x, selectedSprite.y + 120, 'Selected!', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5);
        }
        // this.clearButton.setVisible(true);

        // Disable movement keys
        this.leftKey.enabled = false;
        this.rightKey.enabled = false;
        this.upKey.enabled = false;
        this.downKey.enabled = false;
        this.enterKey.enabled = false; // Prevent re-selecting

        // After a delay, proceed to the game
        this.time.delayedCall(1000, () => {
             this.scene.start('GameScene', { character: selectedCharacter.name, characterTexture: selectedCharacter.key });
        });
    }

}