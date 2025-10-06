import type { Customer, Deal, SupportTicket, MarketingCampaign, Task, CallLog, MediaAsset, ApiKey, EmailTemplate, SocialMediaInsight, EmailMarketingInsight, SystemUser, UserRole, LandingPage, LandingPageInsight } from '../types';

export const mockCustomers: Customer[] = [
  { id: 'C001', name: 'Ahmed Al Farsi', company: 'Emaar Properties', email: 'ahmed.farsi@emaar.com', phone: '+966 50 123 4567', status: 'Contact', createdAt: '2023-10-15' },
  { id: 'C002', name: 'Fatima Al Jubair', company: 'Al Akaria', email: 'fatima.j@alakaria.com', phone: '+966 55 987 6543', status: 'Contact', createdAt: '2023-09-22' },
  { id: 'C003', name: 'Yusuf bin Khalid', company: 'Dar Al Arkan', email: 'yusuf.khalid@daralarkan.com', phone: '+966 53 456 7890', status: 'Lead', createdAt: '2023-11-01' },
  { id: 'C004', name: 'Layla Al Saud', company: 'ROSHN', email: 'layla.alsaud@roshn.sa', phone: '+966 54 321 0987', status: 'Contact', createdAt: '2023-08-05' },
  { id: 'C005', name: 'Omar Abdulaziz', company: 'NEOM', email: 'o.abdulaziz@neom.com', phone: '+966 56 789 1234', status: 'Archived', createdAt: '2023-05-18' },
];

export const mockDeals: Deal[] = [
  { id: 'D001', title: 'Riyadh Villa Project', customerName: 'Ahmed Al Farsi', value: 5000000, status: 'Proposal', contactDate: '2023-11-05', assignedTo: 'Sales Team' },
  { id: 'D002', title: 'Jeddah Waterfront Apt', customerName: 'Fatima Al Jubair', value: 2500000, status: 'Negotiation', contactDate: '2023-11-02', assignedTo: 'Sales Team' },
  { id: 'D003', title: 'NEOM Land Acquisition', customerName: 'Yusuf bin Khalid', value: 15000000, status: 'New Lead', contactDate: '2023-11-01', assignedTo: 'Admin User' },
  { id: 'D004', title: 'Dammam Office Space Lease', customerName: 'Layla Al Saud', value: 750000, status: 'Won', contactDate: '2023-10-20', assignedTo: 'Sales Team' },
  { id: 'D005', title: 'Red Sea Resort Investment', customerName: 'Omar Abdulaziz', value: 10000000, status: 'Lost', contactDate: '2023-09-15', assignedTo: 'Sales Team' },
  { id: 'D006', title: 'Al Khobar Retail Unit', customerName: 'Sara Ibrahim', value: 1200000, status: 'Contacted', contactDate: '2023-10-28', assignedTo: 'Marketing Staff' },
];

export const mockTickets: SupportTicket[] = [
  { id: 'T001', subject: 'Inquiry about payment schedule', customerName: 'Ahmed Al Farsi', status: 'Open', priority: 'High', assignedTo: 'Support Team', createdAt: '2023-11-04' },
  { id: 'T002', subject: 'Cannot access documents portal', customerName: 'Fatima Al Jubair', status: 'In Progress', priority: 'Medium', assignedTo: 'IT Staff', createdAt: '2023-11-03' },
  { id: 'T003', subject: 'Request for additional project details', customerName: 'Layla Al Saud', status: 'Resolved', priority: 'Low', assignedTo: 'Sales Team', createdAt: '2023-10-25' },
  { id: 'T004', subject: 'Contract clarification needed', customerName: 'Ahmed Al Farsi', status: 'Open', priority: 'Medium', assignedTo: 'Legal Team', createdAt: '2023-11-06' },
];

