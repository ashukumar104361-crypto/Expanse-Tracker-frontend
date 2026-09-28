import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';
import { PlusCircle } from 'lucide-react';

export const AddExpense = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await expenseService.createExpense(formData);
      navigate('/expenses');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add expense. Please check your fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-expense-page">
      <div className="page-header-simple">
        <span className="badge-pill-teen">
          <PlusCircle size={14} /> Quick Entry
        </span>
        <h1 className="page-heading">Add an Expense</h1>
        <p className="page-subheading">
          Keep your records updated so your monthly charts and smart suggestions stay accurate!
        </p>
      </div>

      <div className="form-center-container">
        <ExpenseForm
          onSubmit={handleCreate}
          onCancel={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddExpense;
