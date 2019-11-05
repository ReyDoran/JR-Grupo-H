'use strict'

class Cinematica extends Phaser.Scene {
    constructor()
    {
        super({key:"Cinematica"});
    }

    preload() {
    	//Murcielagos
    	this.load.image('booger0', 'assets/cinematica/Bat_Booger_Fly/Bat_Booger_1.png');
    	this.load.image('booger1', 'assets/cinematica/Bat_Booger_Fly/Bat_Booger_4.png');
    	this.load.image('brains0', 'assets/cinematica/Bat_Brains_Fly/Bat_Brains_1.png');
    	this.load.image('brains1', 'assets/cinematica/Bat_Brains_Fly/Bat_Brains_4.png');
    	this.load.image('purple0', 'assets/cinematica/Bat_Purple_Fly/Bat_Purple_1.png');
    	this.load.image('purple1', 'assets/cinematica/Bat_Purple_Fly/Bat_Purple_4.png');
    	//Escenario
    	this.load.image('background0', 'assets/cinematica/creepy_house.jpg');
        this.load.image('interior', 'assets/escenario/bg_interior.png');
        this.load.image('frame', 'assets/escenario/bg_frame.png');
    }

    create() {
    	//Añadimos background
    	//this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'background0').setScale(2);
        let background = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'interior').setOrigin(0.5);
        background.scaleX = 1.07;
        background.scaleY = 1.07;
        let frame = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'frame').setOrigin(0.5);
        frame.scaleX = 1.07;
        frame.scaleY = 1.07;
        frame.setDepth(1);

        //VARIABLES CONFIGURABLES
        this.velocities = [5, 7, 10];
    	this.dif = 7;	//la dificultad: minimo de fantasmas que saldran
        this.maximumActors = 10 //máximo de actores posibles que saldrán ademas de la base
        this.start_pos = [-40, 1320];
        this.names = ['booger0', 'brains0', 'purple0'];   //Guarda los nombres de los identificadores de imagenes (cambiara para sprites)
        //Duracion del desfile, delay de pregunta y delay de cambio de escena
    	this.paradeDuration = 15000;
        this.questionDelay = 2000;
        this.questionTime = 4000;

        //PREGUNTAS
        /*
        Las preguntas coinciden con el índice de answers que lleva su cuenta (actualizado en schedulePlaner())
        */
        this.questions = ["Cuantos verdes han pasado?", "Cuantos cerebroides han pasado?", "Cuantos lilas han pasado?", "Cuantos pasaron en total?"];
        this.questionIndex = Math.trunc(Math.random() * 4);
        this.answers = [0, 0, 0, 0];

        //Funcion que se encarga de crear los actores
        this.schedulePlanner();

        //Timers para enseñar la pregunta y cambiar de escena.
        this.time.addEvent({ delay: this.paradeDuration + this.questionDelay, callback: this.showQuestion, callbackScope: this});
    	this.time.addEvent({ delay: this.paradeDuration + this.questionDelay + this.questionTime, callback: this.changeScene, callbackScope: this});

    }

    //enseña la pregunta
    showQuestion() {
        this.add.text(this.game.canvas.width/2, this.game.canvas.height/2, this.questions[this.questionIndex], { font: '32px Courier', fill: '#ffffff' });
        this.add.text(this.game.canvas.width/3, this.game.canvas.height/2, this.answers[this.questionIndex], { font: '32px Courier', fill: '#ffffff' });
    }

    //cambia la escena y acutaliza el valor de la variable global count con la respuesta
    changeScene() {
        count = this.answers[this.questionIndex];
        console.log(this.answers[this.questionIndex] + ' = ' + count);
        this.scene.start("Juego");
    }

    /*
    Esta seria la funcion pero hay un problema con el this casi fijo, que no es el mismo en el ambito de create que aqui?
    */
    schedulePlanner() {
        //Llama a randomCharGen x veces, dependiendo de base y extra.
        for (var i = 0; i < Math.floor(Math.random() * this.maximumActors) + this.dif; i++)
        {
            this.time.addEvent({ delay: Math.random() * this.paradeDuration, callback: this.randomCharGen, callbackScope: this, loop: false});
        }
    }

    /*
    Esta funcion genera 1 actor que pasa por la pantalla, con posicion inicial, sprite y velocidad
    aleatorios.
    */
    randomCharGen() {
    	let s_pos = Math.floor(Math.random()*2);
    	let velocity = this.velocities[Math.floor(Math.random()*3)]
        let imageIndex = Math.floor(Math.random()*3);
        this.answers[imageIndex]++;
        this.answers[3]++;
    	if (s_pos == 1)
    	{
    		velocity *= -1;
    	}
    	this.matter.add.image(this.start_pos[s_pos], 300, this.names[imageIndex]).setScale(0.5).setVelocityX(velocity).setCollisionGroup(-1).setFrictionAir(0);
    }

    update()
    {

    }
}
