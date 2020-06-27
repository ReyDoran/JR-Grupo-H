'use strict'

var used = false;

/*
 * Escena que contiene el juego. Es llamada por cutscene y este la llama hasta
 * que se cumplan las rondas indicadas. Después vuelve al menú.
 */
class BattleOnline extends Phaser.Scene
{
	constructor() {
		super({key:"battleOnline"});
	}

	preload() {}

	/*
	 * Función que configura los jugadores y el mapa para usando físicas matter.js
	 */
	initMatterPhysics(){
		// Iniciar jugadores
		// Crear imagenes dependiendo de la configuración elegida
		let widthPos1 = gameWidth*5.5/14;
		let widthPos2 = gameWidth*8.5/14;
		
		if(player1Config[0]==0){
			this.player1 = this.matter.add.sprite(widthPos1, gameHeight/2, 'ch_ghostbusterM').setScale(0.8);
			this.iconP1 = this.add.image(widthPos1, gameHeight/9, 'ch_ghostbusterMFace');
		} else if(player1Config[0]==1){
			this.player1 = this.matter.add.sprite(widthPos1, gameHeight/2, 'ch_ghostbusterW').setScale(0.8);
			this.iconP1 = this.add.image(widthPos1, gameHeight/9, 'ch_ghostbusterWFace');
		} else if(player1Config[0]==2){
			this.player1 = this.matter.add.sprite(widthPos1, gameHeight/2, 'ch_blueGhost').setScale(0.8);
			this.iconP1 = this.add.image(widthPos1, gameHeight/9, 'ch_blueGhostFace');
		} else if(player1Config[0]==3) {
			this.player1 = this.matter.add.sprite(widthPos1, gameHeight/2, 'ch_redGhost').setScale(0.8);
			this.iconP1 = this.add.image(widthPos1, gameHeight/9, 'ch_redGhostFace');
		}
		
		if(player2Config[0]==0){
			this.player2 = this.matter.add.sprite(widthPos2, gameHeight/2, 'ch_ghostbusterM').setScale(0.8);
			this.iconP2 = this.add.image(widthPos2, gameHeight/9, 'ch_ghostbusterMFace').setFlip(true);
		} else if(player2Config[0]==1){
			this.player2 = this.matter.add.sprite(widthPos2, gameHeight/2, 'ch_ghostbusterW').setScale(0.8);
			this.iconP2 = this.add.image(widthPos2, gameHeight/9, 'ch_ghostbusterWFace').setFlip(true);
		} else if(player2Config[0]==2){
			this.player2 = this.matter.add.sprite(widthPos2, gameHeight/2, 'ch_blueGhost').setScale(0.8);
			this.iconP2 = this.add.image(widthPos2, gameHeight/9, 'ch_blueGhostFace').setFlip(true);
		} else if(player2Config[0]==3){
			this.player2 = this.matter.add.sprite(widthPos2, gameHeight/2, 'ch_redGhost').setScale(0.8);
			this.iconP2 = this.add.image(widthPos2, gameHeight/9, 'ch_redGhostFace').setFlip(true);
		}
		
		// Añadir colisión circular
		this.player1.setBody({
			type: 'circle',
			radius: 42*0.8
		});
		this.player2.setBody({
			type: 'circle',
			radius: 42*0.8
		});
		
		// Añadir bounce y fricción
		this.player1.setBounce(0.9);
		this.player2.setBounce(0.9);
		this.player1.setFriction(0);
		this.player2.setFriction(0);
		this.player1.setFrictionAir(0.05);
		this.player2.setFrictionAir(0.05);
		
		// Iniciar escenario
		this.matter.world.setBounds(20, 0, 1227, 690);
	}
	
