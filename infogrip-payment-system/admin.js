// Configuration
const CONFIG = {
    API_BASE: 'YOUR_APPS_SCRIPT_WEB_APP_URL', // Will be set during deployment
    ADMIN_SECRET: 'YOUR_ADMIN_SECRET_KEY', // Will be set during deployment
    BASE_URL: 'YOUR_BASE_URL', // Will be set during deployment
    DEFAULT_SERVICES: [
        { name: 'Social Media Management', price: 2000 },
        { name: 'Website Development', price: 3999 },
        { name: 'Video Editing', price: 1000 },
        { name: 'Logo Design', price: 500 },
        { name: 'Google My Business Setup', price: 999 },
        { name: 'Hosting', price: 499 },
        { name: 'Ads Campaign Management', price: 1500 },
        { name: 'Political Branding', price: 2500 },
        { name: 'Personal Branding', price: 2000 }
    ]
};

// State Management
let state = {
    currentAdmin: null,
    clients: [],
    payments: [],
    services: [...CONFIG.DEFAULT_SERVICES],
    currentInvoice: null
};

// DOM Elements
const elements = {
    // Login
    loginScreen: document.getElementById('loginScreen'),
    adminDashboard: document.getElementById('adminDashboard'),
    loginForm: document.getElementById('loginForm'),
    loginError: document.getElementById('loginError'),
    
    // Navigation
    adminName: document.getElementById('adminName'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Tabs
    tabButtons: document.querySelectorAll('[data-tab]'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Stats
    totalClients: document.getElementById('totalClients'),
    monthlyRevenue: document.getElementById('monthlyRevenue'),
    paymentsToday: document.getElementById('paymentsToday'),
    pendingPayments: document.getElementById('pendingPayments'),
    
    // Clients Tab
    clientsTableBody: document.getElementById('clientsTableBody'),
    addClientBtn: document.getElementById('addClientBtn'),
    clientSearch: document.getElementById('clientSearch'),
    exportClientsBtn: document.getElementById('exportClientsBtn'),
    importClientsBtn: document.getElementById('importClientsBtn'),
    
    // Payments Tab
    clientSelect: document.getElementById('clientSelect'),
    saveNewClient: document.getElementById('saveNewClient'),
    newClientForm: document.getElementById('newClientForm'),
    servicesContainer: document.getElementById('servicesContainer'),
    addServiceBtn: document.getElementById('addServiceBtn'),
    subtotalAmount: document.getElementById('subtotalAmount'),
    discountAmount: document.getElementById('discountAmount'),
    discountType: document.getElementById('discountType'),
    discountDisplay: document.getElementById('discountDisplay'),
    gstPercent: document.getElementById('gstPercent'),
    gstAmount: document.getElementById('gstAmount'),
    totalAmount: document.getElementById('totalAmount'),
    generateInvoiceBtn: document.getElementById('generateInvoiceBtn'),
    previewInvoiceBtn: document.getElementById('previewInvoiceBtn'),
    
    // History Tab
    paymentsTableBody: document.getElementById('paymentsTableBody'),
    filterDateFrom: document.getElementById('filterDateFrom'),
    filterDateTo: document.getElementById('filterDateTo'),
    filterStatus: document.getElementById('filterStatus'),
    filterClient: document.getElementById('filterClient'),
    applyFiltersBtn: document.getElementById('applyFiltersBtn'),
    exportPaymentsBtn: document.getElementById('exportPaymentsBtn'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    
    // Modals
    modals: document.querySelectorAll('.modal'),
    clientModal: document.getElementById('clientModal'),
    clientForm: document.getElementById('clientForm'),
    previewModal: document.getElementById('previewModal'),
    checkoutModal: document.getElementById('checkoutModal'),
    invoicePreviewContent: document.getElementById('invoicePreviewContent'),
    checkoutContent: document.getElementById('checkoutContent')
};

// Utility Functions
const utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    },

    generateInvoiceId() {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `INFO-${dateStr}-${random}`;
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\D/g, ''));
    },

    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10 ? `91${cleaned}` : cleaned;
    },

    showAlert(message, type = 'error') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// API Functions
