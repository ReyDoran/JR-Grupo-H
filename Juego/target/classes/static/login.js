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

var dat;

var us;

//variable para simular cambio de escena
var loggedIn = false;

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

		this.square1 = this.make.image({
	        x: gameWidth*(5/20),
	        y: gameHeight*(3/8),
	        key: 'bg_square',
	        add: false
	    });
		this.square1.scaleX = 2;

		this.square2 = this.make.image({
	        x: gameWidth*(15/20),
	        y: gameHeight*(3/8),
	        key: 'bg_square',
	        add: false
	    });

		nam.style.display = "inline-block";
		pass.style.display = "inline-block";
		signUp.style.display = "inline-block";
		logIn.style.display = "inline-block";
		this.chatmes = this.add.text(gameWidth*(1/20), gameHeight*(1/8),"",{ font: '14px Courier', fill: '#ffffff' });
		this.conected = this.add.text(gameWidth*(16/20), gameHeight*(1/8),"",{ font: '14px Courier', fill: '#ffffff' });
		//Botones chat
		this.bt_up = this.add.image(gameWidth*(55/100),gameHeight*(1/4),'bt_return').setInteractive();
		this.bt_up.scaleX = 0.5;
	    this.bt_up.scaleY = 0.5;
	    this.bt_up.setAlpha(0);
		this.bt_down = this.add.image(gameWidth*(55/100),gameHeight*(3/4),'bt_return').setInteractive();
		this.bt_down.scaleX = 0.5;
	    this.bt_down.scaleY = 0.5;
	    this.bt_down.setAlpha(0);

	    //Subir
	    this.bt_up.on('pointerdown', function (pointer)
	    {
	    	this.chatmes.y+=10;
	    }, this);

	    //Bajar
	    this.bt_down.on('pointerdown', function (pointer)
	    {
	    	this.chatmes.y-=10;
	    }, this);

	    //Botones usuarios conectados
	    this.bt_up_users = this.add.image(gameWidth*(7/10),gameHeight*(1/4),'bt_return').setInteractive();
		this.bt_up_users.scaleX = 0.5;
	    this.bt_up_users.scaleY = 0.5;
	    this.bt_up_users.setAlpha(0);
		this.bt_down_users = this.add.image(gameWidth*(7/10),gameHeight*(3/4),'bt_return').setInteractive();
		this.bt_down_users.scaleX = 0.5;
	    this.bt_down_users.scaleY = 0.5;
	    this.bt_down_users.setAlpha(0);


	    //Subir
	    this.bt_up_users.on('pointerdown', function (pointer)
	    {
	    	this.conected.y+=10;
	    }, this);

	    //Bajar
	    this.bt_down_users.on('pointerdown', function (pointer)
	    {
	    	this.conected.y-=10;
	    }, this);


	    this.chatmes.mask = new Phaser.Display.Masks.BitmapMask(this, this.square1);
	    this.conected.mask = new Phaser.Display.Masks.BitmapMask(this, this.square2);
	}

	update()
	{
	  if (registerUserBoolean == true)
	  {
		  registerUserBoolean = false;
		  registerUser();
		  disableLogin();
		  showOnlineMenu();
	  }
	  if (loggedIn == true)
	  {
		  loggedIn = false;
		  this.onlineConfirmationTimer = this.time.addEvent({ delay: 1000, callback: onlineConfirmationGet, loop: true});
		  disableLogin();
		  showOnlineMenu();
		  loadchat = true;
		  this.bt_up.setAlpha(1);
		  this.bt_down.setAlpha(1);
		  this.bt_up_users.setAlpha(1);
		  this.bt_down_users.setAlpha(1);
	  }
	  if(loadchat)
	  {
		  console.log(dat);
		  getchat();
		  getusers();
		  this.chatmes.setText(dat);
		  this.conected.setText(us);
	  }
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
		console.log("Pulsado register");
		tempUser.name = input1.val();
		tempUser.pass = input2.val();
		register();
	})

	//Boton enviar chat
	$("#butChat").click(function(){
		text = user.name + ": " + input3.val();
		sendText();
	})
})

function getchat()
{

	$.get('http://'+URLdomain+'/chat', function(data){
		dat = data;
		});
}

function getusers()
{

	$.get('http://'+URLdomain+'/users', function(users){
		us = users;
		});
}


function sendText()
{
	console.log(text);
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

function disableLogin()
{
	nam.style.display = "none";
	pass.style.display = "none";
	logIn.style.display = "none";
	signUp.style.display = "none";
}

function showOnlineMenu()
{
	chat.style.display = "inline-block";
	send.style.display = "inline-block";
}

function onlineConfirmationGet()
{
	$.get('http://'+URLdomain+'/users/'+user.id, function(){
		console.log("Estoy online");
		});
	$.get('http://'+URLdomain+'/users', function(users){
		console.log("Lista de conectados:");
		console.log(users);
		});
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
			console.log("Inicio de sesión correcto");
			user.name = tempUser.name;
			user.pass = tempUser.pass;
			user.id = id;
			loggedIn = true;
			butSignUp.style.display = 'none';
			butLogIn.style.display = 'none';
			nam.style.display = 'none';
			pass.style.display = 'none';
		}).fail(function () {
			console.log("No existe esa combinación de nombre-contraseña");
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
			console.log("Usuario creado");
			user.name = tempUser.name;
			user.pass = tempUser.pass;
			user.id = id;
		}).fail(function () {
			console.log("Nombre de usuario ya en uso");
		});
}

function registerUser()
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
