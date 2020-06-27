package es.urjc.code.juegosenred;

import java.util.Random;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebsocketEchoHandler extends TextWebSocketHandler {
	private ObjectMapper mapper = new ObjectMapper();
	BlockingQueue<WebSocketSession> matchmaking = new ArrayBlockingQueue<>(100); // Los jugadores que estan buscando se emparejan por orden de llegada
	ConcurrentHashMap<String, WebSocketSession> users = new ConcurrentHashMap<String, WebSocketSession>();
	
	int num = 0;
	Random rand = new Random();
	int[] r1 = new int[9];
	int[] r2 = new int[3];
	int[] r3 = new int[3];

	Hilo h = new Hilo();

	public void setNum(int h) {
		num = h;
	}

	public int getNum() {
		return num;
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message recibido: " + message.getPayload());
		// Leemos mensaje
		JsonNode node = mapper.readTree(message.getPayload());
		String code = node.get("code").asText();

		// El codigo marca de que va el mensaje
		switch (code) {
		// Buscar Partida
		case "0": {
			matchmaking.add(session);
			users.put(session.getId(), session);

			if (matchmaking.size() > 1) {
				// Al jugador a se le envia el id de la session de b y al b la de a
				WebSocketSession a = matchmaking.poll();
				WebSocketSession b = matchmaking.poll();

				for (int i = 0; i < 9; i++) {
					r1[i] = rand.nextInt(5);
				}
				for (int i = 0; i < 3; i++) {
					r2[i] = rand.nextInt(3);
				}
				for (int i = 0; i < 3; i++) {
					r3[i] = rand.nextInt(3);
				}

				System.out.println(a.getId());
				System.out.println(b.getId());

				ObjectNode responseNode1 = mapper.createObjectNode();
				responseNode1.put("code", 0);
				responseNode1.put("player", 2);
				responseNode1.put("session", a.getId());// Se le envia la id del otro para saber donde enviar
														// informacion
				System.out.println("Mensaje enviado: " + responseNode1.toString());
				b.sendMessage(new TextMessage(responseNode1.toString()));

				ObjectNode responseNode2 = mapper.createObjectNode();
				responseNode2.put("code", 0);
				responseNode2.put("player", 1);
				responseNode2.put("session", b.getId());// Se le envia la id del otro para saber donde enviar
														// informacion
				System.out.println("Mensaje enviado: " + responseNode2.toString());
				a.sendMessage(new TextMessage(responseNode2.toString()));
			}
			break;
		}
		// Eleccion de personajes y de habilidades
		case "1": {
			this.setNum(this.getNum() + 1);
			// Se elijen los personajes
			String p = node.get("p").asText();
			String h1 = node.get("h1").asText();
			String h2 = node.get("h2").asText();
			String h3 = node.get("h3").asText();
			String enemigo = node.get("sess").asText();

			// Respuesta
			ObjectNode responseNode = mapper.createObjectNode();
			responseNode.put("code", 1);
			responseNode.put("p", p);
			responseNode.put("h1", h1);
			responseNode.put("h2", h2);
			responseNode.put("h3", h3);
			responseNode.put("ch1", r1[0]);
			responseNode.put("ch2", r1[1]);
			responseNode.put("ch3", r1[2]);
			responseNode.put("ch4", r1[3]);
			responseNode.put("ch5", r1[4]);
			responseNode.put("ch6", r1[5]);
			responseNode.put("ch7", r1[6]);
			responseNode.put("ch8", r1[7]);
			responseNode.put("ch9", r1[8]);
			responseNode.put("rQ1", r2[0]);
			responseNode.put("rQ2", r2[1]);
			responseNode.put("rQ3", r2[2]);
			responseNode.put("cT1", r3[0]);
			responseNode.put("cT2", r3[1]);
			responseNode.put("cT3", r3[2]);
			System.out.println("Mensaje enviado: " + responseNode.toString());
			users.get(enemigo).sendMessage(new TextMessage(responseNode.toString()));

			if (num > 1) {
				ObjectNode responseNode1 = mapper.createObjectNode();
				responseNode1.put("code", 4);
				users.get(enemigo).sendMessage(new TextMessage(responseNode1.toString()));
				session.sendMessage(new TextMessage(responseNode1.toString()));
				h.start();
			}
			break;
		}
		// Gameplay
		case "2": {
			String x = node.get("x").asText();
			String y = node.get("y").asText();
			String ax = node.get("ax").asText();
			String ay = node.get("ay").asText();
			String r = node.get("rotation").asText();
			String hability = node.get("hability").asText();
			String enemigo = node.get("sess").asText();
			// Envia las posiciones,la aceleracion, la rotacion, si se ha pulsado alguna
			// habilidad
			ObjectNode responseNode = mapper.createObjectNode();
			responseNode.put("code", 2);
			responseNode.put("t", h.getTiempo());
			responseNode.put("x", x);
			responseNode.put("y", y);
			responseNode.put("ax", ax);
			responseNode.put("ay", ay);
			responseNode.put("rotation", r);
			responseNode.put("hability", hability);
			System.out.println("Mensaje enviado: " + responseNode.toString());
			users.get(enemigo).sendMessage(new TextMessage(responseNode.toString()));
			break;
		}
		// Final partida
		case "3": {
			String enemigo = node.get("session").asText();
			ObjectNode responseNode = mapper.createObjectNode();
			responseNode.put("code", 3);
			System.out.println("Mensaje enviado: " + responseNode.toString());
			users.get(enemigo).sendMessage(new TextMessage(responseNode.toString()));
			break;
		}
		}
	}
}
