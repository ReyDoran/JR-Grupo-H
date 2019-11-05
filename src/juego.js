//Juego
'use strict'

class Juego extends Phaser.Scene
{
    constructor() {
        super({key:"Juego"});

    }

    preload() {
        //1 Jugadores
        this.load.image('but', 'assets/menu/play.png');  //PLACEHOLDER

        //2 Escenario
        //2.1 Tumbas
        this.load.image('base','assets/menu/base.png');    //PLACEHOLDER
        this.load.image('tombstone', 'assets/escenario/sp_tombstone.png');
        //2.2 Fondo
        this.load.image('cemetery', 'assets/escenario/bg_cemetery.png');
    }

    /*
    Función que configura los jugadores y el mapa para usar las físicas matter.js
    */
    initMatterPhysics(context)
    {
        //1 Iniciar jugadores
        //Crear imagenes
        this.player1 = this.matter.add.image(100, 300, 'but').setScale(0.8);
        this.player2 = this.matter.add.image(400, 300, 'but').setScale(0.8);
        //Añadir colisión circular
        this.player1.setBody({
            type: 'circle',
            radius: 42*0.8
        });
        this.player2.setBody({
            type: 'circle',
            radius: 42*0.8
        });
        //Añadir bounce y fricción
        this.player1.setBounce(0.9);
        this.player2.setBounce(0.9);
        this.player1.setFriction(1);
        this.player2.setFriction(1);

        //2 Iniciar escenario
        this.matter.world.setBounds(20, 0, 1227, 690);
    }


    //NO ESCALABLE!! Solo vale para exluír un valor
    randomNum(base, variation, exclude)
    {
        let ret = base + Math.trunc(Math.random()*(variation+1)) - Math.trunc(Math.random()*(variation+1));
        while (ret == base || ret == exclude)
        {
            ret = base + Math.trunc(Math.random()*(variation+1)) - Math.trunc(Math.random()*(variation+1));
        }
        return ret;
    }

    /*
    Función que añade al mapa  tumbas con numeros diferentes, asignando la correcta a basebuena
    */
    initTombstones()
    {
        this.tombstones = [this.add.image(this.ancho*(1/4),this.alto*(2/3),'tombstone').setOrigin(0.5).setScale(0.05),
                            this.add.image(this.ancho*(3/4),this.alto*(2/3),'tombstone').setOrigin(0.5).setScale(0.05),
                            this.add.image(this.ancho*(1/2),this.alto*(1/4),'tombstone').setOrigin(0.5).setScale(0.05)];
        //Creamos el texto de cada tumba
        /*
        Creo un array con 2 números dentro de un rango diferentes a la respuesta (y entre sí)
        */
        let numbers = [count, 0, 0];
        let rand = numbers[0];
        while (rand == numbers[0])
        {
            rand = count + Math.trunc(Math.random()*(this.answerVariation+1)) - Math.trunc(Math.random()*(this.answerVariation+1));
        }
        numbers[1] = rand;
        rand = numbers[0];
        while (rand == numbers[0] || rand == numbers[1])
        {
            rand = count + Math.trunc(Math.random()*(this.answerVariation+1)) - Math.trunc(Math.random()*(this.answerVariation+1));
        }
        numbers[2] = rand;
        //Añade escogiendo aleatoriamente los numeros del array en las tumbas.
        let aux;
        aux = Math.trunc(Math.random()*numbers.length);
        if (aux == 0) this.basebuena = this.tombstones[0];
        this.add.text(this.tombstones[0].x, this.tombstones[0].y, numbers[aux], { font: '16px Courier', fill: '#ffffff' });
        numbers.splice(aux, 1);
        aux = Math.trunc(Math.random()*numbers.length);
        if (aux == 0) this.basebuena = this.tombstones[1];
        this.add.text(this.tombstones[1].x, this.tombstones[1].y, numbers[aux], { font: '16px Courier', fill: '#ffffff' });
        numbers.splice(aux, 1);
        aux = Math.trunc(Math.random()*numbers.length);
        if (aux == 0) this.basebuena = this.tombstones[2];
        this.add.text(this.tombstones[2].x, this.tombstones[2].y, numbers[aux], { font: '16px Courier', fill: '#ffffff' });
        /*
        this.base1 = this.add.image(this.ancho*(1/4),this.alto*(2/3),'tombstone').setOrigin(0.5).setScale(0.05);
        this.base2 = this.add.image(this.ancho*(3/4),this.alto*(2/3),'tombstone').setOrigin(0.5).setScale(0.05);
        this.base3 = this.add.image(this.ancho*(1/2),this.alto*(1/4),'tombstone').setOrigin(0.5).setScale(0.05);
        */
        console.log(this.basebuena.x);
    }


