package es.urjc.code.juegosenred;

import java.util.Random;
import java.util.concurrent.Semaphore;

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
	// Almacena la última ubicación de cada jugador
	int[] posP1 = new int[2];
	int[] posP2 = new int[2];
	float[] speedP1 = new float[2];
	float[] speedP2 = new float[2];
	// Guarda en que segundo hubo la ultima colision
	public long lastColision = 20;
	// Semaforo para velocidad y posicion de jugadores
	private Semaphore[] posSem = new Semaphore[2];
	private Semaphore[] speedSem = new Semaphore[2];
	
	Match() {
		numPlayers = 0;
		// Inicializamos posiciones para que no colisione
		posP1[0] = 0;
		posP1[1] = 0;
		posP2[0] = 100;
		posP2[1] = 100;
		speedP1[0] = 0;
		speedP1[1] = 0;
		speedP2[0] = 0;
		speedP2[1] = 0;
		for (int i = 0; i < 2; i++) {
			posSem[i] = new Semaphore(1);
			speedSem[i] = new Semaphore(1);
		}
	}
	
	
	public int[] getPosP1() throws InterruptedException {
		posSem[0].acquire();
		int[] ret = posP1;
		posSem[0].release();
		return ret;
	}
	
	public int[] getPosP2() throws InterruptedException {
		posSem[1].acquire();
		int[] ret = posP2;
		posSem[1].release();
		return ret;
	}
	
	public float[] getSpeedP1() throws InterruptedException {
		speedSem[0].acquire();
		float[] ret = speedP1;
		speedSem[0].release();
		return ret;
	}
	
	public float[] getSpeedP2() throws InterruptedException {
		speedSem[1].acquire();
		float[] ret = speedP2;
		speedSem[1].release();
		return ret;
	}
	
	public void setPosP1(int[] newPos) throws InterruptedException {
		posSem[0].acquire();
		posP1 = newPos;
		posSem[0].release();
	}
	
	public void setPosP2(int[] newPos) throws InterruptedException {
		posSem[1].acquire();
		posP2 = newPos;
		posSem[1].release();
	}
	
	public void setSpeedP1(float[] newSpeed) throws InterruptedException {
		speedSem[0].acquire();
		speedP1 = newSpeed;
		speedSem[0].release();
	}
	
	public void setSpeedP2(float[] newSpeed) throws InterruptedException {
		speedSem[1].acquire();
		speedP2 = newSpeed;
		speedSem[1].release();
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
			questions[i] = rand.nextInt(4);
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
