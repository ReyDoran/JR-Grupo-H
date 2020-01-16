'use strict'

var URLdomain = window.location.host;

var posted = false;
var registeredUsers = [];
var registerUserBoolean = false;
var tempUser = {
        name: "",
        pass: ""
}
var user = {
        name: "",
        pass: "",
        id: -1
}
var loadchat = false;

var text = "";

var errorlogin = false;
var errorregister = false;

var dat;
var us2;

var us;

var backMenu = false;

//variable para simular cambio de escena
var loggedIn = false;

var failedAttempts = 0;

var registered = false;

//Variables websockets
var msg;
var match=false;
var playerj;
var session;
var x;
var y;
var angle;
var h;
var p;
var h1;
var h2;
var h3;
var ch1;
var ch2;
var ch3;
var ch4;
var ch5;
var ch6;
var ch7;
var ch8;
var ch9;
var rQ1;
var rQ2;
var rQ3;
var cT1;
var cT2;
var cT3;

var characters;
var correctTombstones;
var roundQuestions;

var ax;
var ay;
var aex;
var aey;

var sincro=0;

var chatFeed = document.getElementById('chatfeed');
var nam = document.getElementById('name');
var pass = document.getElementById('pass');
var logIn = document.getElementById('butLogIn');
var signUp = document.getElementById('butSignUp');
var chat = document.getElementById('chat');
var send = document.getElementById('butChat');
nam.style.display = 'none';
pass.style.display = 'none';
logIn.style.display = 'none';
signUp.style.display = 'none';
chat.style.display = 'none';
send.style.display = 'none';

//Iniciamos sesion websockets
var connection = new WebSocket('ws://'+URLdomain+'/juego');
connection.onopen = function()
{
    console.log("WS abierto");
    conectado = true;
}
connection.onerror = function(e)
{
    console.log("WS error: " + e);
}
connection.onmessage = function(msg)
{
    console.log("WS message: " + msg.data);
    var info = JSON.parse(msg.data);
    switch(info.code)
    {
        case 0:
        {
            //Emparejamiento
            playerj = info.player;
            match = true;
            session = info.session;
            break;
        }
        case 1:
        {
            //Generacion de la partida
            p = info.personaje;
            h1 = info.h1;
            h2 = info.h2;
            h3 = info.h3;
            characters[0] = info.ch1;
            characters[1] = info.ch2;
            characters[2] = info.ch3;
            characters[3] = info.ch4;
            characters[4] = info.ch5;
            characters[5] = info.ch6;
            characters[6] = info.ch7;
            characters[7] = info.ch8;
            characters[8] = info.ch9;
            roundQuestions[0] = info.rQ1;
            roundQuestions[1] = info.rQ2;
            roundQuestions[2] = info.rQ3;
            correctTombstones[0] = info.cT1;
            correctTombstones[1] = info.cT2;
            correctTombstones[2] = info.cT3;
            break;
        }
        case 2:
        {
            //Se llegan los datos del contrario
            x = info.x;
            y = info.y;
            ax = info.ax;
            ay = info.ay;
            angle = info.rotation;
            h = info.hability;
            break;
        }
        case 3:
        {
            //Termina partida
            break;
        }
				case 4:
        {
            sincro = 2;
            break;
        }
        default:
        {
            console.log("default");
        }
        break;
    }
    match=true;
}
connection.onclose = function()
{
    console.log("Closing socket");
		conectado = false;
}

class Login extends Phaser.Scene
{
	constructor()
	{
		super({key:"login"});
	}
	preload() {}

