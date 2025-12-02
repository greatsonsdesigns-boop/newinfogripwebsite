// Thank You Page Configuration
const THANKYOU_CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec'
};

// State
let thankyouState = {
    invoice: null,
    payment: null
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initHamburger();
    initEventListeners();
    loadPaymentDetails();
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
    // Download Invoice
    document.getElementById('download-invoice')?.addEventListener('click', downloadInvoice);
    
    // WhatsApp Support
    document.getElementById('whatsapp-support')?.addEventListener('click', openWhatsApp);
    
    // Resend Email
    document.getElementById('resend-email')?.addEventListener('click', resendEmail);
}

// Load Payment Details
async function loadPaymentDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('invoice_id');
    const paymentId = urlParams.get('payment_id');
    
    if (!invoiceId) {
        showError('Invoice ID is required');
        return;
    }
    
    try {
        // Fetch payment details
        const response = await fetch(`${THANKYOU_CONFIG.API_BASE}/getPaymentDetails?invoice_id=${invoiceId}&payment_id=${paymentId}`);
        const data = await response.json();
        
        if (data.success) {
            thankyouState.invoice = data.invoice;
            thankyouState.payment = data.payment;
            displayPaymentDetails();
            displayInvoiceSummary();
        } else {
            showError(data.error || 'Payment details not found');
        }
    } catch (error) {
        console.error('Error loading payment details:', error);
        showError('Failed to load payment details');
    }
}

// Display Payment Details
function displayPaymentDetails() {
    const payment = thankyouState.payment;
    const invoice = thankyouState.invoice;
    
    if (!payment || !invoice) return;
    
    const detailsDiv = document.getElementById('payment-details');
    detailsDiv.innerHTML = `
        <div class="space-y-4">
            <div class="detail-item">
                <span class="detail-label">Payment ID:</span>
                <span class="font-semibold">${payment.payment_id || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Invoice ID:</span>
                <span class="font-semibold">${payment.invoice_id || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Amount Paid:</span>
                <span class="text-2xl font-bold text-green-600">₹${payment.total_amount || 0}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Payment Mode:</span>
                <span class="font-semibold">${payment.payment_mode || 'Razorpay'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Payment Date:</span>
                <span>${formatDateTime(payment.payment_timestamp)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="badge badge-success">PAID</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Client:</span>
                <span>${payment.name || invoice.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span>${payment.email || invoice.email}</span>
            </div>
        </div>
    `;
}

// Display Invoice Summary
function displayInvoiceSummary() {
    const invoice = thankyouState.invoice;
    if (!invoice) return;
    
    const summaryDiv = document.getElementById('invoice-summary');
    
    try {
        const services = JSON.parse(invoice.services_json || '[]');
        
        let servicesHtml = '';
        if (services.length > 0) {
            servicesHtml = services.map(service => `
                <div class="invoice-item">
                    <div>${service.name}</div>
                    <div class="text-right">${service.quantity || 1}</div>
                    <div class="text-right">₹${service.price || 0}</div>
                    <div class="text-right">₹${(service.quantity || 1) * (service.price || 0)}</div>
                </div>
            `).join('');
        }
        
        summaryDiv.innerHTML = `
            <div>
                <!-- Totals -->
                <div class="border-t pt-4 mt-4">
                    <div class="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹${invoice.subtotal || 0}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Discount:</span>
                        <span>- ₹${invoice.discount || 0}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>GST (${invoice.gst_percent || 0}%):</span>
                        <span>₹${invoice.gst_amount || 0}</span>
                    </div>
                    <div class="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
                        <span>Total Amount:</span>
                        <span class="text-green-600">₹${invoice.total_amount || 0}</span>
                    </div>
                </div>
                
                <!-- Invoice Notes -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 class="font-bold mb-2">Invoice Notes:</h4>
                    <p class="text-sm">Invoice ID: ${invoice.invoice_id}</p>
                    <p class="text-sm">Created: ${formatDate(invoice.created_timestamp)}</p>
                    <p class="text-sm">Status: <span class="badge badge-success">PAID</span></p>
                </div>
            </div>
        `;
        
        // Update download button with PDF link if available
        if (invoice.invoice_pdf_link) {
            const downloadBtn = document.getElementById('download-invoice');
            if (downloadBtn) {
                downloadBtn.onclick = () => {
                    window.open(invoice.invoice_pdf_link, '_blank');
                };
            }
        }
        
    } catch (error) {
        console.error('Error displaying invoice summary:', error);
        summaryDiv.innerHTML = '<p class="text-red-500">Error loading invoice details</p>';
    }
}

// Download Invoice
function downloadInvoice() {
    const invoice = thankyouState.invoice;
    if (!invoice) return;
    
    if (invoice.invoice_pdf_link) {
        window.open(invoice.invoice_pdf_link, '_blank');
    } else {
        // Generate download link from API
        const url = `${THANKYOU_CONFIG.API_BASE}/downloadInvoice?invoice_id=${invoice.invoice_id}`;
        window.open(url, '_blank');
    }
}

// Open WhatsApp
function openWhatsApp() {
    const invoice = thankyouState.invoice;
    if (!invoice) return;
    
    const phone = (invoice.phone || '').replace(/\D/g, '');
    if (!phone) {
        showAlert('Phone number not available for WhatsApp', 'warning');
        return;
    }
    
    const message = encodeURIComponent(
        `Hi InfoGrip Team,\n\nI just completed payment for Invoice ${invoice.invoice_id}.\nAmount: ₹${invoice.total_amount}\nPlease confirm and start my services.\n\nThank you!`
    );
    
    const waLink = `https://wa.me/916367556906?text=${message}`;
    window.open(waLink, '_blank');
}

// Resend Email
async function resendEmail() {
    const invoice = thankyouState.invoice;
    if (!invoice) return;
    
    try {
        const response = await fetch(`${THANKYOU_CONFIG.API_BASE}/resendInvoiceEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invoice_id: invoice.invoice_id
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Invoice email resent successfully!', 'success');
        } else {
            showAlert(data.error || 'Failed to resend email', 'danger');
        }
    } catch (error) {
        console.error('Error resending email:', error);
        showAlert('Error resending email', 'danger');
    }
}

// Utility Functions
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        return dateString;
    }
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

function showError(message) {
    const detailsDiv = document.getElementById('payment-details');
    const summaryDiv = document.getElementById('invoice-summary');
    
    if (detailsDiv) {
        detailsDiv.innerHTML = `
            <div class="alert alert-danger">
                <h4 class="font-bold mb-2">Error</h4>
                <p>${message}</p>
                <a href="index.html" class="btn btn-primary mt-4">
                    <i class="fas fa-home"></i> Back to Home
                </a>
            </div>
        `;
    }
    
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <div class="alert alert-warning">
                <p>${message}</p>
            </div>
        `;
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

// Auto-redirect to home after 60 seconds
setTimeout(() => {
    const redirectMsg = document.createElement('div');
    redirectMsg.className = 'alert alert-info text-center';
    redirectMsg.innerHTML = `
        <p>You will be redirected to home page in 10 seconds...</p>
        <button onclick="window.location.href='index.html'" class="btn btn-sm btn-primary mt-2">
            Go Home Now
        </button>
    `;
    
    const main = document.querySelector('main');
    if (main) {
        main.appendChild(redirectMsg);
    }
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 10000);
}, 60000);

// Export thank you functions
window.InfoGripThankYou = {
    loadPaymentDetails,
    downloadInvoice,
    openWhatsApp
};
