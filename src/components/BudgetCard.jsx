import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { AlertTriangle, CheckCircle, Flame, ShieldAlert, Trash2 } from 'lucide-react';

export const BudgetCard = ({
  title,
  budgetAmount,
  spentAmount,
  remainingAmount,
  percentUsed,
  status = 'normal',
  icon: Icon,
  onDelete
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'over_budget':
        return (
          <span className="budget-status-pill danger">
            <Flame size={14} /> Over Budget ({percentUsed}%)
          </span>
        );
      case 'near_limit':
        return (
          <span className="budget-status-pill warning-high">
            <ShieldAlert size={14} /> Near Limit ({percentUsed}%)
          </span>
        );
      case 'warning':
        return (
          <span className="budget-status-pill warning">
            <AlertTriangle size={14} /> Warning ({percentUsed}%)
          </span>
        );
      default:
        return (
          <span className="budget-status-pill success">
            <CheckCircle size={14} /> On Track ({percentUsed}%)
          </span>
        );
    }
  };

  const getProgressWidth = Math.min(100, Math.max(0, percentUsed));

  return (
    <div className={`budget-card-widget status-${status}`}>
      <div className="budget-card-header">
        <div className="budget-title-area">
          {Icon && (
            <div className="budget-icon-badge">
              <Icon size={18} />
            </div>
          )}
          <h4 className="budget-card-title">{title}</h4>
        </div>
        <div className="budget-header-actions">
          {getStatusBadge()}
          {onDelete && (
            <button
              onClick={onDelete}
              className="budget-delete-btn"
              title="Delete Category Budget"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="budget-numbers-row">
        <div className="budget-metric">
          <span className="metric-label">Spent</span>
          <span className="metric-val spent">{formatCurrency(spentAmount)}</span>
        </div>
        <div className="budget-metric text-center">
          <span className="metric-label">Budget</span>
          <span className="metric-val">{formatCurrency(budgetAmount)}</span>
        </div>
        <div className="budget-metric text-right">
          <span className="metric-label">Remaining</span>
          <span className="metric-val remaining">{formatCurrency(remainingAmount)}</span>
        </div>
      </div>

      <div className="budget-progress-track">
        <div
          className={`budget-progress-fill fill-${status}`}
          style={{ width: `${getProgressWidth}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetCard;
