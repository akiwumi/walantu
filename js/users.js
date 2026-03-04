// =============================================================================
// WALANTU — Dummy User Data & Auth Helpers
// =============================================================================
// Demo credentials:
//   Email:    kofi.mensah@email.com
//   Password: Walantu123!
// =============================================================================

const WALANTU_USERS = [
    {
        id: 'usr_001',
        firstName: 'Kofi',
        lastName: 'Mensah',
        email: 'kofi.mensah@email.com',
        password: 'Walantu123!',
        phone: '+233 24 123 4567',
        area: 'East Legon',
        digitalAddress: 'GA-144-8765',
        avatar: 'KM',
        verified: true,
        memberSince: 'January 2024',
        stats: {
            totalJobs: 12,
            activeJobs: 2,
            totalSpend: 'GH₵ 4,850',
            guaranteeActive: 3,
        },
        activeProjects: [
            {
                id: 'job_201',
                service: 'Electrical Rewiring',
                pro: 'Kwame Asante',
                proPhone: '+233 20 456 7890',
                status: 'In Progress',
                startDate: '28 Feb 2025',
                estCompletion: '5 Mar 2025',
                progress: 65,
                cost: 'GH₵ 1,200',
                paid: 'GH₵ 600',
                remaining: 'GH₵ 600',
                address: 'Plot 14, East Legon Hills',
                gps: 'GA-144-8765',
                notes: 'Full rewiring of 3-bedroom house. Phase 1 (kitchen + living room) complete.',
            },
            {
                id: 'job_202',
                service: 'AC Installation',
                pro: 'Ama Boateng',
                proPhone: '+233 27 890 1234',
                status: 'Scheduled',
                startDate: '6 Mar 2025',
                estCompletion: '6 Mar 2025',
                progress: 0,
                cost: 'GH₵ 850',
                paid: 'GH₵ 425',
                remaining: 'GH₵ 425',
                address: 'Plot 14, East Legon Hills',
                gps: 'GA-144-8765',
                notes: 'Supply and install 1.5HP split unit in master bedroom.',
            },
        ],
        serviceHistory: [
            {
                id: 'job_101',
                date: '22 Nov 2024',
                service: 'Plumbing — Burst Pipe Repair',
                pro: 'Kwesi Acheampong',
                cost: 'GH₵ 380',
                rating: 5,
                guarantee: 'Active (expires 22 Feb 2025)',
                status: 'Completed',
            },
            {
                id: 'job_102',
                date: '10 Oct 2024',
                service: 'Carpentry — Custom Wardrobes',
                pro: 'Yaw Darko',
                cost: 'GH₵ 2,100',
                rating: 5,
                guarantee: 'Expired',
                status: 'Completed',
            },
            {
                id: 'job_103',
                date: '4 Sep 2024',
                service: 'Painting — Interior (2 rooms)',
                pro: 'Nana Frimpong',
                cost: 'GH₵ 620',
                rating: 4,
                guarantee: 'Expired',
                status: 'Completed',
            },
            {
                id: 'job_104',
                date: '18 Jul 2024',
                service: 'Gardening — Compound Landscaping',
                pro: 'Abena Serwaa',
                cost: 'GH₵ 450',
                rating: 5,
                guarantee: 'Expired',
                status: 'Completed',
            },
            {
                id: 'job_105',
                date: '3 Mar 2024',
                service: 'Electrical — Ceiling Fan Installation',
                pro: 'Kwame Asante',
                cost: 'GH₵ 180',
                rating: 5,
                guarantee: 'Expired',
                status: 'Completed',
            },
        ],
        paymentMethods: [
            {
                id: 'pm_001',
                type: 'card',
                label: 'Visa ending in 4242',
                icon: '💳',
                default: true,
            },
            {
                id: 'pm_002',
                type: 'momo',
                label: 'MTN MoMo — 024 123 4567',
                icon: '📱',
                default: false,
            },
        ],
        transactions: [
            { date: '28 Feb 2025', desc: 'Electrical Rewiring — Deposit (50%)', amount: '-GH₵ 600', method: 'Visa ••4242', status: 'Paid' },
            { date: '6 Feb 2025',  desc: 'AC Installation — Deposit (50%)',    amount: '-GH₵ 425', method: 'MTN MoMo', status: 'Paid' },
            { date: '22 Nov 2024', desc: 'Plumbing — Burst Pipe (full)',        amount: '-GH₵ 380', method: 'Visa ••4242', status: 'Paid' },
            { date: '10 Oct 2024', desc: 'Carpentry — Custom Wardrobes (full)', amount: '-GH₵ 2,100', method: 'MTN MoMo', status: 'Paid' },
        ],
        addresses: [
            {
                id: 'addr_001',
                label: 'Home',
                line1: 'Plot 14, East Legon Hills',
                line2: 'East Legon, Accra',
                gps: 'GA-144-8765',
                default: true,
            },
            {
                id: 'addr_002',
                label: 'Office',
                line1: 'Ridge Tower, 3rd Floor',
                line2: 'Ridge, Accra',
                gps: 'GA-072-3421',
                default: false,
            },
        ],
        notifications: [
            { id: 'n1', read: false, icon: '🔨', text: 'Kwame Asante has started work on your electrical rewiring job.', time: '2 hours ago' },
            { id: 'n2', read: false, icon: '📅', text: 'Reminder: AC Installation with Ama Boateng is scheduled for tomorrow, 6 Mar at 9:00am.', time: '5 hours ago' },
            { id: 'n3', read: false, icon: '⭐', text: 'Your plumbing job with Kwesi Acheampong is awaiting your review.', time: '3 days ago' },
            { id: 'n4', read: true,  icon: '✅', text: 'Payment of GH₵ 425 to Ama Boateng (AC deposit) confirmed via MTN MoMo.', time: '4 days ago' },
            { id: 'n5', read: true,  icon: '🛡️', text: 'Your 3-month guarantee for the Plumbing job (Job #101) is now active.', time: '1 week ago' },
        ],
        insurance: {
            plan: 'Standard Cover',
            policyNo: 'WAL-2024-KM-001',
            status: 'Active',
            coverFrom: '1 Jan 2024',
            coverTo: '31 Dec 2025',
            maxCover: 'GH₵ 5,000 per incident',
            excess: 'GH₵ 150',
        },
    }
];

// =============================================================================
// Auth helpers
// =============================================================================

/**
 * Attempt login. Returns user object on success, null on failure.
 */
function walantuLogin(email, password) {
    return WALANTU_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) || null;
}

/**
 * Save current user to sessionStorage.
 */
function walantuSetSession(user) {
    // Store a safe copy (no password)
    const safe = { ...user };
    delete safe.password;
    sessionStorage.setItem('walantu_user', JSON.stringify(safe));
}

/**
 * Get currently logged-in user from sessionStorage. Returns null if not logged in.
 */
function walantuGetSession() {
    try {
        const raw = sessionStorage.getItem('walantu_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Clear session (sign out).
 */
function walantuSignOut() {
    sessionStorage.removeItem('walantu_user');
    window.location.href = 'index.html';
}
