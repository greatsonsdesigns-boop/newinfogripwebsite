// script.js - Shared JavaScript Functions for InfoGrip Admin System

// Google Apps Script API Configuration
 window.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWyQFqcftfk35k8_HYFt3Gyiw8_u4DR0hvG694qJcn8ZLVxZQRZQIy0UgL3dt3Ko1ihA/exec'; // Replace with your script URL

// Show/Hide Loading
function showLoading(button) {
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
    }
}

function hideLoading(button, originalText) {
    if (button) {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format Date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generate Random ID
function generateId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate Mobile
function validateMobile(mobile) {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                           type === 'error' ? 'exclamation-circle' : 
                           type === 'warning' ? 'exclamation-triangle' : 
                           'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Confirm Dialog
function showConfirm(message, callback) {
    if (confirm(message)) {
        if (typeof callback === 'function') {
            callback();
        }
        return true;
    }
    return false;
}

// Save to Google Sheets
async function saveToGoogleSheets(sheetName, data) {
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'append',
                sheet: sheetName,
                data: data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Data saved successfully!', 'success');
            return true;
        } else {
            showNotification('Error saving data: ' + result.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        showNotification('Error saving data. Please try again.', 'error');
        return false;
    }
}

// Read from Google Sheets
async function readFromGoogleSheets(sheetName, query = {}) {
    try {
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=read&sheet=${sheetName}&query=${encodeURIComponent(JSON.stringify(query))}`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            showNotification('Error reading data: ' + result.error, 'error');
            return null;
        }
    } catch (error) {
        console.error('Error reading from Google Sheets:', error);
        showNotification('Error reading data. Please try again.', 'error');
        return null;
    }
}

// Upload File to Google Drive
async function uploadToGoogleDrive(file, folderId) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', folderId);
        formData.append('action', 'upload');
        
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.fileId;
        } else {
            showNotification('Error uploading file: ' + result.error, 'error');
            return null;
        }
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        showNotification('Error uploading file. Please try again.', 'error');
        return null;
    }
}

// Generate Invoice PDF
async function generateInvoicePDF(invoiceData) {
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generateInvoice',
                data: invoiceData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.pdfUrl;
        } else {
            showNotification('Error generating invoice: ' + result.error, 'error');
            return null;
        }
    } catch (error) {
        console.error('Error generating invoice:', error);
        showNotification('Error generating invoice. Please try again.', 'error');
        return null;
    }
}

// Send Email
async function sendEmail(to, subject, body, attachments = []) {
    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'sendEmail',
                to: to,
                subject: subject,
                body: body,
                attachments: attachments
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Email sent successfully!', 'success');
            return true;
        } else {
            showNotification('Error sending email: ' + result.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('Error sending email:', error);
        showNotification('Error sending email. Please try again.', 'error');
        return false;
    }
}

// Send WhatsApp Message
function sendWhatsAppMessage(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Initialize Razorpay
function initializeRazorpay(razorpayKey, paymentData, successCallback, errorCallback) {
    const options = {
        key: razorpayKey,
        amount: paymentData.amount * 100,
        currency: "INR",
        name: "InfoGrip Media Solution",
        description: paymentData.description,
        image: "https://i.postimg.cc/Nj3bmPwC/Infogrip-Medi-Soluiton-(Social-Media)-(1).png",
        order_id: paymentData.order_id,
        handler: function(response) {
            if (typeof successCallback === 'function') {
                successCallback(response);
            }
        },
        prefill: {
            name: paymentData.customer_name,
            email: paymentData.customer_email,
            contact: paymentData.customer_phone
        },
        notes: paymentData.notes,
        theme: {
            color: "#001c4f"
        },
        modal: {
            ondismiss: function() {
                if (typeof errorCallback === 'function') {
                    errorCallback('Payment cancelled');
                }
            }
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
    
    return rzp;
}

// Calculate Amount with GST and Discount
function calculateAmount(baseAmount, gstPercentage = 0, discount = 0, discountType = 'percentage') {
    let gstAmount = 0;
    let discountAmount = 0;
    
    if (gstPercentage > 0) {
        gstAmount = baseAmount * (gstPercentage / 100);
    }
    
    if (discount > 0) {
        if (discountType === 'percentage') {
            discountAmount = baseAmount * (discount / 100);
        } else {
            discountAmount = discount;
        }
    }
    
    const finalAmount = baseAmount + gstAmount - discountAmount;
    
    return {
        baseAmount,
        gstAmount,
        discountAmount,
        finalAmount
    };
}

// Format Phone Number
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Download File
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// Export to CSV
function exportToCSV(data, filename) {
    const csvContent = "data:text/csv;charset=utf-8," 
        + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import from CSV
function importFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
            const values = row.split(',');
            const obj = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index] ? values[index].trim() : '';
            });
            return obj;
        });
        
        if (typeof callback === 'function') {
            callback(data);
        }
    };
    reader.readAsText(file);
}

// Local Storage Helper
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Session Storage Helper
const session = {
    set: function(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
            return false;
        }
    },
    
    clear: function() {
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing sessionStorage:', error);
            return false;
        }
    }
};

// Initialize Page
function initializePage() {
    // Add CSS for animations if not already added
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize tooltips if any
    initializeTooltips();
    
    // Initialize form validations
    initializeFormValidations();
}

// Initialize Tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--primary-blue);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                z-index: 10000;
                max-width: 200px;
                word-wrap: break-word;
            `;
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - 40) + 'px';
            
            document.body.appendChild(tooltip);
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
            }
        });
    });
}

