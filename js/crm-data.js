// =============================================================================
// WALANTU CRM — Staff Accounts, Dummy Data & Auth Helpers
// =============================================================================
// CRM Staff Credentials:
//   Super Admin:  admin@walantu.com          / WalantuAdmin#1
//   CS Worker 1:  afi.boateng@walantu.com    / Walantu#CS1
//   CS Worker 2:  kweku.asante@walantu.com   / Walantu#CS2
// =============================================================================

// ---------------------------------------------------------------------------
// CRM STAFF ACCOUNTS
// ---------------------------------------------------------------------------

const CRM_USERS = [
    {
        id: 'crm_001',
        name: 'Eugene Darko',
        email: 'admin@walantu.com',
        password: 'WalantuAdmin#1',
        role: 'super_admin',
        avatar: 'ED',
        department: 'Management',
        lastSeen: 'Online',
        lastLogin: '04 Mar 2026, 08:00'
    },
    {
        id: 'crm_002',
        name: 'Afi Boateng',
        email: 'afi.boateng@walantu.com',
        password: 'Walantu#CS1',
        role: 'customer_service',
        avatar: 'AB',
        department: 'Customer Service',
        lastSeen: 'Online',
        lastLogin: '04 Mar 2026, 08:30'
    },
    {
        id: 'crm_003',
        name: 'Kweku Asante',
        email: 'kweku.asante@walantu.com',
        password: 'Walantu#CS2',
        role: 'customer_service',
        avatar: 'KA',
        department: 'Customer Service',
        lastSeen: '5 min ago',
        lastLogin: '04 Mar 2026, 07:55'
    }
];

// ---------------------------------------------------------------------------
// INLINE CUSTOMERS (referenced by jobs not in WALANTU_USERS)
// ---------------------------------------------------------------------------

const CRM_INLINE_CUSTOMERS = [
    {
        id: 'cust_002',
        firstName: 'Abena',
        lastName: 'Owusu',
        email: 'abena.owusu@gmail.com',
        phone: '+233 27 345 6789',
        area: 'Labone',
        digitalAddress: 'GA-072-5521',
        avatar: 'AO',
        memberSince: 'March 2024',
        totalJobs: 3
    },
    {
        id: 'cust_003',
        firstName: 'Yaw',
        lastName: 'Acheampong',
        email: 'yaw.acheampong@yahoo.com',
        phone: '+233 20 567 8901',
        area: 'Adenta',
        digitalAddress: 'GA-321-7890',
        avatar: 'YA',
        memberSince: 'June 2024',
        totalJobs: 2
    },
    {
        id: 'cust_004',
        firstName: 'Efua',
        lastName: 'Mensah',
        email: 'efua.mensah@email.com',
        phone: '+233 24 901 2345',
        area: 'Spintex',
        digitalAddress: 'GA-456-1234',
        avatar: 'EM',
        memberSince: 'October 2024',
        totalJobs: 1
    }
];

// ---------------------------------------------------------------------------
// DUMMY JOBS
// ---------------------------------------------------------------------------

