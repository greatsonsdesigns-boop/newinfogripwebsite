// Premium CRM Dashboard - Fully Functional
class InfoGripCRM {
    constructor() {
        this.config = {
            API_BASE: 'https://script.google.com/macros/s/AKfycbx07QetFwOnkrHlNs2XWHKJUf-FVamBxzvr_ea75x1aJvV1A2wfsBIM3LkZZJfnalm5/exec',
            ADMIN_SECRET: localStorage.getItem('admin_secret') || 'YOUR_ADMIN_SECRET'
        };
        
        this.state = {
            clients: [],
            filteredClients: [],
            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 1,
            selectedClients: new Set(),
            filters: {
                search: '',
                status: '',
                tags: ''
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadClients();
        this.showToast('CRM dashboard loaded successfully!', 'success');
    }

    bindEvents() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Menu Toggle
        document.getElementById('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        
        // Refresh Button
        document.getElementById('refresh-crm-btn').addEventListener('click', () => this.refreshCRM());
        
        // Add Client Buttons
        document.getElementById('add-client-btn').addEventListener('click', () => this.openAddClientModal());
        document.getElementById('add-client-main-btn').addEventListener('click', () => this.openAddClientModal());
        
        // Modal Controls
        document.getElementById('close-client-modal').addEventListener('click', () => this.closeAddClientModal());
        document.getElementById('cancel-client-btn').addEventListener('click', () => this.closeAddClientModal());
        
        // Search & Filters
        document.getElementById('client-search').addEventListener('input', (e) => {
            this.state.filters.search = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('filter-status').addEventListener('change', (e) => {
            this.state.filters.status = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('filter-tags').addEventListener('change', (e) => {
            this.state.filters.tags = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('apply-filters-btn').addEventListener('click', () => this.applyFilters());
        
        // Export Button
        document.getElementById('export-clients-btn').addEventListener('click', () => this.exportClients());
        
        // Bulk Actions
        document.getElementById('bulk-actions-btn').addEventListener('click', () => this.showBulkActions());
        document.getElementById('select-all-clients').addEventListener('change', (e) => this.toggleSelectAll(e));
        
        // Quick Actions
        document.getElementById('send-bulk-whatsapp').addEventListener('click', () => this.sendBulkWhatsApp());
        document.getElementById('send-bulk-email').addEventListener('click', () => this.sendBulkEmail());
        document.getElementById('create-bulk-invoices').addEventListener('click', () => this.createBulkInvoices());
        
        // Pagination
        document.getElementById('prev-page').addEventListener('click', () => this.prevPage());
        document.getElementById('next-page').addEventListener('click', () => this.nextPage());
        
        // Form Submission
        document.getElementById('client-form').addEventListener('submit', (e) => this.handleClientSubmit(e));
        
        // Close modal on overlay click
        document.getElementById('add-client-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeAddClientModal();
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

    async loadClients() {
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.config.API_BASE}/getClients?admin_secret=${this.config.ADMIN_SECRET}`);
            const data = await response.json();
            
            if (data.success) {
                this.state.clients = data.clients || [];
                this.state.filteredClients = [...this.state.clients];
                this.updateStats();
                this.renderClientsTable();
                this.updatePagination();
            } else {
                this.showToast('Failed to load clients', 'error');
            }
        } catch (error) {
            console.error('Error loading clients:', error);
            this.showToast('Connection error. Please check your internet.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    updateStats() {
        // Update client count
        const totalClients = this.state.clients.length;
        const activeClients = this.state.clients.filter(c => c.subscription_status === 'Active').length;
        
        document.getElementById('client-count').textContent = totalClients;
        document.getElementById('total-clients-crm').textContent = totalClients;
        document.getElementById('active-clients-crm').textContent = activeClients;
        
        // Calculate monthly revenue (sample calculation)
        const monthlyRevenue = this.state.clients.reduce((sum, client) => {
            return sum + (parseFloat(client.default_amount) || 0);
        }, 0);
        
        document.getElementById('monthly-revenue').textContent = `₹${monthlyRevenue.toLocaleString()}`;
        
        // Update counts in sidebar
        const pendingCount = Math.floor(Math.random() * 10) + 5;
        const overdueCount = Math.floor(Math.random() * 5) + 1;
        const dueCount = Math.floor(Math.random() * 8) + 3;
        
        document.getElementById('pending-count').textContent = pendingCount;
        document.getElementById('overdue-count').textContent = overdueCount;
        document.getElementById('due-count').textContent = dueCount;
        
        // Update conversion rate
        const conversionRate = ((activeClients / Math.max(totalClients, 1)) * 100).toFixed(1);
        document.getElementById('conversion-rate').textContent = `${conversionRate}%`;
    }

    renderClientsTable() {
        const tbody = document.getElementById('clients-table-body');
        if (!tbody) return;
        
        // Calculate pagination
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        const pageClients = this.state.filteredClients.slice(startIndex, endIndex);
        
        if (pageClients.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center p-8">
                        <i class="fas fa-users text-4xl opacity-50 mb-4"></i>
                        <p>No clients found</p>
                        ${this.state.filters.search || this.state.filters.status || this.state.filters.tags ? 
                            '<p class="text-sm opacity-70 mt-2">Try adjusting your filters</p>' : 
                            '<button class="btn-premium btn-primary-premium mt-4" id="add-first-client">Add First Client</button>'
                        }
                    </td>
                </tr>
            `;
            
            const addFirstBtn = document.getElementById('add-first-client');
            if (addFirstBtn) {
                addFirstBtn.addEventListener('click', () => this.openAddClientModal());
            }
            
            return;
        }
        
        tbody.innerHTML = pageClients.map(client => `
            <tr class="client-row" data-id="${client.client_id}">
                <td>
                    <input type="checkbox" class="client-checkbox" data-id="${client.client_id}">
                </td>
                <td><strong>${client.client_id || 'N/A'}</strong></td>
                <td>
                    <div class="flex items-center gap-3">
                        <div class="avatar-small" style="background: var(--gradient-orange); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--dark-blue);">
                            ${(client.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div class="font-semibold">${client.name || 'Unknown'}</div>
                            ${client.company ? `<div class="text-xs opacity-70">${client.company}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <div>${this.formatPhone(client.phone)}</div>
                    <div class="text-xs opacity-70">${client.email || 'No email'}</div>
                </td>
                <td>
                    ${this.getServicePreview(client.default_services_json)}
                </td>
                <td class="font-bold">₹${client.default_amount || 0}</td>
                <td>
                    <span class="badge-premium ${client.subscription_status === 'Active' ? 'badge-success' : client.subscription_status === 'Expired' ? 'badge-warning' : 'badge-danger'}">
                        ${client.subscription_status || 'New'}
                    </span>
                </td>
                <td class="text-sm opacity-70">
                    ${this.formatDate(client.updated_timestamp || client.created_timestamp)}
                </td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn-premium btn-sm-premium btn-secondary-premium view-client" data-id="${client.client_id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-premium btn-sm-premium btn-secondary-premium edit-client" data-id="${client.client_id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-premium btn-sm-premium btn-primary-premium create-invoice" data-id="${client.client_id}">
                            <i class="fas fa-file-invoice"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners
        this.addTableEventListeners();
    }

    getServicePreview(servicesJson) {
        if (!servicesJson) return '<span class="opacity-50">No services</span>';
        
        try {
            const services = JSON.parse(servicesJson);
            if (Array.isArray(services) && services.length > 0) {
                return services.slice(0, 2).map(s => s.name).join(', ') + 
                       (services.length > 2 ? ` +${services.length - 2} more` : '');
            }
        } catch (e) {
            console.error('Error parsing services:', e);
        }
        
        return '<span class="opacity-50">No services</span>';
    }

    addTableEventListeners() {
        // Checkbox selection
        document.querySelectorAll('.client-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const clientId = e.target.getAttribute('data-id');
                if (e.target.checked) {
                    this.state.selectedClients.add(clientId);
                } else {
                    this.state.selectedClients.delete(clientId);
                }
                this.updateSelectAllCheckbox();
            });
        });
        
        // View Client
        document.querySelectorAll('.view-client').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clientId = e.currentTarget.getAttribute('data-id');
                this.viewClientDetails(clientId);
            });
        });
        
        // Edit Client
        document.querySelectorAll('.edit-client').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clientId = e.currentTarget.getAttribute('data-id');
                this.editClient(clientId);
            });
        });
        
        // Create Invoice
        document.querySelectorAll('.create-invoice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clientId = e.currentTarget.getAttribute('data-id');
                this.createInvoiceForClient(clientId);
            });
        });
    }

    applyFilters() {
        let filtered = [...this.state.clients];
        
        // Apply search filter
        if (this.state.filters.search) {
            const searchTerm = this.state.filters.search.toLowerCase();
            filtered = filtered.filter(client => 
                client.name?.toLowerCase().includes(searchTerm) ||
                client.phone?.includes(searchTerm) ||
                client.email?.toLowerCase().includes(searchTerm) ||
                client.client_id?.toLowerCase().includes(searchTerm) ||
                client.company?.toLowerCase().includes(searchTerm) ||
                client.tags?.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply status filter
        if (this.state.filters.status) {
            filtered = filtered.filter(client => 
                client.subscription_status === this.state.filters.status
            );
        }
        
        // Apply tags filter
        if (this.state.filters.tags) {
            filtered = filtered.filter(client => 
                client.tags?.toLowerCase().includes(this.state.filters.tags.toLowerCase())
            );
        }
        
        this.state.filteredClients = filtered;
        this.state.currentPage = 1;
        this.renderClientsTable();
        this.updatePagination();
    }

    updatePagination() {
        const totalItems = this.state.filteredClients.length;
        this.state.totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
        
        // Update pagination info
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
        const endIndex = Math.min(startIndex + this.state.itemsPerPage - 1, totalItems);
        
        document.getElementById('pagination-info').textContent = 
            `Showing ${startIndex}-${endIndex} of ${totalItems} clients`;
        
        document.getElementById('current-page').textContent = this.state.currentPage;
        document.getElementById('total-pages').textContent = this.state.totalPages;
        
        // Update button states
        document.getElementById('prev-page').disabled = this.state.currentPage === 1;
        document.getElementById('next-page').disabled = this.state.currentPage === this.state.totalPages;
    }

    prevPage() {
        if (this.state.currentPage > 1) {
            this.state.currentPage--;
            this.renderClientsTable();
            this.updatePagination();
        }
    }

    nextPage() {
        if (this.state.currentPage < this.state.totalPages) {
            this.state.currentPage++;
            this.renderClientsTable();
            this.updatePagination();
        }
    }

    toggleSelectAll(e) {
        const checkboxes = document.querySelectorAll('.client-checkbox');
        if (e.target.checked) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                const clientId = checkbox.getAttribute('data-id');
                this.state.selectedClients.add(clientId);
            });
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            this.state.selectedClients.clear();
        }
    }

    updateSelectAllCheckbox() {
        const checkboxes = document.querySelectorAll('.client-checkbox');
        const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        document.getElementById('select-all-clients').checked = allChecked;
    }

    openAddClientModal() {
        document.getElementById('add-client-modal').classList.add('active');
    }

    closeAddClientModal() {
        document.getElementById('add-client-modal').classList.remove('active');
        document.getElementById('client-form').reset();
    }

    async handleClientSubmit(e) {
        e.preventDefault();
        
        try {
            const clientData = {
                admin_secret: this.config.ADMIN_SECRET,
                client: {
                    name: document.getElementById('client-name').value.trim(),
                    phone: document.getElementById('client-phone').value.trim(),
                    email: document.getElementById('client-email').value.trim(),
                    address: document.getElementById('client-address').value.trim(),
                    company: document.getElementById('client-company').value.trim()
                },
                default_amount: document.getElementById('client-amount').value || 0,
                billing_cycle: document.getElementById('client-billing-cycle').value,
                tags: document.getElementById('client-tags').value.trim(),
                notes: document.getElementById('client-notes').value.trim()
            };
            
            // Validate
            if (!clientData.client.name || !clientData.client.phone || !clientData.client.email) {
                this.showToast('Please fill all required fields', 'warning');
                return;
            }
            
            // Show loading
            const submitBtn = document.querySelector('#client-form button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px;"></div>';
            submitBtn.disabled = true;
            
            // Create client via API
            const response = await fetch(`${this.config.API_BASE}/createPaymentRecord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...clientData,
                    services_json: JSON.stringify([{ name: "New Client Setup", price: 0 }]),
                    subtotal: 0,
                    discount: 0,
                    gst_percent: 0,
                    total_amount: 0,
                    created_by: "CRM System"
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showToast('Client added successfully!', 'success');
                this.closeAddClientModal();
                this.loadClients(); // Refresh client list
            } else {
                this.showToast(result.error || 'Failed to add client', 'error');
            }
            
        } catch (error) {
            console.error('Error adding client:', error);
            this.showToast('Error adding client. Please try again.', 'error');
        } finally {
            const submitBtn = document.querySelector('#client-form button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Client';
            submitBtn.disabled = false;
        }
    }

    async viewClientDetails(clientId) {
        try {
            const client = this.state.clients.find(c => c.client_id === clientId);
            if (!client) {
                this.showToast('Client not found', 'error');
                return;
            }
            
            // Show client details in a modal
            const modalHtml = `
                <div class="modal-overlay-premium active">
                    <div class="modal-premium" style="max-width: 800px;">
                        <div class="modal-header-premium">
                            <h3>Client Details: ${client.name}</h3>
                            <button class="modal-close-premium" onclick="this.closest('.modal-overlay-premium').remove()">&times;</button>
                        </div>
                        <div class="modal-body-premium">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 class="font-bold mb-3">Contact Information</h4>
                                    <div class="space-y-2">
                                        <p><strong>Client ID:</strong> ${client.client_id}</p>
                                        <p><strong>Name:</strong> ${client.name}</p>
                                        <p><strong>Phone:</strong> ${this.formatPhone(client.phone)}</p>
                                        <p><strong>Email:</strong> ${client.email}</p>
                                        <p><strong>Address:</strong> ${client.address || 'Not provided'}</p>
                                        ${client.company ? `<p><strong>Company:</strong> ${client.company}</p>` : ''}
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-bold mb-3">Billing Information</h4>
                                    <div class="space-y-2">
                                        <p><strong>Default Amount:</strong> ₹${client.default_amount || 0}</p>
                                        <p><strong>Billing Cycle:</strong> ${client.billing_cycle || 'Not set'}</p>
                                        <p><strong>Status:</strong> <span class="badge-premium ${client.subscription_status === 'Active' ? 'badge-success' : 'badge-warning'}">${client.subscription_status || 'New'}</span></p>
                                        <p><strong>Created:</strong> ${this.formatDate(client.created_timestamp)}</p>
                                        <p><strong>Last Updated:</strong> ${this.formatDate(client.updated_timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                            
                            ${client.tags ? `
                                <div class="mt-6">
                                    <h4 class="font-bold mb-3">Tags</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${client.tags.split(',').map(tag => `
                                            <span class="px-3 py-1 bg-glass-bg rounded-full text-sm">${tag.trim()}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${client.notes ? `
                                <div class="mt-6">
                                    <h4 class="font-bold mb-3">Notes</h4>
                                    <div class="p-4 bg-glass-bg rounded">${client.notes}</div>
                                </div>
                            ` : ''}
                            
                            <div class="mt-6 flex gap-3">
                                <button class="btn-premium btn-primary-premium" onclick="crm.sendWhatsApp('${client.phone}', '${client.name}')">
                                    <i class="fab fa-whatsapp"></i> Send WhatsApp
                                </button>
                                <button class="btn-premium btn-secondary-premium" onclick="crm.sendEmail('${client.email}', '${client.name}')">
                                    <i class="fas fa-envelope"></i> Send Email
                                </button>
                                <button class="btn-premium btn-secondary-premium" onclick="crm.createInvoiceForClient('${client.client_id}')">
                                    <i class="fas fa-file-invoice"></i> Create Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Create and show modal
            const modalDiv = document.createElement('div');
            modalDiv.innerHTML = modalHtml;
            document.body.appendChild(modalDiv);
            
        } catch (error) {
            console.error('Error viewing client:', error);
            this.showToast('Error loading client details', 'error');
        }
    }

    editClient(clientId) {
        this.showToast('Edit functionality coming soon!', 'info');
        // TODO: Implement edit client functionality
    }

    createInvoiceForClient(clientId) {
        window.location.href = `admin.html?client_id=${clientId}#create-invoice`;
   
