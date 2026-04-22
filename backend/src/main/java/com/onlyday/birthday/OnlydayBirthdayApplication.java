package com.onlyday.birthday;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class OnlydayBirthdayApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlydayBirthdayApplication.class, args);
    }
}
