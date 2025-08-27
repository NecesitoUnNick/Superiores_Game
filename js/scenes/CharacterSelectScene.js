export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
        this.characters = [
            { name: 'El Abogado', key: 'player_abogado' },
            { name: 'El Financiero', key: 'player_financiero' },
            { name: 'El Cientista de Datos', key: 'player_cientista' }
        ];
        this.selectedCharacterIndex = 0;
        this.cursor = null;
        this.characterSprites = [];
    }

    preload() {
        // Create simple placeholder graphics for each character
        this.characters.forEach((char, index) => {
            let graphics = this.make.graphics({ width: 16, height: 16 });
            // Different colors for each character
            const colors = [0x0000ff, 0x00ff00, 0xff0000];
            graphics.fillStyle(colors[index], 1);
            graphics.fillRect(0, 0, 16, 16);
            graphics.generateTexture(char.key, 16, 16);
            graphics.destroy();
        });

        // Create cursor graphic
        let cursorGraphics = this.make.graphics({ x: 0, y: 0 });
        cursorGraphics.fillStyle(0xffffff, 1);
        cursorGraphics.fillTriangle(0, 0, 8, 8, 0, 16);
        cursorGraphics.generateTexture('cursor', 8, 16);
        cursorGraphics.destroy();
    }

    create() {
        this.add.text(160, 50, 'Select Your Character', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        const startX = 90;
        const spacing = 70;

        this.characters.forEach((char, index) => {
            const x = startX + (index * spacing);
            const y = 120;
            // Display character sprite
            const sprite = this.add.sprite(x, y, char.key).setScale(3);
            this.characterSprites.push(sprite);
            // Display character name
            this.add.text(x, y + 40, char.name, { fontSize: '10px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        });

        // Add cursor
        this.cursor = this.add.sprite(0, 0, 'cursor');
        this.updateCursorPosition();

        // Input handling
        const cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-ENTER', this.confirmSelection, this);
        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1), this);
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1), this);
    }

    moveSelection(change) {
        this.selectedCharacterIndex += change;

        if (this.selectedCharacterIndex < 0) {
            this.selectedCharacterIndex = this.characters.length - 1;
        } else if (this.selectedCharacterIndex >= this.characters.length) {
            this.selectedCharacterIndex = 0;
        }
        this.updateCursorPosition();
    }

    updateCursorPosition() {
        const selectedSprite = this.characterSprites[this.selectedCharacterIndex];
        this.cursor.x = selectedSprite.x - 30;
        this.cursor.y = selectedSprite.y;
    }

    confirmSelection() {
        const selectedCharacter = this.characters[this.selectedCharacterIndex];
        this.scene.start('GameScene', { character: selectedCharacter.name, characterTexture: selectedCharacter.key });
    }
}