const api = {
    async request(endpoint, data = {}) {
        const url = `${CONFIG.API_BASE}?action=${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    admin_secret: CONFIG.ADMIN_SECRET
                })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Admin Methods
    async login(email, password) {
        return this.request('adminLogin', { email, password });
    },

    // Client Methods
    async getClients() {
        return this.request('getClients');
    },

    async saveClient(clientData) {
        return this.request('saveClient', clientData);
    },

    async deleteClient(clientId) {
        return this.request('deleteClient', { client_id: clientId });
    },

    // Payment Methods
    async createPayment(paymentData) {
        return this.request('createPayment', paymentData);
    },

    async getPayments(filters = {}) {
        return this.request('getPayments', filters);
    },

    async getPaymentByInvoiceId(invoiceId) {
        return this.request('getPaymentByInvoiceId', { invoice_id: invoiceId });
    },

    // Razorpay Methods
    async createRazorpayOrder(invoiceId) {
        return this.request('createRazorpayOrder', { invoice_id: invoiceId });
    },

    async confirmPayment(paymentData) {
        return this.request('confirmPayment', paymentData);
    }
};

// Service Management
const serviceManager = {
    services: [],
    
    init() {
        this.services = [...CONFIG.DEFAULT_SERVICES];
        this.renderServiceOptions();
    },

    renderServiceOptions() {
        const serviceSelects = document.querySelectorAll('select.service-select');
        serviceSelects.forEach(select => {
            select.innerHTML = '<option value="">Select Service</option>' +
                this.services.map(service => 
                    `<option value="${service.name}" data-price="${service.price}">${service.name} - ₹${service.price}</option>`
                ).join('');
        });
    },

    addServiceRow(container) {
        const row = document.createElement('div');
        row.className = 'service-row';
        row.innerHTML = `
            <select class="form-control service-select">
                <option value="">Select Service</option>
                ${this.services.map(service => 
                    `<option value="${service.name}" data-price="${service.price}">${service.name} - ₹${service.price}</option>`
                ).join('')}
            </select>
            <input type="number" class="form-control service-qty" value="1" min="1">
            <input type="number" class="form-control service-price" placeholder="Unit Price" min="0" step="0.01">
            <input type="text" class="form-control service-total" placeholder="Total" readonly>
            <button type="button" class="remove-service">&times;</button>
        `;
        
        container.appendChild(row);
        
        // Add event listeners
        const select = row.querySelector('.service-select');
        const qty = row.querySelector('.service-qty');
        const price = row.querySelector('.service-price');
        const total = row.querySelector('.service-total');
        const removeBtn = row.querySelector('.remove-service');
        
        select.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const defaultPrice = selectedOption.dataset.price;
            if (defaultPrice) {
                price.value = defaultPrice;
                this.calculateLineTotal(row);
                invoiceCalculator.calculateTotals();
            }
        });
        
        qty.addEventListener('input', () => {
            this.calculateLineTotal(row);
            invoiceCalculator.calculateTotals();
        });
        
        price.addEventListener('input', () => {
            this.calculateLineTotal(row);
            invoiceCalculator.calculateTotals();
        });
        
        removeBtn.addEventListener('click', () => {
            row.remove();
            invoiceCalculator.calculateTotals();
        });
        
        this.renderServiceOptions();
    },

    calculateLineTotal(row) {
        const qty = parseFloat(row.querySelector('.service-qty').value) || 0;
        const price = parseFloat(row.querySelector('.service-price').value) || 0;
        const total = row.querySelector('.service-total');
        total.value = (qty * price).toFixed(2);
    },

    getServicesData() {
        const rows = document.querySelectorAll('.service-row');
        const services = [];
        
        rows.forEach(row => {
            const select = row.querySelector('.service-select');
            const qty = row.querySelector('.service-qty');
            const price = row.querySelector('.service-price');
            const total = row.querySelector('.service-total');
            
            if (select.value && price.value) {
                services.push({
                    name: select.value,
                    qty: parseInt(qty.value) || 1,
                    unit_price: parseFloat(price.value) || 0,
                    line_total: parseFloat(total.value) || 0
                });
            }
        });
        
        return services;
    }
};

// Invoice Calculator
const invoiceCalculator = {
    calculateTotals() {
        const services = serviceManager.getServicesData();
        const subtotal = services.reduce((sum, service) => sum + service.line_total, 0);
        
        // Update subtotal
        elements.subtotalAmount.textContent = utils.formatCurrency(subtotal);
        
        // Calculate discount
        const discountValue = parseFloat(elements.discountAmount.value) || 0;
        let discountAmount = 0;
        
        if (elements.discountType.value === 'percent') {
            discountAmount = subtotal * (discountValue / 100);
        } else {
            discountAmount = discountValue;
        }
        
        elements.discountDisplay.textContent = utils.formatCurrency(discountAmount);
        
        // Calculate GST
        const gstPercent = parseFloat(elements.gstPercent.value) || 0;
        const gstAmount = (subtotal - discountAmount) * (gstPercent / 100);
        
        elements.gstAmount.textContent = utils.formatCurrency(gstAmount);
        
        // Calculate total
        const total = subtotal - discountAmount + gstAmount;
        elements.totalAmount.textContent = utils.formatCurrency(total);
        
        return {
            subtotal,
            discount: discountAmount,
            gst_percent: gstPercent,
            gst_amount: gstAmount,
            total
        };
    }
};

// Client Management
const clientManager = {
    async loadClients() {
        try {
            const result = await api.getClients();
            state.clients = result.clients || [];
            this.renderClientsTable();
            this.renderClientSelect();
            this.updateStats();
        } catch (error) {
            utils.showAlert('Failed to load clients: ' + error.message);
        }
    },

    renderClientsTable() {
        const searchTerm = elements.clientSearch.value.toLowerCase();
        const filteredClients = state.clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.phone.includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm)
        );

        elements.clientsTableBody.innerHTML = filteredClients.map(client => `
            <tr>
                <td>${client.client_id}</td>
                <td>${client.name}</td>
                <td>${client.phone}</td>
                <td>${client.email || '-'}</td>
                <td>${client.default_service || '-'}</td>
                <td>${client.billing_cycle || 'one-time'}</td>
                <td>
                    <button class="btn btn-outline edit-client" data-id="${client.client_id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline delete-client" data-id="${client.client_id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.edit-client').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clientId = e.target.closest('button').dataset.id;
                this.editClient(clientId);
            });
        });

        document.querySelectorAll('.delete-client').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clientId = e.target.closest('button').dataset.id;
                this.deleteClient(clientId);
            });
        });
    },

    renderClientSelect() {
        elements.clientSelect.innerHTML = '<option value="">Select existing client or create new</option>' +
            state.clients.map(client => 
                `<option value="${client.client_id}">${client.name} (${client.phone})</option>`
            ).join('');
    },

    async saveClient(clientData) {
        try {
            await api.saveClient(clientData);
            utils.showAlert('Client saved successfully!', 'success');
            this.loadClients();
            modalManager.closeModal('clientModal');
        } catch (error) {
            utils.showAlert('Failed to save client: ' + error.message);
        }
    },

    async deleteClient(clientId) {
        if (!confirm('Are you sure you want to delete this client?')) return;
        
        try {
            await api.deleteClient(clientId);
            utils.showAlert('Client deleted successfully!', 'success');
            this.loadClients();
        } catch (error) {
            utils.showAlert('Failed to delete client: ' + error.message);
        }
    },

    editClient(clientId) {
        const client = state.clients.find(c => c.client_id === clientId);
        if (!client) return;

        document.getElementById('clientModalTitle').textContent = 'Edit Client';
        document.getElementById('editClientId').value = client.client_id;
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientPhone').value = client.phone;
        document.getElementById('clientEmail').value = client.email || '';
        document.getElementById('clientAddress').value = client.address || '';
        document.getElementById('clientDefaultService').value = client.default_service || '';
        document.getElementById('clientDefaultAmount').value = client.default_amount || '';
        document.getElementById('clientBillingCycle').value = client.billing_cycle || 'one-time';
        document.getElementById('clientNotes').value = client.notes || '';

        modalManager.openModal('clientModal');
    }
};

