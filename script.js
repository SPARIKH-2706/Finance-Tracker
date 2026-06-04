/* ── STATE ──────────────────────────────────────── */
let transactions = JSON.parse(localStorage.getItem("optic_transactions")) || [];
let budgets = JSON.parse(localStorage.getItem("optic_budgets")) || [];

/* ── DOM REFS ───────────────────────────────────── */
const balanceEl = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const listEl = document.getElementById("list");
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
const toggleBudgetBtn = document.getElementById("toggleBudgetForm");
const budgetFormWrap = document.getElementById("budgetFormWrap");
const budgetCategoryEl = document.getElementById("budgetCategory");
const budgetLimitEl = document.getElementById("budgetLimit");
const addBudgetBtn = document.getElementById("addBudgetBtn");
const budgetListEl = document.getElementById("budgetList");

/* ── CHART ──────────────────────────────────────── */
let expenseChart;

function updateChart(income, expense) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (expenseChart) expenseChart.destroy();

  // Build category breakdown for expenses
  const catMap = {};
  transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount);
    });

  const catLabels = Object.keys(catMap);
  const catData = Object.values(catMap);
  const palette = [
    "#6366f1",
    "#06b6d4",
    "#f87171",
    "#34d399",
    "#fbbf24",
    "#a78bfa",
    "#f472b6",
  ];

  if (catLabels.length === 0) {
    // Fallback: income vs expense
    expenseChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expenses"],
        datasets: [
          {
            data: [income, expense],
            backgroundColor: ["#34d399", "#f87171"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "72%",
        plugins: {
          legend: { labels: { color: "#7a8699", font: { family: "DM Sans" } } },
        },
      },
    });
    return;
  }

  expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: catLabels,
      datasets: [
        {
          data: catData,
          backgroundColor: catLabels.map((_, i) => palette[i % palette.length]),
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "72%",
      plugins: {
        legend: {
          labels: {
            color: "#7a8699",
            font: { family: "DM Sans" },
            boxWidth: 12,
          },
        },
      },
    },
  });
}

/* ── TOTALS ─────────────────────────────────────── */
function getAmounts() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((s, a) => s + a, 0).toFixed(2);
  const income = amounts
    .filter((a) => a > 0)
    .reduce((s, a) => s + a, 0)
    .toFixed(2);
  const expense = (
    amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0) * -1
  ).toFixed(2);
  return { total, income, expense };
}

/* ── RENDER TRANSACTIONS ────────────────────────── */
function renderList() {
  const filter = filterCategory.value;
  listEl.innerHTML = "";

  const filtered =
    filter === "All"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  if (filtered.length === 0) {
    listEl.innerHTML =
      '<div class="empty-state">No transactions yet. Add one below ↓</div>';
    return;
  }

  [...filtered].reverse().forEach((t) => {
    const sign = t.amount < 0 ? "-" : "+";
    const li = document.createElement("li");
    li.classList.add(t.amount < 0 ? "minus" : "plus");
    li.dataset.id = t.id;
    li.innerHTML = `
      <div class="tx-left">
        <span class="tx-name">${t.text}</span>
        <span class="tx-tag">${t.category}</span>
      </div>
      <div class="tx-right">
        <span class="tx-amount">${sign}$${Math.abs(t.amount).toFixed(2)}</span>
        <button class="delete-btn" title="Delete" onclick="deleteTransaction(${t.id})">×</button>
      </div>`;
    listEl.appendChild(li);
  });
}

/* ── DELETE TRANSACTION ─────────────────────────── */
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  save();
  render();
}

/* ── BUDGET GOALS ───────────────────────────────── */
function renderBudgets() {
  budgetListEl.innerHTML = "";
  if (budgets.length === 0) return;

  budgets.forEach((b) => {
    const spent = transactions
      .filter((t) => t.amount < 0 && t.category === b.category)
      .reduce((s, t) => s + Math.abs(t.amount), 0);

    const pct = Math.min((spent / b.limit) * 100, 100).toFixed(1);
    const barClass =
      pct >= 100 ? "bar-over" : pct >= 75 ? "bar-warning" : "bar-ok";
    const statusColor =
      pct >= 100 ? "#f87171" : pct >= 75 ? "#fbbf24" : "#34d399";

    const div = document.createElement("div");
    div.classList.add("budget-item");
    div.innerHTML = `
      <div class="budget-top">
        <span class="budget-name">${b.category}</span>
        <span class="budget-meta">
          <span class="budget-spent" style="color:${statusColor}">$${spent.toFixed(2)}</span>
          <span> / $${b.limit.toFixed(2)}</span>
        </span>
      </div>
      <div class="budget-bar-bg">
        <div class="budget-bar-fill ${barClass}" style="width:${pct}%"></div>
      </div>`;
    budgetListEl.appendChild(div);
  });
}

/* ── UPDATE ALL ─────────────────────────────────── */
function render() {
  const { total, income, expense } = getAmounts();
  balanceEl.innerText = `$${total}`;
  moneyPlus.innerText = `+$${income}`;
  moneyMinus.innerText = `-$${expense}`;
  updateChart(parseFloat(income), parseFloat(expense));
  renderList();
  renderBudgets();
}

/* ── SAVE ───────────────────────────────────────── */
function save() {
  localStorage.setItem("optic_transactions", JSON.stringify(transactions));
  localStorage.setItem("optic_budgets", JSON.stringify(budgets));
}

/* ── FORM: ADD TRANSACTION ──────────────────────── */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const t = {
    id: Date.now(),
    text: textInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
  };
  transactions.push(t);
  save();
  render();
  textInput.value = "";
  amountInput.value = "";
});

/* ── FORM: BUDGET GOAL ──────────────────────────── */
toggleBudgetBtn.addEventListener("click", () => {
  budgetFormWrap.classList.toggle("hidden");
});

addBudgetBtn.addEventListener("click", () => {
  const cat = budgetCategoryEl.value;
  const limit = parseFloat(budgetLimitEl.value);
  if (!cat || isNaN(limit) || limit <= 0) return;

  const existing = budgets.findIndex((b) => b.category === cat);
  if (existing > -1) {
    budgets[existing].limit = limit; // update existing
  } else {
    budgets.push({ category: cat, limit }); // new goal
  }

  budgetLimitEl.value = "";
  budgetCategoryEl.value = "";
  budgetFormWrap.classList.add("hidden");
  save();
  render();
});

/* ── FILTER ─────────────────────────────────────── */
filterCategory.addEventListener("change", renderList);

/* ── INIT ───────────────────────────────────────── */
render();