	create()
	{
		this.onlineConfirmationTimer;
		this.backMenuFuncTimer;

		this.square1 = this.make.image({
	        x: gameWidth*(5/20),
	        y: gameHeight*(17/40),
	        key: 'bg_square',
	        add: false
	    });
		this.square1.scaleX = 2;
		this.square1.scaleY = 0.8;

		this.square2 = this.make.image({
	        x: gameWidth*(15/20),
	        y: gameHeight*(17/40),
	        key: 'bg_square',
	        add: false
	    });
		this.square2.scaleY = 0.8;

		nam.style.display = "inline-block";
		pass.style.display = "inline-block";
		signUp.style.display = "inline-block";
		logIn.style.display = "inline-block";
		this.chatmes = this.add.text(gameWidth*(15/100), gameHeight*(15/80),"",{ font: '16px Courier', fill: '#ffffff' });
		this.conected = this.add.text(gameWidth*(38/50), gameHeight*(15/80),"",{ font: '18px Courier', fill: '#ffffff' });
		this.log = this.add.text(gameWidth*(25/100), gameHeight*(25/80),"",{ font: '32px Courier', fill: '#ff0000' });
		this.reg = this.add.text(gameWidth*(25/100), gameHeight*(25/80),"",{ font: '32px Courier', fill: '#ff0000' });
		this.fall = this.add.text(gameWidth*(25/100), gameHeight*(25/80),"",{ font: '32px Courier', fill: '#ff0000' });

    this.back = this.add.image(gameWidth*7/50, gameHeight*9/50, 'bt_return').setAlpha(1).setScale(0.7).setInteractive();

    this.online = this.add.image(gameWidth*35/50, gameHeight*35/50, 'online').setAlpha(0).setScale(0.5).setInteractive();

	this.userCreatedText = this.add.text(gameWidth*(25/100), gameHeight*(30/80),"",{ font: '32px Courier', fill: '#00ff00'});

    this.back.on('pointerdown', function (pointer){
	  	nam.style.display = 'none';
	  	pass.style.display = 'none';
	  	logIn.style.display = 'none';
	  	signUp.style.display = 'none';
	  	chat.style.display = 'none';
	  	send.style.display = 'none';

		document.getElementById("chat_div").style.visibility = "hidden";
		document.getElementById("chatfeed").style.visibility = "hidden";

	  	loadchat = false;
	  	this.chatmes.setText("");
	  	this.conected.setText("");
	  	errorlogin = false;
		errorregister = false;
		backMenu = false;
		this.chatmes.setText("");
		this.conected.setText("");
		this.time.removeAllEvents();
		this.online.setAlpha(0);
		connection.close();
    	this.scene.start('menu');
    }, this);

    //Online Partida
    this.online.on('pointerdown', function (pointer){
  	nam.style.display = 'none';
  	pass.style.display = 'none';
  	logIn.style.display = 'none';
  	signUp.style.display = 'none';
  	chat.style.display = 'none';
  	send.style.display = 'none';
		document.getElementById("chat_div").style.visibility = "hidden";
		document.getElementById("chatfeed").style.visibility = "hidden";
  	loadchat = false;
  	this.chatmes.setText("");
  	this.conected.setText("");
  	errorlogin = false;
		errorregister = false;
		backMenu = false;
		this.chatmes.setText("");
		this.conected.setText("");
		this.time.removeAllEvents();
		this.online.setAlpha(0);

		msg =
			{
    		code: "0"
    	}
			connection.send(JSON.stringify(msg));
    }, this);

    this.chatmes.mask = new Phaser.Display.Masks.BitmapMask(this, this.square1);
    this.conected.mask = new Phaser.Display.Masks.BitmapMask(this, this.square2);

    //Interfaz por encima de casi todo
    this.interf = this.add.sprite(gameWidth*11/20,gameHeight/2,'bg_estatica').setAlpha(0.05);
    this.anims.create({
	    key: 'bg_estatica_anim',
	    frames: this.anims.generateFrameNumbers('bg_estatica'),
	    frameRate: 20,
	    repeat: -1
	  });
    this.interf.play('bg_estatica_anim');

    this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'bg_frame');
	}


	//Cambia de escena para online
    changeScene()
    {
        this.scene.start("seleccionpjh");
    }


	update()
	{
		if (registerUserBoolean == true)
	  	{
		  	registerUserBoolean = false;
		  	this.registerUser();
		  	this.disableLogin();
		  	this.showOnlineMenu();
	  	}
	  	if (loggedIn == true)
	  	{
			chatFeed.style.display = 'initial';
			this.log.setText("");
		  	this.reg.setText("");
	  		errorlogin = false;
	  		errorregister = false;
		  	loggedIn = false;
		  	this.onlineConfirmationTimer = this.time.addEvent({ delay: 500, callback: this.onlineConfirmationGet, loop: true, callbackScope: this});
			this.getChatTimer = this.time.addEvent({ delay: 250, callback: this.getchat, loop: true, callbackScope: this});
        	this.getUsersTimer = this.time.addEvent({ delay: 500, callback: this.getusers, loop: true, callbackScope: this});
		  	this.disableLogin();
		  	this.showOnlineMenu();
		  	loadchat = true;
	  	}
		if (registered == true) {
			 this.log.setText("");
			 this.reg.setText("");
			 this.userCreatedText.setText("");
			 this.userCreatedText.setText("Usuario creado. Iniciando sesión");
			 this.succesfulRegisterTimer = this.time.addEvent({delay: 3000, callback: this.loggedInToTrue, loop: false, callbackScope: this});
			 registered = false;
	}
			if(errorlogin)
				{
					this.log.setText("Error, usuario o contraseña incorrecta");
					this.reg.setText("");
					this.userCreatedText.setText("");
					errorlogin = false;
				 }
				 if(errorregister)
				 {
					 this.userCreatedText.setText("");
					 this.log.setText("");
					 this.reg.setText("Error nombre de usuario ya en uso");
					 errorregister = false;
				 }
	  	if(backMenu)
	  	{
	  		this.fall.setText("El servidor se ha caido");

	  		this.backMenuFuncTimer = this.time.addEvent({ delay: 4000, callback: this.backMenuFunc, loop: false, callbackScope: this});
	  	}
	  	if(match)
        {
            this.changeScene();
        }
	}

	backMenuFunc() {
		this.chatmes.setText("");
    	this.conected.setText("");
  		this.fall.setText("");
		this.time.removeAllEvents();
  		backMenu = false;
  		this.scene.start('menu');
	}

	loggedInToTrue() {
  	loggedIn = true;

  	this.userCreatedText.setText("");
		document.getElementById("chat_div").style.visibility = "visible";
		document.getElementById("chatfeed").style.visibility = "visible";
		document.getElementById("chat_div").style.visibility = "visible";
  }

	getchat()
	{
		$.get('http://'+URLdomain+'/chat', function(data){
					 dat = " ";
					 for (let j = 0; j < data.length; j++) {
							 let msg = data[j].split('');
							 msg[0] = " ";
							 msg[msg.length-1] = " ";
							 let msgString = msg.join("");
							 dat += msgString + "\n";
					 }
			 });
		document.getElementById("chatfeed").innerHTML = dat;
	}

	getusers()
	{

		$.get('http://'+URLdomain+'/users', function(users){
			if (users!=null){
				us = users[0];
				us2 = users[1];
			}
		});
		let connectedText = "";
		let disconnectedText = "";
		if (us != null) {
			for (let i = 0; i < us.length; i++) {
				connectedText += us[i] + "\n";
			}
		}
		if (us2 != null) {
			for (let i = 0; i < us2.length; i++) {
				disconnectedText += us2[i] + "\n";
			}
		}
		this.conected.setText("CONECTADOS:\n"+connectedText+"\nDESCONECTADOS:\n"+disconnectedText);
	}

	disableLogin()
	{
		nam.style.display = "none";
		pass.style.display = "none";
		logIn.style.display = "none";
		signUp.style.display = "none";
	}

	showOnlineMenu()
	{
		chat.style.display = "inline-block";
		send.style.display = "inline-block";
		this.online.setAlpha(1);
	}

	onlineConfirmationGet() {
		$.get('http://'+URLdomain+'/users/'+user.id, function(){
    	//console.log("Estoy online");
    });
    $.get('http://'+URLdomain+'/users', function(users){
	    //console.log("Lista de conectados:");
	    //console.log(users);
	    }).fail(function (data) {
					if (data.status == 0)
        	{
          	if (failedAttempts >= 5) {
            	failedAttempts = 0;
              nam.style.display = 'none';
              pass.style.display = 'none';
              logIn.style.display = 'none';
              signUp.style.display = 'none';
            	chatFeed.style.display = 'none';
              chat.style.display = 'none';
              send.style.display = 'none';
              loadchat = false;
              errorlogin = false;
              errorregister = false;
              backMenu = true;
            }
            else {
                failedAttempts++;
            }
        }
    	})
    }

	registerUser()
	{
		$.ajax({
		 method: "POST",
		 url:'http://'+URLdomain+'/users',
		 data: JSON.stringify(tempUser),
		 processData: false,
		 headers: {
		 "Content-type":"application/json"
	 	 },
		 success: console.log("Registrado")
	 });
	}
}