// Payment Management
const paymentManager = {
    async loadPayments(filters = {}) {
        try {
            const result = await api.getPayments(filters);
            state.payments = result.payments || [];
            this.renderPaymentsTable();
            this.updateStats();
        } catch (error) {
            utils.showAlert('Failed to load payments: ' + error.message);
        }
    },

    renderPaymentsTable() {
        elements.paymentsTableBody.innerHTML = state.payments.map(payment => `
            <tr>
                <td>${payment.invoice_id}</td>
                <td>${payment.name}</td>
                <td>${utils.formatCurrency(payment.total_amount)}</td>
                <td>
                    <span class="status-badge status-${payment.status.toLowerCase()}">
                        ${payment.status}
                    </span>
                </td>
                <td>${utils.formatDate(payment.created_timestamp)}</td>
                <td>
                    <button class="btn btn-outline view-payment" data-id="${payment.invoice_id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${payment.status === 'Pending' ? `
                        <button class="btn btn-outline resend-link" data-id="${payment.invoice_id}">
                            <i class="fas fa-share"></i>
                        </button>
                    ` : ''}
                    ${payment.status === 'Paid' ? `
                        <button class="btn btn-outline resend-invoice" data-id="${payment.invoice_id}">
                            <i class="fas fa-envelope"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.view-payment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const invoiceId = e.target.closest('button').dataset.id;
                this.viewPayment(invoiceId);
            });
        });
    },

    async createPayment() {
        const clientId = elements.clientSelect.value;
        const services = serviceManager.getServicesData();
        const totals = invoiceCalculator.calculateTotals();
        
        // Validation
        if (services.length === 0) {
            utils.showAlert('Please add at least one service');
            return;
        }

        if (totals.total <= 0) {
            utils.showAlert('Total amount must be greater than 0');
            return;
        }

        // Prepare client data
        let clientData = {};
        if (clientId) {
            const client = state.clients.find(c => c.client_id === clientId);
            clientData = {
                client_id: clientId,
                name: client.name,
                phone: client.phone,
                email: client.email,
                address: client.address
            };
        } else {
            clientData = {
                name: document.getElementById('newClientName').value,
                phone: document.getElementById('newClientPhone').value,
                email: document.getElementById('newClientEmail').value,
                address: document.getElementById('newClientAddress').value
            };

            // Validate new client data
            if (!clientData.name || !clientData.phone) {
                utils.showAlert('Please fill in all required client information');
                return;
            }

            if (!utils.validatePhone(clientData.phone)) {
                utils.showAlert('Please enter a valid 10-digit phone number');
                return;
            }

            if (clientData.email && !utils.validateEmail(clientData.email)) {
                utils.showAlert('Please enter a valid email address');
                return;
            }
        }

        const paymentData = {
            ...clientData,
            services_json: JSON.stringify(services),
            subtotal: totals.subtotal,
            discount: totals.discount,
            gst_percent: totals.gst_percent,
            gst_amount: totals.gst_amount,
            total_amount: totals.total,
            save_client: elements.saveNewClient.checked
        };

        try {
            const result = await api.createPayment(paymentData);
            this.showCheckoutLink(result.invoice_id, result.checkout_link);
            utils.showAlert('Payment created successfully!', 'success');
            
            // Reset form
            this.resetPaymentForm();
            this.loadPayments();
        } catch (error) {
            utils.showAlert('Failed to create payment: ' + error.message);
        }
    },

    showCheckoutLink(invoiceId, checkoutLink) {
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(checkoutLink)}`;
        const whatsappMessage = `Hello! Here's your payment link for InfoGrip services: ${checkoutLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        const emailSubject = `Payment Link - InfoGrip Invoice ${invoiceId}`;
        const emailBody = `Dear Client,\n\nPlease use the following link to complete your payment:\n${checkoutLink}\n\nThank you,\nInfoGrip Media Solution`;

        elements.checkoutContent.innerHTML = `
            <div style="text-align: center;">
                <h4 style="margin-bottom: 15px; color: var(--success);">Checkout Link Generated!</h4>
                <p style="margin-bottom: 20px;">Invoice ID: <strong>${invoiceId}</strong></p>
                
                <div class="qr-container">
                    <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px; margin-bottom: 15px;">
                    <p>Scan to pay</p>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Checkout Link</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" class="form-control" value="${checkoutLink}" readonly>
                        <button class="btn btn-outline copy-link" data-link="${checkoutLink}">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-outline">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}" class="btn btn-outline">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                </div>
            </div>
        `;

        // Add copy functionality
        elements.checkoutContent.querySelector('.copy-link').addEventListener('click', (e) => {
            const link = e.target.closest('button').dataset.link;
            navigator.clipboard.writeText(link).then(() => {
                utils.showAlert('Link copied to clipboard!', 'success');
            });
        });

        modalManager.openModal('checkoutModal');
    },

    resetPaymentForm() {
        elements.servicesContainer.innerHTML = '';
        serviceManager.addServiceRow(elements.servicesContainer);
        elements.discountAmount.value = '0';
        elements.gstPercent.value = '0';
        invoiceCalculator.calculateTotals();
    },

    viewPayment(invoiceId) {
        // Open payment in new tab
        const checkoutLink = `${CONFIG.BASE_URL}/checkout.html?invoice_id=${invoiceId}`;
        window.open(checkoutLink, '_blank');
    }
};

