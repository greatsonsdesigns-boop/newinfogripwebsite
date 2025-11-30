// Thank You Page JavaScript for InfoGrip Payment System
class ThankYouPage {
    constructor() {
        // CONFIGURATION - UPDATE THESE VALUES
        this.API_CONFIG = {
            WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwlqmQnjGeovQPnSOll5efIPSBLshGzYUYlrGrDox4OW6SRmTJmj1PIB3L0IeG-I2KM/exec' // ← REPLACE WITH YOUR WEB APP URL
        };
        
        this.paymentData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Load payment data from URL parameters
        this.loadPaymentData();
    }

    setupEventListeners() {
        document.getElementById('download-invoice').addEventListener('click', () => this.downloadInvoice());
        document.getElementById('email-invoice').addEventListener('click', () => this.emailInvoice());
        document.getElementById('whatsapp-invoice').addEventListener('click', () => this.whatsappInvoice());
        document.getElementById('invoice-ready-download').addEventListener('click', () => this.downloadInvoice());
        document.getElementById('invoice-ready-close').addEventListener('click', () => this.closeInvoiceReadyModal());
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        const formatted = now.toLocaleDateString('en-IN', options);
        document.getElementById('thankyou-datetime').textContent = formatted;
    }

    async loadPaymentData() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('payment_id');
        const invoiceId = urlParams.get('invoice_id');
        
        if (!paymentId || !invoiceId) {
            this.showError('Invalid payment confirmation. Please contact support.');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // CALL REAL GOOGLE APPS SCRIPT API
            const result = await this.makeGetAPICall('getPaymentDetails', { invoice_id: invoiceId });
            
            if (result.success) {
                this.paymentData = result;
                this.renderPaymentDetails();
                
                // Check if invoice PDF is ready
                this.checkInvoiceStatus();
            } else {
                throw new Error(result.error || 'Failed to load payment details');
            }
            
        } catch (error) {
            this.showError('Failed to load payment details. Please try again.');
            console.error('Payment details load error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    // API CALL FUNCTION
    async makeGetAPICall(endpoint, params = {}) {
        try {
            const urlParams = new URLSearchParams(params);
            const url = `${this.API_CONFIG.WEB_APP_URL}?endpoint=${endpoint}&${urlParams.toString()}`;
            
            console.log(`Making GET API call to ${endpoint}:`, url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            return result;
        } catch (error) {
            console.error(`GET API call failed for ${endpoint}:`, error);
            throw error;
        }
    }

    renderPaymentDetails() {
        if (!this.paymentData) return;
        
        document.getElementById('payment-id').textContent = this.paymentData.payment_id;
        document.getElementById('invoice-id').textContent = this.paymentData.invoice_id;
        document.getElementById('amount-paid').textContent = `₹${(this.paymentData.total_amount || 0).toLocaleString()}`;
        document.getElementById('payment-datetime').textContent = this.formatDate(this.paymentData.payment_timestamp);
        document.getElementById('payment-mode').textContent = this.paymentData.payment_mode;
    }

    async checkInvoiceStatus() {
        // Check if invoice PDF is ready (poll every 2 seconds)
        const checkInterval = setInterval(async () => {
            try {
                const result = await this.makeGetAPICall('getPaymentDetails', { 
                    invoice_id: this.paymentData.invoice_id 
                });
                
                if (result.success && result.invoice_pdf_link && result.invoice_pdf_link !== '#') {
                    clearInterval(checkInterval);
                    
                    // Update payment data with PDF link
                    this.paymentData.invoice_pdf_link = result.invoice_pdf_link;
                    
                    // Enable download button
                    document.getElementById('download-invoice').disabled = false;
                    document.getElementById('email-invoice').disabled = false;
                    document.getElementById('whatsapp-invoice').disabled = false;
                    
                    // Show invoice ready notification if modal is not already shown
                    if (!sessionStorage.getItem('invoiceReadyShown')) {
                        this.showInvoiceReadyModal();
                        sessionStorage.setItem('invoiceReadyShown', 'true');
                    }
                }
            } catch (error) {
                console.error('Error checking invoice status:', error);
            }
        }, 2000);
        
        // Stop checking after 30 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!this.paymentData.invoice_pdf_link) {
                this.showNotification('Invoice generation is taking longer than expected. Please try again later.', 'warning');
            }
        }, 30000);
    }

    async downloadInvoice() {
        if (!this.paymentData.invoice_pdf_link) {
            this.showError('Invoice is not ready yet. Please try again in a moment.');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Open PDF in new tab for download
            window.open(this.paymentData.invoice_pdf_link, '_blank');
            
            this.showNotification('Invoice opened in new tab!', 'success');
            
        } catch (error) {
            this.showError('Failed to download invoice. Please try again.');
            console.error('Invoice download error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async emailInvoice() {
        if (!this.paymentData.invoice_pdf_link) {
            this.showError('Invoice is not ready yet. Please try again in a moment.');
            return;
        }
        
        const subject = `Your InfoGrip Invoice - ${this.paymentData.invoice_id}`;
        const body = `Dear ${this.paymentData.name},

Thank you for your payment. Your invoice is ready.

Payment Details:
- Invoice ID: ${this.paymentData.invoice_id}
- Amount: ₹${(this.paymentData.total_amount || 0).toLocaleString()}
- Payment Date: ${this.formatDate(this.paymentData.payment_timestamp)}
- Payment ID: ${this.paymentData.payment_id}

You can download your invoice from: ${this.paymentData.invoice_pdf_link}

If you have any questions, please contact us at info@infogrip.com or +91 6367556906.

Best regards,
InfoGrip Media Solution Team`;
        
        window.open(`mailto:${this.paymentData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        
        this.showNotification('Email client opened with invoice details', 'success');
    }

    async whatsappInvoice() {
        if (!this.paymentData.invoice_pdf_link) {
            this.showError('Invoice is not ready yet. Please try again in a moment.');
            return;
        }
        
        const message = `Hello ${this.paymentData.name}, your payment is received. Invoice: ${this.paymentData.invoice_id}. Amount: ₹${this.paymentData.total_amount}. Download: ${this.paymentData.invoice_pdf_link}. - InfoGrip`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/91${this.paymentData.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        this.showNotification('WhatsApp client opened with invoice details', 'success');
    }

    showInvoiceReadyModal() {
        document.getElementById('invoice-ready-modal').classList.remove('hidden');
    }

    closeInvoiceReadyModal() {
        document.getElementById('invoice-ready-modal').classList.add('hidden');
    }

    // Utility methods
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
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
        } catch (e) {
            return 'Invalid Date';
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showError(message) {
        // Simple alert for demo purposes
        alert('Error: ' + message);
    }

    showNotification(message, type = 'info') {
        // Simple notification for demo purposes
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // You can enhance this with proper UI notifications
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize thank you page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.thankYouPage = new ThankYouPage();
});