	//Función que añade al mapa tumbas con numeros diferentes, asignando la correcta a base buena
	initTombstones(){
		// Creamos el texto de cada tumba
		this.tombstones = [this.add.image(gameWidth*(1/4),gameHeight*(2/3),'sp_tombstone').setOrigin(0.5).setScale(0.05).setAngle(90),
		this.add.image(gameWidth*(3/4),gameHeight*(2/3),'sp_tombstone').setOrigin(0.5).setScale(0.05).setAngle(90),
		this.add.image(gameWidth*(1/2),gameHeight*(2/5),'sp_tombstone').setOrigin(0.5).setScale(0.05).setAngle(90)];
		
		/*
		 * Creo un array con 2 números dentro de un rango diferentes a la respuesta (y
		 * entre sí) No sirve para answerVariations menores que 2
		 */
		let numbers = [answer, 0, 0];
		let rand = numbers[0];
		
		while (rand == numbers[0] || rand < 0){ // Mientras ya se encuentre en el array, genera otro
			rand = answer + Math.trunc(Math.random()*(this.answerVariation+1)) - Math.trunc(Math.random()*(this.answerVariation+1));
		}
		numbers[1] = rand;
		rand = numbers[0];
		while (rand == numbers[0] || rand == numbers[1] || rand < 0){
			rand = answer + Math.trunc(Math.random()*(this.answerVariation+1)) - Math.trunc(Math.random()*(this.answerVariation+1));
		}
		numbers[2] = rand;
		
		// Añade le texto a la tumba escogiendo aleatoriamente los numeros del array en las tumbas.
		let aux;
		console.log(round);
		aux = correctTombstones[round];
		
		if (numbers[aux] == answer){
			this.correctTombstone = this.tombstones[0];
		}
		
		this.add.text(this.tombstones[0].x, this.tombstones[0].y, numbers[aux], { font: '42px Caveat Brush', fill: '#ffffff' });
		numbers.splice(aux, 1);							 // Elimina del array para no volver a escogerlo
		aux = Math.trunc(Math.random()*numbers.length);
		
		if (numbers[aux] == answer){
			this.correctTombstone = this.tombstones[1];
		}
		
		this.add.text(this.tombstones[1].x, this.tombstones[1].y, numbers[aux], { font: '42px Caveat Brush', fill: '#ffffff' });
		numbers.splice(aux, 1);
		aux = Math.trunc(Math.random()*numbers.length);
		
		if (numbers[aux] == answer){
			this.correctTombstone = this.tombstones[2];
		}
		
		this.add.text(this.tombstones[2].x, this.tombstones[2].y, numbers[aux], { font: '42px Caveat Brush', fill: '#ffffff' });
	}
	