// Initialize Form Validations
function initializeFormValidations() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}


// Validate Form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            highlightError(input, 'This field is required');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            highlightError(input, 'Please enter a valid email address');
        } else if (input.type === 'tel' && !validateMobile(input.value)) {
            isValid = false;
            highlightError(input, 'Please enter a valid 10-digit mobile number');
        } else {
            removeError(input);
        }
    });
    
    return isValid;
}

// Highlight Error
function highlightError(input, message) {
    removeError(input);
    
    input.style.borderColor = 'var(--danger)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: var(--danger);
        font-size: 0.85rem;
        margin-top: 5px;
    `;
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    input.errorElement = errorDiv;
}

// Remove Error
function removeError(input) {
    input.style.borderColor = '';
    
    if (input.errorElement) {
        input.errorElement.remove();
        input.errorElement = null;
    }
}
// Invoice Generation Functions
async function generateInvoice(invoiceData) {
    try {
        // Generate invoice HTML
        const invoiceHTML = generateInvoiceHTML(invoiceData);
        
        // Create PDF via Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generateInvoice',
                data: invoiceData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.pdfUrl;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error generating invoice:', error);
        throw error;
    }
}

function generateInvoiceHTML(invoiceData) {
    const itemsHTML = invoiceData.items.map(item => `
        <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>₹${item.rate.toLocaleString()}</td>
            <td>${item.tax}%</td>
            <td>₹${(item.quantity * item.rate * (1 + item.tax/100)).toLocaleString()}</td>
        </tr>
    `).join('');

    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxTotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate * (item.tax/100)), 0);
    const grandTotal = subtotal + taxTotal;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Inter', sans-serif; margin: 0; padding: 40px; color: #333; }
                .invoice-container { max-width: 800px; margin: 0 auto; background: white; }
                .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                .company-info h1 { color: #001c4f; margin: 0; }
                .invoice-details { text-align: right; }
                .invoice-number { font-size: 24px; font-weight: bold; color: #001c4f; }
                .content { margin: 40px 0; }
                .table { width: 100%; border-collapse: collapse; }
                .table th { background: #001c4f; color: white; padding: 12px; }
                .table td { padding: 12px; border-bottom: 1px solid #ddd; }
                .totals { text-align: right; margin-top: 30px; }
                .footer { margin-top: 50px; text-align: center; color: #666; font-size: 14px; }
                .signature { margin-top: 60px; display: flex; justify-content: space-between; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header">
                    <div class="company-info">
                        <h1>InfoGrip Media Solution</h1>
                        <p>Jaipur, Rajasthan, India</p>
                        <p>info@infogrip.com | +91 6367556906</p>
                        <p>GSTIN: 08AABCU9603R1ZP</p>
                    </div>
                    <div class="invoice-details">
                        <div class="invoice-number">${invoiceData.invoiceNumber}</div>
                        <p><strong>Date:</strong> ${new Date(invoiceData.date).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div class="content">
                    <div style="margin-bottom: 30px;">
                        <h3>Bill To:</h3>
                        <p><strong>${invoiceData.clientName}</strong></p>
                        <p>${invoiceData.clientEmail}</p>
                        <p>${invoiceData.clientPhone}</p>
                    </div>
                    
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Tax</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>
                    
                    <div class="totals">
                        <p>Subtotal: ₹${subtotal.toLocaleString()}</p>
                        <p>Tax: ₹${taxTotal.toLocaleString()}</p>
                        <p><strong>Total: ₹${grandTotal.toLocaleString()}</strong></p>
                    </div>
                    
                    ${invoiceData.notes ? `
                        <div style="margin-top: 30px;">
                            <h4>Notes:</h4>
                            <p>${invoiceData.notes}</p>
                        </div>
                    ` : ''}
                    
                    <div class="signature">
                        <div>
                            <p>_________________________</p>
                            <p>Authorized Signature</p>
                        </div>
                        <div>
                            <p>_________________________</p>
                            <p>Client Signature</p>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>If you have any questions, please contact us at info@infogrip.com</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Auto-generate Invoice Number
function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `INV-${year}${month}${day}-${random}`;
}

// Calculate Invoice Totals
function calculateInvoiceTotals(items) {
    let subtotal = 0;
    let taxTotal = 0;
    
    items.forEach(item => {
        const itemTotal = item.quantity * item.rate;
        const itemTax = itemTotal * (item.tax / 100);
        
        subtotal += itemTotal;
        taxTotal += itemTax;
    });
    
    const grandTotal = subtotal + taxTotal;
    
    return {
        subtotal: Math.round(subtotal * 100) / 100,
        taxTotal: Math.round(taxTotal * 100) / 100,
        grandTotal: Math.round(grandTotal * 100) / 100
    };
}

// Send Invoice via Email
async function sendInvoiceEmail(invoiceData, pdfUrl) {
    const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #001c4f; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f8f9fa; }
                .button { display: inline-block; background: #fdcb54; color: #001c4f; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Invoice from InfoGrip</h1>
                </div>
                <div class="content">
                    <h2>Dear ${invoiceData.clientName},</h2>
                    <p>Please find attached your invoice <strong>${invoiceData.invoiceNumber}</strong> for the services provided.</p>
                    
                    <h3>Invoice Details:</h3>
                    <ul>
                        <li>Invoice Number: ${invoiceData.invoiceNumber}</li>
                        <li>Date: ${new Date(invoiceData.date).toLocaleDateString()}</li>
                        <li>Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}</li>
                        <li>Total Amount: ₹${calculateInvoiceTotals(invoiceData.items).grandTotal.toLocaleString()}</li>
                    </ul>
                    
                    <p>You can download the invoice by clicking the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${pdfUrl}" class="button">Download Invoice</a>
                    </div>
                    
                    <p>Please complete the payment by the due date. If you have already paid, please ignore this email.</p>
                    
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    
                    <p>Best regards,<br>
                    <strong>InfoGrip Media Solution Team</strong></p>
                </div>
                <div class="footer">
                    <p>InfoGrip Media Solution | info@infogrip.com | +91 6367556906</p>
                    <p>© ${new Date().getFullYear()} InfoGrip Media Solution. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return await sendEmail(
        invoiceData.clientEmail,
        `Invoice ${invoiceData.invoiceNumber} - InfoGrip Media Solution`,
        emailTemplate,
        [pdfUrl]
    );
}

// Send Invoice via WhatsApp
function sendInvoiceWhatsApp(invoiceData, pdfUrl) {
    const message = `Hello ${invoiceData.clientName},

Your invoice ${invoiceData.invoiceNumber} is ready.

Service: ${invoiceData.items.map(item => item.description).join(', ')}
Amount: ₹${calculateInvoiceTotals(invoiceData.items).grandTotal.toLocaleString()}
Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}

