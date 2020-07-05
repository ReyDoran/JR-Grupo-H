package es.urjc.code.juegosenred;

import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebsocketEchoHandler extends TextWebSocketHandler 
{
	final int MAX_MATCHES = 10;
	private ObjectMapper mapper = new ObjectMapper();
	ConcurrentHashMap<String, WebSocketSession> users = new ConcurrentHashMap<String, WebSocketSession>();
	ArrayList<Match> matches = new ArrayList<Match>(MAX_MATCHES);
	int matchesIndex = 0;
	private Semaphore sem = new Semaphore(1);
	private Semaphore semRound = new Semaphore(1);

	public WebsocketEchoHandler() 
	{
		for (int i = 0; i < MAX_MATCHES; i++) 
		{
			matches.add(new Match());
		}
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception 
	{
		//System.out.println("Message recibido: " + message.getPayload());
		// Leemos mensaje
		JsonNode node = mapper.readTree(message.getPayload());
		String code = node.get("code").asText();

		// El codigo marca de que va el mensaje
		switch (code) 
		{
			
			// Buscar Partida
			case "0": 
			{
				// PONER BAJO EM
				sem.acquire();
				// metemos al nuevo jugador en la sala
				if (matches.get(matchesIndex).GetNumPlayers() == 2)
				{
					matchesIndex++;
					if (matchesIndex == MAX_MATCHES) // Caso no quedan salas libres
					{	
						ObjectNode response = mapper.createObjectNode();
						response.put("code", 9);
						System.out.println("Message sent: " + response.toString());
						session.sendMessage(new TextMessage(response.toString()));
					}
				}
				matches.get(matchesIndex).AddPlayer(session);	// Añade el jugador
				sem.release();				
				// FIN BAJO EM
				
				System.out.println("Jugadores: " + matches.get(matchesIndex).GetNumPlayers());
				// si está lleno comenzamos partida
				if (matches.get(matchesIndex).GetNumPlayers() == 2) {
					matches.get(matchesIndex).GenerateValues();
					ObjectNode response1 = mapper.createObjectNode();
					response1.put("code", 0);
					response1.put("player", 1);
					response1.put("match", matchesIndex);
					matches.get(matchesIndex).player1.sendMessage(new TextMessage(response1.toString()));
					System.out.println("Message sent: " + response1.toString());
					ObjectNode response2 = mapper.createObjectNode();
					response2.put("code", 0);
					response2.put("player", 2);
					response2.put("match", matchesIndex);
					matches.get(matchesIndex).player2.sendMessage(new TextMessage(response2.toString()));
					System.out.println("Message sent: " + response2.toString());
				}
				break;
			}
			
			// Eleccion de personajes y de habilidades
			case "1": 
			{
				// Se elijen los personajes
				String character = node.get("p").asText();
				String ability1 = node.get("h1").asText();
				String ability2 = node.get("h2").asText();
				String ability3 = node.get("h3").asText();
				String matchIndex = node.get("match").asText();
				
				Match match = matches.get(Integer.valueOf(matchIndex));
				
				WebSocketSession oponent;
				if (match.player1.getId() == session.getId()) 
					oponent = match.player2;  
				else 
					oponent = match.player1;
	
				// Respuesta
				ObjectNode responseInfo = mapper.createObjectNode();
				responseInfo.put("code", 1);
				responseInfo.put("p", character);
				responseInfo.put("h1", ability1);
				responseInfo.put("h2", ability2);
				responseInfo.put("h3", ability3);
				responseInfo.put("ch1", match.cutsceneActors1[0]);
				responseInfo.put("ch2", match.cutsceneActors1[1]);
				responseInfo.put("ch3", match.cutsceneActors1[2]);
				responseInfo.put("ch4", match.cutsceneActors2[0]);
				responseInfo.put("ch5", match.cutsceneActors2[1]);
				responseInfo.put("ch6", match.cutsceneActors2[2]);
				responseInfo.put("ch7", match.cutsceneActors3[0]);
				responseInfo.put("ch8", match.cutsceneActors3[1]);
				responseInfo.put("ch9", match.cutsceneActors3[2]);
				responseInfo.put("rQ1", match.questions[0]);
				responseInfo.put("rQ2", match.questions[1]);
				responseInfo.put("rQ3", match.questions[2]);
				responseInfo.put("cT1", match.correctTombstone[0]);
				responseInfo.put("cT2", match.correctTombstone[1]);
				responseInfo.put("cT3", match.correctTombstone[2]);
				//System.out.println("Mensaje enviado: " + responseInfo.toString());
				oponent.sendMessage(new TextMessage(responseInfo.toString()));
				System.out.println("Message sent: " + responseInfo.toString());
				match.ReadyPlayer();
				System.out.println("Listos = " + match.playersReady);
				if (match.AreReady()) {
					ObjectNode responseReady = mapper.createObjectNode();
					responseReady.put("code", 4);
					match.player1.sendMessage(new TextMessage(responseReady.toString()));
					match.player2.sendMessage(new TextMessage(responseReady.toString()));
					match.ResetReady();
				}
				break;
			}
			
			// Gameplay
			case "2": 
			{
				String x = node.get("x").asText();
				String y = node.get("y").asText();
				String ax = node.get("ax").asText();
				String ay = node.get("ay").asText();
				String r = node.get("rotation").asText();
				String hability = node.get("hability").asText();
				String matchIndex = node.get("match").asText();
				
				Match match = matches.get(Integer.valueOf(matchIndex));
				WebSocketSession oponent;
								
				if (match.player1.getId() == session.getId()) 
					oponent = match.player2; 
				else 
					oponent = match.player1;
				
				// Envia las posiciones,la aceleracion, la rotacion, si se ha pulsado alguna
				// habilidad y el tiempo
				int elapsedTime = 20 - (int)((System.currentTimeMillis() - match.GetStartTime())/1000);
				//System.out.println(" now= " + System.currentTimeMillis() + " start=" + match.GetStartTime() + " elapsedTime = " + elapsedTime);
				String elapsedTimeString = String.valueOf(elapsedTime);
				if (match.isMatchActive && elapsedTime <= 0) {	// Caso se acabó el tiempo
					if (!match.AreReady()) {
						ObjectNode responseNode = mapper.createObjectNode();
						responseNode.put("code", 6);
						session.sendMessage(new TextMessage(responseNode.toString()));
						oponent.sendMessage(new TextMessage(responseNode.toString()));
						match.ReadyPlayer();
						match.ReadyPlayer();
						match.ResetReady();
						match.isMatchActive = false;
					}
				} else {	// Caso normal
					ObjectNode responseNode = mapper.createObjectNode();
					responseNode.put("code", 2);
					responseNode.put("x", x);
					responseNode.put("y", y);
					responseNode.put("ax", ax);
					responseNode.put("ay", ay);
					responseNode.put("rotation", r);
					responseNode.put("hability", hability);
					responseNode.put("time", elapsedTimeString);
					//System.out.println("Mensaje enviado: " + responseNode.toString());
					oponent.sendMessage(new TextMessage(responseNode.toString()));	
				}
				//System.out.println("tiempo: " + elapsedTimeString);
				break;
			}
			
			// Comienzo de ronda
			case "3": 
			{
				Match currentMatch = matches.get(Integer.valueOf(node.get("match").asText()));
				semRound.acquire();
				currentMatch.ReadyPlayer();
				System.out.println("Ready?" + currentMatch.playersReady);
				if (currentMatch.AreReady()) {
					currentMatch.StartMatch();
					System.out.println(currentMatch.GetStartTime());
					ObjectNode startRound = mapper.createObjectNode();
					startRound.put("code", 3);
					currentMatch.player1.sendMessage(new TextMessage(startRound.toString()));
					currentMatch.player2.sendMessage(new TextMessage(startRound.toString()));
					System.out.println("Mensaje enviado: " + startRound.toString());
					currentMatch.StartMatch();
					currentMatch.ResetReady();
					currentMatch.isMatchActive = true;
				}
				semRound.release();
				break;
			}
			case "10":	//ping
			{
				ObjectNode pingMessage = mapper.createObjectNode();
				pingMessage.put("code", 10);
				session.sendMessage(new TextMessage(pingMessage.toString()));
				break;				
			}
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		users.remove(session.getId());
		
		WebSocketSession enemigo = null;
		ObjectNode responseNode = mapper.createObjectNode();
		responseNode.put("code", 5);
		int i = 0;
		boolean encontrado = false;
		while (!encontrado && i < matches.size())
		{
			if(matches.get(i).player1 == session)
			{
				enemigo = matches.get(i).player2;
				matches.remove(i);
				encontrado = true;
				matches.add(new Match());
				matchesIndex--;
			}
			else if(matches.get(i).player2 == session)
			{
				enemigo = matches.get(i).player1;
				matches.remove(i);
				encontrado = true;
				matches.add(new Match());
				matchesIndex--;
			}
			i++;
		}
		if (enemigo != null) {
			enemigo.sendMessage(new TextMessage(responseNode.toString()));			
		}
	}

}
