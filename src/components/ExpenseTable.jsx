import React from 'react';
import ExpenseCard from './ExpenseCard';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { Search, Filter, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';

export const ExpenseTable = ({
  expenses = [],
  categories = [],
  filters,
  onFilterChange,
  onEdit,
  onDelete
}) => {
  return (
    <div className="expense-table-container">
      {/* Search and Filters Control Bar */}
      <div className="table-controls-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search expenses by title or note..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-select-group">
            <span className="filter-label"><Filter size={14} /> Time:</span>
            <select
              className="filter-select"
              value={filters.timeframe || ''}
              onChange={(e) => onFilterChange('timeframe', e.target.value)}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">Category:</span>
            <select
              className="filter-select"
              value={filters.category_id || ''}
              onChange={(e) => onFilterChange('category_id', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">Type:</span>
            <select
              className="filter-select"
              value={filters.is_necessary !== undefined ? filters.is_necessary : ''}
              onChange={(e) => onFilterChange('is_necessary', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="true">Essential Needs</option>
              <option value="false">Fun / Wants</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label"><ArrowUpDown size={14} /> Sort:</span>
            <select
              className="filter-select"
              value={filters.sortBy || 'newest'}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense List or Table */}
      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Try clearing your filters or adding a new expense record."
          actionText="+ Add Expense"
          actionLink="/add-expense"
        />
      ) : (
        <div className="expense-desktop-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="table-row-hover">
                  <td>
                    <div className="table-title-cell">
                      <span className="table-item-title">{expense.title}</span>
                      {expense.description && (
                        <span className="table-item-desc">{expense.description}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="table-badge cat-badge">
                      {expense.categories?.name || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className="table-date-text">{formatDate(expense.expense_date)}</span>
                  </td>
                  <td>
                    <span className="table-badge payment-badge-sm">
                      {expense.payment_method}
                    </span>
                  </td>
                  <td>
                    <span className={`necessity-pill ${expense.is_necessary ? 'need' : 'want'}`}>
                      {expense.is_necessary ? 'Need' : 'Want'}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="table-amount-cell">
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="table-actions-cell">
                      <button
                        onClick={() => onEdit(expense)}
                        className="table-action-btn edit"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="table-action-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards Fallback */}
          <div className="expense-mobile-list">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
