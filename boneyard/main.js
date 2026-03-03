// Main JavaScript file for WALANTU Trade Services

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCategorySelection();
    initializeAccessibilityFeatures();
    initializeGhanaPostGPS();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('#main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && mainMenu.classList.contains('show')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainMenu.classList.remove('show');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainMenu.classList.contains('show')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainMenu.classList.remove('show');
                menuToggle.focus();
            }
        });
    }
}

// Category selection functionality
function initializeCategorySelection() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            categoryCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
            
            const category = this.querySelector('h3').textContent;
            // Store selected category for booking form
            sessionStorage.setItem('selectedCategory', category);
            
            // Announce selection to screen readers
            announceToScreenReader(`Selected ${category} service`);
        });

        // Keyboard navigation
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

// Accessibility features
function initializeAccessibilityFeatures() {
    // Add aria-labels to decorative icons
    const decorativeIcons = document.querySelectorAll('.category-icon');
    decorativeIcons.forEach(icon => {
        const category = icon.closest('.category-card').querySelector('h3').textContent;
        icon.setAttribute('aria-label', `${category} icon`);
    });

    // Handle focus trapping for modals (if any)
    initializeFocusTrap();
    
    // Initialize skip link
    initializeSkipLink();
}

// Focus trap for modals
function initializeFocusTrap() {
    const modals = document.querySelectorAll('[aria-modal="true"]');
    
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', function(event) {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    });
}

// Skip link functionality
function initializeSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                setTimeout(() => target.removeAttribute('tabindex'), 1000);
            }
        });
    }
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove announcement after it's been read
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

// Form validation utility
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            markFieldAsInvalid(input, 'This field is required');
            isValid = false;
        } else {
            markFieldAsValid(input);
        }
        
        // Special validation for email
        if (input.type === 'email' && input.value) {
            if (!isValidEmail(input.value)) {
                markFieldAsInvalid(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    return isValid;
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

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// GhanaPostGPS integration helper
function initializeGhanaPostGPS() {
    // This would integrate with GhanaPostGPS API
    // For demo purposes, we'll simulate the functionality
    const gpsInput = document.querySelector('#ghanapostgps');
    
    if (gpsInput) {
        gpsInput.addEventListener('blur', function() {
            validateGhanaPostGPS(this.value);
        });
        
        // Add input mask for GhanaPostGPS format
        gpsInput.addEventListener('input', function(event) {
            const value = event.target.value.toUpperCase();
            const cleaned = value.replace(/[^A-Z0-9-]/g, '');
            event.target.value = cleaned;
        });
    }
}

function validateGhanaPostGPS(code) {
    // Basic GhanaPostGPS format validation
    const gpsRegex = /^[A-Z]{2}-\d{3,4}-\d{3,4}$/;
    
    if (code && !gpsRegex.test(code)) {
        markFieldAsInvalid(document.querySelector('#ghanapostgps'), 
            'Please enter a valid GhanaPostGPS code (e.g., GA-123-4567)');
        return false;
    }
    
    return true;
}

// Utility function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS'
    }).format(amount);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        validateGhanaPostGPS,
        announceToScreenReader,
        formatDate,
        formatCurrency
    };
}