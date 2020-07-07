package es.urjc.code.juegosenred;

import java.util.Date;

public class User {

	private long id;
	private String name;
	private String pass;
	private int score;
	private Date lastOnline;

	public User() {
<<<<<<< HEAD
		this.id = -1;
		this.name = "";
		this.pass = "";
		this.score = 0;
		this.lastOnline = new Date();
=======
>>>>>>> developing
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String getPass() {
		return pass;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public int getScore() {
		return score;
	}
<<<<<<< HEAD
	
=======

>>>>>>> developing
	public Date getLastOnline() {
		return lastOnline;
	}

	public void setLastOnline(Date lastOnline) {
		this.lastOnline = lastOnline;
	}
<<<<<<< HEAD
	
	public String toString() {
		//return "User [id:" + id + ", name:" + name + ", score:" + score + ", date:" + online + "]";
=======

	public String toString() {
		// return "User [id:" + id + ", name:" + name + ", score:" + score + ", date:" +
		// online + "]";
>>>>>>> developing
		return name;
	}
}