const CRM_JOBS = [
    {
        id: 'WAL-2025-001',
        customerId: 'usr_001',
        customerName: 'Kofi Mensah',
        customerPhone: '+233 24 123 4567',
        customerArea: 'East Legon',
        service: 'Electrical Rewiring',
        pro: 'Kwame Asante',
        proPhone: '+233 20 456 7890',
        status: 'In Progress',
        date: '28 Feb 2025',
        estCompletion: '5 Mar 2025',
        cost: 'GH₵ 1,200',
        paid: 'GH₵ 600',
        remaining: 'GH₵ 600',
        address: 'Plot 14, East Legon Hills',
        gps: 'GA-144-8765',
        assignedCS: 'crm_002',
        assignedCSName: 'Afi Boateng',
        notes: 'Full rewiring of 3-bedroom house. Phase 1 (kitchen + living room) complete.',
        progress: 65
    },
    {
        id: 'WAL-2025-002',
        customerId: 'usr_001',
        customerName: 'Kofi Mensah',
        customerPhone: '+233 24 123 4567',
        customerArea: 'East Legon',
        service: 'AC Installation',
        pro: 'Ama Boateng',
        proPhone: '+233 27 890 1234',
        status: 'Scheduled',
        date: '6 Mar 2025',
        estCompletion: '6 Mar 2025',
        cost: 'GH₵ 850',
        paid: 'GH₵ 425',
        remaining: 'GH₵ 425',
        address: 'Plot 14, East Legon Hills',
        gps: 'GA-144-8765',
        assignedCS: 'crm_002',
        assignedCSName: 'Afi Boateng',
        notes: 'Supply and install 1.5HP split unit in master bedroom.',
        progress: 0
    },
    {
        id: 'WAL-2025-003',
        customerId: 'cust_002',
        customerName: 'Abena Owusu',
        customerPhone: '+233 27 345 6789',
        customerArea: 'Labone',
        service: 'Plumbing — Burst Pipe Repair',
        pro: 'Kwesi Acheampong',
        proPhone: '+233 24 678 9012',
        status: 'Completed',
        date: '15 Feb 2025',
        estCompletion: '15 Feb 2025',
        cost: 'GH₵ 520',
        paid: 'GH₵ 520',
        remaining: 'GH₵ 0',
        address: '12 Ring Road East, Labone',
        gps: 'GA-072-5521',
        assignedCS: 'crm_003',
        assignedCSName: 'Kweku Asante',
        notes: 'Emergency burst pipe repair in kitchen. Job completed same day.',
        progress: 100
    },
    {
        id: 'WAL-2025-004',
        customerId: 'cust_003',
        customerName: 'Yaw Acheampong',
        customerPhone: '+233 20 567 8901',
        customerArea: 'Adenta',
        service: 'Carpentry — Built-in Wardrobe',
        pro: 'Unassigned',
        proPhone: '',
        status: 'Pending',
        date: '10 Mar 2025',
        estCompletion: 'TBD',
        cost: 'GH₵ 2,400',
        paid: 'GH₵ 0',
        remaining: 'GH₵ 2,400',
        address: 'House 7, Adenta Estates',
        gps: 'GA-321-7890',
        assignedCS: 'crm_002',
        assignedCSName: 'Afi Boateng',
        notes: 'Custom built-in wardrobe for master bedroom. Client wants oak finish.',
        progress: 0
    },
    {
        id: 'WAL-2025-005',
        customerId: 'cust_004',
        customerName: 'Efua Mensah',
        customerPhone: '+233 24 901 2345',
        customerArea: 'Spintex',
        service: 'Painting — Interior (Full House)',
        pro: 'Nana Frimpong',
        proPhone: '+233 26 789 0123',
        status: 'Completed',
        date: '20 Jan 2025',
        estCompletion: '25 Jan 2025',
        cost: 'GH₵ 1,800',
        paid: 'GH₵ 1,800',
        remaining: 'GH₵ 0',
        address: 'Spintex Road, Near Ecobank',
        gps: 'GA-456-1234',
        assignedCS: 'crm_003',
        assignedCSName: 'Kweku Asante',
        notes: 'Interior painting of 4-bedroom house. Client requested eggshell finish throughout.',
        progress: 100
    },
    {
        id: 'WAL-2025-006',
        customerId: 'cust_003',
        customerName: 'Yaw Acheampong',
        customerPhone: '+233 20 567 8901',
        customerArea: 'Adenta',
        service: 'Tiling — Kitchen & Bathrooms',
        pro: 'Kofi Opoku',
        proPhone: '+233 23 456 7890',
        status: 'In Progress',
        date: '1 Mar 2025',
        estCompletion: '8 Mar 2025',
        cost: 'GH₵ 3,200',
        paid: 'GH₵ 1,600',
        remaining: 'GH₵ 1,600',
        address: 'House 7, Adenta Estates',
        gps: 'GA-321-7890',
        assignedCS: 'crm_003',
        assignedCSName: 'Kweku Asante',
        notes: 'Tiling of kitchen floor and all 3 bathrooms. Material supplied by client.',
        progress: 40
    }
];

// ---------------------------------------------------------------------------
// PARTS & MATERIALS (linked to CRM_JOBS by jobId)
// ---------------------------------------------------------------------------

