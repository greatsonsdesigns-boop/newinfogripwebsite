// InfoGrip Checkout Page JavaScript

// Configuration
const CONFIG = {
    API_BASE: 'https://script.google.com/macros/s/AKfycbxPEEknW4i9O_eXyzueU5ltjnpl2uDx4MOAaJ6dBbb5PkTK4b8fvMTJvvDvQGycaz85/exec',
    RAZORPAY_KEY_ID: 'rzp_test_RmL6IMlQKxUoC3' // Will be loaded from API
};

// Get invoice ID from URL
const urlParams = new URLSearchParams(window.location.search);
const invoiceId = urlParams.get('invoice_id');

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    if (!invoiceId) {
        showError('Invoice ID is required in the URL');
        return;
    }
    
    try {
        await loadInvoiceData();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing checkout:', error);
        showError('Failed to load invoice. Please check the link or contact support.');
    }
});

// Load invoice data from API
async function loadInvoiceData() {
    showLoading(true);
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}?action=getPayment&invoice_id=${invoiceId}`);
        const data = await response.json();
        
        if (data.success) {
            populateInvoiceData(data.invoice);
        } else {
            throw new Error(data.message || 'Failed to load invoice');
        }
    } catch (error) {
        console.error('Error loading invoice:', error);
        showError('Failed to load invoice data: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Populate invoice data on the page
function populateInvoiceData(invoice) {
    // Update basic info
    document.getElementById('invoiceId').textContent = invoice.invoice_id || invoiceId;
    document.getElementById('clientName').textContent = invoice.name || 'Customer';
    document.getElementById('clientPhone').textContent = invoice.phone || 'N/A';
    document.getElementById('clientEmail').textContent = invoice.email || 'N/A';
    
    // Update client action links
    if (invoice.phone) {
        const cleanPhone = invoice.phone.replace(/\D/g, '');
        document.getElementById('callClient').href = `tel:+91${cleanPhone}`;
        document.getElementById('whatsappClient').href = `https://wa.me/91${cleanPhone}`;
    }
    if (invoice.email) {
        document.getElementById('emailClient').href = `mailto:${invoice.email}`;
    }
    
    // Parse and display invoice items
    let items = [];
    try {
        items = typeof invoice.services_json === 'string' 
            ? JSON.parse(invoice.services_json) 
            : invoice.services_json || [];
    } catch (e) {
        console.error('Error parsing services JSON:', e);
        items = [];
    }
    
    populateInvoiceItems(items);
    updateSummary(invoice);
}

