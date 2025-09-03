export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey, type) {
        super(scene, x, y, textureKey);

        this.type = type; // 'guard', 'rat'
        this.speed = 50;

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enemy physics properties
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);

        // Adjust size and speed based on type
        if (this.type === 'rat') {
            this.setScale(0.75);
            this.speed = 70;
        } else {
            this.setScale(1.5);
        }

        // Start moving
        this.setVelocityX(this.speed);
    }

    update() {
        // Basic patrolling AI: reverse direction on wall collision
        if (this.body.blocked.right) {
            this.setVelocityX(-this.speed);
            this.flipX = true; // Flip sprite to face left
        } else if (this.body.blocked.left) {
            this.setVelocityX(this.speed);
            this.flipX = false; // Flip sprite to face right
        }
    }
}
