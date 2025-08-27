import controls from '../utils/controls.js';

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
        this.setCollideWorldBounds(true);
        this.setScale(2);
        this.setBounce(0.1);

        // Setup controls
        this.keys = {};
        for (const action in controls) {
            this.keys[action] = controls[action].map(key => this.scene.input.keyboard.addKey(key));
        }
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
            default:
                return { speed: 100, jump: 350, power: 'none', fireRate: 500 };
        }
    }

    // Helper to check if any key for an action is down
    isActionDown(action) {
        return this.keys[action].some(key => key.isDown);
    }

    // Helper to check if an action was just pressed
    isActionJustDown(action) {
        return this.keys[action].some(key => Phaser.Input.Keyboard.JustDown(key));
    }

    update(time, delta) {
        const onGround = this.body.touching.down;

        // Movement
        if (this.isActionDown('left')) {
            this.setVelocityX(-this.stats.speed);
            this.facing = 'left';
            this.flipX = true;
        } else if (this.isActionDown('right')) {
            this.setVelocityX(this.stats.speed);
            this.facing = 'right';
            this.flipX = false;
        } else {
            this.setVelocityX(0);
        }

        // Jumping
        if (this.isActionDown('jump') && onGround) {
            this.setVelocityY(-this.stats.jump);
        }

        // Power-up / Firing
        if (this.isActionDown('power') && time > this.lastFired) {
            this.scene.fireProjectile(this.x, this.y, this.facing);
            this.lastFired = time + this.stats.fireRate;
        }
    }
}
