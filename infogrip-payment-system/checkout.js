// Checkout Page JavaScript
class CheckoutPage {
    constructor() {
        this.invoiceData = null;
        this.razorpayOptions = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Load invoice data from URL parameters
        this.loadInvoiceData();
    }

    setupEventListeners() {
        document.getElementById('proceed-to-pay').addEventListener('click', () => this.initiatePayment());
        document.getElementById('error-modal-retry').addEventListener('click', () => this.closeErrorModal());
        document.getElementById('error-modal-close').addEventListener('click', () => this.closeErrorModal());
        
        // Client form validation for new clients
        const clientForm = document.getElementById('client-form');
        if (clientForm) {
            clientForm.addEventListener('input', () => this.validateClientForm());
        }
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
        document.getElementById('checkout-datetime').textContent = formatted;
    }

    async loadInvoiceData() {
        const urlParams = new URLSearchParams(window.location.search);
        const invoiceId = urlParams.get('invoice_id');
        
        if (!invoiceId) {
            this.showError('Invalid invoice link. Please contact support.');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Simulate API call to fetch invoice data
            await this.simulateAPICall();
            
            // Sample invoice data (in real implementation, this would come from API)
            this.invoiceData = {
                invoice_id: invoiceId,
                client_id: 'CL-0001',
                name: 'Rohit Sharma',
                phone: '+91 9876543210',
                email: 'rohit@example.com',
                address: 'Jaipur, Rajasthan, India',
                services: [
                    {
                        name: 'Social Media Management',
                        qty: 1,
                        unit_price: 15000,
                        total: 15000
                    }
                ],
                subtotal: 15000,
                gst_percent: 18,
                gst_amount: 2700,
                total_amount: 17700,
                status: 'Pending',
                created_timestamp: new Date().toISOString()
            };
            
            this.renderInvoice();
            
        } catch (error) {
            this.showError('Failed to load invoice data. Please try again.');
            console.error('Invoice load error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    renderInvoice() {
        if (!this.invoiceData) return;
        
        // Update basic info
        document.getElementById('invoice-id').textContent = this.invoiceData.invoice_id;
        document.getElementById('invoice-date').textContent = this.formatDate(this.invoiceData.created_timestamp);
        document.getElementById('terms-invoice-id').textContent = this.invoiceData.invoice_id;
        document.getElementById('terms-created-date').textContent = this.formatDate(this.invoiceData.created_timestamp, true);
        
        // Update client details
        this.renderClientDetails();
        
        // Update services table
        this.renderServicesTable();
        
        // Update pricing summary
        this.updatePricingSummary();
        
        // Update payment button
        document.getElementById('pay-amount').textContent = this.invoiceData.total_amount.toLocaleString();
    }

    renderClientDetails() {
        const clientDetails = document.getElementById('client-details');
        
        if (this.invoiceData.client_id) {
            // Existing client - show readonly details
            clientDetails.innerHTML = `
                <p><strong>${this.invoiceData.name}</strong></p>
                <p>${this.invoiceData.phone}</p>
                <p>${this.invoiceData.email}</p>
                <p>${this.invoiceData.address}</p>
            `;
        } else {
            // New client - show form
            document.getElementById('client-form').classList.remove('hidden');
            clientDetails.innerHTML = '<p>Please fill in your details below</p>';
            
            // Prefill if available
            if (this.invoiceData.name) {
                document.getElementById('checkout-client-name').value = this.invoiceData.name;
            }
            if (this.invoiceData.phone) {
                document.getElementById('checkout-client-phone').value = this.invoiceData.phone;
            }
            if (this.invoiceData.email) {
                document.getElementById('checkout-client-email').value = this.invoiceData.email;
            }
            if (this.invoiceData.address) {
                document.getElementById('checkout-client-address').value = this.invoiceData.address;
            }
        }
    }

    renderServicesTable() {
        const tbody = document.getElementById('services-table-body');
        
        tbody.innerHTML = this.invoiceData.services.map((service, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${service.name}</td>
                <td>${service.qty}</td>
                <td>₹${service.unit_price.toLocaleString()}</td>
                <td>₹${service.total.toLocaleString()}</td>
            </tr>
        `).join('');
    }

    updatePricingSummary() {
        document.getElementById('summary-subtotal').textContent = `₹${this.invoiceData.subtotal.toLocaleString()}`;
        
        // GST
        if (this.invoiceData.gst_percent > 0) {
            document.getElementById('gst-percent-display').textContent = this.invoiceData.gst_percent;
            document.getElementById('summary-gst').textContent = `₹${this.invoiceData.gst_amount.toLocaleString()}`;
            document.getElementById('gst-summary-row').style.display = 'flex';
        } else {
            document.getElementById('gst-summary-row').style.display = 'none';
        }
        
        // Total
        document.getElementById('summary-total').innerHTML = `<strong>₹${this.invoiceData.total_amount.toLocaleString()}</strong>`;
    }

    validateClientForm() {
        const name = document.getElementById('checkout-client-name').value;
        const phone = document.getElementById('checkout-client-phone').value;
        const email = document.getElementById('checkout-client-email').value;
        const isValid = name && phone && email;
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return false;
        }
        
        // Basic phone validation
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        if (phone && !phoneRegex.test(cleanPhone)) {
            return false;
        }
        
        return isValid;
    }

    async initiatePayment() {
        // Validate client form for new clients
        if (!this.invoiceData.client_id) {
            if (!this.validateClientForm()) {
                this.showError('Please fill in all required client details correctly.');
                return;
            }
            
            // Update client data from form
            this.updateClientDataFromForm();
        }
        
        this.showLoading(true);
        
        try {
            // Create Razorpay order
            const orderData = await this.createRazorpayOrder();
            
            // Initialize Razorpay checkout
            this.initializeRazorpayCheckout(orderData);
            
        } catch (error) {
            this.showError('Failed to initialize payment. Please try again.');
            console.error('Payment initiation error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async createRazorpayOrder() {
        // Simulate API call to create Razorpay order
        await this.simulateAPICall();
        
        // In real implementation, this would call your Apps Script endpoint
        return {
            order_id: 'order_' + Math.random().toString(36).substr(2, 9),
            amount: this.invoiceData.total_amount * 100, // Convert to paise
            currency: 'INR',
            key_id: 'rzp_test_YOUR_KEY_ID' // This would come from your config
        };
    }

    initializeRazorpayCheckout(orderData) {
        const options = {
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.order_id,
            name: 'InfoGrip Media Solution',
            description: `Payment for Invoice ${this.invoiceData.invoice_id}`,
            image: 'https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png',
            prefill: {
                name: this.invoiceData.name,
                email: this.invoiceData.email,
                contact: this.invoiceData.phone
            },
            notes: {
                invoice_id: this.invoiceData.invoice_id,
                client_id: this.invoiceData.client_id || 'new'
            },
            theme: {
                color: '#07217c'
            },
            handler: (response) => this.handlePaymentSuccess(response),
            modal: {
                ondismiss: () => {
                    console.log('Payment modal dismissed');
                }
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    }

    async handlePaymentSuccess(response) {
        this.showLoading(true);
        
        try {
            // Verify payment with server
            const verificationResult = await this.verifyPayment(response);
            
            if (verificationResult.success) {
                // Redirect to thank you page
                window.location.href = `thankyou.html?payment_id=${response.razorpay_payment_id}&invoice_id=${this.invoiceData.invoice_id}`;
            } else {
                this.showError('Payment verification failed. Please contact support.');
            }
            
        } catch (error) {
            this.showError('Payment processing error. Please contact support.');
            console.error('Payment verification error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async verifyPayment(paymentResponse) {
        // Simulate API call to verify payment
        await this.simulateAPICall();
        
        // In real implementation, this would call your Apps Script endpoint
        // to verify the payment signature and update records
        
        return {
            success: true,
            invoice_id: this.invoiceData.invoice_id,
            payment_id: paymentResponse.razorpay_payment_id
        };
    }

    updateClientDataFromForm() {
        this.invoiceData.name = document.getElementById('checkout-client-name').value;
        this.invoiceData.phone = document.getElementById('checkout-client-phone').value;
        this.invoiceData.email = document.getElementById('checkout-client-email').value;
        this.invoiceData.address = document.getElementById('checkout-client-address').value;
    }

    // Utility methods
    formatDate(dateString, short = false) {
        const date = new Date(dateString);
        
        if (short) {
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
        
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
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-modal').classList.remove('hidden');
    }

    closeErrorModal() {
        document.getElementById('error-modal').classList.add('hidden');
    }

    simulateAPICall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutPage = new CheckoutPage();
});