// Modal Management
const modalManager = {
    init() {
        // Close modal when clicking overlay
        elements.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal when clicking close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.closest('button').dataset.modal;
                this.closeModal(modalId);
            });
        });
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// Tab Management
const tabManager = {
    init() {
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    },

    switchTab(tabName) {
        // Update active tab button
        elements.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        // Show active tab content
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}Tab`);
        });

        // Load data for the tab if needed
        if (tabName === 'clients') {
            clientManager.loadClients();
        } else if (tabName === 'history') {
            paymentManager.loadPayments();
        } else if (tabName === 'reports') {
            this.loadReports();
        }
    },

    loadReports() {
        // TODO: Implement reports with charts
        elements.reportsContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h4>Reports & Analytics</h4>
                <p>Advanced reporting features coming soon!</p>
                <div style="margin-top: 20px;">
                    <div class="card" style="display: inline-block; margin: 10px;">
                        <h5>Revenue Trend</h5>
                        <p>Chart will be displayed here</p>
                    </div>
                    <div class="card" style="display: inline-block; margin: 10px;">
                        <h5>Service Distribution</h5>
                        <p>Chart will be displayed here</p>
                    </div>
                </div>
            </div>
        `;
    }
};

// Stats Management
const statsManager = {
    updateStats() {
        // Total Clients
        elements.totalClients.textContent = state.clients.length;

        // Monthly Revenue (placeholder calculation)
        const monthlyRevenue = state.payments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.total_amount, 0);
        elements.monthlyRevenue.textContent = utils.formatCurrency(monthlyRevenue);

        // Payments Today (placeholder)
        const today = new Date().toDateString();
        const paymentsToday = state.payments.filter(p => 
            new Date(p.created_timestamp).toDateString() === today
        ).length;
        elements.paymentsToday.textContent = paymentsToday;

        // Pending Payments
        const pendingPayments = state.payments.filter(p => p.status === 'Pending').length;
        elements.pendingPayments.textContent = pendingPayments;
    }
};

