package com.example.expensetracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class healthontroller {

    @GetMapping("/health")
    public String health() {
        return "Expense Tracker API is running";
    }
}
