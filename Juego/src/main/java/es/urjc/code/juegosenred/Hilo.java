package es.urjc.code.juegosenred;

public class Hilo extends Thread 
{
	private int tiempo = 1500000;
	
	public void run()
	{
		tiempo--;
	}
	
	public int getTiempo()
	{
		return tiempo;
	}
}
