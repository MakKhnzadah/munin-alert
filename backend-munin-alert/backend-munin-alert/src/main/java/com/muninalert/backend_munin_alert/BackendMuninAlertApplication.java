package com.muninalert.backend_munin_alert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Munin Alert application.
 * 
 * This Spring Boot application provides a real-time safety and alert system with 
 * features including location tracking, emergency alerts, group management, 
 * and real-time messaging using WebSockets.
 * 
 * The application integrates MongoDB for data persistence and implements WebSocket
 * for real-time communication between users and groups.
 */
@SpringBootApplication
public class BackendMuninAlertApplication {

	/**
	 * The main method that bootstraps the Spring Boot application.
	 * 
	 * @param args Command line arguments passed to the application
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackendMuninAlertApplication.class, args);
	}

}
