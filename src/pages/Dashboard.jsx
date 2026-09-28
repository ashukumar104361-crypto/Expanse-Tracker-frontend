import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import { formatCurrency } from '../utils/formatCurrency';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ExpenseCard from '../components/ExpenseCard';
import ChartCard from '../components/ChartCard';
import {
  CreditCard,
  Calendar,
  PiggyBank,
  TrendingDown,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Award,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const CHART_COLORS = [
  '#6366f1',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
  '#84cc16',
  '#64748b'
];

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, catRes, monthRes, suggRes] = await Promise.all([
        expenseService.getDashboardSummary(),
        expenseService.getCategorySummary(),
        expenseService.getMonthlySummary(),
        expenseService.getSuggestions()
      ]);

      setSummary(sumRes);
      setCategoryData(catRes?.categories || []);
      setMonthlyTrend(monthRes?.weekly || []);
      setSuggestions(suggRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading text="Loading your financial dashboard..." />;
  }

  const budgetProgress = Math.min(100, Math.max(0, summary?.budgetUsedPercent || 0));

  return (
    <div className="dashboard-page">
      {/* Top Welcome Banner */}
      <div className="dashboard-header-banner">
        <div>
          <span className="badge-pill-teen">
            <Zap size={14} className="text-amber" /> Real-time Finances
          </span>
          <h1 className="page-heading">Your Money Dashboard</h1>
          <p className="page-subheading">
            Here's where your money is going this month and how close you are to your budget!
          </p>
        </div>
        <div className="header-actions">
          <Link to="/add-expense" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>+ Add Expense</span>
          </Link>
        </div>
      </div>

      {/* 4 Main Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card card-neon-purple">
          <div className="metric-header">
            <span className="metric-title">This Month's Spending</span>
            <div className="metric-icon-box">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{formatCurrency(summary?.totalThisMonth || 0)}</span>
          </div>
          <p className="metric-footer-text">
            {summary?.expenseCount || 0} total purchases recorded
          </p>
        </div>

        <div className="metric-card card-neon-cyan">
          <div className="metric-header">
            <span className="metric-title">Today's Spending</span>
            <div className="metric-icon-box">
              <Calendar size={20} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{formatCurrency(summary?.todaySpent || 0)}</span>
          </div>
          <p className="metric-footer-text">Recorded for today</p>
        </div>

        <div className="metric-card card-neon-emerald">
          <div className="metric-header">
            <span className="metric-title">Remaining Budget</span>
            <div className="metric-icon-box">
              <PiggyBank size={20} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{formatCurrency(summary?.remainingBudget || 0)}</span>
          </div>
          <p className="metric-footer-text">
            Monthly Target: {formatCurrency(summary?.monthlyBudget || 0)}
          </p>
        </div>

        <div className="metric-card card-neon-amber">
          <div className="metric-header">
            <span className="metric-title">Largest Expense</span>
            <div className="metric-icon-box">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">
              {summary?.largestExpense
                ? formatCurrency(summary.largestExpense.amount)
                : '₹0'}
            </span>
          </div>
          <p className="metric-footer-text text-truncate">
            {summary?.largestExpense?.title || 'No expenses yet'}
          </p>
        </div>
      </div>

      {/* Budget Health Progress Bar */}
      {summary?.monthlyBudget > 0 && (
        <div className="budget-progress-banner">
          <div className="progress-banner-header">
            <div>
              <h4 className="banner-title">Monthly Budget Progress</h4>
              <p className="banner-desc">
                You have used <strong>{summary.budgetUsedPercent}%</strong> of your{' '}
                {formatCurrency(summary.monthlyBudget)} budget.
              </p>
            </div>
            <span className={`status-pill status-${summary.budgetStatus}`}>
              {summary.budgetStatus === 'over_budget'
                ? 'Over Budget'
                : summary.budgetStatus === 'near_limit'
                ? 'Near Limit'
                : summary.budgetStatus === 'warning'
                ? 'Approaching Limit'
                : 'Healthy Budget'}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill fill-${summary.budgetStatus}`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Financial Health Score & Smart Suggestion Preview */}
      {suggestions && (
        <div className="advisor-preview-card">
          <div className="advisor-preview-left">
            <div className="badge-avatar">
              <Award size={28} className="text-primary" />
            </div>
            <div>
              <span className="advisor-tag">Spending Awareness</span>
              <h3 className="advisor-title">{suggestions.badge}</h3>
              <p className="advisor-desc">{suggestions.summary}</p>
            </div>
          </div>
          <div className="advisor-preview-right">
            <div className="score-circle-display">
              <span className="score-digit">{suggestions.healthScore}</span>
              <span className="score-denom">/100</span>
            </div>
            <Link to="/suggestions" className="btn btn-outline btn-sm">
              <span>View All Tips</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-2col-grid">
        {/* Category Donut Chart */}
        <ChartCard
          title="Where Your Money Goes"
          subtitle="Category breakdown of your monthly spending"
          action={
            <Link to="/reports" className="chart-action-link">
              Detailed Reports →
            </Link>
          }
        >
          {categoryData.length === 0 ? (
            <div className="chart-empty-state">No category spending recorded yet.</div>
          ) : (
            <div className="donut-chart-flex">
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatCurrency(val), 'Spent']}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-legend-grid">
                {categoryData.slice(0, 6).map((c, i) => (
                  <div key={c.id} className="legend-item">
                    <span
                      className="legend-color-dot"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="legend-label">{c.name}:</span>
                    <span className="legend-val">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* Weekly Spending Trend */}
        <ChartCard
          title="Weekly Spending Pace"
          subtitle="Cumulative expenses across weeks of this month"
          action={
            <Link to="/reports" className="chart-action-link">
              Weekly Trends →
            </Link>
          }
        >
          {monthlyTrend.length === 0 ? (
            <div className="chart-empty-state">No weekly spending data yet.</div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Spent']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent Transactions List */}
      <div className="dashboard-recent-section">
        <div className="section-header-flex">
          <div>
            <h3 className="section-title">Recent Spending</h3>
            <p className="section-subtitle">Your latest logged purchases</p>
          </div>
          <Link to="/expenses" className="btn btn-outline btn-sm">
            <span>View All Expenses</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {summary?.recentExpenses?.length === 0 ? (
          <EmptyState
            title="No expenses logged yet"
            description="Log your bus ticket, snack, or movie to start seeing your spending habits."
            actionText="+ Add First Expense"
            actionLink="/add-expense"
          />
        ) : (
          <div className="recent-cards-list">
            {summary?.recentExpenses?.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
