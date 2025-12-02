// CRM Configuration
const CRM_CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/AKfycbx07QetFwOnkrHlNs2XWHKJUf-FVamBxzvr_ea75x1aJvV1A2wfsBIM3LkZZJfnalm5/exec',
    ADMIN_SECRET: localStorage.getItem('admin_secret') || '',
    ITEMS_PER_PAGE: 10
};

// State
let crmState = {
    clients: [],
    filteredClients: [],
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    filters: {
        search: '',
        status: '',
        tags: ''
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initHamburger();
    initEventListeners();
    loadClients();
    loadReminders();
});

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!themeToggle || !themeIcon) return;
    
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
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Event Listeners
function initEventListeners() {
    // Search and Filter
    document.getElementById('search-client')?.addEventListener('input', function() {
        crmState.filters.search = this.value;
        applyFilters();
    });
    
    document.getElementById('filter-status')?.addEventListener('change', function() {
        crmState.filters.status = this.value;
        applyFilters();
    });
    
    document.getElementById('filter-tags')?.addEventListener('change', function() {
        crmState.filters.tags = this.value;
        applyFilters();
    });
    
    document.getElementById('apply-filters')?.addEventListener('click', applyFilters);
    
    // Refresh and Export
    document.getElementById('refresh-clients')?.addEventListener('click', loadClients);
    document.getElementById('export-clients')?.addEventListener('click', exportClients);
    
    // New Client
    document.getElementById('new-client')?.addEventListener('click', showNewClientModal);
    
    // Pagination
    document.getElementById('prev-page')?.addEventListener('click', goToPrevPage);
    document.getElementById('next-page')?.addEventListener('click', goToNextPage);
    
    // Reminders
    document.getElementById('send-all-reminders')?.addEventListener('click', sendAllReminders);
    
    // Client Details Modal
    document.getElementById('close-client-details')?.addEventListener('click', () => {
        document.getElementById('client-details-modal').classList.remove('active');
    });
    
    // Close modal on overlay click
    document.getElementById('client-details-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

// Load Clients
async function loadClients() {
    try {
        const response = await fetch(`${CRM_CONFIG.API_BASE}/getClients?admin_secret=${CRM_CONFIG.ADMIN_SECRET}`);
        const data = await response.json();
        
        if (data.success) {
            crmState.clients = data.clients || [];
            crmState.totalClients = crmState.clients.length;
            applyFilters();
        } else {
            showAlert(data.error || 'Failed to load clients', 'danger');
        }
    } catch (error) {
        console.error('Error loading clients:', error);
        showAlert('Error loading clients. Please try again.', 'danger');
    }
}

// Apply Filters
function applyFilters() {
    let filtered = [...crmState.clients];
    
    // Apply search filter
    if (crmState.filters.search) {
        const searchTerm = crmState.filters.search.toLowerCase();
        filtered = filtered.filter(client => 
            client.name?.toLowerCase().includes(searchTerm) ||
            client.phone?.includes(searchTerm) ||
            client.email?.toLowerCase().includes(searchTerm) ||
            client.client_id?.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (crmState.filters.status) {
        filtered = filtered.filter(client => 
            client.subscription_status === crmState.filters.status
        );
    }
    
    // Apply tags filter
    if (crmState.filters.tags) {
        filtered = filtered.filter(client => 
            client.tags?.includes(crmState.filters.tags)
        );
    }
    
    crmState.filteredClients = filtered;
    crmState.totalPages = Math.ceil(filtered.length / CRM_CONFIG.ITEMS_PER_PAGE);
    crmState.currentPage = 1;
    
    updateClientsTable();
    updatePagination();
}

// Update Clients Table
function updateClientsTable() {
    const tbody = document.getElementById('clients-body');
    const countElement = document.getElementById('client-count');
    
    if (!tbody || !countElement) return;
    
    tbody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (crmState.currentPage - 1) * CRM_CONFIG.ITEMS_PER_PAGE;
    const endIndex = startIndex + CRM_CONFIG.ITEMS_PER_PAGE;
    const pageClients = crmState.filteredClients.slice(startIndex, endIndex);
    
    if (pageClients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" class="text-center py-8">
                <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No clients found</p>
            </td>
        `;
        tbody.appendChild(row);
    } else {
        pageClients.forEach(client => {
            const row = document.createElement('tr');
            
            // Status badge
            let statusBadge = '';
            switch(client.subscription_status) {
                case 'Active':
                    statusBadge = '<span class="badge badge-success">Active</span>';
                    break;
                case 'Expired':
                    statusBadge = '<span class="badge badge-warning">Expired</span>';
                    break;
                case 'Cancelled':
                    statusBadge = '<span class="badge badge-danger">Cancelled</span>';
                    break;
                default:
                    statusBadge = '<span class="badge badge-info">New</span>';
            }
            
            // Parse services
            let servicesHtml = 'No services';
            try {
                if (client.default_services_json) {
                    const services = JSON.parse(client.default_services_json);
                    if (Array.isArray(services) && services.length > 0) {
                        servicesHtml = services.map(s => s.name).join(', ');
                    }
                }
            } catch (e) {
                console.error('Error parsing services:', e);
            }
            
            row.innerHTML = `
                <td>${client.client_id || 'N/A'}</td>
                <td>${client.name || 'N/A'}</td>
                <td>${formatPhone(client.phone)}</td>
                <td>${client.email || 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>${servicesHtml}</td>
                <td>₹${client.default_amount || 0}</td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-outline view-client" data-id="${client.client_id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary edit-client" data-id="${client.client_id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-success create-invoice" data-id="${client.client_id}">
                            <i class="fas fa-file-invoice"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    // Update count
    countElement.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, crmState.filteredClients.length)} of ${crmState.filteredClients.length} clients`;
    
    // Add event listeners
    addClientRowEventListeners();
}

// Add event listeners to client rows
function addClientRowEventListeners() {
    // View Client
    document.querySelectorAll('.view-client').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            viewClientDetails(clientId);
        });
    });
    
    // Edit Client
    document.querySelectorAll('.edit-client').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            editClient(clientId);
        });
    });
    
    // Create Invoice
    document.querySelectorAll('.create-invoice').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.getAttribute('data-id');
            createInvoiceForClient(clientId);
        });
    });
}

// View Client Details
async function viewClientDetails(clientId) {
    try {
        const client = crmState.clients.find(c => c.client_id === clientId);
        if (!client) return;
        
        // Get client invoices
        const response = await fetch(`${CRM_CONFIG.API_BASE}/getClientInvoices?admin_secret=${CRM_CONFIG.ADMIN_SECRET}&client_id=${clientId}`);
        const data = await response.json();
        
        const modal = document.getElementById('client-details-modal');
        const content = document.getElementById('client-details-content');
        
        if (!modal || !content) return;
        
        // Build client details HTML
        let detailsHtml = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="detail-section">
                    <h4 class="text-lg font-bold mb-3">Client Information</h4>
                    <div class="space-y-2">
                        <p><strong>Name:</strong> ${client.name}</p>
                        <p><strong>Phone:</strong> ${formatPhone(client.phone)}</p>
                        <p><strong>Email:</strong> ${client.email}</p>
                        <p><strong>Address:</strong> ${client.address || 'Not provided'}</p>
                        <p><strong>Client ID:</strong> ${client.client_id}</p>
                        <p><strong>Created:</strong> ${formatDate(client.created_timestamp)}</p>
                        <p><strong>Status:</strong> ${client.subscription_status || 'Not set'}</p>
                        <p><strong>Tags:</strong> ${client.tags || 'None'}</p>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4 class="text-lg font-bold mb-3">Billing Information</h4>
                    <div class="space-y-2">
                        <p><strong>Default Amount:</strong> ₹${client.default_amount || 0}</p>
                        <p><strong>Billing Cycle:</strong> ${client.billing_cycle || 'Not set'}</p>
                        <p><strong>Subscription Start:</strong> ${formatDate(client.subscription_start_date)}</p>
                        <p><strong>Subscription End:</strong> ${formatDate(client.subscription_end_date)}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add services if available
        if (client.default_services_json) {
            try {
                const services = JSON.parse(client.default_services_json);
                if (Array.isArray(services) && services.length > 0) {
                    detailsHtml += `
                        <div class="mt-6 detail-section">
                            <h4 class="text-lg font-bold mb-3">Default Services</h4>
                            <div class="space-y-2">
                                ${services.map(service => `
                                    <div class="border rounded p-3">
                                        <p><strong>${service.name}</strong></p>
                                        <p>Price: ₹${service.price || 0}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            } catch (e) {
                console.error('Error parsing services:', e);
            }
        }
        
        // Add notes if available
        if (client.notes) {
            detailsHtml += `
                <div class="mt-6 detail-section">
                    <h4 class="text-lg font-bold mb-3">Notes</h4>
                    <p>${client.notes}</p>
                </div>
            `;
        }
        
        // Add recent invoices if available
        if (data.success && data.invoices && data.invoices.length > 0) {
            detailsHtml += `
                <div class="mt-6 detail-section">
                    <h4 class="text-lg font-bold mb-3">Recent Invoices (Last 5)</h4>
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.invoices.slice(0, 5).map(invoice => `
                                    <tr>
                                        <td>${invoice.invoice_id}</td>
                                        <td>₹${invoice.total_amount}</td>
                                        <td>${getStatusBadge(invoice.status)}</td>
                                        <td>${formatDate(invoice.created_timestamp)}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline view-invoice" data-id="${invoice.invoice_id}">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        
        // Add action buttons
        detailsHtml += `
            <div class="mt-6 flex gap-3">
                <button class="btn btn-primary" id="send-whatsapp">
                    <i class="fab fa-whatsapp"></i> Send WhatsApp
                </button>
                <button class="btn btn-secondary" id="send-email">
                    <i class="fas fa-envelope"></i> Send Email
                </button>
                <button class="btn btn-outline" id="create-subscription">
                    <i class="fas fa-calendar-plus"></i> Create Subscription
                </button>
            </div>
        `;
        
        content.innerHTML = detailsHtml;
        modal.classList.add('active');
        
        // Update modal title
        document.getElementById('client-modal-title').textContent = `Client: ${client.name}`;
        
        // Add event listeners to new buttons
        document.getElementById('send-whatsapp')?.addEventListener('click', () => {
            sendWhatsAppToClient(client);
        });
        
        document.getElementById('send-email')?.addEventListener('click', () => {
            sendEmailToClient(client);
        });
        
        document.getElementById('create-subscription')?.addEventListener('click', () => {
            createSubscriptionForClient(client);
        });
        
        // Add event listeners to invoice view buttons
        document.querySelectorAll('.view-invoice').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.getAttribute('data-id');
                viewInvoice(invoiceId);
            });
        });
        
    } catch (error) {
        console.error('Error viewing client details:', error);
        showAlert('Error loading client details', 'danger');
    }
}

// Edit Client
function editClient(clientId) {
    showAlert('Edit functionality coming soon!', 'info');
    // TODO: Implement edit client modal
}

// Create Invoice for Client
function createInvoiceForClient(clientId) {
    const client = crmState.clients.find(c => c.client_id === clientId);
    if (client) {
        // Redirect to admin page with client pre-selected
        window.location.href = `admin.html?client_id=${clientId}`;
    }
}

// Show New Client Modal
function showNewClientModal() {
    // TODO: Implement new client modal
    // For now, redirect to admin page
    window.location.href = 'admin.html#new-client';
}

// Export Clients
function exportClients() {
    try {
        // Create CSV content
        const headers = ['Client ID', 'Name', 'Phone', 'Email', 'Address', 'Status', 'Default Amount', 'Created Date', 'Tags'];
        const rows = crmState.filteredClients.map(client => [
            client.client_id,
            client.name,
            client.phone,
            client.email,
            client.address,
            client.subscription_status,
            client.default_amount,
            client.created_timestamp,
            client.tags
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infogrip-clients-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert('Clients exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting clients:', error);
        showAlert('Error exporting clients', 'danger');
    }
}

// Pagination
function updatePagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    if (!prevBtn || !nextBtn || !pageInfo) return;
    
    // Update buttons
    prevBtn.disabled = crmState.currentPage === 1;
    nextBtn.disabled = crmState.currentPage === crmState.totalPages;
    
    // Update page info
    pageInfo.textContent = `Page ${crmState.currentPage} of ${crmState.totalPages}`;
}

function goToPrevPage() {
    if (crmState.currentPage > 1) {
        crmState.currentPage--;
        updateClientsTable();
        updatePagination();
    }
}

function goToNextPage() {
    if (crmState.currentPage < crmState.totalPages) {
        crmState.currentPage++;
        updateClientsTable();
        updatePagination();
    }
}

// Load Reminders
async function loadReminders() {
    try {
        const response = await fetch(`${CRM_CONFIG.API_BASE}/getPendingReminders?admin_secret=${CRM_CONFIG.ADMIN_SECRET}`);
        const data = await response.json();
        
        if (data.success) {
            updateRemindersTable(data.reminders || []);
        }
    } catch (error) {
        console.error('Error loading reminders:', error);
    }
}

// Update Reminders Table
function updateRemindersTable(reminders) {
    const tbody = document.getElementById('reminders-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (reminders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" class="text-center py-8">
                <i class="fas fa-bell-slash text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No pending reminders</p>
            </td>
        `;
        tbody.appendChild(row);
    } else {
        reminders.forEach(reminder => {
            const row = document.createElement('tr');
            
            // Format dates
            const dueDate = formatDate(reminder.next_billing_date || reminder.due_date);
            const daysUntilDue = reminder.days_until_due || 0;
            
            // Status indicator
            let statusClass = '';
            if (daysUntilDue <= 1) {
                statusClass = 'badge badge-danger';
            } else if (daysUntilDue <= 3) {
                statusClass = 'badge badge-warning';
            } else {
                statusClass = 'badge badge-info';
            }
            
            row.innerHTML = `
                <td>${reminder.client_name || 'N/A'}</td>
                <td>${reminder.service_name || 'N/A'}</td>
                <td>${dueDate} (${daysUntilDue} days)</td>
                <td>₹${reminder.amount || 0}</td>
                <td>${reminder.reminder_type || 'Subscription Renewal'}</td>
                <td><span class="${statusClass}">Pending</span></td>
                <td>
                    <button class="btn btn-sm btn-primary send-reminder" data-id="${reminder.reminder_id || reminder.subscription_id}">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                    <button class="btn btn-sm btn-outline view-details" data-id="${reminder.reminder_id || reminder.subscription_id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.send-reminder').forEach(btn => {
            btn.addEventListener('click', function() {
                const reminderId = this.getAttribute('data-id');
                sendSingleReminder(reminderId);
            });
        });
    }
}

// Send All Reminders
async function sendAllReminders() {
    try {
        const response = await fetch(`${CRM_CONFIG.API_BASE}/sendAllReminders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_secret: CRM_CONFIG.ADMIN_SECRET
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(`Sent ${data.count || 0} reminders successfully!`, 'success');
            loadReminders();
        } else {
            showAlert(data.error || 'Failed to send reminders', 'danger');
        }
    } catch (error) {
        console.error('Error sending all reminders:', error);
        showAlert('Error sending reminders', 'danger');
    }
}

// Send Single Reminder
async function sendSingleReminder(reminderId) {
    try {
        const response = await fetch(`${CRM_CONFIG.API_BASE}/sendReminder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_secret: CRM_CONFIG.ADMIN_SECRET,
                reminder_id: reminderId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Reminder sent successfully!', 'success');
            if (data.wa_link) {
                showAlert(`WhatsApp Link: <a href="${data.wa_link}" target="_blank">Click to open WhatsApp</a>`, 'info');
            }
            loadReminders();
        } else {
            showAlert(data.error || 'Failed to send reminder', 'danger');
        }
    } catch (error) {
        console.error('Error sending reminder:', error);
        showAlert('Error sending reminder', 'danger');
    }
}

// Client Communication
function sendWhatsAppToClient(client) {
    const phone = client.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${client.name},\n\nThis is InfoGrip Media Solution. How can we assist you today?\n\nBest regards,\nInfoGrip Team`);
    const waLink = `https://wa.me/91${phone}?text=${message}`;
    
    window.open(waLink, '_blank');
}

function sendEmailToClient(client) {
    const subject = encodeURIComponent('InfoGrip Media Solution - Important Update');
    const body = encodeURIComponent(`Dear ${client.name},\n\nThank you for choosing InfoGrip Media Solution.\n\nBest regards,\nInfoGrip Team`);
    const mailto = `mailto:${client.email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailto;
}

function createSubscriptionForClient(client) {
    showAlert(`Creating subscription for ${client.name}...`, 'info');
    // TODO: Implement subscription creation
}

function viewInvoice(invoiceId) {
    window.open(`checkout.html?invoice_id=${invoiceId}`, '_blank');
}

// Utility Functions
function formatPhone(phone) {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

function formatDate(dateString) {
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

function getStatusBadge(status) {
    switch(status?.toLowerCase()) {
        case 'paid':
            return '<span class="badge badge-success">Paid</span>';
        case 'pending':
            return '<span class="badge badge-warning">Pending</span>';
        case 'failed':
            return '<span class="badge badge-danger">Failed</span>';
        default:
            return '<span class="badge badge-info">Unknown</span>';
    }
}

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

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// Export CRM functions
window.InfoGripCRM = {
    loadClients,
    loadReminders,
    showAlert
};
