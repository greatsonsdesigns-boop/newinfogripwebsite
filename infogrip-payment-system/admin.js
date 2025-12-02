// Configuration
const CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/AKfycbx07QetFwOnkrHlNs2XWHKJUf-FVamBxzvr_ea75x1aJvV1A2wfsBIM3LkZZJfnalm5/exec',
    ADMIN_SECRET: localStorage.getItem('admin_secret') || '',
    RAZORPAY_KEY_ID: 'rzp_test_RmL6IMlQKxUoC3',
    DEFAULT_SERVICES: [
        { name: 'Social Media Management', price: 2000 },
        { name: 'Website Development', price: 3999 },
        { name: 'Video Editing', price: 1000 },
        { name: 'Logo Design', price: 500 },
        { name: 'Hosting Services', price: 499 },
        { name: 'Ads Campaign Management', price: 1500 },
        { name: 'SEO Services', price: 3000 },
        { name: 'Content Writing', price: 800 }
    ]
};

// DOM Elements
const elements = {
    // Dashboard KPIs
    totalRevenue: document.getElementById('total-revenue'),
    pendingInvoices: document.getElementById('pending-invoices'),
    activeClients: document.getElementById('active-clients'),
    renewalsDue: document.getElementById('renewals-due'),
    
    // Charts
    revenueChart: null,
    paymentChart: null,
    
    // Tables
    paymentsBody: document.getElementById('payments-body'),
    renewalsBody: document.getElementById('renewals-body'),
    
    // Modals
    invoiceModal: document.getElementById('invoice-modal'),
    clientModal: document.getElementById('client-modal'),
    
    // Forms
    invoiceForm: document.getElementById('invoice-form'),
    clientForm: document.getElementById('client-form'),
    
    // Buttons
    newInvoiceBtn: document.getElementById('new-invoice'),
    refreshPaymentsBtn: document.getElementById('refresh-payments'),
    sendBulkRemindersBtn: document.getElementById('send-bulk-reminders'),
    
    // Service items
    serviceItems: document.getElementById('service-items'),
    addServiceBtn: document.getElementById('add-service'),
    
    // Totals display
    subtotalDisplay: document.getElementById('subtotal-display'),
    discountDisplay: document.getElementById('discount-display'),
    gstDisplay: document.getElementById('gst-display'),
    totalDisplay: document.getElementById('total-display')
};

// State
let state = {
    clients: [],
    payments: [],
    subscriptions: [],
    currentPage: 1,
    totalPages: 1,
    serviceRows: 1
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initHamburger();
    initModals();
    initInvoiceForm();
    initCharts();
    loadDashboardData();
    loadClients();
    loadPayments();
    loadSubscriptions();
});

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}

// Mobile Menu
function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Modal Management
function initModals() {
    // Invoice Modal
    elements.newInvoiceBtn?.addEventListener('click', () => {
        elements.invoiceModal.classList.add('active');
    });
    
    document.getElementById('close-invoice-modal')?.addEventListener('click', () => {
        elements.invoiceModal.classList.remove('active');
        resetInvoiceForm();
    });
    
    document.getElementById('cancel-invoice')?.addEventListener('click', () => {
        elements.invoiceModal.classList.remove('active');
        resetInvoiceForm();
    });
    
    // Client Modal
    document.getElementById('add-client-btn')?.addEventListener('click', () => {
        elements.clientModal.classList.add('active');
    });
    
    document.getElementById('close-client-modal')?.addEventListener('click', () => {
        elements.clientModal.classList.remove('active');
        resetClientForm();
    });
    
    document.getElementById('cancel-client')?.addEventListener('click', () => {
        elements.clientModal.classList.remove('active');
        resetClientForm();
    });
    
    // Close modals on overlay click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                if (modal.id === 'invoice-modal') resetInvoiceForm();
                if (modal.id === 'client-modal') resetClientForm();
            }
        });
    });
}

// Invoice Form
function initInvoiceForm() {
    // Add first service row
    addServiceRow();
    
    // Add service button
    elements.addServiceBtn?.addEventListener('click', addServiceRow);
    
    // Client select change
    document.getElementById('client-select')?.addEventListener('change', function() {
        const clientId = this.value;
        if (clientId) {
            const client = state.clients.find(c => c.client_id === clientId);
            if (client) {
                populateClientDetails(client);
            }
        }
    });
    
    // Calculate totals on input change
    document.addEventListener('input', calculateTotals);
    
    // Subscription toggle
    document.getElementById('is-subscription')?.addEventListener('change', function() {
        document.getElementById('subscription-details').classList.toggle('hidden', !this.checked);
    });
    
    // Form submission
    elements.invoiceForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await createInvoice();
    });
}

