import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import Loading from '../components/Loading';
import {
  Lightbulb,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Flame
} from 'lucide-react';

export const Suggestions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const res = await expenseService.getSuggestions();
        setData(res);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  if (loading) {
    return <Loading text="Analyzing your spending patterns..." />;
  }

  const getTipIcon = (type) => {
    switch (type) {
      case 'danger':
        return <Flame size={20} className="text-rose" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber" />;
      case 'success':
        return <CheckCircle size={20} className="text-emerald" />;
      default:
        return <Info size={20} className="text-sky" />;
    }
  };

  return (
    <div className="suggestions-page">
      <div className="page-header-row">
        <div>
          <span className="badge-pill-teen">
            <Lightbulb size={14} /> Smart Coach
          </span>
          <h1 className="page-heading">Ways to Spend Smarter</h1>
          <p className="page-subheading">
            Personalized tips based on your real spending habits to help you save more pocket money.
          </p>
        </div>
      </div>

      {/* Gamified Health Score Hero Card */}
      <div className="score-hero-card">
        <div className="score-hero-left">
          <div className="score-badge-circle">
            <Award size={40} className="text-amber" />
          </div>
          <div>
            <span className="score-eyebrow">YOUR CURRENT RANK</span>
            <h2 className="score-badge-name">{data?.badge || 'Smart Saver 🌟'}</h2>
            <p className="score-badge-desc">{data?.summary}</p>
          </div>
        </div>

        <div className="score-hero-right">
          <div className="score-meter-box">
            <span className="score-meter-num">{data?.healthScore || 70}</span>
            <span className="score-meter-label">/100 Points</span>
          </div>
          <p className="score-tip-small">
            Earn points by logging expenses consistently, staying under budget, and limiting impulse buys!
          </p>
        </div>
      </div>

      {/* Suggestion Cards List */}
      <div className="suggestions-list-section">
        <h3 className="section-title">Personalized Spending Feedback</h3>

        <div className="suggestions-cards-grid">
          {data?.suggestions?.map((item, index) => (
            <div key={index} className={`suggestion-card card-${item.type || 'info'}`}>
              <div className="suggestion-icon-col">
                <div className={`icon-bubble bubble-${item.type || 'info'}`}>
                  {getTipIcon(item.type)}
                </div>
              </div>
              <div className="suggestion-content-col">
                <div className="suggestion-header-row">
                  <h4 className="suggestion-card-title">{item.title}</h4>
                  {item.category && (
                    <span className="suggestion-category-tag">{item.category}</span>
                  )}
                </div>
                <p className="suggestion-card-message">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 50/30/20 Rule for Teens Box */}
      <div className="teen-rule-box">
        <div className="teen-rule-header">
          <Sparkles size={20} className="text-primary" />
          <h4>The 50/30/20 Rule for Students & Teens</h4>
        </div>
        <p className="teen-rule-desc">
          A super simple framework to organize your pocket money or allowance every month:
        </p>
        <div className="rule-columns-3">
          <div className="rule-column">
            <div className="rule-pct-circle purple">50%</div>
            <h5>Essential Needs</h5>
            <p>School books, metro/bus passes, daily lunch, essential phone recharge.</p>
          </div>
          <div className="rule-column">
            <div className="rule-pct-circle pink">30%</div>
            <h5>Fun & Wants</h5>
            <p>Cafe outings, movies, games, snacks, shopping for clothes.</p>
          </div>
          <div className="rule-column">
            <div className="rule-pct-circle emerald">20%</div>
            <h5>Pocket Savings</h5>
            <p>Saved in your piggy bank or bank account for big future goals!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
