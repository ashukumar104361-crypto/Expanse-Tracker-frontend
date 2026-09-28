import api from './api';

export const expenseService = {
  // Categories
  async getCategories() {
    const res = await api.get('/categories');
    return res.data?.data?.categories || [];
  },

  // Expenses CRUD
  async getExpenses(params = {}) {
    const res = await api.get('/expenses', { params });
    return res.data?.data?.expenses || [];
  },

  async getExpenseById(id) {
    const res = await api.get(`/expenses/${id}`);
    return res.data?.data?.expense;
  },

  async createExpense(expenseData) {
    const res = await api.post('/expenses', expenseData);
    return res.data;
  },

  async updateExpense(id, expenseData) {
    const res = await api.put(`/expenses/${id}`, expenseData);
    return res.data;
  },

  async deleteExpense(id) {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },

  // Dashboard & Charts
  async getDashboardSummary() {
    const res = await api.get('/dashboard/summary');
    return res.data?.data;
  },

  async getCategorySummary(month, year) {
    const res = await api.get('/dashboard/category-summary', { params: { month, year } });
    return res.data?.data;
  },

  async getMonthlySummary(month, year) {
    const res = await api.get('/dashboard/monthly-summary', { params: { month, year } });
    return res.data?.data;
  },

  // Budgets
  async getBudgets(month, year) {
    const res = await api.get('/budgets', { params: { month, year } });
    return res.data?.data;
  },

  async setBudget(budgetData) {
    const res = await api.post('/budgets', budgetData);
    return res.data;
  },

  async deleteBudget(id) {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },

  // Smart Suggestions
  async getSuggestions(month, year) {
    const res = await api.get('/suggestions', { params: { month, year } });
    return res.data?.data;
  }
};

export default expenseService;
