'use strict'

class Intro extends Phaser.Scene {
	constructor() {
		super({key:"intro"});
	}

	preload() {
		//INTRO
		this.load.image('img_title','assets/images/img_title.png')
		//MENU
		//Background
		this.load.image('bg_black', 'assets/background/1280x720-black-solid-color-background.jpg');
		this.load.image('bg_frame', 'assets/background/bg_frame.png');
		this.load.image('bg_square', 'assets/background/bg_square.png');
		this.load.spritesheet('bg_estatica', 'assets/background/bg_estatica.png', { frameWidth: 1280, frameHeight: 720});
		//Botones
		this.load.image('bt_play', 'assets/buttons/bt_play.png');
		this.load.image('bt_online', 'assets/buttons/bt_online.png');
		this.load.image('bt_tutorial', 'assets/buttons/bt_tutorial.png');
		this.load.image('bt_return', 'assets/buttons/bt_return.png');
		this.load.image('bt_advance', 'assets/buttons/bt_advance.png');
		this.load.image('bt_ghostbusterM', 'assets/buttons/bt_ghostbusterM.png');
		this.load.image('bt_ghostbusterW', 'assets/buttons/bt_ghostbusterW.png');
		this.load.image('bt_blueGhost', 'assets/buttons/bt_blueGhost.png');
		this.load.image('bt_redGhost', 'assets/buttons/bt_redGhost.png');
		this.load.image('bt_ready', 'assets/buttons/bt_ready.png');
		this.load.image('bt_chat','assets/buttons/bt_chat.png');
		this.load.image('img_teamSelect', 'assets/images/img_teamSelect.png');
		this.load.image('img_abilitiesSelect', 'assets/images/img_abilitiesSelect.png');
		this.load.image('img_player1', 'assets/images/img_player1.png');
		this.load.image('img_player2', 'assets/images/img_player2.png');
		//Cartas de habilidades
		this.load.image('cd_force', 'assets/cards/cd_force.png');
		this.load.image('cd_reverse', 'assets/cards/cd_reverse.png');
		this.load.image('cd_slow', 'assets/cards/cd_slow.png');
		//Imagenes
		this.load.image('img_tutorial1', 'assets/images/img_tutorial1.png');
		this.load.image('img_tutorial2', 'assets/images/img_tutorial2.png');
	}

	create() {
		this.title = this.add.image(gameWidth/2, gameHeight/2, 'img_title').setInteractive();
		this.title.on('pointerdown', function(pointer){
			this.scene.start('menu');
		}, this);
	
		this.bg_estatica = this.add.sprite(gameWidth*11/20,gameHeight/2,'bg_estatica').setAlpha(0.05);
		this.anims.create({
			key: 'bg_estatica_anim',
			frames: this.anims.generateFrameNumbers('bg_estatica'),
			frameRate: 20,
			repeat: -1
		});
		this.bg_estatica.play('bg_estatica_anim');
	
		this.TVBorder = this.add.image(gameWidth/2, gameHeight/2, 'bg_frame');
	
		//Eliminar el video de introHTML
		this.time.addEvent({ delay: 1000, callback: function() {
			var introElem = document.getElementById('introHTML');
			introElem.parentNode.removeChild(introElem);
		}, callbackScope: this});
	}
	
	update(){}
}
