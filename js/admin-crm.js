// admin-crm.js - Comprehensive CRM, Accounting, and Analytics functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeCRM();
    initializeAccounting();
    initializeAnalytics();
});

// CRM Initialization
function initializeCRM() {
    initializeCRMTabs();
    initializeAccountingTabs();
    loadCRMData();
    loadAccountingData();
    
    // Event listeners for export buttons
    document.getElementById('export-financials')?.addEventListener('click', exportFinancialData);
    document.getElementById('export-crm')?.addEventListener('click', exportCRMData);
    document.getElementById('refresh-financials')?.addEventListener('click', loadAccountingData);
    document.getElementById('refresh-crm')?.addEventListener('click', loadCRMData);
}

function initializeCRMTabs() {
    const tabs = document.querySelectorAll('.crm-tab');
    const contents = document.querySelectorAll('.crm-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Show target content
            contents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                    content.setAttribute('aria-hidden', 'false');
                }
            });
        });
    });
}

function initializeAccountingTabs() {
    const tabs = document.querySelectorAll('.accounting-tab');
    const contents = document.querySelectorAll('.accounting-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Show target content
            contents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                    content.setAttribute('aria-hidden', 'false');
                }
            });
        });
    });
}

// Accounting Data Management
async function loadAccountingData() {
    try {
        // In a real application, this would fetch from a backend API
        const accountingData = await simulateAccountingDataFetch();
        
        updateFinancialOverview(accountingData.financialOverview);
        updateTransactionsTable(accountingData.transactions);
        updateTaxBreakdown(accountingData.taxBreakdown);
        updatePayoutsTable(accountingData.payouts);
        updateInsuranceRevenue(accountingData.insurance);
        
    } catch (error) {
        console.error('Error loading accounting data:', error);
        showNotification('Failed to load accounting data', 'error');
    }
}

function updateFinancialOverview(data) {
    updateElementText('total-revenue-amount', `GH₵ ${data.totalRevenue.toLocaleString()}`);
    updateElementText('vat-collected', `GH₵ ${data.vatCollected.toLocaleString()}`);
    updateElementText('service-tax', `GH₵ ${data.serviceTax.toLocaleString()}`);
    updateElementText('net-profit', `GH₵ ${data.netProfit.toLocaleString()}`);
}

function updateTransactionsTable(transactions) {
    const tableBody = document.getElementById('transactions-table');
    
    if (transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="no-data">No transactions found</td></tr>';
        return;
    }
    
    const transactionsHTML = transactions.map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.jobId}</td>
            <td>${transaction.customer}</td>
            <td>GH₵ ${transaction.amount.toLocaleString()}</td>
            <td>GH₵ ${transaction.vat.toLocaleString()}</td>
            <td>GH₵ ${transaction.serviceTax.toLocaleString()}</td>
            <td>GH₵ ${transaction.net.toLocaleString()}</td>
            <td><span class="payment-method ${transaction.method}">${transaction.method === 'momo' ? 'Mobile Money' : 'Card'}</span></td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = transactionsHTML;
}

function updateTaxBreakdown(taxData) {
    updateElementText('vat-standard', `GH₵ ${taxData.vatStandard.toLocaleString()}`);
    updateElementText('vat-total', `GH₵ ${taxData.vatTotal.toLocaleString()}`);
    updateElementText('service-levy', `GH₵ ${taxData.serviceLevy.toLocaleString()}`);
    updateElementText('service-tax-total', `GH₵ ${taxData.serviceTaxTotal.toLocaleString()}`);
}

