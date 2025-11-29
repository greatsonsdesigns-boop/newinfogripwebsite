// Thank You Page JavaScript
class ThankYouPage {
    constructor() {
        this.paymentData = null;
        
        this.init();
    }

    init() {
        this.parseURLParams();
        this.setupEventListeners();
        this.updatePaymentDetails();
    }

    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        this.paymentData = {
            paymentId: urlParams.get('payment_id') || 'pay_' + Date.now(),
            invoiceId: urlParams.get('invoice_id') || 'IG' + Date.now(),
            amount: parseFloat(urlParams.get('amount')) || 0,
            clientName: decodeURIComponent(urlParams.get('client_name') || 'Customer'),
            service: decodeURIComponent(urlParams.get('service') || 'Digital Marketing Service')
        };
    }

    setupEventListeners() {
        document.getElementById('downloadInvoice').addEventListener('click', () => this.downloadInvoice());
    }

    updatePaymentDetails() {
        document.getElementById('paymentId').textContent = this.paymentData.paymentId;
        document.getElementById('invoiceNumber').textContent = this.paymentData.invoiceId;
        document.getElementById('paymentDateTime').textContent = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        document.getElementById('amountPaid').textContent = `₹${this.paymentData.amount.toLocaleString()}`;
        document.getElementById('paymentMethod').textContent = 'Razorpay (UPI/Card/Net Banking)';
    }

    async downloadInvoice() {
        try {
            // Generate invoice PDF
            const invoiceUrl = await this.generateInvoicePDF();
            
            // Create download link
            const link = document.createElement('a');
            link.href = invoiceUrl;
            link.download = `Invoice_${this.paymentData.invoiceId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Error generating invoice. Please try again.');
        }
    }

    async generateInvoicePDF() {
        // In a real implementation, this would call your server to generate PDF
        // For now, we'll create a simple HTML invoice and use window.print()
        
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${this.paymentData.invoiceId}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { height: 60px; margin-bottom: 10px; }
                    .invoice-details { margin: 20px 0; }
                    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    .table th { background-color: #f5f5f5; }
                    .total { font-weight: bold; font-size: 1.2em; }
                    .footer { margin-top: 40px; text-align: center; color: #666; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png" alt="InfoGrip Logo" class="logo">
                    <h1>INVOICE</h1>
                </div>
                
                <div class="invoice-details">
                    <p><strong>Invoice ID:</strong> ${this.paymentData.invoiceId}</p>
                    <p><strong>Payment ID:</strong> ${this.paymentData.paymentId}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        weekday: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })}</p>
                </div>
                
                <div class="client-info">
                    <h3>Bill To:</h3>
                    <p><strong>${this.paymentData.clientName}</strong></p>
                    <p>Email: customer@example.com</p>
                    <p>Phone: +91 9876543210</p>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${this.paymentData.service}</td>
                            <td>₹${this.paymentData.amount.toLocaleString()}</td>
                        </tr>
                        <tr class="total">
                            <td>Total</td>
                            <td>₹${this.paymentData.amount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="payment-info">
                    <p><strong>Payment Method:</strong> Razorpay</p>
                    <p><strong>Status:</strong> Paid</p>
                </div>
                
                <div class="footer">
                    <p>Thank you for choosing InfoGrip Media Solution!</p>
                    <p>For any queries, contact: +91 6367556906 | info@infogrip.com</p>
                    <p>Jaipur, Rajasthan, India</p>
                </div>
            </body>
            </html>
        `);
        
        invoiceWindow.document.close();
        invoiceWindow.print();
        
        return '#'; // Return placeholder URL
    }
}

// Initialize thank you page
const thankYou = new ThankYouPage();
