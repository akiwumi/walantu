// registration.js - Handles user registration and form validation

document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
    prefillRegistrationData();
});

function initializeRegistrationForm() {
    const form = document.getElementById('registration-form');
    const password = document.getElementById('reg-password');
    const confirmPassword = document.getElementById('reg-confirm-password');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateRegistrationForm()) {
            // Create user account and proceed to payment
            createUserAccount();
        }
    });

    // Real-time password confirmation validation
    confirmPassword.addEventListener('input', function() {
        validatePasswordMatch();
    });

    // Login link handler
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            showLoginModal();
        });
    }
}

function prefillRegistrationData() {
    // Prefill email from booking data if available
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
        const data = JSON.parse(bookingData);
        const emailField = document.getElementById('reg-email');
        if (data.email && emailField) {
            emailField.value = data.email;
        }
    }
}

function validateRegistrationForm() {
    let isValid = true;
    const form = document.getElementById('registration-form');
    const requiredFields = form.querySelectorAll('[required]');

    // Clear previous errors
    clearValidationErrors();

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markFieldAsInvalid(field, 'This field is required');
            isValid = false;
        }
    });

    // Validate email format
    const emailField = document.getElementById('reg-email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        markFieldAsInvalid(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password strength
    const passwordField = document.getElementById('reg-password');
    if (passwordField.value && passwordField.value.length < 8) {
        markFieldAsInvalid(passwordField, 'Password must be at least 8 characters long');
        isValid = false;
    }

    // Validate password match
    if (!validatePasswordMatch()) {
        isValid = false;
    }

    return isValid;
}

function validatePasswordMatch() {
    const password = document.getElementById('reg-password');
    const confirmPassword = document.getElementById('reg-confirm-password');
    
    if (password.value !== confirmPassword.value && confirmPassword.value) {
        markFieldAsInvalid(confirmPassword, 'Passwords do not match');
        return false;
    } else {
        markFieldAsValid(confirmPassword);
        return true;
    }
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

function createUserAccount() {
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData);
    
    // Get booking data
    const bookingData = sessionStorage.getItem('bookingData');
    
    // Combine user and booking data
    const completeData = {
        ...JSON.parse(bookingData),
        ...userData,
        userId: generateUserId(),
        registrationDate: new Date().toISOString()
    };
    
    // Save to sessionStorage (in real app, this would go to backend)
    sessionStorage.setItem('userData', JSON.stringify(completeData));
    sessionStorage.setItem('isLoggedIn', 'true');
    
    // Show success message and redirect to payment
    showSuccessMessage('Account created successfully! Redirecting to payment...');
    
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 2000);
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.style.cssText = `
        background: var(--success);
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        text-align: center;
    `;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    
    const form = document.getElementById('registration-form');
    form.parentNode.insertBefore(messageDiv, form);
}

function showLoginModal() {
    // In a real application, this would show a login modal
    // For now, we'll just show an alert
    alert('Login functionality would be implemented here. For demo purposes, please continue with registration.');
}

// Make functions available globally
window.validatePasswordMatch = validatePasswordMatch;