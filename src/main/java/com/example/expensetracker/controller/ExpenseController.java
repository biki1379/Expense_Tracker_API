package com.example.expensetracker.controller;

import com.example.expensetracker.dto.ExpenseCreateRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // CREATE expense
    @PostMapping
    public ExpenseResponse addExpense(@RequestBody ExpenseCreateRequest request) {
        return expenseService.addExpense(request);
    }

    // GET all expenses by user
    @GetMapping("/user/{userId}")
    public List<ExpenseResponse> getExpensesByUser(@PathVariable Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    // GET single expense by id
    @GetMapping("/{expenseId}")
    public ExpenseResponse getExpenseById(@PathVariable Long expenseId) {
        return expenseService.getExpenseById(expenseId);
    }

    // UPDATE expense
    @PutMapping("/{expenseId}")
    public ExpenseResponse updateExpense(
            @PathVariable Long expenseId,
            @RequestBody ExpenseCreateRequest request) {
        return expenseService.updateExpense(expenseId, request);
    }

    // DELETE expense
    @DeleteMapping("/{expenseId}")
    public void deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
    }
}