const CRM_PARTS = [
    // WAL-2025-001 — Electrical Rewiring
    { id: 'part_001', jobId: 'WAL-2025-001', name: 'Consumer Unit (12-way)',      category: 'Electrical', qty: 1,   unit: 'each', unitPrice: 380,  supplier: 'PowerTech GH',        status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_002', jobId: 'WAL-2025-001', name: '20mm Steel Conduit',          category: 'Electrical', qty: 40,  unit: 'm',    unitPrice: 12,   supplier: 'Electrical Supplier GH', status: 'Delivered',  orderedDate: '25 Feb 2025' },
    { id: 'part_003', jobId: 'WAL-2025-001', name: 'Circuit Breakers (20A)',      category: 'Electrical', qty: 8,   unit: 'each', unitPrice: 45,   supplier: 'Accra Electric',       status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_004', jobId: 'WAL-2025-001', name: '4mm² Copper Cable',          category: 'Electrical', qty: 120, unit: 'm',    unitPrice: 8.50, supplier: 'Cable World Ghana',     status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_005', jobId: 'WAL-2025-001', name: 'Double Wall Sockets',        category: 'Electrical', qty: 12,  unit: 'each', unitPrice: 25,   supplier: 'Electrical Supplier GH', status: 'Delivered',  orderedDate: '25 Feb 2025' },
    { id: 'part_006', jobId: 'WAL-2025-001', name: 'Junction Boxes',             category: 'Electrical', qty: 6,   unit: 'each', unitPrice: 15,   supplier: 'Accra Electric',       status: 'Ordered',      orderedDate: '28 Feb 2025' },
    { id: 'part_007', jobId: 'WAL-2025-001', name: 'PVC Trunking',              category: 'Electrical', qty: 20,  unit: 'm',    unitPrice: 7,    supplier: 'Electrical Supplier GH', status: 'Delivered',  orderedDate: '25 Feb 2025' },
    { id: 'part_008', jobId: 'WAL-2025-001', name: 'Wire Clips/Staples',        category: 'Electrical', qty: 200, unit: 'each', unitPrice: 0.80, supplier: 'Accra Electric',       status: 'Delivered',    orderedDate: '25 Feb 2025' },

    // WAL-2025-002 — AC Installation
    { id: 'part_009', jobId: 'WAL-2025-002', name: '1.5HP Inverter Split AC (Samsung)', category: 'HVAC', qty: 1, unit: 'unit', unitPrice: 3200, supplier: 'CoolAir Ghana',        status: 'Delivered',    orderedDate: '1 Mar 2025' },
    { id: 'part_010', jobId: 'WAL-2025-002', name: 'Copper Refrigerant Pipe (¼")',      category: 'HVAC', qty: 5, unit: 'm',    unitPrice: 35,   supplier: 'CoolAir Ghana',        status: 'Delivered',    orderedDate: '1 Mar 2025' },
    { id: 'part_011', jobId: 'WAL-2025-002', name: 'Copper Refrigerant Pipe (⅜")',      category: 'HVAC', qty: 5, unit: 'm',    unitPrice: 42,   supplier: 'CoolAir Ghana',        status: 'Delivered',    orderedDate: '1 Mar 2025' },
    { id: 'part_012', jobId: 'WAL-2025-002', name: 'Electrical Cable (2.5mm²)',         category: 'HVAC', qty: 10, unit: 'm',   unitPrice: 8.50, supplier: 'Electrical Supplier GH', status: 'Delivered',  orderedDate: '1 Mar 2025' },
    { id: 'part_013', jobId: 'WAL-2025-002', name: 'Wall Brackets (pair)',               category: 'HVAC', qty: 2, unit: 'set', unitPrice: 85,   supplier: 'CoolAir Ghana',        status: 'Delivered',    orderedDate: '1 Mar 2025' },
    { id: 'part_014', jobId: 'WAL-2025-002', name: 'PVC Drain Pipe',                    category: 'HVAC', qty: 3, unit: 'm',   unitPrice: 12,   supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '1 Mar 2025' },
    { id: 'part_015', jobId: 'WAL-2025-002', name: 'Refrigerant R32 (recharge)',         category: 'HVAC', qty: 1, unit: 'kg',  unitPrice: 120,  supplier: 'CoolAir Ghana',        status: 'Pending',      orderedDate: '—' },

    // WAL-2025-003 — Plumbing Burst Pipe
    { id: 'part_016', jobId: 'WAL-2025-003', name: 'Copper Pipe 22mm',           category: 'Plumbing', qty: 2,  unit: 'm',    unitPrice: 48,   supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '14 Feb 2025' },
    { id: 'part_017', jobId: 'WAL-2025-003', name: 'Compression Fittings (22mm)',category: 'Plumbing', qty: 4,  unit: 'each', unitPrice: 22,   supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '14 Feb 2025' },
    { id: 'part_018', jobId: 'WAL-2025-003', name: 'PTFE Thread Seal Tape',      category: 'Plumbing', qty: 3,  unit: 'roll', unitPrice: 4.50, supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '14 Feb 2025' },
    { id: 'part_019', jobId: 'WAL-2025-003', name: 'Pipe Clamps',               category: 'Plumbing', qty: 6,  unit: 'each', unitPrice: 5,    supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '14 Feb 2025' },
    { id: 'part_020', jobId: 'WAL-2025-003', name: 'Soldering Flux',            category: 'Plumbing', qty: 1,  unit: 'tin',  unitPrice: 28,   supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '14 Feb 2025' },
    { id: 'part_021', jobId: 'WAL-2025-003', name: 'Lead-Free Solder',          category: 'Plumbing', qty: 1,  unit: 'roll', unitPrice: 35,   supplier: 'PlumbRight GH',        status: 'Delivered',    orderedDate: '14 Feb 2025' },

    // WAL-2025-004 — Carpentry Built-in Wardrobe
    { id: 'part_022', jobId: 'WAL-2025-004', name: 'Oak MDF Board 18mm (2440×1220)',  category: 'Carpentry', qty: 6,  unit: 'sheet', unitPrice: 280, supplier: 'Timber Ghana',         status: 'Ordered',      orderedDate: '5 Mar 2025' },
    { id: 'part_023', jobId: 'WAL-2025-004', name: 'Oak Veneer Edging',               category: 'Carpentry', qty: 30, unit: 'm',     unitPrice: 12,  supplier: 'Timber Ghana',         status: 'Ordered',      orderedDate: '5 Mar 2025' },
    { id: 'part_024', jobId: 'WAL-2025-004', name: 'Piano Hinges',                    category: 'Carpentry', qty: 4,  unit: 'pair',  unitPrice: 35,  supplier: 'Hardware Hub GH',      status: 'Pending',      orderedDate: '—' },
    { id: 'part_025', jobId: 'WAL-2025-004', name: 'Soft-Close Drawer Runners (450mm)', category: 'Carpentry', qty: 6, unit: 'pair', unitPrice: 65,  supplier: 'Hardware Hub GH',      status: 'Pending',      orderedDate: '—' },
    { id: 'part_026', jobId: 'WAL-2025-004', name: 'Wardrobe Rail',                   category: 'Carpentry', qty: 2,  unit: 'm',     unitPrice: 22,  supplier: 'Hardware Hub GH',      status: 'Pending',      orderedDate: '—' },
    { id: 'part_027', jobId: 'WAL-2025-004', name: 'D-Ring Handles (Chrome)',         category: 'Carpentry', qty: 12, unit: 'each',  unitPrice: 15,  supplier: 'Hardware Hub GH',      status: 'Pending',      orderedDate: '—' },
    { id: 'part_028', jobId: 'WAL-2025-004', name: 'Wood Screws Assorted',            category: 'Carpentry', qty: 5,  unit: 'box',   unitPrice: 18,  supplier: 'Hardware Hub GH',      status: 'Ordered',      orderedDate: '5 Mar 2025' },
    { id: 'part_029', jobId: 'WAL-2025-004', name: 'Sandpaper Pack (120 & 240 grit)', category: 'Carpentry', qty: 2,  unit: 'pack',  unitPrice: 22,  supplier: 'Timber Ghana',         status: 'Ordered',      orderedDate: '5 Mar 2025' },
    { id: 'part_030', jobId: 'WAL-2025-004', name: 'Clear Varnish (1 litre)',         category: 'Carpentry', qty: 3,  unit: 'tin',   unitPrice: 75,  supplier: 'Timber Ghana',         status: 'Pending',      orderedDate: '—' },

    // WAL-2025-005 — Interior Painting
    { id: 'part_031', jobId: 'WAL-2025-005', name: 'Crown Eggshell Paint 5L (Magnolia)', category: 'Painting', qty: 8,  unit: 'tin',  unitPrice: 185, supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_032', jobId: 'WAL-2025-005', name: 'Crown Undercoat Primer 5L',          category: 'Painting', qty: 4,  unit: 'tin',  unitPrice: 150, supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_033', jobId: 'WAL-2025-005', name: 'Paint Rollers (9")',                 category: 'Painting', qty: 4,  unit: 'each', unitPrice: 25,  supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_034', jobId: 'WAL-2025-005', name: 'Roller Tray Set',                   category: 'Painting', qty: 2,  unit: 'each', unitPrice: 35,  supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_035', jobId: 'WAL-2025-005', name: 'Masking Tape 48mm',                 category: 'Painting', qty: 10, unit: 'roll', unitPrice: 12,  supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_036', jobId: 'WAL-2025-005', name: "Painter's Dust Sheets (3m×3m)",     category: 'Painting', qty: 4,  unit: 'each', unitPrice: 45,  supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_037', jobId: 'WAL-2025-005', name: 'Polycell Filler',                   category: 'Painting', qty: 2,  unit: 'tub',  unitPrice: 65,  supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },
    { id: 'part_038', jobId: 'WAL-2025-005', name: 'Paintbrush Set',                    category: 'Painting', qty: 2,  unit: 'set',  unitPrice: 80,  supplier: 'Paintmaster GH',       status: 'Delivered',    orderedDate: '17 Jan 2025' },

    // WAL-2025-006 — Tiling
    { id: 'part_039', jobId: 'WAL-2025-006', name: 'Ceramic Floor Tiles 60×60cm', category: 'Tiling', qty: 80, unit: 'm²',  unitPrice: 95,  supplier: 'Tiles & More GH',      status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_040', jobId: 'WAL-2025-006', name: 'Mosaic Bathroom Wall Tiles',   category: 'Tiling', qty: 30, unit: 'm²',  unitPrice: 110, supplier: 'Tiles & More GH',      status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_041', jobId: 'WAL-2025-006', name: 'Tile Adhesive (25kg bag)',      category: 'Tiling', qty: 12, unit: 'bag', unitPrice: 85,  supplier: 'BuildRight GH',        status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_042', jobId: 'WAL-2025-006', name: 'Tile Grout (5kg)',              category: 'Tiling', qty: 8,  unit: 'bag', unitPrice: 55,  supplier: 'BuildRight GH',        status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_043', jobId: 'WAL-2025-006', name: 'Tile Spacers (3mm)',            category: 'Tiling', qty: 5,  unit: 'pack',unitPrice: 12,  supplier: 'BuildRight GH',        status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_044', jobId: 'WAL-2025-006', name: 'Diamond Tile Cutter Blades',    category: 'Tiling', qty: 3,  unit: 'each',unitPrice: 45,  supplier: 'Tiles & More GH',      status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_045', jobId: 'WAL-2025-006', name: 'Floor Primer (5 litre)',         category: 'Tiling', qty: 2,  unit: 'tin', unitPrice: 95,  supplier: 'BuildRight GH',        status: 'Delivered',    orderedDate: '25 Feb 2025' },
    { id: 'part_046', jobId: 'WAL-2025-006', name: 'Waterproof Membrane (1L)',       category: 'Tiling', qty: 3,  unit: 'tin', unitPrice: 125, supplier: 'BuildRight GH',        status: 'Back-ordered', orderedDate: '25 Feb 2025' },
];

// ---------------------------------------------------------------------------
// INTERNAL CHAT MESSAGES (CS staff ↔ CS staff)
// ---------------------------------------------------------------------------

const CRM_INTERNAL_MESSAGES = [
    {
        id: 'int_001',
        from: 'crm_002',
        fromName: 'Afi Boateng',
        to: 'crm_003',
        toName: 'Kweku Asante',
        text: 'Hey Kweku, can you check if WAL-2025-001 materials are ready for tomorrow?',
        timestamp: '09:15',
        date: 'Today',
        type: 'text'
    },
    {
        id: 'int_002',
        from: 'crm_003',
        fromName: 'Kweku Asante',
        to: 'crm_002',
        toName: 'Afi Boateng',
        text: 'On it! Just confirmed with supplier — circuit breakers delivered by 8am \u2713',
        timestamp: '09:22',
        date: 'Today',
        type: 'text'
    },
    {
        id: 'int_003',
        from: 'crm_002',
        fromName: 'Afi Boateng',
        to: 'crm_003',
        toName: 'Kweku Asante',
        text: 'Perfect, updating the customer now. Thanks!',
        timestamp: '09:24',
        date: 'Today',
        type: 'text'
    }
];

// ---------------------------------------------------------------------------
// CUSTOMER MESSAGES (CS staff ↔ Customer)
// ---------------------------------------------------------------------------

const CRM_CUSTOMER_MESSAGES = [
    {
        id: 'cust_msg_001',
        from: 'crm_002',
        fromName: 'Afi (Support)',
        to: 'usr_001',
        toName: 'Kofi Mensah',
        text: "Hello Kofi! I'm Afi from WALANTU support. I wanted to confirm your electrical rewiring job scheduled for tomorrow.",
        timestamp: '08:45',
        date: 'Today',
        type: 'text'
    },
    {
        id: 'cust_msg_002',
        from: 'usr_001',
        fromName: 'Kofi Mensah',
        to: 'crm_002',
        toName: 'Afi (Support)',
        text: 'Hi Afi! Yes, that\'s correct. What time will Kwame arrive?',
        timestamp: '08:52',
        date: 'Today',
        type: 'text'
    },
    {
        id: 'cust_msg_003',
        from: 'crm_002',
        fromName: 'Afi (Support)',
        to: 'usr_001',
        toName: 'Kofi Mensah',
        text: "He'll be there at 9:00am sharp. He'll have all materials — no need to purchase anything. Is there anything else I can help with?",
        timestamp: '08:55',
        date: 'Today',
        type: 'text'
    },
    {
        id: 'cust_msg_004',
        from: 'usr_001',
        fromName: 'Kofi Mensah',
        to: 'crm_002',
        toName: 'Afi (Support)',
        text: "That's great, thank you! See you tomorrow.",
        timestamp: '09:02',
        date: 'Today',
        type: 'text'
    }
];

// ---------------------------------------------------------------------------
// ACTIVITY LOG
// ---------------------------------------------------------------------------

const CRM_ACTIVITY = [
    {
        id: 'act_001',
        userId: 'crm_002',
        userName: 'Afi Boateng',
        action: 'Viewed customer profile',
        target: 'Kofi Mensah',
        timestamp: '09:30 today',
        icon: '👁️'
    },
    {
        id: 'act_002',
        userId: 'crm_002',
        userName: 'Afi Boateng',
        action: 'Sent message to customer',
        target: 'Kofi Mensah',
        timestamp: '09:24 today',
        icon: '💬'
    },
    {
        id: 'act_003',
        userId: 'crm_003',
        userName: 'Kweku Asante',
        action: 'Updated job status',
        target: 'WAL-2025-003 \u2192 Completed',
        timestamp: '09:10 today',
        icon: '🔄'
    },
    {
        id: 'act_004',
        userId: 'crm_002',
        userName: 'Afi Boateng',
        action: 'Opened job details',
        target: 'WAL-2025-001',
        timestamp: '08:55 today',
        icon: '🔨'
    },
    {
        id: 'act_005',
        userId: 'crm_003',
        userName: 'Kweku Asante',
        action: 'Replied to internal message',
        target: 'Afi Boateng',
        timestamp: '09:22 today',
        icon: '💬'
    },
    {
        id: 'act_006',
        userId: 'crm_001',
        userName: 'Eugene Darko',
        action: 'Logged in to CRM',
        target: 'System',
        timestamp: '08:00 today',
        icon: '🔑'
    }
];

// ---------------------------------------------------------------------------
// SEED KEY — ensures dummy messages are only loaded once into localStorage
// ---------------------------------------------------------------------------
const CRM_SEED_VERSION = 'walantu_crm_seed_v1';

/**
 * Seed localStorage with default messages if not already done.
 * Preserves any user-added messages from a previous session.
 */
function crmSeedMessages() {
    if (localStorage.getItem(CRM_SEED_VERSION)) return; // already seeded

    // Internal messages keyed by conversation ID  crm_002_crm_003
    const internalKey = 'crm_msgs_internal_crm_002_crm_003';
    if (!localStorage.getItem(internalKey)) {
        localStorage.setItem(internalKey, JSON.stringify(CRM_INTERNAL_MESSAGES));
    }

    // Customer messages keyed by conversation ID  crm_002_usr_001
    const custKey = 'crm_msgs_customer_crm_002_usr_001';
    if (!localStorage.getItem(custKey)) {
        localStorage.setItem(custKey, JSON.stringify(CRM_CUSTOMER_MESSAGES));
    }

    localStorage.setItem(CRM_SEED_VERSION, '1');
}

// ---------------------------------------------------------------------------
// CRM AUTH FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Attempt CRM login. Returns CRM user object on success, null on failure.
 * @param {string} email
 * @param {string} password
 * @returns {Object|null}
 */
function crmLogin(email, password) {
    return CRM_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) || null;
}

/**
 * Save the current CRM user to sessionStorage (no password stored).
 * @param {Object} user
 */
function crmSetSession(user) {
    const safe = { ...user };
    delete safe.password;
    sessionStorage.setItem('walantu_crm_user', JSON.stringify(safe));
}

/**
 * Get the currently logged-in CRM user from sessionStorage.
 * Returns null if no session exists.
 * @returns {Object|null}
 */
function crmGetSession() {
    try {
        const raw = sessionStorage.getItem('walantu_crm_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Sign out the current CRM user and redirect to the login page.
 */
function crmSignOut() {
    sessionStorage.removeItem('walantu_crm_user');
    window.location.href = 'admin.html';
}

/**
 * Log an activity entry to localStorage for the admin to review.
 * @param {string} action - Description of the action taken
 * @param {string} target - The object/person the action was applied to
 */
function crmLogActivity(action, target) {
    const user = crmGetSession();
    if (!user) return;

    const key = 'walantu_crm_activity';
    let log = [];
    try {
        log = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        log = [];
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const entry = {
        id: 'act_' + Date.now(),
        userId: user.id,
        userName: user.name,
        action,
        target,
        timestamp: timeStr + ' today',
        icon: '📋'
    };

    log.unshift(entry); // add to front
    if (log.length > 100) log = log.slice(0, 100); // cap at 100 entries
    localStorage.setItem(key, JSON.stringify(log));
}

/**
 * Get all activity entries (seeded defaults merged with localStorage additions).
 * @returns {Array}
 */
function crmGetActivity() {
    const key = 'walantu_crm_activity';
    try {
        const stored = JSON.parse(localStorage.getItem(key));
        if (stored && stored.length > 0) return stored;
    } catch { /* fall through */ }
    return [...CRM_ACTIVITY];
}

// ---------------------------------------------------------------------------
// MESSAGE HELPERS
// ---------------------------------------------------------------------------

/**
 * Build the localStorage key for a conversation.
 * @param {'internal'|'customer'} type
 * @param {string} participantA - e.g. 'crm_002'
 * @param {string} participantB - e.g. 'crm_003' or 'usr_001'
 * @returns {string}
 */
function crmConvKey(type, participantA, participantB) {
    // Sort participant IDs so order doesn't matter
    const sorted = [participantA, participantB].sort().join('_');
    return 'crm_msgs_' + type + '_' + sorted;
}

/**
 * Load messages for a given conversation from localStorage.
 * @param {'internal'|'customer'} type
 * @param {string} participantA
 * @param {string} participantB
 * @returns {Array}
 */
function crmLoadMessages(type, participantA, participantB) {
    const key = crmConvKey(type, participantA, participantB);
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

/**
 * Persist a new message to localStorage for a given conversation.
 * @param {'internal'|'customer'} type
 * @param {string} participantA
 * @param {string} participantB
 * @param {Object} message
 */
function crmSaveMessage(type, participantA, participantB, message) {
    const key = crmConvKey(type, participantA, participantB);
    const msgs = crmLoadMessages(type, participantA, participantB);
    msgs.push(message);
    localStorage.setItem(key, JSON.stringify(msgs));
}

// ---------------------------------------------------------------------------
// EXPOSE AS WINDOW GLOBALS
// ---------------------------------------------------------------------------

window.CRM_USERS              = CRM_USERS;
window.CRM_INLINE_CUSTOMERS   = CRM_INLINE_CUSTOMERS;
window.CRM_JOBS               = CRM_JOBS;
window.CRM_PARTS              = CRM_PARTS;
window.CRM_INTERNAL_MESSAGES  = CRM_INTERNAL_MESSAGES;
window.CRM_CUSTOMER_MESSAGES  = CRM_CUSTOMER_MESSAGES;
window.CRM_ACTIVITY           = CRM_ACTIVITY;

window.crmLogin        = crmLogin;
window.crmSetSession   = crmSetSession;
window.crmGetSession   = crmGetSession;
window.crmSignOut      = crmSignOut;
window.crmLogActivity  = crmLogActivity;
window.crmGetActivity  = crmGetActivity;
window.crmConvKey      = crmConvKey;
window.crmLoadMessages = crmLoadMessages;
window.crmSaveMessage  = crmSaveMessage;
window.crmSeedMessages = crmSeedMessages;

// Seed dummy messages into localStorage on script load
crmSeedMessages();
