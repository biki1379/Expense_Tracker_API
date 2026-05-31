package com.example.expensetracker.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    // Registration → /api/v1/auth/register
    // Login       → /api/v1/auth/login
}