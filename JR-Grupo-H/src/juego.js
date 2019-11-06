//Juego
'use strict'

class Juego extends Phaser.Scene
{
    constructor() {
        super({key:"Juego"});

    }

    preload() {
        //Jugadores
        this.load.image('but', 'assets/personajes/play.png');
        this.load.spritesheet('ghostbuster1', 'assets/personajes/cazafantasmasCenital.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });
        this.load.spritesheet('ghostbuster2', 'assets/personajes/cazafantasmasCenital.png',{ frameWidth: 3480/4, frameHeight: 5214/6 });

        //2 Escenario
        //2.1 Tumbas
        this.load.image('tombstone', 'assets/background/sp_tombstone.png');
        //2.2 Fondo
        this.load.image('cemetery', 'assets/background/bg_cemetery.png');
    }

    /*
    Función que configura los jugadores y el mapa para usar las físicas matter.js
    */
    initMatterPhysics(context)
    {
        //1 Iniciar jugadores
        //Crear imagenes
        if(player1Config[0]==0)
        {
            this.player1 = this.matter.add.sprite(100, 300, 'ghostbuster1').setScale(0.8);
        }
        else if(player1Config[0]==1)
        {
            this.player1 = this.matter.add.image(100, 300, 'but').setScale(0.8);
        }

        if(player2Config[0]==0)
        {
            this.player2 = this.matter.add.sprite(400, 300, 'ghostbuster1').setScale(0.8);
        }
        else if(player2Config[0]==1)
        {
            this.player2 = this.matter.add.image(400, 300, 'but').setScale(0.8);
        }

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
        this.player1.setFriction(0);
        this.player2.setFriction(0);
        this.player1.setFrictionAir(0.1);
        this.player2.setFrictionAir(0.1);


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
        No sirve para answerVariations menores que 2
        */
        let numbers = [count, 0, 0];
        let rand = numbers[0];
        //Evitar bucle infinito
        if (this.answerVariation < 2)
        {
            this.answerVariation = 2;
        }
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
        if (numbers[aux] == count)
        {
            this.basebuena = this.tombstones[0];
        }
        this.add.text(this.tombstones[0].x, this.tombstones[0].y, numbers[aux], { font: '16px Courier', fill: '#ffffff' });
        numbers.splice(aux, 1);
        aux = Math.trunc(Math.random()*numbers.length);
        if (numbers[aux] == count)
        {
            this.basebuena = this.tombstones[1];
        }
        this.add.text(this.tombstones[1].x, this.tombstones[1].y, numbers[aux], { font: '16px Courier', fill: '#ffffff' });
        numbers.splice(aux, 1);
        aux = Math.trunc(Math.random()*numbers.length);
        if (numbers[aux] == count)
        {
            this.basebuena = this.tombstones[2];
        }
        this.add.text(this.tombstones[2].x, this.tombstones[2].y, numbers[aux], { font: '16px Courier', fill: '#ffffff' });
    }


    create() {
        //1 Inicialización de variables
        //1.1 Variables configurables
        this.roundDuration = 20;  //En segundos
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
        //Animaciones
        if(player1Config[0]==0)
        {
            if (this.ghostbuster1anim == null)
            {
                this.ghostbuster1anim = this.anims.create({
                    key: 'ghostbuster1',
                    frames: this.anims.generateFrameNumbers('ghostbuster1', { start: 0, end: 23
                    }),
                    frameRate: 24,
                    repeat: -1
                })
            }
            this.player1.anims.play('ghostbuster1');
            this.ghostbuster1anim.pause();
        }

        if(player2Config[0]==0)
        {
            if (this.ghostbuster2anim == null)
            {
                this.ghostbuster2anim = this.anims.create({
                    key: 'ghostbuster2',
                    frames: this.anims.generateFrameNumbers('ghostbuster2', { start: 0, end: 23
                    }),
                    frameRate: 24,
                    repeat: -1
                })
            }

            this.player2.anims.play('ghostbuster2');
            this.ghostbuster2anim.pause();
        }


        //Estructura que contiene booleanos que indican si las teclas están siendo pulsadas
        this.moveKeys = {
            w:      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a:      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s:      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d:      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            esp:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            p:      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
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

        //timer para medir el tiempo que duran las habilidades
        this.hability1Duration = 3;
        this.hability2Duration = 3;

        //boolean que dice si la habilidad ha sido usada o no
        this.h1=true;
        this.h2=true;

        //distancia entre jugadores
        this.dist = [0,0];
    }

    restartefect1()
    {

        this.efect2 = 1;
    }

    restartefect2()
    {

        this.efect1 = 1;

    }

    ralentizar(j)
    {
        if(j==1)
        {
            this.efect2 = 1/2;
        }
        else
        {
            this.efect1 = 1/2;
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
            this.efect2 = -1;
        }
        else
        {
             this.efect1 = -1;
        }
    }

    susto(j)
    {
        if(j==1)
        {
            this.efect2 = 5;
        }
        else
        {
            this.efect1 = 5;
        }
    }

    habilidad(habil,j,player)
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
        else if(habil == 4)
        {
            this.susto(j);
        }
        else if(habil == 5)
        {
            this.confusion(j);
        }

        //Temporalizador para las habilidades
        if(j==1)
        {
            this.timerhability1 = this.time.addEvent({ delay: 1000 * this.hability1Duration, callback: this.restartefect1, callbackScope: this});
        }
        else
        {
            this.timerhability2 = this.time.addEvent({ delay: 1000 * this.hability2Duration, callback: this.restartefect2, callbackScope: this});
        }
    }

    calculateRotation(player, vector2D){
      //let h = Math.sqrt((Math.pow(vector2D[0], 2),Math.pow(vector2D[1], 2)))+0.0001;
      let angulo = 0;
      if (vector2D[0]>=0){
        angulo = Math.atan(vector2D[1]/(vector2D[0]+0.0001));
        angulo = (angulo*180)/Math.PI+90;
        //console.log(angulo);
          player.setAngle(angulo);
      } else {
        angulo = Math.atan(vector2D[1]/(vector2D[0]+0.0001));
        angulo = (angulo*180)/Math.PI+90;
        //console.log(angulo);
        player.setAngle(-angulo);
      }
    }

    calculateForces(player, keyUp, keyLeft, keyDown, keyRight, efect, dist)
    {
        let angle;
        let force = 0.005;
        let acceleration = [efect*(force * keyRight.isDown - force * keyLeft.isDown), efect*(force * keyDown.isDown - force * keyUp.isDown)];
        this.calculateRotation(player, acceleration);
        if(efect == 5)
        {
            let modulo = Math.sqrt(dist[0]*dist[0] + dist[1]*dist[1]);
            acceleration = [force*dist[0]/modulo, force*dist[1]/modulo];
        }
        let accelerationVec = new Phaser.Math.Vector2(acceleration[0], acceleration[1]);
        player.applyForce(accelerationVec);
        //player.setAngle(Math.acos(angle));
    }

    /*
    Esta función calcula si el jugador pasado como parámetro está dentro de la base correcta en booleano
    */
    checkPosition(player, base)
    {
        let ret = false;
        //console.log('px=' + player.x + 'py=' + player.y);
        //console.log('bx=' + base.x + 'by=' + base.y);
        if (player.x < base.x + base.width/2*0.05 && player.x > base.x - base.width/2*0.05)
        {
            ret = true;
        }
        if (player.y < base.y + base.height/2*0.05 && player.y > base.y - base.height/2*0.05)
        {
            ret = ret && true;
        }
        else {
            ret = false;
        }
        return ret;
    }

    sobrebase()
    {
        if (this.checkPosition(this.player1, this.basebuena))
        {
            this.roundTextEnd1 = this.add.text(this.ancho*(2/60), this.alto*(3/5), 'Un punto para el jugador 1', { font: '32px Courier', fill: '#ffffff' });
            points[0]++;
        }
        if (this.checkPosition(this.player2, this.basebuena))
        {
            this.roundTextEnd2 = this.add.text(this.ancho*(2/60), this.alto*(4/5), 'Un punto para el jugador 2', { font: '32px Courier', fill: '#ffffff' });
            points[1]++;
        }
    }

    final()
    {
        //Texto que se muestra al terminar el tiempo
        this.tiempo.setText(0);
        this.roundEndText0 = this.add.text(this.ancho*(1/6), this.alto*(2/5), 'Se acabo el tiempo', { font: '64px Courier', fill: '#ffffff' });
        this.roundEnd = true;
        this.freeze();
        this.sobrebase();
        this.time.addEvent({ delay: 4000, callback: this.changeScene, callbackScope: this});

    }

    changeScene()
    {
        let msg;
        round++;
        if (round == 2)
        {
            if (this.roundEndText0 != undefined) this.roundEndText0.setAlpha(0);
            if (this.roundTextEnd1 != undefined) this.roundTextEnd1.setAlpha(0);
            if (this.roundTextEnd2 != undefined) this.roundTextEnd2.setAlpha(0);
            if (points[0] > points[1])
            {
                msg = 'Ha ganado el jugador 1';
            }
            else if (points[1] > points[0])
            {
                msg = 'Ha ganado el jugador 2';
            }
            else {
                msg = 'Ha habido un empate';
            }
            this.add.text(200, this.alto/2, msg, { font: '100px Courier', fill: '#ffffff' });
            this.time.addEvent({delay:4000, callback: this.restart, callbackScope: this});
        }
        else {
            this.scene.start('Video');
        }

    }

    restart()
    {
        round = 0;
        this.scene.start('Menu');
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
            if(this.h1==true && this.moveKeys.esp.isDown)
            {
                //console.log("hola1");
                this.habilidad(this.habilidad1, 1, this.player1);
                this.h1=false;
            }
            if(this.h2==true && this.moveKeys.p.isDown)
            {
                //console.log("hola2");
                this.habilidad(this.habilidad2, 2, this.player2);
                this.h2=false;
            }


            this.dist = [this.player1.x - this.player2.x, this.player1.y - this.player2.y];
            this.calculateForces(this.player1, this.moveKeys.w, this.moveKeys.a, this.moveKeys.s, this.moveKeys.d, this.efect1, this.dist);
            this.dist = [-this.dist[0],-this.dist[1]];
            this.calculateForces(this.player2, this.moveKeys.up, this.moveKeys.left, this.moveKeys.down, this.moveKeys.right, this.efect2, this.dist);
        }

        //Control de animación
        if (!this.ghostbuster1anim.isPlaying && (this.player1.body.velocity.x != 0 || this.player1.body.velocity.y != 0)) {
            this.ghostbuster1anim.resume();
        }
        if ((this.player1.body.velocity.x < 0.6 && this.player1.body.velocity.x > -0.6) && (this.player1.body.velocity.y < 0.6 && this.player1.body.velocity.y > -0.6)) {
            this.ghostbuster1anim.pause();
        }
        this.player1.setAngularVelocity(0);
        this.player2.setAngularVelocity(0);
        /* version 0.1
        //Control de animación
        if (!this.ghostbuster1anim.isPlaying && (this.player1.body.velocity.x != 0 || this.player1.body.velocity.y != 0)) {
            this.ghostbuster1anim.resume();
        }
        if ((this.player1.body.velocity.x < 0.6 && this.player1.body.velocity.x > -0.6) && (this.player1.body.velocity.y < 0.6 && this.player1.body.velocity.y > -0.6)) {
            this.ghostbuster1anim.pause();
        }
        this.player1.setAngularVelocity(0);
        //Control de dirección
        if (this.moveKeys.w.isDown)
        {
            console.log('w');
            this.player1.setAngle(0);
        }
        if (this.moveKeys.a.isDown)
        {
            console.log('a');
            this.player1.setAngle(270);
        }
        if (this.moveKeys.s.isDown)
        {
            console.log('s');
            this.player1.setAngle(180);
        }
        if (this.moveKeys.d.isDown)
        {
            console.log('d');
            this.player1.setAngle(90);
        }
        */
    }
}
