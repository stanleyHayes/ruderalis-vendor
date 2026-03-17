const MOCK_PRODUCTS = [
    {
        _id: '1',
        name: 'Purple Haze',
        description: 'A classic sativa strain known for its euphoric and creative effects. Purple Haze delivers a dreamy burst of euphoria that brings veteran consumers back to their psychedelic heyday.',
        price: {amount: 35.00, currency: 'GHS'},
        variant: 'marijuana',
        strain: 'sativa',
        thc: '22.5',
        cbd: '0.5',
        stock: {available: true, quantity: 150},
        image: '',
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '3.5g',
        featured: {status: false},
        sale: {status: false},
        rating: {average: 4.7, count: 45},
        rank: 1,
        createdAt: '2025-12-01T10:00:00Z',
        updatedAt: '2026-01-15T10:00:00Z'
    },
    {
        _id: '2',
        name: 'OG Kush',
        description: 'A legendary indica-dominant hybrid with a complex aroma of fuel, skunk, and spice. Known for heavy, sedating effects that make it perfect for evening relaxation.',
        price: {amount: 40.00, currency: 'GHS'},
        variant: 'marijuana',
        strain: 'indica',
        thc: '25.0',
        cbd: '0.3',
        stock: {available: true, quantity: 200},
        image: '',
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '3.5g',
        featured: {status: true, startDate: '2026-01-01', endDate: '2026-06-01'},
        sale: {status: false},
        rating: {average: 4.9, count: 62},
        rank: 2,
        createdAt: '2025-12-05T10:00:00Z',
        updatedAt: '2026-01-20T10:00:00Z'
    },
    {
        _id: '3',
        name: 'Blue Dream Gummies',
        description: 'Infused gummies made with Blue Dream extract. Each gummy contains 10mg THC for a balanced, uplifting experience. 10 gummies per pack.',
        price: {amount: 25.00, currency: 'GHS'},
        variant: 'edible',
        strain: 'hybrid',
        thc: '10.0',
        cbd: '2.0',
        stock: {available: true, quantity: 500},
        image: '',
        shop: {_id: '2', name: 'Herbal Wellness Center'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '100mg total',
        featured: {status: false},
        sale: {status: true, price: {amount: 20.00, currency: 'GHS'}, startDate: '2026-03-01', endDate: '2026-03-31'},
        rating: {average: 4.5, count: 88},
        rank: 3,
        createdAt: '2025-12-10T10:00:00Z',
        updatedAt: '2026-02-01T10:00:00Z'
    },
    {
        _id: '4',
        name: 'Gorilla Glue Shatter',
        description: 'Premium cannabis concentrate with extremely high THC levels. Gorilla Glue shatter delivers potent effects and is best for experienced users.',
        price: {amount: 55.00, currency: 'GHS'},
        variant: 'marijuana',
        strain: 'hybrid',
        thc: '80.0',
        cbd: '0.1',
        stock: {available: true, quantity: 75},
        image: '',
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '1g',
        featured: {status: false},
        sale: {status: false},
        rating: {average: 4.3, count: 28},
        rank: 4,
        createdAt: '2025-12-15T10:00:00Z',
        updatedAt: '2026-02-10T10:00:00Z'
    },
    {
        _id: '5',
        name: 'CBD Relief Balm',
        description: 'Topical balm infused with full-spectrum CBD extract. Provides targeted relief for sore muscles and joints without psychoactive effects.',
        price: {amount: 30.00, currency: 'GHS'},
        variant: 'accessory',
        strain: 'hybrid',
        thc: '0.3',
        cbd: '500.0',
        stock: {available: true, quantity: 300},
        image: '',
        shop: {_id: '2', name: 'Herbal Wellness Center'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '2oz',
        featured: {status: false},
        sale: {status: false},
        rating: {average: 4.8, count: 120},
        rank: 5,
        createdAt: '2025-12-20T10:00:00Z',
        updatedAt: '2026-02-15T10:00:00Z'
    },
    {
        _id: '6',
        name: 'Girl Scout Cookies Pre-Roll',
        description: 'Pre-rolled joints made with premium Girl Scout Cookies flower. Each pack contains 5 pre-rolls for convenient, on-the-go use.',
        price: {amount: 28.00, currency: 'GHS'},
        variant: 'marijuana',
        strain: 'hybrid',
        thc: '19.0',
        cbd: '0.7',
        stock: {available: true, quantity: 400},
        image: '',
        shop: {_id: '3', name: 'Cannabis Corner'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '3.5g (5x0.7g)',
        featured: {status: true, startDate: '2026-02-01', endDate: '2026-04-01'},
        sale: {status: false},
        rating: {average: 4.6, count: 55},
        rank: 6,
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-02-20T10:00:00Z'
    },
    {
        _id: '7',
        name: 'Northern Lights',
        description: 'One of the most famous indica strains of all time. Northern Lights produces resinous buds with a sweet, spicy aroma and deeply relaxing effects.',
        price: {amount: 38.00, currency: 'GHS'},
        variant: 'marijuana',
        strain: 'indica',
        thc: '21.0',
        cbd: '1.0',
        stock: {available: false, quantity: 0},
        image: '',
        shop: {_id: '3', name: 'Cannabis Corner'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'pending',
        weight: '3.5g',
        featured: {status: false},
        sale: {status: false},
        rating: {average: 4.4, count: 33},
        rank: 7,
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z'
    },
    {
        _id: '8',
        name: 'Sour Diesel Vape Cart',
        description: 'Premium vape cartridge filled with Sour Diesel distillate. Fast-acting, energizing effects perfect for daytime use.',
        price: {amount: 45.00, currency: 'GHS'},
        variant: 'marijuana',
        strain: 'sativa',
        thc: '85.0',
        cbd: '0.2',
        stock: {available: true, quantity: 120},
        image: '',
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC'},
        status: 'active',
        weight: '1g',
        featured: {status: false},
        sale: {status: true, price: {amount: 38.00, currency: 'GHS'}, startDate: '2026-03-01', endDate: '2026-03-15'},
        rating: {average: 4.2, count: 41},
        rank: 8,
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-03-05T10:00:00Z'
    }
];

const MOCK_ORDERS = [
    {
        _id: 'ORD001',
        orderNumber: '#RUD-2026-001',
        user: {_id: 'C1', fullName: 'John Smith', email: 'john@email.com', phone: '+233-555-0101'},
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        items: [
            {product: MOCK_PRODUCTS[0], quantity: 2, status: 'completed'},
            {product: MOCK_PRODUCTS[2], quantity: 1, status: 'completed'}
        ],
        price: {amount: 109.50, currency: 'GHS'},
        deliveryFee: {amount: 5.00, currency: 'GHS'},
        destination: 'Accra - East Legon',
        status: 'completed',
        paymentMethod: 'mobile_money',
        paymentProvider: 'mtn',
        paymentStatus: 'success',
        notes: 'Leave at front gate',
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-02-05T10:00:00Z'
    },
    {
        _id: 'ORD002',
        orderNumber: '#RUD-2026-002',
        user: {_id: 'C2', fullName: 'Sarah Johnson', email: 'sarah@email.com', phone: '+233-555-0102'},
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        items: [
            {product: MOCK_PRODUCTS[1], quantity: 1, status: 'pending'},
            {product: MOCK_PRODUCTS[3], quantity: 1, status: 'pending'}
        ],
        price: {amount: 109.50, currency: 'GHS'},
        deliveryFee: {amount: 5.00, currency: 'GHS'},
        destination: 'Kumasi - Ahodwo',
        status: 'pending',
        paymentMethod: 'mobile_money',
        paymentProvider: 'vodafone',
        paymentStatus: 'success',
        notes: '',
        createdAt: '2026-02-10T10:00:00Z',
        updatedAt: '2026-02-12T10:00:00Z'
    },
    {
        _id: 'ORD003',
        orderNumber: '#RUD-2026-003',
        user: {_id: 'C3', fullName: 'Mike Davis', email: 'mike@email.com', phone: '+233-555-0103'},
        shop: {_id: '2', name: 'Herbal Wellness Center'},
        items: [
            {product: MOCK_PRODUCTS[4], quantity: 2, status: 'delivering'},
            {product: MOCK_PRODUCTS[5], quantity: 3, status: 'delivering'}
        ],
        price: {amount: 158.40, currency: 'GHS'},
        deliveryFee: {amount: 0.00, currency: 'GHS'},
        destination: 'Accra - Cantonments',
        status: 'delivering',
        paymentMethod: 'mobile_money',
        paymentProvider: 'mtn',
        paymentStatus: 'success',
        notes: 'Call before delivery',
        createdAt: '2026-02-15T10:00:00Z',
        updatedAt: '2026-02-18T10:00:00Z'
    },
    {
        _id: 'ORD004',
        orderNumber: '#RUD-2026-004',
        user: {_id: 'C4', fullName: 'Emily Chen', email: 'emily@email.com', phone: '+233-555-0104'},
        shop: {_id: '1', name: 'Green Leaf Wellness'},
        items: [
            {product: MOCK_PRODUCTS[7], quantity: 1, status: 'pending'}
        ],
        price: {amount: 54.50, currency: 'GHS'},
        deliveryFee: {amount: 5.00, currency: 'GHS'},
        destination: 'Tema - Community 25',
        status: 'pending',
        paymentMethod: 'mobile_money',
        paymentProvider: 'airtelTigo',
        paymentStatus: 'pending',
        notes: '',
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z'
    },
    {
        _id: 'ORD005',
        orderNumber: '#RUD-2026-005',
        user: {_id: 'C5', fullName: 'Robert Wilson', email: 'robert@email.com', phone: '+233-555-0105'},
        shop: {_id: '3', name: 'Cannabis Corner'},
        items: [
            {product: MOCK_PRODUCTS[0], quantity: 1, status: 'cancelled'},
            {product: MOCK_PRODUCTS[1], quantity: 1, status: 'cancelled'},
            {product: MOCK_PRODUCTS[5], quantity: 2, status: 'cancelled'}
        ],
        price: {amount: 144.10, currency: 'GHS'},
        deliveryFee: {amount: 0.00, currency: 'GHS'},
        destination: 'Accra - Osu',
        status: 'cancelled',
        paymentMethod: 'mobile_money',
        paymentProvider: 'mtn',
        paymentStatus: 'failed',
        notes: 'Customer requested cancellation',
        createdAt: '2026-03-05T10:00:00Z',
        updatedAt: '2026-03-06T10:00:00Z'
    },
    {
        _id: 'ORD006',
        orderNumber: '#RUD-2026-006',
        user: {_id: 'C1', fullName: 'John Smith', email: 'john@email.com', phone: '+233-555-0101'},
        shop: {_id: '2', name: 'Herbal Wellness Center'},
        items: [
            {product: MOCK_PRODUCTS[2], quantity: 3, status: 'pending'},
            {product: MOCK_PRODUCTS[4], quantity: 1, status: 'pending'}
        ],
        price: {amount: 120.50, currency: 'GHS'},
        deliveryFee: {amount: 5.00, currency: 'GHS'},
        destination: 'Accra - East Legon',
        status: 'pending',
        paymentMethod: 'mobile_money',
        paymentProvider: 'vodafone',
        paymentStatus: 'success',
        notes: '',
        createdAt: '2026-03-10T10:00:00Z',
        updatedAt: '2026-03-11T10:00:00Z'
    }
];

const MOCK_SHOPS = [
    {
        _id: '1',
        name: 'Green Leaf Wellness',
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC', phone: '+233-555-9999'},
        contact: {phone: '+233-555-1001', email: 'info@greenleaf.com'},
        description: 'Premium cannabis dispensary offering the finest selection of flower, concentrates, and accessories. Licensed and compliant with all regulations.',
        status: 'active',
        image: '',
        rank: 10,
        featured: {value: true, startDate: '2026-01-01', endDate: '2026-06-01'},
        destinations: [
            {name: 'Accra - East Legon', price: {amount: 5.00, currency: 'GHS'}},
            {name: 'Accra - Cantonments', price: {amount: 7.00, currency: 'GHS'}},
            {name: 'Accra - Osu', price: {amount: 5.00, currency: 'GHS'}},
            {name: 'Tema', price: {amount: 10.00, currency: 'GHS'}},
            {name: 'Kumasi', price: {amount: 15.00, currency: 'GHS'}},
        ],
        rating: {average: 4.8, count: 156, details: {5: 98, 4: 40, 3: 12, 2: 4, 1: 2}},
        totalProducts: 45,
        totalOrders: 320,
        revenue: 125000.00,
        operatingHours: {open: '09:00', close: '21:00'},
        license: 'MJ-GH-2025-001',
        paymentDetails: {
            provider: 'mtn',
            number: '0551234567',
            accountName: 'Cannabis Ventures LLC'
        },
        createdAt: '2025-06-01T10:00:00Z'
    },
    {
        _id: '2',
        name: 'Herbal Wellness Center',
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC', phone: '+233-555-9999'},
        contact: {phone: '+233-555-1002', email: 'hello@herbalwellness.com'},
        description: 'Medical-focused dispensary specializing in CBD products, edibles, and therapeutic cannabis solutions. Friendly and knowledgeable staff.',
        status: 'active',
        image: '',
        rank: 8,
        featured: {value: false},
        destinations: [
            {name: 'Accra - East Legon', price: {amount: 4.00, currency: 'GHS'}},
            {name: 'Accra - Labone', price: {amount: 4.00, currency: 'GHS'}},
            {name: 'Kumasi - Ahodwo', price: {amount: 12.00, currency: 'GHS'}},
        ],
        rating: {average: 4.6, count: 98, details: {5: 55, 4: 30, 3: 8, 2: 3, 1: 2}},
        totalProducts: 38,
        totalOrders: 250,
        revenue: 98000.00,
        operatingHours: {open: '10:00', close: '20:00'},
        license: 'MJ-GH-2025-002',
        paymentDetails: {
            provider: 'vodafone',
            number: '0201234567',
            accountName: 'Cannabis Ventures LLC'
        },
        createdAt: '2025-07-15T10:00:00Z'
    },
    {
        _id: '3',
        name: 'Cannabis Corner',
        owner: {_id: 'V1', fullName: 'Cannabis Ventures LLC', phone: '+233-555-9999'},
        contact: {phone: '+233-555-1003', email: 'sales@cannabiscorner.com'},
        description: 'Your neighborhood dispensary with a wide variety of strains and pre-rolls. Competitive pricing and loyalty rewards program.',
        status: 'pending',
        image: '',
        rank: 5,
        featured: {value: false},
        destinations: [
            {name: 'Accra - Osu', price: {amount: 3.00, currency: 'GHS'}},
            {name: 'Accra - Airport Area', price: {amount: 5.00, currency: 'GHS'}},
        ],
        rating: {average: 4.3, count: 67, details: {5: 30, 4: 22, 3: 10, 2: 3, 1: 2}},
        totalProducts: 28,
        totalOrders: 180,
        revenue: 72000.00,
        operatingHours: {open: '08:00', close: '22:00'},
        license: 'MJ-GH-2025-003',
        paymentDetails: {
            provider: 'airtelTigo',
            number: '0271234567',
            accountName: 'Cannabis Ventures LLC'
        },
        createdAt: '2025-09-01T10:00:00Z'
    }
];

const MOCK_CUSTOMERS = [
    {
        _id: 'C1', fullName: 'John Smith', email: 'john@email.com', phone: '+233-555-0101', avatar: '',
        totalOrders: 12, totalSpent: 850.00, status: 'active', medicalCard: 'MC-GH-2025-1001',
        address: {country: 'Ghana', region: 'Greater Accra', city: 'Accra', street: 'East Legon', gpAddressOrHouseNumber: 'GA-123-4567'},
        createdAt: '2025-08-01T10:00:00Z', lastOrder: '2026-03-10T10:00:00Z'
    },
    {
        _id: 'C2', fullName: 'Sarah Johnson', email: 'sarah@email.com', phone: '+233-555-0102', avatar: '',
        totalOrders: 8, totalSpent: 620.00, status: 'active', medicalCard: 'MC-GH-2025-1002',
        address: {country: 'Ghana', region: 'Ashanti', city: 'Kumasi', street: 'Ahodwo', gpAddressOrHouseNumber: 'AK-456-7890'},
        createdAt: '2025-09-15T10:00:00Z', lastOrder: '2026-02-10T10:00:00Z'
    },
    {
        _id: 'C3', fullName: 'Mike Davis', email: 'mike@email.com', phone: '+233-555-0103', avatar: '',
        totalOrders: 5, totalSpent: 380.00, status: 'active', medicalCard: 'MC-GH-2025-1003',
        address: {country: 'Ghana', region: 'Greater Accra', city: 'Accra', street: 'Cantonments', gpAddressOrHouseNumber: 'GA-789-0123'},
        createdAt: '2025-10-01T10:00:00Z', lastOrder: '2026-02-15T10:00:00Z'
    },
    {
        _id: 'C4', fullName: 'Emily Chen', email: 'emily@email.com', phone: '+233-555-0104', avatar: '',
        totalOrders: 3, totalSpent: 215.00, status: 'active', medicalCard: 'MC-GH-2025-1004',
        address: {country: 'Ghana', region: 'Greater Accra', city: 'Tema', street: 'Community 25', gpAddressOrHouseNumber: 'GT-321-6543'},
        createdAt: '2025-11-01T10:00:00Z', lastOrder: '2026-03-01T10:00:00Z'
    },
    {
        _id: 'C5', fullName: 'Robert Wilson', email: 'robert@email.com', phone: '+233-555-0105', avatar: '',
        totalOrders: 2, totalSpent: 144.10, status: 'suspended', medicalCard: 'MC-GH-2025-1005',
        address: {country: 'Ghana', region: 'Greater Accra', city: 'Accra', street: 'Osu', gpAddressOrHouseNumber: 'GA-654-3210'},
        createdAt: '2025-12-01T10:00:00Z', lastOrder: '2026-03-05T10:00:00Z'
    }
];

const MOCK_PAYMENTS = [
    {_id: 'P1', user: {_id: 'C1', fullName: 'John Smith'}, price: {amount: 109.50, currency: 'GHS'}, method: 'mobile money', status: 'success', sender: {provider: 'mtn', number: '0551234567'}, recipient: {provider: 'mtn', number: '0559876543'}, transactionID: 'TXN-MTN-001', purpose: 'daily-payment', createdAt: '2026-02-01T10:00:00Z'},
    {_id: 'P2', user: {_id: 'C2', fullName: 'Sarah Johnson'}, price: {amount: 109.50, currency: 'GHS'}, method: 'mobile money', status: 'success', sender: {provider: 'vodafone', number: '0201234567'}, recipient: {provider: 'mtn', number: '0559876543'}, transactionID: 'TXN-VOD-001', purpose: 'daily-payment', createdAt: '2026-02-10T10:00:00Z'},
    {_id: 'P3', user: {_id: 'C3', fullName: 'Mike Davis'}, price: {amount: 158.40, currency: 'GHS'}, method: 'mobile money', status: 'success', sender: {provider: 'mtn', number: '0557654321'}, recipient: {provider: 'mtn', number: '0559876543'}, transactionID: 'TXN-MTN-002', purpose: 'daily-payment', createdAt: '2026-02-15T10:00:00Z'},
    {_id: 'P4', user: {_id: 'C4', fullName: 'Emily Chen'}, price: {amount: 54.50, currency: 'GHS'}, method: 'mobile money', status: 'pending', sender: {provider: 'airtelTigo', number: '0271234567'}, recipient: {provider: 'mtn', number: '0559876543'}, transactionID: 'TXN-AT-001', purpose: 'daily-payment', createdAt: '2026-03-01T10:00:00Z'},
    {_id: 'P5', user: {_id: 'V1', fullName: 'Cannabis Ventures LLC'}, price: {amount: 50.00, currency: 'GHS'}, method: 'mobile money', status: 'success', sender: {provider: 'mtn', number: '0559876543'}, recipient: {provider: 'mtn', number: '0559876543'}, transactionID: 'TXN-MTN-003', purpose: 'store-setup', createdAt: '2025-06-01T10:00:00Z'},
    {_id: 'P6', user: {_id: 'V1', fullName: 'Cannabis Ventures LLC'}, price: {amount: 25.00, currency: 'GHS'}, method: 'mobile money', status: 'success', sender: {provider: 'mtn', number: '0559876543'}, recipient: {provider: 'mtn', number: '0559876543'}, transactionID: 'TXN-MTN-004', purpose: 'product-promotion', createdAt: '2026-01-15T10:00:00Z'},
];

const MOCK_TRANSACTIONS = [
    {_id: 'T1', type: 'sale', amount: 109.50, currency: 'GHS', date: '2026-02-01T10:00:00Z', status: 'completed', reference: 'ORD001', description: 'Order #RUD-2026-001'},
    {_id: 'T2', type: 'sale', amount: 109.50, currency: 'GHS', date: '2026-02-10T10:00:00Z', status: 'completed', reference: 'ORD002', description: 'Order #RUD-2026-002'},
    {_id: 'T3', type: 'sale', amount: 158.40, currency: 'GHS', date: '2026-02-15T10:00:00Z', status: 'completed', reference: 'ORD003', description: 'Order #RUD-2026-003'},
    {_id: 'T4', type: 'sale', amount: 54.50, currency: 'GHS', date: '2026-03-01T10:00:00Z', status: 'pending', reference: 'ORD004', description: 'Order #RUD-2026-004'},
    {_id: 'T5', type: 'refund', amount: -144.10, currency: 'GHS', date: '2026-03-06T10:00:00Z', status: 'completed', reference: 'ORD005', description: 'Refund for Order #RUD-2026-005'},
    {_id: 'T6', type: 'sale', amount: 120.50, currency: 'GHS', date: '2026-03-10T10:00:00Z', status: 'completed', reference: 'ORD006', description: 'Order #RUD-2026-006'},
    {_id: 'T7', type: 'withdrawal', amount: -500.00, currency: 'GHS', date: '2026-02-28T10:00:00Z', status: 'completed', reference: 'WD001', description: 'Mobile money withdrawal'},
    {_id: 'T8', type: 'withdrawal', amount: -300.00, currency: 'GHS', date: '2026-03-07T10:00:00Z', status: 'processing', reference: 'WD002', description: 'Mobile money withdrawal'},
];

const MOCK_MESSAGES = [
    {_id: 'M1', sender: {_id: 'C1', name: 'John Smith'}, subject: 'Product Inquiry', body: 'Hi, I wanted to ask about the availability of Purple Haze. Do you have it in stock in larger quantities?', read: false, createdAt: '2026-03-14T10:00:00Z'},
    {_id: 'M2', sender: {_id: 'C2', name: 'Sarah Johnson'}, subject: 'Order Status', body: 'Can you provide an update on my order ORD002? It has been in processing for a while.', read: false, createdAt: '2026-03-13T15:30:00Z'},
    {_id: 'M3', sender: {_id: 'C3', name: 'Mike Davis'}, subject: 'Delivery Confirmation', body: 'Just wanted to confirm that I received my order. Everything looks great, thanks!', read: true, createdAt: '2026-03-12T09:00:00Z'},
    {_id: 'M4', sender: {_id: 'C4', name: 'Emily Chen'}, subject: 'CBD Product Recommendations', body: 'I am looking for CBD products for pain relief. Can you recommend something from your catalog?', read: true, createdAt: '2026-03-10T14:00:00Z'},
    {_id: 'M5', sender: {_id: 'admin', name: 'Ruderalis Support'}, subject: 'License Renewal Reminder', body: 'Your vendor license MJ-GH-2025-001 is due for renewal in 30 days. Please submit renewal documentation.', read: false, createdAt: '2026-03-09T08:00:00Z'},
];

const MOCK_DASHBOARD_STATS = {
    totalRevenue: 295000.00,
    totalOrders: 856,
    totalProducts: 111,
    totalCustomers: 342,
    currency: 'GHS',
    revenueChange: 12.5,
    ordersChange: 8.3,
    productsChange: 5.2,
    customersChange: 15.1,
    monthlyRevenue: [
        {month: 'Oct', revenue: 18500},
        {month: 'Nov', revenue: 22000},
        {month: 'Dec', revenue: 28000},
        {month: 'Jan', revenue: 25500},
        {month: 'Feb', revenue: 31000},
        {month: 'Mar', revenue: 27500},
    ],
    ordersByStatus: {
        pending: 12,
        delivering: 15,
        completed: 808,
        cancelled: 21
    },
    topProducts: [
        {name: 'Purple Haze', sales: 245, revenue: 8575},
        {name: 'OG Kush', sales: 198, revenue: 7920},
        {name: 'Blue Dream Gummies', sales: 312, revenue: 7800},
        {name: 'Sour Diesel Vape Cart', sales: 156, revenue: 7020},
        {name: 'Girl Scout Cookies Pre-Roll', sales: 220, revenue: 6160},
    ],
    recentOrders: MOCK_ORDERS.slice(0, 5)
};

const MOCK_VENDOR_PROFILE = {
    _id: 'V1',
    firstName: 'Cannabis',
    lastName: 'Ventures',
    fullName: 'Cannabis Ventures LLC',
    username: 'cannabisventures',
    email: 'admin@cannabisventures.com',
    phone: '+233-559-876543',
    avatar: '',
    companyName: 'Cannabis Ventures LLC',
    role: 'vendor',
    status: 'active',
    license: 'MJ-GH-2025-VENDOR-001',
    pin: '****',
    address: {country: 'Ghana', region: 'Greater Accra', city: 'Accra', street: 'Airport Residential', gpAddressOrHouseNumber: 'GA-500-1234', landmark: 'Near Airport'},
    paymentDetails: {
        provider: 'mtn',
        number: '0559876543',
        accountName: 'Cannabis Ventures LLC'
    },
    notifications: {email: true, sms: true, push: true, orderUpdates: true, promotions: false},
    createdAt: '2025-01-01T10:00:00Z'
};

export const MOCK_DATA = {
    products: MOCK_PRODUCTS,
    orders: MOCK_ORDERS,
    shops: MOCK_SHOPS,
    customers: MOCK_CUSTOMERS,
    payments: MOCK_PAYMENTS,
    transactions: MOCK_TRANSACTIONS,
    messages: MOCK_MESSAGES,
    dashboardStats: MOCK_DASHBOARD_STATS,
    vendorProfile: MOCK_VENDOR_PROFILE
};
