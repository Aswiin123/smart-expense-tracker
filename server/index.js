const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// In–memory data store (starts EMPTY)
let expenses = [];

// Helper to calculate total
function calculateTotal(expensesList) {
  return expensesList.reduce((sum, exp) => sum + exp.amount, 0);
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Expense Tracker backend is running" });
});

// Get all expenses
app.get("/api/expenses", (req, res) => {
  const totalAmount = calculateTotal(expenses);
  res.json({
    totalAmount,
    count: expenses.length,
    expenses,
  });
});

// Add a new expense
app.post("/api/expenses", (req, res) => {
  const { description, category, amount, date } = req.body;

  if (!description || !category || !amount || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newExpense = {
    id: Date.now(),
    description,
    category,
    amount: Number(amount),
    date,
  };

  expenses.push(newExpense);

  const totalAmount = calculateTotal(expenses);

  res.status(201).json({
    message: "Expense added successfully",
    totalAmount,
    expenses,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