export const mockCampaigns: MarketingCampaign[] = [
    { id: 'M001', name: 'Riyadh Luxury Villas Launch', status: 'Active', channel: 'Social Media', leadsGenerated: 120, conversionRate: 0.15, startDate: '2023-10-15', endDate: '2023-11-30' },
    { id: 'M002', name: 'Jeddah Investment Seminar', status: 'Completed', channel: 'Email', leadsGenerated: 85, conversionRate: 0.25, startDate: '2023-09-01', endDate: '2023-09-30' },
    { id: 'M003', name: 'NEOM Future Living Expo', status: 'Planning', channel: 'Ads', leadsGenerated: 0, conversionRate: 0, startDate: '2024-01-10', endDate: '2024-02-10' },
];

export const mockTasks: Task[] = [
    { id: 'TSK001', title: 'Follow up with Ahmed Al Farsi on proposal', dueDate: '2023-11-10', priority: 'High', status: 'To Do', assignedTo: 'Sales Team' },
    { id: 'TSK002', title: 'Prepare marketing materials for NEOM Expo', dueDate: '2023-12-01', priority: 'Medium', status: 'In Progress', assignedTo: 'Marketing Staff' },
    // Fix: The 'priority' was incorrectly set to 'Done'. It has been changed to 'Medium' and the missing 'status' property has been added with the value 'Done'.
    { id: 'TSK003', title: 'Resolve document portal access for Fatima', dueDate: '2023-11-08', priority: 'Medium', status: 'Done', assignedTo: 'IT Staff' },
    { id: 'TSK004', title: 'Schedule quarterly review meeting', dueDate: '2023-11-15', priority: 'Low', status: 'To Do', assignedTo: 'Admin User' },
];

export const mockCallLogs: CallLog[] = [
    { id: 'CL001', callerName: 'Ahmed Al Farsi', phoneNumber: '+966 50 123 4567', type: 'Outgoing', duration: '05:32', timestamp: '2023-11-06 10:15 AM' },
    { id: 'CL002', callerName: 'Unknown Caller', phoneNumber: '+966 55 555 1234', type: 'Incoming', duration: '02:11', timestamp: '2023-11-06 09:45 AM' },
    { id: 'CL003', callerName: 'Layla Al Saud', phoneNumber: '+966 54 321 0987', type: 'Missed', duration: '00:00', timestamp: '2023-11-05 03:20 PM' },
    { id: 'CL004', callerName: 'Fatima Al Jubair', phoneNumber: '+966 55 987 6543', type: 'Outgoing', duration: '12:45', timestamp: '2023-11-05 11:00 AM' },
];

export const mockMediaAssets: MediaAsset[] = [
    { id: 'MA001', name: 'riyadh-villa-exterior.jpg', type: 'image', url: 'https://picsum.photos/seed/riyadh-villa/400/300', createdAt: '2023-11-01', size: 1258291 }, // ~1.2 MB
    { id: 'MA002', name: 'jeddah-apt-interior.jpg', type: 'image', url: 'https://picsum.photos/seed/jeddah-apt/400/300', createdAt: '2023-10-28', size: 870400 }, // ~850 KB
    { id: 'MA003', name: 'neom-promo-video.mp4', type: 'video', url: 'https://picsum.photos/seed/neom-promo/400/300', createdAt: '2023-10-25', size: 26214400 }, // ~25 MB
    { id: 'MA004', name: 'dammam-office-view.png', type: 'image', url: 'https://picsum.photos/seed/dammam-office/400/300', createdAt: '2023-10-15', size: 2147483 }, // ~2.0 MB
    { id: 'MA005', name: 'red-sea-resort-drone.mov', type: 'video', url: 'https://picsum.photos/seed/redsea-drone/400/300', createdAt: '2023-09-30', size: 15728640 }, // ~15 MB
    { id: 'MA006', name: 'project-blueprint.jpg', type: 'image', url: 'https://picsum.photos/seed/blueprint/400/300', createdAt: '2023-09-20', size: 524288 }, // ~512 KB
];

export const mockApiKeys: ApiKey[] = [
    { id: 'ak_1', key: 'maryon_sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', createdAt: '2023-10-01', lastUsed: '2023-11-05' },
    { id: 'ak_2', key: 'maryon_sk_live_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4', createdAt: '2023-08-15', lastUsed: 'Never' },
];