	create(){
		aex = 0;
		aey = 0;
		angle = 0;
		ax = 0;
		ay = 0;
		
		if(playerj==2)
		{
			x = gameWidth*5.5/14;
		}
		else
		{
			x = gameWidth*8.5/14;
		}
		
		y= gameHeight/2
		
		// 1 Inicialización de variables
		// 1.1 Variables configurables
		this.roundDuration = 20;  	// En segundos
		this.answerVariation = 2;   // Variacion entre números de las tumbas respecto al correcto NO VALE NUMERO MENOR A DOS
		this.force = 0.0025;    	// Fuerza con la que se mueven los jugadores
		
		// 1.2 Variables no configurables
		this.roundEnd = false;  	// Almacena si se ha terminado el tiempo de la ronda
		
		// Qué habilidades tiene cada jugador 1-slow 2-force 3-reverse
		this.ability1 = player1Config[round];
		this.ability2 = player2Config[round];
		
		// Efecto de la habilidad del j1 y j2 sobre el movimiento (multiplicador -1 reverse, 1/2 slow)
		this.effect1 = 1;
		this.effect2 = 1;
		
		// Timer para medir el tiempo que duran las habilidades
		this.ability1Duration = 5;
		this.ability2Duration = 5;
		
		// Boolean que dice si la habilidad ha sido usada o no
		this.used1=false;
		this.used2=false;
		
		// 2 Creacion de sprites. Los instanciados más tarde se pintarán por encima.
		// 2.1 Estáticos
		this.add.image(gameWidth/2, gameHeight/2, 'bg_cemetery').setOrigin(0.5).setScale(0.26);
		this.initTombstones();
		this.initMatterPhysics();
		
		let habPos = [0, gameWidth/14, gameWidth*2.5/14, gameWidth*4/14, 0, gameWidth*10/14, gameWidth*11.5/14, gameWidth*13/14];
		let cardsHeight = gameHeight/9;
		
		this.crossH1P1 = this.add.image(habPos[1], cardsHeight, 'img_cross').setAlpha(0);
		this.crossH2p1 = this.add.image(habPos[2], cardsHeight, 'img_cross').setAlpha(0);
		this.crossh3P1 = this.add.image(habPos[3], cardsHeight, 'img_cross').setAlpha(0);
		this.crossH1P2 = this.add.image(habPos[5], cardsHeight, 'img_cross').setAlpha(0);
		this.crossH2P2 = this.add.image(habPos[6], cardsHeight, 'img_cross').setAlpha(0);
		this.crossH3P2 = this.add.image(habPos[7], cardsHeight, 'img_cross').setAlpha(0);
		
		let i;
		for (i=1; i<4; i++) {
			if(player1Config[i]==0){
				this.slowCardP1 = this.add.image(habPos[i], cardsHeight, 'cd_slow_ig').setScale(0.3);
			} else if (player1Config[i] == 1) {
				this.forceCardP1 = this.add.image(habPos[i], cardsHeight, 'cd_force_ig').setScale(0.3);
			} else if (player1Config[i] == 2) {
				this.reverseCardP1 = this.add.image(habPos[i], cardsHeight, 'cd_reverse_ig').setScale(0.3);
			}
			
			if(player2Config[i]==0){
				this.slowCardP2 = this.add.image(habPos[i+4], cardsHeight, 'cd_slow_ig').setScale(0.3);
			} else if (player2Config[i]==1){
				this.forceCardP2 = this.add.image(habPos[i+4], cardsHeight, 'cd_force_ig').setScale(0.3);
			} else if (player2Config[i]==2) {
				this.reverseCardP2 = this.add.image(habPos[i+4], cardsHeight, 'cd_reverse_ig').setScale(0.3);
			}
		}
		
		// 2.2 Animaciones
		if(player1Config[0]==0 || player2Config[0]==0){
			if (this.ghostbusterManim == null){
				this.ghostbusterManim = this.anims.create({
					key: 'ch_ghostbusterM',
					frames: this.anims.generateFrameNumbers('ch_ghostbusterM'),
					frameRate: 24,
					repeat: -1
				})
			}
			if(player1Config[0]==0){
				this.player1.play('ch_ghostbusterM');
			} else {
				this.player2.play('ch_ghostbusterM');
			}
			this.ghostbusterManim.pause();
		}
		
		if(player1Config[0]==1 || player2Config[0]==1){
			if (this.ghostbusterWanim == null){
				this.ghostbusterWanim = this.anims.create({
					key: 'ch_ghostbusterW',
					frames: this.anims.generateFrameNumbers('ch_ghostbusterW'),
					frameRate: 24,
					repeat: -1
				})
			}
			if(player1Config[0]==1){
				this.player1.play('ch_ghostbusterW');
			} else {
				this.player2.play('ch_ghostbusterW');
			}
			this.ghostbusterWanim.pause();
		}
		
		if(player1Config[0]==2 || player2Config[0]==2){
			if (this.blueGhostanim == null){
				this.blueGhostanim = this.anims.create({
					key: 'ch_blueGhost',
					frames: this.anims.generateFrameNumbers('ch_blueGhost', { start: 0, end: 23}),
					frameRate: 24,
					repeat: -1
				})
			}
			if(player1Config[0]==2){
				this.player1.play('ch_blueGhost');
			} else {
				this.player2.play('ch_blueGhost');
			}
			this.blueGhostanim.pause();
		}
		
		if(player1Config[0]==3 || player2Config[0]==3){
			if (this.redGhostanim == null){
				this.redGhostanim = this.anims.create({
					key: 'ch_redGhost',
					frames: this.anims.generateFrameNumbers('ch_redGhost', { start: 0, end: 23}),
					frameRate: 24,
					repeat: -1
				})
			}
			if(player1Config[0]==3){
				this.player1.play('ch_redGhost');
			} else {
				this.player2.play('ch_redGhost');
			}
			this.redGhostanim.pause();
		}
		
		// 3 Estructura que contiene booleanos que indican si las teclas están siendo
		// pulsadas
		this.moveKeys = {
		w:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
		a:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
		s:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
		d:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
		esp:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		};
		
		// 4 Temporizadores
		// Llama a una función al terminarse el tiempo de ronda
		this.timer = this.time.addEvent({ delay: 1000 * this.roundDuration, callback: this.endFunc, callbackScope: this});
		
		// 5 Interfaz: texto tiempo que queda y puntos
		this.tiempo = this.add.text(gameWidth*(48/100), gameHeight*(3/32), /* this.timer.getElapsed() */t/100, { font: '64px Caveat Brush', fill: '#ffffff' });
	}
	
