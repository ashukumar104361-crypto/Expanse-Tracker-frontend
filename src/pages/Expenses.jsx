import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import Loading from '../components/Loading';
import { PlusCircle, ReceiptText, X } from 'lucide-react';

export const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    timeframe: '',
    category_id: '',
    is_necessary: '',
    sortBy: 'newest'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [expList, catList] = await Promise.all([
        expenseService.getExpenses(filters),
        expenseService.getCategories()
      ]);
      setExpenses(expList);
      setCategories(catList);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadData();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) {
      return;
    }
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await expenseService.updateExpense(editingExpense.id, formData);
      if (res.success) {
        setExpenses((prev) =>
          prev.map((e) => (e.id === editingExpense.id ? res.data.expense : e))
        );
        setEditingExpense(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expenses-page">
      <div className="page-header-row">
        <div>
          <span className="badge-pill-teen">
            <ReceiptText size={14} /> Full History
          </span>
          <h1 className="page-heading">All Expenses</h1>
          <p className="page-subheading">
            Review, filter, search, and manage every purchase you have logged.
          </p>
        </div>
        <Link to="/add-expense" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>+ Add Expense</span>
        </Link>
      </div>

      {loading && !expenses.length ? (
        <Loading text="Loading your expense ledger..." />
      ) : (
        <ExpenseTable
          expenses={expenses}
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onEdit={(exp) => setEditingExpense(exp)}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Expense Record</h3>
              <button
                onClick={() => setEditingExpense(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <ExpenseForm
                initialData={editingExpense}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingExpense(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
