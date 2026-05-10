# 💰 FinanceTracker

Ever wonder where all your money went? I built FinanceTracker to solve exactly that. It's a full-stack web app that helps you log your income and expenses, set monthly budgets, and actually see where your money is going — all in a clean, modern interface.


🌐 **Live Demo**: [finance-tracker-hazel-nine.vercel.app](https://finance-tracker-hazel-nine.vercel.app)
---

## 🖥️ What it looks like

The app has a glassmorphism design — think frosted glass cards, smooth animations, and a dashboard that actually feels good to use.

- **Dashboard** — see your total income, expenses and balance at a glance, with a spending pie chart and budget progress bars
- **Transactions** — log anything you earn or spend, filter by month, and delete what you don't need
- **Budgets** — set a monthly limit per category (Food, Rent, Transport etc.) and watch the progress bar fill up as you spend

---

## 🛠️ How I built it

I kept the stack practical and interview-friendly:

**Frontend** → React + Vite, Tailwind CSS, Recharts for charts, React Router for navigation

**Backend** → Node.js + Express, PostgreSQL hosted on Neon, Prisma as the ORM, JWT for auth

The backend follows a clean controller → route → middleware pattern. The frontend uses custom hooks to fetch data and a React Context for global auth state.

---

## ⚙️ Run it yourself

You'll need Node.js and a free [Neon](https://neon.tech) account for the database.

**1. Clone the project**
\`\`\`bash
git clone https://github.com/laibloser22/finance-tracker.git
cd finance-tracker
\`\`\`

**2. Set up the backend**
\`\`\`bash
cd server
npm install
\`\`\`

Create a `.env` file inside `server/`:
\`\`\`
DATABASE_URL="your-neon-connection-string"
JWT_SECRET="make-this-something-random"
\`\`\`

Run the database migration:
\`\`\`bash
npx prisma migrate dev
\`\`\`

Start the server:
\`\`\`bash
npm run dev
\`\`\`

**3. Set up the frontend**
\`\`\`bash
cd ../client
npm install
npm run dev
\`\`\`

Open `http://localhost:5173` and you're good to go.

---

## 📁 How the code is organized

\`\`\`
finance-tracker/
├── client/                 # Everything the user sees
│   └── src/
│       ├── pages/          # Login, Register, Dashboard, Transactions, Budgets
│       ├── components/     # Navbar, ProtectedRoute
│       ├── hooks/          # useTransactions, useBudgets
│       ├── context/        # AuthContext (global login state)
│       └── api/            # API call functions
│
└── server/                 # Everything on the backend
    ├── prisma/             # Database schema and migrations
    └── src/
        ├── controllers/    # Business logic
        ├── routes/         # API endpoints
        └── middleware/     # JWT auth check
\`\`\`

---

## 🔌 API at a glance

| Method | Endpoint | What it does |
|--------|----------|--------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and get a token |
| GET | `/api/auth/me` | Get the logged in user |
| GET | `/api/transactions` | Fetch all transactions |
| POST | `/api/transactions` | Add a new transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/transactions/summary` | Get income, expense and balance totals |
| POST | `/api/budgets` | Set a budget for a category |
| GET | `/api/budgets/status` | See how much of each budget is used |

---

## 🙋‍♂️ Who made this

I'm a full-stack developer learning by building real projects. This was built in 4 days — from database schema to deployed app.

🔗 GitHub: [github.com/laibloser22](https://github.com/laibloser22)

Feel free to fork it, break it, or improve it. 🚀