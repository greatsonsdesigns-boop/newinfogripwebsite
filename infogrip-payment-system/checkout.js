// Checkout Configuration
const CHECKOUT_CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/AKfycbx07QetFwOnkrHlNs2XWHKJUf-FVamBxzvr_ea75x1aJvV1A2wfsBIM3LkZZJfnalm5/exec',
    RAZORPAY_KEY_ID: 'rzp_test_RmL6IMlQKxUoC3'
};

// State
let checkoutState = {
    invoice: null,
    order: null,
    paymentInProgress: false
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initHamburger();
    initEventListeners();
    loadInvoiceFromURL();
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
    // Terms checkbox
    document.getElementById('terms')?.addEventListener('change', function() {
        const payButton = document.getElementById('pay-button');
        if (payButton) {
            payButton.disabled = !this.checked;
        }
    });
    
    // Pay button
    document.getElementById('pay-button')?.addEventListener('click', initiatePayment);
    
    // Retry payment
    document.getElementById('retry-payment')?.addEventListener('click', () => {
        document.getElementById('payment-failed').classList.add('hidden');
        document.getElementById('payment-form').classList.remove('hidden');
    });
    
    // Payment method change
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updatePaymentMethod(this.value);
        });
    });
}

// Load Invoice from URL
function loadInvoiceFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('invoice_id');
    
    if (!invoiceId) {
        showError('Invoice ID is required in the URL');
        return;
    }
    
    fetchInvoice(invoiceId);
}

// Fetch Invoice Details
async function fetchInvoice(invoiceId) {
    try {
        showLoading();
        
        const response = await fetch(`${CHECKOUT_CONFIG.API_BASE}/getPaymentByInvoiceId?invoice_id=${invoiceId}`);
        const data = await response.json();
        
        if (data.success) {
            checkoutState.invoice = data.payment;
            displayInvoiceDetails();
            enablePaymentForm();
        } else {
            showError(data.error || 'Invoice not found');
        }
    } catch (error) {
        console.error('Error fetching invoice:', error);
        showError('Failed to load invoice. Please try again.');
    }
}

// Display Invoice Details
function displayInvoiceDetails() {
    const invoice = checkoutState.invoice;
    if (!invoice) return;
    
    // Update status
    document.getElementById('invoice-status').textContent = invoice.status || 'Pending';
    
    // Client info
    document.getElementById('client-name').textContent = invoice.name || '';
    document.getElementById('client-phone').textContent = formatPhone(invoice.phone) || '';
    document.getElementById('client-email').textContent = invoice.email || '';
    document.getElementById('client-address').textContent = invoice.address || '';
    
    // Invoice details
    document.getElementById('invoice-id').textContent = invoice.invoice_id || '';
    document.getElementById('invoice-date').textContent = formatDate(invoice.created_timestamp) || '';
    document.getElementById('created-by').textContent = invoice.created_by || 'Admin';
    
    // Services
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';
    
    try {
        const services = JSON.parse(invoice.services_json || '[]');
        services.forEach(service => {
            const item = document.createElement('div');
            item.className = 'invoice-item';
            item.innerHTML = `
                <div>${service.name}</div>
                <div class="text-right">${service.quantity || 1}</div>
                <div class="text-right">₹${service.price || 0}</div>
                <div class="text-right">₹${(service.quantity || 1) * (service.price || 0)}</div>
            `;
            servicesList.appendChild(item);
        });
    } catch (e) {
        console.error('Error parsing services:', e);
    }
    
    // Totals
    document.getElementById('subtotal-summary').textContent = `₹${invoice.subtotal || 0}`;
    document.getElementById('discount-summary').textContent = `₹${invoice.discount || 0}`;
    document.getElementById('gst-percent-summary').textContent = invoice.gst_percent || 0;
    document.getElementById('gst-amount-summary').textContent = `₹${invoice.gst_amount || 0}`;
    document.getElementById('total-summary').textContent = `₹${invoice.total_amount || 0}`;
    
    // Update pay button
    document.getElementById('pay-amount').textContent = `₹${invoice.total_amount || 0}`;
    
    // Show content
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('invoice-content').classList.remove('hidden');
}

// Enable Payment Form
function enablePaymentForm() {
    const invoice = checkoutState.invoice;
    if (!invoice) return;
    
    // Check if invoice is already paid
    if (invoice.status === 'Paid') {
        document.getElementById('payment-form').classList.add('hidden');
        document.getElementById('payment-success').classList.remove('hidden');
        
        // Redirect to thank you page after 3 seconds
        setTimeout(() => {
            window.location.href = `thankyou.html?invoice_id=${invoice.invoice_id}&payment_id=${invoice.payment_id}`;
        }, 3000);
        return;
    }
    
    // Show payment form
    document.getElementById('payment-form').classList.remove('hidden');
    
    // Check if client info is missing
    if (!invoice.name || !invoice.phone || !invoice.email) {
        document.getElementById('new-client-form').classList.remove('hidden');
        
        // Pre-fill if partial info exists
        if (invoice.name) document.getElementById('payer-name').value = invoice.name;
        if (invoice.phone) document.getElementById('payer-phone').value = invoice.phone;
        if (invoice.email) document.getElementById('payer-email').value = invoice.email;
        if (invoice.address) document.getElementById('payer-address').value = invoice.address;
    }
}

