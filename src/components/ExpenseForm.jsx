import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import { PlusCircle, Save, X, AlertCircle } from 'lucide-react';

export const ExpenseForm = ({ initialData = null, onSubmit, onCancel, isSubmitting = false }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    amount: initialData?.amount || '',
    category_id: initialData?.category_id || '',
    expense_date: initialData?.expense_date || new Date().toISOString().split('T')[0],
    payment_method: initialData?.payment_method || 'UPI',
    is_necessary: initialData?.is_necessary !== undefined ? initialData.is_necessary : true,
    description: initialData?.description || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await expenseService.getCategories();
        setCategories(list);
        if (!formData.category_id && list.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: list[0].id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please provide an expense title.');
      return;
    }
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }
    if (!formData.category_id) {
      setError('Please select an expense category.');
      return;
    }
    if (!formData.expense_date) {
      setError('Please select a valid date.');
      return;
    }

    onSubmit({
      ...formData,
      amount: amountNum,
      category_id: parseInt(formData.category_id, 10)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form-card">
      <div className="form-header">
        <h3 className="form-heading">
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </h3>
        <p className="form-subheading">
          Record your spending to keep your budget healthy and earn savings badges!
        </p>
      </div>

      {error && (
        <div className="alert-box alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="title">
            Expense Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            placeholder="e.g. Dominos Pizza, Metro Recharge, Valorant Skin"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="amount">
            Amount (₹) *
          </label>
          <div className="input-prefix-wrapper">
            <span className="input-prefix">₹</span>
            <input
              id="amount"
              name="amount"
              type="number"
              step="any"
              min="1"
              className="form-control with-prefix"
              placeholder="250"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category_id">
            Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            className="form-control"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense_date">
            Date *
          </label>
          <input
            id="expense_date"
            name="expense_date"
            type="date"
            className="form-control"
            value={formData.expense_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="payment_method">
            Payment Method
          </label>
          <select
            id="payment_method"
            name="payment_method"
            className="form-control"
            value={formData.payment_method}
            onChange={handleChange}
          >
            <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
            <option value="Cash">Cash</option>
            <option value="Card">Debit / Credit Card</option>
            <option value="Bank Transfer">Bank Transfer / Net Banking</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Spending Category (Need vs Want)</label>
          <div className="toggle-segmented">
            <button
              type="button"
              className={`segment-btn ${formData.is_necessary ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, is_necessary: true }))}
            >
              Essential Need (Books, Travel, Food)
            </button>
            <button
              type="button"
              className={`segment-btn ${!formData.is_necessary ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, is_necessary: false }))}
            >
              Fun / Impulse Want (Gaming, Snacks, Extra)
            </button>
          </div>
        </div>

        <div className="form-group col-span-2">
          <label className="form-label" htmlFor="description">
            Notes / Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows="2"
            className="form-control"
            placeholder="Add details, who you were with, or reasons..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            <X size={16} />
            <span>Cancel</span>
          </button>
        )}
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {initialData ? <Save size={18} /> : <PlusCircle size={18} />}
          <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}</span>
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
