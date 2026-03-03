// contact.js - Handles contact form and FAQ functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
});

function initializeContactForm() {
    const form = document.getElementById('enquiry-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        });
    }
}

function validateContactForm() {
    const form = document.getElementById('enquiry-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    clearValidationErrors();
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markFieldAsInvalid(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('enquiry-email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        markFieldAsInvalid(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone number
    const phoneField = document.getElementById('enquiry-phone');
    if (phoneField.value && !isValidGhanaPhoneNumber(phoneField.value)) {
        markFieldAsInvalid(phoneField, 'Please enter a valid Ghanaian phone number');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidGhanaPhoneNumber(phone) {
    // Basic Ghana phone number validation
    const phoneRegex = /^(?:\+233|0)[234][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function markFieldAsInvalid(input, message) {
    input.classList.add('error');
    let errorMessage = input.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = 'color: var(--warning); font-size: 0.8rem; margin-top: 0.25rem;';
        input.parentNode.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
    input.setAttribute('aria-invalid', 'true');
}

function clearValidationErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    });
}

function submitContactForm() {
    const form = document.getElementById('enquiry-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
        // Store enquiry in session storage (in real app, send to backend)
        let enquiries = JSON.parse(sessionStorage.getItem('enquiries') || '[]');
        enquiries.push({
            ...data,
            id: 'ENQ_' + Date.now(),
            timestamp: new Date().toISOString(),
            status: 'new'
        });
        sessionStorage.setItem('enquiries', JSON.stringify(enquiries));
        
        // Show success message
        showNotification('Your message has been sent successfully! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function initializeFAQ() {
    // Add accessibility enhancements to FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isOpen = item.hasAttribute('open');
            const action = isOpen ? 'collapsed' : 'expanded';
            announceToScreenReader(`FAQ item ${action}`);
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.hasAttribute('open') ? item.removeAttribute('open') : item.setAttribute('open', 'open');
            }
        });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--warning)' : 'var(--primary)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        z-index: 1001;
        box-shadow: var(--shadow);
        max-width: 300px;
    `;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Screen Reader Announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}