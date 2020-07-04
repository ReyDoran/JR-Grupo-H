package es.urjc.code.juegosenred;

import java.util.Random;

import org.springframework.web.socket.WebSocketSession;

public class Match {
	// Variables de los dos jugadores
	public WebSocketSession player1;
	public WebSocketSession player2;
	int numPlayers;
	// Datos de la partida de la configuración de los jugadores
	public int p1Char;	// personaje
	public int p2Char;
	public int[] p1Abilities = new int[3];	// orden de habilidades
	public int[] p2Abilities = new int[3];
	// Datos generados aleatoriamente de la partida
	public int[] cutsceneActors1 = new int[3];	// nº cazafantasma, fantasma rojo y azul de ronda 1
	public int[] cutsceneActors2 = new int[3];
	public int[] cutsceneActors3 = new int[3];
	public int[] questions = new int[3];	// indice de preguntas de cada ronda
	public int[] correctTombstone = new int[3];	// lapida correcta de cada ronda
	Random rand = new Random();
	// Variable para sincronizaciones
	int playersReady = 0;
	// Para medir el tiempo
	long startTime;
	// Para saber si está en el combate
	public boolean isMatchActive = false;
	
	Match() {
		numPlayers = 0;
	}
	
	// Añade una sesión (si no esta lleno) y actualiza numPlayers
	public void AddPlayer(WebSocketSession player) {
		if (numPlayers == 0) {
			player1 = player;
			numPlayers++;
		}
		else if (numPlayers == 1) {
			player2 = player;
			numPlayers++;
		}		
	}
	
	// Genera los valores aleatorios de la partida
	public void GenerateValues() {
		for (int i = 0; i < 3; i++) {
			cutsceneActors1[i] = rand.nextInt(5);
			cutsceneActors2[i] = rand.nextInt(5);
			cutsceneActors3[i] = rand.nextInt(5);
			questions[i] = rand.nextInt(3);
			correctTombstone[i] = rand.nextInt(3);
		}
	}
	
	// Almacena como "listo" a un jugador
	public void ReadyPlayer() {
		playersReady++;
	}
	
	// Devuelve si se ha puesto "listo" dos veces (representan los dos jugadores)
	public boolean AreReady() {
		return playersReady == 2;
	}
	
	// Resetea el "listo" de ambos jugadores
	public void ResetReady() {
		playersReady = 0;
	}
	
	// Devuelve el número de jugadores en la partida
	public int GetNumPlayers() {
		return numPlayers;
	}
	
	public void StartMatch() {
		startTime = System.currentTimeMillis();
	}
	
	public long GetStartTime() {
		return startTime;
	}
}