$(document).ready(function()
{
	let input1 = $('#name');
	let input2 = $('#pass');
	let input3 = $('#chat');

	//Log In button
	$("#butLogIn").click(function()
	{
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		login();
	})

	//Sign Up button
	$("#butSignUp").click(function()
	{
		//console.log("Pulsado register");
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		register();
	})

	//Boton enviar chat
	$("#butChat").click(function(){
		text = user.name + ": " + input3.val() + "<br>";
		sendText();
	})
})

function sendText()
{
	//console.log(text);
	$.ajax({
		 method: "POST",
		 url:'http://'+URLdomain+'/chat',
		 data: JSON.stringify(text),
		 processData: false,
		 headers: {
		 "Content-type":"application/json"
	 	 }
		})
}

function login()
{
	$.ajax({
 		method: "PUT",
	 	url:'http://'+URLdomain+'/users',
	 	data: JSON.stringify(tempUser),
	 	processData: false,
	 	headers: {
	 		"Content-type":"application/json"
 	 	}
	}).done(function (id) {
		//console.log("Inicio de sesión correcto");
		user.name = tempUser.name;
		user.pass = tempUser.pass;
		user.id = id;
		loggedIn = true;
		butSignUp.style.display = 'none';
		butLogIn.style.display = 'none';
		nam.style.display = 'none';
		pass.style.display = 'none';
		document.getElementById("chat_div").style.visibility = "visible";
		document.getElementById("chatfeed").style.visibility = "visible";
	}).fail(function (data) {
		//console.log("No existe esa combinación de nombre-contraseña");
		errorlogin = true;
		errorregister = false;
		if (data.status == 0)
    {
    	nam.style.display = 'none';
    	pass.style.display = 'none';
    	logIn.style.display = 'none';
    	signUp.style.display = 'none';
    	chat.style.display = 'none';
    	send.style.display = 'none';
    	loadchat = false;
    	errorlogin = false;
			errorregister = false;
			backMenu = true;
    }
	});
}

/*
 * Setea a true registerUser si el nombre de usuario no está en uso
 */
function register()
{
	$.ajax({
		 method: "POST",
		 url:'http://'+URLdomain+'/users',
		 data: JSON.stringify(tempUser),
		 processData: false,
		 headers: {
		 "Content-type":"application/json"
	 	 }
		}).done(function (id) {
			//console.log("Usuario creado");
			registered = true;
			user.name = tempUser.name;
			user.pass = tempUser.pass;
			user.id = id;
		}).fail(function (data) {
			//console.log("Nombre de usuario ya en uso");
			errorlogin = false;
			errorregister = true;
			if (data.status == 0)
      {
    		nam.style.display = 'none';
	    	pass.style.display = 'none';
	    	logIn.style.display = 'none';
	    	signUp.style.display = 'none';
	    	chat.style.display = 'none';
	    	send.style.display = 'none';
	    	loadchat = false;
	    	errorlogin = false;
  			errorregister = false;
  			backMenu = true;
      }
		});
}
