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
        const baseKey = textureKey.replace('player_', ''); // e.g., 'el_abogado'
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers(`player_${baseKey}_idle`, { start: 0, end: 3 }), // Assuming 4 frames for idle
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'move_forward',
            frames: this.anims.generateFrameNumbers(`player_${baseKey}_move_forward`, { start: 0, end: 7 }), // Assuming 8 frames for move
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'move_backward',
            frames: this.anims.generateFrameNumbers(`player_${baseKey}_move_backward`, { start: 0, end: 7 }), // Assuming 8 frames for move
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers(`player_${baseKey}_jump`, { start: 0, end: 0 }), // Assuming single frame for jump
            frameRate: 1,
            repeat: 0
        });
        this.anims.create({
            key: 'throw_power',
            frames: this.anims.generateFrameNumbers(`player_${baseKey}_throw_power`, { start: 0, end: 2 }), // Assuming 3 frames for throw
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'lose_life',
            frames: this.anims.generateFrameNumbers(`player_${baseKey}_lose_life`, { start: 0, end: 4 }), // Assuming 5 frames for lose life
            frameRate: 8,
            repeat: 0
        });

        this.play('idle'); // Start with idle animation
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

        // Movement
        if (inputState.right) {
            this.setVelocityX(this.stats.speed);
            this.facing = 'right';
            this.flipX = false;
            if(onGround) this.play('move_forward', true);
        } else if (inputState.left) {
            this.setVelocityX(-this.stats.speed);
            this.facing = 'left';
            this.flipX = true; // Flip sprite to face left
            if(onGround) this.play('move_backward', true);
        } else {
            this.setVelocityX(0);
            if (onGround) {
                this.play('idle', true);
            }
        }

        // Jumping
        if (inputState.jump && onGround) {
            this.setVelocityY(-this.stats.jump);
            this.play('jump', true);
        }

        // Power-up / Firing
        if (inputState.power && time > this.lastFired) {
            this.scene.fireProjectile(this.x, this.y, this.facing);
            this.lastFired = time + this.stats.fireRate;
            this.play('throw_power', true);

            // After throwing, decide which animation to return to
            this.once('animationcomplete-throw_power', () => {
                if (!this.body.velocity.x && onGround) {
                    this.play('idle', true);
                } else if (this.body.velocity.x && onGround) {
                    this.play(this.facing === 'left' ? 'move_backward' : 'move_forward', true);
                } else if (!onGround) {
                     this.play('jump', true);
                }
            });
        }
    }
}
