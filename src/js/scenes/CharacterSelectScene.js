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
            { name: 'El Canadiense', key: 'player_canadiense', locked: true }
        ];
        this.selectedCharacterIndex = 0;
        this.cols = 4;
        this.rows = 2;

        // --- UI Elements ---
        this.background = null;
        this.title = null;
        this.characterSprites = [];
        this.characterNames = [];
        this.unlockableTexts = [];
        this.cursor = null;
        this.confirmButton = null;
        this.disclaimer = null;
    }

    preload() {
        // Preload assets if they haven't been loaded yet
        this.load.image('black_bg', 'assets/images/ui/black_bg.png');
        this.characters.forEach(char => {
            const idleTextureKey = `${char.key}_idle`;
            if (!this.textures.exists(idleTextureKey)) {
                // Only load animations once, assuming idle is representative
                const animations = ['idle', 'move_forward', 'move_backward', 'jump', 'throw_power', 'lose_life'];
                const charName = 'el_' + char.key.replace('player_', '');
                animations.forEach(animName => {
                    this.load.spritesheet(
                        `${char.key}_${animName}`,
                        `assets/images/characters/${charName}/sprite_${animName}.png`,
                        { frameWidth: 60, frameHeight: 64 }
                    );
                });
            }
        });
        if (!this.textures.exists('cursor')) {
            let cursorGraphics = this.make.graphics();
            cursorGraphics.fillStyle(0xffffff, 1);
            cursorGraphics.fillTriangle(0, 0, 8, 8, 0, 16);
            cursorGraphics.generateTexture('cursor', 8, 16);
            cursorGraphics.destroy();
        }
    }

    create() {
        // --- Create UI Elements ---
        this.background = this.add.image(0, 0, 'black_bg').setOrigin(0, 0).setDepth(-1);
        this.title = this.add.text(0, 0, 'Selecciona tu Personaje', { fill: '#fff', fontFamily: 'Arial' }).setOrigin(0.5);
        this.disclaimer = this.add.text(0, 0, '*Paga 1 BTC para desbloquear este personaje.', { fill: '#ff0000', fontFamily: 'Arial' }).setOrigin(0.5);
        this.cursor = this.add.sprite(0, 0, 'cursor');

        this.characters.forEach((char, index) => {
            const sprite = this.add.sprite(0, 0, `${char.key}_idle`).setInteractive({ useHandCursor: true });
            const nameText = this.add.text(0, 0, char.name, { fill: '#fff', align: 'center', fontFamily: 'Arial' }).setOrigin(0.5);

            sprite.on('pointerdown', () => this.selectCharacter(index));

            this.characterSprites.push(sprite);
            this.characterNames.push(nameText);

            if (char.locked) {
                const unlockableText = this.add.text(0, 0, '¡Personaje Desbloqueable!*', { fill: '#0f0', fontFamily: 'Arial' }).setOrigin(0.5);
                this.unlockableTexts.push({ text: unlockableText, index: index });
            }
        });

        this.confirmButton = this.add.text(0, 0, 'Confirmar', {
            fontFamily: 'Arial', fill: '#fff', backgroundColor: '#555', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);

        // --- Event Listeners ---
        this.confirmButton.on('pointerdown', this.confirmSelection, this);
        this.confirmButton.on('pointerover', () => this.confirmButton.setBackgroundColor('#777'));
        this.confirmButton.on('pointerout', () => this.confirmButton.setBackgroundColor('#555'));

        this.input.keyboard.on('keydown-ENTER', this.confirmSelection, this);
        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1), this);
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1), this);
        this.input.keyboard.on('keydown-UP', () => this.moveSelection(-this.cols), this);
        this.input.keyboard.on('keydown-DOWN', () => this.moveSelection(this.cols), this);

        this.scale.on('resize', this.handleResize, this);
        this.handleResize(this.scale.getViewPort());
        this.updateCursorPosition();
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;
        const baseWidth = 1280;
        const baseHeight = 720;
        const scale = Math.min(width / baseWidth, height / baseHeight);

        this.background.setDisplaySize(width, height);

        const isVertical = height > width;
        this.cols = isVertical ? 2 : 4;
        this.rows = isVertical ? 4 : 2;

        const gridWidth = isVertical ? width * 0.8 : width * 0.9;
        const gridHeight = isVertical ? height * 0.7 : height * 0.6;
        const colSpacing = gridWidth / this.cols;
        const rowSpacing = gridHeight / this.rows;
        const startX = (width - gridWidth) / 2 + colSpacing / 2;
        const startY = (height - gridHeight) / 2 + rowSpacing / 2;

        this.title.setPosition(width / 2, height * 0.1).setFontSize(60 * scale);

        this.characterSprites.forEach((sprite, index) => {
            const x = startX + (index % this.cols) * colSpacing;
            const y = startY + Math.floor(index / this.cols) * rowSpacing;
            sprite.setPosition(x, y).setScale(3 * scale);
            this.characterNames[index].setPosition(x, y + (100 * scale)).setFontSize(24 * scale);
        });

        this.unlockableTexts.forEach(item => {
            const charSprite = this.characterSprites[item.index];
            item.text.setPosition(charSprite.x, charSprite.y - (60 * scale)).setFontSize(16 * scale);
        });

        this.updateCursorPosition();
        this.confirmButton.setPosition(width / 2, height * 0.9).setFontSize(32 * scale);
        this.disclaimer.setPosition(width / 2, height - (25 * scale)).setFontSize(20 * scale);
    }

    selectCharacter(index) {
        if (this.characters[index].locked) return;
        this.selectedCharacterIndex = index;
        this.updateCursorPosition();
        this.confirmButton.setVisible(true);
    }

    moveSelection(change) {
        let newIndex = this.selectedCharacterIndex + change;
        if (newIndex < 0) newIndex = this.characters.length - 1;
        if (newIndex >= this.characters.length) newIndex = 0;

        if (!this.characters[newIndex].locked) {
            this.selectedCharacterIndex = newIndex;
            this.updateCursorPosition();
            this.confirmButton.setVisible(true);
        }
    }

    updateCursorPosition() {
        if (!this.characterSprites[this.selectedCharacterIndex]) return;
        const selectedSprite = this.characterSprites[this.selectedCharacterIndex];
        this.cursor.setPosition(selectedSprite.x - selectedSprite.displayWidth * 0.7, selectedSprite.y);
        this.cursor.setScale(selectedSprite.scale * 0.1);
    }

    confirmSelection() {
        if (!this.confirmButton.visible) return;
        const selectedCharacter = this.characters[this.selectedCharacterIndex];
        if (selectedCharacter.locked) return;

        this.input.keyboard.removeAllListeners();
        this.confirmButton.disableInteractive().setVisible(false);

        const scale = Math.min(this.scale.width / 1280, this.scale.height / 720);
        this.add.text(this.scale.width / 2, this.scale.height / 2, `INICIANDO CON\n${selectedCharacter.name.toUpperCase()}`, {
            fontSize: `${60 * scale}px`,
            fill: '#0f0',
            align: 'center',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
             this.scene.start('GameScene', { character: selectedCharacter.name, characterTexture: selectedCharacter.key });
        });
    }
}