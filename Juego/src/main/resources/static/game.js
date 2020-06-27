'use strict'

var gameWidth = 1280;
var gameHeight = 720;

var config = {
	type: Phaser.AUTO,
	width: gameWidth,
	height: gameHeight,
	physics: {
		default: 'matter',
		matter: {
			gravity: { x: 0, y: 0 },
			debug: false
		}
	},
	//Orden de escenas
	scene: [Intro,Menu,Login,Cutscene,Battle,BattleOnline,CutsceneOnline,SeleccionPJH]
};

var game = new Phaser.Game(config);

//Variables con información que se pasa entre escenas.
var points = [0, 0];    //Almacena los puntos del j1 y del j2
var answer = 0;  //Almacena la respuesta del vídeo

/*
Las dos siguientes variables guardan el peronsaje y las habilidades escogidas por cada jugador.
[0] = personaje; [1][2][3] = tres habilidades (en orden)
*/
var player1Config = [0, 0, 0, 0];
var player2Config = [0, 0, 0, 0];
var round = 0;  //Almacena el número de ronda

function preload () {}

function create () {}

function update () {}
