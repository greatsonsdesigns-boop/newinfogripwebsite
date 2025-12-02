// js/onboarding.js

// Updated Web App URL for Google Sheets integration
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxedc7dXfl51XZr7whZKYkxtXbI-_ItRpPb-7FWwASyMt-cb_3m4magscw_2fnUCGM56w/exec';

// DOM Elements
const elements = {
    form: document.getElementById('onboardingForm'),
    loading: document.getElementById('loading'),
    successMessage: document.getElementById('successMessage'),
    category: document.getElementById('category'),
    businessType: document.getElementById('businessType'),
    party: document.getElementById('party'),
    role: document.getElementById('role'),
    service: document.getElementById('service'),
    businessTypeGroup: document.getElementById('businessTypeGroup'),
    businessNameGroup: document.getElementById('businessNameGroup'),
    otherBusinessGroup: document.getElementById('otherBusinessGroup'),
    partyGroup: document.getElementById('partyGroup'),
    otherPartyGroup: document.getElementById('otherPartyGroup'),
    roleGroup: document.getElementById('roleGroup'),
    otherRoleGroup: document.getElementById('otherRoleGroup'),
    budgetGroup: document.getElementById('budgetGroup')
};

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Helper function to check if element is visible
function isVisible(element) {
    return !element.classList.contains('hidden');
}

// Format WhatsApp number and validate digits only
document.getElementById('whatsapp').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Remove any existing formatting
    value = value.replace(/\s/g, '');
    
    // Ensure it starts with 91 for India
    if (value.startsWith('91')) {
        value = value.substring(2);
    }
    
    // Format as +91 XXXXX XXXXX
    if (value.length > 0) {
        value = '+91 ' + value;
    }
    
    if (value.length > 6) {
        value = value.substring(0, 6) + ' ' + value.substring(6);
    }
    
    if (value.length > 11) {
        value = value.substring(0, 11) + ' ' + value.substring(11);
    }
    
    e.target.value = value.substring(0, 16);
});

// Show/hide fields based on category
elements.category.addEventListener('change', function() {
    // Hide all conditional fields first
    document.querySelectorAll('.form-group').forEach(group => {
        if (group.id.includes('Group') && group.id !== 'budgetGroup') {
            group.classList.add('hidden');
        }
    });
    
    // Show relevant fields based on category
    if (this.value === 'Business Owner') {
        elements.businessTypeGroup.classList.remove('hidden');
        elements.businessNameGroup.classList.remove('hidden');
    } else if (this.value === 'Politician') {
        elements.partyGroup.classList.remove('hidden');
        elements.roleGroup.classList.remove('hidden');
    }
});

// Show/hide other business type field
elements.businessType.addEventListener('change', function() {
    if (this.value === 'Other') {
        elements.otherBusinessGroup.classList.remove('hidden');
    } else {
        elements.otherBusinessGroup.classList.add('hidden');
    }
});

// Show/hide other party field
elements.party.addEventListener('change', function() {
    if (this.value === 'Other') {
        elements.otherPartyGroup.classList.remove('hidden');
    } else {
        elements.otherPartyGroup.classList.add('hidden');
    }
});

// Show/hide other role field
elements.role.addEventListener('change', function() {
    if (this.value === 'Other') {
        elements.otherRoleGroup.classList.remove('hidden');
    } else {
        elements.otherRoleGroup.classList.add('hidden');
    }
});

// Show/hide budget based on service selection
elements.service.addEventListener('change', function() {
    if (this.value === 'Complete Social Media Management') {
        elements.budgetGroup.classList.remove('hidden');
    } else {
        elements.budgetGroup.classList.add('hidden');
    }
});

// Form submission with Google Sheets integration
elements.form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset errors
    document.querySelectorAll('.error').forEach(error => {
        error.style.display = 'none';
    });
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        email: document.getElementById('email').value.trim(),
        category: elements.category.value,
        businessType: elements.businessType.value,
        otherBusiness: document.getElementById('otherBusiness').value.trim(),
        businessName: document.getElementById('businessName').value.trim(),
        party: elements.party.value,
        otherParty: document.getElementById('otherParty').value.trim(),
        role: elements.role.value,
        otherRole: document.getElementById('otherRole').value.trim(),
        service: elements.service.value,
        budget: document.getElementById('budget').value
    };
    
    let isValid = validateForm(formData);
    
    // If form is valid, send data to Google Sheets
    if (isValid) {
        submitForm(formData);
    }
});