export const mockEmailTemplates: EmailTemplate[] = [
    { id: 'ET001', name: 'Welcome Email', subject: 'Welcome to Maryon Real Estate!', body: '<h1>Hello {{name}}!</h1><p>Thank you for joining us...</p>', thumbnailUrl: 'https://picsum.photos/seed/welcome-email/400/300' },
    { id: 'ET002', name: 'New Property Alert', subject: 'New Properties in Riyadh Just For You!', body: '<p>Hi {{name}}, check out these new listings...</p>', thumbnailUrl: 'https://picsum.photos/seed/property-alert/400/300' },
    { id: 'ET003', name: 'Investment Seminar Invite', subject: 'Invitation: Real Estate Investment Seminar', body: '<p>You are invited to our exclusive seminar...</p>', thumbnailUrl: 'https://picsum.photos/seed/seminar-invite/400/300' },
];

export const mockSocialInsights: SocialMediaInsight[] = [
    { platform: 'Facebook', followers: 125032, weeklyChange: 1.2 },
    { platform: 'Instagram', followers: 89741, weeklyChange: 2.5 },
    { platform: 'Twitter', followers: 45231, weeklyChange: -0.5 },
    { platform: 'LinkedIn', followers: 22019, weeklyChange: 0.8 },
];

export const mockEmailMarketingInsights: EmailMarketingInsight[] = [
  { campaign: 'Riyadh Villas Launch', openRate: 45.2, ctr: 8.1, conversionRate: 2.5, cpa: 50.75, roas: 5.2, bounceRate: 1.8, avgTimeOnPage: '3m 10s' },
  { campaign: 'Jeddah Seminar Invite', openRate: 60.5, ctr: 12.3, conversionRate: 4.1, cpa: 35.50, roas: 7.8, bounceRate: 0.9, avgTimeOnPage: '4m 05s' },
  { campaign: 'NEOM Expo Follow-up', openRate: 35.8, ctr: 5.6, conversionRate: 1.9, cpa: 65.00, roas: 3.5, bounceRate: 2.5, avgTimeOnPage: '1m 45s' },
];

export const mockRoles: UserRole[] = [
    {
        id: 'role_admin',
        name: 'Administrator',
        description: 'Has full access to all system features and settings.',
        permissions: {
            dashboard: { view: true },
            sales: { view: true, create: true, edit: true, delete: true },
            customers: { view: true, create: true, edit: true, delete: true },
            marketing: { view: true, create: true, edit: true, delete: true },
            support: { view: true, create: true, edit: true, delete: true },
            tasks: { view: true, create: true, edit: true, delete: true },
            media: { view: true, create: true, edit: true, delete: true },
            settings: { view: true, manageApi: true },
            userManagement: { view: true, manage: true },
        }
    },
    {
        id: 'role_sales',
        name: 'Sales Staff',
        description: 'Can manage sales pipeline, deals, and customer contacts.',
        permissions: {
            dashboard: { view: true },
            sales: { view: true, create: true, edit: true, delete: false },
            customers: { view: true, create: true, edit: true, delete: false },
            marketing: { view: false, create: false, edit: false, delete: false },
            support: { view: true, create: false, edit: false, delete: false },
            tasks: { view: true, create: true, edit: true, delete: true },
            media: { view: true, create: false, edit: false, delete: false },
            settings: { view: false, manageApi: false },
            userManagement: { view: false, manage: false },
        }
    },
    {
        id: 'role_marketing',
        name: 'Marketing Staff',
        description: 'Manages marketing campaigns, templates, and social media.',
        permissions: {
            dashboard: { view: true },
            sales: { view: true, create: false, edit: false, delete: false },
            customers: { view: true, create: false, edit: false, delete: false },
            marketing: { view: true, create: true, edit: true, delete: true },
            support: { view: false, create: false, edit: false, delete: false },
            tasks: { view: true, create: true, edit: true, delete: true },
            media: { view: true, create: true, edit: true, delete: false },
            settings: { view: false, manageApi: false },
            userManagement: { view: false, manage: false },
        }
    },
    {
        id: 'role_support',
        name: 'Customer Service Staff',
        description: 'Handles support tickets and customer communications.',
        permissions: {
            dashboard: { view: true },
            sales: { view: false, create: false, edit: false, delete: false },
            customers: { view: true, create: false, edit: true, delete: false },
            marketing: { view: false, create: false, edit: false, delete: false },
            support: { view: true, create: true, edit: true, delete: false },
            tasks: { view: true, create: true, edit: true, delete: true },
            media: { view: false, create: false, edit: false, delete: false },
            settings: { view: false, manageApi: false },
            userManagement: { view: false, manage: false },
        }
    }
];

