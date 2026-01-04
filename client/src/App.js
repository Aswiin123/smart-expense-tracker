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

  // Load existing expenses
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

  // Add expense
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

      setDescription("");
      setAmount("");
      setDate("");
      setCategory("Food");
    } catch (err) {
      console.error("Error adding expense", err);
      alert("Failed to add expense");
    }
  };

  // ✅ DELETE expense
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/expenses/${id}`
      );

      setExpenses(res.data.expenses || []);
      setTotalAmount(res.data.totalAmount || 0);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete expense");
    }
  };

  // Format date
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
          <span className="status-pill">● Live demo</span>
        </header>

        {/* SUMMARY */}
        <section className="summary-card">
          <p className="summary-label">Total spent</p>
          <p className="summary-amount">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </section>

        {/* ADD EXPENSE */}
        <section className="add-expense-card">
          <h2>Add a new expense</h2>

          <form className="expense-form" onSubmit={handleAddExpense}>
            <label>
              Description
              <input
                type="text"
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
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Amount
              <input
                type="number"
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

            <button type="submit" className="primary-btn">
              + Add expense
            </button>
          </form>
        </section>

        {/* TABLE */}
        <section className="table-section">
          {loading ? (
            <p>Loading…</p>
          ) : expenses.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td>{exp.category}</td>
                    <td>₹{exp.amount.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        style={{ color: "red" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
