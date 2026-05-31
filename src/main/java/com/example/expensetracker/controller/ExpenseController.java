package com.example.expensetracker.controller;

import com.example.expensetracker.dto.ExpenseCreateRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.service.ExpenseService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ExpenseResponse addExpense(@RequestBody ExpenseCreateRequest request,
                                      Authentication auth) {
        request.setUserId((Long) auth.getPrincipal());
        return expenseService.addExpense(request);
    }

    @GetMapping
    public List<ExpenseResponse> getMyExpenses(Authentication auth) {
        return expenseService.getExpensesByUser((Long) auth.getPrincipal());
    }

    @GetMapping("/{expenseId}")
    public ExpenseResponse getExpenseById(@PathVariable Long expenseId) {
        return expenseService.getExpenseById(expenseId);
    }

    @PutMapping("/{expenseId}")
    public ExpenseResponse updateExpense(@PathVariable Long expenseId,
                                         @RequestBody ExpenseCreateRequest request,
                                         Authentication auth) {
        request.setUserId((Long) auth.getPrincipal());
        return expenseService.updateExpense(expenseId, request);
    }

    @DeleteMapping("/{expenseId}")
    public void deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
    }
}