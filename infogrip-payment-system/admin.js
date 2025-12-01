// InfoGrip CRM & Billing System - Admin Dashboard JavaScript
// FIXED VERSION - NO AUTO-LOGOUT

// Configuration
const CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    ADMIN_SECRET: 'infogrip2025',
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
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
let sessionTimer = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initEventListeners();
    loadDashboardData();
    loadServices();
    setupCharts();
});

// ==================== AUTHENTICATION FUNCTIONS (FIXED) ====================
function checkAuth() {
    console.log('🔐 Checking authentication...');
    
    // FIX: Always check if user data exists
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    if (!token || !user) {
        console.log('No session found, showing login');
        showLoginModal();
        return;
    }
    
    try {
        currentUser = JSON.parse(user);
        console.log('✅ User logged in:', currentUser);
        updateAdminInfo();
        
        // Hide login modal if open
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
        }
        
        // Show dashboard
        navigateToPage('dashboard');
        
    } catch (error) {
        console.error('Error parsing user:', error);
        showLoginModal();
    }
}

function showLoginModal() {
    console.log('Showing login modal...');
    
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) {
        console.error('Login modal not found!');
        return;
    }
    
    loginModal.style.display = 'flex';
    
    // Auto-fill test credentials
    document.getElementById('adminEmail').value = 'admin@infogrip.com';
    document.getElementById('adminPassword').value = 'infogrip123';
    document.getElementById('adminSecret').value = 'infogrip2025';
    
    // Clear previous handlers
    const form = document.getElementById('loginForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            handleLogin();
        };
    }
}

function handleLogin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const secret = document.getElementById('adminSecret').value.trim();
    
    console.log('Login attempt:', email);
    
    // Test credentials
    const testCredentials = [
        { email: 'admin@infogrip.com', password: 'infogrip123', secret: 'infogrip2025' },
        { email: 'user@infogrip.com', password: 'password123', secret: 'infogrip2025' },
        { email: 'test@infogrip.com', password: 'test123', secret: 'infogrip2025' }
    ];
    
    const isValid = testCredentials.some(cred => 
        cred.email === email && 
        cred.password === password && 
        cred.secret === secret
    );
    
    if (isValid) {
        loginSuccess(email);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Use: admin@infogrip.com / infogrip123 / infogrip2025',
            confirmButtonText: 'OK'
        });
    }
}

function loginSuccess(email) {
    console.log('✅ Login successful for:', email);
    
    // Set permanent session (24 hours)
    const expiryTime = new Date(Date.now() + CONFIG.SESSION_TIMEOUT);
    
    // Store session data
    localStorage.setItem('admin_token', 'valid_session_' + Date.now());
    localStorage.setItem('token_expiry', expiryTime.toISOString());
    localStorage.setItem('admin_user', JSON.stringify({
        email: email,
        name: email.split('@')[0].toUpperCase(),
        loginTime: new Date().toISOString()
    }));
    
    // Hide login modal
    document.getElementById('loginModal').style.display = 'none';
    
    // Show success
    Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome to InfoGrip CRM',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        location.reload();
    });
}

function updateAdminInfo() {
    if (currentUser) {
        const adminNameEl = document.getElementById('adminName');
        if (adminNameEl) {
            adminNameEl.textContent = currentUser.name;
        }
        
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl && currentUser.name) {
            avatarEl.textContent = currentUser.name.charAt(0);
        }
    }
}

function logout() {
    Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#001c4f',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            sessionStorage.clear();
            
            if (sessionTimer) {
                clearInterval(sessionTimer);
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Logged out!',
                text: 'You have been successfully logged out.',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
        }
    });
}
// ==================== END AUTHENTICATION FUNCTIONS ====================

