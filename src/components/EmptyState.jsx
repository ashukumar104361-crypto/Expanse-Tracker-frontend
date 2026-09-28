import React from 'react';
import { Link } from 'react-router-dom';
import { PiggyBank, PlusCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PiggyBank,
  title = 'No expenses yet',
  description = 'Start tracking your spending by adding your first expense.',
  actionText = '+ Add Expense',
  actionLink = '/add-expense',
  onAction
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-icon-circle">
        <Icon size={44} className="empty-icon" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {onAction ? (
        <button onClick={onAction} className="btn btn-primary">
          <PlusCircle size={18} />
          {actionText}
        </button>
      ) : actionLink ? (
        <Link to={actionLink} className="btn btn-primary">
          <PlusCircle size={18} />
          {actionText}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