function addServiceRow() {
    const rowId = `service-${state.serviceRows}`;
    state.serviceRows++;
    
    const row = document.createElement('div');
    row.className = 'service-row grid grid-cols-5 gap-2 mb-2';
    row.id = rowId;
    
    row.innerHTML = `
        <select class="form-control service-name" required>
            <option value="">Select Service</option>
            ${CONFIG.DEFAULT_SERVICES.map(service => 
                `<option value="${service.name}" data-price="${service.price}">${service.name} (₹${service.price})</option>`
            ).join('')}
            <option value="custom">Other (Custom)</option>
        </select>
        <input type="text" class="form-control custom-service hidden" placeholder="Service name">
        <input type="number" class="form-control quantity" min="1" value="1" required>
        <input type="number" class="form-control price" min="0" step="0.01" required>
        <div class="flex items-center">
            <span class="line-total">₹0</span>
            <button type="button" class="btn btn-sm btn-danger ml-2 remove-service" data-row="${rowId}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    elements.serviceItems.appendChild(row);
    
    // Add event listeners
    const serviceSelect = row.querySelector('.service-name');
    const customInput = row.querySelector('.custom-service');
    const quantityInput = row.querySelector('.quantity');
    const priceInput = row.querySelector('.price');
    const removeBtn = row.querySelector('.remove-service');
    
    serviceSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customInput.classList.remove('hidden');
            priceInput.value = '';
        } else {
            customInput.classList.add('hidden');
            const selectedOption = this.options[this.selectedIndex];
            const defaultPrice = selectedOption.getAttribute('data-price');
            if (defaultPrice) {
                priceInput.value = defaultPrice;
            }
        }
        calculateTotals();
    });
    
    [quantityInput, priceInput].forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    removeBtn.addEventListener('click', function() {
        row.remove();
        calculateTotals();
    });
    
    calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;
    
    document.querySelectorAll('.service-row').forEach(row => {
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const lineTotal = quantity * price;
        
        row.querySelector('.line-total').textContent = `₹${lineTotal.toFixed(2)}`;
        subtotal += lineTotal;
    });
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const gstPercent = parseFloat(document.getElementById('gst-percent').value) || 0;
    
    const taxableAmount = subtotal - discount;
    const gstAmount = (taxableAmount * gstPercent) / 100;
    const total = taxableAmount + gstAmount;
    
    // Update displays
    elements.subtotalDisplay.textContent = `₹${subtotal.toFixed(2)}`;
    elements.discountDisplay.textContent = `₹${discount.toFixed(2)}`;
    elements.gstDisplay.textContent = `₹${gstAmount.toFixed(2)}`;
    elements.totalDisplay.textContent = `₹${total.toFixed(2)}`;
}

function populateClientDetails(client) {
    document.getElementById('client-name').value = client.name || '';
    document.getElementById('client-phone').value = client.phone || '';
    document.getElementById('client-email').value = client.email || '';
    document.getElementById('client-address').value = client.address || '';
    document.getElementById('client-details').classList.remove('hidden');
    
    // Populate services if client has defaults
    if (client.default_services_json) {
        try {
            const services = JSON.parse(client.default_services_json);
            if (Array.isArray(services) && services.length > 0) {
                // Clear existing service rows
                document.querySelectorAll('.service-row').forEach(row => row.remove());
                state.serviceRows = 1;
                
                // Add services
                services.forEach(service => {
                    addServiceRow();
                    const lastRow = document.querySelector('.service-row:last-child');
                    if (lastRow) {
                        const select = lastRow.querySelector('.service-name');
                        const customInput = lastRow.querySelector('.custom-service');
                        const priceInput = lastRow.querySelector('.price');
                        
                        // Check if service exists in defaults
                        const defaultService = CONFIG.DEFAULT_SERVICES.find(s => 
                            s.name.toLowerCase() === service.name.toLowerCase()
                        );
                        
                        if (defaultService) {
                            select.value = service.name;
                            priceInput.value = service.price || defaultService.price;
                        } else {
                            select.value = 'custom';
                            customInput.classList.remove('hidden');
                            customInput.value = service.name;
                            priceInput.value = service.price || 0;
                        }
                    }
                });
                
                // Set default amount if exists
                if (client.default_amount) {
                    calculateTotals();
                }
            }
        } catch (e) {
            console.error('Error parsing client services:', e);
        }
    }
}

async function createInvoice() {
    try {
        // Gather data
        const clientSelect = document.getElementById('client-select');
        const isNewClient = clientSelect.value === 'new';
        
        const clientData = {
            name: document.getElementById('client-name').value,
            phone: document.getElementById('client-phone').value,
            email: document.getElementById('client-email').value,
            address: document.getElementById('client-address').value
        };
        
        // Gather services
        const services = [];
        document.querySelectorAll('.service-row').forEach(row => {
            const serviceSelect = row.querySelector('.service-name');
            const customInput = row.querySelector('.custom-service');
            const quantity = parseFloat(row.querySelector('.quantity').value) || 1;
            const price = parseFloat(row.querySelector('.price').value) || 0;
            
            let serviceName = serviceSelect.value;
            if (serviceSelect.value === 'custom') {
                serviceName = customInput.value;
            }
            
            if (serviceName && price > 0) {
                services.push({
                    name: serviceName,
                    quantity: quantity,
                    price: price,
                    total: quantity * price
                });
            }
        });
        
        if (services.length === 0) {
            showAlert('Please add at least one service', 'danger');
            return;
        }
        
        const subtotal = parseFloat(elements.subtotalDisplay.textContent.replace('₹', ''));
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const gstPercent = parseFloat(document.getElementById('gst-percent').value) || 0;
        const total = parseFloat(elements.totalDisplay.textContent.replace('₹', ''));
        
        const invoiceData = {
            admin_secret: CONFIG.ADMIN_SECRET,
            client: isNewClient ? clientData : null,
            client_id: isNewClient ? null : clientSelect.value,
            services_json: JSON.stringify(services),
            subtotal: subtotal,
            discount: discount,
            gst_percent: gstPercent,
            total_amount: total,
            created_by: 'Admin',
            is_subscription: document.getElementById('is-subscription').checked,
            billing_cycle: document.getElementById('billing-cycle').value,
            auto_renew: document.getElementById('auto-renew').value,
            reminder_days_before: 7
        };
        
        // Show loading
        const submitBtn = document.getElementById('generate-invoice');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner"></div>';
        submitBtn.disabled = true;
        
        // Call API
        const response = await fetch(`${CONFIG.API_BASE}/createPaymentRecord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Invoice created successfully!', 'success');
            
            // Generate checkout link
            const checkoutUrl = `${window.location.origin}/checkout.html?invoice_id=${result.invoice_id}`;
            
            // Show checkout link
            showAlert(`Checkout Link: <a href="${checkoutUrl}" target="_blank">${checkoutUrl}</a>`, 'info');
            
            // Close modal
            elements.invoiceModal.classList.remove('active');
            resetInvoiceForm();
            
            // Refresh payments
            loadPayments();
        } else {
            showAlert(result.error || 'Failed to create invoice', 'danger');
        }
        
    } catch (error) {
        console.error('Error creating invoice:', error);
        showAlert('Error creating invoice. Please try again.', 'danger');
    } finally {
        const submitBtn = document.getElementById('generate-invoice');
        submitBtn.innerHTML = '<i class="fas fa-file-invoice"></i> Generate Invoice';
        submitBtn.disabled = false;
    }
}

