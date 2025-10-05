// Fix: Removed self-import of 'Assignee' which conflicted with its local declaration.
export type Page = 'dashboard' | 'sales' | 'customers' | 'marketing' | 'support' | 'tasks' | 'call-center' | 'media' | 'settings' | 'user-management';

// Fix: Renamed from UserRole to UserRoleType to resolve duplicate identifier conflict with the UserRole interface.
export type UserRoleType = 'marketing' | 'sales' | 'it' | 'customer_service';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Lead' | 'Contact' | 'Archived';
  createdAt: string;
}

export type DealStatus = 'New Lead' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  title: string;
  customerName: string;
  value: number;
  status: DealStatus;
  contactDate: string;
  assignedTo: Assignee;
}

export interface SupportTicket {
  id: string;
  subject: string;
  customerName: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  channel: 'Email' | 'Social Media' | 'Ads';
  leadsGenerated: number;
  conversionRate: number;
  startDate: string;
  endDate: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type Assignee = 'Sales Team' | 'Marketing Staff' | 'IT Staff' | 'Admin User';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: Assignee;
}

export interface CallLog {
    id: string;
    callerName: string;
    phoneNumber: string;
    type: 'Incoming' | 'Outgoing' | 'Missed';
    duration: string;
    timestamp: string;
}

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
  size: number; // in bytes
}

export interface ApiKey {
    id: string;
    key: string;
    createdAt: string;
    lastUsed: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // Can be HTML
  thumbnailUrl: string;
}

export interface SocialMediaInsight {
  platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn';
  followers: number;
  weeklyChange: number;
}

export interface EmailMarketingInsight {
  campaign: string;
  openRate: number;
  ctr: number;
  conversionRate: number;
  cpa: number;
  roas: number;
  bounceRate: number;
  avgTimeOnPage: string;
}

export interface Permissions {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export interface UserRole {
    id: string;
    name: string;
    description: string;
    permissions: {
        dashboard: { view: boolean };
        sales: Permissions;
        customers: Permissions;
        marketing: Permissions;
        support: Permissions;
        tasks: Permissions;
        media: Permissions;
        settings: { view: boolean; manageApi: boolean };
        userManagement: { view: boolean; manage: boolean };
    };
}

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    roleId: string;
    status: 'Active' | 'Invited' | 'Inactive';
}