// Authentication
const authManager = {
    async login(email, password) {
        try {
            const result = await api.login(email, password);
            
            if (result.success) {
                state.currentAdmin = result.admin;
                sessionStorage.setItem('adminSession', JSON.stringify({
                    email: email,
                    timestamp: Date.now()
                }));
                
                this.showDashboard();
                utils.showAlert('Login successful!', 'success');
            }
        } catch (error) {
            elements.loginError.textContent = error.message;
            elements.loginError.style.display = 'block';
        }
    },

    logout() {
        sessionStorage.removeItem('adminSession');
        state.currentAdmin = null;
        this.showLogin();
    },

    checkAuth() {
        const session = sessionStorage.getItem('adminSession');
        if (session) {
            const sessionData = JSON.parse(session);
            // Check if session is still valid (24 hours)
            if (Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                this.showDashboard();
                return true;
            }
        }
        this.showLogin();
        return false;
    },

    showLogin() {
        elements.loginScreen.style.display = 'flex';
        elements.adminDashboard.style.display = 'none';
    },

    showDashboard() {
        elements.loginScreen.style.display = 'none';
        elements.adminDashboard.style.display = 'block';
        elements.adminName.textContent = state.currentAdmin?.email || 'Admin';
        
        // Load initial data
        clientManager.loadClients();
        paymentManager.loadPayments();
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    modalManager.init();
    tabManager.init();
    serviceManager.init();
    
    // Set up event listeners
    
    // Login
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        authManager.login(email, password);
    });

    // Logout
    elements.logoutBtn.addEventListener('click', () => {
        authManager.logout();
    });

    // Client Search
    elements.clientSearch.addEventListener('input', 
        utils.debounce(() => clientManager.renderClientsTable(), 300)
    );

    // Add Client
    elements.addClientBtn.addEventListener('click', () => {
        document.getElementById('clientModalTitle').textContent = 'Add Client';
        document.getElementById('clientForm').reset();
        document.getElementById('editClientId').value = '';
        modalManager.openModal('clientModal');
    });

    // Client Form
    elements.clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientData = {
            client_id: document.getElementById('editClientId').value,
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value,
            default_service: document.getElementById('clientDefaultService').value,
            default_amount: document.getElementById('clientDefaultAmount').value,
            billing_cycle: document.getElementById('clientBillingCycle').value,
            notes: document.getElementById('clientNotes').value
        };
        clientManager.saveClient(clientData);
    });

    // Client Selection
    elements.clientSelect.addEventListener('change', function() {
        elements.newClientForm.style.display = this.value ? 'none' : 'block';
        
        if (this.value) {
            const client = state.clients.find(c => c.client_id === this.value);
            if (client && client.default_service) {
                // Auto-add default service
                const serviceRow = elements.servicesContainer.querySelector('.service-row');
                if (serviceRow) {
                    const select = serviceRow.querySelector('.service-select');
                    select.value = client.default_service;
                    select.dispatchEvent(new Event('change'));
                }
            }
        }
    });

    // Add Service
    elements.addServiceBtn.addEventListener('click', () => {
        serviceManager.addServiceRow(elements.servicesContainer);
    });

    // Calculate totals when discount/GST changes
    [elements.discountAmount, elements.discountType, elements.gstPercent].forEach(element => {
        element.addEventListener('input', () => {
            invoiceCalculator.calculateTotals();
        });
    });

    // Generate Invoice
    elements.generateInvoiceBtn.addEventListener('click', () => {
        paymentManager.createPayment();
    });

    // Preview Invoice
    elements.previewInvoiceBtn.addEventListener('click', () => {
        const services = serviceManager.getServicesData();
        const totals = invoiceCalculator.calculateTotals();
        
        if (services.length === 0) {
            utils.showAlert('Please add at least one service');
            return;
        }

        // Generate preview HTML
        const previewHTML = `
            <div style="padding: 20px; background: white; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png" alt="InfoGrip" style="height: 50px;">
                    <h3 style="margin: 10px 0;">INVOICE PREVIEW</h3>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div>
                        <h4>Bill To:</h4>
                        <p id="previewClientName">${elements.clientSelect.value ? 
                            state.clients.find(c => c.client_id === elements.clientSelect.value)?.name : 
                            document.getElementById('newClientName').value || 'Client Name'}</p>
                        <p id="previewClientPhone">${elements.clientSelect.value ? 
                            state.clients.find(c => c.client_id === elements.clientSelect.value)?.phone : 
                            document.getElementById('newClientPhone').value || ''}</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>Invoice ID:</strong> ${utils.generateInvoiceId()}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: var(--light-blue);">
                            <th style="padding: 10px; text-align: left;">Service</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Unit Price</th>
                            <th style="padding: 10px; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${services.map(service => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${service.name}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${service.qty}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${utils.formatCurrency(service.unit_price)}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${utils.formatCurrency(service.line_total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-left: auto; width: 300px;">
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Subtotal:</span>
                        <span>${utils.formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>Discount:</span>
                        <span>${utils.formatCurrency(totals.discount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                        <span>GST (${totals.gst_percent}%):</span>
                        <span>${utils.formatCurrency(totals.gst_amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid var(--blue); font-weight: bold; font-size: 1.1em;">
                        <span>Total:</span>
                        <span>${utils.formatCurrency(totals.total)}</span>
                    </div>
                </div>
            </div>
        `;

        elements.invoicePreviewContent.innerHTML = previewHTML;
        modalManager.openModal('previewModal');
    });

    // Payment Filters
    elements.applyFiltersBtn.addEventListener('click', () => {
        const filters = {
            date_from: elements.filterDateFrom.value,
            date_to: elements.filterDateTo.value,
            status: elements.filterStatus.value,
            client: elements.filterClient.value
        };
        paymentManager.loadPayments(filters);
    });

    elements.clearFiltersBtn.addEventListener('click', () => {
        elements.filterDateFrom.value = '';
        elements.filterDateTo.value = '';
        elements.filterStatus.value = '';
        elements.filterClient.value = '';
        paymentManager.loadPayments();
    });

    // Export functionality (placeholder)
    elements.exportClientsBtn.addEventListener('click', () => {
        utils.showAlert('Export feature will be implemented in the backend', 'info');
    });

    elements.exportPaymentsBtn.addEventListener('click', () => {
        utils.showAlert('Export feature will be implemented in the backend', 'info');
    });

    // Initialize with first service row
    serviceManager.addServiceRow(elements.servicesContainer);
    
    // Check authentication
    authManager.checkAuth();
});