Download invoice: ${pdfUrl}

Please complete the payment by the due date.

Thank you,
InfoGrip Team`;

    const phone = invoiceData.clientPhone.replace(/\D/g, '');
    
    if (phone) {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/91${phone}?text=${encodedMessage}`;
    }
    
    return null;
}

// Save Invoice to Google Sheets
async function saveInvoiceToSheets(invoiceData) {
    const sheetData = {
        'Invoice Number': invoiceData.invoiceNumber,
        'Client Name': invoiceData.clientName,
        'Client Email': invoiceData.clientEmail,
        'Client Phone': invoiceData.clientPhone,
        'Invoice Date': invoiceData.date,
        'Due Date': invoiceData.dueDate,
        'Amount': calculateInvoiceTotals(invoiceData.items).grandTotal,
        'Status': 'Generated',
        'Items': JSON.stringify(invoiceData.items),
        'Notes': invoiceData.notes || '',
        'Terms': invoiceData.terms || '',
        'Generated Date': new Date().toISOString(),
        'Payment Status': 'Pending'
    };
    
    return await saveToGoogleSheets('Invoices', sheetData);
}
// Export all functions
window.InfoGripUtils = {
    showLoading,
    hideLoading,
    formatCurrency,
    formatDate,
    generateId,
    validateEmail,
    validateMobile,
    showNotification,
    showConfirm,
    saveToGoogleSheets,
    readFromGoogleSheets,
    uploadToGoogleDrive,
    generateInvoicePDF,
    sendEmail,
    sendWhatsAppMessage,
    initializeRazorpay,
    calculateAmount,
    formatPhoneNumber,
    debounce,
    throttle,
    copyToClipboard,
    downloadFile,
    exportToCSV,
    importFromCSV,
    storage,
    session,
    initializePage,
    validateForm
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});
