// profile.js - Handles user profile and job management

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadUserProfile();
    loadUserJobs();
    initializeJobFilters();
    initializeJobModal();
});

function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'registration.html';
        return;
    }
}

function loadUserProfile() {
    const userData = sessionStorage.getItem('userData');
    
    if (userData) {
        const data = JSON.parse(userData);
        
        // Update user information
        const fullNameElement = document.getElementById('user-full-name');
        const emailElement = document.getElementById('user-email');
        const phoneElement = document.getElementById('user-phone');
        const initialsElement = document.getElementById('user-initials');
        
        if (fullNameElement && data['full-name']) {
            fullNameElement.textContent = data['full-name'];
        }
        
        if (emailElement && data.email) {
            emailElement.textContent = data.email;
        }
        
        if (phoneElement && data.phone) {
            phoneElement.textContent = data.phone;
        }
        
        if (initialsElement && data['full-name']) {
            initialsElement.textContent = getInitials(data['full-name']);
        }
    }
}

function getInitials(fullName) {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
}

function loadUserJobs() {
    const jobsList = document.getElementById('jobs-list');
    const totalJobsElement = document.getElementById('total-jobs');
    const completedJobsElement = document.getElementById('completed-jobs');
    
    // Get jobs from session storage
    const jobs = JSON.parse(sessionStorage.getItem('userJobs') || '[]');
    
    if (jobs.length === 0) {
        jobsList.innerHTML = `
            <div class="empty-state">
                <h3>No Jobs Yet</h3>
                <p>You haven't booked any services yet. Get started with your first booking!</p>
                <a href="booking.html" class="cta-button">Book Your First Service</a>
            </div>
        `;
        return;
    }
    
    // Update stats
    if (totalJobsElement) {
        totalJobsElement.textContent = jobs.length;
    }
    
    const completedJobs = jobs.filter(job => job.status === 'completed').length;
    if (completedJobsElement) {
        completedJobsElement.textContent = completedJobs;
    }
    
    // Render jobs
    renderJobs(jobs);
}

function renderJobs(jobs) {
    const jobsList = document.getElementById('jobs-list');
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div class="no-jobs">No jobs match your filter</div>';
        return;
    }
    
    // Sort jobs by creation date (newest first)
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const jobsHTML = jobs.map(job => `
        <div class="job-card" data-job-id="${job.jobId}" data-status="${job.status}">
            <div class="job-header">
                <h3>${job.service}</h3>
                <span class="job-status ${job.status}" aria-label="Job status: ${formatStatus(job.status)}">
                    ${formatStatus(job.status)}
                </span>
            </div>
            <div class="job-details">
                <div class="job-info">
                    <span class="job-date">Booked: ${formatDate(job.createdAt)}</span>
                    <span class="job-location">${job.ghanapostgps || 'Location not specified'}</span>
                </div>
                <div class="job-actions">
                    <button class="view-details-btn" data-job-id="${job.jobId}" aria-label="View details for ${job.service} job">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    jobsList.innerHTML = jobsHTML;
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            showJobDetails(jobId);
        });
    });
}

function formatStatus(status) {
    const statusMap = {
        'assessment_scheduled': 'Assessment Scheduled',
        'assessment_completed': 'Assessment Completed',
        'quote_provided': 'Quote Provided',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function initializeJobFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter jobs
            filterJobs(filter);
            
            announceToScreenReader(`Showing ${filter} jobs`);
        });
    });
}

function filterJobs(filter) {
    const allJobs = JSON.parse(sessionStorage.getItem('userJobs') || '[]');
    let filteredJobs = allJobs;
    
    if (filter === 'active') {
        filteredJobs = allJobs.filter(job => job.status !== 'completed' && job.status !== 'cancelled');
    } else if (filter === 'completed') {
        filteredJobs = allJobs.filter(job => job.status === 'completed');
    }
    
    renderJobs(filteredJobs);
}

function initializeJobModal() {
    const modal = document.getElementById('job-modal');
    const closeButton = document.querySelector('.modal-close');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function showJobDetails(jobId) {
    const jobs = JSON.parse(sessionStorage.getItem('userJobs') || '[]');
    const job = jobs.find(j => j.jobId === jobId);
    
    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }
    
    const modal = document.getElementById('job-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = `Job: ${job.service}`;
    modalContent.innerHTML = generateJobDetailsHTML(job);
    
    // Show modal
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    // Trap focus in modal
    trapFocus(modal);
    
    announceToScreenReader(`Job details for ${job.service}`);
}

function generateJobDetailsHTML(job) {
    return `
        <div class="job-detail-section">
            <h3>Basic Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Job ID:</strong>
                    <span>${job.jobId}</span>
                </div>
                <div class="detail-item">
                    <strong>Service:</strong>
                    <span>${job.service}</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong>
                    <span class="status-badge ${job.status}">${formatStatus(job.status)}</span>
                </div>
                <div class="detail-item">
                    <strong>Booked Date:</strong>
                    <span>${formatDate(job.createdAt)}</span>
                </div>
            </div>
        </div>
        
        <div class="job-detail-section">
            <h3>Location Details</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Address:</strong>
                    <span>${job.address || 'Not specified'}</span>
                </div>
                <div class="detail-item">
                    <strong>GhanaPostGPS:</strong>
                    <span>${job.ghanapostgps || 'Not specified'}</span>
                </div>
            </div>
        </div>
        
        <div class="job-detail-section">
            <h3>Problem Description</h3>
            <p>${job.problem || 'No description provided'}</p>
        </div>
        
        <div class="job-detail-section">
            <h3>Schedule</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Assessment Date:</strong>
                    <span>${job.assessmentDate ? formatDate(job.assessmentDate) : 'Not scheduled'}</span>
                </div>
                <div class="detail-item">
                    <strong>Preferred Time:</strong>
                    <span>${job['preferred-time'] || 'Not specified'}</span>
                </div>
            </div>
        </div>
        
        ${job.payment ? `
        <div class="job-detail-section">
            <h3>Payment Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Payment Method:</strong>
                    <span>${job.payment.method === 'momo' ? 'Mobile Money' : 'Credit Card'}</span>
                </div>
                <div class="detail-item">
                    <strong>Amount Paid:</strong>
                    <span>${job.payment.amount}</span>
                </div>
                <div class="detail-item">
                    <strong>Transaction ID:</strong>
                    <span>${job.payment.transactionId}</span>
                </div>
            </div>
        </div>
        ` : ''}
        
        ${job.insurance && job.insurance !== 'none' ? `
        <div class="job-detail-section">
            <h3>Insurance</h3>
            <p>Extended ${job.insurance}-month insurance coverage included</p>
        </div>
        ` : ''}
        
        ${job.tradesperson ? `
        <div class="job-detail-section">
            <h3>Assigned Professional</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Name:</strong>
                    <span>${job.tradesperson.name}</span>
                </div>
                <div class="detail-item">
                    <strong>Contact:</strong>
                    <span>${job.tradesperson.phone}</span>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="job-actions-detail">
            <button class="cta-button" onclick="contactSupport('${job.jobId}')">Contact Support</button>
            ${job.status === 'quote_provided' ? 
              '<button class="cta-button secondary" onclick="approveQuote(\'' + job.jobId + '\')">Approve Quote</button>' : ''}
        </div>
    `;
}

function closeModal() {
    const modal = document.getElementById('job-modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        modal.addEventListener('keydown', function trapHandler(event) {
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
            
            if (event.key === 'Escape') {
                closeModal();
                modal.removeEventListener('keydown', trapHandler);
            }
        });
    }
}

