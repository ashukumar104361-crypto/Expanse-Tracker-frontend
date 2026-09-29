# Teenager Expense Tracker — Frontend Client

A responsive, student-friendly single page application built with React.js, Vite, React Router v6, and Recharts.

---

## 🎨 Features
- **Modern Teen-Friendly UI/UX**: Clean dark-mode surface with neon accents, smooth transitions, and simple terms (no confusing financial jargon).
- **Interactive Visual Reports**: Recharts integration for Category distribution (Donut chart), Weekly burn trends (Bar & Line charts), and Needs vs. Wants comparisons.
- **Budget Tracking**: Visual progress bars and proactive status alerts (`Normal`, `Warning`, `Near Limit`, `Over Budget`).
- **Data-Driven Smart Suggestions**: Actionable spending tips and a gamified Financial Health Score (0-100) with badges like "Money Ninja 🥷" and "Smart Saver 🌟".
- **Centralized API Layer**: Axios client with JWT Bearer token authentication and automatic session expiry interception.
- **Mobile Responsive**: Sidebar slides out smoothly as a drawer menu on mobile phones and tablets.

---

## 📁 Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── BudgetCard.jsx        # Budget progress widget
│   │   ├── ChartCard.jsx         # Card wrapper for Recharts
│   │   ├── EmptyState.jsx        # Friendly zero-data placeholder
│   │   ├── ExpenseCard.jsx       # Card displaying individual purchase
│   │   ├── ExpenseForm.jsx       # Form for adding/editing expenses
│   │   ├── ExpenseTable.jsx      # Filterable and searchable table/list
│   │   ├── Loading.jsx           # Animated loading spinner
│   │   ├── Navbar.jsx            # Top bar with quick add & user badge
│   │   ├── ProtectedRoute.jsx    # Session route guard
│   │   └── Sidebar.jsx           # Navigation drawer
│   ├── context/
│   │   └── AuthContext.jsx       # Global authentication state
│   ├── hooks/
│   │   └── useAuth.js            # Custom hook for auth context
│   ├── pages/
│   │   ├── AddExpense.jsx        # Add expense screen
│   │   ├── Budget.jsx            # Monthly & category budget manager
│   │   ├── Dashboard.jsx         # High-level KPIs, charts, & recent spend
│   │   ├── Expenses.jsx          # Full expense history with filters
│   │   ├── Login.jsx             # Sign-in with 1-click demo filler
│   │   ├── Profile.jsx           # Profile editing & password change
│   │   ├── Register.jsx          # Student registration
│   │   ├── Reports.jsx           # Visual analytics & category rankings
│   │   └── Suggestions.jsx       # Smart spending tips & health score
│   ├── services/
│   │   ├── api.js                # Axios instance
│   │   ├── authService.js        # Auth endpoints
│   │   └── expenseService.js     # Expense & budget endpoints
│   ├── utils/
│   │   ├── formatCurrency.js     # Indian Rupee (₹) formatter
│   │   └── formatDate.js         # Friendly date formatter
│   ├── App.jsx                   # Router and layout root
│   ├── index.css                 # Comprehensive CSS design system
│   └── main.jsx                  # React DOM mount point
├── index.html
├── vite.config.js
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   Create `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` points to your backend API (default: `http://localhost:5000/api`).
   For Vercel, add it under **Project Settings → Environment Variables**, for example:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   ```
   The frontend also accepts the backend domain without `/api` and adds the API prefix automatically.

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Production Build:**
   ```bash
   npm run build
   ```
