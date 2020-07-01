'use strict'

/*
 * Esta escena muestra una cinemática en la que salen un número aleatorio de
 * personajes, formula una pregunta y guarda la respuesta en answer.
 */
class Cutscene extends Phaser.Scene {
	constructor() {
		super({key:"cutscene"});
	}

	preload() {
		//CUTSCENE
		//Actors
		this.load.spritesheet('ch_blueGhostL', 'assets/characters/ch_blueGhostLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
		this.load.spritesheet('ch_redGhostL', 'assets/characters/ch_redGhostLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
		this.load.spritesheet('ch_ghostbusterL', 'assets/characters/ch_ghostbusterLateral.png',{ frameWidth: 3460/4, frameHeight: 5910/8});
		
		//Background
		this.load.image('interior', 'assets/background/bg_interior.png');
		this.load.image('frame', 'assets/background/bg_frame.png');
		
		//BATTLE
		//Cartas
		this.load.image('cd_force_ig', 'assets/cards/cd_force_ig.png');
		this.load.image('cd_reverse_ig', 'assets/cards/cd_reverse_ig.png');
		this.load.image('cd_slow_ig', 'assets/cards/cd_slow_ig.png');
		this.load.image('img_cross','assets/images/img_cross.png');
		
		//Personajes
		this.load.image('ch_ghostbusterMFace', 'assets/characters/ch_ghostbusterMFace.png');
		this.load.image('ch_ghostbusterWFace', 'assets/characters/ch_ghostbusterWFace.png');
		this.load.image('ch_blueGhostFace', 'assets/characters/ch_blueGhostFace.png');
		this.load.image('ch_redGhostFace', 'assets/characters/ch_redGhostFace.png');
		this.load.spritesheet('ch_ghostbusterM', 'assets/characters/ch_ghostbusterM.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
		this.load.spritesheet('ch_ghostbusterW', 'assets/characters/ch_ghostbusterW.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
		this.load.spritesheet('ch_blueGhost', 'assets/characters/ch_blueGhost.png',{ frameWidth: 950/4, frameHeight: 1422/6 });
		this.load.spritesheet('ch_redGhost', 'assets/characters/ch_redGhost.png',{ frameWidth: 950/4, frameHeight: 1428/6 });
		
		//Escenario
		this.load.image('sp_tombstone', 'assets/props/sp_tombstone.png');
		this.load.image('bg_cemetery', 'assets/background/bg_cemetery.png');
		
	}

	create() {
		round++;  // Actualizamos la variable global de ronda
		// Añadimos background
		let background = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'interior').setOrigin(0.5);
		background.scaleX = 1.07;
		background.scaleY = 1.07;
		
		// Creamos animaciones
		this.anims.create({
			key: 'ch_blueGhostL',
			frames: this.anims.generateFrameNumbers('ch_blueGhostL', { start: 0, end: 23 }),
			frameRate: 24,
			repeat: -1
		})
		this.anims.create({
			key: 'ch_redGhostL',
			frames: this.anims.generateFrameNumbers('ch_redGhostL', { start: 0, end: 23 }),
			frameRate: 24,
			repeat: -1
		})
		this.anims.create({
			key: 'ghostbuster',
			frames: this.anims.generateFrameNumbers('ch_ghostbusterL', { start: 0, end: 30 }),
			frameRate: 24,
			repeat: -1
		})
		
		// VARIABLES CONFIGURABLES
		this.velocities = [4, 6, 8];  										// Posibles velocidades de los fantasmas
		this.ghostbusterVelocities = [3, 4, 5]; 							// Posibles velocidades de los cazafantasmas
		this.dif = 5;  														// La dificultad: minimo de fantasmas que saldran
		this.maximumActors = 10;  											// máximo de actores posibles que saldrán ademas de la base
		this.start_pos = [-40, 1320]; 										// Posibles posiciones de inicio (antes o despues del frame)
		this.names = ['ch_blueGhostL', 'ch_redGhostL', 'ch_ghostbusterL'];  // Guarda los nombres de los identificadores de imagenes (cambiara para sprites)
		
		// Duracion del desfile, delay de pregunta y delay de cambio de escena
		this.paradeDuration = 15000;
		this.questionDelay = 2000;
		this.questionTime = 4000;
		
		// PREGUNTAS
		/*
		* Las preguntas coinciden con el índice de answers que lleva su cuenta
		* (actualizado en schedulePlaner())
		*/
		this.questions = ["¿Cuántos fantasmas azules pasaron?", "¿Cuántos fantasmas rojos pasaron?", "¿Cuántos cazafantasmas pasaron?", "¿Cuántos personajes pasaron en total?"];
		this.questionIndex = Math.trunc(Math.random() * 4); // Selecciona una pregunta aleatoria
		this.answers = [0, 0, 0, 0];
		
		// Timers para enseñar la pregunta y cambiar de escena.
		this.time.addEvent({ delay: this.paradeDuration + this.questionDelay, callback: this.showQuestion, callbackScope: this});
		this.time.addEvent({ delay: this.paradeDuration + this.questionDelay + this.questionTime, callback: this.changeScene, callbackScope: this});
		
		// Enseña la ronda que es (y lo quita en unos segundos)
		let msg = 'Ronda ' + (round);
		this.roundText = this.add.text(gameWidth*(9/20), gameHeight*(8/20), msg, { font: '64px Caveat Brush', fill: '#ffffff' });
		this.time.addEvent({ delay: 4000, callback: function () {this.roundText.setAlpha(0);}, callbackScope: this});
		
		// Funcion que se encarga de crear los actores
		this.schedulePlanner();
		this.bg_estatica = this.add.sprite(gameWidth*9/20,gameHeight/2,'bg_estatica').setAlpha(0.05);
		this.anims.create({
			key: 'bg_estatica_anim',
			frames: this.anims.generateFrameNumbers('bg_estatica'),
			frameRate: 20,
			repeat: -1
		});
		this.bg_estatica.play('bg_estatica_anim');
		this.bg_estatica.setDepth(1)
		
		this.TVBorder = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'bg_frame');
		this.TVBorder.setDepth(1.1);
	}

	// Enseña la pregunta
	showQuestion() {
		this.add.text(gameWidth*3/20, gameHeight/2, this.questions[this.questionIndex], { font: '64px Caveat Brush', fill: '#ffffff' });
		console.log(this.answers[this.questionIndex]);
	}

	// Cambia la escena y acutaliza el valor de la variable global round con la
	// respuesta
	changeScene() {
		answer = this.answers[this.questionIndex];
		console.log(this.answers[this.questionIndex] + ' = ' + answer);
		this.scene.start("battle");
	}

	// Función para hacer x llamadas a la generación de actores con un delay aleatorio
	schedulePlanner() {
		// Llama a randomCharGen x veces, dependiendo de base(dif) y extra(maximumActors).
		for (var i = 0; i < Math.floor(Math.random() * this.maximumActors) + this.dif; i++)
		{
			// Llama con delay aleatorio (entre maximo de duración y 0)
			this.time.addEvent({ delay: Math.random() * this.paradeDuration, callback: this.randomCharGen, callbackScope: this, loop: false});
		}
	}


	// Esta funcion genera 1 actor que pasa por la pantalla, con posicion inicial, sprite y velocidad aleatorios.
	randomCharGen() {
		let s_pos = Math.floor(Math.random()*2); // Indice de la posicion inicial aleatoria
		let velocity = this.velocities[Math.floor(Math.random()*3)]  // Velocidad aleatoria
		let imageIndex = Math.floor(Math.random()*3); // Indice de imagen aleatoria
		
		// Si es un cazafantasmas velocidades diferentes
		if (imageIndex == 2) {
			velocity = this.ghostbusterVelocities[Math.floor(Math.random()*3)];
		}
		
		this.answers[imageIndex]++; // Actualiza las respuestas
		this.answers[3]++;  		// Actualiza la respuestas de cuantos en total
		let flipX = false;  		// Auxiliar para velocidades negativas
		
		// Si empieza desde el final velocidad negativa
		if (s_pos == 1)  {
			velocity *= -1;
			flipX = true;
		}
		
		let actor = this.matter.add.sprite(this.start_pos[s_pos], 400, this.names[imageIndex]).setOrigin(0.5).setVelocityX(velocity).setCollisionGroup(-1).setFrictionAir(0).setFlip(flipX);
		
		// Anima según el actor
		if (imageIndex == 0)
		{
			actor.play('ch_blueGhostL');
		}
		else if (imageIndex == 1)
		{
			actor.play('ch_redGhostL');
		}
		else if (imageIndex == 2)
		{
			actor.play('ghostbuster');
		}
	}

	update(){}
}