function updatePayoutsTable(payouts) {
    const tableBody = document.getElementById('payouts-table');
    
    if (payouts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No payout data found</td></tr>';
        return;
    }
    
    const payoutsHTML = payouts.map((payout, index) => `
        <tr>
            <td>${payout.worker}</td>
            <td>${payout.service}</td>
            <td>${payout.jobsCompleted}</td>
            <td>GH₵ ${payout.baseSalary.toLocaleString()}</td>
            <td>GH₵ ${payout.bonus.toLocaleString()}</td>
            <td><strong>GH₵ ${payout.totalPayout.toLocaleString()}</strong></td>
            <td>${payout.month}</td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = payoutsHTML;
}

function updateInsuranceRevenue(insuranceData) {
    updateElementText('total-insurance', `GH₵ ${insuranceData.totalRevenue.toLocaleString()}`);
    updateElementText('active-policies', insuranceData.activePolicies);
    updateElementText('claims-filed', insuranceData.claimsFiled);
    
    const tableBody = document.getElementById('insurance-table');
    const insuranceHTML = insuranceData.policies.map(policy => `
        <tr>
            <td>${policy.jobId}</td>
            <td>${policy.customer}</td>
            <td>${policy.duration} months</td>
            <td>${policy.duration} months</td>
            <td>GH₵ ${policy.premium.toLocaleString()}</td>
            <td><span class="status-badge ${policy.status}">${policy.status}</span></td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = insuranceHTML;
}

// CRM Data Management
async function loadCRMData() {
    try {
        const crmData = await simulateCRMDataFetch();
        
        updateWorkerPerformance(crmData.workerPerformance);
        updateCustomerSatisfaction(crmData.customerSatisfaction);
        updateWorkerRankings(crmData.workerRankings);
        updateCustomerRatings(crmData.customerRatings);
        updateInsuranceAnalytics(crmData.insuranceAnalytics);
        updateClientInsights(crmData.clientInsights);
        
    } catch (error) {
        console.error('Error loading CRM data:', error);
        showNotification('Failed to load CRM data', 'error');
    }
}

function updateWorkerPerformance(performanceData) {
    const performanceGrid = document.getElementById('worker-performance-grid');
    
    const performanceHTML = performanceData.map(worker => `
        <div class="performance-card" onclick="showWorkerPerformance('${worker.id}')">
            <div class="worker-header">
                <h4>${worker.name}</h4>
                <span class="rating">${worker.rating} ⭐</span>
            </div>
            <div class="worker-stats">
                <div class="stat">
                    <span class="label">Jobs</span>
                    <span class="value">${worker.jobsCompleted}</span>
                </div>
                <div class="stat">
                    <span class="label">Revenue</span>
                    <span class="value">GH₵ ${worker.revenue}</span>
                </div>
                <div class="stat">
                    <span class="label">Bonus</span>
                    <span class="value">GH₵ ${worker.bonus}</span>
                </div>
            </div>
            <div class="performance-score">
                <div class="score-bar">
                    <div class="score-fill" style="width: ${worker.performanceScore}%"></div>
                </div>
                <span class="score-text">${worker.performanceScore}%</span>
            </div>
        </div>
    `).join('');
    
    performanceGrid.innerHTML = performanceHTML;
}

function updateCustomerSatisfaction(satisfactionData) {
    updateElementText('avg-rating', satisfactionData.averageRating);
    updateElementText('recommend-rate', satisfactionData.recommendationRate + '%');
    updateElementText('repeat-customers', satisfactionData.repeatCustomers + '%');
}

function updateWorkerRankings(rankings) {
    const tableBody = document.getElementById('worker-rankings-table');
    
    const rankingsHTML = rankings.map((worker, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${worker.name}</strong></td>
            <td>${worker.service}</td>
            <td>${worker.jobsCompleted}</td>
            <td>
                <span class="rating-display">
                    ${worker.averageRating} ⭐
                    <span class="rating-count">(${worker.ratingCount})</span>
                </span>
            </td>
            <td>GH₵ ${worker.totalRevenue.toLocaleString()}</td>
            <td>GH₵ ${worker.totalPayout.toLocaleString()}</td>
            <td>
                <div class="performance-indicator">
                    <div class="indicator-bar">
                        <div class="indicator-fill" style="width: ${worker.performanceScore}%"></div>
                    </div>
                    <span>${worker.performanceScore}%</span>
                </div>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = rankingsHTML;
}

function updateCustomerRatings(ratingsData) {
    // Update recent reviews
    const reviewsContainer = document.getElementById('recent-reviews');
    const reviewsHTML = ratingsData.recentReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <strong>${review.customer}</strong>
                <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
            </div>
            <p class="review-text">"${review.review}"</p>
            <div class="review-meta">
                <span>${review.worker} • ${review.service}</span>
                <span>${formatDate(review.date)}</span>
            </div>
        </div>
    `).join('');
    
    reviewsContainer.innerHTML = reviewsHTML;
    
    // Update rating distribution
    ratingsData.ratingDistribution.forEach((count, index) => {
        const rating = 5 - index;
        const percentage = (count / ratingsData.totalRatings) * 100;
        updateElementText(`count-${rating}`, count);
        document.getElementById(`rating-${rating}`).style.width = `${percentage}%`;
    });
}

function updateInsuranceAnalytics(analyticsData) {
    updateElementText('insurance-uptake', analyticsData.uptakeRate + '%');
    updateElementText('popular-insurance', analyticsData.mostPopular + ' months');
    updateElementText('claims-rate', analyticsData.claimsRate + '%');
    
    const tableBody = document.getElementById('insurance-analytics-table');
    const analyticsHTML = analyticsData.breakdown.map(item => `
        <tr>
            <td>${item.duration} months</td>
            <td>${item.sold}</td>
            <td>GH₵ ${item.revenue.toLocaleString()}</td>
            <td>${item.claims}</td>
            <td>${item.claimsRate}%</td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = analyticsHTML;
}

function updateClientInsights(insightsData) {
    // Update demographics
    const demographicsContainer = document.getElementById('client-demographics');
    const demographicsHTML = `
        <div class="demographic-item">
            <span>Total Clients:</span>
            <span>${insightsData.totalClients}</span>
        </div>
        <div class="demographic-item">
            <span>Repeat Clients:</span>
            <span>${insightsData.repeatClients} (${insightsData.repeatRate}%)</span>
        </div>
        <div class="demographic-item">
            <span>Avg Jobs per Client:</span>
            <span>${insightsData.avgJobsPerClient}</span>
        </div>
        <div class="demographic-item">
            <span>Avg Spend per Client:</span>
            <span>GH₵ ${insightsData.avgSpendPerClient.toLocaleString()}</span>
        </div>
    `;
    demographicsContainer.innerHTML = demographicsHTML;
    
    // Update service popularity
    const popularityContainer = document.getElementById('service-popularity');
    const popularityHTML = insightsData.servicePopularity.map(service => `
        <div class="service-item">
            <span>${service.name}:</span>
            <div class="popularity-bar">
                <div class="popularity-fill" style="width: ${service.percentage}%"></div>
            </div>
            <span>${service.percentage}%</span>
        </div>
    `).join('');
    popularityContainer.innerHTML = popularityHTML;
    
    // Update client insights table
    const tableBody = document.getElementById('client-insights-table');
    const insightsHTML = insightsData.topClients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.jobsBooked}</td>
            <td>GH₵ ${client.totalSpent.toLocaleString()}</td>
            <td>${client.avgRating} ⭐</td>
            <td>${client.insurancePreference}</td>
            <td>${formatDate(client.lastJob)}</td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = insightsHTML;
}

// Export Functions
function exportFinancialData() {
    const financialData = {
        transactions: getCurrentTransactions(),
        taxSummary: getCurrentTaxSummary(),
        payouts: getCurrentPayouts(),
        insurance: getCurrentInsuranceData()
    };
    
    const csvContent = convertFinancialDataToCSV(financialData);
    downloadCSV(csvContent, 'walantu-financial-report.csv');
    showNotification('Financial data exported successfully', 'success');
}

function exportCRMData() {
    const crmData = {
        workerPerformance: getCurrentWorkerPerformance(),
        customerRatings: getCurrentCustomerRatings(),
        insuranceAnalytics: getCurrentInsuranceAnalytics(),
        clientInsights: getCurrentClientInsights()
    };
    
    const csvContent = convertCRMDataToCSV(crmData);
    downloadCSV(csvContent, 'walantu-crm-report.csv');
    showNotification('CRM data exported successfully', 'success');
}

// Utility Functions
function convertFinancialDataToCSV(data) {
    // Implementation for converting financial data to CSV
    const headers = ['Type', 'Date', 'Description', 'Amount', 'VAT', 'Service Tax', 'Net Amount'];
    const rows = [];
    
    // Add transactions
    data.transactions.forEach(transaction => {
        rows.push([
            'Transaction',
            transaction.date,
            `Job ${transaction.jobId} - ${transaction.customer}`,
            transaction.amount,
            transaction.vat,
            transaction.serviceTax,
            transaction.net
        ]);
    });
    
    // Add payouts
    data.payouts.forEach(payout => {
        rows.push([
            'Payout',
            payout.month,
            `${payout.worker} - ${payout.service}`,
            -payout.totalPayout,
            0,
            0,
            -payout.totalPayout
        ]);
    });
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
}

function convertCRMDataToCSV(data) {
    // Implementation for converting CRM data to CSV
    const headers = ['Worker', 'Service', 'Jobs Completed', 'Average Rating', 'Total Revenue', 'Performance Score'];
    const rows = data.workerPerformance.map(worker => [
        worker.name,
        worker.service,
        worker.jobsCompleted,
        worker.averageRating,
        worker.totalRevenue,
        worker.performanceScore
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
}

// Worker Performance Modal
function showWorkerPerformance(workerId) {
    const worker = getWorkerById(workerId);
    if (!worker) {
        showNotification('Worker not found', 'error');
        return;
    }
    
    const modal = document.getElementById('worker-performance-modal');
    const modalTitle = document.getElementById('worker-performance-title');
    const modalContent = document.getElementById('worker-performance-content');
    
    modalTitle.textContent = `Performance Details - ${worker.name}`;
    modalContent.innerHTML = generateWorkerPerformanceHTML(worker);
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
}

function generateWorkerPerformanceHTML(worker) {
    return `
        <div class="worker-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Service Category:</strong>
                    <span>${worker.service}</span>
                </div>
                <div class="detail-item">
                    <strong>Experience:</strong>
                    <span>${worker.experience} years</span>
                </div>
                <div class="detail-item">
                    <strong>Join Date:</strong>
                    <span>${formatDate(worker.joinDate)}</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong>
                    <span class="status-badge ${worker.isActive ? 'active' : 'inactive'}">${worker.isActive ? 'Active' : 'Inactive'}</span>
                </div>
            </div>
            
            <div class="performance-metrics">
                <h3>Performance Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h4>Jobs Completed</h4>
                        <div class="metric-value">${worker.jobsCompleted}</div>
                    </div>
                    <div class="metric-card">
                        <h4>Average Rating</h4>
                        <div class="metric-value">${worker.averageRating} ⭐</div>
                    </div>
                    <div class="metric-card">
                        <h4>Total Revenue</h4>
                        <div class="metric-value">GH₵ ${worker.totalRevenue.toLocaleString()}</div>
                    </div>
                    <div class="metric-card">
                        <h4>Performance Score</h4>
                        <div class="metric-value">${worker.performanceScore}%</div>
                    </div>
                </div>
            </div>
            
            <div class="earnings-breakdown">
                <h3>Earnings Breakdown</h3>
                <div class="earnings-grid">
                    <div class="earning-item">
                        <span>Base Salary:</span>
                        <span>GH₵ ${worker.baseSalary.toLocaleString()}</span>
                    </div>
                    <div class="earning-item">
                        <span>Bonus Earned:</span>
                        <span>GH₵ ${worker.bonusEarned.toLocaleString()}</span>
                    </div>
                    <div class="earning-item total">
                        <span>Total Earnings:</span>
                        <span>GH₵ ${worker.totalEarnings.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="recent-ratings">
                <h3>Recent Customer Feedback</h3>
                ${worker.recentRatings.map(rating => `
                    <div class="rating-item">
                        <div class="rating-header">
                            <strong>${rating.customer}</strong>
                            <span class="rating-stars">${'⭐'.repeat(rating.rating)}</span>
                        </div>
                        <p>"${rating.comment}"</p>
                        <div class="rating-date">${formatDate(rating.date)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Data Simulation Functions (Replace with actual API calls)
async function simulateAccountingDataFetch() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        financialOverview: {
            totalRevenue: 125000,
            vatCollected: 15625,
            serviceTax: 3125,
            netProfit: 106250
        },
        transactions: [
            {
                date: '2024-02-15',
                jobId: 'JOB_001',
                customer: 'Kofi Mensah',
                amount: 350,
                vat: 43.75,
                serviceTax: 8.75,
                net: 297.5,
                method: 'momo'
            },
            {
                date: '2024-02-14',
                jobId: 'JOB_002',
                customer: 'Abena Asante',
                amount: 280,
                vat: 35,
                serviceTax: 7,
                net: 238,
                method: 'card'
            }
        ],
        taxBreakdown: {
            vatStandard: 15625,
            vatTotal: 15625,
            serviceLevy: 3125,
            serviceTaxTotal: 3125
        },
        payouts: [
            {
                worker: 'Kwame Asante',
                service: 'Plumber',
                jobsCompleted: 8,
                baseSalary: 1200,
                bonus: 240,
                totalPayout: 1440,
                month: 'February 2024'
            }
        ],
        insurance: {
            totalRevenue: 12500,
            activePolicies: 45,
            claimsFiled: 2,
            policies: [
                {
                    jobId: 'JOB_001',
                    customer: 'Kofi Mensah',
                    duration: 6,
                    premium: 80,
                    status: 'active'
                }
            ]
        }
    };
}

async function simulateCRMDataFetch() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        workerPerformance: [
            {
                id: '1',
                name: 'Kwame Asante',
                service: 'Plumber',
                jobsCompleted: 8,
                rating: 4.8,
                revenue: '12,400',
                bonus: '620',
                performanceScore: 92
            }
        ],
        customerSatisfaction: {
            averageRating: 4.7,
            recommendationRate: 95,
            repeatCustomers: 35
        },
        workerRankings: [
            {
                name: 'Kwame Asante',
                service: 'Plumber',
                jobsCompleted: 8,
                averageRating: 4.8,
                ratingCount: 8,
                totalRevenue: 12400,
                totalPayout: 1820,
                performanceScore: 92
            }
        ],
        customerRatings: {
            recentReviews: [
                {
                    customer: 'Kofi Mensah',
                    rating: 5,
                    review: 'Excellent work, very professional and timely.',
                    worker: 'Kwame Asante',
                    service: 'Plumber',
                    date: '2024-02-15'
                }
            ],
            ratingDistribution: [45, 30, 15, 8, 2],
            totalRatings: 100
        },
        insuranceAnalytics: {
            uptakeRate: 65,
            mostPopular: 6,
            claimsRate: 4.5,
            breakdown: [
                { duration: 3, sold: 25, revenue: 1250, claims: 1, claimsRate: 4.0 },
                { duration: 6, sold: 15, revenue: 1200, claims: 1, claimsRate: 6.7 },
                { duration: 12, sold: 5, revenue: 600, claims: 0, claimsRate: 0.0 }
            ]
        },
        clientInsights: {
            totalClients: 150,
            repeatClients: 52,
            repeatRate: 35,
            avgJobsPerClient: 1.8,
            avgSpendPerClient: 850,
            servicePopularity: [
                { name: 'Plumber', percentage: 25 },
                { name: 'Electrician', percentage: 20 },
                { name: 'Carpenter', percentage: 18 },
                { name: 'AC Technician', percentage: 15 },
                { name: 'Car Mechanic', percentage: 12 },
                { name: 'Gardener', percentage: 8 },
                { name: 'Labourer', percentage: 2 }
            ],
            topClients: [
                {
                    name: 'Kofi Mensah',
                    jobsBooked: 3,
                    totalSpent: 2850,
                    avgRating: 4.8,
                    insurancePreference: '6 months',
                    lastJob: '2024-02-15'
                }
            ]
        }
    };
}

// Make functions available globally
window.showWorkerPerformance = showWorkerPerformance;
window.exportFinancialData = exportFinancialData;
window.exportCRMData = exportCRMData;