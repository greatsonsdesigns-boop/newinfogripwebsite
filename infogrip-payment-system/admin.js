// InfoGrip CRM & Billing System - Admin Dashboard JavaScript

// Configuration
const CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_WEB_APP_ID/exec',
    ADMIN_SECRET: localStorage.getItem('admin_secret') || '',
    LOGO_URL: 'https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png',
    WHATSAPP_NUMBER: '+916367556906',
    EMAIL: 'infogripmarketing@gmail.com'
};

// Global Variables
let currentUser = null;
let clients = [];
let services = [];
let currentInvoiceItems = [];
let revenueChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initEventListeners();
    loadDashboardData();
    loadServices();
    setupCharts();
});

// Authentication Functions - FIXED VERSION
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('token_expiry');
    
    if (!token || !expiry || new Date(expiry) < new Date()) {
        showLoginModal();
    } else {
        // Decode token to get user info
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            currentUser = {
                email: tokenData.email,
                name: tokenData.name
            };
            updateAdminInfo();
        } catch (e) {
            showLoginModal();
        }
    }
}

function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'flex';
    
    // Clear previous values
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminSecret').value = '';
    
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        const secret = document.getElementById('adminSecret').value.trim();
        
        // TEST CREDENTIALS - USE THESE
        const testCredentials = [
            { email: 'admin@infogrip.com', password: 'infogrip123', secret: 'infogrip2025' },
            { email: 'user@infogrip.com', password: 'password123', secret: 'infogrip2025' },
            { email: 'test@infogrip.com', password: 'test123', secret: 'infogrip2025' }
        ];
        
        // Check if credentials match
        const validCreds = testCredentials.find(cred => 
            cred.email === email && 
            cred.password === password && 
            cred.secret === secret
        );
        
        if (validCreds) {
            // Create token
            const tokenData = {
                email: email,
                name: email.split('@')[0].toUpperCase(),
                exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            };
            
            const token = btoa(JSON.stringify(tokenData));
            
            localStorage.setItem('admin_token', token);
            localStorage.setItem('token_expiry', new Date(tokenData.exp).toISOString());
            localStorage.setItem('admin_user', JSON.stringify({
                email: email,
                name: email.split('@')[0].toUpperCase()
            }));
            
            loginModal.style.display = 'none';
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome to InfoGrip CRM',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid email, password or secret key',
                confirmButtonText: 'Try Again'
            });
        }
    };
}
function updateAdminInfo() {
    if (currentUser) {
        document.getElementById('adminName').textContent = currentUser.name;
    }
}

function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('admin_user');
    location.reload();
}

// Event Listeners Setup
function initEventListeners() {
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Quick Action Buttons
    document.getElementById('quickInvoiceBtn').addEventListener('click', () => {
        navigateToPage('create-invoice');
    });
    
    document.getElementById('quickClientBtn').addEventListener('click', () => {
        showClientModal();
    });
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Client Modal
    document.getElementById('addClientBtn').addEventListener('click', showClientModal);
    document.getElementById('quickAddClientBtn').addEventListener('click', showClientModal);
    document.getElementById('saveClientBtn').addEventListener('click', saveClient);
    
    // Invoice Form
    document.getElementById('addItemBtn').addEventListener('click', addInvoiceItem);
    document.getElementById('discountType').addEventListener('change', updateDiscountField);
    document.getElementById('generateInvoiceBtn').addEventListener('click', generateInvoice);
    document.getElementById('isSubscription').addEventListener('change', toggleSubscriptionOptions);
    
    // Modal Close Buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Client Search
    document.getElementById('clientSearch').addEventListener('input', debounce(searchClients, 300));
}