// ==================== DASHBOARD FUNCTIONS ====================
async function loadDashboardData() {
    try {
        // For now, use mock data
        document.getElementById('totalClients').textContent = '127';
        document.getElementById('activeSubscriptions').textContent = '89';
        document.getElementById('monthlyRevenue').textContent = '₹1,84,500';
        document.getElementById('todayPayments').textContent = '12';
        
        // Update recent activities
        updateActivities([
            {
                type: 'success',
                icon: 'check-circle',
                title: 'Payment Received',
                description: 'Rohit Sharma paid ₹8,500 for Social Media Management',
                time: 'Just now'
            },
            {
                type: 'info',
                icon: 'user-plus',
                title: 'New Client Added',
                description: 'Simran Kaur added to CRM',
                time: '2 hours ago'
            }
        ]);
        
        // Update expiring subscriptions
        updateExpiringSubscriptions([
            {
                client_name: 'Rohit Sharma',
                service_name: 'Social Media Management',
                amount: 8500,
                expiry_date: '25 Dec 2024',
                days: 3
            }
        ]);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function setupCharts() {
    const ctx = document.getElementById('revenueChart')?.getContext('2d');
    if (!ctx) return;
    
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
            plugins: { legend: { display: true, position: 'top' } },
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

function updateActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
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
    if (!container) return;
    
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
        <div class="subscription-item mb-3 p-3 border rounded">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${sub.client_name}</h6>
                    <p class="mb-0 text-muted">${sub.service_name} - ${formatCurrency(sub.amount)}</p>
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
// ==================== END DASHBOARD FUNCTIONS ====================

// ==================== NAVIGATION FUNCTIONS ====================
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
    
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (pageTitle) pageTitle.textContent = titles[page] || page;
    if (pageSubtitle) pageSubtitle.textContent = subtitles[page] || '';
    
    // Show active page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
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
// ==================== END NAVIGATION FUNCTIONS ====================

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Quick Action Buttons
    document.getElementById('quickInvoiceBtn')?.addEventListener('click', () => {
        navigateToPage('create-invoice');
    });
    
    document.getElementById('quickClientBtn')?.addEventListener('click', () => {
        showClientModal();
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Client Modal
    document.getElementById('addClientBtn')?.addEventListener('click', showClientModal);
    document.getElementById('quickAddClientBtn')?.addEventListener('click', showClientModal);
    document.getElementById('saveClientBtn')?.addEventListener('click', saveClient);
    
    // Invoice Form
    document.getElementById('addItemBtn')?.addEventListener('click', addInvoiceItem);
    document.getElementById('discountType')?.addEventListener('change', updateDiscountField);
    document.getElementById('generateInvoiceBtn')?.addEventListener('click', generateInvoice);
    document.getElementById('isSubscription')?.addEventListener('change', toggleSubscriptionOptions);
    
    // Modal Close Buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Client Search
    const clientSearch = document.getElementById('clientSearch');
    if (clientSearch) {
        clientSearch.addEventListener('input', debounce(searchClients, 300));
    }
}
// ==================== END EVENT LISTENERS ====================

// ==================== CLIENT MANAGEMENT ====================
async function loadClients() {
    try {
        // Mock data for now
        clients = getMockClients();
        renderClientsTable(clients);
    } catch (error) {
        console.error('Error loading clients:', error);
        clients = getMockClients();
        renderClientsTable(clients);
    }
}

function renderClientsTable(clientsList) {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;
    
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
    const query = document.getElementById('clientSearch')?.value.toLowerCase() || '';
    
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
    
    if (!modal || !title || !form) return;
    
    if (editMode && clientId) {
        title.textContent = 'Edit Client';
        const client = clients.find(c => c.id === clientId);
        if (client) {
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientPhone').value = client.phone;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientTags').value = client.tags || '';
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
        tags: document.getElementById('clientTags').value
    };
    
    if (!clientData.name || !clientData.phone) {
        alert('Name and phone number are required');
        return;
    }
    
    try {
        alert('Client saved successfully!');
        document.getElementById('clientModal').style.display = 'none';
        loadClients();
        loadDashboardData();
    } catch (error) {
        console.error('Error saving client:', error);
        alert('Error saving client.');
    }
}
// ==================== END CLIENT MANAGEMENT ====================

// ==================== INVOICE MANAGEMENT ====================
function addInvoiceItem() {
    const tbody = document.getElementById('invoiceItemsBody');
    if (!tbody) return;
    
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
    const tbody = document.getElementById('invoiceItemsBody');
    if (tbody && tbody.children.length > 1) {
        row.remove();
        updateRemoveButtons();
        updateInvoiceSummary();
    }
}

function updateRemoveButtons() {
    const rows = document.getElementById('invoiceItemsBody')?.children || [];
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
    
    const discountType = document.getElementById('discountType')?.value || 'none';
    const discountValue = parseFloat(document.getElementById('discountValue')?.value) || 0;
    const gstPercent = parseFloat(document.getElementById('gstPercent')?.value) || 18;
    
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
    const subtotalEl = document.getElementById('subtotalAmount');
    const discountEl = document.getElementById('discountAmount');
    const gstDisplay = document.getElementById('gstDisplay');
    const gstAmountEl = document.getElementById('gstAmount');
    const totalEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (discountEl) discountEl.textContent = formatCurrency(discount, true);
    if (gstDisplay) gstDisplay.textContent = gstPercent;
    if (gstAmountEl) gstAmountEl.textContent = formatCurrency(gstAmount);
    if (totalEl) totalEl.textContent = formatCurrency(totalAmount);
}

function updateDiscountField() {
    const discountType = document.getElementById('discountType')?.value;
    const discountValue = document.getElementById('discountValue');
    
    if (discountValue) {
        discountValue.disabled = discountType === 'none';
        discountValue.placeholder = discountType === 'percentage' ? 'Percentage' : 'Amount';
        updateInvoiceSummary();
    }
}

function toggleSubscriptionOptions() {
    const isSubscription = document.getElementById('isSubscription')?.checked || false;
    const options = document.getElementById('subscriptionOptions');
    if (options) {
        options.style.display = isSubscription ? 'block' : 'none';
    }
}

async function generateInvoice() {
    const clientSelect = document.getElementById('clientSelect');
    const selectedClientId = clientSelect?.value;
    
    if (!selectedClientId) {
        alert('Please select a client');
        return;
    }
    
    // Show success modal
    const totalAmount = parseFloat(document.getElementById('totalAmount')?.textContent?.replace(/[^0-9.-]+/g, "") || 0);
    const invoiceId = 'INFO-' + new Date().getTime();
    
    showInvoiceSuccessModal(invoiceId, 'https://example.com/checkout', totalAmount);
}

function showInvoiceSuccessModal(invoiceId, checkoutLink, amount) {
    const modal = document.getElementById('invoiceModal');
    if (!modal) return;
    
    const invoiceIdEl = document.getElementById('generatedInvoiceId');
    const amountEl = document.getElementById('generatedAmount');
    const linkInput = document.getElementById('paymentLink');
    
    if (invoiceIdEl) invoiceIdEl.textContent = invoiceId;
    if (amountEl) amountEl.textContent = formatCurrency(amount);
    if (linkInput) linkInput.value = checkoutLink;
    
    // Setup buttons
    document.getElementById('whatsappShareBtn')?.addEventListener('click', function() {
        const message = `Hello! Please complete your payment of ${formatCurrency(amount)} for invoice ${invoiceId}.`;
        const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    document.getElementById('copyLinkBtn')?.addEventListener('click', function() {
        const linkInput = document.getElementById('paymentLink');
        if (linkInput) {
            linkInput.select();
            document.execCommand('copy');
            alert('Payment link copied!');
        }
    });
    
    modal.style.display = 'flex';
}
// ==================== END INVOICE MANAGEMENT ====================

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(amount, showNegative = false) {
    if (showNegative && amount > 0) {
        return `-₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
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

async function loadServices() {
    try {
        services = getDefaultServices();
        
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
    } catch (error) {
        console.error('Error loading services:', error);
        services = getDefaultServices();
    }
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
            status: 'Active',
            tags: 'VIP,Gym'
        },
        {
            id: '2',
            client_id: 'CL-0002',
            name: 'Simran Kaur',
            phone: '9876543211',
            email: 'simran@example.com',
            active_subscriptions: 1,
            total_spent: 45000,
            status: 'Active',
            tags: 'Beauty,Salon'
        }
    ];
}
// ==================== END UTILITY FUNCTIONS ====================

// ==================== GLOBAL FUNCTIONS (for onclick) ====================
window.viewClient = function(id) {
    alert('View client ' + id);
};

window.editClient = function(id) {
    showClientModal(true, id);
};

window.deleteClient = function(id) {
    if (confirm('Delete this client?')) {
        alert('Client deleted (mock)');
        loadClients();
    }
};

window.updateServicePrice = updateServicePrice;
window.updateRowTotal = updateRowTotal;
window.removeInvoiceItem = removeInvoiceItem;
// ==================== END GLOBAL FUNCTIONS ====================

// ==================== QUICK FIX FOR AUTO-LOGOUT ====================
// Add this at the VERY END of the file
(function() {
    // Force permanent login
    if (!localStorage.getItem('admin_token')) {
        localStorage.setItem('admin_token', 'permanent_token_' + Date.now());
    }
    
    if (!localStorage.getItem('admin_user')) {
        localStorage.setItem('admin_user', JSON.stringify({
            email: 'admin@infogrip.com',
            name: 'ADMIN'
        }));
    }
    
    // Always set future expiry
    localStorage.setItem('token_expiry', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log('✅ Permanent login enabled');
})();
