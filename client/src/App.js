import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Load existing expenses from backend
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(res.data.expenses || []);
      setTotalAmount(res.data.totalAmount || 0);
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!description || !amount || !date || !category) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/expenses", {
        description,
        category,
        amount: Number(amount),
        date,
      });

      setExpenses(res.data.expenses || []);
      setTotalAmount(res.data.totalAmount || 0);

      // Clear the form
      setDescription("");
      setAmount("");
      setDate("");
      setCategory("Food");
    } catch (err) {
      console.error("Error adding expense", err);
      alert("Failed to add expense. Please try again.");
    }
  };

  // Format date nicely
  const formatDate = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app-shell">
      <div className="app-card">
        {/* HEADER */}
        <header className="app-header">
          <div>
            <h1 className="app-title">Smart Expense Tracker</h1>
            <p className="app-subtitle">
              Track your daily spends and stay in control of your money.
            </p>
          </div>
          <span className="status-pill">
            ● Live demo &nbsp;|&nbsp; Localhost 5000
          </span>
        </header>

        {/* SUMMARY */}
        <section className="summary-card">
          <p className="summary-label">Total spent this session</p>
          <p className="summary-amount">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="summary-note">
            {expenses.length === 0
              ? "No expenses added yet. Start by logging your first spend below."
              : `You have logged ${expenses.length} expense${
                  expenses.length > 1 ? "s" : ""
                } so far.`}
          </p>
        </section>

        {/* ADD EXPENSE FORM */}
        <section className="add-expense-card">
          <h2 className="add-expense-title">Add a new expense</h2>
          <p className="add-expense-sub">
            Enter what you spent, choose a category, and we will keep it nicely
            organized for you.
          </p>

          <form className="expense-form" onSubmit={handleAddExpense}>
            <label>
              Description
              <input
                type="text"
                placeholder="Coffee at Cafe, Uber ride..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Amount (₹)
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            {/* Empty grid cell to align button nicely */}
            <div></div>
            <button type="submit" className="primary-btn">
              + Add expense
            </button>
          </form>
        </section>

        {/* TABLE */}
        <section className="table-section">
          <div className="table-header">
            <h2>Recent expenses</h2>
            <span className="badge">
              {expenses.length === 0
                ? "No entries yet"
                : `${expenses.length} item${expenses.length > 1 ? "s" : ""}`}
            </span>
          </div>

          {loading ? (
            <p className="empty-state">Loading your expenses…</p>
          ) : expenses.length === 0 ? (
            <p className="empty-state">
              Nothing to show yet. Add your first expense above.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="amount-col">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td>{exp.category}</td>
                    <td className="amount-col">
                      ₹
                      {exp.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="footer-note">
            Data is stored in memory on the backend (demo mode). Refreshing the
            page will reset the session.
          </p>
        </section>
      </div>
    </div>
  );
}

export default App;
