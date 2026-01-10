# Expense_Tracker_API
Spring Boot Expense Tracker REST API
A Spring Boot REST API for managing users and tracking daily expenses.
Built with clean architecture principles, DTO separation, validation, and proper error handling.

# Features
User registration
Create, read, update, delete, expenses
Get expenses by user
Input validation and business rules
Global exception handling
REST-compliant API design

# Tech Stack
Java 17
Spring Boot
Spring Data JPA
Hibernate
Maven
H2 / MySQL (configurable)
Postman (API testing)

# Project Structure
src/main/java/com/example/expensetracker
 ├── controller
 ├── service
 ├── repository
 ├── entity
 ├── dto
 └── exception

 # API Endpoints

User APIs
POST /api/users/register – Register a new user

Expense APIs
POST /api/expenses – Create expense
GET /api/expenses/{expenseId} – Get expense by ID
GET /api/expenses/user/{userId} – Get all expenses of a user
PUT /api/expenses/{expenseId} – Update expense
DELETE /api/expenses/{expenseId} – Delete expense

# Business Rules
Expense date cannot be in the future
Expense must belong to a valid user
Category is restricted to predefined values
Invalid input returns proper HTTP error codes

# How to Run Locally
Clone the repository
Open the project in an IDE
Ensure Java 17 is installed
Run the Spring Boot application
Test APIs using Postman

# Learning Outcome
Hands-on experience with Spring Boot REST APIs
Proper layered architecture (Controller → Service → Repository)
DTO usage to protect entity exposure
Exception handling and validation
Real-world backend project workflow

# Author
Biki Saha
Aspiring Backend / Cloud Engineer
