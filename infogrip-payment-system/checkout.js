// Configuration
const CONFIG = {
    API_BASE: 'YOUR_APPS_SCRIPT_WEB_APP_URL',
    RAZORPAY_KEY_ID: 'YOUR_RAZORPAY_KEY_ID' // From Apps Script
};

// State
let state = {
    invoiceData: null,
    isLoading: true
};

// DOM Elements
const elements = {
    loadingState: document.getElementById('loadingState'),
    invoiceContent: document.getElementById('invoiceContent'),
    errorState: document.getElementById('errorState'),
    paidState: document.getElementById('paidState'),
    
    // Invoice details
    invoiceDate: document.getElementById('invoiceDate'),
    clientDetails: document.getElementById('clientDetails'),
    displayInvoiceId: document.getElementById('displayInvoiceId'),
    displayInvoiceDate: document.getElementById('displayInvoiceDate'),
    invoiceStatus: document.getElementById('invoiceStatus'),
    servicesTableBody: document.getElementById('servicesTableBody'),
    displaySubtotal: document.getElementById('displaySubtotal'),
    displayDiscount: document.getElementById('displayDiscount'),
    displayGstLabel: document.getElementById('displayGstLabel'),
    displayGstAmount: document.getElementById('displayGstAmount'),
    displayTotal: document.getElementById('displayTotal'),
    payAmount: document.getElementById('payAmount'),
    
    // Payment
    payNowBtn: document.getElementById('payNowBtn'),
    paymentProcessing: document.getElementById('paymentProcessing'),
    paymentButtons: document.getElementById('paymentButtons')
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

    showError(message) {
        elements.errorState.innerHTML = `
            <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
            <p>${message}</p>
            <a href="#" class="btn btn-outline" onclick="window.history.back()" style="margin-top: 10px;">Go Back</a>
        `;
        elements.errorState.style.display = 'block';
        elements.loadingState.style.display = 'none';
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
                body: JSON.stringify(data)
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

    async getPaymentByInvoiceId(invoiceId) {
        return this.request('getPaymentByInvoiceId', { invoice_id: invoiceId });
    },

    async createRazorpayOrder(invoiceId) {
        return this.request('createRazorpayOrder', { invoice_id: invoiceId });
    },

    async confirmPayment(paymentData) {
        return this.request('confirmPayment', paymentData);
    }
};

// Payment Handler
const paymentHandler = {
    async initializePayment() {
        if (!state.invoiceData) return;

        try {
            elements.payNowBtn.disabled = true;
            elements.paymentProcessing.style.display = 'block';
            elements.paymentButtons.style.display = 'none';

            // Create Razorpay order
            const orderResult = await api.createRazorpayOrder(state.invoiceData.invoice_id);
            
            // Configure Razorpay options
            const options = {
                key: orderResult.key_id,
                amount: orderResult.amount,
                currency: orderResult.currency,
                order_id: orderResult.order_id,
                name: "InfoGrip Media Solution",
                description: `Payment for Invoice ${state.invoiceData.invoice_id}`,
                image: "https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png",
                handler: async (response) => {
                    await this.handlePaymentSuccess(response);
                },
                prefill: {
                    name: state.invoiceData.name,
                    email: state.invoiceData.email,
                    contact: state.invoiceData.phone.replace('91', '')
                },
                notes: {
                    invoice_id: state.invoiceData.invoice_id,
                    client_id: state.invoiceData.client_id
                },
                theme: {
                    color: "#0066FF"
                }
            };

            const razorpay = new Razorpay(options);
            razorpay.open();
            
        } catch (error) {
            console.error('Payment initialization error:', error);
            utils.showError('Failed to initialize payment: ' + error.message);
        } finally {
            elements.payNowBtn.disabled = false;
            elements.paymentProcessing.style.display = 'none';
            elements.paymentButtons.style.display = 'block';
        }
    },

    async handlePaymentSuccess(response) {
        try {
            elements.paymentProcessing.style.display = 'block';
            elements.paymentButtons.style.display = 'none';

            const paymentData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                invoice_id: state.invoiceData.invoice_id
            };

            const result = await api.confirmPayment(paymentData);
            
            if (result.success) {
                // Redirect to thank you page
                window.location.href = `thankyou.html?invoice_id=${state.invoiceData.invoice_id}&payment_id=${response.razorpay_payment_id}`;
            } else {
                throw new Error(result.error || 'Payment confirmation failed');
            }
        } catch (error) {
            console.error('Payment confirmation error:', error);
            utils.showError('Payment confirmation failed: ' + error.message);
            
            elements.paymentProcessing.style.display = 'none';
            elements.paymentButtons.style.display = 'block';
        }
    }
};

// Invoice Renderer
const invoiceRenderer = {
    renderInvoice(data) {
        state.invoiceData = data;
        
        // Set basic info
        elements.invoiceDate.textContent = utils.formatDate(data.created_timestamp);
        elements.displayInvoiceId.textContent = data.invoice_id;
        elements.displayInvoiceDate.textContent = utils.formatDate(data.created_timestamp);
        
        // Render client details
        elements.clientDetails.innerHTML = `
            <p><strong>${data.name}</strong></p>
            <p>${data.phone}</p>
            ${data.email ? `<p>${data.email}</p>` : ''}
            ${data.address ? `<p>${data.address}</p>` : ''}
        `;

        // Parse and render services
        const services = JSON.parse(data.services_json);
        elements.servicesTableBody.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td style="text-align: center;">${service.qty}</td>
                <td style="text-align: right;">${utils.formatCurrency(service.unit_price)}</td>
                <td style="text-align: right;">${utils.formatCurrency(service.line_total)}</td>
            </tr>
        `).join('');

        // Render totals
        elements.displaySubtotal.textContent = utils.formatCurrency(data.subtotal);
        elements.displayDiscount.textContent = utils.formatCurrency(data.discount);
        elements.displayGstLabel.textContent = `GST (${data.gst_percent}%):`;
        elements.displayGstAmount.textContent = utils.formatCurrency(data.gst_amount);
        elements.displayTotal.textContent = utils.formatCurrency(data.total_amount);
        elements.payAmount.textContent = data.total_amount;

        // Update status
        if (data.status === 'Paid') {
            elements.invoiceStatus.textContent = 'Paid';
            elements.invoiceStatus.className = 'status-badge status-paid';
            elements.payNowBtn.style.display = 'none';
            elements.paidState.style.display = 'block';
        }

        // Show content
        elements.loadingState.style.display = 'none';
        elements.invoiceContent.style.display = 'block';
    }
};

// URL Parameter Parser
const urlParser = {
    getParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            invoice_id: urlParams.get('invoice_id')
        };
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async function() {
    const params = urlParser.getParams();
    
    if (!params.invoice_id) {
        utils.showError('Invalid invoice link. Please check the URL and try again.');
        return;
    }

    try {
        // Load invoice data
        const result = await api.getPaymentByInvoiceId(params.invoice_id);
        
        if (!result.payment) {
            throw new Error('Invoice not found');
        }

        if (result.payment.status === 'Paid') {
            invoiceRenderer.renderInvoice(result.payment);
        } else if (result.payment.status === 'Pending') {
            invoiceRenderer.renderInvoice(result.payment);
            
            // Set up payment button
            elements.payNowBtn.addEventListener('click', () => {
                paymentHandler.initializePayment();
            });
        } else {
            throw new Error('This invoice is no longer valid');
        }
        
    } catch (error) {
        console.error('Initialization error:', error);
        utils.showError(error.message);
    }
});
