//Menu principal
class Video extends Phaser.Scene {
    constructor()
    {
        super({key:"cinematica"});
    }

    function preload() {
    	//Murcielagos
    	this.load.image('booger0', 'Imagenes/cinematica/Bat_Booger_Fly/Bat_Booger_1.png');
    	this.load.image('booger1', 'Imagenes/cinematica/Bat_Booger_Fly/Bat_Booger_4.png');
    	this.load.image('brains0', 'Imagenes/cinematica/Bat_Brains_Fly/Bat_Brains_1.png');
    	this.load.image('brains1', 'Imagenes/cinematica/Bat_Brains_Fly/Bat_Brains_4.png');
    	this.load.image('purple0', 'Imagenes/cinematica/Bat_Purple_Fly/Bat_Purple_1.png');
    	this.load.image('purple1', 'Imagenes/cinematica/Bat_Purple_Fly/Bat_Purple_4.png');
    	//Escenario
    	this.load.image('background0', 'Imagenes/cinematica/creepy_house.jpg');
    }

    function create() {
    	//Añadimos escenario
    	this.add.image(400, 300, 'background0').scaleY = 1.2;

    	//Creamos las imagenes
    	video_chars = this.physics.add.group()

    	/*
    	Genera un numero aleatorio de llamadas a randomCharGen, dependiente de dif y con momento de llamada aleatorio hasta 20 segundos (20000)
    	*/
    	count = 0	//reseteamos la cuenta
    	var dif = 7;	//la dificultad: saldran minimo 7 fantasmas
    	for (var i = 0; i < Math.floor(Math.random() * 10) + dif; i++)
    	{
    		this.time.addEvent({ delay: Math.random() * 15000, callback: randomCharGen, callbackScope: this, loop: false});
    		count++;
    	}

    	console.log(count);
    }

    /*
    Esta seria la funcion pero hay un problema con el this casi fijo, que no es el mismo en el ambito de create que aqui?
    */
    function schedulePlanner(dif) {
    	var iters = Math.floor(Math.random() * 10) + dif;
    	for (var i = 0; i < iters; i++)
    	{
    		this.time.addEvent({ delay: 3, callback: randomCharGen, callbackScope: this, loop: false});
    	}
    }

    /*
    Esta funcion genera 1 actor que pasa por la pantalla, con posicion inicial, sprite y velocidad
    aleatorios.
    Debe modificarse para que admita un parametro que codifique lo que debe escuchar para devolver el valor.
    */
    function randomCharGen() {
    	//game.time.events.add(Phaser.Timer.SECOND * 4, fadePicture, this);
    	var s_pos = Math.floor(Math.random()*2);
    	var velocity = velocities[Math.floor(Math.random()*3)]
    	if (s_pos == 1)
    	{
    		velocity *= -1;
    	}
    	video_chars.create(start_pos[s_pos], 300, names[Math.floor(Math.random()*3)][0]).setScale(0.5).setVelocityX(velocity);
    }

    update()
    {

    }
}
