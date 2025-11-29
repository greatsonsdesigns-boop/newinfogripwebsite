// Checkout Page JavaScript
class CheckoutPage {
    constructor() {
        this.invoiceData = null;
        this.razorpayOptions = null;
        
        this.init();
    }

    init() {
        this.parseURLParams();
        this.setupEventListeners();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        if (this.invoiceData) {
            this.updateServiceSummary();
            this.prefillClientData();
        }
    }

    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        this.invoiceData = {
            invoiceId: urlParams.get('invoice_id') || this.generateInvoiceId(),
            clientId: urlParams.get('client_id'),
            service: decodeURIComponent(urlParams.get('service') || 'Digital Marketing Service'),
            amount: parseFloat(urlParams.get('amount')) || 0,
            description: decodeURIComponent(urlParams.get('description') || 'Professional digital marketing services')
        };
    }

    generateInvoiceId() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `IG${timestamp}${random}`;
    }

    setupEventListeners() {
        document.getElementById('payButton').addEventListener('click', () => this.initiatePayment());
    }

    updateCurrentTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const timeString = now.toLocaleDateString('en-IN', options);
        document.getElementById('currentTime').textContent = timeString;
    }

    updateServiceSummary() {
        document.getElementById('serviceName').textContent = this.invoiceData.service;
        document.getElementById('serviceDescription').textContent = this.invoiceData.description;
        document.getElementById('invoiceNumber').textContent = this.invoiceData.invoiceId;
        document.getElementById('invoiceDateTime').textContent = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('serviceAmount').textContent = `₹${this.invoiceData.amount.toLocaleString()}`;
    }

    prefillClientData() {
        // If client ID exists, try to fetch client data
        if (this.invoiceData.clientId && this.invoiceData.clientId !== 'new') {
            this.fetchClientData(this.invoiceData.clientId);
        }
    }

    async fetchClientData(clientId) {
        // Simulate API call to fetch client data
        try {
            const client = await this.getClientFromSheet(clientId);
            if (client) {
                document.getElementById('clientName').value = client.name;
                document.getElementById('clientEmail').value = client.email;
                document.getElementById('clientPhone').value = client.phone;
                document.getElementById('clientAddress').value = client.address || '';
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    }

    async getClientFromSheet(clientId) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock client data
                resolve({
                    id: clientId,
                    name: `Client ${clientId}`,
                    email: `client${clientId}@example.com`,
                    phone: '+91 9876543210',
                    address: 'Jaipur, Rajasthan'
                });
            }, 500);
        });
    }

    validateForm() {
        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        
        if (!name) {
            alert('Please enter your full name');
            return false;
        }
        
        if (!email || !this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        if (!phone || !this.isValidPhone(phone)) {
            alert('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    async initiatePayment() {
        if (!this.validateForm()) {
            return;
        }
        
        const clientData = {
            name: document.getElementById('clientName').value.trim(),
            email: document.getElementById('clientEmail').value.trim(),
            phone: document.getElementById('clientPhone').value.trim(),
            address: document.getElementById('clientAddress').value.trim()
        };
        
        try {
            // Create Razorpay order
            const order = await this.createRazorpayOrder();
            
            // Initialize Razorpay checkout
            this.initializeRazorpay(order, clientData);
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Error initiating payment. Please try again.');
        }
    }

    async createRazorpayOrder() {
        // Simulate API call to create Razorpay order
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: `order_${Date.now()}`,
                    amount: this.invoiceData.amount * 100, // Convert to paise
                    currency: 'INR'
                });
            }, 1000);
        });
    }

    initializeRazorpay(order, clientData) {
        const options = {
            key: 'rzp_test_YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
            amount: order.amount,
            currency: order.currency,
            name: 'InfoGrip Media Solution',
            description: this.invoiceData.service,
            order_id: order.id,
            handler: (response) => this.handlePaymentSuccess(response, clientData),
            prefill: {
                name: clientData.name,
                email: clientData.email,
                contact: clientData.phone
            },
            notes: {
                invoice_id: this.invoiceData.invoiceId,
                service: this.invoiceData.service
            },
            theme: {
                color: '#001c4f'
            }
        };
        
        const razorpay = new Razorpay(options);
        razorpay.open();
    }

    async handlePaymentSuccess(response, clientData) {
        try {
            // Verify payment with your server
            const paymentVerified = await this.verifyPayment(response);
            
            if (paymentVerified) {
                // Save payment to Google Sheets
                await this.savePaymentToSheet(response, clientData);
                
                // Redirect to thank you page
                this.redirectToThankYou(response, clientData);
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Error handling payment success:', error);
            alert('Error processing payment. Please contact support.');
        }
    }

    async verifyPayment(response) {
        // Simulate payment verification
        return new Promise((resolve) => {
            setTimeout(() => {
                // In a real implementation, verify with your server
                resolve(true);
            }, 500);
        });
    }

    async savePaymentToSheet(response, clientData) {
        const paymentData = {
            payment_id: response.razorpay_payment_id,
            invoice_id: this.invoiceData.invoiceId,
            client_id: this.invoiceData.clientId,
            name: clientData.name,
            phone: clientData.phone,
            email: clientData.email,
            service: this.invoiceData.service,
            amount: this.invoiceData.amount,
            payment_mode: 'Razorpay', // This would be determined from response
            status: 'Paid',
            created_timestamp: new Date().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }),
            invoice_url: `${window.location.origin}/invoice.html?payment_id=${response.razorpay_payment_id}&invoice_id=${this.invoiceData.invoiceId}`
        };
        
        // Simulate API call to save payment
        console.log('Payment saved to sheet:', paymentData);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    redirectToThankYou(response, clientData) {
        const params = new URLSearchParams({
            payment_id: response.razorpay_payment_id,
            invoice_id: this.invoiceData.invoiceId,
            amount: this.invoiceData.amount,
            client_name: encodeURIComponent(clientData.name),
            service: encodeURIComponent(this.invoiceData.service)
        });
        
        window.location.href = `thankyou.html?${params.toString()}`;
    }
}

// Initialize checkout page
const checkout = new CheckoutPage();
