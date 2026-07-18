# 💰 Optic Finance Tracker

A sleek, client-side personal finance tracker with a glassmorphism UI. Track income and expenses, set budget goals per category, and visualize spending through interactive doughnut charts.

## ✨ Features

- 📊 **Balance Dashboard** — Real-time total balance, income, and expense summary
- 💸 **Transaction Management** — Add, categorize, filter, and delete transactions
- 🎯 **Budget Goals** — Set monthly spending limits per category with visual progress bars (🟢 green / 🟡 yellow / 🔴 red indicators)
- 🍩 **Expense Chart** — Doughnut chart breakdown of spending by category (powered by Chart.js)
- 🗂️ **Category Filtering** — View transactions by category (Food, Transport, Shopping, Health, Entertainment, Bills, Salary, Other)
- 💾 **Persistent Storage** — All data saved to `localStorage`, persists across browser sessions
- 📱 **Responsive Design** — Mobile-friendly single-column layout (max-width 480px)

## 🛠️ Tech Stack

- 🧱 HTML5, CSS3, Vanilla JavaScript
- 📈 [Chart.js](https://www.chartjs.org/) (via CDN) for doughnut chart visualization
- 🔤 [Google Fonts](https://fonts.google.com/) — Syne (headings) + DM Sans (body)
- 🗄️ `localStorage` for data persistence

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Finance-Tracker.git
   ```
2. **Open `index.html`** in any modern browser.

> ⚡ No build tools or server required — it's a fully static app.

## 📁 Project Structure

```
Finance-Tracker/
├── index.html       # Main HTML page
├── style.css        # Glassmorphism dark theme styles
├── script.js        # App logic (state, rendering, charts, localStorage)
└── README.md
```

## 📖 Usage

- ➕ **Add a transaction** — Enter a description, amount (negative for expenses, positive for income), select a category, and click "Add to Ledger".
- 🎯 **Set a budget goal** — Click "+ Set Goal", choose a category, enter a monthly limit, and click "Save". Progress bars show spending vs. limit.
- 🔍 **Filter history** — Use the category dropdown in the History section to view specific transaction types.
- 🗑️ **Delete a transaction** — Hover over a transaction and click the "x" button.

## 🖼️ Screenshots

The UI features a dark theme with animated background orbs, glassmorphism cards, and gradient accents.