    create() {
        //1 Inicialización de variables
        //1.1 Variables configurables
        this.roundDuration = 15;  //En segundos
        this.answerVariation = 2;   //Variacion entre números de las tumbas respecto al correcto

        //1.2 Variables no configurables
        this.roundEnd = false;  //Almacena si se ha terminado el tiempo de la ronda
        this.timer = this.time.addEvent({ delay: 1000 * this.roundDuration, callback: this.final, callbackScope: this});
        this.ancho = this.game.canvas.width;
        this.alto = this.game.canvas.height;
        //Creacion de sprites. Los instanciados más tarde se pintarán por encima.
        this.add.image(this.ancho/2, this.alto/2, 'cemetery').setOrigin(0.5).setScale(0.26);
        this.initTombstones();
        this.initMatterPhysics();


        //Estructura que contiene booleanos que indican si las teclas están siendo pulsadas
        this.moveKeys = {
            w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            esp: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            p: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        };

        //texto tiempo que queda y puntos
        this.tiempo = this.add.text(this.ancho*(1/15), this.alto*(1/16), this.timer.getElapsed()/100, { font: '32px Courier', fill: '#ffffff' });
        this.add.text(this.ancho*(7/8), this.alto*(1/16), 'j1=' + points[0] + ' j2=' + points[1], { font: '24px Courier', fill: '#ffffff' });

        //que habilidades tiene cada jugador    1-ralentizar  2-peso ligero  3-confusion
        this.habilidad1 = 3;
        this.habilidad2 = 3;

        //efecto de la habilidad del j1 y j2
        this.efect1 = 1;
        this.efect2 = 1;
    }

    ralentizar(j)
    {
        if(j==1)
        {
            this.efect2 = this.efect2/2;
        }
        else
        {
            this.efect1 = this.efect1/2;
        }

    }

    ligero(player)
    {
        player.setBounce(2.0);
    }

    confusion(j)
    {
        if(j==1)
        {
            this.efect2 = -this.efect2;
        }
        else
        {
            this.efect1 = -this.efect1;
        }
    }

    habilidad(tecla,habil,j,player)
    {
        if(tecla.isDown)
        {
            if(habil == 1)
            {
                this.ralentizar(j);
            }
            else if(habil == 2)
            {
                this.ligero(player);
            }
            else if(habil == 3)
            {
                this.confusion(j);
            }
        }
    }

    calculateForces(player, keyUp, keyLeft, keyDown, keyRight, efect)
    {
        let force = 0.001;
        let acceleration = [efect*(force * keyRight.isDown - force * keyLeft.isDown), efect*(force * keyDown.isDown - force * keyUp.isDown)];
        let accelerationVec = new Phaser.Math.Vector2(acceleration[0], acceleration[1]);
        player.applyForce(accelerationVec);
    }


    /*
    Esta función calcula si el jugador pasado como parámetro está dentro de la base correcta en booleano
    */
    checkPosition(player, base)
    {
        let ret = false;
        console.log('px=' + player.x + 'py=' + player.y);
        console.log('bx=' + base.x + 'by=' + base.y);
        if (player.x < base.x + base.width/2*0.05 && player.x > base.x - base.width/2*0.05) ret = true;
        if (player.y < base.y + base.height/2*0.05 && player.y > base.y - base.height/2*0.05) ret = ret && true;
        return ret;
    }

    sobrebase()
    {
        if (this.checkPosition(this.player1, this.basebuena))
        {
            this.add.text(this.ancho*(2/60), this.alto*(3/5), 'Un punto para el jugador 1', { font: '32px Courier', fill: '#ffffff' });
            points[0]++;
        }
        if (this.checkPosition(this.player2, this.basebuena))
        {
            this.add.text(this.ancho*(2/60), this.alto*(4/5), 'Un punto para el jugador 2', { font: '32px Courier', fill: '#ffffff' });
            points[1]++;
        }
    }

    final()
    {
        //Texto que se muestra al terminar el tiempo
        this.tiempo.setText(0);
        this.add.text(this.ancho*(1/6), this.alto*(2/5), 'Se acabo el tiempo', { font: '64px Courier', fill: '#ffffff' });
        this.roundEnd = true;
        this.freeze();
        this.sobrebase();
        this.time.addEvent({ delay: 4000, callback: this.changeScene, callbackScope: this});

    }

    changeScene()
    {
        this.scene.start('Cinematica');
    }

    freeze()
    {
        this.player1.setVelocity(0);
        this.player2.setVelocity(0);
        this.player1.setAngularVelocity(0);
        this.player2.setAngularVelocity(0);
    }

    update()
    {
        if (!this.roundEnd)
        {
            this.tiempo.setText(Math.trunc(this.roundDuration-this.timer.getElapsedSeconds()));
            this.habilidad(this.moveKeys.esp, this.habilidad1, 1, this.player1);
            this.habilidad(this.moveKeys.p, this.habilidad2, 2, this.player2);
            this.calculateForces(this.player1, this.moveKeys.w, this.moveKeys.a, this.moveKeys.s, this.moveKeys.d, this.efect1);
            this.calculateForces(this.player2, this.moveKeys.up, this.moveKeys.left, this.moveKeys.down, this.moveKeys.right, this.efect2);
        }
    }
}