	// Resetea el multiplicador y el rebote del j1
	restartEffect1(){
		this.effect2 = 1;
		this.player2.setBounce(0.9);
	}
	
	// Resetea el multiplicador y el rebote del j2
	restartEffect2(){
		this.effect1 = 1;
		this.player1.setBounce(0.9);
	}
	
	// Reduce a la mitad la velocidad de movimiento del jugador indicado por el parámetro (1 = j2, otro = j1)
	slow(j){
		if(j==1){
			this.effect2 = 1/2;
		} else {
			this.effect1 = 1/2;
		}
	}
	
	// Aumenta el rebote del jugador pasado como parámetro
	force(player){
		player.setBounce(2.0);
	}
	
	// Invierte los controles del jugador pasado como parámetro (1 = j2, otro = j1)
	reverse(j){
		if(j==1){
			this.effect2 = -1;
		} else{
			this.effect1 = -1;
		}
	}
	
	// Aumenta la velocidad de movimiento del jugador pasado como parámetro (1 = j2, otro = j1)
	frighten(j){
		if(j==1){
			this.effect2 = 5;
		} else{
			this.effect1 = 5;
		}
	}
	
	ability(habil,j,player){
		if(habil == 0){
			this.slow(j);
		} else if(habil == 1){
			this.force(player);
		} else if(habil == 2){
			this.reverse(j);
		} else if(habil == 3){
			this.frighten(j);
		} else if(habil == 4){
			this.reverse(j);
		}
		
		// Temporalizador para las habilidades
		if(j==1){
			this.timerhability1 = this.time.addEvent({ delay: 1000 * this.ability1Duration, callback: this.restartEffect1, callbackScope: this});
		} else{
			this.timerhability2 = this.time.addEvent({ delay: 1000 * this.ability2Duration, callback: this.restartEffect2, callbackScope: this});
		}
	}
	
	// Calcula la dirección a la que debe apuntar el sprite
	calculateRotation(player, vector2D){
		let angulo = 0;
		if (vector2D[0]>0 && vector2D[1]>0){
			angulo = 135;
		} else if(vector2D[0]<0 && vector2D[1]>0){
			angulo = -135;
		} else if(vector2D[0]>0 && vector2D[1]<0){
			angulo = 45;
		} else if(vector2D[0]<0 && vector2D[1]<0){
			angulo = -45;
		} else if(vector2D[0]>0 && vector2D[1]==0){
			angulo = 90;
		} else if(vector2D[0]<0 && vector2D[1]==0){
			angulo = -90;
		} else if(vector2D[0]==0 && vector2D[1]>0){
			angulo = 180;
		} else if(vector2D[0]==0 && vector2D[1]<0){
			angulo = 0;
		}
		player.setAngle(angulo);
	}
	
