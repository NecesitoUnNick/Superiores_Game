import inputState from '../utils/inputState.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, character, textureKey) {
        super(scene, x, y, textureKey);

        this.character = character;
        this.stats = this.getCharacterStats();
        this.lastFired = 0;
        this.facing = 'right';

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Player physics properties
        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.body.setSize(32, 48);

        // Define animations
        this.anims.create({
            key: `${textureKey}_idle`,
            frames: this.anims.generateFrameNumbers(`${textureKey}_idle`, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: `${textureKey}_move_forward`,
            frames: this.anims.generateFrameNumbers(`${textureKey}_move_forward`, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: `${textureKey}_move_backward`,
            frames: this.anims.generateFrameNumbers(`${textureKey}_move_backward`, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: `${textureKey}_jump`,
            frames: this.anims.generateFrameNumbers(`${textureKey}_jump`, { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
        });
        this.anims.create({
            key: `${textureKey}_throw_power`,
            frames: this.anims.generateFrameNumbers(`${textureKey}_throw_power`, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: `${textureKey}_lose_life`,
            frames: this.anims.generateFrameNumbers(`${textureKey}_lose_life`, { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0
        });

        this.play(`${textureKey}_idle`); // Start with idle animation
    }

    getCharacterStats() {
        // Return stats specific to the character
        switch (this.character) {
            case 'El Abogado':
                return { speed: 100, jump: 350, power: 'book', fireRate: 500 };
            case 'El Financiero':
                return { speed: 120, jump: 320, power: 'money', fireRate: 400 };
            case 'El Cientista de Datos':
                return { speed: 90, jump: 380, power: 'brain', fireRate: 600 };
            case 'El Trader':
                return { speed: 110, jump: 330, power: 'bitcoin', fireRate: 450 };
            case 'El Consultor':
                return { speed: 95, jump: 360, power: 'powerpoint', fireRate: 550 };
            case 'El Diseñador':
                return { speed: 105, jump: 340, power: 'photoshop', fireRate: 480 };
            case 'El Comercial':
                return { speed: 130, jump: 300, power: 'backhoe', fireRate: 350 };
            case 'El Canadiense':
                return { speed: 100, jump: 350, power: 'maple_leaf', fireRate: 500 }; // Changed power to maple_leaf
            default:
                return { speed: 100, jump: 350, power: 'none', fireRate: 500 };
        }
    }

    update(time, delta) {
        const onGround = this.body.touching.down;

        // Horizontal Movement
        if (inputState.right) {
            this.setVelocityX(this.stats.speed);
            this.facing = 'right';
            this.flipX = false;
        } else if (inputState.left) {
            this.setVelocityX(-this.stats.speed);
            this.facing = 'left';
            this.flipX = true;
        } else {
            this.setVelocityX(0);
        }

        // Jumping
        if (inputState.jump && onGround) {
            this.setVelocityY(-this.stats.jump);
        }

        // Animations
        if (onGround) {
            if (this.body.velocity.x !== 0) {
                this.play(this.facing === 'left' ? `${this.texture.key}_move_backward` : `${this.texture.key}_move_forward`, true);
            } else {
                this.play(`${this.texture.key}_idle`, true);
            }
        } else {
            this.play(`${this.texture.key}_jump`, true);
        }

        // Power-up / Firing
        if (inputState.power && time > this.lastFired) {
            this.scene.fireProjectile(this.x, this.y, this.facing);
            this.lastFired = time + this.stats.fireRate;
            this.play(`${this.texture.key}_throw_power`, true);
        }
    }
}
