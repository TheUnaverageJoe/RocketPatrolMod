// Joe Carter
// Rocket_Patrol_Mod
// June 28 2021
// ~15 hours
// The phaser 3 documentation sucks and I hate it

// -----------MODIFICATIONS---------
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Implement mouse control for player movement and mouse click to fire (20)
// Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)

// Create a new title screen (e.g., new artwork, typography, layout) (10)
// Display the time remaining (in seconds) on the screen (10)


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyG, keyLEFT, keyRIGHT;