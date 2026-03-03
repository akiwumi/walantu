// Main JavaScript for WALANTU - Copenhagen Theme

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCategoryCards();
    initializeAccessibility();
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav') && !event.target.closest('.mobile-menu-toggle') && nav.classList.contains('show')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('show');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && nav.classList.contains('show')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('show');
                menuToggle.focus();
            }
        });
    }
}

// Category Cards Functionality
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card[data-service]');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // If it's a navigation card (not in form), handle service selection
            if (this.hasAttribute('data-service') && !this.querySelector('input')) {
                event.preventDefault();
                const service = this.getAttribute('data-service');
                selectService(service);
                
                // Scroll to booking form if on booking page
                const bookingForm = document.getElementById('booking-form');
                if (bookingForm) {
                    bookingForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function selectService(service) {
    // Set service in session storage
    sessionStorage.setItem('selectedService', service);
    
    // If on booking page, pre-select the radio button
    const radioButton = document.querySelector(`input[value="${service}"]`);
    if (radioButton) {
        radioButton.checked = true;
        
        // Update visual selection
        const allCards = document.querySelectorAll('.category-card');
        allCards.forEach(card => card.classList.remove('selected'));
        
        const selectedCard = radioButton.closest('.category-card');
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }
    
    announceToScreenReader(`Selected ${service} service`);
}

// Accessibility Features
function initializeAccessibility() {
    // Add aria-labels to decorative icons
    const categoryIcons = document.querySelectorAll('.category-icon');
    categoryIcons.forEach(icon => {
        const category = icon.closest('.category-card').querySelector('.category-title').textContent;
        icon.setAttribute('aria-label', `${category} icon`);
    });

    // Initialize skip link
    initializeSkipLink();
}

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

// Utility Functions
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}