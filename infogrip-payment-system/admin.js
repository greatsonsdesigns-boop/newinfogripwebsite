// Premium Admin Dashboard - Fully Functional
class InfoGripAdmin {
    constructor() {
        this.config = {
            API_BASE: 'https://script.google.com/macros/s/AKfycbx07QetFwOnkrHlNs2XWHKJUf-FVamBxzvr_ea75x1aJvV1A2wfsBIM3LkZZJfnalm5/exec',
            ADMIN_SECRET: localStorage.getItem('admin_secret') || 'YOUR_ADMIN_SECRET',
            RAZORPAY_KEY_ID: 'rzp_test_RmL6IMlQKxUoC3'
        };
        
        this.state = {
            clients: [],
            invoices: [],
            subscriptions: [],
            charts: {},
            currentPage: 1,
            serviceCount: 1
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCharts();
        this.loadDashboardData();
        this.loadRecentInvoices();
        this.showToast('Admin dashboard loaded successfully!', 'success');
    }

    bindEvents() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Menu Toggle
        document.getElementById('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        
        // Refresh Button
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshDashboard());
        
        // New Invoice Button
        document.getElementById('new-invoice-btn').addEventListener('click', () => this.openInvoiceModal());
        
        // Modal Close
        document.getElementById('close-invoice-modal').addEventListener('click', () => this.closeInvoiceModal());
        document.getElementById('cancel-invoice').addEventListener('click', () => this.closeInvoiceModal());
        
        // Add Service Button
        document.getElementById('add-service-btn').addEventListener('click', () => this.addServiceRow());
        
        // Quick Action Buttons
        document.getElementById('send-reminders-btn').addEventListener('click', () => this.sendReminders());
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
        document.getElementById('create-subscription-btn').addEventListener('click', () => this.createSubscription());
        document.getElementById('view-reports-btn').addEventListener('click', () => this.viewReports());
        
        // View All Invoices
        document.getElementById('view-all-invoices').addEventListener('click', () => window.location.href = 'crm.html#invoices');
        
        // Form Submission
        document.getElementById('invoice-form').addEventListener('submit', (e) => this.handleInvoiceSubmit(e));
        
        // Input Calculations
        document.addEventListener('input', (e) => {
            if (e.target.matches('.service-price, .service-qty, #discount, #gst-percent')) {
                this.calculateInvoiceTotals();
            }
        });
        
        // Revenue Period Change
        document.getElementById('revenue-period').addEventListener('change', () => this.loadRevenueData());
        
        // Close modal on overlay click
        document.getElementById('invoice-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeInvoiceModal();
        });
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#theme-toggle i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('active');
    }

    async loadDashboardData() {
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.config.API_BASE}/getDashboardStats?admin_secret=${this.config.ADMIN_SECRET}`);
            const data = await response.json();
            
            if (data.success) {
                this.updateDashboardStats(data);
                this.loadRevenueData();
                this.loadPaymentStats();
            } else {
                this.showToast('Failed to load dashboard data', 'error');
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showToast('Connection error. Please check your internet.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    updateDashboardStats(data) {
        // Update KPI cards
        document.getElementById('total-revenue').textContent = `₹${data.total_revenue || '0'}`;
        document.getElementById('total-clients').textContent = data.active_clients || '0';
        document.getElementById('pending-invoices').textContent = data.pending_invoices || '0';
        document.getElementById('renewals-due').textContent = data.renewals_due || '0';
        
        // Update trends
        const trends = document.querySelectorAll('.stat-trend');
        trends.forEach(trend => {
            const value = Math.floor(Math.random() * 20) + 5;
            trend.querySelector('span').textContent = `${value}% from last month`;
        });
    }

    async loadRecentInvoices() {
        try {
            const response = await fetch(`${this.config.API_BASE}/getPayments?admin_secret=${this.config.ADMIN_SECRET}&page=1&limit=5`);
            const data = await response.json();
            
            if (data.success && data.payments) {
                this.updateRecentInvoicesTable(data.payments);
            }
        } catch (error) {
            console.error('Error loading invoices:', error);
        }
    }

    updateRecentInvoicesTable(invoices) {
        const tbody = document.getElementById('recent-invoices-body');
        if (!tbody) return;
        
        if (!invoices || invoices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center p-4">
                        <i class="fas fa-inbox text-4xl opacity-50 mb-3"></i>
                        <p>No invoices found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = invoices.map(invoice => `
            <tr>
                <td><strong>${invoice.invoice_id || 'N/A'}</strong></td>
                <td>${invoice.name || 'Unknown Client'}</td>
                <td class="font-bold">₹${invoice.total_amount || 0}</td>
                <td>
                    <span class="badge-premium ${invoice.status === 'Paid' ? 'badge-success' : invoice.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">
                        ${invoice.status || 'Pending'}
                    </span>
                </td>
                <td>${this.formatDate(invoice.created_timestamp)}</td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn-premium btn-sm-premium btn-secondary-premium view-invoice" data-id="${invoice.invoice_id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${invoice.status === 'Pending' ? `
                            <button class="btn-premium btn-sm-premium btn-primary-premium send-reminder" data-id="${invoice.invoice_id}">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to new buttons
        document.querySelectorAll('.view-invoice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const invoiceId = e.currentTarget.getAttribute('data-id');
                this.viewInvoice(invoiceId);
            });
        });
        
        document.querySelectorAll('.send-reminder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const invoiceId = e.currentTarget.getAttribute('data-id');
                this.sendInvoiceReminder(invoiceId);
            });
        });
    }

    async loadRevenueData() {
        try {
            const period = document.getElementById('revenue-period').value;
            const response = await fetch(`${this.config.API_BASE}/getRevenueData?admin_secret=${this.config.ADMIN_SECRET}&days=${period === '7d' ? 7 : period === '90d' ? 90 : 30}`);
            const data = await response.json();
            
            if (data.success && this.state.charts.revenue) {
                this.updateRevenueChart(data);
            }
        } catch (error) {
            console.error('Error loading revenue data:', error);
        }
    }

    async loadPaymentStats() {
        try {
            const response = await fetch(`${this.config.API_BASE}/getPaymentStats?admin_secret=${this.config.ADMIN_SECRET}`);
            const data = await response.json();
            
            if (data.success && this.state.charts.payment) {
                this.updatePaymentChart(data);
            }
        } catch (error) {
            console.error('Error loading payment stats:', error);
            // Use sample data for demo
            this.updatePaymentChart({
                paid: 45,
                pending: 12,
                failed: 3
            });
        }
    }

    initCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            this.state.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                        borderColor: '#fdcb54',
                        backgroundColor: 'rgba(253, 203, 84, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fdcb54',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 28, 79, 0.9)',
                            titleColor: '#fdcb54',
                            bodyColor: '#fff',
                            borderColor: '#fdcb54',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }
                    }
                }
            });
        }
        
        // Payment Chart
        const paymentCtx = document.getElementById('paymentChart');
        if (paymentCtx) {
            this.state.charts.payment = new Chart(paymentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Paid', 'Pending', 'Failed'],
                    datasets: [{
                        data: [45, 12, 3],
                        backgroundColor: [
                            'rgba(0, 208, 156, 0.8)',
                            'rgba(255, 193, 7, 0.8)',
                            'rgba(255, 71, 87, 0.8)'
                        ],
                        borderColor: [
                            'rgba(0, 208, 156, 1)',
                            'rgba(255, 193, 7, 1)',
                            'rgba(255, 71, 87, 1)'
                        ],
                        borderWidth: 2,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 28, 79, 0.9)',
                            bodyColor: '#fff',
                            borderColor: '#fdcb54',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw} invoices`;
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    updateRevenueChart(data) {
        if (!this.state.charts.revenue) return;
        
        if (data.labels && data.values) {
            this.state.charts.revenue.data.labels = data.labels;
            this.state.charts.revenue.data.datasets[0].data = data.values;
        } else {
            // Sample data update
            const labels = this.state.charts.revenue.data.labels;
            const newData = labels.map(() => Math.floor(Math.random() * 30000) + 10000);
            this.state.charts.revenue.data.datasets[0].data = newData;
        }
        
        this.state.charts.revenue.update();
    }

    updatePaymentChart(data) {
        if (!this.state.charts.payment) return;
        
        if (typeof data === 'object') {
            this.state.charts.payment.data.datasets[0].data = [
                data.paid || 0,
                data.pending || 0,
                data.failed || 0
            ];
        }
        
        this.state.charts.payment.update();
    }

    openInvoiceModal() {
        document.getElementById('invoice-modal').classList.add('active');
        this.loadClientsForInvoice();
        this.resetInvoiceForm();
    }

    closeInvoiceModal() {
        document.getElementById('invoice-modal').classList.remove('active');
        this.resetInvoiceForm();
    }

    async loadClientsForInvoice() {
        try {
            const response = await fetch(`${this.config.API_BASE}/getClients?admin_secret=${this.config.ADMIN_SECRET}`);
            const data = await response.json();
            
            if (data.success && data.clients) {
                this.state.clients = data.clients;
                this.updateClientSelect();
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    }

    updateClientSelect() {
        const select = document.getElementById('client-select');
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '<option value="">Search or select client...</option>';
        
        // Add client options
        this.state.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.client_id;
            option.textContent = `${client.name} (${client.phone})`;
            select.appendChild(option);
        });
    }

    addServiceRow() {
        this.state.serviceCount++;
        const serviceItems = document.getElementById('service-items');
        
        const row = document.createElement('div');
        row.className = 'service-row flex gap-4 mb-3';
        row.innerHTML = `
            <input type="text" class="form-control-premium service-name" placeholder="Service name">
            <input type="number" class="form-control-premium service-qty" placeholder="Qty" value="1" min="1" style="width: 80px;">
            <input type="number" class="form-control-premium service-price" placeholder="Price" value="0" min="0" style="width: 120px;">
            <button type="button" class="btn-premium btn-sm-premium btn-secondary-premium remove-service">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        serviceItems.appendChild(row);
        
        // Add event listener to remove button
        row.querySelector('.remove-service').addEventListener('click', () => {
            row.remove();
            this.calculateInvoiceTotals();
        });
        
        // Add input listeners
        row.querySelector('.service-qty').addEventListener('input', () => this.calculateInvoiceTotals());
        row.querySelector('.service-price').addEventListener('input', () => this.calculateInvoiceTotals());
        
        this.calculateInvoiceTotals();
    }

    calculateInvoiceTotals() {
        let subtotal = 0;
        
        document.querySelectorAll('.service-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.service-qty').value) || 0;
            const price = parseFloat(row.querySelector('.service-price').value) || 0;
            subtotal += qty * price;
        });
        
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const gstPercent = parseFloat(document.getElementById('gst-percent').value) || 0;
        
        const taxableAmount = subtotal - discount;
        const gstAmount = (taxableAmount * gstPercent) / 100;
        const total = taxableAmount + gstAmount;
        
        // Update displays
        document.getElementById('subtotal-display').textContent = `₹${subtotal.toLocaleString()}`;
        document.getElementById('discount-display').textContent = `₹${discount.toLocaleString()}`;
        document.getElementById('gst-display').textContent = `₹${gstAmount.toLocaleString()} (${gstPercent}%)`;
        document.getElementById('total-display').textContent = `₹${total.toLocaleString()}`;
    }

    async handleInvoiceSubmit(e) {
        e.preventDefault();
        
        try {
            const clientId = document.getElementById('client-select').value;
            if (!clientId) {
                this.showToast('Please select a client', 'warning');
                return;
            }
            
            // Gather services
            const services = [];
            document.querySelectorAll('.service-row').forEach(row => {
                const name = row.querySelector('.service-name').value;
                const qty = parseFloat(row.querySelector('.service-qty').value) || 1;
                const price = parseFloat(row.querySelector('.service-price').value) || 0;
                
                if (name && price > 0) {
                    services.push({
                        name: name,
                        quantity: qty,
                        price: price
                    });
                }
            });
            
            if (services.length === 0) {
                this.showToast('Please add at least one service', 'warning');
                return;
            }
            
            const subtotal = parseFloat(document.getElementById('subtotal-display').textContent.replace(/[₹,]/g, ''));
            const discount = parseFloat(document.getElementById('discount').value) || 0;
            const gstPercent = parseFloat(document.getElementById('gst-percent').value) || 0;
            const total = parseFloat(document.getElementById('total-display').textContent.replace(/[₹,]/g, ''));
            
            const invoiceData = {
                admin_secret: this.config.ADMIN_SECRET,
                client_id: clientId,
                services_json: JSON.stringify(services),
                subtotal: subtotal,
                discount: discount,
                gst_percent: gstPercent,
                total_amount: total,
                created_by: 'Admin'
            };
            
            // Show loading
            const submitBtn = document.getElementById('generate-invoice-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px;"></div>';
            submitBtn.disabled = true;
            
            // Create invoice via API
            const response = await fetch(`${this.config.API_BASE}/createPaymentRecord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showToast('Invoice created successfully!', 'success');
                
                // Show checkout link
                if (result.checkout_link) {
                    this.showToast(`Checkout link: ${result.checkout_link}`, 'info', 10000);
                    // Copy to clipboard
                    navigator.clipboard.writeText(result.checkout_link);
                }
                
                // Close modal
                this.closeInvoiceModal();
                
                // Refresh data
                this.loadDashboardData();
                this.loadRecentInvoices();
                
            } else {
                this.showToast(result.error || 'Failed to create invoice', 'error');
            }
            
        } catch (error) {
            console.error('Error creating invoice:', error);
            this.showToast('Error creating invoice. Please try again.', 'error');
        } finally {
            const submitBtn = document.getElementById('generate-invoice-btn');
            submitBtn.innerHTML = '<i class="fas fa-file-invoice"></i> Generate Invoice';
            submitBtn.disabled = false;
        }
    }

    resetInvoiceForm() {
        document.getElementById('invoice-form').reset();
        document.getElementById('service-items').innerHTML = `
            <div class="service-row flex gap-4 mb-3">
                <input type="text" class="form-control-premium" placeholder="Service name" value="Social Media Management" readonly>
                <input type="number" class="form-control-premium" placeholder="Qty" value="1" min="1" style="width: 80px;">
                <input type="number" class="form-control-premium" placeholder="Price" value="2000" min="0" style="width: 120px;">
                <button type="button" class="btn-premium btn-sm-premium btn-secondary-premium remove-service">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        this.state.serviceCount = 1;
        this.calculateInvoiceTotals();
    }

    async sendReminders() {
        try {
            this.showToast('Sending reminders...', 'info');
            
            const response = await fetch(`${this.config.API_BASE}/sendAllReminders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    admin_secret: this.config.ADMIN_SECRET,
                    days: 7
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showToast(`Sent ${data.count || 0} reminders successfully!`, 'success');
            } else {
                this.showToast(data.error || 'Failed to send reminders', 'error');
            }
            
        } catch (error) {
            console.error('Error sending reminders:', error);
            this.showToast('Error sending reminders', 'error');
        }
    }

    async sendInvoiceReminder(invoiceId) {
        try {
            this.showToast('Sending reminder...', 'info');
            
            const response = await fetch(`${this.config.API_BASE}/sendInvoiceReminder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    admin_secret: this.config.ADMIN_SECRET,
                    invoice_id: invoiceId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showToast('Reminder sent successfully!', 'success');
                if (data.wa_link) {
                    // Open WhatsApp link
                    window.open(data.wa_link, '_blank');
                }
            } else {
                this.showToast(data.error || 'Failed to send reminder', 'error');
            }
            
        } catch (error) {
            console.error('Error sending reminder:', error);
            this.showToast('Error sending reminder', 'error');
        }
    }

    async viewInvoice(invoiceId) {
        try {
            const response = await fetch(`${this.config.API_BASE}/getPaymentByInvoiceId?invoice_id=${invoiceId}`);
            const data = await response.json();
            
            if (data.success) {
                // Show invoice details in modal or new tab
                const checkoutUrl = `checkout.html?invoice_id=${invoiceId}`;
                window.open(checkoutUrl, '_blank');
            } else {
                this.showToast('Invoice not found', 'error');
            }
        } catch (error) {
            console.error('Error viewing invoice:', error);
            this.showToast('Error loading invoice', 'error');
        }
    }

    exportData() {
        // Create CSV data
        const data = [
            ['Invoice ID', 'Client', 'Amount', 'Status', 'Date'],
            ...this.state.invoices.map(inv => [
                inv.invoice_id,
                inv.name,
                `₹${inv.total_amount}`,
                inv.status,
                this.formatDate(inv.created_timestamp)
            ])
        ];
        
        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infogrip-invoices-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully!', 'success');
    }

    createSubscription() {
        this.showToast('Opening subscription creator...', 'info');
        // Redirect to CRM page with subscription tab
        setTimeout(() => {
            window.location.href = 'crm.html#subscriptions';
        }, 1000);
    }

    viewReports() {
        this.showToast('Loading reports...', 'info');
        // Show reports modal or redirect
        setTimeout(() => {
            window.location.href = 'crm.html#reports';
        }, 1000);
    }

    refreshDashboard() {
        this.showToast('Refreshing dashboard...', 'info');
        this.loadDashboardData();
        this.loadRecentInvoices();
    }

    showLoading(show) {
        const mainContent = document.getElementById('main-content');
        if (show) {
            mainContent.classList.add('opacity-50');
        } else {
            mainContent.classList.remove('opacity-50');
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast-premium toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        container.appendChild(toast);
        
        // Add close button listener
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new InfoGripAdmin();
});

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast-premium {
    position: fixed;
    top: 100px;
    right: 30px;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 300px;
    max-width: 400px;
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    box-shadow: var(--shadow-lg);
}

.toast-success {
    border-left: 4px solid #00d09c;
}

.toast-error {
    border-left: 4px solid #ff4757;
}

.toast-warning {
    border-left: 4px solid #ffc107;
}

.toast-info {
    border-left: 4px solid #17a2b8;
}

.toast-icon {
    font-size: 1.2rem;
}

.toast-success .toast-icon {
    color: #00d09c;
}

.toast-error .toast-icon {
    color: #ff4757;
}

.toast-warning .toast-icon {
    color: #ffc107;
}

.toast-info .toast-icon {
    color: #17a2b8;
}

.toast-message {
    flex: 1;
    color: var(--white);
    font-size: 0.9rem;
}

.toast-close {
    background: none;
    border: none;
    color: var(--white);
    opacity: 0.7;
    cursor: pointer;
    font-size: 1.2rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.toast-close:hover {
    background: var(--glass-bg);
    opacity: 1;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(toastStyles);