function contactSupport(jobId) {
    // In a real application, this would open a support chat or email
    showNotification(`Contacting support for job ${jobId}. Support will assist you shortly.`);
}

function approveQuote(jobId) {
    // In a real application, this would update the job status
    showNotification(`Quote approved for job ${jobId}. Work will commence shortly.`);
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
window.showJobDetails = showJobDetails;
window.contactSupport = contactSupport;
window.approveQuote = approveQuote;

// Add profile page specific styles
const profileStyles = `
    .profile-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .profile-sidebar {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        height: fit-content;
    }
    
    .user-card h2 {
        margin-bottom: 1.5rem;
        color: var(--dark);
    }
    
    .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .user-avatar {
        width: 60px;
        height: 60px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.5rem;
    }
    
    .user-info h3 {
        margin-bottom: 0.25rem;
    }
    
    .user-info p {
        color: var(--gray);
        font-size: 0.9rem;
        margin: 0.25rem 0;
    }
    
    .user-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        text-align: center;
    }
    
    .stat-number {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary);
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: var(--gray);
    }
    
    .profile-content {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .jobs-filter {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #e0e0e0;
        background: white;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }
    
    .jobs-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .job-card {
        border: 1px solid #e0e0e0;
        border-radius: var(--border-radius);
        padding: 1.5rem;
        transition: box-shadow 0.3s ease;
    }
    
    .job-card:hover {
        box-shadow: var(--shadow);
    }
    
    .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .job-status {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .job-status.assessment_scheduled {
        background: #FFF3CD;
        color: #856404;
    }
    
    .job-status.completed {
        background: #D1ECF1;
        color: #0C5460;
    }
    
    .job-status.in_progress {
        background: #D4EDDA;
        color: #155724;
    }
    
    .job-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .job-info {
        display: flex;
        gap: 2rem;
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .view-details-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--gray);
    }
    
    .empty-state h3 {
        margin-bottom: 1rem;
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal.hidden {
        display: none;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .job-detail-section {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .job-detail-section:last-child {
        border-bottom: none;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
        width: fit-content;
    }
    
    .job-actions-detail {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
        .profile-layout {
            grid-template-columns: 1fr;
        }
        
        .detail-grid {
            grid-template-columns: 1fr;
        }
        
        .job-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .job-info {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .job-actions-detail {
            flex-direction: column;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = profileStyles;
document.head.appendChild(styleSheet);