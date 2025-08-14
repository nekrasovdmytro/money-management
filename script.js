// Financial Management Tool - Pure JavaScript
// All data stored locally in browser localStorage

class FinanceManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.budgetThreshold = this.loadBudgetThreshold();
        this.mainCurrency = this.loadMainCurrency();
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
        this.currencies = [
            // Major Fiat Currencies
            'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD',
            'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR',
            'PLN', 'THB', 'IDR', 'MYR', 'PHP', 'CZK', 'HUF', 'ILS', 'CLP', 'COP',
            'EGP', 'PKR', 'BDT', 'VND', 'NGN', 'ARS', 'PEN', 'UAH', 'RON', 'BGN',
            
            // Major Cryptocurrencies
            'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'AVAX', 'MATIC',
            'LTC', 'BCH', 'LINK', 'UNI', 'ATOM', 'ETC', 'XLM', 'ALGO', 'VET', 'ICP',
            'FIL', 'TRX', 'FTT', 'NEAR', 'APT', 'OP', 'ARB', 'MKR', 'AAVE', 'COMP',
            'SNX', 'SUSHI', 'CRV', 'YFI', 'BAL', 'REN', 'ZRX', 'BAT', 'MANA', 'SAND',
            'ENJ', 'CHZ', 'HOT', 'DENT', 'WIN', 'BTT', 'STMX', 'ANKR', 'COTI', 'HBAR',
            'VTHO', 'ONE', 'IOTA', 'NANO', 'XRB', 'XMR', 'ZEC', 'DASH', 'XEM', 'WAVES',
            'QTUM', 'OMG', 'ZIL', 'ICX', 'AION', 'WAN', 'ONT', 'NEO', 'GAS', 'VET',
            'THETA', 'TFUEL', 'HIVE', 'STEEM', 'SBD', 'EOS', 'BTS', 'BTS', 'KEY', 'DGB',
            'RVN', 'ERG', 'KDA', 'FLUX', 'XEC', 'BABYDOGE', 'SHIB', 'SAFEMOON', 'ELON', 'FLOKI',
            
            // DeFi Tokens
            'CAKE', 'BAKE', 'DODO', '1INCH', 'KNC', 'BAND', 'OCEAN', 'API3', 'UMA', 'BADGER',
            'RAD', 'MASK', 'ENS', 'LDO', 'RPL', 'FRAX', 'USDC', 'USDT', 'DAI', 'BUSD',
            'TUSD', 'USDP', 'GUSD', 'FRAX', 'LUSD', 'SUSD', 'MIM', 'FEI', 'TRIBE', 'ALUSD',
            
            // Layer 2 and Scaling Solutions
            'IMX', 'LOOP', 'METIS', 'BOBA', 'ZKS', 'STARK', 'POLYGON', 'ARBITRUM', 'OPTIMISM', 'BASE',
            
            // Gaming and Metaverse
            'AXS', 'SLP', 'GALA', 'ENJ', 'MANA', 'SAND', 'ALICE', 'HERO', 'TLM', 'GHST',
            'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA', 'ALPHA',
            
            // AI and Data
            'OCEAN', 'FET', 'AGIX', 'NMR', 'MLN', 'BAND', 'LINK', 'API3', 'UMA', 'DIA',
            
            // Privacy Coins
            'XMR', 'ZEC', 'DASH', 'PIVX', 'BEAM', 'GRIN', 'XHV', 'XEQ', 'XWP', 'XMV',
            
            // Meme Coins
            'DOGE', 'SHIB', 'BABYDOGE', 'SAFEMOON', 'ELON', 'FLOKI', 'BONK', 'PEPE', 'WOJAK', 'MOON',
            
            // Stablecoins
            'USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'USDP', 'GUSD', 'FRAX', 'LUSD', 'SUSD',
            'MIM', 'FEI', 'TRIBE', 'ALUSD', 'USDN', 'USDK', 'USDJ', 'USDH', 'USDD', 'USDK'
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCategoryOptions();
        this.updateMainCurrencySelector();
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

        document.getElementById('mainCurrency').addEventListener('change', () => {
            this.saveMainCurrency();
            this.updateDashboard();
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

        // Update summary card titles to show main currency
        const currencySymbol = this.getCurrencySymbol(this.mainCurrency);
        document.querySelector('.summary-total h4').textContent = `Total Budget (${currencySymbol})`;
        document.querySelector('.summary-expenses h4').textContent = `Total Spent (${currencySymbol})`;
        document.querySelector('.summary-investments h4').textContent = `Total Invested (${currencySymbol})`;
        document.querySelector('.summary-remaining h4').textContent = `Remaining (${currencySymbol})`;
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
                        <strong>${this.formatCurrency(transaction.amount, transaction.currency)}</strong>
                        <small class="text-muted d-block">${transaction.currency}</small>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="financeManager.deleteTransaction(${transaction.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    }

    formatCurrency(amount, currency = null) {
        const displayCurrency = currency || this.mainCurrency;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: displayCurrency
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

    loadMainCurrency() {
        const saved = localStorage.getItem('financeMainCurrency');
        return saved || 'USD';
    }

    saveMainCurrency() {
        const currency = document.getElementById('mainCurrency').value;
        this.mainCurrency = currency;
        localStorage.setItem('financeMainCurrency', currency);
    }

    updateMainCurrencySelector() {
        document.getElementById('mainCurrency').value = this.mainCurrency;
    }

    getCurrencySymbol(currency) {
        const symbols = {
            // Major Fiat
            'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$',
            'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'UAH': '₴', 'PLN': 'zł',
            'CZK': 'Kč', 'HUF': 'Ft', 'RON': 'lei', 'BGN': 'лв', 'HRK': 'kn',
            'RSD': 'дин', 'MKD': 'ден', 'ALL': 'L', 'MDL': 'L', 'GEL': '₾',
            'AMD': '֏', 'AZN': '₼', 'KZT': '₸', 'KGS': 'с', 'TJS': 'ЅМ',
            'TMT': 'T', 'UZS': 'so\'m', 'RUB': '₽', 'BYN': 'Br', 'SEK': 'kr',
            'NOK': 'kr', 'DKK': 'kr', 'ISK': 'kr', 'NZD': 'NZ$', 'SGD': 'S$',
            'HKD': 'HK$', 'KRW': '₩', 'TWD': 'NT$', 'THB': '฿', 'MYR': 'RM',
            'IDR': 'Rp', 'PHP': '₱', 'VND': '₫', 'INR': '₹', 'PKR': '₨',
            'BDT': '৳', 'LKR': 'Rs', 'NPR': '₨', 'MNT': '₮', 'MXN': '$',
            'BRL': 'R$', 'ARS': '$', 'CLP': '$', 'COP': '$', 'PEN': 'S/',
            'UYU': '$U', 'PYG': '₲', 'BOB': 'Bs', 'VES': 'Bs', 'ZAR': 'R',
            'EGP': 'E£', 'NGN': '₦', 'KES': 'KSh', 'GHS': 'GH₵', 'MAD': 'د.م.',
            'TND': 'د.ت', 'TRY': '₺', 'ILS': '₪', 'JOD': 'د.ا', 'LBP': 'ل.ل',
            'SAR': 'ر.س', 'AED': 'د.إ', 'QAR': 'ر.ق', 'KWD': 'د.ك', 'BHD': 'د.ب',
            'OMR': 'ر.ع', 'YER': 'ر.ي', 'IRR': '﷼', 'AFN': '؋',
            
            // Cryptocurrencies
            'BTC': '₿', 'ETH': 'Ξ', 'BNB': 'BNB', 'XRP': 'XRP', 'ADA': 'ADA',
            'SOL': 'SOL', 'DOT': 'DOT', 'DOGE': 'Ð', 'AVAX': 'AVAX', 'MATIC': 'MATIC',
            'LTC': 'Ł', 'BCH': 'BCH', 'LINK': 'LINK', 'UNI': 'UNI', 'ATOM': 'ATOM',
            'ETC': 'ETC', 'XLM': 'XLM', 'ALGO': 'ALGO', 'VET': 'VET', 'ICP': 'ICP',
            'FIL': 'FIL', 'TRX': 'TRX', 'NEAR': 'NEAR', 'APT': 'APT', 'OP': 'OP',
            'ARB': 'ARB', 'MKR': 'MKR', 'AAVE': 'AAVE', 'COMP': 'COMP', 'SNX': 'SNX',
            'SUSHI': 'SUSHI', 'CRV': 'CRV', 'YFI': 'YFI', 'CAKE': 'CAKE', '1INCH': '1INCH',
            'KNC': 'KNC', 'BAND': 'BAND', 'OCEAN': 'OCEAN', 'API3': 'API3', 'UMA': 'UMA',
            'BADGER': 'BADGER', 'RAD': 'RAD', 'MASK': 'MASK', 'ENS': 'ENS', 'LDO': 'LDO',
            'RPL': 'RPL', 'FRAX': 'FRAX', 'LUSD': 'LUSD', 'SUSD': 'sUSD', 'MIM': 'MIM',
            'FEI': 'FEI', 'TRIBE': 'TRIBE', 'ALUSD': 'alUSD', 'USDN': 'USDN', 'USDK': 'USDK',
            'USDJ': 'USDJ', 'USDH': 'USDH', 'USDD': 'USDD',
            
            // Stablecoins
            'USDT': 'USDT', 'USDC': 'USDC', 'DAI': 'DAI', 'BUSD': 'BUSD', 'TUSD': 'TUSD',
            'USDP': 'USDP', 'GUSD': 'GUSD',
            
            // Gaming & Metaverse
            'AXS': 'AXS', 'SLP': 'SLP', 'GALA': 'GALA', 'MANA': 'MANA', 'SAND': 'SAND',
            'ALICE': 'ALICE', 'HERO': 'HERO', 'TLM': 'TLM', 'GHST': 'GHST', 'ENJ': 'ENJ',
            'CHZ': 'CHZ', 'HOT': 'HOT', 'DENT': 'DENT', 'WIN': 'WIN', 'BTT': 'BTT',
            'STMX': 'STMX', 'ANKR': 'ANKR', 'COTI': 'COTI', 'HBAR': 'HBAR', 'VTHO': 'VTHO',
            'ONE': 'ONE', 'IOTA': 'MIOTA', 'NANO': 'XNO', 'XRB': 'XRB',
            
            // Privacy & Meme
            'XMR': 'XMR', 'ZEC': 'ZEC', 'DASH': 'DASH', 'PIVX': 'PIVX', 'BEAM': 'BEAM',
            'GRIN': 'GRIN', 'XHV': 'XHV', 'XEQ': 'XEQ', 'XWP': 'XWP', 'XMV': 'XMV',
            'SHIB': 'SHIB', 'BABYDOGE': 'BABYDOGE', 'SAFEMOON': 'SAFEMOON', 'ELON': 'ELON',
            'FLOKI': 'FLOKI', 'BONK': 'BONK', 'PEPE': 'PEPE', 'WOJAK': 'WOJAK', 'MOON': 'MOON'
        };
        return symbols[currency] || currency;
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

    // Ukrainian translations of ALL Bible verses (ONLY Bible verses, not other text)
    ukrainianVerses = {
        // Biblical Wisdom Tab - ALL verses
        "Honor the Lord with your wealth and with the firstfruits of all your produce.": "Шануй Господа з маєтку твого та з первинок усього врожаю твого.",
        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.": "Кожен нехай дає так, як він вирішив у серці своєму, не з жалем і не з примусом, бо Бог любить радісного давача.",
        "It is more blessed to give than to receive.": "Блаженніше давати, ніж приймати.",
        "The blessing of the Lord makes rich, and he adds no sorrow with it.": "Благословення Господнє багатить, і не додає до нього смутку.",
        "A good man leaves an inheritance to his children's children.": "Добрий чоловік залишає спадщину синам синів своїх.",
        "Wealth gained hastily will dwindle, but whoever gathers little by little will increase it.": "Багатство, набуте поспіхом, зменшиться, а хто збирає поступово, той його збільшить.",
        "For the love of money is a root of all kinds of evils.": "Бо любов до грошей є корінь усього злого.",
        "No one can serve two masters... You cannot serve God and money.": "Ніхто не може служити двом панам... Не можете служити Богу й мамоні.",
        "Keep your life free from love of money, and be content with what you have.": "Нехай буде ваше життя вільним від любові до грошей, і будьте задоволені тим, що маєте.",
        "The plans of the diligent lead surely to abundance, but everyone who is hasty comes only to poverty.": "Плани старанного ведуть до достатку, а кожен поспішний приходить до бідності.",
        "In all toil there is profit, but mere talk tends only to poverty.": "У всякій праці є користь, а порожня балаканина веде до бідності.",
        "The wise store up choice food and olive oil, but fools gulp theirs down.": "Мудрі зберігають вибірну їжу та оливкову олію, а дурні поглинають своє.",
        "The rich rules over the poor, and the borrower is the slave of the lender.": "Багатий панує над бідним, а позичальник є рабом того, хто позичає.",
        "Whoever is generous to the poor lends to the Lord, and he will repay him for his deed.": "Хто милосердний до бідного, той позичає Господу, і Він відплатить йому за його вчинок.",
        "Better is a little with righteousness than great revenues with injustice.": "Краще трохи з правдою, ніж великі доходи з неправдою.",
        "A faithful man will abound with blessings, but whoever hastens to be rich will not go unpunished.": "Вірний чоловік буде мати багато благословень, а хто поспішає збагатитися, той не залишиться без покарання.",
        "Give, and it will be given to you. Good measure, pressed down, shaken together, running over.": "Давайте, і дасться вам. Мірою доброю, натиснутою, струшеною й переповненою.",
        "But seek first the kingdom of God and his righteousness, and all these things will be added to you.": "А шукайте спочатку Царства Божого та правди Його, і це все додасться вам.",
        "For where your treasure is, there your heart will be also.": "Бо де скарб ваш, там і серце ваше буде.",
        
        // Rich People Tab - ALL verses
        "Abraham was very rich in livestock, in silver, and in gold.": "Аврам був дуже багатий худобою, сріблом і золотом.",
        "Solomon's wealth and wisdom surpassed all the kings of the earth.": "Багатство та мудрість Соломона перевершили всіх царів землі.",
        "Job was the greatest of all the people of the east.": "Йов був найбільшим з усіх людей сходу.",
        "Wealth brings many friends, but a poor man is deserted by his friend.": "Багатство приносить багато друзів, а бідного покидає його друг.",
        "The rich man's wealth is his strong city, and like a high wall in his imagination.": "Багатство багатого — це його міцне місто, і як висока стіна в його уяві.",
        "Whoever oppresses the poor to increase his wealth and whoever gives to the rich, will only come to poverty.": "Хто пригнічує бідного, щоб збільшити своє багатство, і хто дає багатому, той прийде до бідності.",
        "The rich and the poor meet together; the Lord is the maker of them all.": "Багатий та бідний зустрічаються разом; Господь є Творцем їх усіх.",
        "Whoever has a bountiful eye will be blessed, for he shares his bread with the poor.": "Хто має щедре око, той буде благословенний, бо він ділиться хлібом своїм з бідним.",
        "Do not toil to acquire wealth; be discerning enough to desist.": "Не трудися, щоб набути багатства; будь розумним і перестань.",
        "When your eyes light on it, it is gone, for suddenly it sprouts wings, flying like an eagle toward heaven.": "Коли очі твої побачать його, воно зникне, бо раптом воно випустить крила і полетить, як орел, до неба.",
        "A good man leaves an inheritance to his children's children, but the sinner's wealth is laid up for the righteous.": "Добрий чоловік залишає спадщину синам синів своїх, а багатство грішника зберігається для праведного.",
        
        // Banner verses
        "The blessing of the Lord makes rich, and he adds no sorrow with it.": "Благословення Господнє багатить, і не додає до нього смутку.",
        "For where your treasure is, there your heart will be also.": "Бо де скарб ваш, там і серце ваше буде.",
        "The rich rule over the poor, and the borrower is slave to the lender.": "Багатий панує над бідним, а позичальник є рабом того, хто позичає.",
        
        // Bible verse categories (ONLY Bible-related categories)
        "Tithing": "Десятина",
        "Giving": "Давання", 
        "Generosity": "Щедрість",
        "Blessing": "Благословення",
        "Legacy": "Спадщина",
        "Patience": "Терпіння",
        "Warning": "Попередження",
        "Priority": "Пріоритет",
        "Contentment": "Задоволеність",
        "Planning": "Планування",
        "Work": "Праця",
        "Saving": "Збереження",
        "Debt": "Борг",
        "Charity": "Милостиня",
        "Integrity": "Чесність",
        "Faithfulness": "Вірність",
        "Power": "Влада",
        "Influence": "Вплив",
        "Security": "Безпека",
        "Justice": "Справедливість",
        "Equality": "Рівність",
        "Wisdom": "Мудрість",
        "Temporary": "Тимчасове",
        "Honor": "Честь",
        "Protection": "Захист",
        "Friendship": "Дружба",
        "Control": "Контроль",
        "Unity": "Єдність",
        
        // Bible character names
        "Abraham": "Аврам",
        "Solomon": "Соломон", 
        "Job": "Йов"
    };
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
    
    const text = `Financial Summary (${new Date().toLocaleDateString()}) - Main Currency: ${financeManager.mainCurrency}
    
Total Budget: ${financeManager.formatCurrency(data.totalBudget)}
Total Spent: ${financeManager.formatCurrency(data.totalSpent)}
Total Invested: ${financeManager.formatCurrency(data.totalInvested)}
Remaining: ${financeManager.formatCurrency(data.remaining)}

Recent Transactions:
${data.transactions.slice(-10).map(t => 
    `${t.date} - ${t.type.toUpperCase()}: ${t.description} (${t.category}) - ${financeManager.formatCurrency(t.amount, t.currency)} ${t.currency}`
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

// Global translation state
let isUkrainian = false;

// Toggle Ukrainian translation function (ONLY Bible verses)
function toggleUkrainianTranslation() {
    isUkrainian = !isUkrainian;
    const button = document.querySelector('button[onclick="toggleUkrainianTranslation()"]');
    
    if (isUkrainian) {
        button.innerHTML = '<i class="fas fa-language me-2"></i>Show English';
        translateToUkrainian();
        financeManager.showNotification('Bible verses translated to Ukrainian', 'success');
    } else {
        button.innerHTML = '<i class="fas fa-language me-2"></i>Translate Bible Verses';
        translateToEnglish();
        financeManager.showNotification('Bible verses back to English', 'success');
    }
}

function translateToUkrainian() {
    const verseElements = document.querySelectorAll('.verse-text, .verse-category');
    verseElements.forEach(element => {
        const originalText = element.getAttribute('data-original') || element.textContent;
        element.setAttribute('data-original', originalText);
        
        if (financeManager.ukrainianVerses[originalText]) {
            element.textContent = financeManager.ukrainianVerses[originalText];
        }
    });
}

function translateToEnglish() {
    const verseElements = document.querySelectorAll('.verse-text, .verse-category');
    verseElements.forEach(element => {
        const originalText = element.getAttribute('data-original');
        if (originalText) {
            element.textContent = originalText;
        }
    });
}

// Initialize the application
let financeManager;
document.addEventListener('DOMContentLoaded', () => {
    financeManager = new FinanceManager();
});
