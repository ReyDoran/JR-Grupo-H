//Juego
'use strict'
//Variables que se van a utilizar
//Jugadores
var jugador1;
var jugador2;
//Para medir distancias
var distancia;
var j1x;
var j1y;
var j2x;
var j2y;
var jx;
var jy;
var bx;
var by;
//Para las teclas
var cursors;
var w;
var s;
var a;
var d;
var p;
var espacio;
//Para velocidades
var vel1x;
var vel1y;
var vel2x;
var vel2y;
//Para las bases que seran las respuestas
var base1;
var base2;
var base3;
var basebuena;
//Texto para cuando se acaba el tiempo
var fin;
//Para medir el tiempo
var time;
var tiempo;
//Ancho y alto del canvas
var ancho;
var alto;
//Variable para saber el ganador
var ganador;
//Variables para las habilidades
var ralen1;
var ralen2;

class Juego extends Phaser.Scene
{
    constructor(){
        super({key:"Juego"});
    }

    preload()
    {
        //Se cargan las imagenes
        this.load.image('jugador1','Imagenes/play.png');
        this.load.image('jugador2','Imagenes/play.png');
        this.load.image('base','Imagenes/base.png');
    }



    create()
    {
        //Tiempo se inicializa a cero
        time = 1500;

        //se asignan las teclas a variables
        w = this.input.keyboard.addKey('W');
        s = this.input.keyboard.addKey('S');
        d = this.input.keyboard.addKey('D');
        a = this.input.keyboard.addKey('A');
        p = this.input.keyboard.addKey('P');
        espacio = this.input.keyboard.addKey('SPACE');
        cursors = this.input.keyboard.createCursorKeys();

        ancho = this.game.canvas.width;
        alto = this.game.canvas.height;

        //se colocan los sprites
        base1 = this.physics.add.image(ancho*(1/4),alto*(2/3),'base');
        base2 = this.physics.add.image(ancho*(3/4),alto*(2/3),'base');
        base3 = this.physics.add.image(ancho*(1/2),alto*(1/4),'base');

        //se asigan basebuena a la casilla correcta
        basebuena = base1;

        //jugadores
        jugador1 = this.physics.add.image(ancho*(1/2)+100,alto*(1/2),'jugador1');
        jugador2 = this.physics.add.image(ancho*(1/2)-100,alto*(1/2),'jugador2');

         //límites del mapa
        jugador1.setCollideWorldBounds(true);
        jugador2.setCollideWorldBounds(true);

        //texto tiempo que queda
        tiempo = this.add.text(ancho*(1/6), alto*(1/5), time/100, { font: '64px Courier', fill: '#ffffff' });

        //habilidades
        ralen1 = 1;
        ralen2 = 1;
    }

    ralentizar(num)
    {
        if(num==1)
        {
            ralen2 = 1/2;
            setTimeout(function(){ralen2=1}, 5000);
        }
        else
        {
            ralen1 = 1/2;
            setTimeout(function(){ralen1=1}, 5000);
        }
    }

    ligero(num)
    {
        if(num==1)
        {
            ralen2 = 2;
            setTimeout(function(){ralen2=1}, 5000);
        }
        else
        {
            ralen1 = 2;
            setTimeout(function(){ralen1=1}, 5000);
        }
    }

    confusion(num)
    {
        if(num==1)
        {
            console.log("hola1");
            ralen2 = -1;
            //setTimeout(function(){ralen2=1}, 5000);
        }
        else
        {
            console.log("hola2");
            ralen1 = -1;
            //setTimeout(function(){ralen1=1}, 5000);
        }
    }

    habilidad(habil,num)
    {
        if(habil==0)
        {
            this.ralentizar(num);
        }
        else if(habil==1)
        {
            this.ligero(num);
        }
        else if(habil==3)
        {
            this.confusion(num);
        }
    }

    moverse1()
    {
        if (cursors.left.isDown)
        {
            jugador1.setVelocityX(-200*ralen1);
        }
        else if (cursors.right.isDown)
        {
            jugador1.setVelocityX(200*ralen1);
        }
        if (cursors.up.isDown)
        {
            jugador1.setVelocityY(-200*ralen1);
        }
        else if (cursors.down.isDown)
        {
            jugador1.setVelocityY(200*ralen1);
        }
        if (espacio.isDown)
        {
            this.habilidad(3,1);
        }
    }

    moverse2()
    {
        if (a.isDown)
        {
            jugador2.setVelocityX(-200*ralen2);
        }
        else if (d.isDown)
        {
            jugador2.setVelocityX(200*ralen2);
        }
        if (w.isDown)
        {
            jugador2.setVelocityY(-200*ralen2);
        }
        else if (s.isDown)
        {
            jugador2.setVelocityY(200*ralen2);
        }
        if (p.isDown)
        {
            this.habilidad(3,2);
        }
    }

    choque()
    {
        j1x = jugador1.x + 32;

        j1y = jugador1.y + 32;

        j2x = jugador2.x + 32;

        j2y = jugador2.y + 32;

        jx = j1x-j2x;

        jy = j1y-j2y;

        distancia = Math.sqrt((jx)*(jx)+(jy)*(jy));

        if(distancia < 80)
        {
            //Guardamos las velocidades para intercambiarlas(rebote)
            vel1x = jugador1.body.velocity.x;
            vel1y = jugador1.body.velocity.y;
            vel2x = jugador2.body.velocity.x;
            vel2y = jugador2.body.velocity.y;
            //Rebote
            jugador2.setVelocityX(-jx*4+vel1x*4);
            jugador2.setVelocityY(-jy*4+vel1y*4);
            jugador1.setVelocityX(jy*4+vel2x*4);
            jugador1.setVelocityY(jy*4+vel2y*4);
        }
    }

    sobrebase()
    {
        bx = basebuena.x+32;
        by = basebuena.y+32;

        distancia = Math.sqrt(((j1x-bx)*(j1x-bx))+((j1y-by)*(j1y-by)));
        console.log(distancia);
        if(distancia<122)
        {
            this.add.text(ancho*(2/60), alto*(3/5), 'Un punto para el jugador 1', { font: '64px Courier', fill: '#ffffff' });
        }

        distancia = Math.sqrt(((j2x-bx)*(j2x-bx))+((j2y-by)*(j2y-by)));
        console.log(distancia);
        if(distancia<122)
        {
            this.add.text(ancho*(2/60), alto*(4/5), 'Un punto para el jugador 2', { font: '64px Courier', fill: '#ffffff' });
        }
    }

    final()
    {
        //Texto que se muestra al terminar el tiempo
        tiempo.setText(0);
        fin = this.add.text(ancho*(1/6), alto*(2/5), 'Se acabo el tiempo', { font: '64px Courier', fill: '#ffffff' });

        this.sobrebase();
    }

    update()
    {
        //la velocidad se pone a cero para que se paren si dejan de pulsar botones
        jugador1.setVelocityX(0);
        jugador1.setVelocityY(0);
        jugador2.setVelocityX(0);
        jugador2.setVelocityY(0);

        //Si el tiempo llega a 0 se acaba y si no el tiempo sigue bajando
        if(time>0)
        {
            time--;

            //pinta el timempo
            tiempo.setText(Math.trunc(time/100)+1);

            //movimiento jugador1
            this.moverse1();

            //movimiento jugador2
            this.moverse2();

            //choque entre los jugadores
            this.choque();
        }
        else if(time<0)
        {
            //Cuando el juego se ha terminado
        }
        else
        {
            this.final();
            time--;
        }
    }
}
