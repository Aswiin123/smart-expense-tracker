const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ---------- FILE STORAGE SETUP ----------
const dataPath = path.join(__dirname, "expenses.json");

const readExpenses = () => {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
  }
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

const writeExpenses = (expenses) => {
  fs.writeFileSync(dataPath, JSON.stringify(expenses, null, 2));
};

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- LOAD DATA ON SERVER START ----------
let expenses = readExpenses();

// ---------- HELPER ----------
const calculateTotal = (list) =>
  list.reduce((sum, exp) => sum + exp.amount, 0);

// ---------- ROUTES ----------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Expense Tracker backend is running" });
});

// Get all expenses
app.get("/api/expenses", (req, res) => {
  res.json({
    totalAmount: calculateTotal(expenses),
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

  // ✅ SAVE TO FILE (IMPORTANT)
  writeExpenses(expenses);

  res.status(201).json({
    message: "Expense added successfully",
    totalAmount: calculateTotal(expenses),
    expenses,
  });
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
// Delete an expense by ID
app.delete("/api/expenses/:id", (req, res) => {
  const id = Number(req.params.id);

  const initialLength = expenses.length;
  expenses = expenses.filter(exp => exp.id !== id);

  if (expenses.length === initialLength) {
    return res.status(404).json({ error: "Expense not found" });
  }

  // ✅ save updated list to file
  writeExpenses(expenses);

  res.json({
    message: "Expense deleted successfully",
    totalAmount: calculateTotal(expenses),
    expenses,
  });
});
