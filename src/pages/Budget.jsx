import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import BudgetCard from '../components/BudgetCard';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/formatCurrency';
import {
  PiggyBank,
  PlusCircle,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Budget = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [categoryBudget, setCategoryBudget] = useState({
    category_id: '',
    amount: ''
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const [bData, catList] = await Promise.all([
        expenseService.getBudgets(currentMonth, currentYear),
        expenseService.getCategories()
      ]);
      setBudgetData(bData);
      setCategories(catList);
      if (bData?.overallBudget?.budgetAmount) {
        setMonthlyAmount(bData.overallBudget.budgetAmount);
      }
      if (catList.length > 0 && !categoryBudget.category_id) {
        setCategoryBudget((prev) => ({ ...prev, category_id: catList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSaveOverallBudget = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const amt = parseFloat(monthlyAmount);
    if (isNaN(amt) || amt < 0) {
      setErrorMsg('Please enter a valid monthly budget amount.');
      return;
    }

    try {
      await expenseService.setBudget({
        category_id: null,
        amount: amt,
        month: currentMonth,
        year: currentYear
      });
      setSuccessMsg('Monthly spending budget updated successfully!');
      loadBudgets();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update monthly budget');
    }
  };

  const handleSaveCategoryBudget = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const amt = parseFloat(categoryBudget.amount);
    if (!categoryBudget.category_id) {
      setErrorMsg('Please select a category.');
      return;
    }
    if (isNaN(amt) || amt < 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    try {
      await expenseService.setBudget({
        category_id: parseInt(categoryBudget.category_id, 10),
        amount: amt,
        month: currentMonth,
        year: currentYear
      });
      setSuccessMsg('Category budget saved successfully!');
      setCategoryBudget((prev) => ({ ...prev, amount: '' }));
      loadBudgets();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to set category budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Remove this category budget?')) return;
    try {
      await expenseService.deleteBudget(id);
      loadBudgets();
    } catch (err) {
      alert('Failed to delete budget limit');
    }
  };

  if (loading) {
    return <Loading text="Loading your monthly budgets..." />;
  }

  const overall = budgetData?.overallBudget;

  return (
    <div className="budget-page">
      <div className="page-header-row">
        <div>
          <span className="badge-pill-teen">
            <PiggyBank size={14} /> Smart Limits
          </span>
          <h1 className="page-heading">Monthly Budget Planner</h1>
          <p className="page-subheading">
            Set overall targets and category limits to stop overspending before it happens!
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-box alert-danger">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Overall Monthly Budget Card */}
      <div className="budget-section-block">
        <h3 className="section-title">Overall Monthly Limit</h3>
        {overall?.budgetAmount > 0 ? (
          <BudgetCard
            title={`Total Monthly Spend Limit (${now.toLocaleString('default', { month: 'long' })})`}
            budgetAmount={overall.budgetAmount}
            spentAmount={overall.totalSpent}
            remainingAmount={overall.remainingAmount}
            percentUsed={overall.percentUsed}
            status={overall.status}
            icon={PiggyBank}
          />
        ) : (
          <div className="budget-empty-box">
            <p>You haven't set an overall monthly budget yet. Set one below!</p>
          </div>
        )}

        <form onSubmit={handleSaveOverallBudget} className="budget-set-form">
          <div className="form-row-flex">
            <div className="input-prefix-wrapper flex-grow">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                className="form-control with-prefix"
                placeholder="e.g. 7000"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>{overall?.budgetAmount ? 'Update Budget' : 'Set Budget'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Category Budgets */}
      <div className="budget-section-block">
        <div className="section-header-flex">
          <div>
            <h3 className="section-title">Category Spending Limits</h3>
            <p className="section-subtitle">
              Optional targets for Food, Gaming, Entertainment, Shopping, etc.
            </p>
          </div>
        </div>

        {/* Add Category Budget Form */}
        <form onSubmit={handleSaveCategoryBudget} className="category-budget-form">
          <div className="category-form-inputs">
            <div className="form-group flex-1">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={categoryBudget.category_id}
                onChange={(e) =>
                  setCategoryBudget((prev) => ({ ...prev, category_id: e.target.value }))
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Monthly Limit (₹)</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">₹</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  className="form-control with-prefix"
                  placeholder="e.g. 2000"
                  value={categoryBudget.amount}
                  onChange={(e) =>
                    setCategoryBudget((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group form-btn-align">
              <button type="submit" className="btn btn-primary btn-block">
                <PlusCircle size={18} />
                <span>Save Category Limit</span>
              </button>
            </div>
          </div>
        </form>

        {/* Category Budget Cards Grid */}
        <div className="category-budgets-grid">
          {budgetData?.categoryBudgets?.length === 0 ? (
            <div className="col-span-full">
              <p className="text-muted text-center py-4">
                No category limits defined yet. Add limits above to track specific buckets like Food or Entertainment.
              </p>
            </div>
          ) : (
            budgetData?.categoryBudgets?.map((catB) => (
              <BudgetCard
                key={catB.id}
                title={`${catB.category_name}`}
                budgetAmount={catB.budget_amount}
                spentAmount={catB.spent_amount}
                remainingAmount={catB.remaining_amount}
                percentUsed={catB.percent_used}
                status={catB.status}
                onDelete={() => handleDeleteBudget(catB.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;