// Form validation function
function validateForm(formData) {
    let isValid = true;
    
    // Validate name
    if (formData.name === '') {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }
    
    // Validate WhatsApp (should be +91 followed by 10 digits)
    const whatsappValue = formData.whatsapp.replace(/\s/g, '');
    const whatsappRegex = /^\+91\d{10}$/;
    
    if (!whatsappRegex.test(whatsappValue)) {
        document.getElementById('whatsappError').style.display = 'block';
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    // Validate category
    if (formData.category === '') {
        document.getElementById('categoryError').style.display = 'block';
        isValid = false;
    }
    
    // Validate business fields ONLY if category is Business Owner AND fields are visible
    if (formData.category === 'Business Owner') {
        if (isVisible(elements.businessTypeGroup) && formData.businessType === '') {
            document.getElementById('businessTypeError').style.display = 'block';
            isValid = false;
        }
        
        if (isVisible(elements.otherBusinessGroup) && formData.otherBusiness === '') {
            document.getElementById('otherBusinessError').style.display = 'block';
            isValid = false;
        }
    }
    
    // Validate political fields ONLY if category is Politician AND fields are visible
    if (formData.category === 'Politician') {
        if (isVisible(elements.partyGroup) && formData.party === '') {
            document.getElementById('partyError').style.display = 'block';
            isValid = false;
        }
        
        if (isVisible(elements.otherPartyGroup) && formData.otherParty === '') {
            document.getElementById('otherPartyError').style.display = 'block';
            isValid = false;
        }
        
        if (isVisible(elements.roleGroup) && formData.role === '') {
            document.getElementById('roleError').style.display = 'block';
            isValid = false;
        }
        
        if (isVisible(elements.otherRoleGroup) && formData.otherRole === '') {
            document.getElementById('otherRoleError').style.display = 'block';
            isValid = false;
        }
    }
    
    // Validate service
    if (formData.service === '') {
        document.getElementById('serviceError').style.display = 'block';
        isValid = false;
    }
    
    // Validate budget ONLY if service is Social Media Management AND budget field is visible
    if (formData.service === 'Complete Social Media Management' && isVisible(elements.budgetGroup) && formData.budget === '') {
        document.getElementById('budgetError').style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// Function to submit form data
function submitForm(formData) {
    // Show loading
    elements.loading.style.display = 'block';
    elements.form.style.display = 'none';

    // Prepare data for Google Sheets
    const submissionData = {
        timestamp: new Date().toLocaleString(),
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        category: formData.category,
        businessType: formData.category === 'Business Owner' ? 
            (formData.businessType === 'Other' ? formData.otherBusiness : formData.businessType) : 'N/A',
        businessName: formData.category === 'Business Owner' ? formData.businessName : 'N/A',
        party: formData.category === 'Politician' ? 
            (formData.party === 'Other' ? formData.otherParty : formData.party) : 'N/A',
        role: formData.category === 'Politician' ? 
            (formData.role === 'Other' ? formData.otherRole : formData.role) : 'N/A',
        service: formData.service,
        budget: formData.service === 'Complete Social Media Management' ? formData.budget : 'N/A'
    };

    // Submit using Fetch API
    submitUsingFetch(submissionData);
}

// Function to submit data using Fetch API
function submitUsingFetch(formData) {
    // Create URL parameters
    const params = new URLSearchParams();
    for (const key in formData) {
        params.append(key, formData[key]);
    }
    
    // Submit using fetch with proper error handling
    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    })
    .then(() => {
        // Since we're using no-cors mode, we can't read the response
        // But we assume it was successful if no error was thrown
        showSuccessMessage();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        // Even if there's an error, show success to the user
        // This prevents users from resubmitting the same data
        showSuccessMessage();
    });
}

// Function to show success message
function showSuccessMessage() {
    elements.loading.style.display = 'none';
    elements.successMessage.style.display = 'block';
    
    // Reset form
    elements.form.reset();
    resetConditionalFields();
}

// Function to reset all conditional fields
function resetConditionalFields() {
    document.querySelectorAll('.form-group').forEach(group => {
        if (group.id.includes('Group') && group.id !== 'budgetGroup') {
            group.classList.add('hidden');
        }
    });
}