	// Da fuerza al jugador dependiendo de las teclas que pulsa y de los efectos de habilidades y llama a calculateRotation()
	calculateForces(player, keyUp, keyLeft, keyDown, keyRight, efect, dist) {
		let angle;
		// Calcula el vector de aceleración
		let acceleration = [efect*(this.force * keyRight.isDown - this.force * keyLeft.isDown), efect*(this.force * keyDown.isDown - this.force * keyUp.isDown)];
		this.calculateRotation(player, acceleration);   // Actualiza el ángulo del sprite
		// Creo que para una habilidad aún no terminada
		if(efect == 5){
			let modulo = Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]);
			acceleration = [this.force*dist[0]/modulo, force*dist[1]/modulo];
			aex = acceleration[0];
			aey = acceleration[1];
		}
		// Convierte el vector en un Vector2 de phaser
		let accelerationVec = new Phaser.Math.Vector2(acceleration[0], acceleration[1]);
		player.applyForce(accelerationVec); // Aplica la fuerza al personaje
	}
	
	// Esta función devuelve si el jugador pasado como parámetro está dentro de la base pasada como parámetro en booleano
	checkPosition(player, base){
		let ret = false;
		if (player.x < base.x + base.width/2*0.05 && player.x > base.x - base.width/2*0.05){ // Comprueba x
			ret = true;
		} if (player.y < base.y + base.height/2*0.05 && player.y > base.y - base.height/2*0.05){ // Comprueba y
			ret = ret && true;
		} else {
			ret = false;
		}
		return ret;
	}
	
	// Actualiza los puntos y avisa por pantalla del ganador de la ronda.
	actualizePoints(){
		if (this.checkPosition(this.player1, this.correctTombstone)){
			this.roundEndText1 = this.add.text(gameWidth*(2/60), gameHeight*(3/5), 'Un punto para el jugador 1', { font: '64px Caveat Brush', fill: '#ffffff' });
			points[0]++;
		} if (this.checkPosition(this.player2, this.correctTombstone)){
			this.roundEndText2 = this.add.text(gameWidth*(2/60), gameHeight*(4/5), 'Un punto para el jugador 2', { font: '64px Caveat Brush', fill: '#ffffff' });
			points[1]++;
		}
	}
	
	// Llama a actualizar los puntos, para a los jugadores, actualiza variables y pone un temporizador para cambiar de escena
	endFunc(){
		this.tiempo.setText(0); // Mostrar contador a 0
		// Muestra el mensaje de fin de ronda
		this.roundEndText0 = this.add.text(gameWidth*(1/6), gameHeight*(2/5), 'Se acabó el tiempo', { font: '64px Caveat Brush', fill: '#ffffff' });
		this.roundEnd = true;
		this.freeze();  // Congela a los jugadores
		this.actualizePoints(); // Actualiza los puntos y avisa de quien ha ganado
		this.time.addEvent({ delay: 4000, callback: this.changeScene, callbackScope: this});    // Pone un temporizador para la llamada a la función de cambio de escena
	}
	
	// Cambia de escena dependiendo de si es la útlima ronda o no y avisa del ganador en caso de que haya.
	changeScene(){
		let msge;
		if (round == 3){
			// Borra los mensajes anteriores de final de ronda
			if (this.roundEndText0 != undefined) this.roundEndText0.setAlpha(0);
			if (this.roundEndText1 != undefined) this.roundEndText1.setAlpha(0);
			if (this.roundEndText2 != undefined) this.roundEndText2.setAlpha(0);
			// Imprime si ha habido ganador/es
			if (points[0] > points[1]){
				msge = 'Ha ganado el jugador 1';
			} else if (points[1] > points[0]){
				msge = 'Ha ganado el jugador 2';
			} else {
				msge = 'Ha habido un empate';
			}
			this.add.text(gameWidth*(4/10), gameHeight/2, msge, { font: '60px Caveat Brush', fill: '#ffffff' });
			this.time.addEvent({delay:4000, callback: this.restart, callbackScope: this});  // Prepara la función de cambio de/ escena
		}
		// En caso de no ser la última ronda pone otra cinemática
		else {
			this.scene.start('cutsceneOnline');
		}
	}
	
	// Reinicia el juego poniendo a 0 el contador de ronda y llamando a la escena de menú principal
	restart(){
		round = 0;
		this.scene.start('menu');
	}
	
	// Para el movimiento de los jugadores
	freeze(){
		this.player1.setVelocity(0);
		this.player2.setVelocity(0);
		this.player1.setAngularVelocity(0);
		this.player2.setAngularVelocity(0);
	}
	
	update(){
		// Mientras no haya terminado la ronda
		if (!this.roundEnd)
		{
			this.tiempo.setText(t); // Actualiza el contador
			if(playerj==1)
			{
				if(this.used1==false && this.moveKeys.esp.isDown)
				{
					// Se llama a la fucnión habilidad con el identificador de habilidad, el
					// número de jugador y el jugador
					this.ability(this.ability1, 1, this.player1);
					this.used1=true;   // Actualiza la variable que almacena si la habilidad ha sido usada
				}
				if(h && !used)
				{
					used=true;
					this.ability(this.ability2, 2, this.player2);
				}
				this.dist = [this.player1.x - this.player2.x, this.player1.y - this.player2.y];
				this.calculateForces(this.player1, this.moveKeys.w, this.moveKeys.a, this.moveKeys.s, this.moveKeys.d, this.effect1, this.dist);
				
				// Convierte el vector en un Vector2 de phaser
				let accelerationVec = new Phaser.Math.Vector2(ax, ay);
				this.player2.applyForce(accelerationVec); // Aplica la fuerza al personaje
				this.player2.setAngle(angle);
				this.player2.x = x;
				this.player2.y = y;
			}
			else
			{
				if(h && !used)
				{
					used=true;   // Actualiza la variable que almacena si la habilidad ha sido usada
					// Se llama a la fucnión habilidad con el identificador de habilidad, el número de jugador y el jugador
					this.ability(this.ability1, 1, this.player1);
				}
				if(this.used2==false && this.moveKeys.esp.isDown)
				{
					this.ability(this.ability2, 2, this.player2);
					this.used2=true;
				}
				// Convierte el vector en un Vector2 de phaser
				let accelerationVec = new Phaser.Math.Vector2(ax, ay);
				this.player1.applyForce(accelerationVec); // Aplica la fuerza al personaje
				this.player1.setAngle(angle);
				this.player1.x = x;
				this.player1.y = y;
				this.dist = [-(this.player1.x - this.player2.x),-(this.player1.y - this.player2.y)];
				this.calculateForces(this.player2, this.moveKeys.w, this.moveKeys.a, this.moveKeys.s, this.moveKeys.d, this.effect2, this.dist);
			}
			
			// Enviamos websocket
			if(playerj==1)
			{
				msg = {
					code : "2",
					x: this.player1.x,
					y: this.player1.y,
					ax: aex,
					ay: aey,
					rotation: this.player1.angle,
					hability: this.used1,
					sess: session
				}
			}
			else
			{
				msg = {
					code: "2",
					x: this.player2.x,
					y: this.player2.y,
					ax: aex,
					ay: aey,
					rotation: this.player2.angle,
					hability: this.used2,
					sess: session
				}
			}
			connection.send(JSON.stringify(msg));
		}
		
		// Control de animación
		if(player1Config[0]==0){
			// Si hay movimiento seguir con la animación
			if (!this.ghostbusterManim.isPlaying && (this.player1.body.velocity.x != 0 || this.player1.body.velocity.y != 0)) {
				this.ghostbusterManim.resume();
			}
			// Si el movimiento es muy bajo parar la animación
			if ((this.player1.body.velocity.x < 0.6 && this.player1.body.velocity.x > -0.6) && (this.player1.body.velocity.y < 0.6 && this.player1.body.velocity.y > -0.6)) {
				this.ghostbusterManim.pause();
			}
		} else if (player1Config[0]==1) {
			if (!this.ghostbusterWanim.isPlaying && (this.player1.body.velocity.x != 0 || this.player1.body.velocity.y != 0)) {
				this.ghostbusterWanim.resume();
			}
			if ((this.player1.body.velocity.x < 0.6 && this.player1.body.velocity.x > -0.6) && (this.player1.body.velocity.y < 0.6 && this.player1.body.velocity.y > -0.6)) {
				this.ghostbusterWanim.pause();
			}
		} else if (player1Config[0]==2) {
		if (!this.blueGhostanim.isPlaying && (this.player1.body.velocity.x != 0 || this.player1.body.velocity.y != 0)) {
			this.blueGhostanim.resume();
		}
		if ((this.player1.body.velocity.x < 0.6 && this.player1.body.velocity.x > -0.6) && (this.player1.body.velocity.y < 0.6 && this.player1.body.velocity.y > -0.6)) {
			this.blueGhostanim.pause();
		}
		} else if (player1Config[0]==3) {
			if (!this.redGhostanim.isPlaying && (this.player1.body.velocity.x != 0 || this.player1.body.velocity.y != 0)) {
				this.redGhostanim.resume();
			}
			if ((this.player1.body.velocity.x < 0.6 && this.player1.body.velocity.x > -0.6) && (this.player1.body.velocity.y < 0.6 && this.player1.body.velocity.y > -0.6)) {
				this.redGhostanim.pause();
			}
		}
		
		if(player2Config[0]==0){
			// Si hay movimiento seguir con la animación
			if (!this.ghostbusterManim.isPlaying && (this.player2.body.velocity.x != 0 || this.player2.body.velocity.y != 0)) {
				this.ghostbusterManim.resume();
			}
			// Si el movimiento es muy bajo parar la animación
			if ((this.player2.body.velocity.x < 0.6 && this.player2.body.velocity.x > -0.6) && (this.player2.body.velocity.y < 0.6 && this.player2.body.velocity.y > -0.6)) {
				this.ghostbusterManim.pause();
			}
		} else if (player2Config[0]==1) {
			if (!this.ghostbusterWanim.isPlaying && (this.player2.body.velocity.x != 0 || this.player2.body.velocity.y != 0)) {
				this.ghostbusterWanim.resume();
			}
			if ((this.player2.body.velocity.x < 0.6 && this.player2.body.velocity.x > -0.6) && (this.player2.body.velocity.y < 0.6 && this.player2.body.velocity.y > -0.6)) {
				this.ghostbusterWanim.pause();
			}
		} else if (player2Config[0]==2) {
			if (!this.blueGhostanim.isPlaying && (this.player2.body.velocity.x != 0 || this.player2.body.velocity.y != 0)) {
				this.blueGhostanim.resume();
			}
			if ((this.player2.body.velocity.x < 0.6 && this.player2.body.velocity.x > -0.6) && (this.player2.body.velocity.y < 0.6 && this.player2.body.velocity.y > -0.6)) {
				this.blueGhostanim.pause();
			}
		} else if (player2Config[0]==3) {
			if (!this.redGhostanim.isPlaying && (this.player2.body.velocity.x != 0 || this.player2.body.velocity.y != 0)) {
				this.redGhostanim.resume();
			}
			if ((this.player2.body.velocity.x < 0.6 && this.player2.body.velocity.x > -0.6) && (this.player2.body.velocity.y < 0.6 && this.player2.body.velocity.y > -0.6)) {
				this.redGhostanim.pause();
			}
		}
	}
}
