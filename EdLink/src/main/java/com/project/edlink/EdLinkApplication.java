package com.project.edlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EdLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(EdLinkApplication.class, args);
        System.out.println("Your backend is running on port 8090");
	}

}