function populateInvoiceItems(items) {
    const tbody = document.getElementById('invoiceItems');
    
    if (!items || items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    <i class="fas fa-exclamation-circle"></i> No items found
                </td>
            </tr>
        `;
        return;
    }
    
    const html = items.map(item => `
        <tr>
            <td>
                <strong>${item.name || 'Service'}</strong>
                ${item.description ? `<br><small class="text-muted">${item.description}</small>` : ''}
            </td>
            <td>${item.qty || 1}</td>
            <td>₹${(item.unit_price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td>₹${(item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

function updateSummary(invoice) {
    const subtotal = parseFloat(invoice.subtotal) || 0;
    const discount = parseFloat(invoice.discount) || 0;
    const gstPercent = parseFloat(invoice.gst_percent) || 0;
    const gstAmount = parseFloat(invoice.gst_amount) || 0;
    const total = parseFloat(invoice.total_amount) || 0;
    
    document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summaryDiscount').textContent = formatCurrency(discount, true);
    document.getElementById('summaryGST').textContent = formatCurrency(gstAmount);
    document.getElementById('summaryTotal').textContent = formatCurrency(total);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('payButton').addEventListener('click', initiatePayment);
}

// Initiate Razorpay payment
async function initiatePayment() {
    showLoading(true);
    
    try {
        // Get Razorpay order from server
        const response = await fetch(`${CONFIG.API_BASE}?action=createRazorpayOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invoice_id: invoiceId,
                admin_secret: 'YOUR_ADMIN_SECRET' // This should come from server session
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store order info
            CONFIG.RAZORPAY_KEY_ID = data.key_id;
            
            // Create Razorpay checkout options
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: "INR",
                name: "InfoGrip Media Solution",
                description: `Payment for Invoice ${invoiceId}`,
                image: "https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png",
                order_id: data.order_id,
                handler: function(response) {
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: document.getElementById('clientName').textContent,
                    email: document.getElementById('clientEmail').textContent,
                    contact: document.getElementById('clientPhone').textContent.replace(/\D/g, '')
                },
                notes: {
                    invoice_id: invoiceId
                },
                theme: {
                    color: "#001c4f"
                },
                modal: {
                    ondismiss: function() {
                        showLoading(false);
                    }
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();
            
        } else {
            throw new Error(data.message || 'Failed to create payment order');
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        showError('Failed to initiate payment: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Handle successful payment
async function handlePaymentSuccess(paymentResponse) {
    showLoading(true);
    
    try {
        // Verify payment with server
        const response = await fetch(`${CONFIG.API_BASE}?action=confirmPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                invoice_id: invoiceId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Redirect to thank you page with success data
            window.location.href = `thankyou.html?invoice_id=${invoiceId}&payment_id=${paymentResponse.razorpay_payment_id}&pdf_link=${encodeURIComponent(data.invoice_pdf_link)}`;
        } else {
            throw new Error(data.message || 'Payment verification failed');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        showError('Payment verification failed: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Utility Functions
function formatCurrency(amount, showNegative = false) {
    if (showNegative && amount > 0) {
        return `-₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function showLoading(show) {
    const modal = document.getElementById('loadingModal');
    modal.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    // Create error modal
    const errorHTML = `
        <div class="modal" id="errorModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Error</h3>
                        <button class="modal-close" onclick="document.getElementById('errorModal').style.display='none'">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="document.getElementById('errorModal').style.display='none'">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing error modal
    const existingError = document.getElementById('errorModal');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error modal
    document.body.insertAdjacentHTML('beforeend', errorHTML);
    document.getElementById('errorModal').style.display = 'flex';
}

// Add CSS for checkout page
const checkoutCSS = `
.checkout-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.checkout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 30px;
}

.checkout-header .logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.checkout-header .logo img {
    height: 50px;
}

.checkout-header .logo h1 {
    font-size: 1.5rem;
    color: #001c4f;
    margin: 0;
}

.secure-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border-radius: 50px;
    font-weight: 600;
}

.checkout-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

@media (max-width: 992px) {
    .checkout-content {
        grid-template-columns: 1fr;
    }
}

.invoice-details .card {
    margin-bottom: 20px;
}

.client-info {
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.client-details p {
    margin: 5px 0;
}

.client-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.invoice-items {
    padding: 20px;
}

.trust-badges {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    margin-top: 20px;
}

.badge-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #666;
}

.badge-item i {
    color: #001c4f;
    font-size: 1.2rem;
}

.sticky-summary {
    position: sticky;
    top: 20px;
}

.payment-methods {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.method-icons {
    display: flex;
    gap: 15px;
    font-size: 1.8rem;
    color: #666;
    margin-top: 10px;
}

.payment-info {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 0.9rem;
}

.payment-info p {
    margin: 5px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.support-card {
    margin-top: 20px;
    padding: 20px;
    background: #001c4f;
    color: white;
    border-radius: 12px;
}

.support-card h4 {
    color: white;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.support-contacts {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
}

.support-link {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.3s;
}

.support-link:hover {
    background: rgba(255, 255, 255, 0.2);
}

.checkout-footer {
    margin-top: 40px;
    padding: 20px 0;
    border-top: 1px solid #e0e0e0;
    text-align: center;
    color: #666;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
}

.footer-links a {
    color: #001c4f;
    text-decoration: none;
}

.spinner {
    font-size: 2rem;
    color: #fdcb54;
}

.error-icon {
    text-align: center;
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 20px;
}
`;

// Inject checkout-specific CSS
const style = document.createElement('style');
style.textContent = checkoutCSS;
document.head.appendChild(style);
