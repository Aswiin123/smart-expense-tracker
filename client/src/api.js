import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchExpenses = () => {
  return axios.get(`${API_BASE}/expenses`);
};

export const createExpense = (expense) => {
  return axios.post(`${API_BASE}/expenses`, expense);
};
