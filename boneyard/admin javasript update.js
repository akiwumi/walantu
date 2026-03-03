// Add to the existing admin.js file

// In the initializeAdminNavigation function, add the new sections:
function initializeAdminNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active navigation button
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', 'true');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                    section.setAttribute('aria-hidden', 'false');
                    
                    // Load section-specific data
                    if (targetSection === 'accounting') {
                        loadAccountingData();
                    } else if (targetSection === 'crm') {
                        loadCRMData();
                    }
                }
            });

            announceToScreenReader(`Showing ${targetSection} section`);
        });
    });
}

// Add to the existing loadDashboardStats function:
function loadDashboardStats() {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    
    const totalJobs = allJobs.length;
    const pendingJobs = allJobs.filter(job => 
        job.status === 'assessment_scheduled' || job.status === 'quote_provided'
    ).length;
    const activeJobs = allJobs.filter(job => job.status === 'in_progress').length;
    const completedJobs = allJobs.filter(job => job.status === 'completed').length;
    
    // Calculate total revenue from payments
    const totalRevenue = allJobs.reduce((sum, job) => {
        return sum + (parseFloat(job.payment?.amount?.replace('GH₵ ', '') || 0));
    }, 0);
    
    // Update statistics
    updateElementText('total-jobs-count', totalJobs);
    updateElementText('pending-jobs-count', pendingJobs);
    updateElementText('active-jobs-count', activeJobs);
    updateElementText('completed-jobs-count', completedJobs);
    updateElementText('total-revenue', `GH₵ ${totalRevenue.toLocaleString()}`);
}