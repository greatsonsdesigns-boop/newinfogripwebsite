// Admin Dashboard JavaScript - SIMPLIFIED WORKING VERSION
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.clients = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentMode = 'new';
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        if (this.currentUser) {
            this.loadDashboardData();
        }
    }

    checkAuth() {
        const user = localStorage.getItem('adminUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Payment mode
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPaymentMode(e.target.dataset.mode));
        });
        
        // Client actions
        document.getElementById('addClientBtn').addEventListener('click', () => this.openClientModal());
        document.getElementById('clientSearch').addEventListener('input', (e) => this.searchClients(e.target.value));
        
        // Payment forms
        document.getElementById('newClientForm').addEventListener('submit', (e) => this.generatePaymentLink(e, 'new'));
        document.getElementById('existingClientForm').addEventListener('submit', (e) => this.generatePaymentLink(e, 'existing'));
        
        // Modal
        document.getElementById('clientForm').addEventListener('submit', (e) => this.saveClient(e));
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        
        // Share buttons
        document.getElementById('copyLinkBtn').addEventListener('click', () => this.copyPaymentLink());
        document.getElementById('whatsappShare').addEventListener('click', () => this.shareViaWhatsApp());
        document.getElementById('emailShare').addEventListener('click', () => this.shareViaEmail());
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email === 'admin@infogrip.com' && password === 'admin123') {
            this.currentUser = { email, name: 'Admin' };
            localStorage.setItem('adminUser', JSON.stringify(this.currentUser));
            this.showDashboard();
            this.loadDashboardData();
        } else {
            alert('Invalid credentials');
        }
    }

    handleLogout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        this.showLogin();
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        if (tabName === 'clients') {
            this.loadClients();
        } else if (tabName === 'payment') {
            this.loadExistingClients();
        }
    }

    switchPaymentMode(mode) {
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        document.querySelectorAll('.payment-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${mode}ClientForm`).classList.add('active');
    }

    updateCurrentTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const timeString = now.toLocaleDateString('en-IN', options);
        document.getElementById('currentTime').textContent = timeString;
    }

    async loadDashboardData() {
        try {
            const stats = await this.fetchDashboardStats();
            this.updateStats(stats);
            this.loadClients();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async fetchDashboardStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalClients: 25,
                    totalRevenue: 125000,
                    monthlyPayments: 25000,
                    pendingPayments: 3
                });
            }, 1000);
        });
    }

    updateStats(stats) {
        document.getElementById('totalClients').textContent = stats.totalClients.toLocaleString();
        document.getElementById('totalRevenue').textContent = `₹${stats.totalRevenue.toLocaleString()}`;
        document.getElementById('monthlyPayments').textContent = `₹${stats.monthlyPayments.toLocaleString()}`;
        document.getElementById('pendingPayments').textContent = stats.pendingPayments;
    }

    async loadClients() {
        try {
            this.clients = await this.fetchClients();
            this.renderClientsTable();
            this.renderPagination();
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    }

    async fetchClients() {
        // Simulate API call with sample data
        return new Promise((resolve) => {
            setTimeout(() => {
                const sampleClients = [
                    {
                        id: 'CL001',
                        name: 'Rajesh Kumar',
                        email: 'rajesh@business.com',
                        phone: '+91 9876543210',
                        defaultService: 'Social Media Management',
                        defaultAmount: 8000,
                        billingCycle: 'Monthly',
                        createdDate: new Date()
                    },
                    {
                        id: 'CL002', 
                        name: 'Priya Sharma',
                        email: 'priya@store.com',
                        phone: '+91 9123456789',
                        defaultService: 'Website Development',
                        defaultAmount: 15000,
                        billingCycle: 'One Time',
                        createdDate: new Date()
                    }
                ];
                resolve(sampleClients);
            }, 500);
        });
    }

    renderClientsTable() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentClients = this.clients.slice(startIndex, endIndex);
        
        const tbody = document.getElementById('clientsTableBody');
        tbody.innerHTML = '';
        
        currentClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.defaultService}</td>
                <td>₹${client.defaultAmount.toLocaleString()}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="admin.editClient('${client.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="admin.deleteClient('${client.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.clients.length / this.itemsPerPage);
        const pagination = document.getElementById('clientsPagination');
        pagination.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderClientsTable();
                this.renderPagination();
            }
        });
        pagination.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.renderClientsTable();
                this.renderPagination();
            });
            pagination.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderClientsTable();
                this.renderPagination();
            }
        });
        pagination.appendChild(nextBtn);
    }

    searchClients(query) {
        const filteredClients = this.clients.filter(client => 
            client.name.toLowerCase().includes(query.toLowerCase()) ||
            client.email.toLowerCase().includes(query.toLowerCase()) ||
            client.phone.includes(query)
        );
        
        const tbody = document.getElementById('clientsTableBody');
        tbody.innerHTML = '';
        
        filteredClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.defaultService}</td>
                <td>₹${client.defaultAmount.toLocaleString()}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="admin.editClient('${client.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="admin.deleteClient('${client.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openClientModal(client = null) {
        const modal = document.getElementById('clientModal');
        const title = document.getElementById('modalTitle');
        
        if (client) {
            title.textContent = 'Edit Client';
            document.getElementById('editClientId').value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientPhone').value = client.phone;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientAddress').value = client.address || '';
            document.getElementById('defaultService').value = client.defaultService || '';
            document.getElementById('defaultAmount').value = client.defaultAmount || '';
            document.getElementById('billingCycle').value = client.billingCycle || 'one-time';
        } else {
            title.textContent = 'Add Client';
            document.getElementById('clientForm').reset();
            document.getElementById('editClientId').value = '';
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('clientModal').classList.remove('active');
    }

    async saveClient(e) {
        e.preventDefault();
        
        const clientData = {
            id: document.getElementById('editClientId').value || 'CL' + Date.now(),
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value,
            defaultService: document.getElementById('defaultService').value,
            defaultAmount: document.getElementById('defaultAmount').value,
            billingCycle: document.getElementById('billingCycle').value,
            createdDate: new Date()
        };
        
        try {
            if (document.getElementById('editClientId').value) {
                // Update existing client
                const index = this.clients.findIndex(c => c.id === clientData.id);
                if (index !== -1) {
                    this.clients[index] = clientData;
                }
            } else {
                // Add new client
                this.clients.push(clientData);
            }
            
            this.closeModal();
            this.renderClientsTable();
            this.renderPagination();
            alert('Client saved successfully!');
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error saving client: ' + error.message);
        }
    }

    editClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            this.openClientModal(client);
        }
    }

    async deleteClient(clientId) {
        if (confirm('Are you sure you want to delete this client?')) {
            try {
                this.clients = this.clients.filter(c => c.id !== clientId);
                this.renderClientsTable();
                this.renderPagination();
                alert('Client deleted successfully!');
            } catch (error) {
                console.error('Error deleting client:', error);
                alert('Error deleting client: ' + error.message);
            }
        }
    }

    async loadExistingClients() {
        const select = document.getElementById('existingClient');
        select.innerHTML = '<option value="">Select a client</option>';
        
        this.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.email})`;
            option.dataset.client = JSON.stringify(client);
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                const client = JSON.parse(e.target.selectedOptions[0].dataset.client);
                document.getElementById('existingService').value = client.defaultService || '';
                document.getElementById('existingAmount').value = client.defaultAmount || '';
            }
        });
    }

    async generatePaymentLink(e, mode) {
        e.preventDefault();
        
        let clientData;
        let serviceData;
        
        if (mode === 'new') {
            clientData = {
                name: document.getElementById('newName').value,
                phone: document.getElementById('newPhone').value,
                email: document.getElementById('newEmail').value,
                address: document.getElementById('newAddress').value
            };
            serviceData = {
                service: document.getElementById('newService').value,
                amount: document.getElementById('newAmount').value,
                description: document.getElementById('newDescription').value
            };
        } else {
            const clientId = document.getElementById('existingClient').value;
            const client = this.clients.find(c => c.id == clientId);
            if (!client) {
                alert('Please select a client');
                return;
            }
            
            clientData = {
                id: client.id,
                name: client.name,
                phone: client.phone,
                email: client.email,
                address: client.address
            };
            serviceData = {
                service: document.getElementById('existingService').value,
                amount: document.getElementById('existingAmount').value,
                description: document.getElementById('existingDescription').value
            };
        }
        
        try {
            const invoiceId = this.generateInvoiceId();
            const checkoutUrl = this.createPaymentLink(invoiceId, clientData, serviceData);
            this.showGeneratedLink(checkoutUrl, invoiceId, clientData, serviceData);
        } catch (error) {
            console.error('Error generating payment link:', error);
            alert('Error generating payment link: ' + error.message);
        }
    }

    generateInvoiceId() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `IG${timestamp}${random}`;
    }

    createPaymentLink(invoiceId, clientData, serviceData) {
        // Simple version without Google Sheets
        const baseUrl = window.location.origin;
        const params = new URLSearchParams({
            invoice_id: invoiceId,
            client_id: clientData.id || 'new',
            service: encodeURIComponent(serviceData.service),
            amount: serviceData.amount,
            description: encodeURIComponent(serviceData.description || '')
        });
        
        const checkoutUrl = `${baseUrl}/checkout.html?${params.toString()}`;
        return checkoutUrl;
    }

    showGeneratedLink(url, invoiceId, clientData, serviceData) {
        document.getElementById('paymentLink').value = url;
        document.getElementById('generatedLink').style.display = 'block';
        
        this.currentPaymentData = { url, invoiceId, clientData, serviceData };
        
        document.getElementById('generatedLink').scrollIntoView({ behavior: 'smooth' });
    }

    copyPaymentLink() {
        const linkInput = document.getElementById('paymentLink');
        linkInput.select();
        document.execCommand('copy');
        alert('Payment link copied to clipboard!');
    }

    shareViaWhatsApp() {
        const { clientData, serviceData, url, invoiceId } = this.currentPaymentData;
        
        const message = `Hello ${clientData.name}, this is your InfoGrip invoice.

💰 *Invoice Details:*
• Service: ${serviceData.service}
• Amount: ₹${serviceData.amount}
• Invoice ID: ${invoiceId}
• Date: ${new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'long'
})}

🔗 Payment Link: ${url}

_Thank you for choosing InfoGrip Media Solution!_`;

        const whatsappUrl = `https://wa.me/91${clientData.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    shareViaEmail() {
        const { clientData, serviceData, url, invoiceId } = this.currentPaymentData;
        const subject = `InfoGrip Invoice - ${invoiceId}`;
        const body = `Dear ${clientData.name},

Thank you for choosing InfoGrip Media Solution.

📋 INVOICE DETAILS:
• Service: ${serviceData.service}
• Amount: ₹${serviceData.amount}
• Invoice ID: ${invoiceId}
• Date: ${new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
})}

🔗 PAYMENT LINK:
${url}

Please complete your payment using the above link.

Best regards,
InfoGrip Media Solution Team
📞 +91 6367556906
📧 infogripmarketing@gmail.com

_This is an automated message. Please do not reply to this email._`;

        const mailtoUrl = `mailto:${clientData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    }
}

// Initialize admin dashboard
const admin = new AdminDashboard();
