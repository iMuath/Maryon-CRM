import React, { createContext, useState, useCallback, useMemo } from 'react';
import type { Language, Translations } from '../types';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations: Translations = {
  // General
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  sales_pipeline: { en: 'Sales Pipeline', ar: 'خط البيع' },
  customers: { en: 'Customers', ar: 'العملاء' },
  marketing: { en: 'Marketing', ar: 'التسويق' },
  support: { en: 'Support', ar: 'الدعم' },
  tasks: { en: 'Tasks', ar: 'المهام' },
  call_center: { en: 'Call Center', ar: 'مركز الاتصال' },
  media: { en: 'Media', ar: 'الوسائط' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  search: { en: 'Search...', ar: 'بحث...' },
  
  // Dashboard
  total_revenue: { en: 'Total Revenue', ar: 'إجمالي الإيرادات' },
  new_leads: { en: 'New Leads', ar: 'عملاء محتملون جدد' },
  deals_closed: { en: 'Deals Closed', ar: 'الصفقات المغلقة' },
  support_tickets: { en: 'Pending Tickets', ar: 'تذاكر معلقة' },
  sales_overview: { en: 'Sales Overview', ar: 'نظرة عامة على المبيعات' },
  revenue: { en: 'Revenue', ar: 'الإيرادات' },
  social_media_insights: { en: 'Social Media Insights', ar: 'إحصائيات وسائل التواصل الاجتماعي' },
  followers: { en: 'Followers', ar: 'متابعون' },
  weekly_change: { en: 'Weekly Change', ar: 'التغيير الأسبوعي' },
  email_marketing_insights: { en: 'Email Marketing Insights', ar: 'إحصائيات التسويق عبر البريد الإلكتروني' },
  campaign: { en: 'Campaign', ar: 'الحملة' },
  open_rate: { en: 'Open Rate', ar: 'معدل الفتح' },
  ctr: { en: 'CTR', ar: 'نسبة النقر إلى الظهور' },
  cpa: { en: 'CPA', ar: 'التكلفة لكل اكتساب' },
  roas: { en: 'ROAS', ar: 'عائد الإنفاق الإعلاني' },
  bounce_rate: { en: 'Bounce Rate', ar: 'معدل الارتداد' },
  avg_time_on_page: { en: 'Avg. Time on Page', ar: 'متوسط الوقت في الصفحة' },
  landing_page_insights: { en: 'Landing Page Insights', ar: 'إحصائيات الصفحات المقصودة' },
  page: { en: 'Page', ar: 'الصفحة' },
  views: { en: 'Views', ar: 'المشاهدات' },
  conversions: { en: 'Conversions', ar: 'التحويلات' },
  leads: { en: 'Leads', ar: 'العملاء المحتملون' },

  // Sales Pipeline
  new_lead: { en: 'New Lead', ar: 'عميل محتمل جديد' },
  contacted: { en: 'Contacted', ar: 'تم التواصل' },
  proposal: { en: 'Proposal Sent', ar: 'تم إرسال العرض' },
  negotiation: { en: 'Negotiation', ar: 'تفاوض' },
  won: { en: 'Won', ar: 'مقبول' },
  lost: { en: 'Lost', ar: 'مرفوض' },
  add_deal: { en: 'Add Deal', ar: 'إضافة صفقة' },
  edit_deal: { en: 'Edit Deal', ar: 'تعديل الصفقة' },
  deal_title: { en: 'Deal Title', ar: 'عنوان الصفقة' },
  deal_value: { en: 'Value ($)', ar: 'القيمة ($)' },
  customer_name: { en: 'Customer Name', ar: 'اسم العميل' },
  contact_date: { en: 'Contact Date', ar: 'تاريخ التواصل' },
  total_value: { en: 'Total Value', ar: 'القيمة الإجمالية' },
  search_deals_placeholder: { en: 'Search by deal title or customer...', ar: 'ابحث بعنوان الصفقة أو العميل...' },
  delete_deal_title: { en: 'Delete Deal', ar: 'حذف الصفقة' },
  delete_deal_confirm: { en: 'Are you sure you want to delete this deal? This action cannot be undone.', ar: 'هل أنت متأكد أنك تريد حذف هذه الصفقة؟ لا يمكن التراجع عن هذا الإجراء.' },
  delete: { en: 'Delete', ar: 'حذف' },

  // Customers
  all_customers: { en: 'All Customers', ar: 'كل العملاء' },
  add_customer: { en: 'Add Customer', ar: 'إضافة عميل' },
  edit_customer: { en: 'Edit Customer', ar: 'تعديل العميل' },
  customer_id: { en: 'Customer ID', ar: 'معرف العميل' },
  name: { en: 'Name', ar: 'الاسم' },
  company: { en: 'Company', ar: 'الشركة' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  status: { en: 'Status', ar: 'الحالة' },
  created_at: { en: 'Created At', ar: 'تاريخ الإنشاء' },
  search_customers: { en: 'Search by name, company, email...', ar: 'ابحث بالاسم, الشركة, البريد الإلكتروني...' },
  
  // Support
  support_dashboard: { en: 'Support Dashboard', ar: 'لوحة تحكم الدعم' },
  open_tickets: { en: 'Open Tickets', ar: 'التذاكر المفتوحة' },
  subject: { en: 'Subject', ar: 'الموضوع' },
  priority: { en: 'Priority', ar: 'الأولوية' },
  assigned_to: { en: 'Assigned To', ar: 'مُسند إلى' },
  
  // Marketing
  marketing_campaigns: { en: 'Marketing Campaigns', ar: 'الحملات التسويقية' },
  campaign_name: { en: 'Campaign Name', ar: 'اسم الحملة' },
  channel: { en: 'Channel', ar: 'القناة' },
  leads_generated: { en: 'Leads Generated', ar: 'العملاء المحتملون' },
  conversion_rate: { en: 'Conversion Rate', ar: 'معدل التحويل' },
  integrations: { en: 'Integrations', ar: 'التكاملات' },
  social_media: { en: 'Social Media', ar: 'وسائل التواصل الاجتماعي' },
  social_media_desc: { en: 'Connect your social accounts to manage posts and messages.', ar: 'اربط حساباتك الاجتماعية لإدارة المنشورات والرسائل.' },
  whatsapp_business: { en: 'WhatsApp Business', ar: 'واتساب للأعمال' },
  whatsapp_business_desc: { en: 'Connected account to communicate with customers.', ar: 'حساب متصل للتواصل مع العملاء.' },
  whatsapp_business_connect_desc: { en: 'Connect your account to send messages directly.', ar: 'اربط حسابك لإرسال الرسائل مباشرة.' },
  email_marketing: { en: 'Email Marketing', ar: 'التسويق عبر البريد الإلكتروني' },
  email_marketing_desc: { en: 'Connected account to manage and track email campaigns.', ar: 'حساب متصل لإدارة وتتبع حملات البريد الإلكتروني.' },
  email_marketing_connect_desc: { en: 'Connect your account to manage and track email campaigns.', ar: 'اربط حسابك لإدارة وتتبع حملات البريد الإلكتروني.' },
  connect_account: { en: 'Connect Account', ar: 'ربط الحساب' },
  send_whatsapp_message: { en: 'Send WhatsApp Message', ar: 'إرسال رسالة واتساب' },
  recipient: { en: 'Recipient', ar: 'المستلم' },
  message: { en: 'Message', ar: 'الرسالة' },
  send: { en: 'Send', ar: 'إرسال' },
  disconnect: { en: 'Disconnect', ar: 'قطع الاتصال' },
  email_templates: { en: 'Email Templates', ar: 'قوالب البريد الإلكتروني' },
  create_template: { en: 'Create Template', ar: 'إنشاء قالب' },
  edit_template: { en: 'Edit Template', ar: 'تعديل القالب' },
  template_name: { en: 'Template Name', ar: 'اسم القالب' },
  template_body: { en: 'Body (HTML supported)', ar: 'المحتوى (يدعم HTML)' },
  edit: { en: 'Edit', ar: 'تعديل' },
  
  // Tasks
  all_tasks: { en: 'All Tasks', ar: 'كل المهام' },
  add_task: { en: 'Add Task', ar: 'إضافة مهمة' },
  edit_task: { en: 'Edit Task', ar: 'تعديل المهمة' },
  title: { en: 'Title', ar: 'العنوان' },
  due_date: { en: 'Due Date', ar: 'تاريخ الاستحقاق' },

  // Call Center
  call_logs: { en: 'Call Logs', ar: 'سجلات المكالمات' },
  caller: { en: 'Caller', ar: 'المتصل' },
  phone_number: { en: 'Phone Number', ar: 'رقم الهاتف' },
  type: { en: 'Type', ar: 'النوع' },
  duration: { en: 'Duration', ar: 'المدة' },
  timestamp: { en: 'Date & Time', ar: 'التاريخ والوقت' },
  total_calls: { en: 'Total Calls', ar: 'إجمالي المكالمات' },
  avg_call_duration: { en: 'Avg. Call Duration', ar: 'متوسط مدة المكالمة' },
  missed_calls: { en: 'Missed Calls', ar: 'المكالمات الفائتة' },
  open_dialer: { en: 'Open Dialer', ar: 'فتح لوحة الاتصال' },
  calling: { en: 'Calling...', ar: 'جاري الاتصال...' },
  connected: { en: 'Connected', ar: 'متصل' },
  call_ended: { en: 'Call Ended', ar: 'انتهت المكالمة' },
  end_call: { en: 'End Call', ar: 'إنهاء المكالمة' },

  // Media Library
  media_library: { en: 'Media Library', ar: 'مكتبة الوسائط' },
  upload_media: { en: 'Upload Media', ar: 'تحميل وسائط' },
  all_media: { en: 'All', ar: 'الكل' },
  images: { en: 'Images', ar: 'الصور' },
  videos: { en: 'Videos', ar: 'الفيديوهات' },
  copy_url: { en: 'Copy URL', ar: 'نسخ الرابط' },
  copied: { en: 'Copied!', ar: 'تم النسخ!' },
  generate_image: { en: 'Generate Image', ar: 'إنشاء صورة' },
  generate_image_modal_title: { en: 'Generate New Image', ar: 'إنشاء صورة جديدة' },
  image_width: { en: 'Width (px)', ar: 'العرض (بكسل)' },
  image_height: { en: 'Height (px)', ar: 'الارتفاع (بكسل)' },
  image_prompt: { en: 'Prompt (for image content)', ar: 'الموجه (لمحتوى الصورة)' },
  generate_video: { en: 'Generate Video', ar: 'إنشاء فيديو' },
  generate_video_modal_title: { en: 'Generate New Video', ar: 'إنشاء فيديو جديد' },
  video_prompt: { en: 'Prompt', ar: 'الموجه' },
  video_duration: { en: 'Duration (seconds)', ar: 'المدة (ثواني)' },
  aspect_ratio: { en: 'Aspect Ratio', ar: 'نسبة العرض إلى الارتفاع' },
  generate: { en: 'Generate', ar: 'إنشاء' },
  search_media_placeholder: { en: 'Search by name...', ar: 'البحث بالاسم...' },
  filter_by_date: { en: 'Filter by Date', ar: 'تصفية حسب التاريخ' },
  filter_by_size: { en: 'Filter by Size', ar: 'تصفية حسب الحجم' },
  from_date: { en: 'From', ar: 'من' },
  to_date: { en: 'To', ar: 'إلى' },
  any_size: { en: 'Any Size', ar: 'أي حجم' },
  size_small: { en: 'Small (<1MB)', ar: 'صغير (<1 ميجابايت)' },
  size_medium: { en: 'Medium (1-10MB)', ar: 'متوسط (1-10 ميجابايت)' },
  size_large: { en: 'Large (>10MB)', ar: 'كبير (>10 ميجابايت)' },
  generating: { en: 'Generating...', ar: 'جاري الإنشاء...' },
  edit_with_ai: { en: 'Edit with AI', ar: 'تعديل بالذكاء الاصطناعي' },
  edit_image: { en: 'Edit Image', ar: 'تعديل الصورة' },
  edit_prompt: { en: 'Edit prompt', ar: 'موجه التعديل' },
  edit_prompt_placeholder: { en: 'e.g., add a swimming pool, make it a sunny day', ar: 'مثال: أضف مسبحًا، اجعله يومًا مشمسًا' },
  video_generating_message: { en: 'Your video is being generated. This may take a few minutes. Please wait...', ar: 'يتم إنشاء الفيديو الخاص بك. قد يستغرق هذا بضع دقائق. يرجى الانتظار...' },
  
  // Settings
  api_keys: { en: 'API Keys', ar: 'مفاتيح API' },
  api_docs: { en: 'API Documentation', ar: 'توثيق API' },
  api_keys_desc: { en: 'Manage and generate API keys to access the Maryon CRM API.', ar: 'إدارة وإنشاء مفاتيح API للوصول إلى واجهة برمجة تطبيقات ماريون CRM.' },
  api_docs_desc: { en: 'Find all the information you need to integrate with our API.', ar: 'ابحث عن جميع المعلومات التي تحتاجها للتكامل مع واجهة برمجة التطبيقات الخاصة بنا.' },
  generate_new_key: { en: 'Generate New Key', ar: 'إنشاء مفتاح جديد' },
  key: { en: 'Key', ar: 'المفتاح' },
  last_used: { en: 'Last Used', ar: 'آخر استخدام' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  revoke: { en: 'Revoke', ar: 'إلغاء' },
  revoke_key_title: { en: 'Revoke API Key', ar: 'إلغاء مفتاح API' },
  revoke_key_confirm: { en: 'Are you sure you want to revoke this API key? This will permanently disable it.', ar: 'هل أنت متأكد أنك تريد إلغاء مفتاح API هذا؟ سيؤدي هذا إلى تعطيله بشكل دائم.' },
  api_authentication: { en: 'Authentication', ar: 'المصادقة' },
  api_auth_desc: { en: 'Authenticate your API requests by including your secret key in the header.', ar: 'صادق على طلبات API الخاصة بك عن طريق تضمين مفتاحك السري في الترويسة.' },
  api_endpoints: { en: 'Endpoints', ar: 'نقاط النهاية' },
  api_get_customers: { en: 'Get All Customers', ar: 'الحصول على جميع العملاء' },
  api_create_deal: { en: 'Create a New Deal', ar: 'إنشاء صفقة جديدة' },

  // User Management
  user_management: { en: 'User Management', ar: 'إدارة المستخدمين' },
  users: { en: 'Users', ar: 'المستخدمون' },
  roles: { en: 'Roles & Permissions', ar: 'الأدوار والصلاحيات' },
  invite_user: { en: 'Invite User', ar: 'دعوة مستخدم' },
  invite_new_user: { en: 'Invite New User', ar: 'دعوة مستخدم جديد' },
  user: { en: 'User', ar: 'المستخدم' },
  role: { en: 'Role', ar: 'الدور' },
  permissions: { en: 'Permissions', ar: 'الصلاحيات' },
  module: { en: 'Module', ar: 'الوحدة' },
  view: { en: 'View', ar: 'عرض' },
  create: { en: 'Create', ar: 'إنشاء' },
  manage: { en: 'Manage', ar: 'إدارة' },
  all_users: { en: 'All Users', ar: 'جميع المستخدمين' },

  // Landing Pages
  landing_pages: { en: 'Landing Pages', ar: 'الصفحات المقصودة' },
  create_page: { en: 'Create Page', ar: 'إنشاء صفحة' },
  published: { en: 'Published', ar: 'منشور' },
  draft: { en: 'Draft', ar: 'مسودة' },
  preview: { en: 'Preview', ar: 'معاينة' },
  landing_page_editor: { en: 'Landing Page Editor', ar: 'محرر الصفحة المقصودة' },
  components: { en: 'Components', ar: 'المكونات' },
  properties: { en: 'Properties', ar: 'الخصائص' },
  close: { en: 'Close', ar: 'إغلاق' },
  page_title: { en: 'Page Title', ar: 'عنوان الصفحة' },
  drag_component: { en: 'Drag a component here', ar: 'اسحب مكونًا هنا' },
  
  // Landing Page Components
  hero_section: { en: 'Hero Section', ar: 'قسم الهيرو' },
  image_gallery: { en: 'Image Gallery', ar: 'معرض الصور' },
  feature_list: { en: 'Feature List', ar: 'قائمة الميزات' },
  contact_form: { en: 'Contact Form', ar: 'نموذج الاتصال' },
  
  // Landing Page Properties
  main_title: { en: 'Main Title', ar: 'العنوان الرئيسي' },
  subtitle: { en: 'Subtitle', ar: 'العنوان الفرعي' },
  button_text: { en: 'Button Text', ar: 'نص الزر' },
  image_url: { en: 'Image URL', ar: 'رابط الصورة' },
  add_image: { en: 'Add Image', ar: 'إضافة صورة' },
  feature_icon: { en: 'Icon', ar: 'أيقونة' },
  feature_title: { en: 'Feature Title', ar: 'عنوان الميزة' },
  feature_description: { en: 'Description', ar: 'الوصف' },
  add_feature: { en: 'Add Feature', ar: 'إضافة ميزة' },
  form_title: { en: 'Form Title', ar: 'عنوان النموذج' },


  // Form Actions
  save: { en: 'Save', ar: 'حفظ' },
  update: { en: 'Update', ar: 'تحديث' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  
  // AI Features
  ai_summary: { en: 'AI Summary', ar: 'ملخص الذكاء الاصطناعي' },
  generating_summary: { en: 'Generating summary...', ar: 'جاري إنشاء الملخص...' },
  ai_customer_summary: { en: 'AI Customer Profile Summary', ar: 'ملخص ملف العميل بالذكاء الاصطناعي' },
  ai_deal_assistant: { en: 'AI Deal Assistant', ar: 'مساعد الصفقات الذكي' },
  suggest_title: { en: 'Suggest Title', ar: 'اقتراح عنوان' },
  generate_email: { en: 'Generate Follow-up Email', ar: 'إنشاء بريد إلكتروني للمتابعة' },
  follow_up_email: { en: 'Follow-up Email Preview', ar: 'معاينة بريد المتابعة' },
  generate_with_ai: { en: 'Generate with AI', ar: 'إنشاء باستخدام الذكاء الاصطناعي' },
  ai_prompt_placeholder: { en: 'Enter a prompt to generate content...', ar: 'أدخل موجهًا لإنشاء المحتوى...' },
  ai_task_breakdown: { en: 'AI Task Breakdown', ar: 'تحليل المهمة بالذكاء الاصطناعي' },
  suggest_subtasks: { en: 'Suggest Sub-tasks', ar: 'اقتراح مهام فرعية' },
  suggested_subtasks: { en: 'Suggested Sub-tasks', ar: 'المهام الفرعية المقترحة' },
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
