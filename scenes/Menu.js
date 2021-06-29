class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('menuBack', './assets/MenuBackground.png');
    }

    create() {

      this.menuBack = this.add.tileSprite(0, 0, 640, 480, 'menuBack').setOrigin(0, 0);


        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '60px',
            backgroundColor: null, //'#000000',//#F3B141
            color: '#FFFFFF',
            align: 'center',
            fontStyle: 'bold',
            strokeThickness: 0,
            stroke: '#000',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 4 - borderPadding,
        'ROCKET PATROL', menuConfig).setOrigin(0.5);


        menuConfig.fontSize = '32px';
        menuConfig.color = '#06f106';
        this.add.text(game.config.width/2, game.config.height/2, 
        'Use mouse to move \n& left click to fire', menuConfig).setOrigin(0.5);

        //menuConfig.backgroundColor = '#00DD88';
        menuConfig.fontSize = '42px';
        menuConfig.color = '#000';
        menuConfig.stroke = '#FFFFFF';
        menuConfig.strokeThickness = 5;
        
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize*4 + borderPadding,
        'Press <- for Novice\nor -> for Expert', menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        game.settings = {
          spaceshipSpeed: 3,
          gameTimer: 60000,
          NasaSpeed: 5  
        }
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'spaceship', 0, 30).setOrigin(0, 0);
    }

    update() {
        this.ship01.update();
        this.menuBack.tilePositionX -= 2;

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
            NasaSpeed: 5  
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000,
            NasaSpeed: 6
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
      }
}