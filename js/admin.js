// admin.js - Comprehensive admin backend functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
    initializeAdminNavigation();
    initializeModals();
    loadDashboardStats();
    loadAllJobs();
    loadTradespeople();
    initializeFilters();
});

// Admin Dashboard Initialization
function initializeAdminDashboard() {
    // Check if user is admin (in real app, this would be proper authentication)
    const isAdmin = sessionStorage.getItem('isAdmin') || true; // For demo purposes
    
    if (!isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize event listeners
    document.getElementById('export-jobs')?.addEventListener('click', exportJobs);
    document.getElementById('refresh-jobs')?.addEventListener('click', loadAllJobs);
    document.getElementById('add-tradesperson')?.addEventListener('click', showAddTradespersonModal);
    document.getElementById('add-tradesperson-form')?.addEventListener('submit', handleAddTradesperson);
    document.getElementById('generate-report')?.addEventListener('click', generateReport);
    document.getElementById('export-report')?.addEventListener('click', exportReportData);
}

// Admin Navigation
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
                }
            });

            announceToScreenReader(`Showing ${targetSection} section`);
        });
    });
}

// Dashboard Statistics
function loadDashboardStats() {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    
    const totalJobs = allJobs.length;
    const pendingJobs = allJobs.filter(job => 
        job.status === 'assessment_scheduled' || job.status === 'quote_provided'
    ).length;
    const activeJobs = allJobs.filter(job => job.status === 'in_progress').length;
    const completedJobs = allJobs.filter(job => job.status === 'completed').length;
    
    // Update statistics
    updateElementText('total-jobs-count', totalJobs);
    updateElementText('pending-jobs-count', pendingJobs);
    updateElementText('active-jobs-count', activeJobs);
    updateElementText('completed-jobs-count', completedJobs);
}

