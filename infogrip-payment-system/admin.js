// Admin Panel JavaScript for InfoGrip Payment System
class AdminPanel {
    constructor() {
        // CONFIGURATION - UPDATE THESE VALUES
        this.API_CONFIG = {
            WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwlqmQnjGeovQPnSOll5efIPSBLshGzYUYlrGrDox4OW6SRmTJmj1PIB3L0IeG-I2KM/exec', // ← REPLACE WITH YOUR WEB APP URL
            ADMIN_SECRET: 'ig_infogrip_2025_secure_key_7x9a2b8c3d'
        };
        
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.clients = [];
        this.paymentLinks = [];
        this.paymentsHistory = [];
        this.currentInvoiceData = null;
        this.stats = {
            totalClients: 0,
            totalInvoices: 0,
            totalRevenue: 0,
            pendingPayments: 0
        };
        
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Load initial data if logged in
        if (this.currentUser) {
            this.loadDashboardData();
            this.loadClients();
            this.loadPaymentLinks();
            this.loadPaymentsHistory();
            this.setupServiceRows();
        }
    }

    checkLoginStatus() {
        const user = localStorage.getItem('adminUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('admin-dashboard').classList.remove('hidden');
        } else {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('admin-dashboard').classList.add('hidden');
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => this.toggleSidebar());
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        
        // Client management
        document.getElementById('add-client-btn').addEventListener('click', () => this.openClientModal());
        document.getElementById('client-modal-save').addEventListener('click', () => this.saveClient());
        document.getElementById('client-modal-close').addEventListener('click', () => this.closeClientModal());
        document.getElementById('client-modal-cancel').addEventListener('click', () => this.closeClientModal());
        
        // Payment form
        document.getElementById('client-select').addEventListener('change', (e) => this.handleClientSelect(e));
        document.getElementById('add-service-btn').addEventListener('click', () => this.addServiceRow());
        document.getElementById('gst-toggle').addEventListener('change', (e) => this.toggleGST(e));
        document.getElementById('gst-percent').addEventListener('input', () => this.calculateTotals());
        document.getElementById('discount-toggle').addEventListener('change', (e) => this.toggleDiscount(e));
        document.getElementById('discount-value').addEventListener('input', () => this.calculateTotals());
        document.getElementById('discount-type').addEventListener('change', () => this.calculateTotals());
        document.getElementById('payment-form').addEventListener('submit', (e) => this.generatePaymentLink(e));
        
        // Payment link actions
        document.getElementById('copy-link-btn').addEventListener('click', () => this.copyPaymentLink());
        document.getElementById('whatsapp-share-btn').addEventListener('click', () => this.shareViaWhatsApp());
        document.getElementById('email-share-btn').addEventListener('click', () => this.shareViaEmail());
        document.getElementById('preview-invoice-btn').addEventListener('click', () => this.previewInvoice());
        
        // Export buttons
        document.getElementById('export-clients-btn').addEventListener('click', () => this.exportClientsCSV());
        document.getElementById('export-payments-btn').addEventListener('click', () => this.exportPaymentsCSV());
        
        // Settings tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSettingsTab(e));
        });
        
        // Search functionality
        document.getElementById('client-search').addEventListener('input', (e) => this.searchClients(e));
        document.getElementById('payment-links-search').addEventListener('input', (e) => this.searchPaymentLinks(e));
        
        // Date filter
        document.getElementById('apply-date-filter').addEventListener('click', () => this.applyDateFilter());
        document.getElementById('reset-date-filter').addEventListener('click', () => this.resetDateFilter());
        
        // Modal close buttons
        document.getElementById('invoice-preview-close').addEventListener('click', () => this.closeInvoicePreview());
        document.getElementById('invoice-preview-close-btn').addEventListener('click', () => this.closeInvoicePreview());
        document.getElementById('download-invoice-preview').addEventListener('click', () => this.downloadInvoicePreview());
    }

    // API CALL FUNCTIONS
    async makeAPICall(endpoint, data = {}) {
        try {
            const payload = {
                endpoint: endpoint,
                secret: this.API_CONFIG.ADMIN_SECRET,
                ...data
            };

            console.log(`Making API call to ${endpoint}:`, payload);

            const response = await fetch(this.API_CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            console.log(`API response from ${endpoint}:`, result);
            return result;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            throw error;
        }
    }

    async makeGetAPICall(endpoint, params = {}) {
        try {
            const urlParams = new URLSearchParams(params);
            const url = `${this.API_CONFIG.WEB_APP_URL}?endpoint=${endpoint}&${urlParams.toString()}`;
            
            console.log(`Making GET API call to ${endpoint}:`, url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            return result;
        } catch (error) {
            console.error(`GET API call failed for ${endpoint}:`, error);
            throw error;
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication
        if (email === 'admin@infogrip.com' && password === 'admin123') {
            this.currentUser = { email, name: 'Admin' };
            localStorage.setItem('adminUser', JSON.stringify(this.currentUser));
            
            this.showNotification('Login successful!', 'success');
            this.checkLoginStatus();
            
            // Load data
            this.loadDashboardData();
            this.loadClients();
            this.loadPaymentLinks();
            this.loadPaymentsHistory();
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    handleLogout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        this.checkLoginStatus();
        this.showNotification('Logged out successfully', 'success');
    }

    handleNavigation(e) {
        e.preventDefault();
        
        const target = e.currentTarget;
        const section = target.getAttribute('data-section');
        
        // Update active nav item
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        target.classList.add('active');
        
        // Show selected section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`${section}-section`).classList.remove('hidden');
        
        this.currentSection = section;
        
        // Load section-specific data
        if (section === 'dashboard') {
            this.loadDashboardData();
        } else if (section === 'clients') {
            this.loadClients();
        } else if (section === 'payment-links') {
            this.loadPaymentLinks();
        } else if (section === 'payments-history') {
            this.loadPaymentsHistory();
        }
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.toggleSidebar(false);
        }
    }

    toggleSidebar(show) {
        const sidebar = document.getElementById('admin-sidebar');
        if (show !== undefined) {
            sidebar.classList.toggle('active', show);
        } else {
            sidebar.classList.toggle('active');
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        const formatted = now.toLocaleDateString('en-IN', options);
        document.querySelectorAll('.current-datetime').forEach(el => {
            el.textContent = formatted;
        });
    }

    async loadDashboardData() {
        try {
            // Load all data for dashboard
            await Promise.all([
                this.loadClients(),
                this.loadPaymentLinks(),
                this.loadPaymentsHistory()
            ]);
            
            // Update stats
            this.stats = {
                totalClients: this.clients.length,
                totalInvoices: this.paymentLinks.length,
                totalRevenue: this.paymentsHistory.reduce((sum, payment) => sum + (payment.total_amount || 0), 0),
                pendingPayments: this.paymentLinks.filter(link => link.status === 'Pending').length
            };
            
            this.updateStatsDisplay();
            this.loadRecentPayments();
            this.renderRevenueChart();
            
        } catch (error) {
            this.showNotification('Error loading dashboard data', 'error');
            console.error('Dashboard data error:', error);
        }
    }

    updateStatsDisplay() {
        document.getElementById('total-clients').textContent = this.stats.totalClients;
        document.getElementById('total-invoices').textContent = this.stats.totalInvoices;
        document.getElementById('total-revenue').textContent = `₹${this.stats.totalRevenue.toLocaleString()}`;
        document.getElementById('pending-payments').textContent = this.stats.pendingPayments;
    }

    loadRecentPayments() {
        const tbody = document.getElementById('recent-payments-body');
        const recentPayments = this.paymentsHistory.slice(0, 5);
        
        tbody.innerHTML = recentPayments.map(payment => `
            <tr>
                <td>${payment.invoice_id}</td>
                <td>${payment.name}</td>
                <td>₹${(payment.total_amount || 0).toLocaleString()}</td>
                <td>${this.formatDate(payment.payment_timestamp)}</td>
                <td><span class="status-badge status-paid">Paid</span></td>
            </tr>
        `).join('');
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;
        
        // Sample data - in real implementation, this would come from API
        const last7Days = this.getLastNDays(7);
        const revenueData = last7Days.map(() => Math.floor(Math.random() * 50000) + 10000);
        
        // Destroy existing chart if it exists
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
        
        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Daily Revenue (₹)',
                    data: revenueData,
                    borderColor: '#07217c',
                    backgroundColor: 'rgba(7, 33, 124, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    getLastNDays(n) {
        const days = [];
        for (let i = n-1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
        }
        return days;
    }

    async loadClients() {
        try {
            // For now, we'll load from local storage or use sample data
            // In production, implement getClients endpoint in Apps Script
            const storedClients = localStorage.getItem('infogrip_clients');
            
            if (storedClients) {
                this.clients = JSON.parse(storedClients);
            } else {
                // Sample clients data
                this.clients = [
                    {
                        client_id: 'CL-0001',
                        name: 'Rohit Sharma',
                        phone: '+91 9876543210',
                        email: 'rohit@example.com',
                        address: 'Jaipur, Rajasthan',
                        default_service: 'Social Media Management',
                        default_amount: 15000,
                        billing_cycle: 'monthly',
                        notes: 'Gym owner - regular client',
                        created_timestamp: new Date('2024-01-15').toISOString(),
                        updated_timestamp: new Date('2024-11-01').toISOString()
                    }
                ];
                this.saveClientsToStorage();
            }
            
            this.renderClientsTable();
            this.populateClientSelect();
            
        } catch (error) {
            this.showNotification('Error loading clients', 'error');
            console.error('Clients load error:', error);
        }
    }

    saveClientsToStorage() {
        localStorage.setItem('infogrip_clients', JSON.stringify(this.clients));
    }

    renderClientsTable() {
        const tbody = document.getElementById('clients-table-body');
        
        tbody.innerHTML = this.clients.map(client => `
            <tr>
                <td>${client.client_id}</td>
                <td>${client.name}</td>
                <td>${client.phone}</td>
                <td>${client.email}</td>
                <td>${client.default_service}</td>
                <td>${this.formatBillingCycle(client.billing_cycle)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="admin.editClient('${client.client_id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn btn-delete" onclick="admin.deleteClient('${client.client_id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    populateClientSelect() {
        const select = document.getElementById('client-select');
        select.innerHTML = '<option value="">New Client</option>';
        
        this.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.client_id;
            option.textContent = `${client.name} (${client.client_id})`;
            select.appendChild(option);
        });
    }

    handleClientSelect(e) {
        const clientId = e.target.value;
        const client = this.clients.find(c => c.client_id === clientId);
        
        if (client) {
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-phone').value = client.phone;
            document.getElementById('client-email').value = client.email;
            document.getElementById('client-address').value = client.address || '';
        } else {
            document.getElementById('client-name').value = '';
            document.getElementById('client-phone').value = '';
            document.getElementById('client-email').value = '';
            document.getElementById('client-address').value = '';
        }
    }

    setupServiceRows() {
        const container = document.getElementById('services-container');
        container.innerHTML = '';
        
        // Add initial service row
        this.addServiceRow();
    }

    addServiceRow() {
        const container = document.getElementById('services-container');
        const rowCount = container.children.length;
        
        if (rowCount >= 5) {
            this.showNotification('Maximum 5 services allowed per invoice', 'warning');
            return;
        }
        
        const serviceRow = document.createElement('div');
        serviceRow.className = 'service-row';
        serviceRow.innerHTML = `
            <div class="form-group">
                <select class="service-select" onchange="admin.handleServiceSelect(this)">
                    <option value="">Select Service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Social Media Management">Social Media Management</option>
                    <option value="Ads Campaign Management">Ads Campaign Management</option>
                    <option value="Political Branding">Political Branding</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Logo Design">Logo Design</option>
                    <option value="Hosting">Hosting</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                </select>
                <input type="text" class="service-custom hidden" placeholder="Service name">
            </div>
            <div class="form-group">
                <input type="number" class="service-qty" value="1" min="1" oninput="admin.calculateTotals()">
            </div>
            <div class="form-group">
                <input type="number" class="service-price" placeholder="0.00" min="0" step="0.01" oninput="admin.calculateTotals()">
            </div>
            <div class="form-group">
                <input type="text" class="service-total" placeholder="0.00" readonly>
            </div>
            <button type="button" class="remove-service" onclick="admin.removeServiceRow(this)" ${rowCount === 0 ? 'disabled' : ''}>
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(serviceRow);
    }

    removeServiceRow(button) {
        const row = button.closest('.service-row');
        row.remove();
        this.calculateTotals();
    }

    handleServiceSelect(select) {
        const row = select.closest('.service-row');
        const customInput = row.querySelector('.service-custom');
        const priceInput = row.querySelector('.service-price');
        
        if (select.value === 'Other') {
            customInput.classList.remove('hidden');
            customInput.required = true;
        } else {
            customInput.classList.add('hidden');
            customInput.required = false;
            
            // Set default price based on service
            const defaultPrices = {
                'Web Development': 25000,
                'Social Media Management': 15000,
                'Ads Campaign Management': 20000,
                'Political Branding': 30000,
                'Video Editing': 5000,
                'Logo Design': 3000,
                'Hosting': 2000,
                'Maintenance': 4000
            };
            
            if (defaultPrices[select.value]) {
                priceInput.value = defaultPrices[select.value];
            }
        }
        
        this.calculateTotals();
    }

    calculateTotals() {
        let subtotal = 0;
        
        // Calculate service totals
        document.querySelectorAll('.service-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.service-qty').value) || 0;
            const price = parseFloat(row.querySelector('.service-price').value) || 0;
            const total = qty * price;
            
            row.querySelector('.service-total').value = total.toFixed(2);
            subtotal += total;
        });
        
        // Calculate GST
        const gstToggle = document.getElementById('gst-toggle');
        let gstAmount = 0;
        
        if (gstToggle.checked) {
            const gstPercent = parseFloat(document.getElementById('gst-percent').value) || 0;
            gstAmount = subtotal * (gstPercent / 100);
        }
        
        // Calculate discount
        const discountToggle = document.getElementById('discount-toggle');
        let discountAmount = 0;
        
        if (discountToggle.checked) {
            const discountValue = parseFloat(document.getElementById('discount-value').value) || 0;
            const discountType = document.getElementById('discount-type').value;
            
            if (discountType === 'percent') {
                discountAmount = subtotal * (discountValue / 100);
            } else {
                discountAmount = discountValue;
            }
        }
        
        // Calculate final total
        const total = subtotal + gstAmount - discountAmount;
        
        // Update display
        document.getElementById('subtotal-amount').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('gst-amount').textContent = `₹${gstAmount.toFixed(2)}`;
        document.getElementById('discount-amount').textContent = `-₹${discountAmount.toFixed(2)}`;
        document.getElementById('total-amount').innerHTML = `<strong>₹${total.toFixed(2)}</strong>`;
    }

    toggleGST(e) {
        const gstContainer = document.querySelector('.gst-input-container');
        const gstAmountContainer = document.querySelector('.gst-amount-container');
        
        if (e.target.checked) {
            gstContainer.classList.remove('hidden');
            gstAmountContainer.classList.remove('hidden');
        } else {
            gstContainer.classList.add('hidden');
            gstAmountContainer.classList.add('hidden');
        }
        
        this.calculateTotals();
    }

    toggleDiscount(e) {
        const discountInputs = document.querySelector('.discount-inputs');
        const discountAmountContainer = document.querySelector('.discount-amount-container');
        
        if (e.target.checked) {
            discountInputs.classList.remove('hidden');
            discountAmountContainer.classList.remove('hidden');
        } else {
            discountInputs.classList.add('hidden');
            discountAmountContainer.classList.add('hidden');
        }
        
        this.calculateTotals();
    }

    async generatePaymentLink(e) {
        e.preventDefault();
        
        this.showLoading(true);
        
        try {
            // Validate form
            if (!this.validatePaymentForm()) {
                this.showLoading(false);
                return;
            }
            
            // Collect form data
            const formData = this.collectPaymentFormData();
            
            // Store current invoice data for preview
            this.currentInvoiceData = {
                ...formData,
                invoice_id: this.generateInvoiceId(),
                created_timestamp: new Date().toISOString()
            };
            
            // CALL REAL GOOGLE APPS SCRIPT API
            const result = await this.makeAPICall('createPaymentRecord', {
                client_id: formData.clientId || null,
                name: formData.clientName,
                phone: formData.clientPhone,
                email: formData.clientEmail,
                address: formData.clientAddress,
                services: formData.services,
                subtotal: formData.subtotal,
                gst_percent: formData.gstPercent,
                gst_amount: formData.gstAmount,
                total_amount: formData.totalAmount,
                save_client: formData.saveClient,
                notes: formData.notes
            });
            
            if (result.success) {
                // Update current invoice data with real ID
                this.currentInvoiceData.invoice_id = result.invoice_id;
                
                // Add to payment links
                this.paymentLinks.push({
                    invoice_id: result.invoice_id,
                    name: formData.clientName,
                    total_amount: formData.totalAmount,
                    status: 'Pending',
                    created_timestamp: new Date().toISOString(),
                    checkout_link: result.checkout_link
                });
                
                // Save client if requested
                if (formData.saveClient && !formData.clientId) {
                    await this.saveNewClient(formData);
                }
                
                // Show success result
                this.showPaymentLinkResult({
                    invoice_id: result.invoice_id,
                    checkout_link: result.checkout_link,
                    name: formData.clientName,
                    phone: formData.clientPhone,
                    email: formData.clientEmail,
                    services: formData.services,
                    subtotal: formData.subtotal,
                    gst_percent: formData.gstPercent,
                    gst_amount: formData.gstAmount,
                    total_amount: formData.totalAmount,
                    status: 'Pending',
                    created_timestamp: new Date().toISOString()
                });
                
                this.showNotification('Payment link generated successfully!', 'success');
            } else {
                throw new Error(result.error || 'Failed to create payment record');
            }
            
        } catch (error) {
            this.showNotification('Error generating payment link: ' + error.message, 'error');
            console.error('Payment link error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    validatePaymentForm() {
        const clientName = document.getElementById('client-name').value;
        const clientPhone = document.getElementById('client-phone').value;
        const clientEmail = document.getElementById('client-email').value;
        
        if (!clientName || !clientPhone || !clientEmail) {
            this.showNotification('Please fill in all required client details', 'error');
            return false;
        }
        
        const services = this.collectServices();
        if (services.length === 0) {
            this.showNotification('Please add at least one service', 'error');
            return false;
        }
        
        for (const service of services) {
            if (!service.name || service.price <= 0) {
                this.showNotification('Please check service details - all services need a name and valid price', 'error');
                return false;
            }
        }
        
        return true;
    }

    collectPaymentFormData() {
        const clientSelect = document.getElementById('client-select');
        const saveClient = document.getElementById('save-client').checked;
        
        return {
            clientId: clientSelect.value || null,
            clientName: document.getElementById('client-name').value,
            clientPhone: document.getElementById('client-phone').value,
            clientEmail: document.getElementById('client-email').value,
            clientAddress: document.getElementById('client-address').value,
            services: this.collectServices(),
            subtotal: parseFloat(document.getElementById('subtotal-amount').textContent.replace('₹', '')),
            gstPercent: document.getElementById('gst-toggle').checked ? 
                       parseFloat(document.getElementById('gst-percent').value) : 0,
            gstAmount: parseFloat(document.getElementById('gst-amount').textContent.replace('₹', '') || 0),
            discountAmount: parseFloat(document.getElementById('discount-amount').textContent.replace('-₹', '') || 0),
            totalAmount: parseFloat(document.getElementById('total-amount').textContent.replace('₹', '')),
            saveClient: saveClient,
            notes: document.getElementById('payment-notes').value
        };
    }

    collectServices() {
        const services = [];
        
        document.querySelectorAll('.service-row').forEach(row => {
            const select = row.querySelector('.service-select');
            const customInput = row.querySelector('.service-custom');
            const qtyInput = row.querySelector('.service-qty');
            const priceInput = row.querySelector('.service-price');
            
            let serviceName = select.value;
            if (serviceName === 'Other') {
                serviceName = customInput.value;
            }
            
            if (serviceName && priceInput.value) {
                services.push({
                    name: serviceName,
                    qty: parseInt(qtyInput.value) || 1,
                    unit_price: parseFloat(priceInput.value),
                    total: parseFloat(qtyInput.value) * parseFloat(priceInput.value)
                });
            }
        });
        
        return services;
    }

    generateInvoiceId() {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `INFO-${dateStr}-${random}`;
    }

    showPaymentLinkResult(paymentRecord) {
        document.getElementById('generated-link').textContent = paymentRecord.checkout_link;
        document.getElementById('payment-link-result').classList.remove('hidden');
        
        // Store the current payment record for preview
        this.currentInvoiceData = paymentRecord;
        
        // Scroll to result
        document.getElementById('payment-link-result').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    copyPaymentLink() {
        const link = document.getElementById('generated-link').textContent;
        navigator.clipboard.writeText(link).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        }).catch(err => {
            this.showNotification('Failed to copy link', 'error');
            console.error('Copy error:', err);
        });
    }

    shareViaWhatsApp() {
        const link = document.getElementById('generated-link').textContent;
        const message = `Hello! Here is your payment link from InfoGrip: ${link}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }

    shareViaEmail() {
        const link = document.getElementById('generated-link').textContent;
        const subject = 'Payment Link - InfoGrip Media Solution';
        const body = `Dear Client,\n\nPlease use the following link to complete your payment:\n${link}\n\nThank you,\nInfoGrip Media Solution`;
        
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }

    previewInvoice() {
        if (!this.currentInvoiceData) {
            this.showNotification('No invoice data available for preview', 'warning');
            return;
        }
        
        const modal = document.getElementById('invoice-preview-modal');
        const content = document.getElementById('invoice-preview-content');
        
        // Generate preview HTML
        content.innerHTML = this.generateInvoicePreviewHTML(this.currentInvoiceData);
        
        modal.classList.remove('hidden');
    }

    generateInvoicePreviewHTML(invoiceData) {
        const services = typeof invoiceData.services === 'string' ? 
            JSON.parse(invoiceData.services) : invoiceData.services;
        
        const servicesHTML = services.map((service, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${service.name}</td>
                <td>${service.qty}</td>
                <td>₹${service.unit_price?.toLocaleString() || '0'}</td>
                <td>₹${service.total?.toLocaleString() || '0'}</td>
            </tr>
        `).join('');
        
        return `
            <div class="invoice-preview">
                <div class="preview-header">
                    <h2>Invoice Preview</h2>
                    <p><strong>Invoice ID:</strong> ${invoiceData.invoice_id}</p>
                    <p><strong>Date:</strong> ${this.formatDate(invoiceData.created_timestamp)}</p>
                </div>
                
                <div class="preview-parties">
                    <div class="preview-company">
                        <h3>InfoGrip Media Solution</h3>
                        <p>Jaipur, Rajasthan, India</p>
                        <p>+91 6367556906 | info@infogrip.com</p>
                    </div>
                    <div class="preview-client">
                        <h3>Bill To</h3>
                        <p><strong>${invoiceData.name}</strong></p>
                        <p>${invoiceData.phone}</p>
                        <p>${invoiceData.email}</p>
                        <p>${invoiceData.address || ''}</p>
                    </div>
                </div>
                
                <table class="preview-services">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Service Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicesHTML}
                    </tbody>
                </table>
                
                <div class="preview-totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>₹${invoiceData.subtotal?.toLocaleString() || '0'}</span>
                    </div>
                    ${invoiceData.gst_percent > 0 ? `
                    <div class="total-row">
                        <span>GST (${invoiceData.gst_percent}%):</span>
                        <span>₹${invoiceData.gst_amount?.toLocaleString() || '0'}</span>
                    </div>
                    ` : ''}
                    <div class="total-row final-total">
                        <span><strong>Total Amount:</strong></span>
                        <span><strong>₹${invoiceData.total_amount?.toLocaleString() || '0'}</strong></span>
                    </div>
                </div>
                
                <div class="preview-footer">
                    <p><strong>Payment Terms:</strong> Payment via Razorpay • Due upon receipt</p>
                </div>
            </div>
            
            <style>
                .invoice-preview {
                    font-family: 'Inter', Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }
                .preview-header {
                    text-align: center;
                    border-bottom: 2px solid #07217c;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .preview-header h2 {
                    color: #07217c;
                    margin-bottom: 10px;
                }
                .preview-parties {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                }
                .preview-company, .preview-client {
                    flex: 1;
                }
                .preview-company h3, .preview-client h3 {
                    color: #07217c;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }
                .preview-services {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                .preview-services th {
                    background: #07217c;
                    color: white;
                    padding: 12px;
                    text-align: left;
                }
                .preview-services td {
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }
                .preview-totals {
                    float: right;
                    width: 300px;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .final-total {
                    border-bottom: 2px solid #07217c;
                    font-weight: bold;
                    font-size: 18px;
                }
                .preview-footer {
                    clear: both;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    text-align: center;
                }
            </style>
        `;
    }

    closeInvoicePreview() {
        document.getElementById('invoice-preview-modal').classList.add('hidden');
    }

    downloadInvoicePreview() {
        this.showNotification('PDF download feature will be available after payment', 'info');
    }

    openClientModal(clientId = null) {
        const modal = document.getElementById('client-modal');
        const title = document.getElementById('client-modal-title');
        
        if (clientId) {
            // Edit mode
            title.textContent = 'Edit Client';
            this.populateClientForm(clientId);
        } else {
            // Add mode
            title.textContent = 'Add New Client';
            this.clearClientForm();
        }
        
        modal.classList.remove('hidden');
    }

    closeClientModal() {
        document.getElementById('client-modal').classList.add('hidden');
    }

    populateClientForm(clientId) {
        const client = this.clients.find(c => c.client_id === clientId);
        if (!client) return;
        
        document.getElementById('edit-client-id').value = client.client_id;
        document.getElementById('modal-client-name').value = client.name;
        document.getElementById('modal-client-phone').value = client.phone;
        document.getElementById('modal-client-email').value = client.email;
        document.getElementById('modal-client-address').value = client.address || '';
        document.getElementById('modal-default-service').value = client.default_service || '';
        document.getElementById('modal-default-amount').value = client.default_amount || '';
        document.getElementById('modal-billing-cycle').value = client.billing_cycle || 'one-time';
        document.getElementById('modal-client-notes').value = client.notes || '';
    }

    clearClientForm() {
        document.getElementById('edit-client-id').value = '';
        document.getElementById('modal-client-name').value = '';
        document.getElementById('modal-client-phone').value = '';
        document.getElementById('modal-client-email').value = '';
        document.getElementById('modal-client-address').value = '';
        document.getElementById('modal-default-service').value = '';
        document.getElementById('modal-default-amount').value = '';
        document.getElementById('modal-billing-cycle').value = 'one-time';
        document.getElementById('modal-client-notes').value = '';
    }

    async saveClient() {
        const formData = this.collectClientFormData();
        
        if (!this.validateClientForm(formData)) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            if (formData.client_id) {
                // Update existing client
                const index = this.clients.findIndex(c => c.client_id === formData.client_id);
                if (index !== -1) {
                    this.clients[index] = {
                        ...this.clients[index],
                        ...formData,
                        updated_timestamp: new Date().toISOString()
                    };
                }
                this.showNotification('Client updated successfully!', 'success');
            } else {
                // Add new client
                const newClient = {
                    ...formData,
                    client_id: this.generateClientId(),
                    created_timestamp: new Date().toISOString(),
                    updated_timestamp: new Date().toISOString()
                };
                this.clients.push(newClient);
                this.showNotification('Client added successfully!', 'success');
            }
            
            this.saveClientsToStorage();
            this.closeClientModal();
            this.renderClientsTable();
            this.populateClientSelect();
            
        } catch (error) {
            this.showNotification('Error saving client', 'error');
            console.error('Client save error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    collectClientFormData() {
        return {
            client_id: document.getElementById('edit-client-id').value,
            name: document.getElementById('modal-client-name').value,
            phone: document.getElementById('modal-client-phone').value,
            email: document.getElementById('modal-client-email').value,
            address: document.getElementById('modal-client-address').value,
            default_service: document.getElementById('modal-default-service').value,
            default_amount: parseFloat(document.getElementById('modal-default-amount').value) || 0,
            billing_cycle: document.getElementById('modal-billing-cycle').value,
            notes: document.getElementById('modal-client-notes').value
        };
    }

    validateClientForm(formData) {
        if (!formData.name || !formData.phone || !formData.email) {
            this.showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Basic phone validation (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            this.showNotification('Please enter a valid Indian phone number', 'error');
            return false;
        }
        
        return true;
    }

    generateClientId() {
        const lastId = this.clients.length > 0 ? 
            parseInt(this.clients[this.clients.length - 1].client_id.split('-')[1]) : 0;
        return `CL-${(lastId + 1).toString().padStart(4, '0')}`;
    }

    editClient(clientId) {
        this.openClientModal(clientId);
    }

    async deleteClient(clientId) {
        if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            this.clients = this.clients.filter(c => c.client_id !== clientId);
            this.saveClientsToStorage();
            this.renderClientsTable();
            this.populateClientSelect();
            this.showNotification('Client deleted successfully', 'success');
            
        } catch (error) {
            this.showNotification('Error deleting client', 'error');
            console.error('Client delete error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async saveNewClient(formData) {
        const newClient = {
            client_id: this.generateClientId(),
            name: formData.clientName,
            phone: formData.clientPhone,
            email: formData.clientEmail,
            address: formData.clientAddress,
            default_service: formData.services[0]?.name || '',
            default_amount: formData.services[0]?.unit_price || 0,
            billing_cycle: 'one-time',
            notes: formData.notes,
            created_timestamp: new Date().toISOString(),
            updated_timestamp: new Date().toISOString()
        };
        
        this.clients.push(newClient);
        this.saveClientsToStorage();
        this.populateClientSelect();
    }

    async loadPaymentLinks() {
        try {
            // For now, use local storage
            const storedLinks = localStorage.getItem('infogrip_payment_links');
            
            if (storedLinks) {
                this.paymentLinks = JSON.parse(storedLinks);
            } else {
                // Sample payment links data
                this.paymentLinks = [
                    {
                        invoice_id: 'INFO-20251130-1234',
                        client_id: 'CL-0001',
                        name: 'Rohit Sharma',
                        phone: '+91 9876543210',
                        email: 'rohit@example.com',
                        services_json: JSON.stringify([{ name: 'Social Media Management', qty: 1, unit_price: 15000, total: 15000 }]),
                        subtotal: 15000,
                        gst_percent: 18,
                        gst_amount: 2700,
                        total_amount: 17700,
                        checkout_link: 'checkout.html?invoice_id=INFO-20251130-1234',
                        status: 'Pending',
                        created_timestamp: new Date('2024-11-30').toISOString()
                    }
                ];
                this.savePaymentLinksToStorage();
            }
            
            this.renderPaymentLinksTable();
            
        } catch (error) {
            this.showNotification('Error loading payment links', 'error');
            console.error('Payment links load error:', error);
        }
    }

    savePaymentLinksToStorage() {
        localStorage.setItem('infogrip_payment_links', JSON.stringify(this.paymentLinks));
    }

    renderPaymentLinksTable() {
        const tbody = document.getElementById('payment-links-table-body');
        
        tbody.innerHTML = this.paymentLinks.map(link => `
            <tr>
                <td>${link.invoice_id}</td>
                <td>${link.name}</td>
                <td>₹${(link.total_amount || 0).toLocaleString()}</td>
                <td>${this.formatDate(link.created_timestamp)}</td>
                <td><span class="status-badge status-${(link.status || 'Pending').toLowerCase()}">${link.status || 'Pending'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="admin.copyPaymentLinkToClipboard('${link.checkout_link}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="action-btn btn-delete" onclick="admin.resendPaymentLink('${link.invoice_id}')">
                            <i class="fas fa-paper-plane"></i> Resend
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    copyPaymentLinkToClipboard(link) {
        navigator.clipboard.writeText(link).then(() => {
            this.showNotification('Payment link copied to clipboard!', 'success');
        });
    }

    resendPaymentLink(invoiceId) {
        this.showNotification(`Payment link for ${invoiceId} has been resent`, 'success');
    }

    async loadPaymentsHistory() {
        try {
            // For now, use local storage
            const storedHistory = localStorage.getItem('infogrip_payments_history');
            
            if (storedHistory) {
                this.paymentsHistory = JSON.parse(storedHistory);
            } else {
                // Sample payments history data
                this.paymentsHistory = [
                    {
                        payment_id: 'pay_Lk5jz7q3T4m6n9p2',
                        order_id: 'order_Lk5jz7q3T4m6n9p1',
                        invoice_id: 'INFO-20251129-5678',
                        client_id: 'CL-0002',
                        name: 'Simran Kaur',
                        phone: '+91 8765432109',
                        email: 'simran@example.com',
                        services_json: JSON.stringify([{ name: 'Ads Campaign Management', qty: 1, unit_price: 25000, total: 25000 }]),
                        subtotal: 25000,
                        gst_percent: 18,
                        gst_amount: 4500,
                        total_amount: 29500,
                        payment_mode: 'UPI',
                        invoice_pdf_link: '#',
                        status: 'PAID',
                        payment_timestamp: new Date('2024-11-29T14:30:00').toISOString()
                    }
                ];
                this.savePaymentsHistoryToStorage();
            }
            
            this.renderPaymentsHistoryTable();
            
        } catch (error) {
            this.showNotification('Error loading payments history', 'error');
            console.error('Payments history load error:', error);
        }
    }

    savePaymentsHistoryToStorage() {
        localStorage.setItem('infogrip_payments_history', JSON.stringify(this.paymentsHistory));
    }

    renderPaymentsHistoryTable() {
        const tbody = document.getElementById('payments-history-table-body');
        
        tbody.innerHTML = this.paymentsHistory.map(payment => `
            <tr>
                <td>${payment.payment_id}</td>
                <td>${payment.invoice_id}</td>
                <td>${payment.name}</td>
                <td>₹${(payment.total_amount || 0).toLocaleString()}</td>
                <td>${this.formatDate(payment.payment_timestamp)}</td>
                <td>${payment.payment_mode}</td>
                <td>
                    <a href="${payment.invoice_pdf_link}" target="_blank" class="action-btn btn-edit">
                        <i class="fas fa-file-pdf"></i> View
                    </a>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="admin.downloadInvoice('${payment.invoice_id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="action-btn btn-delete" onclick="admin.resendInvoice('${payment.invoice_id}')">
                            <i class="fas fa-paper-plane"></i> Resend
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    downloadInvoice(invoiceId) {
        this.showNotification(`Downloading invoice ${invoiceId}...`, 'info');
    }

    resendInvoice(invoiceId) {
        this.showNotification(`Invoice ${invoiceId} has been resent to client`, 'success');
    }

    searchClients(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredClients = this.clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm) ||
            client.phone.includes(searchTerm) ||
            client.client_id.toLowerCase().includes(searchTerm)
        );
        
        this.renderFilteredClients(filteredClients);
    }

    renderFilteredClients(clients) {
        const tbody = document.getElementById('clients-table-body');
        
        tbody.innerHTML = clients.map(client => `
            <tr>
                <td>${client.client_id}</td>
                <td>${client.name}</td>
                <td>${client.phone}</td>
                <td>${client.email}</td>
                <td>${client.default_service}</td>
                <td>${this.formatBillingCycle(client.billing_cycle)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="admin.editClient('${client.client_id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn btn-delete" onclick="admin.deleteClient('${client.client_id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    searchPaymentLinks(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLinks = this.paymentLinks.filter(link => 
            link.invoice_id.toLowerCase().includes(searchTerm) ||
            link.name.toLowerCase().includes(searchTerm) ||
            link.email.toLowerCase().includes(searchTerm)
        );
        
        this.renderFilteredPaymentLinks(filteredLinks);
    }

    renderFilteredPaymentLinks(links) {
        const tbody = document.getElementById('payment-links-table-body');
        
        tbody.innerHTML = links.map(link => `
            <tr>
                <td>${link.invoice_id}</td>
                <td>${link.name}</td>
                <td>₹${(link.total_amount || 0).toLocaleString()}</td>
                <td>${this.formatDate(link.created_timestamp)}</td>
                <td><span class="status-badge status-${(link.status || 'Pending').toLowerCase()}">${link.status || 'Pending'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="admin.copyPaymentLinkToClipboard('${link.checkout_link}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="action-btn btn-delete" onclick="admin.resendPaymentLink('${link.invoice_id}')">
                            <i class="fas fa-paper-plane"></i> Resend
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    applyDateFilter() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (!startDate || !endDate) {
            this.showNotification('Please select both start and end dates', 'warning');
            return;
        }
        
        const filteredPayments = this.paymentsHistory.filter(payment => {
            const paymentDate = new Date(payment.payment_timestamp).toISOString().split('T')[0];
            return paymentDate >= startDate && paymentDate <= endDate;
        });
        
        this.renderFilteredPaymentsHistory(filteredPayments);
        this.showNotification(`Showing payments from ${startDate} to ${endDate}`, 'success');
    }

    resetDateFilter() {
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        this.renderPaymentsHistoryTable();
        this.showNotification('Date filter reset', 'info');
    }

    renderFilteredPaymentsHistory(payments) {
        const tbody = document.getElementById('payments-history-table-body');
        
        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${payment.payment_id}</td>
                <td>${payment.invoice_id}</td>
                <td>${payment.name}</td>
                <td>₹${(payment.total_amount || 0).toLocaleString()}</td>
                <td>${this.formatDate(payment.payment_timestamp)}</td>
                <td>${payment.payment_mode}</td>
                <td>
                    <a href="${payment.invoice_pdf_link}" target="_blank" class="action-btn btn-edit">
                        <i class="fas fa-file-pdf"></i> View
                    </a>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="admin.downloadInvoice('${payment.invoice_id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="action-btn btn-delete" onclick="admin.resendInvoice('${payment.invoice_id}')">
                            <i class="fas fa-paper-plane"></i> Resend
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    switchSettingsTab(e) {
        const tabName = e.target.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    exportClientsCSV() {
        const headers = ['Client ID', 'Name', 'Phone', 'Email', 'Address', 'Default Service', 'Default Amount', 'Billing Cycle', 'Notes'];
        const csvData = this.clients.map(client => [
            client.client_id,
            client.name,
            client.phone,
            client.email,
            client.address,
            client.default_service,
            client.default_amount,
            client.billing_cycle,
            client.notes
        ]);
        
        this.downloadCSV([headers, ...csvData], 'infogrip-clients.csv');
        this.showNotification('Clients data exported successfully', 'success');
    }

    exportPaymentsCSV() {
        const headers = ['Payment ID', 'Invoice ID', 'Client Name', 'Phone', 'Email', 'Amount', 'Payment Date', 'Payment Mode', 'Status'];
        const csvData = this.paymentsHistory.map(payment => [
            payment.payment_id,
            payment.invoice_id,
            payment.name,
            payment.phone,
            payment.email,
            payment.total_amount,
            this.formatDate(payment.payment_timestamp),
            payment.payment_mode,
            payment.status
        ]);
        
        this.downloadCSV([headers, ...csvData], 'infogrip-payments.csv');
        this.showNotification('Payments data exported successfully', 'success');
    }

    downloadCSV(data, filename) {
        const csvContent = data.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Utility methods
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
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
        } catch (e) {
            return 'Invalid Date';
        }
    }

    formatBillingCycle(cycle) {
        const cycles = {
            'one-time': 'One Time',
            'monthly': 'Monthly',
            'quarterly': 'Quarterly',
            'yearly': 'Yearly'
        };
        return cycles[cycle] || cycle;
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Keep simulateAPICall for fallback
    simulateAPICall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new AdminPanel();
});
