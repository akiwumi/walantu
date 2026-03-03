// payment.js - Handles payment processing and order summary

document.addEventListener('DOMContentLoaded', function() {
    initializePaymentPage();
    initializePaymentTabs();
});

function initializePaymentPage() {
    // Load order summary from session storage
    loadOrderSummary();
    
    // Initialize payment form
    const paymentButton = document.getElementById('process-payment');
    if (paymentButton) {
        paymentButton.addEventListener('click', processPayment);
    }

    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'registration.html';
        return;
    }
}

function loadOrderSummary() {
    const orderDetails = document.getElementById('order-details');
    const totalAmount = document.getElementById('total-amount');
    
    // Get booking data from session storage
    const bookingData = sessionStorage.getItem('bookingData');
    const userData = sessionStorage.getItem('userData');
    
    if (bookingData && orderDetails) {
        const data = JSON.parse(bookingData);
        
        let summaryHTML = `
            <div class="order-item">
                <span>Service:</span>
                <span>${data.service || 'Not specified'}</span>
            </div>
            <div class="order-item">
                <span>Initial Assessment:</span>
                <span>GH₵ 50.00</span>
            </div>
        `;
        
        // Add insurance cost if selected
        let insuranceCost = 0;
        if (data.insurance && data.insurance !== 'none') {
            insuranceCost = getInsuranceCost(data.insurance);
            summaryHTML += `
                <div class="order-item">
                    <span>Extended Insurance:</span>
                    <span>GH₵ ${insuranceCost.toFixed(2)}</span>
                </div>
            `;
        }
        
        orderDetails.innerHTML = summaryHTML;
        
        // Calculate and display total
        const total = 50 + insuranceCost; // 50 for assessment + insurance
        if (totalAmount) {
            totalAmount.textContent = `GH₵ ${total.toFixed(2)}`;
        }
        
        // Store total in session storage for payment processing
        sessionStorage.setItem('orderTotal', total.toFixed(2));
    }
}

function getInsuranceCost(insuranceOption) {
    const costs = {
        'none': 0,
        '3': 50,
        '6': 80,
        '12': 120
    };
    return costs[insuranceOption] || 0;
}

function initializePaymentTabs() {
    const tabs = document.querySelectorAll('.payment-tab');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active tab
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Show corresponding form
            paymentForms.forEach(form => {
                form.classList.remove('active');
                form.setAttribute('aria-hidden', 'true');
                if (form.id === `${method}-payment`) {
                    form.classList.add('active');
                    form.setAttribute('aria-hidden', 'false');
                }
            });

            announceToScreenReader(`Selected ${method === 'momo' ? 'Mobile Money' : 'Credit Card'} payment method`);
        });

        // Keyboard navigation for tabs
        tab.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

function processPayment() {
    const activeTab = document.querySelector('.payment-tab.active');
    const paymentMethod = activeTab ? activeTab.getAttribute('data-method') : null;
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    if (validatePaymentForm(paymentMethod)) {
        // Process payment based on method
        if (paymentMethod === 'momo') {
            processMobileMoneyPayment();
        } else if (paymentMethod === 'card') {
            processCardPayment();
        }
    }
}

