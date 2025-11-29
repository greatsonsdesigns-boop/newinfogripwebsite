// Thank You Page JavaScript
class ThankYouPage {
    constructor() {
        this.paymentData = null;
        this.invoiceUrl = null;
        
        this.init();
    }

    init() {
        this.parseURLParams();
        this.setupEventListeners();
        this.updatePaymentDetails();
        this.generateAndSaveInvoice(); // Auto-generate invoice
    }

    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        this.paymentData = {
            paymentId: urlParams.get('payment_id') || 'pay_' + Date.now(),
            invoiceId: urlParams.get('invoice_id') || 'IG' + Date.now(),
            amount: parseFloat(urlParams.get('amount')) || 0,
            clientName: decodeURIComponent(urlParams.get('client_name') || 'Customer'),
            service: decodeURIComponent(urlParams.get('service') || 'Digital Marketing Service'),
            clientEmail: 'customer@example.com', // You can pass this via URL too
            clientPhone: '+91 9876543210' // You can pass this via URL too
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

    async generateAndSaveInvoice() {
        try {
            // Generate invoice PDF
            const invoiceBlob = await this.generateInvoicePDF();
            
            // Save to Google Drive and get link
            this.invoiceUrl = await this.saveInvoiceToDrive(invoiceBlob);
            
            // Save invoice link to Google Sheets
            await this.saveInvoiceLinkToSheet();
            
            console.log('Invoice saved:', this.invoiceUrl);
        } catch (error) {
            console.error('Error generating invoice:', error);
            // Fallback: generate local PDF
            this.generateLocalInvoice();
        }
    }

    async generateInvoicePDF() {
        return new Promise((resolve) => {
            const invoiceElement = this.createInvoiceHTML();
            
            // Use html2pdf to generate PDF
            const options = {
                margin: 10,
                filename: `Invoice_${this.paymentData.invoiceId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            html2pdf().from(invoiceElement).set(options).outputPdf('blob').then(resolve);
        });
    }

    createInvoiceHTML() {
        const currentDate = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const invoiceDiv = document.createElement('div');
        invoiceDiv.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    
                    body { 
                        font-family: 'Inter', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #001c4f;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        border: 2px solid #001c4f;
                        border-radius: 15px;
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #001c4f 0%, #07217c 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .logo {
                        height: 60px;
                        margin-bottom: 15px;
                    }
                    .content {
                        padding: 30px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                    }
                    .detail-card {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                        border-left: 4px solid #fdcb54;
                    }
                    .detail-item {
                        display: flex;
                        justify-content: space-between;
                        margin: 8px 0;
                        padding: 5px 0;
                        border-bottom: 1px solid #eaeaea;
                    }
                    .detail-label {
                        color: #666;
                        font-weight: 500;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #001c4f;
                    }
                    .amount-highlight {
                        background: linear-gradient(135deg, #fdcb54 0%, #ffb347 100%);
                        color: #001c4f;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        font-size: 1.5em;
                        font-weight: 700;
                        margin: 20px 0;
                    }
                    .service-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 25px 0;
                    }
                    .service-table th {
                        background: #001c4f;
                        color: white;
                        padding: 15px;
                        text-align: left;
                    }
                    .service-table td {
                        padding: 15px;
                        border-bottom: 1px solid #eaeaea;
                    }
                    .footer {
                        background: #001c4f;
                        color: white;
                        padding: 25px;
                        text-align: center;
                    }
                    .thank-you {
                        background: linear-gradient(135deg, #001c4f 0%, #07217c 100%);
                        color: white;
                        padding: 25px;
                        text-align: center;
                        border-radius: 10px;
                        margin: 25px 0;
                    }
                    @media print {
                        body { margin: 0; }
                        .invoice-container { border: none; box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <h1>INVOICE</h1>
                        <p>InfoGrip Media Solution</p>
                    </div>
                    
                    <div class="content">
                        <div class="details-grid">
                            <div class="detail-card">
                                <h3>Invoice Details</h3>
                                <div class="detail-item">
                                    <span class="detail-label">Invoice ID:</span>
                                    <span class="detail-value">${this.paymentData.invoiceId}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Payment ID:</span>
                                    <span class="detail-value">${this.paymentData.paymentId}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date & Time:</span>
                                    <span class="detail-value">${currentDate}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Status:</span>
                                    <span class="detail-value" style="color: #28a745;">PAID</span>
                                </div>
                            </div>
                            
                            <div class="detail-card">
                                <h3>Client Information</h3>
                                <div class="detail-item">
                                    <span class="detail-label">Name:</span>
                                    <span class="detail-value">${this.paymentData.clientName}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Email:</span>
                                    <span class="detail-value">${this.paymentData.clientEmail}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Phone:</span>
                                    <span class="detail-value">${this.paymentData.clientPhone}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="amount-highlight">
                            Total Amount Paid: ₹${this.paymentData.amount.toLocaleString()}
                        </div>
                        
                        <table class="service-table">
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
                                <tr style="background: #f8f9fa;">
                                    <td style="font-weight: 700;">Total</td>
                                    <td style="font-weight: 700;">₹${this.paymentData.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div class="thank-you">
                            <h2>Thank You for Your Business!</h2>
                            <p>We appreciate your trust in InfoGrip Media Solution</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>InfoGrip Media Solution</strong></p>
                        <p>📞 +91 6367556906 | 📧 infogripmarketing@gmail.com</p>
                        <p>Jaipur, Rajasthan, India</p>
                        <p style="opacity: 0.8; margin-top: 15px;">
                            This is a computer-generated invoice. No signature required.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        return invoiceDiv;
    }

    async saveInvoiceToDrive(invoiceBlob) {
        // This would call your Google Apps Script to save to Drive
        // For now, we'll simulate this
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate Drive URL
                const driveUrl = `https://drive.google.com/file/d/INVOICE_${this.paymentData.invoiceId}/view`;
                resolve(driveUrl);
            }, 1000);
        });
        
        // In real implementation, you would call:
        // const formData = new FormData();
        // formData.append('action', 'saveInvoice');
        // formData.append('invoiceBlob', invoiceBlob);
        // formData.append('invoiceId', this.paymentData.invoiceId);
        // const response = await fetch(YOUR_WEB_APP_URL, { method: 'POST', body: formData });
    }

    async saveInvoiceLinkToSheet() {
        // Save invoice link to PAYMENTS_HISTORY sheet
        const paymentData = {
            action: 'savePayment',
            payment_id: this.paymentData.paymentId,
            invoice_id: this.paymentData.invoiceId,
            name: this.paymentData.clientName,
            email: this.paymentData.clientEmail,
            phone: this.paymentData.clientPhone,
            service: this.paymentData.service,
            amount: this.paymentData.amount,
            payment_mode: 'Razorpay',
            status: 'Paid',
            invoice_url: this.invoiceUrl
        };
        
        try {
            // This would call your Google Apps Script
            console.log('Saving to sheet:', paymentData);
            // await fetch(YOUR_WEB_APP_URL, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(paymentData)
            // });
        } catch (error) {
            console.error('Error saving to sheet:', error);
        }
    }

    downloadInvoice() {
        if (this.invoiceUrl) {
            // Open the Drive link
            window.open(this.invoiceUrl, '_blank');
        } else {
            // Fallback: generate local PDF
            this.generateLocalInvoice();
        }
    }

    generateLocalInvoice() {
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(this.createInvoiceHTML().innerHTML);
        invoiceWindow.document.close();
        setTimeout(() => {
            invoiceWindow.print();
        }, 500);
    }
}

// Initialize thank you page
const thankYou = new ThankYouPage();