export const mockSystemUsers: SystemUser[] = [
    { id: 'user_1', name: 'Admin User', email: 'admin@maryon.com', roleId: 'role_admin', status: 'Active' },
    { id: 'user_2', name: 'Saleh Al-Ghamdi', email: 'saleh.g@maryon.com', roleId: 'role_sales', status: 'Active' },
    { id: 'user_3', name: 'Noura Abdullah', email: 'noura.a@maryon.com', roleId: 'role_marketing', status: 'Invited' },
    { id: 'user_4', name: 'Hassan Al-Zahrani', email: 'hassan.z@maryon.com', roleId: 'role_support', status: 'Active' },
    { id: 'user_5', name: 'Fahad Al-Mutairi', email: 'fahad.m@maryon.com', roleId: 'role_sales', status: 'Inactive' },
];

export const mockLandingPages: LandingPage[] = [
  { 
    id: 'LP001', 
    title: 'Riyadh Villa Launch Campaign', 
    status: 'Published', 
    createdAt: '2023-11-10',
    content: [
        { type: 'hero', id: 'h1', title: 'Luxury Villas in the Heart of Riyadh', subtitle: 'Discover your new home', imageUrl: 'https://picsum.photos/seed/lp1-hero/1200/600', buttonText: 'Inquire Now' },
        { type: 'gallery', id: 'g1', title: 'Photo Gallery', images: [{id: 'img1', url: 'https://picsum.photos/seed/lp1-g1/800/600', alt: 'Living Room'}, {id: 'img2', url: 'https://picsum.photos/seed/lp1-g2/800/600', alt: 'Bedroom'}]}
    ]
  },
  { 
    id: 'LP002', 
    title: 'Jeddah Waterfront Open House', 
    status: 'Draft', 
    createdAt: '2023-11-15',
    content: [
        { type: 'hero', id: 'h2', title: 'Jeddah Waterfront Apartments', subtitle: 'Breathtaking sea views await.', imageUrl: 'https://picsum.photos/seed/lp2-hero/1200/600', buttonText: 'Register for Open House' }
    ]
  },
  { 
    id: 'LP003', 
    title: 'NEOM Investment Opportunities', 
    status: 'Published', 
    createdAt: '2023-10-28',
    content: [
        { type: 'hero', id: 'h3', title: 'Invest in the Future: NEOM', subtitle: 'Groundbreaking opportunities in the city of tomorrow.', imageUrl: 'https://picsum.photos/seed/lp3-hero/1200/600', buttonText: 'Learn More' },
        { type: 'features', id: 'f1', title: 'Key Features', features: [{id: 'feat1', icon: 'Area', title: 'Vast Lands', description: 'Large plots available for development.'}, {id: 'feat2', icon: 'Tech', title: 'Smart City', description: 'Integrated with the latest technology.'}]}
    ]
  },
];

export const mockLandingPageInsights: LandingPageInsight[] = [
    { pageTitle: 'Riyadh Villa Launch Campaign', views: 15234, conversionRate: 5.8, leads: 884, bounceRate: 32.1 },
    { pageTitle: 'NEOM Investment Opportunities', views: 8972, conversionRate: 10.2, leads: 915, bounceRate: 25.5 },
    { pageTitle: 'Jeddah Waterfront Open House', views: 4501, conversionRate: 15.5, leads: 698, bounceRate: 20.8 },
];