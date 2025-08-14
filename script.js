// Financial Management Tool - Pure JavaScript
// All data stored locally in browser localStorage

class FinanceManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.budgetThreshold = this.loadBudgetThreshold();
        this.expenseCategories = [
            'Food & Dining', 'Transportation', 'Housing', 'Utilities', 
            'Entertainment', 'Shopping', 'Healthcare', 'Education',
            'Subscriptions', 'Insurance', 'Taxes', 'Other'
        ];
        this.investmentCategories = [
            'Stocks', 'Bonds', 'Real Estate', 'Cryptocurrency', 
            'Mutual Funds', 'ETFs', 'Commodities', 'Precious Metals',
            'Startup Investment', 'Other'
        ];
        this.currencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCategoryOptions();
        this.updateDashboard();
        this.updateCharts();
        this.updateSuggestions();
        this.updateRecentTransactions();
        this.updateBudgetProgress();
        this.setDefaultDate();
    }

    setupEventListeners() {
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        document.getElementById('transactionType').addEventListener('change', () => {
            this.updateCategoryOptions();
        });

        document.getElementById('budgetThreshold').addEventListener('input', () => {
            this.saveBudgetThreshold();
            this.updateBudgetProgress();
        });

        document.getElementById('budgetCurrency').addEventListener('change', () => {
            this.saveBudgetThreshold();
            this.updateBudgetProgress();
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    updateCategoryOptions() {
        const type = document.getElementById('transactionType').value;
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Select category</option>';
        
        if (type === 'expense') {
            this.expenseCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } else if (type === 'investment') {
            this.investmentCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
    }

    addTransaction() {
        const formData = new FormData(document.getElementById('transactionForm'));
        const transaction = {
            id: Date.now(),
            type: formData.get('transactionType'),
            amount: parseFloat(formData.get('amount')),
            currency: formData.get('currency'),
            category: formData.get('category'),
            description: formData.get('description'),
            date: formData.get('date'),
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateDashboard();
        this.updateCharts();
        this.updateSuggestions();
        this.updateRecentTransactions();
        this.updateBudgetProgress();
        
        document.getElementById('transactionForm').reset();
        this.setDefaultDate();
        
        this.showNotification('Transaction added successfully!', 'success');
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.updateDashboard();
        this.updateCharts();
        this.updateSuggestions();
        this.updateRecentTransactions();
        this.updateBudgetProgress();
    }

    getTotalBudget() {
        return this.budgetThreshold.amount || 0;
    }

    getTotalSpent() {
        return this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getTotalInvested() {
        return this.transactions
            .filter(t => t.type === 'investment')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getRemaining() {
        return this.getTotalBudget() - this.getTotalSpent();
    }

    getExpensesByCategory() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categories = {};
        
        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });
        
        return categories;
    }

    getInvestmentsByType() {
        const investments = this.transactions.filter(t => t.type === 'investment');
        const types = {};
        
        investments.forEach(investment => {
            types[investment.category] = (types[investment.category] || 0) + investment.amount;
        });
        
        return types;
    }

    updateDashboard() {
        const totalBudget = this.getTotalBudget();
        const totalSpent = this.getTotalSpent();
        const totalInvested = this.getTotalInvested();
        const remaining = this.getRemaining();

        document.getElementById('totalBudget').textContent = this.formatCurrency(totalBudget);
        document.getElementById('totalSpent').textContent = this.formatCurrency(totalSpent);
        document.getElementById('totalInvested').textContent = this.formatCurrency(totalInvested);
        document.getElementById('remaining').textContent = this.formatCurrency(remaining);
    }

    updateCharts() {
        this.updateExpensesChart();
        this.updateInvestmentsChart();
    }

    updateExpensesChart() {
        const ctx = document.getElementById('expensesChart');
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart update');
            return;
        }
        
        // Destroy existing chart if it exists
        if (window.expensesChart && typeof window.expensesChart.destroy === 'function') {
            window.expensesChart.destroy();
        }

        const data = this.getExpensesByCategory();
        const labels = Object.keys(data);
        const values = Object.values(data);

        if (labels.length === 0) {
            ctx.style.display = 'none';
            return;
        }

        ctx.style.display = 'block';
        
        try {
            window.expensesChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
                            '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
                            '#16a085', '#8e44ad', '#f1c40f', '#95a5a6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating expenses chart:', error);
            ctx.style.display = 'none';
        }
    }

    updateInvestmentsChart() {
        const ctx = document.getElementById('investmentsChart');
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart update');
            return;
        }
        
        // Destroy existing chart if it exists
        if (window.investmentsChart && typeof window.investmentsChart.destroy === 'function') {
            window.investmentsChart.destroy();
        }

        const data = this.getInvestmentsByType();
        const labels = Object.keys(data);
        const values = Object.values(data);

        if (labels.length === 0) {
            ctx.style.display = 'none';
            return;
        }

        ctx.style.display = 'block';
        
        try {
            window.investmentsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Investment Amount',
                        data: values,
                        backgroundColor: '#27ae60',
                        borderColor: '#229954',
                        borderWidth: 1
                }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating investments chart:', error);
            ctx.style.display = 'none';
        }
    }

    updateBudgetProgress() {
        const threshold = this.getTotalBudget();
        const spent = this.getTotalSpent();
        const percentage = threshold > 0 ? (spent / threshold) * 100 : 0;
        
        const progressBar = document.getElementById('budgetProgress');
        const status = document.getElementById('budgetStatus');
        
        progressBar.style.width = Math.min(percentage, 100) + '%';
        
        if (percentage >= 100) {
            progressBar.className = 'progress-bar bg-danger';
            status.textContent = `Over budget by ${this.formatCurrency(spent - threshold)}`;
        } else if (percentage >= 80) {
            progressBar.className = 'progress-bar bg-warning';
            status.textContent = `Warning: ${this.formatCurrency(threshold - spent)} remaining`;
        } else {
            progressBar.className = 'progress-bar bg-success';
            status.textContent = `${this.formatCurrency(threshold - spent)} remaining`;
        }
    }

    updateSuggestions() {
        const suggestions = [];
        const totalSpent = this.getTotalSpent();
        const totalInvested = this.getTotalInvested();
        const totalBudget = this.getTotalBudget();
        const expenses = this.getExpensesByCategory();

        if (totalBudget > 0) {
            const spendingRatio = totalSpent / totalBudget;
            if (spendingRatio > 0.9) {
                suggestions.push({
                    type: 'warning',
                    message: 'You\'re approaching your budget limit. Consider reducing non-essential expenses.'
                });
            }
        }

        const topExpense = Object.entries(expenses).sort((a, b) => b[1] - a[1])[0];
        if (topExpense && topExpense[1] > totalSpent * 0.4) {
            suggestions.push({
                type: 'info',
                message: `${topExpense[0]} is your highest expense category. Consider if this aligns with your financial goals.`
            });
        }

        if (totalInvested < totalSpent * 0.2) {
            suggestions.push({
                type: 'success',
                message: 'Consider increasing your investment allocation. Aim for at least 20% of your spending to go towards investments.'
            });
        }

        if (totalSpent > 0 && totalInvested === 0) {
            suggestions.push({
                type: 'info',
                message: 'Start investing! Even small amounts can grow significantly over time through compound interest.'
            });
        }

        this.displaySuggestions(suggestions);
    }

    displaySuggestions(suggestions) {
        const container = document.getElementById('suggestions');
        container.innerHTML = '';

        if (suggestions.length === 0) {
            container.innerHTML = '<p class="text-success"><i class="fas fa-check-circle me-2"></i>Great job! Your finances look healthy.</p>';
            return;
        }

        suggestions.forEach(suggestion => {
            const alert = document.createElement('div');
            alert.className = `alert alert-${suggestion.type === 'warning' ? 'warning' : suggestion.type === 'success' ? 'success' : 'info'}`;
            alert.innerHTML = `<i class="fas fa-lightbulb me-2"></i>${suggestion.message}`;
            container.appendChild(alert);
        });
    }

    updateRecentTransactions() {
        const recentExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const recentInvestments = this.transactions
            .filter(t => t.type === 'investment')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        this.displayRecentTransactions('recentExpenses', recentExpenses, 'expense');
        this.displayRecentTransactions('recentInvestments', recentInvestments, 'investment');
    }

    displayRecentTransactions(containerId, transactions, type) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (transactions.length === 0) {
            container.innerHTML = `<p class="text-muted">No ${type}s recorded yet.</p>`;
            return;
        }

        transactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = type === 'expense' ? 'expense-item' : 'investment-item';
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${transaction.description}</strong><br>
                        <small class="text-muted">${transaction.category} • ${new Date(transaction.date).toLocaleDateString()}</small>
                    </div>
                    <div class="text-end">
                        <strong>${this.formatCurrency(transaction.amount)}</strong>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="financeManager.deleteTransaction(${transaction.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    saveTransactions() {
        localStorage.setItem('financeTransactions', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const saved = localStorage.getItem('financeTransactions');
        return saved ? JSON.parse(saved) : [];
    }

    saveBudgetThreshold() {
        const amount = parseFloat(document.getElementById('budgetThreshold').value) || 0;
        const currency = document.getElementById('budgetCurrency').value;
        this.budgetThreshold = { amount, currency };
        localStorage.setItem('financeBudgetThreshold', JSON.stringify(this.budgetThreshold));
    }

    loadBudgetThreshold() {
        const saved = localStorage.getItem('financeBudgetThreshold');
        const threshold = saved ? JSON.parse(saved) : { amount: 0, currency: 'USD' };
        
        document.getElementById('budgetThreshold').value = threshold.amount;
        document.getElementById('budgetCurrency').value = threshold.currency;
        
        return threshold;
    }

    showNotification(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Calculator functionality
let calcDisplay = '0';
let calcPreviousValue = null;
let calcCurrentOperation = null;
let calcWaitingForOperand = false;

function calcNumber(num) {
    if (calcWaitingForOperand) {
        calcDisplay = num;
        calcWaitingForOperand = false;
    } else {
        calcDisplay = calcDisplay === '0' ? num : calcDisplay + num;
    }
    updateCalcDisplay();
}

function calcOperation(op) {
    const inputValue = parseFloat(calcDisplay);
    
    if (calcPreviousValue === null) {
        calcPreviousValue = inputValue;
    } else if (calcCurrentOperation) {
        const result = performCalcOperation(calcPreviousValue, inputValue, calcCurrentOperation);
        calcDisplay = String(result);
        calcPreviousValue = result;
    }
    
    calcWaitingForOperand = true;
    calcCurrentOperation = op;
    updateCalcDisplay();
}

function performCalcOperation(prev, current, op) {
    switch (op) {
        case '+': return prev + current;
        case '-': return prev - current;
        case '*': return prev * current;
        case '/': return prev / current;
        case '%': return prev % current;
        default: return current;
    }
}

function calcEquals() {
    if (!calcCurrentOperation || calcPreviousValue === null) return;
    
    const inputValue = parseFloat(calcDisplay);
    const result = performCalcOperation(calcPreviousValue, inputValue, calcCurrentOperation);
    calcDisplay = String(result);
    calcPreviousValue = null;
    calcCurrentOperation = null;
    calcWaitingForOperand = true;
    updateCalcDisplay();
}

function calcClear() {
    calcDisplay = '0';
    calcPreviousValue = null;
    calcCurrentOperation = null;
    calcWaitingForOperand = false;
    updateCalcDisplay();
}

function calcDelete() {
    if (calcDisplay.length === 1) {
        calcDisplay = '0';
    } else {
        calcDisplay = calcDisplay.slice(0, -1);
    }
    updateCalcDisplay();
}

function updateCalcDisplay() {
    document.getElementById('calcDisplay').textContent = calcDisplay;
}

// Global functions
function toggleNumbers() {
    const elements = document.querySelectorAll('#summaryCards h2, .expense-item strong, .investment-item strong');
    elements.forEach(el => {
        el.classList.toggle('hidden');
    });
    
    const button = document.querySelector('button[onclick="toggleNumbers()"]');
    const icon = button.querySelector('i');
    if (icon.classList.contains('fa-eye-slash')) {
        icon.className = 'fas fa-eye me-1';
        button.innerHTML = '<i class="fas fa-eye me-1"></i>Show Numbers';
    } else {
        icon.className = 'fas fa-eye-slash me-1';
        button.innerHTML = '<i class="fas fa-eye-slash me-1"></i>Hide Numbers';
    }
}

function copyToClipboard() {
    const data = {
        totalBudget: financeManager.getTotalBudget(),
        totalSpent: financeManager.getTotalSpent(),
        totalInvested: financeManager.getTotalInvested(),
        remaining: financeManager.getRemaining(),
        transactions: financeManager.transactions
    };
    
    const text = `Financial Summary (${new Date().toLocaleDateString()})
    
Total Budget: ${financeManager.formatCurrency(data.totalBudget)}
Total Spent: ${financeManager.formatCurrency(data.totalSpent)}
Total Invested: ${financeManager.formatCurrency(data.totalInvested)}
Remaining: ${financeManager.formatCurrency(data.remaining)}

Recent Transactions:
${data.transactions.slice(-10).map(t => 
    `${t.date} - ${t.type.toUpperCase()}: ${t.description} (${t.category}) - ${financeManager.formatCurrency(t.amount)}`
).join('\n')}`;

    navigator.clipboard.writeText(text).then(() => {
        financeManager.showNotification('Data copied to clipboard!', 'success');
    }).catch(() => {
        financeManager.showNotification('Failed to copy to clipboard', 'danger');
    });
}

function exportToExcel() {
    const data = financeManager.transactions.map(t => ({
        Date: t.date,
        Type: t.type,
        Category: t.category,
        Description: t.description,
        Amount: t.amount,
        Currency: t.currency
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Financial Data');
    
    const fileName = `financial_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    financeManager.showNotification('Excel file exported successfully!', 'success');
}

// Initialize the application
let financeManager;
document.addEventListener('DOMContentLoaded', () => {
    financeManager = new FinanceManager();
});
