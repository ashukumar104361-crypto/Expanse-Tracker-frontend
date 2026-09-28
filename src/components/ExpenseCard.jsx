import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import {
  Utensils,
  Bus,
  ShoppingBag,
  Film,
  BookOpen,
  Receipt,
  HeartPulse,
  Gamepad2,
  Tv,
  CircleDollarSign,
  Tag,
  Trash2,
  Edit2
} from 'lucide-react';

const categoryIcons = {
  Utensils,
  Bus,
  ShoppingBag,
  Film,
  BookOpen,
  Receipt,
  HeartPulse,
  Gamepad2,
  Tv,
  CircleDollarSign,
  Tag
};

export const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const iconKey = expense.categories?.icon || 'Tag';
  const IconComponent = categoryIcons[iconKey] || Tag;

  return (
    <div className="expense-card">
      <div className="expense-card-left">
        <div className={`category-icon-box cat-${expense.category_id || 'other'}`}>
          <IconComponent size={20} />
        </div>
        <div className="expense-info">
          <h4 className="expense-title">{expense.title}</h4>
          <div className="expense-meta-row">
            <span className="expense-category-tag">
              {expense.categories?.name || 'General'}
            </span>
            <span className="meta-dot">•</span>
            <span className="expense-date-label">{formatDate(expense.expense_date)}</span>
            <span className="meta-dot">•</span>
            <span className="payment-badge">{expense.payment_method}</span>
          </div>
          {expense.description && (
            <p className="expense-desc-text">{expense.description}</p>
          )}
        </div>
      </div>

      <div className="expense-card-right">
        <div className="expense-amount-group">
          <span className="expense-amount">{formatCurrency(expense.amount)}</span>
          <span className={`necessity-badge ${expense.is_necessary ? 'need' : 'want'}`}>
            {expense.is_necessary ? 'Essential Need' : 'Fun / Want'}
          </span>
        </div>

        <div className="expense-actions">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="action-btn edit-btn"
              title="Edit Expense"
              aria-label="Edit Expense"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="action-btn delete-btn"
              title="Delete Expense"
              aria-label="Delete Expense"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
