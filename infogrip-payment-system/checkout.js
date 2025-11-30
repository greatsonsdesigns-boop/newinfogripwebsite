// Checkout Page JavaScript for InfoGrip Payment System
class CheckoutPage {
    constructor() {
        // CONFIGURATION - UPDATE THESE VALUES
        this.API_CONFIG = {
            WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwlqmQnjGeovQPnSOll5efIPSBLshGzYUYlrGrDox4OW6SRmTJmj1PIB3L0IeG-I2KM/exec' // ← REPLACE WITH YOUR WEB APP URL
        };
        
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
            // CALL REAL GOOGLE APPS SCRIPT API
            const result = await this.makeGetAPICall('getPaymentByInvoiceId', { invoice_id: invoiceId });
            
            if (result.success) {
                this.invoiceData = result;
                this.renderInvoice();
            } else {
                throw new Error(result.error || 'Failed to load invoice data');
            }
            
        } catch (error) {
            this.showError('Failed to load invoice data. Please try again.');
            console.error('Invoice load error:', error);
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

    async makeAPICall(endpoint, data = {}) {
        try {
            const payload = {
                endpoint: endpoint,
                ...data
            };

            console.log(`Making API call to ${endpoint}:`, payload);

            const response = await fetch(this.API_CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            console.log(`API response from ${endpoint}:`, result);
            return result;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            throw error;
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
        document.getElementById('pay-amount').textContent = (this.invoiceData.total_amount || 0).toLocaleString();
    }

    renderClientDetails() {
        const clientDetails = document.getElementById('client-details');
        
        if (this.invoiceData.client_id) {
            // Existing client - show readonly details
            clientDetails.innerHTML = `
                <p><strong>${this.invoiceData.name}</strong></p>
                <p>${this.invoiceData.phone}</p>
                <p>${this.invoiceData.email}</p>
                <p>${this.invoiceData.address || ''}</p>
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
        
        let services = [];
        if (typeof this.invoiceData.services_json === 'string') {
            services = JSON.parse(this.invoiceData.services_json);
        } else if (Array.isArray(this.invoiceData.services)) {
            services = this.invoiceData.services;
        }
        
        tbody.innerHTML = services.map((service, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${service.name}</td>
                <td>${service.qty}</td>
                <td>₹${(service.unit_price || 0).toLocaleString()}</td>
                <td>₹{(service.total || 0).toLocaleString()}</td>
            </tr>
        `).join('');
    }

    updatePricingSummary() {
        document.getElementById('summary-subtotal').textContent = `₹${(this.invoiceData.subtotal || 0).toLocaleString()}`;
        
        // GST
        if (this.invoiceData.gst_percent > 0) {
            document.getElementById('gst-percent-display').textContent = this.invoiceData.gst_percent;
            document.getElementById('summary-gst').textContent = `₹${(this.invoiceData.gst_amount || 0).toLocaleString()}`;
            document.getElementById('gst-summary-row').style.display = 'flex';
        } else {
            document.getElementById('gst-summary-row').style.display = 'none';
        }
        
        // Total
        document.getElementById('summary-total').innerHTML = `<strong>₹${(this.invoiceData.total_amount || 0).toLocaleString()}</strong>`;
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
        // CALL REAL GOOGLE APPS SCRIPT API
        const result = await this.makeAPICall('createRazorpayOrder', {
            invoice_id: this.invoiceData.invoice_id
        });
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to create Razorpay order');
        }
        
        return result;
    }

    initializeRazorpayCheckout(orderData) {
        const options = {
            key: orderData.key_id, // This comes from Google Apps Script
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
        // CALL REAL GOOGLE APPS SCRIPT API
        const result = await this.makeAPICall('confirmPayment', {
            invoice_id: this.invoiceData.invoice_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            payment_method: 'Online'
        });
        
        return result;
    }

    updateClientDataFromForm() {
        this.invoiceData.name = document.getElementById('checkout-client-name').value;
        this.invoiceData.phone = document.getElementById('checkout-client-phone').value;
        this.invoiceData.email = document.getElementById('checkout-client-email').value;
        this.invoiceData.address = document.getElementById('checkout-client-address').value;
    }

    // Utility methods
    formatDate(dateString, short = false) {
        if (!dateString) return 'N/A';
        
        try {
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
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-modal').classList.remove('hidden');
    }

    closeErrorModal() {
        document.getElementById('error-modal').classList.add('hidden');
    }
}

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutPage = new CheckoutPage();
});
