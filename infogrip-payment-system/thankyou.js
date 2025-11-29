// Thank You Page JavaScript
class ThankYouPage {
    constructor() {
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
            // Simulate API call to fetch payment details
            await this.simulateAPICall();
            
            // Sample payment data (in real implementation, this would come from API)
            this.paymentData = {
                payment_id: paymentId,
                invoice_id: invoiceId,
                amount: 17700,
                payment_mode: 'UPI',
                payment_timestamp: new Date().toISOString(),
                invoice_pdf_link: null, // Will be set when PDF is generated
                client_name: 'Rohit Sharma',
                client_email: 'rohit@example.com',
                client_phone: '+91 9876543210'
            };
            
            this.renderPaymentDetails();
            
            // Check if invoice PDF is ready
            this.checkInvoiceStatus();
            
        } catch (error) {
            this.showError('Failed to load payment details. Please try again.');
            console.error('Payment details load error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    renderPaymentDetails() {
        if (!this.paymentData) return;
        
        document.getElementById('payment-id').textContent = this.paymentData.payment_id;
        document.getElementById('invoice-id').textContent = this.paymentData.invoice_id;
        document.getElementById('amount-paid').textContent = `₹${this.paymentData.amount.toLocaleString()}`;
        document.getElementById('payment-datetime').textContent = this.formatDate(this.paymentData.payment_timestamp);
        document.getElementById('payment-mode').textContent = this.paymentData.payment_mode;
    }

    async checkInvoiceStatus() {
        // Simulate checking invoice status
        await this.simulateAPICall(2000);
        
        // In real implementation, this would poll the server until PDF is ready
        this.paymentData.invoice_pdf_link = 'https://drive.google.com/file/d/example/view';
        
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

    async downloadInvoice() {
        if (!this.paymentData.invoice_pdf_link) {
            this.showError('Invoice is not ready yet. Please try again in a moment.');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Simulate download
            await this.simulateAPICall(1500);
            
            // In real implementation, this would download the PDF
            const link = document.createElement('a');
            link.href = this.paymentData.invoice_pdf_link;
            link.target = '_blank';
            link.download = `InfoGrip-Invoice-${this.paymentData.invoice_id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Invoice downloaded successfully!', 'success');
            
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
        const body = `Dear ${this.paymentData.client_name},

Thank you for your payment. Your invoice is attached.

Payment Details:
- Invoice ID: ${this.paymentData.invoice_id}
- Amount: ₹${this.paymentData.amount.toLocaleString()}
- Payment Date: ${this.formatDate(this.paymentData.payment_timestamp)}
- Payment ID: ${this.paymentData.payment_id}

You can also download your invoice from: ${this.paymentData.invoice_pdf_link}

If you have any questions, please contact us at info@infogrip.com or +91 6367556906.

Best regards,
InfoGrip Media Solution Team`;
        
        window.open(`mailto:${this.paymentData.client_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        
        this.showNotification('Email client opened with invoice details', 'success');
    }

    async whatsappInvoice() {
        if (!this.paymentData.invoice_pdf_link) {
            this.showError('Invoice is not ready yet. Please try again in a moment.');
            return;
        }
        
        const message = `Hello ${this.paymentData.client_name}, your payment is received. Invoice: ${this.paymentData.invoice_id}. Amount: ₹${this.paymentData.amount}. Download: ${this.paymentData.invoice_pdf_link}. - InfoGrip`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/91${this.paymentData.client_phone.replace(/\D/g, '')}?text=${encodedMessage}`;
        
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
        alert(message); // Simple alert for demo purposes
    }

    showNotification(message, type = 'info') {
        // Simple notification for demo purposes
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    simulateAPICall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Initialize thank you page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.thankYouPage = new ThankYouPage();
});