// Update Payment Method
function updatePaymentMethod(method) {
    // TODO: Implement different payment method UIs
    console.log('Payment method changed to:', method);
}

// Initiate Payment
async function initiatePayment() {
    if (checkoutState.paymentInProgress) return;
    
    const invoice = checkoutState.invoice;
    if (!invoice) return;
    
    // Validate form for new clients
    if (document.getElementById('new-client-form') && !document.getElementById('new-client-form').classList.contains('hidden')) {
        if (!validateClientForm()) {
            return;
        }
        
        // Update client info
        invoice.name = document.getElementById('payer-name').value;
        invoice.phone = document.getElementById('payer-phone').value;
        invoice.email = document.getElementById('payer-email').value;
        invoice.address = document.getElementById('payer-address').value;
    }
    
    try {
        checkoutState.paymentInProgress = true;
        
        // Show processing
        document.getElementById('payment-form').classList.add('hidden');
        document.getElementById('payment-processing').classList.remove('hidden');
        
        // Create Razorpay order
        const orderResponse = await fetch(`${CHECKOUT_CONFIG.API_BASE}/createRazorpayOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invoice_id: invoice.invoice_id,
                admin_secret: 'YOUR_ADMIN_SECRET' // In production, this should be handled server-side
            })
        });
        
        const orderData = await orderResponse.json();
        
        if (orderData.success) {
            checkoutState.order = orderData.order;
            openRazorpayCheckout(orderData.order);
        } else {
            throw new Error(orderData.error || 'Failed to create payment order');
        }
        
    } catch (error) {
        console.error('Error initiating payment:', error);
        showPaymentError(error.message);
    } finally {
        checkoutState.paymentInProgress = false;
    }
}

// Open Razorpay Checkout
function openRazorpayCheckout(order) {
    const options = {
        key: CHECKOUT_CONFIG.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'InfoGrip Media Solution',
        description: `Payment for Invoice ${checkoutState.invoice.invoice_id}`,
        order_id: order.id,
        handler: async function(response) {
            await verifyPayment(response);
        },
        prefill: {
            name: checkoutState.invoice.name,
            email: checkoutState.invoice.email,
            contact: checkoutState.invoice.phone
        },
        notes: {
            invoice_id: checkoutState.invoice.invoice_id
        },
        theme: {
            color: '#001c4f'
        },
        modal: {
            ondismiss: function() {
                // User closed the modal
                document.getElementById('payment-processing').classList.add('hidden');
                document.getElementById('payment-form').classList.remove('hidden');
            }
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

// Verify Payment
async function verifyPayment(response) {
    try {
        const verifyResponse = await fetch(`${CHECKOUT_CONFIG.API_BASE}/confirmPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invoice_id: checkoutState.invoice.invoice_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                payment_method: 'razorpay'
            })
        });
        
        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
            // Show success
            document.getElementById('payment-processing').classList.add('hidden');
            document.getElementById('payment-success').classList.remove('hidden');
            
            // Redirect to thank you page
            setTimeout(() => {
                window.location.href = `thankyou.html?invoice_id=${checkoutState.invoice.invoice_id}&payment_id=${response.razorpay_payment_id}`;
            }, 2000);
        } else {
            throw new Error(verifyData.error || 'Payment verification failed');
        }
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        showPaymentError(error.message);
    }
}

// Validate Client Form
function validateClientForm() {
    const name = document.getElementById('payer-name').value.trim();
    const phone = document.getElementById('payer-phone').value.trim();
    const email = document.getElementById('payer-email').value.trim();
    
    if (!name) {
        showAlert('Please enter your name', 'danger');
        return false;
    }
    
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
        showAlert('Please enter a valid 10-digit phone number', 'danger');
        return false;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return false;
    }
    
    return true;
}

// Utility Functions
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('invoice-content').classList.add('hidden');
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('payment-form').classList.add('hidden');
}

function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('invoice-content').classList.add('hidden');
    document.getElementById('error-message').classList.remove('hidden');
    document.getElementById('error-text').textContent = message;
}

function showPaymentError(message) {
    document.getElementById('payment-processing').classList.add('hidden');
    document.getElementById('payment-failed').classList.remove('hidden');
    document.getElementById('failure-reason').textContent = message;
}

function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

function formatDate(dateString) {
    if (!dateString) return '';
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

// Export checkout functions
window.InfoGripCheckout = {
    loadInvoiceFromURL,
    initiatePayment
};