// Jobs Management
function loadAllJobs() {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    const tableBody = document.getElementById('jobs-table-body');
    
    if (allJobs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">No jobs found</td>
            </tr>
        `;
        return;
    }
    
    // Sort jobs by creation date (newest first)
    allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const jobsHTML = allJobs.map(job => `
        <tr data-job-id="${job.jobId}">
            <td>${job.jobId}</td>
            <td>
                <div class="customer-info">
                    <strong>${job['full-name'] || 'N/A'}</strong>
                    <div class="customer-contact">
                        ${job.phone || ''} ${job.email ? `<br>${job.email}` : ''}
                    </div>
                </div>
            </td>
            <td>${job.service}</td>
            <td>
                <span class="status-badge ${job.status}" aria-label="Status: ${formatStatus(job.status)}">
                    ${formatStatus(job.status)}
                </span>
            </td>
            <td>${job.ghanapostgps || 'N/A'}</td>
            <td>${job.assessmentDate ? formatDate(job.assessmentDate) : 'Not scheduled'}</td>
            <td>
                ${job.tradesperson ? job.tradesperson.name : 
                  `<select class="assign-tradesperson" data-job-id="${job.jobId}" aria-label="Assign tradesperson to job ${job.jobId}">
                    <option value="">Assign...</option>
                    <!-- Tradespeople options will be populated -->
                  </select>`}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-job-id="${job.jobId}" title="View Details" aria-label="View details for job ${job.jobId}">👁️</button>
                    <button class="action-btn edit-btn" data-job-id="${job.jobId}" title="Edit Job" aria-label="Edit job ${job.jobId}">✏️</button>
                    ${job.status !== 'completed' && job.status !== 'cancelled' ? 
                      `<button class="action-btn status-btn" data-job-id="${job.jobId}" title="Update Status" aria-label="Update status for job ${job.jobId}">🔄</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = jobsHTML;
    
    // Populate tradespeople dropdowns and add event listeners
    populateTradespeopleDropdowns();
    initializeJobActionButtons();
}

function populateTradespeopleDropdowns() {
    const tradespeople = JSON.parse(sessionStorage.getItem('tradespeople') || '[]');
    const dropdowns = document.querySelectorAll('.assign-tradesperson');
    
    dropdowns.forEach(dropdown => {
        const jobId = dropdown.getAttribute('data-job-id');
        const currentTradesperson = getCurrentTradesperson(jobId);
        
        let optionsHTML = '<option value="">Assign...</option>';
        tradespeople.forEach(tp => {
            const selected = currentTradesperson && currentTradesperson.id === tp.id ? 'selected' : '';
            optionsHTML += `<option value="${tp.id}" ${selected}>${tp.name} (${tp.service})</option>`;
        });
        
        dropdown.innerHTML = optionsHTML;
        dropdown.addEventListener('change', function() {
            assignTradespersonToJob(jobId, this.value);
        });
    });
}

function getCurrentTradesperson(jobId) {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    const job = allJobs.find(j => j.jobId === jobId);
    return job ? job.tradesperson : null;
}

function assignTradespersonToJob(jobId, tradespersonId) {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    const tradespeople = JSON.parse(sessionStorage.getItem('tradespeople') || '[]');
    
    const jobIndex = allJobs.findIndex(job => job.jobId === jobId);
    const tradesperson = tradespeople.find(tp => tp.id === tradespersonId);
    
    if (jobIndex !== -1 && tradesperson) {
        allJobs[jobIndex].tradesperson = {
            id: tradesperson.id,
            name: tradesperson.name,
            phone: tradesperson.phone
        };
        
        // Add to job history
        if (!allJobs[jobIndex].history) {
            allJobs[jobIndex].history = [];
        }
        
        allJobs[jobIndex].history.push({
            action: 'tradesperson_assigned',
            timestamp: new Date().toISOString(),
            details: `Assigned ${tradesperson.name} to job`
        });
        
        sessionStorage.setItem('allJobs', JSON.stringify(allJobs));
        
        // Update user jobs as well
        updateUserJob(jobId, allJobs[jobIndex]);
        
        showNotification(`Assigned ${tradesperson.name} to job ${jobId}`, 'success');
        loadAllJobs(); // Refresh the table
    }
}

function updateUserJob(jobId, updatedJob) {
    let userJobs = JSON.parse(sessionStorage.getItem('userJobs') || '[]');
    const jobIndex = userJobs.findIndex(job => job.jobId === jobId);
    
    if (jobIndex !== -1) {
        userJobs[jobIndex] = { ...userJobs[jobIndex], ...updatedJob };
        sessionStorage.setItem('userJobs', JSON.stringify(userJobs));
    }
}

function initializeJobActionButtons() {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            showJobDetailsModal(jobId);
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            editJob(jobId);
        });
    });
    
    // Status buttons
    document.querySelectorAll('.status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            updateJobStatus(jobId);
        });
    });
}

// Job Details Modal
function showJobDetailsModal(jobId) {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    const job = allJobs.find(j => j.jobId === jobId);
    
    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }
    
    const modal = document.getElementById('job-details-modal');
    const modalTitle = document.getElementById('job-modal-title');
    const modalContent = document.getElementById('job-modal-content');
    
    modalTitle.textContent = `Job: ${job.service} - ${job.jobId}`;
    modalContent.innerHTML = generateJobDetailsTabs(job);
    
    // Initialize modal tabs
    initializeModalTabs();
    
    // Show modal
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
}

function generateJobDetailsTabs(job) {
    return `
        <div class="modal-tab-content active" id="overview-tab">
            ${generateOverviewTab(job)}
        </div>
        <div class="modal-tab-content" id="assessment-tab">
            ${generateAssessmentTab(job)}
        </div>
        <div class="modal-tab-content" id="parts-tab">
            ${generatePartsTab(job)}
        </div>
        <div class="modal-tab-content" id="timeline-tab">
            ${generateTimelineTab(job)}
        </div>
        <div class="modal-tab-content" id="inspection-tab">
            ${generateInspectionTab(job)}
        </div>
    `;
}

function generateOverviewTab(job) {
    return `
        <div class="detail-grid">
            <div class="detail-item">
                <strong>Customer Name:</strong>
                <span>${job['full-name'] || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <strong>Contact:</strong>
                <span>${job.phone || 'N/A'} ${job.email ? `<br>${job.email}` : ''}</span>
            </div>
            <div class="detail-item">
                <strong>National ID:</strong>
                <span>${job['national-id'] || 'N/A'}</span>
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
                <strong>Address:</strong>
                <span>${job.address || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <strong>GhanaPostGPS:</strong>
                <span>${job.ghanapostgps || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <strong>Problem Description:</strong>
                <span>${job.problem || 'No description provided'}</span>
            </div>
            <div class="detail-item">
                <strong>Insurance:</strong>
                <span>${job.insurance && job.insurance !== 'none' ? `${job.insurance} months extended` : 'Standard 3 months'}</span>
            </div>
        </div>
        
        ${job.tradesperson ? `
        <div class="assigned-tradesperson">
            <h4>Assigned Tradesperson</h4>
            <div class="tradesperson-info">
                <strong>${job.tradesperson.name}</strong>
                <div>Phone: ${job.tradesperson.phone}</div>
            </div>
        </div>
        ` : ''}
        
        ${job.payment ? `
        <div class="payment-info">
            <h4>Payment Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Amount:</strong>
                    <span>${job.payment.amount}</span>
                </div>
                <div class="detail-item">
                    <strong>Method:</strong>
                    <span>${job.payment.method === 'momo' ? 'Mobile Money' : 'Credit Card'}</span>
                </div>
                <div class="detail-item">
                    <strong>Transaction ID:</strong>
                    <span>${job.payment.transactionId}</span>
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

function generateAssessmentTab(job) {
    const assessment = job.assessment || {};
    
    return `
        <div class="assessment-form">
            <div class="form-group">
                <label for="assessment-notes" class="form-label">Assessment Notes</label>
                <textarea id="assessment-notes" class="form-control form-textarea">${assessment.notes || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="estimated-hours" class="form-label">Estimated Hours</label>
                <input type="number" id="estimated-hours" class="form-control" value="${assessment.estimatedHours || ''}" min="1">
            </div>
            
            <div class="form-group">
                <label for="estimated-cost" class="form-label">Estimated Cost (GH₵)</label>
                <input type="number" id="estimated-cost" class="form-control" value="${assessment.estimatedCost || ''}" min="0" step="0.01">
            </div>
            
            <div class="form-group">
                <label for="recommended-parts" class="form-label">Recommended Parts</label>
                <textarea id="recommended-parts" class="form-control form-textarea">${assessment.recommendedParts || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="cta-button" onclick="saveAssessment('${job.jobId}')">Save Assessment</button>
            </div>
        </div>
        
        ${assessment.completed ? `
        <div class="existing-assessment">
            <h4>Existing Assessment</h4>
            <div class="assessment-details">
                <p><strong>Completed:</strong> ${formatDate(assessment.completedDate)}</p>
                <p><strong>By:</strong> ${assessment.assessedBy || 'Unknown'}</p>
            </div>
        </div>
        ` : ''}
    `;
}

function generatePartsTab(job) {
    const parts = job.parts || [];
    
    return `
        <div class="parts-management">
            <h4>Parts & Materials Used</h4>
            
            <div class="parts-list">
                ${parts.length > 0 ? parts.map(part => `
                    <div class="part-item">
                        <div class="part-info">
                            <strong>${part.name}</strong>
                            <div>Quantity: ${part.quantity} | Cost: GH₵ ${part.cost}</div>
                            <div>Supplier: ${part.supplier}</div>
                        </div>
                        <button class="action-btn delete-btn" onclick="removePart('${job.jobId}', '${part.id}')" aria-label="Remove part ${part.name}">🗑️</button>
                    </div>
                `).join('') : '<p>No parts recorded yet</p>'}
            </div>
            
            <div class="add-part-form">
                <h5>Add New Part</h5>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="part-name" class="form-control" placeholder="Part name">
                    </div>
                    <div class="form-group">
                        <input type="number" id="part-quantity" class="form-control" placeholder="Qty" min="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="number" id="part-cost" class="form-control" placeholder="Cost (GH₵)" step="0.01" min="0">
                    </div>
                    <div class="form-group">
                        <input type="text" id="part-supplier" class="form-control" placeholder="Supplier">
                    </div>
                </div>
                <button type="button" class="cta-button" onclick="addPart('${job.jobId}')">Add Part</button>
            </div>
        </div>
    `;
}

function generateTimelineTab(job) {
    const history = job.history || [];
    
    return `
        <div class="timeline">
            ${history.length > 0 ? history.map(event => `
                <div class="timeline-event">
                    <div class="timeline-date">${formatDateTime(event.timestamp)}</div>
                    <div class="timeline-content">
                        <strong>${event.action.replace('_', ' ').toUpperCase()}</strong>
                        <p>${event.details || ''}</p>
                    </div>
                </div>
            `).join('') : '<p>No timeline events recorded</p>'}
        </div>
        
        <div class="add-timeline-event">
            <h5>Add Timeline Event</h5>
            <div class="form-group">
                <input type="text" id="timeline-action" class="form-control" placeholder="Action (e.g., site_visit, quote_sent)">
            </div>
            <div class="form-group">
                <textarea id="timeline-details" class="form-control form-textarea" placeholder="Event details"></textarea>
            </div>
            <button type="button" class="cta-button" onclick="addTimelineEvent('${job.jobId}')">Add Event</button>
        </div>
    `;
}

function generateInspectionTab(job) {
    const inspection = job.inspection || {};
    
    return `
        <div class="inspection-management">
            <div class="form-group">
                <label for="inspection-notes" class="form-label">Inspection Notes</label>
                <textarea id="inspection-notes" class="form-control form-textarea">${inspection.notes || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="inspection-result" class="form-label">Inspection Result</label>
                <select id="inspection-result" class="form-control">
                    <option value="">Select result</option>
                    <option value="passed" ${inspection.result === 'passed' ? 'selected' : ''}>Passed</option>
                    <option value="failed" ${inspection.result === 'failed' ? 'selected' : ''}>Failed</option>
                    <option value="conditional" ${inspection.result === 'conditional' ? 'selected' : ''}>Conditional Pass</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Before Photos</label>
                <div class="photo-upload-area" id="before-photos">
                    ${generatePhotoPlaceholders('before', inspection.beforePhotos || [])}
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">After Photos</label>
                <div class="photo-upload-area" id="after-photos">
                    ${generatePhotoPlaceholders('after', inspection.afterPhotos || [])}
                </div>
            </div>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="customer-satisfied" ${inspection.customerSatisfied ? 'checked' : ''}>
                    <span>Customer satisfied with work</span>
                </label>
            </div>
            
            ${inspection.customerSignature ? `
            <div class="signature-section">
                <h4>Customer Signature</h4>
                <div class="signature-display">
                    <img src="${inspection.customerSignature}" alt="Customer signature" style="max-width: 200px; border: 1px solid #ccc;">
                </div>
            </div>
            ` : ''}
            
            <div class="form-actions">
                <button type="button" class="cta-button" onclick="saveInspection('${job.jobId}')">Save Inspection</button>
                <button type="button" class="cta-button secondary" onclick="completeJob('${job.jobId}')">Mark Job Complete</button>
            </div>
        </div>
    `;
}

function generatePhotoPlaceholders(type, photos) {
    if (photos.length > 0) {
        return photos.map(photo => `
            <div class="photo-thumbnail">
                <img src="${photo}" alt="${type} photo" style="max-width: 100px; max-height: 100px;">
            </div>
        `).join('');
    }
    
    return `
        <div class="photo-placeholder">
            <span>+ Upload ${type} photo</span>
            <input type="file" accept="image/*" class="photo-upload-input" data-type="${type}" multiple aria-label="Upload ${type} photos">
        </div>
    `;
}

// Modal Tabs
function initializeModalTabs() {
    const tabButtons = document.querySelectorAll('.modal-tab');
    const tabContents = document.querySelectorAll('.modal-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Show target tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                    content.setAttribute('aria-hidden', 'false');
                }
            });

            announceToScreenReader(`Showing ${targetTab} tab`);
        });
    });
}

// Tradespeople Management
function loadTradespeople() {
    const tradespeople = JSON.parse(sessionStorage.getItem('tradespeople') || '[]');
    const tradespeopleGrid = document.getElementById('tradespeople-grid');
    
    if (tradespeople.length === 0) {
        // Add some demo tradespeople
        const demoTradespeople = [
            { id: 'tp1', name: 'Kwame Asante', service: 'Plumber', phone: '+233 24 111 1111', email: 'kwame@example.com', experience: 5 },
            { id: 'tp2', name: 'Ama Mensah', service: 'Electrician', phone: '+233 24 222 2222', email: 'ama@example.com', experience: 3 },
            { id: 'tp3', name: 'Kofi Appiah', service: 'Carpenter', phone: '+233 24 333 3333', email: 'kofi@example.com', experience: 7 }
        ];
        
        sessionStorage.setItem('tradespeople', JSON.stringify(demoTradespeople));
        loadTradespeople(); // Reload with demo data
        return;
    }
    
    const tradespeopleHTML = tradespeople.map(tp => `
        <div class="tradesperson-card">
            <div class="tradesperson-info">
                <h3>${tp.name}</h3>
                <div class="tradesperson-details">
                    <span class="service-badge">${tp.service}</span>
                    <div>${tp.experience} years experience</div>
                    <div>${tp.phone}</div>
                    <div>${tp.email}</div>
                </div>
            </div>
            <div class="tradesperson-stats">
                <div class="stat">Assigned: <strong>${getAssignedJobsCount(tp.id)}</strong></div>
                <div class="stat">Completed: <strong>${getCompletedJobsCount(tp.id)}</strong></div>
            </div>
            <div class="tradesperson-actions">
                <button class="action-btn" onclick="editTradesperson('${tp.id}')" title="Edit" aria-label="Edit ${tp.name}">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteTradesperson('${tp.id}')" title="Delete" aria-label="Delete ${tp.name}">🗑️</button>
            </div>
        </div>
    `).join('');
    
    tradespeopleGrid.innerHTML = tradespeopleHTML;
}

function getAssignedJobsCount(tradespersonId) {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    return allJobs.filter(job => job.tradesperson && job.tradesperson.id === tradespersonId).length;
}

function getCompletedJobsCount(tradespersonId) {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    return allJobs.filter(job => 
        job.tradesperson && 
        job.tradesperson.id === tradespersonId && 
        job.status === 'completed'
    ).length;
}

function showAddTradespersonModal() {
    const modal = document.getElementById('add-tradesperson-modal');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
}

function handleAddTradesperson(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const tradespeople = JSON.parse(sessionStorage.getItem('tradespeople') || '[]');
    
    const newTradesperson = {
        id: 'tp_' + Date.now(),
        name: document.getElementById('tradesperson-name').value,
        email: document.getElementById('tradesperson-email').value,
        phone: document.getElementById('tradesperson-phone').value,
        service: document.getElementById('tradesperson-service').value,
        experience: parseInt(document.getElementById('tradesperson-experience').value),
        joinDate: new Date().toISOString()
    };
    
    tradespeople.push(newTradesperson);
    sessionStorage.setItem('tradespeople', JSON.stringify(tradespeople));
    
    // Close modal and refresh
    document.getElementById('add-tradesperson-modal').classList.add('hidden');
    event.target.reset();
    loadTradespeople();
    
    showNotification(`Added ${newTradesperson.name} to tradespeople`, 'success');
}

// Filters
function initializeFilters() {
    const statusFilter = document.getElementById('status-filter');
    const serviceFilter = document.getElementById('service-filter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterJobs);
    }
    
    if (serviceFilter) {
        serviceFilter.addEventListener('change', filterJobs);
    }
}

function filterJobs() {
    const statusFilter = document.getElementById('status-filter').value;
    const serviceFilter = document.getElementById('service-filter').value;
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    
    let filteredJobs = allJobs;
    
    if (statusFilter !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
    }
    
    if (serviceFilter !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.service === serviceFilter);
    }
    
    renderFilteredJobs(filteredJobs);
}

function renderFilteredJobs(jobs) {
    const tableBody = document.getElementById('jobs-table-body');
    
    if (jobs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">No jobs match the selected filters</td>
            </tr>
        `;
        return;
    }
    
    const jobsHTML = jobs.map(job => `
        <tr data-job-id="${job.jobId}">
            <td>${job.jobId}</td>
            <td>${job['full-name'] || 'N/A'}</td>
            <td>${job.service}</td>
            <td><span class="status-badge ${job.status}">${formatStatus(job.status)}</span></td>
            <td>${job.ghanapostgps || 'N/A'}</td>
            <td>${job.assessmentDate ? formatDate(job.assessmentDate) : 'Not scheduled'}</td>
            <td>${job.tradesperson ? job.tradesperson.name : 'Unassigned'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-job-id="${job.jobId}">👁️</button>
                    <button class="action-btn edit-btn" data-job-id="${job.jobId}">✏️</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = jobsHTML;
    initializeJobActionButtons();
}

// Reports
function generateReport() {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    
    // Calculate metrics
    const totalRevenue = allJobs.reduce((sum, job) => {
        return sum + (parseFloat(job.payment?.amount?.replace('GH₵ ', '') || 0));
    }, 0);
    
    const avgCompletionTime = calculateAverageCompletionTime(allJobs);
    const customerSatisfaction = calculateCustomerSatisfaction(allJobs);
    const repeatCustomers = calculateRepeatCustomers(allJobs);
    
    // Update metrics display
    updateElementText('avg-completion-time', avgCompletionTime);
    updateElementText('customer-satisfaction', customerSatisfaction + '%');
    updateElementText('repeat-customers', repeatCustomers + '%');
    
    showNotification('Report generated successfully', 'success');
}

function calculateAverageCompletionTime(jobs) {
    const completedJobs = jobs.filter(job => job.status === 'completed');
    if (completedJobs.length === 0) return 0;
    
    const totalDays = completedJobs.reduce((sum, job) => {
        const start = new Date(job.createdAt);
        const end = new Date(job.completedAt || job.updatedAt || new Date());
        const days = (end - start) / (1000 * 60 * 60 * 24);
        return sum + days;
    }, 0);
    
    return Math.round(totalDays / completedJobs.length);
}

function calculateCustomerSatisfaction(jobs) {
    const completedJobs = jobs.filter(job => job.status === 'completed');
    if (completedJobs.length === 0) return 0;
    
    const satisfiedJobs = completedJobs.filter(job => 
        job.inspection?.customerSatisfied === true
    );
    
    return Math.round((satisfiedJobs.length / completedJobs.length) * 100);
}

function calculateRepeatCustomers(jobs) {
    const customers = {};
    
    jobs.forEach(job => {
        const email = job.email;
        if (email) {
            customers[email] = (customers[email] || 0) + 1;
        }
    });
    
    const repeatCustomers = Object.values(customers).filter(count => count > 1).length;
    const totalCustomers = Object.keys(customers).length;
    
    return totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;
}

function exportReportData() {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    const csvContent = convertToCSV(allJobs);
    downloadCSV(csvContent, 'walantu-jobs-report.csv');
}

function convertToCSV(jobs) {
    const headers = ['Job ID', 'Customer', 'Service', 'Status', 'Location', 'Amount', 'Created Date'];
    const rows = jobs.map(job => [
        job.jobId,
        job['full-name'] || '',
        job.service,
        job.status,
        job.ghanapostgps || '',
        job.payment?.amount || '',
        formatDate(job.createdAt)
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Utility Functions
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB');
}

function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = text;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        color: white;
        z-index: 10000;
        box-shadow: var(--shadow);
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--success)';
    } else if (type === 'error') {
        notification.style.background = 'var(--warning)';
    } else {
        notification.style.background = 'var(--primary)';
    }
    
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Initialize modals
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        }
    });
}

// Focus trap for modals
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        const trapHandler = function(event) {
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
        };
        
        modal.addEventListener('keydown', trapHandler);
        
        // Store the handler for later removal
        modal._trapHandler = trapHandler;
    }
}

// Export jobs function
function exportJobs() {
    const allJobs = JSON.parse(sessionStorage.getItem('allJobs') || '[]');
    const csvContent = convertToCSV(allJobs);
    downloadCSV(csvContent, 'walantu-jobs-export.csv');
}

// Placeholder functions for unimplemented features
function saveAssessment(jobId) { 
    showNotification('Assessment saved successfully', 'success'); 
}

function addPart(jobId) { 
    showNotification('Part added successfully', 'success'); 
}

function removePart(jobId, partId) { 
    showNotification('Part removed successfully', 'success'); 
}

function addTimelineEvent(jobId) { 
    showNotification('Timeline event added', 'success'); 
}

function saveInspection(jobId) { 
    showNotification('Inspection saved successfully', 'success'); 
}

function completeJob(jobId) { 
    showNotification('Job marked as complete', 'success'); 
}

function editJob(jobId) { 
    showNotification('Edit job functionality would open here', 'info'); 
}

function updateJobStatus(jobId) { 
    showNotification('Update status functionality would open here', 'info'); 
}

function editTradesperson(tradespersonId) { 
    showNotification('Edit tradesperson functionality would open here', 'info'); 
}

function deleteTradesperson(tradespersonId) { 
    if (confirm('Are you sure you want to delete this tradesperson?')) {
        showNotification('Tradesperson deleted successfully', 'success'); 
    }
}

// Make functions available globally
window.saveAssessment = saveAssessment;
window.addPart = addPart;
window.removePart = removePart;
window.addTimelineEvent = addTimelineEvent;
window.saveInspection = saveInspection;
window.completeJob = completeJob;
window.editJob = editJob;
window.updateJobStatus = updateJobStatus;
window.editTradesperson = editTradesperson;
window.deleteTradesperson = deleteTradesperson;

// Add admin-specific CSS
const adminStyles = `
    .admin-header {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        margin-bottom: 2rem;
    }
    
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .stat-card {
        background: var(--light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        text-align: center;
    }
    
    .stat-card .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: var(--primary);
        display: block;
    }
    
    .stat-card .stat-label {
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .admin-nav {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .admin-nav-btn {
        padding: 0.75rem 1.5rem;
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .admin-nav-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }
    
    .admin-section {
        display: none;
    }
    
    .admin-section.active {
        display: block;
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .filters-bar {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        align-items: end;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .filter-group label {
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .jobs-table-container {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow);
    }
    
    .admin-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .admin-table th,
    .admin-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .admin-table th {
        background: var(--light);
        font-weight: 600;
    }
    
    .customer-info strong {
        display: block;
    }
    
    .customer-contact {
        font-size: 0.8rem;
        color: var(--gray);
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .status-badge.assessment_scheduled {
        background: #FFF3CD;
        color: #856404;
    }
    
    .status-badge.assessment_completed {
        background: #D1ECF1;
        color: #0C5460;
    }
    
    .status-badge.quote_provided {
        background: #CCE5FF;
        color: #004085;
    }
    
    .status-badge.in_progress {
        background: #D4EDDA;
        color: #155724;
    }
    
    .status-badge.completed {
        background: #D1ECF1;
        color: #0C5460;
    }
    
    .status-badge.cancelled {
        background: #F8D7DA;
        color: #721C24;
    }
    
    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.3s ease;
    }
    
    .action-btn:hover {
        background: var(--light);
    }
    
    .assign-tradesperson {
        padding: 0.25rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
    }
    
    .no-data {
        text-align: center;
        padding: 2rem;
        color: var(--gray);
    }
    
    /* Tradespeople Grid */
    .tradespeople-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .tradesperson-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
    }
    
    .tradesperson-info h3 {
        margin-bottom: 0.5rem;
    }
    
    .tradesperson-details {
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .service-badge {
        background: var(--primary);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .tradesperson-stats {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        padding: 1rem 0;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .tradesperson-stats .stat {
        font-size: 0.9rem;
    }
    
    .tradesperson-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }
    
    /* Reports Dashboard */
    .reports-dashboard {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }
    
    .report-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
    }
    
    .report-card:first-child {
        grid-column: 1 / -1;
    }
    
    .chart-placeholder {
        height: 200px;
        background: var(--light);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gray);
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
    }
    
    .metric {
        text-align: center;
    }
    
    .metric-value {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary);
    }
    
    .metric-label {
        font-size: 0.8rem;
        color: var(--gray);
    }
    
    /* Modal Styles */
    .modal-content.large {
        max-width: 800px;
        max-height: 90vh;
    }
    
    .modal-tabs {
        display: flex;
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 1.5rem;
    }
    
    .modal-tab {
        padding: 0.75rem 1.5rem;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
    }
    
    .modal-tab.active {
        border-bottom-color: var(--primary);
        color: var(--primary);
        font-weight: 600;
    }
    
    .modal-tab-content {
        display: none;
    }
    
    .modal-tab-content.active {
        display: block;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
    }
    
    .detail-item strong {
        margin-bottom: 0.25rem;
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .parts-list {
        margin-bottom: 1.5rem;
    }
    
    .part-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
    }
    
    .part-info div {
        font-size: 0.9rem;
        color: var(--gray);
    }
    
    .add-part-form {
        background: var(--light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
    }
    
    .timeline {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 1.5rem;
    }
    
    .timeline-event {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .timeline-date {
        min-width: 150px;
        font-size: 0.8rem;
        color: var(--gray);
    }
    
    .timeline-content strong {
        text-transform: capitalize;
    }
    
    .photo-upload-area {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .photo-placeholder {
        width: 100px;
        height: 100px;
        border: 2px dashed #e0e0e0;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    
    .photo-thumbnail {
        width: 100px;
        height: 100px;
        border: 1px solid #e0e0e0;
        border-radius: var(--border-radius);
        overflow: hidden;
    }
    
    .photo-upload-input {
        display: none;
    }
    
    .signature-display {
        padding: 1rem;
        background: var(--light);
        border-radius: var(--border-radius);
        text-align: center;
    }
    
    @media (max-width: 768px) {
        .admin-stats {
            grid-template-columns: 1fr 1fr;
        }
        
        .filters-bar {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-group {
            flex-direction: row;
            align-items: center;
        }
        
        .filter-group label {
            min-width: 100px;
        }
        
        .reports-dashboard {
            grid-template-columns: 1fr;
        }
        
        .metrics-grid {
            grid-template-columns: 1fr;
        }
        
        .detail-grid {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .admin-table {
            font-size: 0.8rem;
        }
        
        .admin-table th,
        .admin-table td {
            padding: 0.5rem;
        }
    }
`;

// Inject admin styles
const adminStyleSheet = document.createElement('style');
adminStyleSheet.textContent = adminStyles;
document.head.appendChild(adminStyleSheet);

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

