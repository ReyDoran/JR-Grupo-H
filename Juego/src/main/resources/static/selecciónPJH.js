'use strict'

class SeleccionPJH extends Phaser.Scene {
	constructor() {
		super({key:"seleccionpjh"});
	}

	preload() {}

	create() {
		//Mensaje de espera
		this.waiting = this.add.text(gameWidth*(14/50), gameHeight*(1/2),"",{ font: '40px Courier', fill: '#ffffff' });

		//Variables auxiliares del menú de habilidades
		this.abilities = [false, false, false]; //Guarda si una carta está seleccionada (indice coincide con posición en pantalla)
		/*
		Este array guarda las habilidades seleccionadas en orden de ronda.
		El índice de abilitiesIndex representa la ronda en la que se va a usar (ya que se copia directo a las posiciones 1, 2 y 3 de playerXConfig)
		El valor que contiene representa el índice por el que se le representa a esa habilidad en battle.js (0 slow, 1 force, 2 reverse)
		*/
		this.abilitiesIndex = [0, 0, 0];
		this.abilitiesSelected = 0; //Almacena el número de abilidades seleccionadas (3 el máximo)
		this.abilitiesMenu = false; //Permite que se pueda pintar el botón de listo en 2 tonos de alpha (para cuando es posible clicarlo o no)
		this.iter = 0;  //Almacena en que iteración de la configuración de partida estamos para asignar la configuracion a player1Config o player2Config
		
		//SELECCIÓN DE EQUIPO
		this.teamSelect = this.add.image(gameWidth*(2/4),gameHeight*(14/60),'img_teamSelect');
		this.player1Selecting = this.add.image(gameWidth*(2/4),gameHeight*(20/60),'img_player1');
		this.player2Selecting = this.add.image(gameWidth*(2/4),gameHeight*(20/60),'img_player2');
		this.player2Selecting.setAlpha(0);
		
		this.ghostbusterM = this.add.image(gameWidth*(6/24),gameHeight*(3/5),'bt_ghostbusterM').setInteractive();
		this.ghostbusterM.setScale(0.7);
		this.ghostbusterW = this.add.image(gameWidth*(10/24),gameHeight*(3/5),'bt_ghostbusterW').setInteractive();
		this.ghostbusterW.setScale(0.7);
		this.blueGhost = this.add.image(gameWidth*(14/24),gameHeight*(3/5),'bt_blueGhost').setInteractive();
		this.redGhost = this.add.image(gameWidth*(18/24),gameHeight*(3/5),'bt_redGhost').setInteractive();
		
		/*
		Al pulsarse cada uno de los dos botones, dependiendo de la iteración de la configuración de partida se actualiza:
		El primer parámetro de playerXConfig a 0 o 1 dependiendo de la elección.
		*/
		if(conectado)
		{
			if(playerj == 1)
			{
				this.ghostbusterM.on('pointerdown', function (pointer){
					player1Config[0] = 0;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.ghostbusterM.on('pointerover', function (pointer) { this.ghostbusterM.setScale(0.9); }, this);
				this.ghostbusterM.on('pointerout', function (pointer) { this.ghostbusterM.setScale(0.7); }, this);
				
				this.ghostbusterW.on('pointerdown', function (pointer){
					player1Config[0] = 1;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.ghostbusterW.on('pointerover', function (pointer) { this.ghostbusterW.setScale(0.9); }, this);
				this.ghostbusterW.on('pointerout', function (pointer) { this.ghostbusterW.setScale(0.7); }, this);
				
				this.blueGhost.on('pointerdown', function (pointer){
					player1Config[0] = 2;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.blueGhost.on('pointerover', function (pointer)  { this.blueGhost.setScale(1.1); }, this);
				this.blueGhost.on('pointerout', function (pointer) { this.blueGhost.setScale(0.9); }, this);
				
				this.redGhost.on('pointerdown', function (pointer){
					player1Config[0] = 3;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.redGhost.on('pointerover', function (pointer) { this.redGhost.setScale(1.1); }, this);
				this.redGhost.on('pointerout', function (pointer) { this.redGhost.setScale(0.9); }, this);
			}
			else
			{
				this.ghostbusterM.on('pointerdown', function (pointer){
					player2Config[0] = 0;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.ghostbusterM.on('pointerover', function (pointer) { this.ghostbusterM.setScale(0.9); }, this);
				this.ghostbusterM.on('pointerout', function (pointer) { this.ghostbusterM.setScale(0.7); }, this);
				
				this.ghostbusterW.on('pointerdown', function (pointer){
					player2Config[0] = 1;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.ghostbusterW.on('pointerover', function (pointer) { this.ghostbusterW.setScale(0.9); }, this);
				this.ghostbusterW.on('pointerout', function (pointer) { this.ghostbusterW.setScale(0.7); }, this);
				
				this.blueGhost.on('pointerdown', function (pointer){
					player2Config[0] = 2;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.blueGhost.on('pointerover', function (pointer)  { this.blueGhost.setScale(1.1); }, this);
				this.blueGhost.on('pointerout', function (pointer) { this.blueGhost.setScale(0.9); }, this);
				
				this.redGhost.on('pointerdown', function (pointer){
					player2Config[0] = 3;
					this.disableCharSelectMenu();
					this.showAbilitiesSelectMenu();
				}, this);
				this.redGhost.on('pointerover', function (pointer) { this.redGhost.setScale(1.1); }, this);
				this.redGhost.on('pointerout', function (pointer) { this.redGhost.setScale(0.9); }, this);
			}
		}
		else
		{
			this.ghostbusterM.on('pointerdown', function (pointer){
				if (this.iter == 0) player1Config[0] = 0;
				if (this.iter == 1) player2Config[0] = 0;
				this.disableCharSelectMenu();
				this.showAbilitiesSelectMenu();
			}, this);
			this.ghostbusterM.on('pointerover', function (pointer) { this.ghostbusterM.setScale(0.9); }, this);
			this.ghostbusterM.on('pointerout', function (pointer) { this.ghostbusterM.setScale(0.7); }, this);
			
			this.ghostbusterW.on('pointerdown', function (pointer){
				if (this.iter == 0) player1Config[0] = 1;
				if (this.iter == 1) player2Config[0] = 1;
				this.disableCharSelectMenu();
				this.showAbilitiesSelectMenu();
			}, this);
			this.ghostbusterW.on('pointerover', function (pointer) { this.ghostbusterW.setScale(0.9); }, this);
			this.ghostbusterW.on('pointerout', function (pointer) { this.ghostbusterW.setScale(0.7); }, this);
			
			this.blueGhost.on('pointerdown', function (pointer){
				if (this.iter == 0) player1Config[0] = 2;
				if (this.iter == 1) player2Config[0] = 2;
				this.disableCharSelectMenu();
				this.showAbilitiesSelectMenu();
			}, this);
			this.blueGhost.on('pointerover', function (pointer)  { this.blueGhost.setScale(1.1); }, this);
			this.blueGhost.on('pointerout', function (pointer) { this.blueGhost.setScale(0.9); }, this);
			
			this.redGhost.on('pointerdown', function (pointer){
				if (this.iter == 0) player1Config[0] = 3;		    
				if (this.iter == 1) player2Config[0] = 3;
				this.disableCharSelectMenu();
				this.showAbilitiesSelectMenu();
			}, this);
			this.redGhost.on('pointerover', function (pointer) { this.redGhost.setScale(1.1); }, this);
			this.redGhost.on('pointerout', function (pointer) { this.redGhost.setScale(0.9); }, this);
		}
		
		//Son return to ___
		this.returnChar = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setAlpha(0).setScale(0.7);
		this.returnAbi = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setAlpha(0).setScale(0.7);
		this.returnMenu = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setScale(0.7).setInteractive();
		
		this.returnChar.on('pointerdown', function (pointer){
			this.disableAbilitiesSelectMenu();
			this.showCharSelectMenu();
		}, this);
		
		this.returnAbi.on('pointerdown', function (pointer){
			this.iter--;
			this.disableCharSelectMenu();
			this.showAbilitiesSelectMenu();
		}, this);
		
		this.returnMenu.on('pointerdown', function (pointer){
			msg = {
					code: "5"
			}
			connection.send(JSON.stringify(msg));
			this.scene.start('menu');
			console.log("pal menu");
		}, this);
		
		//SELECCION DE HABILIDADES
		/*
		Este menú tiene una característica especial. Tiene un texto encima de cada carta con un número.
		El número representa la ronda en la que será usada.
		Este texto se habilita, deshabilita y actualiza según sea necesario.
		*/
		this.offset = 10;
		
		this.abilitySelect = this.add.image(gameWidth*(2/4),gameHeight*(16/60),'img_abilitiesSelect');
		
		this.ability0 = this.add.image(gameWidth/4, gameHeight*(35/60), 'cd_slow').setScale(0.7).setOrigin(0.5);
		this.ability0.text = this.add.text(gameWidth/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
		this.ability1 = this.add.image(gameWidth*2/4, gameHeight*(35/60), 'cd_force').setScale(0.7).setOrigin(0.5);
		this.ability1.text = this.add.text(gameWidth*2/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
		this.ability2 = this.add.image(gameWidth*3/4, gameHeight*(35/60), 'cd_reverse').setScale(0.7).setOrigin(0.5);
		this.ability2.text = this.add.text(gameWidth*3/4-this.offset, gameHeight*(35/60), this.abilitiesSelected + 1, { font: '32px Courier', fill: '#ffffff' });
		
		this.ready = this.add.image(gameWidth/2, gameHeight*(17/20), 'bt_ready');
		this.ready.setAlpha(0);
		
		this.abilitySelect.setAlpha(0);
		this.ability0.setAlpha(0);
		this.ability0.text.setAlpha(0);
		this.ability1.setAlpha(0);
		this.ability1.text.setAlpha(0);
		this.ability2.setAlpha(0);
		this.ability2.text.setAlpha(0);
		
		//Para cada carta se ejecuta el siguiente código al pulsarla
		this.ability0.on('pointerdown', function (pointer){
			//Si está activa en abilities[x]
			if (this.abilities[0] == true) {
				/*
				Se desactivan todas las cartas seleccionadas.
				Se pone a 0 el contador de habilidades seleccionadas.
				Se oculta el texto de número de habilidad.
				*/
				this.abilitiesSelected = 0;
				this.abilities[1] = false;
				this.abilities[2] = false;
				this.ability0.text.setAlpha(0);
				this.ability1.text.setAlpha(0);
				this.ability2.text.setAlpha(0);
			}
			//Si no está activa en abilities[x]
			else {
				/*
				Se guarda en abilitiesIndex, en la posición correspondiente a la ronda que se está eligiendo ahora el índice de habilidad
				por el que se le reconoce en la escena battle.
				Se aumenta el número de habilidades seleccionadas.
				Se actualiza el número de la carta y se muestra.
				*/
				this.abilitiesIndex[this.abilitiesSelected] = 0;
				this.abilitiesSelected++;
				this.ability0.text.setText(this.abilitiesSelected);
				this.ability0.text.setAlpha(1);
			}
			//Cambiamos el estado de la selección de la carta
			this.abilities[0] = !this.abilities[0];
		}, this);
		
		this.ability1.on('pointerdown', function (pointer)  {
			if (this.abilities[1] == true) {
				this.abilitiesSelected = 0;
				this.abilities[0] = false;
				this.abilities[2] = false;
				this.ability0.text.setAlpha(0);
				this.ability1.text.setAlpha(0);
				this.ability2.text.setAlpha(0);
			}
			else {
				this.abilitiesIndex[this.abilitiesSelected] = 1;
				this.abilitiesSelected++;
				this.ability1.text.setText(this.abilitiesSelected);
				this.ability1.text.setAlpha(1);
			}
			this.abilities[1] = !this.abilities[1];
		}, this);
		
		this.ability2.on('pointerdown', function (pointer)  {
			if (this.abilities[2] == true) {
				this.abilitiesSelected = 0;
				this.abilities[0] = false;
				this.abilities[1] = false;
				this.ability0.text.setAlpha(0);
				this.ability1.text.setAlpha(0);
				this.ability2.text.setAlpha(0);
			}
			else {
				this.abilitiesIndex[this.abilitiesSelected] = 2;
				this.abilitiesSelected++;
				this.ability2.text.setText(this.abilitiesSelected);
				this.ability2.text.setAlpha(1);
			}
			this.abilities[2] = !this.abilities[2];
		}, this);
		
		//Botón de continuar a la siguiente selección o de empezar juego
		this.ready.on('pointerdown', function (pointer)
		{
			//Sólo funciona si se han seleccionado 3 habilidades
			if (this.abilitiesSelected == 3){
				//Impide que este botón se pinte
				this.abilitiesMenu = false;
				//Actualizar las abilidades del jugador dependiendo de la iteración del menú
				if (this.iter == 0) 
				{
					if(conectado)
					{
						this.waiting.setText("Esperando al contrincante");
						if(playerj == 1)
						{
							player1Config[1] = this.abilitiesIndex[0];
							player1Config[2] = this.abilitiesIndex[1];
							player1Config[3] = this.abilitiesIndex[2];
							msg = {
								code: "1",
								p: player1Config[0],
								h1: player1Config[1],
								h2: player1Config[2],
								h3: player1Config[3],
								match: matchIndex
							}
							connection.send(JSON.stringify(msg));
						}
						else
						{
							player2Config[1] = this.abilitiesIndex[0];
							player2Config[2] = this.abilitiesIndex[1];
							player2Config[3] = this.abilitiesIndex[2];
							 
							if (conectado){
								msg = {
									code: "1",
									p: player2Config[0],
									h1: player2Config[1],
									h2: player2Config[2],
									h3: player2Config[3],
									match: matchIndex
								}
								connection.send(JSON.stringify(msg));
							}		
						}
					}
					else
					{
						player1Config[1] = this.abilitiesIndex[0];
						player1Config[2] = this.abilitiesIndex[1];
						player1Config[3] = this.abilitiesIndex[2];
					}       
				}
				
				//Si es la segunda iteración, comienza la partida. Si no vuelve al menú de selección de equipo (actualizando iter)
				if (this.iter == 1) {
					player2Config[1] = this.abilitiesIndex[0];
					player2Config[2] = this.abilitiesIndex[1];
					player2Config[3] = this.abilitiesIndex[2];
					
					this.scene.start('cutscene');
				} else {
					if(!conectado)
					{
						this.iter++;
						this.showCharSelectMenu();
					}
				}
				//Imprime por pantalla la configuración de cada jugador DEBUG
				//console.log('P1 ' + player1Config);
				//console.log('P2 ' + player2Config);
				this.disableAbilitiesSelectMenu();
			}
		}, this);
		
		//Interfaz por encima de casi todo
		this.bg_estatica = this.add.sprite(gameWidth*11/20,gameHeight/2,'bg_estatica').setAlpha(0.1);
		this.anims.create({
			key: 'bg_estatica_anim',
			frames: this.anims.generateFrameNumbers('bg_estatica'),
			frameRate: 20,
			repeat: -1
		});
		this.bg_estatica.play('bg_estatica_anim');
		
		this.TVBorder = this.add.image(gameWidth/2, gameHeight/2, 'bg_frame');
	}

	showCharSelectMenu() {
		console.log("Estoy en equipos");
		console.log(this.iter);
		this.teamSelect.setAlpha(1);
		this.ghostbusterM.setAlpha(1);
		this.ghostbusterM.setInteractive();
		this.ghostbusterW.setAlpha(1);
		this.ghostbusterW.setInteractive();
		this.blueGhost.setAlpha(1);
		this.blueGhost.setInteractive();
		this.redGhost.setAlpha(1);
		this.redGhost.setInteractive();
		
		if (this.iter == 0){
			this.player1Selecting.setAlpha(1);
			this.returnMenu.setAlpha(1);
			this.returnMenu.setInteractive();
		} else {
			this.player2Selecting.setAlpha(1);
			this.returnAbi.setAlpha(1);
			this.returnAbi.setInteractive();
		}
	}
	
	disableCharSelectMenu() {
		console.log("Salgo de equipos");
		console.log(this.iter);
		this.teamSelect.setAlpha(0);
		this.ghostbusterM.setAlpha(0);
		this.ghostbusterM.disableInteractive();
		this.ghostbusterW.setAlpha(0);
		this.ghostbusterW.disableInteractive();
		this.blueGhost.setAlpha(0);
		this.blueGhost.disableInteractive();
		this.redGhost.setAlpha(0);
		this.redGhost.disableInteractive();
		this.returnMenu.setAlpha(0);
		this.returnMenu.disableInteractive();
		this.returnAbi.setAlpha(0);
		this.returnAbi.disableInteractive();
		this.player1Selecting.setAlpha(0);
		this.player2Selecting.setAlpha(0);
	}

	showAbilitiesSelectMenu() {
		console.log("Entro en habilidades");
		console.log(this.iter);
		//Reinicia las variables auxiliares
		this.abilitiesSelected = 0;
		this.abilities = [false, false, false];
		this.abilitiesMenu = true;
		//Habilita el menú
		this.abilitySelect.setAlpha(1);
		this.ability0.setAlpha(1);
		this.ability0.setInteractive();
		this.ability1.setAlpha(1);
		this.ability1.setInteractive();
		this.ability2.setAlpha(1);
		this.ability2.setInteractive();
		this.ready.setAlpha(0.4);
		this.ready.setInteractive();
		this.returnChar.setAlpha(1);
		this.returnChar.setInteractive();
	}

	disableAbilitiesSelectMenu() {
		console.log("Salgo de habilidades");
		console.log(this.iter);
		this.abilitiesMenu = false;
		this.abilitySelect.setAlpha(0);
		this.ability0.setAlpha(0);
		this.ability0.text.setAlpha(0);
		this.ability1.setAlpha(0);
		this.ability1.text.setAlpha(0);
		this.ability2.setAlpha(0);
		this.ability2.text.setAlpha(0);
		this.ability0.disableInteractive();
		this.ability1.disableInteractive();
		this.ability2.disableInteractive();
		this.ready.setAlpha(0);
		this.ready.disableInteractive();
		this.returnChar.setAlpha(0);
		this.returnChar.disableInteractive();
	}
	
	cambiarescena(){
		this.scene.start('CutsceneOnline');
	}
	
	update() {
		if (escapar == true)
		{
			round = 0;
			sincro = 0;
			points[0] = 0;
			points[1] = 0;
			roundFinished = false;
			escapar = false;
			this.scene.start("login");
		}
		//Cuando está seleccionada, una carta se tiñe de rojo
		if (this.abilities[0] == true) this.ability0.setTint(0xCD0000);
		else this.ability0.clearTint();
		if (this.abilities[1] == true) this.ability1.setTint(0xCD0000);
		else this.ability1.clearTint();
		if (this.abilities[2] == true) this.ability2.setTint(0xCD0000);
		else this.ability2.clearTint();
		
		//Pone el alpha a 1 cuando se han seleccionado 3 cartas y a 0.4 cuando no, siempre que sea el momento de pintarlo (abilitiesMenu == true)
		if (this.abilitiesMenu == true && this.abilitiesSelected == 3) this.ready.setAlpha(1);
		else if (this.abilitiesMenu == true && this.abilitiesSelected != 3) this.ready.setAlpha(0.4);
		else this.ready.setAlpha(0);
		
		if (sincro == 2)
		{
			this.cambiarescena();
		}
	}
}