// Navigation Functions
function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'clients': 'Clients Management',
        'create-invoice': 'Create Invoice',
        'subscriptions': 'Subscriptions',
        'payments': 'Payments History',
        'services': 'Services & Pricing',
        'tasks': 'Tasks & Follow-ups',
        'settings': 'Settings'
    };
    
    const subtitles = {
        'dashboard': 'Welcome to InfoGrip CRM & Billing System',
        'clients': 'Manage your clients and their information',
        'create-invoice': 'Create and send invoices to clients',
        'subscriptions': 'Manage recurring subscriptions',
        'payments': 'View payment history and transactions',
        'services': 'Configure services and pricing',
        'tasks': 'Track tasks and follow-ups',
        'settings': 'System settings and configuration'
    };
    
    document.getElementById('pageTitle').textContent = titles[page] || page;
    document.getElementById('pageSubtitle').textContent = subtitles[page] || '';
    
    // Show active page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page + 'Page').classList.add('active');
    
    // Load page-specific data
    switch(page) {
        case 'clients':
            loadClients();
            break;
        case 'subscriptions':
            loadSubscriptions();
            break;
        case 'payments':
            loadPayments();
            break;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        // Fetch dashboard data from API
        const response = await fetch(`${CONFIG.API_BASE}?action=getDashboardData`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update KPI cards
            document.getElementById('totalClients').textContent = data.totalClients || '0';
            document.getElementById('activeSubscriptions').textContent = data.activeSubscriptions || '0';
            document.getElementById('monthlyRevenue').textContent = formatCurrency(data.monthlyRevenue || 0);
            document.getElementById('todayPayments').textContent = data.todayPayments || '0';
            
            // Update recent activities
            updateActivities(data.recentActivities || []);
            
            // Update expiring subscriptions
            updateExpiringSubscriptions(data.expiringSubscriptions || []);
            
            // Update chart data if available
            if (data.revenueData && revenueChart) {
                updateRevenueChart(data.revenueData);
            }
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use mock data for demo
        document.getElementById('totalClients').textContent = '127';
        document.getElementById('activeSubscriptions').textContent = '89';
        document.getElementById('monthlyRevenue').textContent = '₹1,84,500';
        document.getElementById('todayPayments').textContent = '12';
    }
}

function setupCharts() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Revenue (₹)',
                data: [85000, 102000, 95000, 120000, 135000, 145000, 184500],
                borderColor: '#fdcb54',
                backgroundColor: 'rgba(253, 203, 84, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

function updateRevenueChart(data) {
    if (revenueChart && data) {
        revenueChart.data.datasets[0].data = data.values;
        revenueChart.data.labels = data.labels;
        revenueChart.update();
    }
}

function updateActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!activities || activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No recent activities</p>
            </div>
        `;
        return;
    }
    
    const html = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function updateExpiringSubscriptions(subscriptions) {
    const container = document.getElementById('expiringSubscriptions');
    
    if (!subscriptions || subscriptions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>No subscriptions expiring soon</p>
            </div>
        `;
        return;
    }
    
    const html = subscriptions.map(sub => `
        <div class="subscription-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6>${sub.client_name}</h6>
                    <p class="mb-0">${sub.service_name} - ${formatCurrency(sub.amount)}</p>
                </div>
                <span class="badge ${sub.days <= 3 ? 'bg-danger' : 'bg-warning'}">
                    ${sub.days} days
                </span>
            </div>
            <div class="mt-2">
                <small class="text-muted">Expires: ${sub.expiry_date}</small>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Client Management Functions
async function loadClients() {
    try {
        // Fetch clients from API
        const response = await fetch(`${CONFIG.API_BASE}?action=getClients`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            }
        });
        
        const data = await response.json();
        clients = data.clients || [];
        renderClientsTable(clients);
    } catch (error) {
        console.error('Error loading clients:', error);
        // Use mock data for demo
        clients = getMockClients();
        renderClientsTable(clients);
    }
}

function renderClientsTable(clientsList) {
    const tbody = document.getElementById('clientsTableBody');
    
    if (clientsList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-5">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>No clients found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const html = clientsList.map((client, index) => `
        <tr>
            <td><input type="checkbox" class="client-checkbox" data-id="${client.id}"></td>
            <td><code>${client.client_id}</code></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2">${client.name.charAt(0)}</div>
                    <strong>${client.name}</strong>
                </div>
            </td>
            <td><a href="tel:${client.phone}">${formatPhone(client.phone)}</a></td>
            <td><a href="mailto:${client.email}">${client.email}</a></td>
            <td>
                <span class="badge ${client.active_subscriptions > 0 ? 'bg-success' : 'bg-secondary'}">
                    ${client.active_subscriptions || 0}
                </span>
            </td>
            <td>${formatCurrency(client.total_spent || 0)}</td>
            <td>
                <span class="status-badge ${client.status === 'Active' ? 'status-active' : 'status-expired'}">
                    ${client.status || 'Active'}
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline" onclick="viewClient('${client.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editClient('${client.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="deleteClient('${client.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

function searchClients() {
    const query = document.getElementById('clientSearch').value.toLowerCase();
    
    if (!query) {
        renderClientsTable(clients);
        return;
    }
    
    const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.client_id.toLowerCase().includes(query)
    );
    
    renderClientsTable(filtered);
}

function showClientModal(editMode = false, clientId = null) {
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('modalClientTitle');
    const form = document.getElementById('clientForm');
    
    if (editMode && clientId) {
        title.textContent = 'Edit Client';
        // Load client data
        const client = clients.find(c => c.id === clientId);
        if (client) {
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientPhone').value = client.phone;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientAddress').value = client.address || '';
            document.getElementById('clientTags').value = client.tags || '';
            document.getElementById('clientNotes').value = client.notes || '';
        }
    } else {
        title.textContent = 'Add New Client';
        form.reset();
        document.getElementById('clientId').value = '';
    }
    
    modal.style.display = 'flex';
}

async function saveClient() {
    const clientData = {
        id: document.getElementById('clientId').value,
        name: document.getElementById('clientName').value,
        phone: document.getElementById('clientPhone').value,
        email: document.getElementById('clientEmail').value,
        address: document.getElementById('clientAddress').value,
        tags: document.getElementById('clientTags').value,
        notes: document.getElementById('clientNotes').value
    };
    
    // Validate required fields
    if (!clientData.name || !clientData.phone) {
        alert('Name and phone number are required');
        return;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(clientData.phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Validate email if provided
    if (clientData.email && !validateEmail(clientData.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    try {
        // Check for duplicates
        const duplicate = clients.find(client => 
            client.phone === clientData.phone && 
            (!clientData.id || client.id !== clientData.id)
        );
        
        if (duplicate) {
            showDuplicateModal(duplicate, clientData);
            return;
        }
        
        // Save client via API
        const response = await fetch(`${CONFIG.API_BASE}?action=saveClient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
            body: JSON.stringify({
                ...clientData,
                admin_secret: CONFIG.ADMIN_SECRET
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Client saved successfully!');
            document.getElementById('clientModal').style.display = 'none';
            loadClients();
            loadDashboardData(); // Refresh dashboard
        } else {
            alert('Error saving client: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving client:', error);
        alert('Error saving client. Please try again.');
    }
}

function showDuplicateModal(existingClient, newClientData) {
    const modal = document.getElementById('duplicateModal');
    
    document.getElementById('dupClientName').textContent = existingClient.name;
    document.getElementById('dupClientPhone').textContent = existingClient.phone;
    document.getElementById('dupClientEmail').textContent = existingClient.email;
    
    modal.style.display = 'flex';
    
    // Handle modal button clicks
    document.getElementById('useExistingBtn').onclick = function() {
        modal.style.display = 'none';
        document.getElementById('clientModal').style.display = 'none';
        // Use existing client for current operation
    };
    
    document.getElementById('mergeBtn').onclick = function() {
        // Merge logic would go here
        modal.style.display = 'none';
        alert('Merge functionality coming soon!');
    };
    
    document.getElementById('createNewBtn').onclick = function() {
        modal.style.display = 'none';
        // Continue with save
        continueSaveClient(newClientData);
    };
}

async function continueSaveClient(clientData) {
    // Implementation for saving despite duplicate
    alert('Creating new client anyway...');
}

// Invoice Management Functions
function addInvoiceItem() {
    const tbody = document.getElementById('invoiceItemsBody');
    const rowCount = tbody.children.length;
    
    const html = `
        <tr>
            <td>
                <select class="form-control service-select" onchange="updateServicePrice(this)">
                    <option value="">Select Service</option>
                    ${services.map(s => `<option value="${s.id}" data-price="${s.price}">${s.name}</option>`).join('')}
                    <option value="custom">Custom Service</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control description" placeholder="Description" oninput="updateRowTotal(this)">
            </td>
            <td>
                <input type="number" class="form-control quantity" value="1" min="1" oninput="updateRowTotal(this)">
            </td>
            <td>
                <input type="number" class="form-control unit-price" placeholder="0.00" step="0.01" oninput="updateRowTotal(this)">
            </td>
            <td>
                <input type="text" class="form-control total" value="0.00" readonly>
            </td>
            <td>
                <button class="btn btn-danger btn-sm remove-item" onclick="removeInvoiceItem(this)" ${rowCount === 0 ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    
    tbody.insertAdjacentHTML('beforeend', html);
    updateRemoveButtons();
    updateInvoiceSummary();
}

function updateServicePrice(select) {
    const row = select.closest('tr');
    const priceInput = row.querySelector('.unit-price');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.dataset.price) {
        priceInput.value = selectedOption.dataset.price;
        updateRowTotal(priceInput);
    }
}

function updateRowTotal(input) {
    const row = input.closest('tr');
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
    const totalInput = row.querySelector('.total');
    
    const total = quantity * unitPrice;
    totalInput.value = total.toFixed(2);
    
    updateInvoiceSummary();
}

function removeInvoiceItem(button) {
    const row = button.closest('tr');
    if (document.getElementById('invoiceItemsBody').children.length > 1) {
        row.remove();
        updateRemoveButtons();
        updateInvoiceSummary();
    }
}

function updateRemoveButtons() {
    const rows = document.getElementById('invoiceItemsBody').children;
    const removeButtons = document.querySelectorAll('.remove-item');
    
    removeButtons.forEach(button => {
        button.disabled = rows.length <= 1;
    });
}

function updateInvoiceSummary() {
    let subtotal = 0;
    
    document.querySelectorAll('#invoiceItemsBody tr').forEach(row => {
        const total = parseFloat(row.querySelector('.total').value) || 0;
        subtotal += total;
    });
    
    const discountType = document.getElementById('discountType').value;
    const discountValue = parseFloat(document.getElementById('discountValue').value) || 0;
    const gstPercent = parseFloat(document.getElementById('gstPercent').value) || 0;
    
    let discount = 0;
    if (discountType === 'fixed') {
        discount = discountValue;
    } else if (discountType === 'percentage') {
        discount = (subtotal * discountValue) / 100;
    }
    
    const afterDiscount = subtotal - discount;
    const gstAmount = (afterDiscount * gstPercent) / 100;
    const totalAmount = afterDiscount + gstAmount;
    
    // Update display
    document.getElementById('subtotalAmount').textContent = formatCurrency(subtotal);
    document.getElementById('discountAmount').textContent = formatCurrency(discount, true);
    document.getElementById('gstDisplay').textContent = gstPercent;
    document.getElementById('gstAmount').textContent = formatCurrency(gstAmount);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

function updateDiscountField() {
    const discountType = document.getElementById('discountType').value;
    const discountValue = document.getElementById('discountValue');
    
    discountValue.disabled = discountType === 'none';
    discountValue.placeholder = discountType === 'percentage' ? 'Percentage' : 'Amount';
    updateInvoiceSummary();
}

function toggleSubscriptionOptions() {
    const isSubscription = document.getElementById('isSubscription').checked;
    document.getElementById('subscriptionOptions').style.display = isSubscription ? 'block' : 'none';
}

async function generateInvoice() {
    const clientSelect = document.getElementById('clientSelect');
    const selectedClientId = clientSelect.value;
    
    if (!selectedClientId) {
        alert('Please select a client');
        return;
    }
    
    // Collect invoice data
    const invoiceData = {
        client_id: selectedClientId,
        items: [],
        discount_type: document.getElementById('discountType').value,
        discount_value: parseFloat(document.getElementById('discountValue').value) || 0,
        gst_percent: parseFloat(document.getElementById('gstPercent').value) || 0,
        is_subscription: document.getElementById('isSubscription').checked,
        billing_cycle: document.getElementById('billingCycle').value,
        auto_renew: document.getElementById('autoRenew').checked,
        save_as_default: document.getElementById('saveAsDefault').checked
    };
    
    // Collect items
    document.querySelectorAll('#invoiceItemsBody tr').forEach(row => {
        const service = row.querySelector('.service-select').value;
        const description = row.querySelector('.description').value;
        const quantity = parseFloat(row.querySelector('.quantity').value) || 1;
        const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
        
        invoiceData.items.push({
            service: service,
            description: description,
            quantity: quantity,
            unit_price: unitPrice,
            total: quantity * unitPrice
        });
    });
    
    // Validate items
    if (invoiceData.items.length === 0) {
        alert('Please add at least one invoice item');
        return;
    }
    
    // Calculate totals
    updateInvoiceSummary();
    const totalAmount = parseFloat(document.getElementById('totalAmount').textContent.replace(/[^0-9.-]+/g, ""));
    
    try {
        // Generate invoice via API
        const response = await fetch(`${CONFIG.API_BASE}?action=createInvoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
            body: JSON.stringify({
                ...invoiceData,
                total_amount: totalAmount,
                admin_secret: CONFIG.ADMIN_SECRET
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showInvoiceSuccessModal(result.invoice_id, result.checkout_link, totalAmount);
        } else {
            alert('Error creating invoice: ' + result.message);
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice. Please try again.');
    }
}

function showInvoiceSuccessModal(invoiceId, checkoutLink, amount) {
    const modal = document.getElementById('invoiceModal');
    
    document.getElementById('generatedInvoiceId').textContent = invoiceId;
    document.getElementById('generatedAmount').textContent = formatCurrency(amount);
    document.getElementById('paymentLink').value = checkoutLink;
    
    // Generate QR Code
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    QRCode.toCanvas(qrcodeContainer, checkoutLink, {
        width: 180,
        margin: 1,
        color: {
            dark: '#001c4f',
            light: '#ffffff'
        }
    }, function(error) {
        if (error) console.error('QR Code generation error:', error);
    });
    
    // Setup share buttons
    document.getElementById('whatsappShareBtn').onclick = function() {
        const message = `Hello! Please complete your payment of ${formatCurrency(amount)} for invoice ${invoiceId}. Click here to pay: ${checkoutLink}`;
        const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    document.getElementById('emailShareBtn').onclick = function() {
        alert('Email sending functionality will be implemented in the backend');
    };
    
    document.getElementById('copyLinkBtn').onclick = function() {
        const linkInput = document.getElementById('paymentLink');
        linkInput.select();
        document.execCommand('copy');
        alert('Payment link copied to clipboard!');
    };
    
    modal.style.display = 'flex';
}

// Utility Functions
function formatCurrency(amount, showNegative = false) {
    if (showNegative && amount > 0) {
        return `-₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function debounce(func, wait) {
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

// Load services from API or use defaults
async function loadServices() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}?action=getServices`);
        const data = await response.json();
        services = data.services || getDefaultServices();
    } catch (error) {
        console.error('Error loading services:', error);
        services = getDefaultServices();
    }
    
    // Update service dropdowns
    document.querySelectorAll('.service-select').forEach(select => {
        if (select.innerHTML.includes('Select Service')) {
            select.innerHTML = `
                <option value="">Select Service</option>
                ${services.map(s => `<option value="${s.id}" data-price="${s.price}">${s.name}</option>`).join('')}
                <option value="custom">Custom Service</option>
            `;
        }
    });
}

function getDefaultServices() {
    return [
        { id: 'social-media', name: 'Social Media Management', price: 8500 },
        { id: 'website-dev', name: 'Website Development', price: 25000 },
        { id: 'political-branding', name: 'Political Branding', price: 15000 },
        { id: 'ads-management', name: 'Ads Campaign Management', price: 12000 },
        { id: 'content-creation', name: 'Content Creation', price: 5000 },
        { id: 'seo', name: 'SEO Services', price: 8000 }
    ];
}

function getMockClients() {
    return [
        {
            id: '1',
            client_id: 'CL-0001',
            name: 'Rohit Sharma',
            phone: '9876543210',
            email: 'rohit@example.com',
            active_subscriptions: 2,
            total_spent: 85000,
            status: 'Active'
        },
        {
            id: '2',
            client_id: 'CL-0002',
            name: 'Simran Kaur',
            phone: '9876543211',
            email: 'simran@example.com',
            active_subscriptions: 1,
            total_spent: 45000,
            status: 'Active'
        },
        {
            id: '3',
            client_id: 'CL-0003',
            name: 'Rajeev Mehra',
            phone: '9876543212',
            email: 'rajeev@example.com',
            active_subscriptions: 0,
            total_spent: 150000,
            status: 'Expired'
        }
    ];
}

// Expose functions to global scope for onclick attributes
window.viewClient = function(id) {
    alert('View client ' + id);
};

window.editClient = function(id) {
    showClientModal(true, id);
};

window.deleteClient = function(id) {
    if (confirm('Are you sure you want to delete this client?')) {
        alert('Delete client ' + id + ' - This will be implemented in the backend');
    }
};

window.updateServicePrice = updateServicePrice;
window.updateRowTotal = updateRowTotal;
window.removeInvoiceItem = removeInvoiceItem;
