// InfoGrip Thank You Page JavaScript

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const invoiceId = urlParams.get('invoice_id');
const paymentId = urlParams.get('payment_id');
const pdfLink = urlParams.get('pdf_link');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (!invoiceId || !paymentId) {
        showError('Invalid payment confirmation. Please contact support.');
        return;
    }
    
    populatePaymentDetails();
    setupEventListeners();
    
    // Auto-download invoice after 2 seconds (optional)
    setTimeout(() => {
        if (pdfLink) {
            document.getElementById('downloadInvoiceBtn').click();
        }
    }, 2000);
});

// Populate payment details
function populatePaymentDetails() {
    document.getElementById('invoiceId').textContent = invoiceId || 'N/A';
    document.getElementById('paymentId').textContent = paymentId || 'N/A';
    document.getElementById('amountPaid').textContent = '₹' + (parseFloat(urlParams.get('amount') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }));
    document.getElementById('paymentDate').textContent = new Date().toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Setup event listeners
function setupEventListeners() {
    // Download Invoice Button
    document.getElementById('downloadInvoiceBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (pdfLink) {
            window.open(pdfLink, '_blank');
        } else {
            alert('Invoice PDF is being generated. Please try again in a moment.');
        }
    });
    
    // WhatsApp Share Button
    document.getElementById('whatsappShareBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const message = `I have successfully completed the payment for invoice ${invoiceId}. Payment ID: ${paymentId}`;
        const whatsappUrl = `https://wa.me/916367556906?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    // Email Invoice Button
    document.getElementById('emailInvoiceBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const subject = `Invoice ${invoiceId} - Payment Confirmation`;
        const body = `Dear Customer,\n\nThank you for your payment. Please find the invoice attached.\n\nInvoice ID: ${invoiceId}\nPayment ID: ${paymentId}\n\nBest regards,\nInfoGrip Media Solution`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, '_blank');
    });
}

// Show error message
function showError(message) {
    const errorHTML = `
        <div class="error-message">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Oops! Something went wrong</h2>
            <p>${message}</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
        </div>
    `;
    
    document.querySelector('.success-message').innerHTML = errorHTML;
}

// Add CSS for thank you page
const thankyouCSS = `
.thankyou-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
}

.success-animation {
    margin: 50px auto;
}

.success-checkmark {
    width: 80px;
    height: 115px;
    margin: 0 auto;
}

.check-icon {
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 4px solid #4CAF50;
}

.check-icon::before {
    top: 3px;
    left: -2px;
    width: 30px;
    transform-origin: 100% 50%;
    border-radius: 100px 0 0 100px;
}

.check-icon::after {
    top: 0;
    left: 30px;
    width: 60px;
    transform-origin: 0 50%;
    border-radius: 0 100px 100px 0;
    animation: rotate-circle 4.25s ease-in;
}

.check-icon::before, .check-icon::after {
    content: '';
    height: 100px;
    position: absolute;
    background: #FFFFFF;
    transform: rotate(-45deg);
}

.icon-line {
    height: 5px;
    background-color: #4CAF50;
    display: block;
    border-radius: 2px;
    position: absolute;
    z-index: 10;
}

.icon-line.line-tip {
    top: 46px;
    left: 14px;
    width: 25px;
    transform: rotate(45deg);
    animation: icon-line-tip 0.75s;
}

.icon-line.line-long {
    top: 38px;
    right: 8px;
    width: 47px;
    transform: rotate(-45deg);
    animation: icon-line-long 0.75s;
}

.icon-circle {
    top: -4px;
    left: -4px;
    z-index: 10;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    box-sizing: content-box;
    border: 4px solid rgba(76, 175, 80, .5);
}

.icon-fix {
    top: 8px;
    width: 5px;
    left: 26px;
    z-index: 1;
    height: 85px;
    position: absolute;
    transform: rotate(-45deg);
    background-color: #FFFFFF;
}

@keyframes rotate-circle {
    0% {
        transform: rotate(-45deg);
    }
    5% {
        transform: rotate(-45deg);
    }
    12% {
        transform: rotate(-405deg);
    }
    100% {
        transform: rotate(-405deg);
    }
}

@keyframes icon-line-tip {
    0% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    54% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    70% {
        width: 50px;
        left: -8px;
        top: 37px;
    }
    84% {
        width: 17px;
        left: 21px;
        top: 48px;
    }
    100% {
        width: 25px;
        left: 14px;
        top: 45px;
    }
}

@keyframes icon-line-long {
    0% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    65% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    84% {
        width: 55px;
        right: 0px;
        top: 35px;
    }
    100% {
        width: 47px;
        right: 8px;
        top: 38px;
    }
}

.success-message {
    margin: 40px 0;
}

.success-message h1 {
    color: #4CAF50;
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.success-details {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    margin: 30px auto;
    max-width: 500px;
    text-align: left;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
}

.detail-item:last-child {
    border-bottom: none;
}

.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin: 40px 0;
    flex-wrap: wrap;
}

.action-buttons .btn-lg {
    padding: 15px 30px;
    font-size: 1.1rem;
}

.next-steps {
    margin: 60px 0;
}

.steps-timeline {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    flex-wrap: wrap;
}

.step {
    flex: 1;
    min-width: 250px;
    padding: 20px;
    margin: 10px;
}

.step-icon {
    width: 60px;
    height: 60px;
    background: #001c4f;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 20px;
}

.step h3 {
    margin-bottom: 10px;
    color: #001c4f;
}

.step p {
    color: #666;
    line-height: 1.6;
}

.support-section {
    background: #001c4f;
    color: white;
    padding: 40px;
    border-radius: 12px;
    margin: 40px 0;
}

.support-section h2 {
    color: white;
    margin-bottom: 15px;
}

.support-contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
}

.support-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 25px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s;
}

.support-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.thankyou-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
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

.error-message {
    padding: 40px;
    background: #fff5f5;
    border-radius: 12px;
    border: 2px solid #fed7d7;
}

.error-icon {
    font-size: 3rem;
    color: #e53e3e;
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .action-buttons {
        flex-direction: column;
    }
    
    .steps-timeline {
        flex-direction: column;
        align-items: center;
    }
    
    .support-contacts {
        flex-direction: column;
    }
}
`;

// Inject thank you page CSS
const style = document.createElement('style');
style.textContent = thankyouCSS;
document.head.appendChild(style);
