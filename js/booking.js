// booking.js - Handles the multi-step form and calendar functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingForm();
    initializeCalendar();
});

let currentStep = 1;

function initializeBookingForm() {
    // If a category was selected on the home page, pre-select it here
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (selectedCategory) {
        const radio = document.querySelector(`input[value="${selectedCategory}"]`);
        if (radio) {
            radio.checked = true;
            radio.closest('.category-card').classList.add('selected');
        }
    }

    // Form submission
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateStep(currentStep)) {
            // Save form data to sessionStorage or directly pass to registration
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            sessionStorage.setItem('bookingData', JSON.stringify(data));
            // Redirect to registration page
            window.location.href = 'registration.html';
        }
    });

    // Add event listeners to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                categoryCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
}

function nextStep(step) {
    if (validateStep(currentStep)) {
        document.getElementById(`step-${currentStep}`).classList.add('hidden');
        document.getElementById(`step-${step}`).classList.remove('hidden');
        currentStep = step;
        updateProgressIndicator();
        announceToScreenReader(`Step ${step} of 5`);
    }
}

function prevStep(step) {
    document.getElementById(`step-${currentStep}`).classList.add('hidden');
    document.getElementById(`step-${step}`).classList.remove('hidden');
    currentStep = step;
    updateProgressIndicator();
    announceToScreenReader(`Step ${step} of 5`);
}

function validateStep(step) {
    let isValid = true;
    const currentStepElement = document.getElementById(`step-${step}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markFieldAsInvalid(field, 'This field is required');
            isValid = false;
        } else {
            markFieldAsValid(field);
        }

        // Special validation for email
        if (field.type === 'email' && field.value) {
            if (!isValidEmail(field.value)) {
                markFieldAsInvalid(field, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Special validation for GhanaPostGPS
        if (field.name === 'ghanapostgps' && field.value) {
            if (!validateGhanaPostGPS(field.value)) {
                markFieldAsInvalid(field, 'Please enter a valid GhanaPostGPS code (e.g., GA-123-4567)');
                isValid = false;
            }
        }
    });

    // For step 1, check at least one service is selected
    if (step === 1) {
        const serviceSelected = document.querySelector('input[name="service"]:checked');
        if (!serviceSelected) {
            announceToScreenReader('Please select a service');
            isValid = false;
        }
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function markFieldAsInvalid(input, message) {
    input.classList.add('error');
    let errorMessage = input.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        input.parentNode.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
    input.setAttribute('aria-invalid', 'true');
}

function markFieldAsValid(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    input.setAttribute('aria-invalid', 'false');
}

function updateProgressIndicator() {
    // This function can update a progress bar if we add one
    const progress = document.getElementById('progress-indicator');
    if (progress) {
        progress.textContent = `Step ${currentStep} of 5`;
    }
}

// Calendar functionality
function initializeCalendar() {
    const currentMonthElement = document.getElementById('current-month');
    const calendarDaysElement = document.getElementById('calendar-days');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    let currentDate = new Date();

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthElement.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        // Days in month
        const daysInMonth = lastDay.getDate();
        // Starting day of the week (0 - Sunday, 1 - Monday, etc.)
        const startDay = firstDay.getDay();

        calendarDaysElement.innerHTML = '';

        // Day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            dayElement.setAttribute('aria-label', day);
            calendarDaysElement.appendChild(dayElement);
        });

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'calendar-day empty';
            emptyElement.setAttribute('aria-hidden', 'true');
            calendarDaysElement.appendChild(emptyElement);
        }

        // Days of the month
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.setAttribute('data-date', `${year}-${month + 1}-${day}`);
            dayElement.setAttribute('role', 'button');
            dayElement.setAttribute('tabindex', '0');
            dayElement.setAttribute('aria-label', `${day} ${currentDate.toLocaleString('default', { month: 'long' })} ${year}`);
            
            const cellDate = new Date(year, month, day);
            if (cellDate < today) {
                dayElement.classList.add('disabled');
                dayElement.setAttribute('aria-disabled', 'true');
            } else {
                dayElement.addEventListener('click', function() {
                    selectDate(this);
                });
                dayElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectDate(this);
                    }
                });
            }
            
            calendarDaysElement.appendChild(dayElement);
        }
    }

    function selectDate(dayElement) {
        if (dayElement.classList.contains('disabled')) return;

        // Remove selected class from all days
        const allDays = calendarDaysElement.querySelectorAll('.calendar-day:not(.header):not(.empty):not(.disabled)');
        allDays.forEach(day => {
            day.classList.remove('selected');
            day.setAttribute('aria-selected', 'false');
        });

        // Add selected class to clicked day
        dayElement.classList.add('selected');
        dayElement.setAttribute('aria-selected', 'true');

        // Store selected date in form data
        const selectedDate = dayElement.getAttribute('data-date');
        sessionStorage.setItem('selectedDate', selectedDate);
        
        announceToScreenReader(`Selected date: ${selectedDate}`);
    }

    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        announceToScreenReader(`Viewing ${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
    });

    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        announceToScreenReader(`Viewing ${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
    });

    // Keyboard navigation for calendar
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            prevMonthButton.click();
        } else if (event.key === 'ArrowRight') {
            nextMonthButton.click();
        }
    });

    renderCalendar();
}

// Make functions available globally for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;