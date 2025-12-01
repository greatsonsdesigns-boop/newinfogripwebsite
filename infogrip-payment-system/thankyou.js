// Configuration
const CONFIG = {
    API_BASE: 'YOUR_APPS_SCRIPT_WEB_APP_URL'
};

// State
let state = {
    paymentData: null,
    isLoading: true
};

// DOM Elements
const elements = {
    loadingState: document.getElementById('loadingState'),
    paymentDetails: document.getElementById('paymentDetails'),
    errorState: document.getElementById('errorState'),
    
    // Payment details
    paymentId: document.getElementById('paymentId'),
    thankYouInvoiceId: document.getElementById('thankYouInvoiceId'),
    amountPaid: document.getElementById('amountPaid'),
    paymentMethod: document.getElementById('paymentMethod'),
    paymentTimestamp: document.getElementById('paymentTimestamp'),
    
    // Action buttons
    downloadInvoiceBtn: document.getElementById('downloadInvoiceBtn'),
    sendWhatsAppBtn: document.getElementById('sendWhatsAppBtn'),
    resendEmailBtn: document.getElementById('resendEmailBtn')
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

    async getPaymentDetails(invoiceId) {
        return this.request('getPaymentDetails', { invoice_id: invoiceId });
    },

    async resendInvoice(invoiceId) {
        return this.request('resendInvoice', { invoice_id: invoiceId });
    }
};

// Payment Details Renderer
const paymentRenderer = {
    renderPayment(data) {
        state.paymentData = data;
        
        // Set payment details
        elements.paymentId.textContent = data.payment_id;
        elements.thankYouInvoiceId.textContent = data.invoice_id;
        elements.amountPaid.textContent = utils.formatCurrency(data.total_amount);
        elements.paymentMethod.textContent = data.payment_mode || 'Online Payment';
        elements.paymentTimestamp.textContent = utils.formatDate(data.payment_timestamp);
        
        // Set up download button
        if (data.invoice_pdf_link) {
            elements.downloadInvoiceBtn.addEventListener('click', () => {
                window.open(data.invoice_pdf_link, '_blank');
            });
        } else {
            elements.downloadInvoiceBtn.disabled = true;
            elements.downloadInvoiceBtn.innerHTML = '<i class="fas fa-clock"></i> Generating PDF...';
            
            // Poll for PDF generation
            this.pollForPdf(data.invoice_id);
        }
        
        // Set up WhatsApp button
        elements.sendWhatsAppBtn.addEventListener('click', () => {
            const message = `Thank you for your payment of ${utils.formatCurrency(data.total_amount)} to InfoGrip Media Solution. Your invoice ${data.invoice_id} has been generated.`;
            const whatsappUrl = `https://wa.me/91${data.phone.replace('91', '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
        
        // Set up resend email button
        elements.resendEmailBtn.addEventListener('click', async () => {
            try {
                elements.resendEmailBtn.disabled = true;
                elements.resendEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                await api.resendInvoice(data.invoice_id);
                
                elements.resendEmailBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                setTimeout(() => {
                    elements.resendEmailBtn.innerHTML = '<i class="fas fa-envelope"></i> Resend Email';
                    elements.resendEmailBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Resend email error:', error);
                elements.resendEmailBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
                elements.resendEmailBtn.disabled = false;
            }
        });
        
        // Show payment details
        elements.loadingState.style.display = 'none';
        elements.paymentDetails.style.display = 'block';
    },

    async pollForPdf(invoiceId, retries = 0) {
        if (retries > 30) { // 30 retries = 2.5 minutes
            elements.downloadInvoiceBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> PDF Timeout';
            return;
        }
        
        try {
            const result = await api.getPaymentDetails(invoiceId);
            if (result.payment.invoice_pdf_link) {
                elements.downloadInvoiceBtn.disabled = false;
                elements.downloadInvoiceBtn.innerHTML = '<i class="fas fa-download"></i> Download Invoice';
                elements.downloadInvoiceBtn.addEventListener('click', () => {
                    window.open(result.payment.invoice_pdf_link, '_blank');
                });
            } else {
                setTimeout(() => this.pollForPdf(invoiceId, retries + 1), 5000);
            }
        } catch (error) {
            console.error('PDF polling error:', error);
            setTimeout(() => this.pollForPdf(invoiceId, retries + 1), 5000);
        }
    }
};

// URL Parameter Parser
const urlParser = {
    getParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            invoice_id: urlParams.get('invoice_id'),
            payment_id: urlParams.get('payment_id')
        };
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async function() {
    const params = urlParser.getParams();
    
    if (!params.invoice_id || !params.payment_id) {
        utils.showError('Invalid payment confirmation. Please check the URL and try again.');
        return;
    }

    try {
        // Load payment details
        const result = await api.getPaymentDetails(params.invoice_id);
        
        if (!result.payment) {
            throw new Error('Payment details not found');
        }

        if (result.payment.status !== 'Paid') {
            throw new Error('Payment not confirmed yet');
        }

        paymentRenderer.renderPayment(result.payment);
        
    } catch (error) {
        console.error('Initialization error:', error);
        utils.showError(error.message);
    }
});
