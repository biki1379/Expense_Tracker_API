package com.example.expensetracker.controller;

import com.example.expensetracker.dto.UserRegisterRequest;
import com.example.expensetracker.dto.UserResponse;
import com.example.expensetracker.service.UserService;

import jakarta.validation.Valid;



import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(@Valid @RequestBody UserRegisterRequest request) {
        return userService.registerUser(request);
    }
}
