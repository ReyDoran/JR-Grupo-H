class Video extends Phaser.Scene {
    constructor()
    {
        super({key:"Video"});
    }

    preload() {
      //Actores
      this.load.spritesheet('ghost1', 'assets/personajes/fantasmaAzulLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
      this.load.spritesheet('ghost2', 'assets/personajes/fantasmaRojoLateral.png', { frameWidth: 4000/5, frameHeight: 4000/5});
      this.load.spritesheet('ghostbuster1Lateral', 'assets/personajes/cazafantasmas.png',{ frameWidth: 3460/4, frameHeight: 5910/8});
    	//Pasillo
      this.load.image('interior', 'assets/background/bg_interior.png');
      this.load.image('frame', 'assets/background/bg_frame.png');
    }

    create() {
    	//Añadimos background
      round++;
      let background = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'interior').setOrigin(0.5);
      background.scaleX = 1.07;
      background.scaleY = 1.07;
      let frame = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'frame').setOrigin(0.5);
      frame.scaleX = 1.07;
      frame.scaleY = 1.07;
      frame.setDepth(1);
      //Array de los sprites
      this.actors = [];

      //QUÉ HACE
      let msg = 'Ronda ' + (round);
      this.roundText = this.add.text(200, 200, msg, { font: '64px Courier', fill: '#ffffff' })
      this.time.addEvent({ delay: 4000, callback: function () {this.roundText.setAlpha(0);}, callbackScope: this});

      //Creamos animaciones
      this.anims.create({
          key: 'ghost1',
          frames: this.anims.generateFrameNumbers('ghost1', { start: 0, end: 23
          }),
          frameRate: 24,
          repeat: -1
      })
      this.anims.create({
          key: 'ghost2',
          frames: this.anims.generateFrameNumbers('ghost2', { start: 0, end: 23
          }),
          frameRate: 24,
          repeat: -1
      })
      this.anims.create({
          key: 'ghostbuster',
          frames: this.anims.generateFrameNumbers('ghostbuster1Lateral', { start: 0, end: 30
          }),
          frameRate: 24,
          repeat: -1
      })

      //VARIABLES CONFIGURABLES
      this.velocities = [4, 6, 8];
      this.ghostbusterVelocities = [3, 4, 5];
    	this.dif = 5;	               //la dificultad: minimo de fantasmas que saldran
      this.maximumActors = 10      //máximo de actores posibles que saldrán ademas de la base
      this.start_pos = [-40, 1320];
      this.names = ['ghost1', 'ghost2', 'ghostbuster1Lateral'];   //Guarda los nombres de los identificadores de imagenes (cambiara para sprites)
      //Duracion del desfile, delay de pregunta y delay de cambio de escena
    	this.paradeDuration = 15000;
      this.questionDelay = 2000;
      this.questionTime = 4000;

      //PREGUNTAS
      /*
      Las preguntas coinciden con el índice de answers que lleva su cuenta (actualizado en schedulePlaner())
      */
      this.questions = ["¿Cuántos fantasmas azules pasaron?", "¿Cuántos fantasmas rojos pasaron?", "¿Cuántos cazafantasmas pasaron?", "¿Cuántos personajes pasaron en total?"];
      this.questionIndex = Math.trunc(Math.random() * 4);
      this.answers = [0, 0, 0, 0];

      //Funcion que se encarga de crear los actores
      this.schedulePlanner();

      //Timers para enseñar la pregunta y cambiar de escena.
      this.time.addEvent({ delay: this.paradeDuration + this.questionDelay, callback: this.showQuestion, callbackScope: this});
    	this.time.addEvent({ delay: this.paradeDuration + this.questionDelay + this.questionTime, callback: this.changeScene, callbackScope: this});

        //Debug

    }

    //Enseña la pregunta
    showQuestion() {
        this.add.text(this.game.canvas.width/5, this.game.canvas.height/2, this.questions[this.questionIndex], { font: '40px Courier', fill: '#ffffff' });
        console.log(this.answers[this.questionIndex]);
    }

    //Cambia la escena y acutaliza el valor de la variable global count con la respuesta
    changeScene() {
        count = this.answers[this.questionIndex];
        console.log(this.answers[this.questionIndex] + ' = ' + count);
        this.scene.start("Juego");
    }

    //Función para crear actores
    schedulePlanner() {
        //Llama a randomCharGen x veces, dependiendo de base y extra.
        for (var i = 0; i < Math.floor(Math.random() * this.maximumActors) + this.dif; i++)
        {
            this.time.addEvent({ delay: Math.random() * this.paradeDuration, callback: this.randomCharGen, callbackScope: this, loop: false});
        }
    }


    //Esta funcion genera 1 actor que pasa por la pantalla, con posicion inicial, sprite y velocidad aleatorios.
    randomCharGen() {
    	let s_pos = Math.floor(Math.random()*2);
    	let velocity = this.velocities[Math.floor(Math.random()*3)]
      let imageIndex = Math.floor(Math.random()*3);
      let flipX = false;
      this.answers[imageIndex]++;
      this.answers[3]++;
    	if (s_pos == 1)
    	{
    		 velocity *= -1;
    	   flipX = true;
      }
      if (imageIndex == 2) {
        velocity = this.ghostbusterVelocities[Math.floor(Math.random()*3)];
      }
      let actor = this.matter.add.sprite(this.start_pos[s_pos], 400, this.names[imageIndex]).setOrigin(0.5).setVelocityX(velocity).setCollisionGroup(-1).setFrictionAir(0).setFlip(flipX);
      if (imageIndex == 0)
      {
        actor.play('ghost1');
        this.actors.push(actor);
      }
      else if (imageIndex == 1)
      {
        actor.play('ghost2');
        this.actors.push(actor);
      }
      else if (imageIndex == 2)
      {
        actor.play('ghostbuster');
        this.actors.push(actor);
      }

    }

    update()
    {

    }
}