function resetInvoiceForm() {
    elements.invoiceForm.reset();
    elements.serviceItems.innerHTML = '';
    state.serviceRows = 1;
    addServiceRow();
    calculateTotals();
    document.getElementById('client-details').classList.add('hidden');
    document.getElementById('subscription-details').classList.add('hidden');
}

// Client Form
function resetClientForm() {
    elements.clientForm.reset();
}

// Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/getDashboardStats?admin_secret=${CONFIG.ADMIN_SECRET}`);
        const data = await response.json();
        
        if (data.success) {
            // Update KPIs
            elements.totalRevenue.textContent = `₹${data.total_revenue || 0}`;
            elements.pendingInvoices.textContent = data.pending_invoices || 0;
            elements.activeClients.textContent = data.active_clients || 0;
            elements.renewalsDue.textContent = data.renewals_due || 0;
            
            // Update charts if they exist
            if (data.revenue_data && elements.revenueChart) {
                updateRevenueChart(data.revenue_data);
            }
            
            if (data.payment_stats && elements.paymentChart) {
                updatePaymentChart(data.payment_stats);
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadClients() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/getClients?admin_secret=${CONFIG.ADMIN_SECRET}`);
        const data = await response.json();
        
        if (data.success) {
            state.clients = data.clients || [];
            updateClientSelect();
        }
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

function updateClientSelect() {
    const select = document.getElementById('client-select');
    if (!select) return;
    
    // Clear options except first
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add client options
    state.clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.client_id;
        option.textContent = `${client.name} (${client.phone})`;
        select.appendChild(option);
    });
    
    // Add "Add New Client" option
    const newOption = document.createElement('option');
    newOption.value = 'new';
    newOption.textContent = '+ Add New Client';
    select.appendChild(newOption);
}

async function loadPayments() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/getPayments?admin_secret=${CONFIG.ADMIN_SECRET}&page=${state.currentPage}`);
        const data = await response.json();
        
        if (data.success) {
            state.payments = data.payments || [];
            state.totalPages = data.total_pages || 1;
            updatePaymentsTable();
        }
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

function updatePaymentsTable() {
    const tbody = elements.paymentsBody;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    state.payments.forEach(payment => {
        const row = document.createElement('tr');
        
        // Status badge
        let statusBadge = '';
        if (payment.status === 'Paid') {
            statusBadge = '<span class="badge badge-success">Paid</span>';
        } else if (payment.status === 'Pending') {
            statusBadge = '<span class="badge badge-warning">Pending</span>';
        } else {
            statusBadge = '<span class="badge badge-danger">Failed</span>';
        }
        
        // Format date
        const date = new Date(payment.created_timestamp).toLocaleDateString();
        
        row.innerHTML = `
            <td>${payment.invoice_id}</td>
            <td>${payment.name}</td>
            <td>₹${payment.total_amount}</td>
            <td>${statusBadge}</td>
            <td>${date}</td>
            <td>
                <button class="btn btn-sm btn-outline view-payment" data-id="${payment.invoice_id}">
                    <i class="fas fa-eye"></i>
                </button>
                ${payment.status === 'Pending' ? `
                    <button class="btn btn-sm btn-primary send-reminder" data-id="${payment.invoice_id}">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                ` : ''}
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-payment').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            viewPaymentDetails(invoiceId);
        });
    });
    
    document.querySelectorAll('.send-reminder').forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            sendReminder(invoiceId);
        });
    });
}

async function loadSubscriptions() {
    try {
        const days = document.getElementById('renewal-period')?.value || 7;
        const response = await fetch(`${CONFIG.API_BASE}/getExpiringSubscriptions?admin_secret=${CONFIG.ADMIN_SECRET}&days=${days}`);
        const data = await response.json();
        
        if (data.success) {
            state.subscriptions = data.subscriptions || [];
            updateSubscriptionsTable();
        }
    } catch (error) {
        console.error('Error loading subscriptions:', error);
    }
}

function updateSubscriptionsTable() {
    const tbody = elements.renewalsBody;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    state.subscriptions.forEach(sub => {
        const row = document.createElement('tr');
        
        // Format dates
        const dueDate = new Date(sub.next_billing_date).toLocaleDateString();
        const daysUntilDue = Math.ceil((new Date(sub.next_billing_date) - new Date()) / (1000 * 60 * 60 * 24));
        
        // Status indicator
        let statusClass = '';
        if (daysUntilDue <= 3) {
            statusClass = 'text-danger font-bold';
        } else if (daysUntilDue <= 7) {
            statusClass = 'text-warning font-bold';
        }
        
        row.innerHTML = `
            <td>${sub.client_name || 'N/A'}</td>
            <td>${sub.service_name}</td>
            <td>₹${sub.amount}</td>
            <td class="${statusClass}">${dueDate} (${daysUntilDue} days)</td>
            <td>${sub.auto_renew}</td>
            <td>
                <button class="btn btn-sm btn-primary send-renewal-reminder" data-id="${sub.subscription_id}">
                    <i class="fas fa-bell"></i>
                </button>
                <button class="btn btn-sm btn-outline view-subscription" data-id="${sub.subscription_id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.send-renewal-reminder').forEach(btn => {
        btn.addEventListener('click', function() {
            const subId = this.getAttribute('data-id');
            sendSubscriptionReminder(subId);
        });
    });
}

// Charts
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        elements.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Revenue',
                    data: [],
                    borderColor: '#07217c',
                    backgroundColor: 'rgba(7, 33, 124, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Payment Chart
    const paymentCtx = document.getElementById('paymentChart');
    if (paymentCtx) {
        elements.paymentChart = new Chart(paymentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Paid', 'Pending', 'Failed'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545'
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
    }
}

function updateRevenueChart(data) {
    if (!elements.revenueChart) return;
    
    elements.revenueChart.data.labels = data.labels || [];
    elements.revenueChart.data.datasets[0].data = data.values || [];
    elements.revenueChart.update();
}

function updatePaymentChart(stats) {
    if (!elements.paymentChart) return;
    
    elements.paymentChart.data.datasets[0].data = [
        stats.paid || 0,
        stats.pending || 0,
        stats.failed || 0
    ];
    elements.paymentChart.update();
}

// Utility Functions
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'float-right text-lg font-bold';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => alertDiv.remove();
    alertDiv.appendChild(closeBtn);
    
    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

async function viewPaymentDetails(invoiceId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/getPaymentByInvoiceId?invoice_id=${invoiceId}`);
        const data = await response.json();
        
        if (data.success) {
            // Show details in modal or new page
            const details = JSON.stringify(data.payment, null, 2);
            showAlert(`<pre>${details}</pre>`, 'info');
        }
    } catch (error) {
        console.error('Error viewing payment:', error);
    }
}

async function sendReminder(invoiceId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/sendInvoiceReminder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_secret: CONFIG.ADMIN_SECRET,
                invoice_id: invoiceId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Reminder sent successfully!', 'success');
            if (data.wa_link) {
                showAlert(`WhatsApp Link: <a href="${data.wa_link}" target="_blank">Click to open WhatsApp</a>`, 'info');
            }
        } else {
            showAlert(data.error || 'Failed to send reminder', 'danger');
        }
    } catch (error) {
        console.error('Error sending reminder:', error);
        showAlert('Error sending reminder', 'danger');
    }
}

async function sendSubscriptionReminder(subscriptionId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/sendSubscriptionReminder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_secret: CONFIG.ADMIN_SECRET,
                subscription_id: subscriptionId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Subscription reminder sent successfully!', 'success');
            if (data.checkout_link) {
                showAlert(`Renewal Link: <a href="${data.checkout_link}" target="_blank">${data.checkout_link}</a>`, 'info');
            }
        } else {
            showAlert(data.error || 'Failed to send reminder', 'danger');
        }
    } catch (error) {
        console.error('Error sending subscription reminder:', error);
        showAlert('Error sending reminder', 'danger');
    }
}

// Event Listeners for Refresh Buttons
elements.refreshPaymentsBtn?.addEventListener('click', loadPayments);
elements.sendBulkRemindersBtn?.addEventListener('click', async () => {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/sendBulkReminders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_secret: CONFIG.ADMIN_SECRET,
                days: document.getElementById('renewal-period').value
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(`Sent ${data.count || 0} reminders successfully!`, 'success');
            loadSubscriptions();
        } else {
            showAlert(data.error || 'Failed to send bulk reminders', 'danger');
        }
    } catch (error) {
        console.error('Error sending bulk reminders:', error);
        showAlert('Error sending bulk reminders', 'danger');
    }
});

// Period selector changes
document.getElementById('revenue-period')?.addEventListener('change', function() {
    loadDashboardData();
});

document.getElementById('renewal-period')?.addEventListener('change', function() {
    loadSubscriptions();
});

// Pagination
document.getElementById('load-more-payments')?.addEventListener('click', function() {
    if (state.currentPage < state.totalPages) {
        state.currentPage++;
        loadPayments();
    }
});

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Export function for use in other files
window.InfoGripAdmin = {
    CONFIG,
    showAlert,
    loadDashboardData,
    loadPayments,
    loadSubscriptions
};