function validatePaymentForm(method) {
    let isValid = true;
    
    if (method === 'momo') {
        const network = document.getElementById('momo-network');
        const number = document.getElementById('momo-number');
        
        if (!network.value) {
            markFieldAsInvalid(network, 'Please select your mobile network');
            isValid = false;
        }
        
        if (!number.value) {
            markFieldAsInvalid(number, 'Please enter your mobile number');
            isValid = false;
        } else if (!isValidGhanaPhoneNumber(number.value)) {
            markFieldAsInvalid(number, 'Please enter a valid Ghanaian phone number');
            isValid = false;
        }
    } else if (method === 'card') {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCVV = document.getElementById('card-cvv');
        const cardName = document.getElementById('card-name');
        
        if (!cardNumber.value) {
            markFieldAsInvalid(cardNumber, 'Card number is required');
            isValid = false;
        } else if (!isValidCardNumber(cardNumber.value)) {
            markFieldAsInvalid(cardNumber, 'Please enter a valid card number');
            isValid = false;
        }
        
        if (!cardExpiry.value) {
            markFieldAsInvalid(cardExpiry, 'Expiry date is required');
            isValid = false;
        } else if (!isValidExpiryDate(cardExpiry.value)) {
            markFieldAsInvalid(cardExpiry, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }
        
        if (!cardCVV.value) {
            markFieldAsInvalid(cardCVV, 'CVV is required');
            isValid = false;
        } else if (!isValidCVV(cardCVV.value)) {
            markFieldAsInvalid(cardCVV, 'Please enter a valid CVV (3-4 digits)');
            isValid = false;
        }
        
        if (!cardName.value) {
            markFieldAsInvalid(cardName, 'Cardholder name is required');
            isValid = false;
        }
    }
    
    return isValid;
}

function isValidGhanaPhoneNumber(phone) {
    // Basic Ghana phone number validation
    const phoneRegex = /^(?:\+233|0)[234][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidCardNumber(number) {
    // Basic card number validation (Luhn algorithm would be used in production)
    const cleaned = number.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
}

function isValidExpiryDate(expiry) {
    const [month, year] = expiry.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function processMobileMoneyPayment() {
    const network = document.getElementById('momo-network').value;
    const number = document.getElementById('momo-number').value;
    const amount = sessionStorage.getItem('orderTotal');
    
    // Simulate payment processing
    showPaymentProcessing('Processing Mobile Money payment...');
    
    setTimeout(() => {
        // In a real application, this would integrate with Paystack/Flutterwave API
        simulatePaymentSuccess({
            method: 'momo',
            network: network,
            number: number,
            amount: amount,
            transactionId: generateTransactionId()
        });
    }, 3000);
}

function processCardPayment() {
    const cardNumber = document.getElementById('card-number').value;
    const amount = sessionStorage.getItem('orderTotal');
    
    // Simulate payment processing
    showPaymentProcessing('Processing card payment...');
    
    setTimeout(() => {
        // In a real application, this would integrate with payment gateway
        simulatePaymentSuccess({
            method: 'card',
            lastFour: cardNumber.slice(-4),
            amount: amount,
            transactionId: generateTransactionId()
        });
    }, 3000);
}

function showPaymentProcessing(message) {
    const processingDiv = document.createElement('div');
    processingDiv.className = 'payment-processing';
    processingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        text-align: center;
        min-width: 300px;
    `;
    processingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${message}</p>
    `;
    processingDiv.setAttribute('role', 'status');
    processingDiv.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(processingDiv);
    
    // Add loading spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Focus on processing dialog for screen readers
    processingDiv.focus();
}

function simulatePaymentSuccess(paymentDetails) {
    // Remove processing indicator
    const processing = document.querySelector('.payment-processing');
    if (processing) processing.remove();

    // Store payment details
    sessionStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
    
    // Create job record
    createJobRecord(paymentDetails);
    
    // Show success message and redirect
    showSuccessMessage('Payment successful! Redirecting to your profile...');
    
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

function generateTransactionId() {
    return 'TX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createJobRecord(paymentDetails) {
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    const jobRecord = {
        jobId: generateJobId(),
        ...bookingData,
        ...userData,
        payment: paymentDetails,
        status: 'assessment_scheduled',
        createdAt: new Date().toISOString(),
        assessmentDate: getNextBusinessDay(),
        tradesperson: null, // To be assigned
        parts: [],
        hoursWorked: 0,
        communications: [],
        inspectionReports: []
    };
    
    // Store job record
    let jobs = JSON.parse(sessionStorage.getItem('userJobs') || '[]');
    jobs.push(jobRecord);
    sessionStorage.setItem('userJobs', JSON.stringify(jobs));
    
    // Also store in all jobs for admin
    let allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    allJobs.push(jobRecord);
    sessionStorage.setItem('allJobs', JSON.stringify(allJobs));
}

function generateJobId() {
    return 'JOB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function getNextBusinessDay() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    
    // If it's Saturday, move to Monday
    if (date.getDay() === 6) date.setDate(date.getDate() + 2);
    // If it's Sunday, move to Monday
    if (date.getDay() === 0) date.setDate(date.getDate() + 1);
    
    return date.toISOString().split('T')[0];
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message global';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        z-index: 1001;
        box-shadow: var(--shadow);
        max-width: 300px;
    `;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

function showNotification(message, type = 'info') {
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

// Make functions available globally
window.processPayment = processPayment;