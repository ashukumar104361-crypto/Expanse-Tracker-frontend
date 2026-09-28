import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import { formatCurrency } from '../utils/formatCurrency';
import Loading from '../components/Loading';
import ChartCard from '../components/ChartCard';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  HeartHandshake,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
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

export const Reports = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const loadReports = async () => {
    try {
      setLoading(true);
      const [catRes, trendRes] = await Promise.all([
        expenseService.getCategorySummary(month, year),
        expenseService.getMonthlySummary(month, year)
      ]);
      setCategoryData(catRes);
      setMonthlyTrend(trendRes);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [month, year]);

  if (loading) {
    return <Loading text="Preparing your visual expense reports..." />;
  }

  const categories = categoryData?.categories || [];
  const totalSpent = categoryData?.totalSpent || 0;
  const necessarySpent = categoryData?.necessarySpent || 0;
  const unnecessarySpent = categoryData?.unnecessarySpent || 0;
  const necessaryPct = totalSpent > 0 ? Math.round((necessarySpent / totalSpent) * 100) : 0;
  const unnecessaryPct = totalSpent > 0 ? 100 - necessaryPct : 0;

  return (
    <div className="reports-page">
      <div className="page-header-row">
        <div>
          <span className="badge-pill-teen">
            <BarChart3 size={14} /> Visual Insights
          </span>
          <h1 className="page-heading">Spending Analytics & Reports</h1>
          <p className="page-subheading">
            Interactive charts to visualize where every rupee goes and detect spending patterns.
          </p>
        </div>

        {/* Month Selector */}
        <div className="date-selector-pill">
          <Calendar size={16} />
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="month-picker-select"
          >
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ].map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name} {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spending Split: Needs vs Wants */}
      <div className="needs-vs-wants-card">
        <div className="split-header">
          <div className="split-title-group">
            <HeartHandshake size={22} className="text-primary" />
            <h3 className="split-title">Essential Needs vs Fun & Wants</h3>
          </div>
          <span className="split-total-spent">Total Spent: {formatCurrency(totalSpent)}</span>
        </div>

        <div className="split-bars-wrapper">
          <div className="split-bar-track">
            <div className="split-bar-needs" style={{ width: `${necessaryPct}%` }} />
            <div className="split-bar-wants" style={{ width: `${unnecessaryPct}%` }} />
          </div>
        </div>

        <div className="split-legend-row">
          <div className="split-legend-item">
            <span className="legend-box needs" />
            <div>
              <span className="legend-label">Essential Needs:</span>
              <span className="legend-amount">{formatCurrency(necessarySpent)} ({necessaryPct}%)</span>
            </div>
          </div>
          <div className="split-legend-item">
            <span className="legend-box wants" />
            <div>
              <span className="legend-label">Fun / Wants:</span>
              <span className="legend-amount">{formatCurrency(unnecessarySpent)} ({unnecessaryPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-2col-grid">
        {/* 1. Category Pie Chart */}
        <ChartCard
          title="Category Distribution"
          subtitle="Proportion of spending across different categories"
        >
          {categories.length === 0 ? (
            <div className="chart-empty-state">No category spending recorded for this month.</div>
          ) : (
            <div className="donut-chart-flex">
              <div style={{ width: '100%', height: 270 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      innerRadius={55}
                      paddingAngle={4}
                    >
                      {categories.map((entry, index) => (
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
                {categories.map((c, i) => (
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

        {/* 2. Day of Week Bar Chart */}
        <ChartCard
          title="Day of Week Spending"
          subtitle="Which days you spend the most (Monday to Sunday)"
        >
          {monthlyTrend?.dayOfWeek?.length === 0 ? (
            <div className="chart-empty-state">No day-of-week data available.</div>
          ) : (
            <div style={{ width: '100%', height: 270 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend?.dayOfWeek || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Total']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="amount" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        {/* 3. Weekly Trend Line Chart */}
        <ChartCard
          title="Weekly Spending Pace"
          subtitle="Trend across weeks of the month"
        >
          {monthlyTrend?.weekly?.length === 0 ? (
            <div className="chart-empty-state">No weekly trend data available.</div>
          ) : (
            <div style={{ width: '100%', height: 270 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend?.weekly || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Weekly Spend']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        {/* 4. Top Spending Categories List */}
        <ChartCard
          title="Category Rankings"
          subtitle="Highest to lowest spending areas this month"
        >
          {categories.length === 0 ? (
            <div className="chart-empty-state">No categories to rank.</div>
          ) : (
            <div className="ranked-categories-list">
              {categories.map((c, idx) => {
                const pct = totalSpent > 0 ? Math.round((c.total / totalSpent) * 100) : 0;
                return (
                  <div key={c.id} className="ranked-cat-row">
                    <span className="rank-num">#{idx + 1}</span>
                    <div className="rank-info-bar">
                      <div className="rank-label-row">
                        <span className="rank-cat-name">{c.name}</span>
                        <span className="rank-cat-amt">
                          {formatCurrency(c.total)} ({pct}%)
                        </span>
                      </div>
                      <div className="rank-track">
                        <div
                          className="rank-fill"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: CHART_COLORS[idx % CHART_COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Reports;
