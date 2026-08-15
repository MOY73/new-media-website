const SESSION_COOKIE = 'nm_employee_session';
const SESSION_MAX_AGE = 60 * 60 * 12;
const LOGIN_LIMIT = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const EMPLOYEE_LOGIN_HTML = '';
const EMPLOYEE_DASHBOARD_HTML = '';
const CLIENT_LOGIN_HTML = '';
const CLIENT_PORTAL_HTML = '';
const CONTACT_APPLICATION_HTML = '';
const CLIENT_SESSION_COOKIE = 'nm_client_session';
const CLIENT_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const CLIENT_STATUSES = ['lead', 'discovery', 'proposal', 'won', 'active', 'retained', 'closed', 'lost'];
const TASK_STATUSES = ['open', 'done'];
const TASK_PRIORITIES = ['low', 'normal', 'high'];
const APPLICATION_STATUSES = ['new', 'reviewing', 'contacted', 'qualified', 'closed'];
const LEAD_STATUSES = ['new', 'working', 'contacted', 'interested', 'follow_up', 'not_interested', 'converted'];
const LEAD_OUTCOMES = ['not_contacted', 'no_answer', 'follow_up', 'interested', 'not_interested', 'converted'];
const CHAT_GROUPS = ['general', 'digital-presence', 'creative-content', 'brand-identity', 'web-experience', 'growth-performance'];
const MAX_CHAT_MESSAGES_PER_GROUP = 100;
const MAX_CHAT_PDF_SIZE = 8 * 1024 * 1024;
const BUSINESS_LEAD_SEED = [];
const MAX_APPLICATION_FILES = 8;
const MAX_APPLICATION_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(['png','jpg','jpeg','webp','pdf','doc','docx','ppt','pptx','xls','xlsx','zip']);
const CLIENT_PROJECT_STATUSES = ['new','scheduled','in_progress','waiting_client','completed','cancelled'];
const CLIENT_REQUEST_STATUSES = ['new','reviewing','in_progress','waiting_client','completed','cancelled'];
const DEFAULT_SERVICE_PACKAGES = [
  ['pkg-presence','باقة الحضور','الأنشطة الناشئة','إدارة وحضور',999,'شهريًا','بداية مرتبة وحضور ثابت على منصة واحدة',['منصة واحدة','13 مادة شهريًا','6 تصاميم','6 قصص','تقرير شهري مختصر'],10],
  ['pkg-restaurant','باقة نمو المطاعم','المطاعم والمقاهي','قطاعية',3499,'شهريًا','محتوى شهري يبرز التجربة والمنيو ويحوّل المشاهدة إلى زيارة',['جلستا تصوير','8 فيديوهات قصيرة','12 تصميمًا وقصة','إدارة منصتين','حملة محلية','تقرير حجوزات وتفاعل'],20],
  ['pkg-hotel','باقة حضور الفنادق','الفنادق والضيافة','قطاعية',6999,'شهريًا','منظومة محتوى وحملات ترفع الحجوزات المباشرة وتعرض تجربة الضيف',['تصوير شهري','12 فيديو قصيرًا','محتوى عربي وإنجليزي','إدارة 3 منصات','حملات حجز','تقرير إشغال وتحويل'],30],
  ['pkg-company','باقة حضور الشركات','الشركات والاستشارات','قطاعية',4999,'شهريًا','حضور مهني يبني الثقة ويشرح الخبرة ويولد فرصًا مؤهلة',['لينكدإن ومنصة إضافية','خطة قيادة فكرية','12 مادة احترافية','4 فيديوهات خبراء','صفحة التقاط عملاء','تقرير فرص شهرية'],40],
  ['pkg-video','باقة استوديو المقاطع','كل القطاعات','إنتاج إبداعي',2999,'للدفعة','دفعة مقاطع قصيرة جاهزة للنشر تحافظ على شكل موحد للعلامة',['8 مقاطع قصيرة','جلسة تصوير 4 ساعات','كتابة الأفكار','مونتاج وترجمة','مقاسات المنصات','جولتا تعديل'],50],
  ['pkg-design','باقة التصميم الشهري','كل القطاعات','تصميم',1999,'شهريًا','نظام تصميم مرن يغطي الحملات والمحتوى اليومي',['12 تصميمًا','8 قصص','قالبا حملة','تكييف المقاسات','ملفات جاهزة للنشر','جولتا تعديل'],60],
  ['pkg-brand','باقة الهوية البصرية','المشاريع الجديدة','هوية',3999,'للمشروع','هوية متماسكة تمنح المشروع شكلًا واضحًا من أول ظهور',['شعار ونظام بصري','ألوان وخطوط','دليل استخدام','6 تطبيقات','قوالب سوشيال','ملفات مفتوحة'],70],
  ['pkg-landing','باقة صفحة الهبوط','الحملات والخدمات','مواقع',2499,'للمشروع','صفحة مركزة تقود الزائر إلى تواصل أو حجز أو شراء',['تصميم مخصص','كتابة حتى 700 كلمة','متجاوبة للجوال','نموذج وواتساب','ربط التحليلات','جولتا تعديل'],80],
  ['pkg-website','باقة الموقع المؤسسي','الشركات والفنادق','مواقع',5999,'للمشروع','موقع احترافي يشرح الخدمات ويبني الثقة ويستقبل العملاء',['حتى 7 صفحات','عربي أو إنجليزي','تصميم متجاوب','تهيئة بحث أساسية','نماذج وتحليلات','تدريب بعد التسليم'],90],
  ['pkg-partner','باقة الشريك التسويقي','العلامات النامية','شراكة',9999,'شهريًا','فريق تسويق خارجي يقود الاستراتيجية والإنتاج والإعلان',['4 منصات','42 مادة','جلستا تصوير','إعلانات على 3 قنوات','إدارة حساب','اجتماع أسبوعي'],100]
];

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS employee_messages (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL DEFAULT 'general',
    author_username TEXT NOT NULL,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 1000),
    attachment_key TEXT NOT NULL DEFAULT '',
    attachment_name TEXT NOT NULL DEFAULT '',
    attachment_type TEXT NOT NULL DEFAULT '',
    attachment_size INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_messages_created_at
   ON employee_messages(created_at)`,
  `CREATE TABLE IF NOT EXISTS employee_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL DEFAULT '',
    service TEXT NOT NULL DEFAULT '',
    value REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'lead' CHECK(status IN ('lead','discovery','proposal','won','active')),
    pipeline_stage TEXT NOT NULL DEFAULT 'lead',
    next_step TEXT NOT NULL DEFAULT '',
    owner TEXT NOT NULL DEFAULT '',
    created_by TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_clients_status_updated
   ON employee_clients(status, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS service_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    cadence TEXT NOT NULL DEFAULT 'للمشروع',
    summary TEXT NOT NULL DEFAULT '',
    facts_json TEXT NOT NULL DEFAULT '[]',
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by TEXT NOT NULL DEFAULT 'SYSTEM',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_service_packages_active_sort
   ON service_packages(is_active, sort_order, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS employee_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL DEFAULT '',
    assignee TEXT NOT NULL DEFAULT '',
    due_date TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high')),
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','done')),
    created_by TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_tasks_status_due
   ON employee_tasks(status, due_date)`,
  `CREATE TABLE IF NOT EXISTS employee_login_attempts (
    attempt_key TEXT PRIMARY KEY,
    failures INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_login_attempts_updated
   ON employee_login_attempts(updated_at)`,
  `CREATE TABLE IF NOT EXISTS client_applications (
    id TEXT PRIMARY KEY,
    client_uid TEXT NOT NULL DEFAULT '',
    reference TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    services TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    project_summary TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','contacted','qualified','closed')),
    attachment_count INTEGER NOT NULL DEFAULT 0,
    email_status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_client_applications_reference
   ON client_applications(reference)`,
  `CREATE INDEX IF NOT EXISTS idx_client_applications_status_created
   ON client_applications(status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_application_files (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    object_key TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(application_id) REFERENCES client_applications(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_client_application_files_application
   ON client_application_files(application_id)`,
  `CREATE TABLE IF NOT EXISTS website_application_limits (
    attempt_key TEXT PRIMARY KEY,
    last_created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS business_leads (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL DEFAULT 'مكة المكرمة',
    neighborhood TEXT NOT NULL,
    name TEXT NOT NULL,
    activity TEXT NOT NULL,
    category TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    website TEXT NOT NULL DEFAULT '',
    maps_url TEXT NOT NULL,
    priority INTEGER NOT NULL CHECK(priority IN (1,2,3)),
    score INTEGER NOT NULL DEFAULT 0,
    recommended_service TEXT NOT NULL DEFAULT '',
    contact_status TEXT NOT NULL DEFAULT 'new' CHECK(contact_status IN ('new','working','contacted','interested','follow_up','not_interested','converted')),
    owner TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT 'not_contacted' CHECK(outcome IN ('not_contacted','no_answer','follow_up','interested','not_interested','converted')),
    last_contact_at INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'Google Maps',
    researched_at TEXT NOT NULL,
    converted_client_id TEXT NOT NULL DEFAULT '',
    converted_task_id TEXT NOT NULL DEFAULT '',
    updated_by TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_business_leads_neighborhood_priority
   ON business_leads(neighborhood, priority, score DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_business_leads_status_updated
   ON business_leads(contact_status, updated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_business_leads_city_category
   ON business_leads(city, category, priority, score DESC)`,
  `CREATE TABLE IF NOT EXISTS business_lead_deletions (
    id TEXT PRIMARY KEY,
    deleted_by TEXT NOT NULL,
    deleted_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS employee_presence (
    username TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    last_seen_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_presence_last_seen
   ON employee_presence(last_seen_at DESC)`,
  `CREATE TABLE IF NOT EXISTS employee_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_username TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL DEFAULT '',
    entity_id TEXT NOT NULL DEFAULT '',
    detail TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_activity_log_created
   ON employee_activity_log(created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_profiles (
    firebase_uid TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL DEFAULT '',
    organization TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    photo_url TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_client_profiles_email ON client_profiles(email)`,
  `CREATE TABLE IF NOT EXISTS client_projects (
    id TEXT PRIMARY KEY,
    client_uid TEXT NOT NULL,
    title TEXT NOT NULL,
    service TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','scheduled','in_progress','waiting_client','completed','cancelled')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
    current_stage TEXT NOT NULL DEFAULT '',
    deadline TEXT NOT NULL DEFAULT '',
    created_by TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY(client_uid) REFERENCES client_profiles(firebase_uid) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_client_projects_uid_updated ON client_projects(client_uid, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_requests (
    id TEXT PRIMARY KEY,
    client_uid TEXT NOT NULL,
    project_id TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'change',
    details TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high')),
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','in_progress','waiting_client','completed','cancelled')),
    employee_note TEXT NOT NULL DEFAULT '',
    updated_by TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY(client_uid) REFERENCES client_profiles(firebase_uid) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_client_requests_uid_status ON client_requests(client_uid, status, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_deliveries (
    id TEXT PRIMARY KEY,
    client_uid TEXT NOT NULL,
    project_id TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    object_key TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'delivered' CHECK(status IN ('delivered','approved')),
    created_by TEXT NOT NULL,
    approved_at INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY(client_uid) REFERENCES client_profiles(firebase_uid) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_client_deliveries_uid_created ON client_deliveries(client_uid, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_progress (
    client_uid TEXT PRIMARY KEY,
    visited_sections TEXT NOT NULL DEFAULT '[]',
    score INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY(client_uid) REFERENCES client_profiles(firebase_uid) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS client_support_tickets (
    id TEXT PRIMARY KEY,
    client_uid TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'other',
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','waiting_client','resolved','closed')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    resolved_at INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(client_uid) REFERENCES client_profiles(firebase_uid) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_support_tickets_client_updated ON client_support_tickets(client_uid, updated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_support_tickets_status_updated ON client_support_tickets(status, updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_support_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK(sender_type IN ('client','employee','system')),
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 2500),
    created_at INTEGER NOT NULL,
    FOREIGN KEY(ticket_id) REFERENCES client_support_tickets(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_created ON client_support_messages(ticket_id, created_at ASC)`
];

const KNOWLEDGE = {
  packages: [
    { name: 'باقة الحضور', price: 999, cadence: 'شهريًا', summary: 'بداية مرتبة للأنشطة الصغيرة وحضور ثابت على منصة واحدة.', facts: ['منصة واحدة', '13 مادة شهريًا', '6 تصاميم', '6 ستوري', 'فيديو قصير من مواد العميل', 'تقرير شهري مختصر'] },
    { name: 'باقة النمو', price: 2999, cadence: 'شهريًا', summary: 'محتوى أصلي أقوى للمطاعم والمقاهي والمحلات.', facts: ['منصتان', '24 مادة', 'جلسة تصوير ساعتان', '4 فيديوهات قصيرة', '8 تصاميم', '12 ستوري', 'تقرير واجتماع شهري'] },
    { name: 'باقة العملاء والمبيعات', price: 5999, cadence: 'شهريًا', summary: 'تحويل المحتوى والإعلان إلى محادثات وفرص قابلة للمتابعة.', facts: ['3 منصات', '28 مادة', 'جلسة تصوير 3 ساعات', 'إعلانات على منصتين', '6 تصاميم و6 فيديوهات', 'ربط واتساب أو نموذج عملاء', 'تقرير واجتماعان'] },
    { name: 'باقة الشريك التسويقي', price: 9999, cadence: 'شهريًا', summary: 'فريق تسويق خارجي يقود الاستراتيجية والإنتاج والإعلان.', facts: ['4 منصات', '42 مادة', 'جلستا تصوير', 'إعلانات على 3 قنوات', '8 تصاميم و10 فيديوهات', 'تنسيق مؤثرين أو صناع UGC', 'مدير حساب واجتماع أسبوعي'] },
    { name: 'باقة الهوية البصرية', price: 1999, cadence: 'للمشروع', summary: 'هوية متماسكة للأنشطة الجديدة أو التي تحتاج انطلاقة مرتبة.', facts: ['شعار احترافي', 'ألوان وخطوط', '4 قوالب سوشيال', 'بطاقة عمل وورق رسمي', 'دليل بصري مختصر', 'ملفات PNG وPDF وSVG'] },
    { name: 'باقة الموقع التعريفي', price: 3499, cadence: 'للمشروع', summary: 'واجهة رقمية واضحة تعرض الخدمات وتفتح باب التواصل.', facts: ['حتى 5 صفحات', 'تصميم متجاوب', 'محتوى حتى 1,000 كلمة', 'نموذج تواصل وواتساب', 'SEO أساسي وتحليلات', 'تدريب وجولتا تعديل'] }
  ],
  pricing: [
    { title: 'المواقع والمتاجر', note: 'أسعار بدء قبل الاكتشاف، ولا تشمل الاستضافة والدومين والتطبيقات المدفوعة.', items: [
      ['صفحة هبوط', '1,500-3,000 ر.س'], ['موقع تعريفي 5-7 صفحات', '3,500-6,500 ر.س'], ['موقع ثنائي اللغة', '5,500-9,000 ر.س'], ['متجر سلة أو زد أساسي', '2,500-5,000 ر.س'], ['متجر مخصص', '8,000-18,000 ر.س'], ['صيانة شهرية', '350-1,200 ر.س']
    ] },
    { title: 'الحضور والمحتوى', note: 'يعتمد السعر على عدد المنصات وعمق الإنتاج والمجتمع.', items: [
      ['إدارة منصة واحدة', '999-1,800 ر.س / شهر'], ['إدارة منصتين', '2,300-3,500 ر.س / شهر'], ['إدارة 3 منصات', '3,300-5,000 ر.س / شهر'], ['تقويم وكتابة فقط', '900-1,500 ر.س / شهر'], ['تصاميم فقط', '1,200-2,500 ر.س / شهر'], ['إدارة مجتمع', '800-1,800 ر.س / شهر'], ['منصة إضافية', '600-1,000 ر.س / شهر']
    ] },
    { title: 'الحملات والأداء', note: 'رسوم الإدارة منفصلة عن ميزانية المنصات.', items: [
      ['قناة واحدة حتى إنفاق 20k', '1,500-2,500 ر.س / شهر'], ['قناتان حتى إنفاق 50k', '2,500-4,500 ر.س / شهر'], ['3 قنوات حتى إنفاق 100k', '4,000-6,500 ر.س / شهر'], ['إنفاق أعلى', '8-12% من الإنفاق'], ['إعداد تتبع أساسي', '1,000-2,500 ر.س'], ['لوحة بيانات', '1,500-3,500 ر.س']
    ] },
    { title: 'الهوية والاستراتيجية', note: 'لا نبيع شعارًا فقط عندما يحتاج العميل نظام علامة كاملًا.', items: [
      ['شعار احترافي', '1,500-3,500 ر.س'], ['هوية مصغرة', '2,500-5,000 ر.س'], ['هوية متكاملة', '4,500-9,000 ر.س'], ['استراتيجية علامة', '5,000-10,000 ر.س'], ['تسمية وهوية لفظية', '1,500-3,500 ر.س'], ['UX/UI موقع', '2,500-6,000 ر.س']
    ] },
    { title: 'الإنتاج الإبداعي', note: 'الأسعار تبدأ من وتثبت بعد المعالجة وقائمة الإنتاج.', items: [
      ['فيديو قصير من مواد العميل', '250-600 ر.س'], ['Reel مصور خفيف', '600-1,200 ر.س'], ['نصف يوم تصوير محتوى', '1,500-3,000 ر.س'], ['فيلم إعلاني', '5,000+ ر.س'], ['موشن 30-45 ثانية', '1,200-3,000 ر.س'], ['تصوير منتجات', '1,000-2,500 ر.س']
    ] },
    { title: 'SEO والإضافات', note: 'النتائج تتأثر بالمنافسة والموقع والتنفيذ والوقت.', items: [
      ['SEO أساسي', '1,200-2,500 ر.س / شهر'], ['SEO نمو', '2,500-4,500 ر.س / شهر'], ['SEO متقدم', '4,500-8,000 ر.س / شهر'], ['تدقيق SEO', '1,000-2,500 ر.س'], ['لغة إضافية', '+20-30%'], ['دعم عاجل خلال 24 ساعة', '+25%'], ['ساعة تطوير', '200-350 ر.س']
    ] }
  ],
  workflow: [
    ['تحديد الأولوية', 'اختيار القطاع والمشكلة ونسبة الطاقة المخصصة.'],
    ['البحث والتأهيل', 'جمع الأدلة وتقييم الملاءمة والحاجة والتوقيت.'],
    ['قيمة قبل التواصل', 'تدقيق صغير أو فكرة مفيدة تثبت أننا فهمنا النشاط.'],
    ['التواصل والاكتشاف', 'رسالة شخصية ثم مكالمة بأسئلة ذكية.'],
    ['التشخيص والعرض', 'مشكلة واضحة، نتيجة متوقعة، نطاق، سعر ومسؤوليات.'],
    ['التهيئة والتنفيذ', 'ملفات وصلاحيات وخطة ومراحل ومراجعات.'],
    ['القياس والتحسين', 'خط أساس، مؤشرات، تجارب وقرار مبني على دليل.'],
    ['الاحتفاظ والتوسع', 'تقرير تنفيذي، تجديد، إحالة أو توسيع الخدمة.']
  ],
  services: [
    { name: 'إدارة الحضور الرقمي', purpose: 'بناء حضور متسق يشرح القيمة ويخلق محادثات ويحافظ على المجتمع.', ownership: ['استراتيجية القنوات', 'الكتابة وتقويم النشر', 'إدارة المجتمع', 'تحليل الحضور'], metrics: ['الوصول المناسب', 'الحفظ والنقر', 'المحادثات', 'نمو المجتمع'] },
    { name: 'المحتوى والإنتاج الإبداعي', purpose: 'إنتاج أفكار وصور وفيديوهات وتصاميم توقف الانتباه وتقنع.', ownership: ['الفكرة والاتجاه', 'التصميم والسيناريو', 'التصوير والمونتاج', 'الموشن ومحتوى AI'], metrics: ['قبول الاتجاه', 'وقت الإنتاج', 'الاحتفاظ', 'أداء المحتوى'] },
    { name: 'الهوية والعلامة التجارية', purpose: 'تحويل النشاط إلى معنى ونظام علامة واضح ومتذكّر.', ownership: ['استراتيجية العلامة', 'النظام البصري', 'التسمية والرسائل', 'دليل الاستخدام'], metrics: ['الوضوح', 'الاتساق', 'التذكر', 'سلامة التطبيق'] },
    { name: 'المواقع والتجارب الرقمية', purpose: 'بناء تجارب سريعة وسهلة تقود الزائر إلى إجراء واضح.', ownership: ['هيكلة المحتوى', 'UX/UI', 'التطوير والربط', 'الاختبار والصيانة'], metrics: ['السرعة', 'نجاح المهام', 'معدل التحويل', 'الاستقرار'] },
    { name: 'النمو والتسويق الرقمي', purpose: 'تحويل الإعلان والبحث والبيانات إلى طلب وربحية قابلة للقياس.', ownership: ['الإعلانات المدفوعة', 'SEO', 'التتبع والتحليل', 'التحويل وتوليد العملاء'], metrics: ['ROAS', 'CPL / CAC', 'معدل التحويل', 'قيمة العميل'] }
  ],
  rules: [
    'لا مهمة بلا صاحب وموعد وتعريف واضح للإنجاز.',
    'لا يبدأ التنفيذ قبل اعتماد الهدف والنطاق والمدخلات.',
    'أي طلب خارج النطاق يمر بأمر تغيير مكتوب قبل التنفيذ.',
    'لا نعد برقم مبيعات ثابت؛ نضمن تنفيذًا وقياسًا وتحسينًا مهنيًا.',
    'الإعلان والمؤثرون والسفر والمصاريف الخارجية منفصلة ما لم ينص العرض.',
    'قبل التسليم: مراجعة الجودة، الروابط، الحقوق، المقاسات والنسخ النهائية.'
  ]
};

let schemaReady = false;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

  if (url.pathname === '/api/applications' && request.method === 'POST') {
      return createPublicApplication(request, env, url, ctx);
    }

    if (/^\/contact-application(?:\.html)?\/?$/.test(url.pathname) && request.method === 'GET') {
      const client = await readClientSession(request, env);
      if (!client) return Response.redirect(new URL(`/client/login?next=${encodeURIComponent(url.pathname + url.search)}`, url), 302);
      return privateHtmlResponse(CONTACT_APPLICATION_HTML);
    }

    if (url.pathname.startsWith('/api/client/')) {
      return handleClientApi(request, env, url);
    }

    if (url.pathname.startsWith('/api/employee/')) {
      return handleEmployeeApi(request, env, url);
    }

    if (url.pathname.startsWith('/assets/team-library/')) {
      return new Response('Not found', { status: 404 });
    }

    if (url.pathname.startsWith('/assets/internal/')) {
      return new Response('Not found', { status: 404 });
    }

    if (url.pathname.startsWith('/team/library/')) {
      const user = await readSession(request, env);
      if (!user) return Response.redirect(new URL('/team/login', url), 302);
      const fileName = decodeURIComponent(url.pathname.split('/').pop() || '');
      if (!/^[a-z0-9._-]+$/i.test(fileName)) return new Response('Not found', { status: 404 });
      const assetUrl = new URL(`/assets/team-library/${fileName}`, url);
      const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (asset.status === 404) return new Response('Not found', { status: 404 });
      const headers = new Headers(asset.headers);
      headers.set('Cache-Control', 'private, max-age=300');
      headers.set('Content-Disposition', `inline; filename="${fileName}"`);
      return new Response(asset.body, { status: asset.status, headers });
    }

    if (/^\/employee-dashboard(?:\.html)?\/?$/.test(url.pathname)) {
      return Response.redirect(new URL('/team/workspace', url), 302);
    }

    if (/^\/employee-login(?:\.html)?\/?$/.test(url.pathname)) {
      return Response.redirect(new URL('/team/login', url), 302);
    }

    if (/^\/client-(?:login|portal)(?:\.html)?\/?$/.test(url.pathname)) {
      return Response.redirect(new URL(url.pathname.includes('portal') ? '/client/portal' : '/client/login', url), 302);
    }

    if (/^\/team\/workspace\/?$/.test(url.pathname)) {
      const user = await readSession(request, env);
      if (!user) return Response.redirect(new URL('/team/login', url), 302);
      return employeeHtmlResponse(EMPLOYEE_DASHBOARD_HTML);
    }

    if (/^\/team\/login\/?$/.test(url.pathname)) {
      const user = await readSession(request, env);
      if (user) return Response.redirect(new URL('/team/workspace', url), 302);
      return employeeHtmlResponse(EMPLOYEE_LOGIN_HTML);
    }

    if (/^\/client\/portal\/?$/.test(url.pathname)) {
      const client = await readClientSession(request, env);
      if (!client) return Response.redirect(new URL(`/client/login?next=${encodeURIComponent('/client/portal' + url.hash)}`, url), 302);
      return privateHtmlResponse(CLIENT_PORTAL_HTML);
    }

    if (/^\/client\/login\/?$/.test(url.pathname)) {
      const client = await readClientSession(request, env);
      if (client) return Response.redirect(new URL(safeClientNext(url.searchParams.get('next')), url), 302);
      return privateHtmlResponse(CLIENT_LOGIN_HTML);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return secureAssetResponse(response, url, request.method);
    }

    const notFoundUrl = new URL('/404.html', request.url);
    const notFoundPage = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    return new Response(notFoundPage.body, {
      status: 404,
      headers: securityHeaders(notFoundPage.headers, { html: true }),
    });
  },
};

async function handleEmployeeApi(request, env, url) {
  if (!env.DB) return json({ error: 'قاعدة البيانات غير متاحة حاليًا.' }, 503);
  await ensureSchema(env);

  if (url.pathname === '/api/employee/login' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return login(request, env);
  }

  const user = await readSession(request, env);
  if (!user) return json({ error: 'يجب تسجيل الدخول.' }, 401);

  if (url.pathname === '/api/employee/session' && request.method === 'GET') {
    user.role = roleForUsername(user.username);
    return json({ user });
  }
  if (url.pathname === '/api/employee/logout' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    await env.DB.prepare('DELETE FROM employee_presence WHERE username = ?').bind(user.username).run();
    return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
  }
  if (url.pathname === '/api/employee/data' && request.method === 'GET') {
    return getPortalData(env, user);
  }
  if (url.pathname === '/api/employee/client-projects' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClientProjectByEmployee(request, env, user);
  }
  if (/^\/api\/employee\/client-projects\/[^/]+$/.test(url.pathname) && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateClientProjectByEmployee(request, env, user, url.pathname.split('/').pop());
  }
  if (/^\/api\/employee\/client-requests\/[^/]+$/.test(url.pathname) && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateClientRequestByEmployee(request, env, user, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/client-deliveries' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClientDelivery(request, env, user);
  }
  if (/^\/api\/employee\/support-tickets\/[^/]+\/messages$/.test(url.pathname) && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createEmployeeSupportMessage(request, env, user, url.pathname.split('/').at(-2));
  }
  if (/^\/api\/employee\/support-tickets\/[^/]+$/.test(url.pathname) && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateSupportTicketByEmployee(request, env, user, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/application-files/') && request.method === 'GET') {
    return getApplicationFile(env, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/message-files/') && request.method === 'GET') {
    return getMessageFile(env, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/applications/') && request.method === 'PATCH') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية تعديل الطلبات.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateApplication(request, env, user, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/applications/') && request.method === 'DELETE') {
    if (!hasRole(user, 'super_admin')) return json({ error: 'الحذف متاح للمدير الأعلى فقط.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return deleteApplication(env, user, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/messages' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createMessage(request, env, user);
  }
  if (url.pathname === '/api/employee/clients' && request.method === 'POST') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية إضافة عميل.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClient(request, env, user);
  }
  if (url.pathname.startsWith('/api/employee/clients/') && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateClient(request, env, user, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/clients/') && request.method === 'DELETE') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية حذف عميل.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return deleteClient(env, user, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/packages' && request.method === 'POST') {
    if (!hasRole(user, 'manager')) return json({ error: 'إدارة الباقات متاحة للمدير فقط.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createServicePackage(request, env, user);
  }
  if (/^\/api\/employee\/packages\/[^/]+$/.test(url.pathname) && request.method === 'PATCH') {
    if (!hasRole(user, 'manager')) return json({ error: 'إدارة الباقات متاحة للمدير فقط.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateServicePackage(request, env, user, url.pathname.split('/').pop());
  }
  if (/^\/api\/employee\/packages\/[^/]+$/.test(url.pathname) && request.method === 'DELETE') {
    if (!hasRole(user, 'manager')) return json({ error: 'إدارة الباقات متاحة للمدير فقط.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return deleteServicePackage(env, user, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/tasks' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createTask(request, env, user);
  }
  if (url.pathname.startsWith('/api/employee/tasks/') && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateTask(request, env, user, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/tasks/') && request.method === 'DELETE') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية حذف مهمة.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return deleteTask(env, user, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/leads/assign-category' && request.method === 'POST') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية توزيع الفرص.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return assignLeadCategory(request, env, user);
  }
  if (/^\/api\/employee\/leads\/[^/]+$/.test(url.pathname) && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateBusinessLead(request, env, user, url.pathname.split('/').pop());
  }
  if (/^\/api\/employee\/leads\/[^/]+$/.test(url.pathname) && request.method === 'DELETE') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية حذف فرصة.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return deleteBusinessLead(env, user, url.pathname.split('/').pop());
  }
  if (/^\/api\/employee\/leads\/[^/]+\/convert-task$/.test(url.pathname) && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return convertBusinessLeadToTask(request, env, user, url.pathname.split('/')[4]);
  }
  if (/^\/api\/employee\/leads\/[^/]+\/convert-client$/.test(url.pathname) && request.method === 'POST') {
    if (!hasRole(user, 'manager')) return json({ error: 'ليس لديك صلاحية تحويل الفرصة إلى عميل.' }, 403);
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return convertBusinessLeadToClient(request, env, user, url.pathname.split('/')[4]);
  }

  return json({ error: 'المسار غير موجود.' }, 404);
}

async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch(SCHEMA_STATEMENTS.map((statement) => env.DB.prepare(statement)));
  const clientColumns = await env.DB.prepare('PRAGMA table_info(employee_clients)').all();
  if (!(clientColumns.results || []).some((column) => column.name === 'pipeline_stage')) {
    await env.DB.prepare("ALTER TABLE employee_clients ADD COLUMN pipeline_stage TEXT NOT NULL DEFAULT 'lead'").run();
    await env.DB.prepare('UPDATE employee_clients SET pipeline_stage = status').run();
  }
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_employee_clients_pipeline_updated ON employee_clients(pipeline_stage, updated_at DESC)').run();
  const packageSeedTime = Date.now();
  await env.DB.batch(DEFAULT_SERVICE_PACKAGES.map(([id,name,audience,category,price,cadence,summary,facts,sortOrder]) => env.DB.prepare(
    `INSERT OR IGNORE INTO service_packages
     (id,name,audience,category,price,cadence,summary,facts_json,is_active,sort_order,created_by,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?, ?,1,?,'SYSTEM',?,?)`
  ).bind(id,name,audience,category,price,cadence,summary,JSON.stringify(facts),sortOrder,packageSeedTime,packageSeedTime)));
  const messageColumns = await env.DB.prepare('PRAGMA table_info(employee_messages)').all();
  const messageColumnNames = new Set((messageColumns.results || []).map((column) => column.name));
  for (const [name, definition] of [
    ['group_id', "TEXT NOT NULL DEFAULT 'general'"],
    ['attachment_key', "TEXT NOT NULL DEFAULT ''"],
    ['attachment_name', "TEXT NOT NULL DEFAULT ''"],
    ['attachment_type', "TEXT NOT NULL DEFAULT ''"],
    ['attachment_size', 'INTEGER NOT NULL DEFAULT 0']
  ]) {
    if (!messageColumnNames.has(name)) await env.DB.prepare(`ALTER TABLE employee_messages ADD COLUMN ${name} ${definition}`).run();
  }
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_employee_messages_group_created ON employee_messages(group_id, created_at)').run();
  const applicationColumns = await env.DB.prepare('PRAGMA table_info(client_applications)').all();
  if (!(applicationColumns.results || []).some((column) => column.name === 'client_uid')) {
    await env.DB.prepare("ALTER TABLE client_applications ADD COLUMN client_uid TEXT NOT NULL DEFAULT ''").run();
  }
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_client_applications_uid_created ON client_applications(client_uid, created_at DESC)').run();
  await env.DB.prepare(
    'DELETE FROM employee_activity_log WHERE id NOT IN (SELECT id FROM employee_activity_log ORDER BY created_at DESC LIMIT 100)'
  ).run();
  for (const groupId of CHAT_GROUPS) await pruneChatGroup(env, groupId);
  const leadColumns = await env.DB.prepare('PRAGMA table_info(business_leads)').all();
  if (!(leadColumns.results || []).some((column) => column.name === 'city')) {
    await env.DB.prepare("ALTER TABLE business_leads ADD COLUMN city TEXT NOT NULL DEFAULT 'مكة المكرمة'").run();
  }
  await env.DB.prepare(
    'CREATE INDEX IF NOT EXISTS idx_business_leads_city_priority ON business_leads(city, priority, score DESC)'
  ).run();
  await env.DB.prepare(
    `INSERT OR IGNORE INTO employee_messages
     (id, author_username, author_name, body, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind('system-welcome', 'SYSTEM', 'NEW MEDIA', 'أهلًا بالفريق. هذه مساحة العمل الداخلية المشتركة.', Date.now()).run();
  const leadTotal = await env.DB.prepare('SELECT COUNT(*) AS total FROM business_leads').first();
  const seedResponse = Number(leadTotal?.total || 0) === 0
    ? await env.ASSETS.fetch(new Request('https://assets.internal/assets/internal/makkah-business-leads-batch-1.json'))
    : null;
  const leadSeed = seedResponse?.ok ? await seedResponse.json() : BUSINESS_LEAD_SEED;
  if (Array.isArray(leadSeed) && leadSeed.length) {
    const now = Date.now();
    for (let offset = 0; offset < leadSeed.length; offset += 100) {
      const chunk = leadSeed.slice(offset, offset + 100);
      await env.DB.batch(chunk.map((lead) => env.DB.prepare(
        `INSERT OR IGNORE INTO business_leads
         (id, city, neighborhood, name, activity, category, phone, email, address, website, maps_url,
          priority, score, recommended_service, contact_status, owner, outcome, last_contact_at,
          notes, source, researched_at, created_at, updated_at)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM business_lead_deletions WHERE id = ?)`
      ).bind(lead.id, lead.city || 'مكة المكرمة', lead.neighborhood, lead.name, lead.activity, lead.category, lead.phone || '',
        lead.email || '', lead.address || '', lead.website || '', lead.maps_url, Number(lead.priority || 3),
        Number(lead.score || 0), lead.recommended_service || '', lead.status || 'new', lead.owner || '',
        lead.outcome || 'not_contacted', Number(lead.last_contact_at || 0), lead.notes || '', lead.source || 'Google Maps',
        lead.researched_at || '2026-08-10', now, now, lead.id)));
    }
  }
  schemaReady = true;
}

async function handleClientApi(request, env, url) {
  if (!env.DB) return json({ error: 'قاعدة البيانات غير متاحة حاليًا.' }, 503);
  await ensureSchema(env);

  if (url.pathname === '/api/client/session' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    const payload = await readJson(request, 8000);
    const identity = await verifyFirebaseToken(cleanString(payload?.token, 7000), env);
    if (!identity) return json({ error: 'تعذر التحقق من حساب العميل.' }, 401);
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO client_profiles (firebase_uid,email,display_name,photo_url,created_at,updated_at)
       VALUES (?,?,?,?,?,?) ON CONFLICT(firebase_uid) DO UPDATE SET email=excluded.email,
       display_name=CASE WHEN client_profiles.display_name='' THEN excluded.display_name ELSE client_profiles.display_name END,
       photo_url=excluded.photo_url,updated_at=excluded.updated_at`
    ).bind(identity.uid, identity.email, identity.name, identity.picture, now, now).run();
    const token = await createClientSession(identity, env);
    return json({ ok: true }, 200, { 'Set-Cookie': clientSessionCookie(token) });
  }

  const client = await readClientSession(request, env);
  if (!client) return json({ error: 'يجب تسجيل الدخول كعميل.' }, 401);

  if (url.pathname === '/api/client/session' && request.method === 'GET') {
    const profile = await env.DB.prepare('SELECT firebase_uid,email,display_name,organization,photo_url FROM client_profiles WHERE firebase_uid=?').bind(client.uid).first();
    if (!profile) return json({ error: 'ملف العميل غير موجود.' }, 404);
    return json({ authenticated: true, profile });
  }
  if (url.pathname === '/api/client/logout' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return json({ ok: true }, 200, { 'Set-Cookie': clearClientSessionCookie() });
  }
  if (url.pathname === '/api/client/data' && request.method === 'GET') return getClientData(env, client);
  if (url.pathname === '/api/client/profile' && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateClientProfile(request, env, client);
  }
  if (url.pathname === '/api/client/requests' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClientRequest(request, env, client);
  }
  if (url.pathname === '/api/client/support-tickets' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClientSupportTicket(request, env, client);
  }
  if (/^\/api\/client\/support-tickets\/[^/]+\/messages$/.test(url.pathname) && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClientSupportMessage(request, env, client, url.pathname.split('/').at(-2));
  }
  if (url.pathname === '/api/client/progress' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateClientProgress(request, env, client);
  }
  if (/^\/api\/client\/deliveries\/[^/]+\/approve$/.test(url.pathname) && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return approveClientDelivery(env, client, url.pathname.split('/')[4]);
  }
  if (/^\/api\/client\/deliveries\/[^/]+\/file$/.test(url.pathname) && request.method === 'GET') {
    return getClientDeliveryFile(env, client, url.pathname.split('/')[4]);
  }
  return json({ error: 'المسار غير موجود.' }, 404);
}

async function verifyFirebaseToken(token, env) {
  if (!token || token.length > 7000) return null;
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY || '')}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token })
    });
    if (!response.ok) return null;
    const data = await response.json();
    const user = data.users?.[0];
    const email = cleanString(user?.email, 160).toLowerCase();
    if (!user?.localId || !email || !email.includes('@')) return null;
    return { uid: cleanString(user.localId, 128), email, name: cleanString(user.displayName || email.split('@')[0], 100), picture: cleanString(user.photoUrl || '', 500) };
  } catch { return null; }
}

async function getClientData(env, client) {
  const results = await env.DB.batch([
    env.DB.prepare('SELECT firebase_uid,email,display_name,organization,phone,photo_url,created_at,updated_at FROM client_profiles WHERE firebase_uid=?').bind(client.uid),
    env.DB.prepare('SELECT id,title,service,summary,status,progress,current_stage,deadline,created_at,updated_at FROM client_projects WHERE client_uid=? ORDER BY updated_at DESC').bind(client.uid),
    env.DB.prepare('SELECT id,project_id,title,type,details,priority,status,employee_note,created_at,updated_at FROM client_requests WHERE client_uid=? ORDER BY updated_at DESC LIMIT 100').bind(client.uid),
    env.DB.prepare('SELECT id,project_id,title,message,original_name,content_type,size_bytes,status,approved_at,created_at,updated_at FROM client_deliveries WHERE client_uid=? ORDER BY created_at DESC LIMIT 100').bind(client.uid),
    env.DB.prepare('SELECT visited_sections,score,updated_at FROM client_progress WHERE client_uid=?').bind(client.uid),
    env.DB.prepare('SELECT id,reference,services,budget_range,project_summary,status,created_at,updated_at FROM client_applications WHERE client_uid=? ORDER BY created_at DESC LIMIT 100').bind(client.uid),
    env.DB.prepare("SELECT id,client_uid,subject,category,status,priority,created_at,updated_at,resolved_at FROM client_support_tickets WHERE client_uid=? AND status!='closed' ORDER BY updated_at DESC LIMIT 100").bind(client.uid),
    env.DB.prepare(`SELECT m.id,m.ticket_id,m.sender_type,m.sender_id,m.sender_name,m.body,m.created_at FROM client_support_messages m JOIN client_support_tickets t ON t.id=m.ticket_id WHERE t.client_uid=? AND t.status!='closed' ORDER BY m.created_at ASC LIMIT 1000`).bind(client.uid),
    env.DB.prepare('SELECT id,name,audience,category,price,cadence,summary,facts_json,sort_order,updated_at FROM service_packages WHERE is_active=1 ORDER BY sort_order ASC, updated_at DESC LIMIT 100')
  ]);
  const profile = results[0].results?.[0];
  if (!profile) return json({ error: 'ملف العميل غير موجود.' }, 404);
  const progressRow = results[4].results?.[0] || { visited_sections: '[]', score: 0 };
  const packages = (results[8].results || []).map((item) => ({ ...item, facts: safeJsonParse(item.facts_json) || [] }));
  return json({ profile, projects: results[1].results || [], requests: results[2].results || [], deliveries: results[3].results || [], applications: results[5].results || [], supportTickets: results[6].results || [], supportMessages: results[7].results || [], packages, progress: { visited_sections: safeJsonParse(progressRow.visited_sections) || [], score: Number(progressRow.score || 0) }, serverTime: Date.now() });
}

async function createClientSupportTicket(request, env, client) {
  const payload = await readJson(request, 6000);
  const subject = cleanString(payload?.subject, 140), body = cleanString(payload?.message, 2500);
  if (!subject || !body) return json({ error: 'اكتب عنوان التذكرة وتفاصيلها.' }, 400);
  const category = ['project','delivery','billing','account','technical','other'].includes(payload.category) ? payload.category : 'other';
  const id = crypto.randomUUID(), messageId = crypto.randomUUID(), now = Date.now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO client_support_tickets (id,client_uid,subject,category,status,priority,created_at,updated_at,resolved_at) VALUES (?,?,?,?,?,?,?,?,0)').bind(id, client.uid, subject, category, 'open', 'normal', now, now),
    env.DB.prepare('INSERT INTO client_support_messages (id,ticket_id,sender_type,sender_id,sender_name,body,created_at) VALUES (?,?,?,?,?,?,?)').bind(messageId, id, 'client', client.uid, client.name || client.email, body, now)
  ]);
  return json({ id }, 201);
}

async function createClientSupportMessage(request, env, client, ticketId) {
  if (!isUuid(ticketId)) return json({ error: 'معرّف التذكرة غير صحيح.' }, 400);
  const ticket = await env.DB.prepare('SELECT id,status FROM client_support_tickets WHERE id=? AND client_uid=?').bind(ticketId, client.uid).first();
  if (!ticket) return json({ error: 'التذكرة غير موجودة.' }, 404);
  if (ticket.status === 'closed') return json({ error: 'هذه التذكرة مغلقة.' }, 409);
  const payload = await readJson(request, 4000), body = cleanString(payload?.body, 2500);
  if (!body) return json({ error: 'اكتب ردك أولًا.' }, 400);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO client_support_messages (id,ticket_id,sender_type,sender_id,sender_name,body,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(), ticketId, 'client', client.uid, client.name || client.email, body, now),
    env.DB.prepare("UPDATE client_support_tickets SET status='open',updated_at=? WHERE id=?").bind(now, ticketId),
    env.DB.prepare('DELETE FROM client_support_messages WHERE ticket_id=? AND id NOT IN (SELECT id FROM client_support_messages WHERE ticket_id=? ORDER BY created_at DESC LIMIT 100)').bind(ticketId, ticketId)
  ]);
  return json({ ok: true });
}

async function updateClientProfile(request, env, client) {
  const payload = await readJson(request, 3000);
  const displayName = cleanString(payload?.displayName, 100);
  if (!displayName) return json({ error: 'اكتب الاسم الكامل.' }, 400);
  await env.DB.prepare('UPDATE client_profiles SET display_name=?,organization=?,phone=?,updated_at=? WHERE firebase_uid=?')
    .bind(displayName, cleanString(payload.organization, 120), cleanString(payload.phone, 30), Date.now(), client.uid).run();
  return json({ ok: true });
}

async function createClientRequest(request, env, client) {
  const payload = await readJson(request, 5000);
  const title = cleanString(payload?.title, 140), details = cleanString(payload?.details, 2500);
  if (!title || !details) return json({ error: 'اكتب عنوان الطلب وتفاصيله.' }, 400);
  const projectId = cleanString(payload.projectId, 64);
  if (projectId) {
    const owned = await env.DB.prepare('SELECT id FROM client_projects WHERE id=? AND client_uid=?').bind(projectId, client.uid).first();
    if (!owned) return json({ error: 'المشروع غير موجود.' }, 404);
  }
  const id = crypto.randomUUID(), now = Date.now();
  const priority = ['low','normal','high'].includes(payload.priority) ? payload.priority : 'normal';
  await env.DB.prepare('INSERT INTO client_requests (id,client_uid,project_id,title,type,details,priority,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .bind(id, client.uid, projectId, title, cleanString(payload.type, 30) || 'change', details, priority, 'new', now, now).run();
  return json({ id }, 201);
}

async function updateClientProgress(request, env, client) {
  const payload = await readJson(request, 500);
  const allowed = ['services','work','about','digital','creative','brand','web','growth'];
  const section = cleanString(payload?.section, 30);
  if (!allowed.includes(section)) return json({ error: 'قسم غير صالح.' }, 400);
  const current = await env.DB.prepare('SELECT visited_sections FROM client_progress WHERE client_uid=?').bind(client.uid).first();
  const sections = new Set(Array.isArray(safeJsonParse(current?.visited_sections)) ? safeJsonParse(current.visited_sections) : []);
  sections.add(section);
  const visited = [...sections].filter((item) => allowed.includes(item)), score = Math.min(100, visited.length * 12 + (visited.length === allowed.length ? 4 : 0));
  await env.DB.prepare(`INSERT INTO client_progress (client_uid,visited_sections,score,updated_at) VALUES (?,?,?,?) ON CONFLICT(client_uid) DO UPDATE SET visited_sections=excluded.visited_sections,score=excluded.score,updated_at=excluded.updated_at`)
    .bind(client.uid, JSON.stringify(visited), score, Date.now()).run();
  return json({ visited, score });
}

async function approveClientDelivery(env, client, id) {
  const result = await env.DB.prepare("UPDATE client_deliveries SET status='approved',approved_at=?,updated_at=? WHERE id=? AND client_uid=?").bind(Date.now(), Date.now(), id, client.uid).run();
  if (!result.meta?.changes) return json({ error: 'التسليم غير موجود.' }, 404);
  return json({ ok: true });
}

async function getClientDeliveryFile(env, client, id) {
  const file = await env.DB.prepare('SELECT object_key,original_name,content_type FROM client_deliveries WHERE id=? AND client_uid=?').bind(id, client.uid).first();
  if (!file) return new Response('Not found', { status: 404 });
  const object = await env.UPLOADS.get(file.object_key);
  if (!object) return new Response('Not found', { status: 404 });
  return new Response(object.body, { headers: { 'Content-Type': file.content_type, 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.original_name)}`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}

async function createClientProjectByEmployee(request, env, user) {
  const payload = await readJson(request, 7000);
  const clientUid = cleanString(payload?.clientUid, 128);
  const title = cleanString(payload?.title, 160);
  if (!clientUid || !title) return json({ error: 'اختر العميل واكتب اسم المشروع.' }, 400);
  const client = await env.DB.prepare('SELECT firebase_uid FROM client_profiles WHERE firebase_uid=?').bind(clientUid).first();
  if (!client) return json({ error: 'حساب العميل غير موجود.' }, 404);
  const id = crypto.randomUUID(), now = Date.now();
  const status = CLIENT_PROJECT_STATUSES.includes(payload.status) ? payload.status : 'new';
  const progress = Math.max(0, Math.min(100, Number(payload.progress || 0)));
  const deadline = /^\d{4}-\d{2}-\d{2}$/.test(String(payload.deadline || '')) ? payload.deadline : '';
  await env.DB.prepare(`INSERT INTO client_projects
    (id,client_uid,title,service,summary,status,progress,current_stage,deadline,created_by,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, clientUid, title, cleanString(payload.service, 160), cleanString(payload.summary, 1800), status, progress, cleanString(payload.currentStage, 160), deadline, user.username, now, now).run();
  return json({ id }, 201);
}

async function updateClientProjectByEmployee(request, env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف المشروع غير صحيح.' }, 400);
  const current = await env.DB.prepare('SELECT * FROM client_projects WHERE id=?').bind(id).first();
  if (!current) return json({ error: 'المشروع غير موجود.' }, 404);
  const payload = await readJson(request, 7000);
  const status = CLIENT_PROJECT_STATUSES.includes(payload.status) ? payload.status : current.status;
  const progress = Number.isFinite(Number(payload.progress)) ? Math.max(0, Math.min(100, Number(payload.progress))) : current.progress;
  const deadline = payload.deadline === undefined ? current.deadline : (/^\d{4}-\d{2}-\d{2}$/.test(String(payload.deadline || '')) ? payload.deadline : '');
  await env.DB.prepare(`UPDATE client_projects SET title=?,service=?,summary=?,status=?,progress=?,current_stage=?,deadline=?,updated_at=? WHERE id=?`)
    .bind(cleanString(payload.title ?? current.title, 160), cleanString(payload.service ?? current.service, 160), cleanString(payload.summary ?? current.summary, 1800), status, progress, cleanString(payload.currentStage ?? current.current_stage, 160), deadline, Date.now(), id).run();
  return json({ ok: true });
}

async function updateClientRequestByEmployee(request, env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف الطلب غير صحيح.' }, 400);
  const current = await env.DB.prepare('SELECT id,status,employee_note FROM client_requests WHERE id=?').bind(id).first();
  if (!current) return json({ error: 'الطلب غير موجود.' }, 404);
  const payload = await readJson(request, 3500);
  const status = CLIENT_REQUEST_STATUSES.includes(payload.status) ? payload.status : current.status;
  await env.DB.prepare('UPDATE client_requests SET status=?,employee_note=?,updated_by=?,updated_at=? WHERE id=?')
    .bind(status, cleanString(payload.employeeNote ?? current.employee_note, 2000), user.username, Date.now(), id).run();
  return json({ ok: true });
}

async function createClientDelivery(request, env, user) {
  if (!env.UPLOADS) return json({ error: 'مخزن الملفات غير متاح.' }, 503);
  const form = await request.formData();
  const clientUid = cleanString(form.get('clientUid'), 128);
  const title = cleanString(form.get('title'), 160);
  const projectId = cleanString(form.get('projectId'), 64);
  const file = form.get('file');
  if (!clientUid || !title || !file || typeof file.arrayBuffer !== 'function' || !file.size) return json({ error: 'اختر العميل وأرفق ملف التسليم.' }, 400);
  if (file.size > 20 * 1024 * 1024) return json({ error: 'ملف التسليم يجب ألا يتجاوز 20MB.' }, 400);
  const extension = cleanString(file.name, 180).split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_FILE_EXTENSIONS.has(extension) || !await fileSignatureAllowed(file, extension)) return json({ error: 'نوع ملف التسليم غير مسموح أو محتواه غير صحيح.' }, 400);
  const profile = await env.DB.prepare('SELECT firebase_uid FROM client_profiles WHERE firebase_uid=?').bind(clientUid).first();
  if (!profile) return json({ error: 'حساب العميل غير موجود.' }, 404);
  if (projectId) {
    const project = await env.DB.prepare('SELECT id FROM client_projects WHERE id=? AND client_uid=?').bind(projectId, clientUid).first();
    if (!project) return json({ error: 'المشروع لا يتبع هذا العميل.' }, 400);
  }
  const id = crypto.randomUUID(), now = Date.now(), safeName = cleanFileName(file.name);
  const objectKey = `client-deliveries/${clientUid}/${id}-${safeName}`;
  await env.UPLOADS.put(objectKey, await file.arrayBuffer(), { httpMetadata: { contentType: cleanString(file.type, 120) || 'application/octet-stream' }, customMetadata: { clientUid, originalName: safeName, uploadedBy: user.username } });
  await env.DB.prepare(`INSERT INTO client_deliveries
    (id,client_uid,project_id,title,message,object_key,original_name,content_type,size_bytes,status,created_by,approved_at,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,'delivered',?,0,?,?)`).bind(id, clientUid, projectId, title, cleanString(form.get('message'), 2000), objectKey, safeName, cleanString(file.type, 120) || 'application/octet-stream', file.size, user.username, now, now).run();
  return json({ id }, 201);
}

async function createEmployeeSupportMessage(request, env, user, ticketId) {
  if (!isUuid(ticketId)) return json({ error: 'معرّف التذكرة غير صحيح.' }, 400);
  const ticket = await env.DB.prepare('SELECT id,status FROM client_support_tickets WHERE id=?').bind(ticketId).first();
  if (!ticket) return json({ error: 'التذكرة غير موجودة.' }, 404);
  const payload = await readJson(request, 4000), body = cleanString(payload?.body, 2500);
  if (!body) return json({ error: 'اكتب الرد أولًا.' }, 400);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO client_support_messages (id,ticket_id,sender_type,sender_id,sender_name,body,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(), ticketId, 'employee', user.username, user.name, body, now),
    env.DB.prepare("UPDATE client_support_tickets SET status='waiting_client',updated_at=? WHERE id=?").bind(now, ticketId),
    env.DB.prepare('DELETE FROM client_support_messages WHERE ticket_id=? AND id NOT IN (SELECT id FROM client_support_messages WHERE ticket_id=? ORDER BY created_at DESC LIMIT 100)').bind(ticketId, ticketId)
  ]);
  return json({ ok: true });
}

async function updateSupportTicketByEmployee(request, env, user, ticketId) {
  if (!isUuid(ticketId)) return json({ error: 'معرّف التذكرة غير صحيح.' }, 400);
  const payload = await readJson(request, 1000);
  const status = ['open','in_progress','waiting_client','resolved','closed'].includes(payload?.status) ? payload.status : '';
  if (!status) return json({ error: 'حالة التذكرة غير صحيحة.' }, 400);
  const now = Date.now(), resolvedAt = ['resolved','closed'].includes(status) ? now : 0;
  const result = await env.DB.prepare('UPDATE client_support_tickets SET status=?,resolved_at=?,updated_at=? WHERE id=?').bind(status, resolvedAt, now, ticketId).run();
  if (!result.meta?.changes) return json({ error: 'التذكرة غير موجودة.' }, 404);
  return json({ ok: true });
}

async function login(request, env) {
  if (!env.EMPLOYEE_AUTH_CONFIG || !env.EMPLOYEE_SESSION_SECRET || !env.EMPLOYEE_PASSWORD_PEPPER) {
    return json({ error: 'تهيئة الأمان غير مكتملة حاليًا.' }, 503);
  }
  const payload = await readJson(request, 4000);
  if (!payload) return json({ error: 'بيانات الدخول غير صحيحة.' }, 400);

  const username = cleanString(payload.username, 32).toUpperCase();
  const password = typeof payload.password === 'string' ? payload.password : '';
  if (!/^[A-Z0-9._-]{2,32}$/.test(username) || password.length < 1 || password.length > 200) {
    return json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, 401);
  }

  const now = Math.floor(Date.now() / 1000);
  const ip = cleanString(request.headers.get('CF-Connecting-IP') || 'unknown', 80);
  const attemptKey = await sha256Base64(`${username}|${ip}`);
  const attempts = await env.DB.prepare(
    'SELECT failures, locked_until FROM employee_login_attempts WHERE attempt_key = ?'
  ).bind(attemptKey).first();

  if (attempts && Number(attempts.locked_until) > now) {
    return json({ error: 'محاولات كثيرة. حاول مرة أخرى بعد 15 دقيقة.' }, 429);
  }

  const config = readAuthConfig(env);
  const account = config.users[username];
  const comparisonAccount = account || config.dummy || Object.values(config.users)[0];
  const verified = comparisonAccount
    ? await verifyPassword(password, comparisonAccount, env.EMPLOYEE_PASSWORD_PEPPER)
    : false;

  if (!account || !verified) {
    const failures = Number(attempts?.failures || 0) + 1;
    const lockedUntil = failures >= LOGIN_LIMIT ? now + LOGIN_LOCK_SECONDS : 0;
    await env.DB.prepare(
      `INSERT INTO employee_login_attempts (attempt_key, failures, locked_until, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(attempt_key) DO UPDATE SET failures = excluded.failures,
       locked_until = excluded.locked_until, updated_at = excluded.updated_at`
    ).bind(attemptKey, failures, lockedUntil, now).run();
    return json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, 401);
  }

  await env.DB.prepare('DELETE FROM employee_login_attempts WHERE attempt_key = ?').bind(attemptKey).run();
  const user = { username, name: cleanString(account.name || username, 60), role: roleForUsername(username) };
  const token = await createSession(user, env);
  return json({ user }, 200, { 'Set-Cookie': sessionCookie(token) });
}

async function getPortalData(env, user) {
  user.role = roleForUsername(user.username);
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO employee_presence (username, name, role, last_seen_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(username) DO UPDATE SET name = excluded.name, role = excluded.role, last_seen_at = excluded.last_seen_at`
  ).bind(user.username, user.name, user.role, now).run();
  const results = await env.DB.batch([
    env.DB.prepare('SELECT id, group_id, author_username, author_name, body, attachment_name, attachment_type, attachment_size, created_at FROM employee_messages ORDER BY created_at DESC LIMIT 600'),
    env.DB.prepare('SELECT id, name, contact, service, value, status, pipeline_stage, next_step, owner, created_by, created_at, updated_at FROM employee_clients ORDER BY updated_at DESC LIMIT 500'),
    env.DB.prepare('SELECT id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at FROM employee_tasks ORDER BY status ASC, due_date ASC, updated_at DESC LIMIT 250'),
    env.DB.prepare('SELECT id, reference, full_name, organization, email, phone, services, budget_range, project_summary, payload_json, status, attachment_count, email_status, created_at, updated_at FROM client_applications ORDER BY created_at DESC LIMIT 250'),
    env.DB.prepare('SELECT id, application_id, original_name, content_type, size_bytes, created_at FROM client_application_files ORDER BY created_at ASC LIMIT 1000'),
    env.DB.prepare('SELECT * FROM business_leads ORDER BY city ASC, priority ASC, score DESC, neighborhood ASC, name ASC LIMIT 5000'),
    env.DB.prepare('SELECT username, name, role, last_seen_at FROM employee_presence WHERE last_seen_at >= ? ORDER BY last_seen_at DESC LIMIT 20').bind(now - 90_000),
    hasRole(user, 'manager')
      ? env.DB.prepare(`SELECT id, actor_username, actor_name, actor_role, action, entity_type, entity_id, detail, created_at
          FROM employee_activity_log
          WHERE action IN ('حذف طلب موقع','إضافة عميل','حذف عميل','حذف مهمة','حذف فرصة','توزيع تصنيف فرص','تحويل فرصة إلى عميل','إضافة باقة','تحديث باقة','إخفاء باقة')
          ORDER BY created_at DESC LIMIT 100`)
      : env.DB.prepare('SELECT id, actor_username, actor_name, actor_role, action, entity_type, entity_id, detail, created_at FROM employee_activity_log WHERE 0'),
    env.DB.prepare('SELECT firebase_uid,email,display_name,organization,phone,photo_url,created_at,updated_at FROM client_profiles ORDER BY updated_at DESC LIMIT 500'),
    env.DB.prepare('SELECT id,client_uid,title,service,summary,status,progress,current_stage,deadline,created_by,created_at,updated_at FROM client_projects ORDER BY updated_at DESC LIMIT 1000'),
    env.DB.prepare('SELECT id,client_uid,project_id,title,type,details,priority,status,employee_note,updated_by,created_at,updated_at FROM client_requests ORDER BY updated_at DESC LIMIT 1000'),
    env.DB.prepare('SELECT id,client_uid,project_id,title,message,original_name,content_type,size_bytes,status,created_by,approved_at,created_at,updated_at FROM client_deliveries ORDER BY created_at DESC LIMIT 1000'),
    env.DB.prepare('SELECT id,client_uid,subject,category,status,priority,created_at,updated_at,resolved_at FROM client_support_tickets ORDER BY updated_at DESC LIMIT 1000'),
    env.DB.prepare('SELECT id,ticket_id,sender_type,sender_id,sender_name,body,created_at FROM client_support_messages ORDER BY created_at ASC LIMIT 5000'),
    env.DB.prepare('SELECT id,name,audience,category,price,cadence,summary,facts_json,is_active,sort_order,created_by,created_at,updated_at FROM service_packages ORDER BY sort_order ASC, updated_at DESC LIMIT 200')
  ]);
  const messages = [...(results[0].results || [])].reverse();
  const clients = (results[1].results || []).map((item) => ({ ...item, legacy_status: item.status, status: item.pipeline_stage || item.status }));
  const tasks = results[2].results || [];
  const files = results[4].results || [];
  const leads = results[5].results || [];
  const onlineUsers = results[6].results || [];
  const activityLog = results[7].results || [];
  const clientProfiles = results[8].results || [];
  const clientProjects = results[9].results || [];
  const clientRequests = results[10].results || [];
  const clientDeliveries = results[11].results || [];
  const clientSupportTickets = results[12].results || [];
  const clientSupportMessages = results[13].results || [];
  const packages = (results[14].results || []).map((item) => ({ ...item, facts: safeJsonParse(item.facts_json) || [] }));
  const authConfig = readAuthConfig(env);
  const teamMembers = Object.entries(authConfig.users || {}).map(([username, account]) => ({
    username: String(username).toUpperCase(),
    name: cleanString(account?.name || username, 60),
    role: roleForUsername(username),
  })).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  const applications = (results[3].results || []).map((application) => ({
    ...application,
    details: safeJsonParse(application.payload_json),
    files: files.filter((file) => file.application_id === application.id)
  }));
  return json({
    user,
    messages,
    clients,
    tasks,
    applications,
    leads,
    onlineUsers,
    teamMembers,
    activityLog,
    clientProfiles,
    clientProjects,
    clientRequests,
    clientDeliveries,
    clientSupportTickets,
    clientSupportMessages,
    packages,
    stats: {
      clients: clients.filter((item) => ['won','active','retained','closed'].includes(item.status)).length,
      opportunities: clients.filter((item) => ['lead', 'discovery', 'proposal'].includes(item.status)).length,
      targetingOpportunities: leads.filter((item) => item.contact_status !== 'converted').length,
      active: clients.filter((item) => ['won','active','retained'].includes(item.status)).length,
      openTasks: tasks.filter((item) => item.status === 'open').length,
      pipelineValue: clients.filter((item) => ['lead','discovery','proposal'].includes(item.status)).reduce((sum,item)=>sum+Number(item.value||0),0),
      activeClientValue: clients.filter((item) => ['won','active','retained'].includes(item.status)).reduce((sum,item)=>sum+Number(item.value||0),0),
      closedDeals: clients.filter((item) => item.status === 'closed').length,
      lostOpportunities: clients.filter((item) => item.status === 'lost').length,
      newApplications: applications.filter((item) => item.status === 'new').length,
      businessLeads: leads.length,
      untouchedLeads: leads.filter((item) => item.contact_status === 'new').length
    },
    knowledge: KNOWLEDGE,
    serverTime: Date.now()
  });
}

async function createPublicApplication(request, env, url, ctx) {
  if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
  if (!env.DB) return json({ error: 'تعذر استقبال الطلب الآن. حاول مرة أخرى لاحقاً.' }, 503);
  await ensureSchema(env);
  const client = await readClientSession(request, env);
  if (!client) return json({ error: 'سجّل دخولك كعميل أولًا.' }, 401);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 85 * 1024 * 1024) return json({ error: 'حجم الطلب والملفات أكبر من الحد المسموح.' }, 413);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'تعذر قراءة النموذج المرسل.' }, 400); }
  if (cleanString(form.get('website_confirm'), 100)) return json({ ok: true, reference: 'NM-RECEIVED' }, 202);
  const startedAt = Number(form.get('form_started_at') || 0);
  if (!startedAt || Date.now() - startedAt < 2500) return json({ error: 'تحقق من البيانات ثم حاول الإرسال مرة أخرى.' }, 400);

  const allowedServices = ['إدارة الحضور الرقمي', 'المحتوى والإنتاج الإبداعي', 'الهوية والعلامة التجارية', 'المواقع والتجارب الرقمية', 'النمو والتسويق الرقمي'];
  const services = [...new Set(form.getAll('services').map((item) => cleanString(item, 80)).filter((item) => allowedServices.includes(item)))];
  const payload = {
    full_name: cleanString(form.get('full_name'), 120),
    email: cleanString(form.get('email'), 160).toLowerCase(),
    phone: cleanString(form.get('phone'), 30),
    organization: cleanString(form.get('organization'), 140),
    job_title: cleanString(form.get('job_title'), 100),
    industry: cleanString(form.get('industry'), 120),
    location: cleanString(form.get('location'), 100),
    website_url: cleanString(form.get('website_url'), 240),
    social_accounts: cleanString(form.get('social_accounts'), 1000),
    services,
    project_summary: cleanString(form.get('project_summary'), 700),
    project_details: cleanString(form.get('project_details'), 5000),
    primary_goal: cleanString(form.get('primary_goal'), 180),
    target_audience: cleanString(form.get('target_audience'), 500),
    current_challenge: cleanString(form.get('current_challenge'), 1600),
    competitors: cleanString(form.get('competitors'), 1000),
    references: cleanString(form.get('references'), 1000),
    engagement_type: cleanString(form.get('engagement_type'), 120),
    budget_range: cleanString(form.get('budget_range'), 120),
    media_budget: cleanString(form.get('media_budget'), 120),
    start_window: cleanString(form.get('start_window'), 120),
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(String(form.get('deadline') || '')) ? String(form.get('deadline')) : '',
    decision_readiness: cleanString(form.get('decision_readiness'), 140),
    referral_source: cleanString(form.get('referral_source'), 120),
    previous_agency: cleanString(form.get('previous_agency'), 140),
    scope_notes: cleanString(form.get('scope_notes'), 1600),
    consent: form.get('consent') === 'accepted'
  };

  const required = [payload.full_name, payload.email, payload.phone, payload.organization, payload.industry,
    payload.project_summary, payload.project_details, payload.primary_goal, payload.target_audience,
    payload.engagement_type, payload.budget_range, payload.start_window, payload.decision_readiness];
  if (required.some((value) => !value) || !services.length || !payload.consent) {
    return json({ error: 'بعض الحقول المطلوبة ناقصة. راجع النموذج ثم أرسله مرة أخرى.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) return json({ error: 'اكتب بريداً إلكترونياً صحيحاً.' }, 400);
  if (!/^[+\d][\d\s()-]{7,29}$/.test(payload.phone)) return json({ error: 'اكتب رقم جوال صحيحاً مع مفتاح الدولة.' }, 400);

  const files = form.getAll('attachments').filter((item) => item && typeof item === 'object' && typeof item.arrayBuffer === 'function' && item.size > 0);
  if (files.length > MAX_APPLICATION_FILES) return json({ error: `يمكن رفع ${MAX_APPLICATION_FILES} ملفات كحد أقصى.` }, 400);
  for (const file of files) {
    const extension = cleanString(file.name, 180).split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_FILE_EXTENSIONS.has(extension)) return json({ error: `نوع الملف «${cleanString(file.name, 180)}» غير مسموح.` }, 400);
    if (file.size > MAX_APPLICATION_FILE_SIZE) return json({ error: `الملف «${cleanString(file.name, 180)}» أكبر من 10MB.` }, 400);
    if (!await fileSignatureAllowed(file, extension)) return json({ error: `محتوى الملف «${cleanString(file.name, 180)}» لا يطابق نوعه.` }, 400);
  }
  if (files.length && !env.UPLOADS) return json({ error: 'رفع الملفات غير متاح مؤقتاً. أرسل الطلب بدون ملفات أو حاول لاحقاً.' }, 503);

  const ip = cleanString(request.headers.get('CF-Connecting-IP') || 'unknown', 80);
  const attemptKey = await sha256Base64(`application|${ip}`);
  const limit = await env.DB.prepare('SELECT last_created_at FROM website_application_limits WHERE attempt_key = ?').bind(attemptKey).first();
  if (limit && Date.now() - Number(limit.last_created_at) < 120000) {
    return json({ error: 'تم استلام طلب من هذا الاتصال قبل قليل. انتظر دقيقتين قبل إرسال طلب آخر.' }, 429);
  }

  const now = Date.now();
  const id = crypto.randomUUID();
  const taskId = crypto.randomUUID();
  const reference = applicationReference(now, id);
  const serviceLabel = services.join('، ');
  const estimatedValue = budgetEstimate(payload.budget_range);
  const emailStatus = env.RESEND_API_KEY ? 'queued' : 'not_configured';
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO client_applications
       (id, client_uid, reference, full_name, organization, email, phone, services, budget_range, project_summary,
        payload_json, status, attachment_count, email_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?)`
    ).bind(id, client.uid, reference, payload.full_name, payload.organization, payload.email, payload.phone, serviceLabel,
      payload.budget_range, payload.project_summary, JSON.stringify(payload), files.length, emailStatus, now, now),
     env.DB.prepare(
       `INSERT INTO employee_clients
        (id, name, contact, service, value, status, pipeline_stage, next_step, owner, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'lead', 'lead', ?, '', 'WEBSITE', ?, ?)`
    ).bind(id, payload.organization || payload.full_name, `${payload.phone} · ${payload.email}`, serviceLabel,
      estimatedValue, `مراجعة طلب الموقع ${reference} والتواصل مع ${payload.full_name}`, now, now),
    env.DB.prepare(
      `INSERT INTO employee_tasks
       (id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, '', '', 'high', 'open', 'WEBSITE', ?, ?)`
    ).bind(taskId, `مراجعة طلب الموقع. ${reference}`, payload.organization || payload.full_name, now, now),
    env.DB.prepare(
      `INSERT INTO website_application_limits (attempt_key, last_created_at, updated_at)
       VALUES (?, ?, ?) ON CONFLICT(attempt_key) DO UPDATE SET last_created_at = excluded.last_created_at, updated_at = excluded.updated_at`
    ).bind(attemptKey, now, now)
  ]);

  if (files.length) {
    const metadataStatements = [];
    for (const file of files) {
      const fileId = crypto.randomUUID();
      const safeName = cleanFileName(file.name);
      const objectKey = `applications/${id}/${fileId}-${safeName}`;
      await env.UPLOADS.put(objectKey, await file.arrayBuffer(), {
        httpMetadata: { contentType: cleanString(file.type, 120) || 'application/octet-stream' },
        customMetadata: { applicationId: id, reference, originalName: safeName }
      });
      metadataStatements.push(env.DB.prepare(
        `INSERT INTO client_application_files
         (id, application_id, object_key, original_name, content_type, size_bytes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(fileId, id, objectKey, safeName, cleanString(file.type, 120) || 'application/octet-stream', file.size, now));
    }
    if (metadataStatements.length) await env.DB.batch(metadataStatements);
  }

  if (env.RESEND_API_KEY) {
    const notification = sendApplicationEmail(env, { ...payload, id, reference, serviceLabel, attachmentCount: files.length })
      .then((sent) => env.DB.prepare('UPDATE client_applications SET email_status = ?, updated_at = ? WHERE id = ?').bind(sent ? 'sent' : 'failed', Date.now(), id).run())
      .catch(() => env.DB.prepare('UPDATE client_applications SET email_status = ?, updated_at = ? WHERE id = ?').bind('failed', Date.now(), id).run());
    ctx?.waitUntil(notification);
  }

  return json({ ok: true, id, reference }, 201);
}

async function updateApplication(request, env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف الطلب غير صحيح.' }, 400);
  const payload = await readJson(request, 3000);
  const status = cleanString(payload?.status, 30);
  if (!APPLICATION_STATUSES.includes(status)) return json({ error: 'حالة الطلب غير صحيحة.' }, 400);
  const result = await env.DB.prepare('UPDATE client_applications SET status = ?, updated_at = ? WHERE id = ?').bind(status, Date.now(), id).run();
  if (!result.meta?.changes) return json({ error: 'الطلب غير موجود.' }, 404);
  return json({ ok: true });
}

async function deleteApplication(env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف الطلب غير صحيح.' }, 400);
  const application = await env.DB.prepare('SELECT id, reference FROM client_applications WHERE id = ?').bind(id).first();
  if (!application) return json({ error: 'الطلب غير موجود.' }, 404);
  const files = await env.DB.prepare('SELECT object_key FROM client_application_files WHERE application_id = ?').bind(id).all();
  if (env.UPLOADS) {
    for (const file of files.results || []) {
      await env.UPLOADS.delete(file.object_key);
    }
  }
  await env.DB.batch([
    env.DB.prepare('DELETE FROM client_application_files WHERE application_id = ?').bind(id),
    env.DB.prepare('DELETE FROM client_applications WHERE id = ?').bind(id),
    env.DB.prepare('DELETE FROM employee_clients WHERE id = ? AND created_by = ?').bind(id, 'WEBSITE'),
    env.DB.prepare("DELETE FROM employee_tasks WHERE created_by = ? AND title LIKE ?").bind('WEBSITE', `%${application.reference}%`)
  ]);
  await recordActivity(env, user, 'حذف طلب موقع', 'application', id, application.reference);
  return json({ ok: true });
}

async function getApplicationFile(env, id) {
  if (!isUuid(id)) return json({ error: 'معرّف الملف غير صحيح.' }, 400);
  if (!env.UPLOADS) return json({ error: 'مخزن الملفات غير متاح.' }, 503);
  const file = await env.DB.prepare('SELECT object_key, original_name, content_type FROM client_application_files WHERE id = ?').bind(id).first();
  if (!file) return json({ error: 'الملف غير موجود.' }, 404);
  const object = await env.UPLOADS.get(file.object_key);
  if (!object) return json({ error: 'الملف غير موجود.' }, 404);
  const headers = new Headers();
  headers.set('Content-Type', file.content_type || 'application/octet-stream');
  headers.set('Content-Disposition', `attachment; filename="${cleanFileName(file.original_name)}"`);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}

async function sendApplicationEmail(env, application) {
  const recipient = cleanString(env.CONTACT_NOTIFICATION_EMAIL || 'newmediahc@gmail.com', 160);
  const sender = cleanString(env.CONTACT_FROM_EMAIL || 'NEW MEDIA Website <onboarding@resend.dev>', 200);
  const text = [
    `طلب مشروع جديد: ${application.reference}`,
    `الاسم: ${application.full_name}`,
    `المنظمة: ${application.organization}`,
    `الجوال: ${application.phone}`,
    `البريد: ${application.email}`,
    `الخدمات: ${application.serviceLabel}`,
    `الميزانية: ${application.budget_range}`,
    `موعد البدء: ${application.start_window}`,
    `الملخص: ${application.project_summary}`,
    `عدد المرفقات: ${application.attachmentCount}`,
    '',
    'التفاصيل الكاملة موجودة داخل مساحة عمل الموظفين.'
  ].join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: sender, to: [recipient], reply_to: application.email, subject: `طلب جديد ${application.reference}. ${application.organization}`, text })
  });
  return response.ok;
}

function applicationReference(timestamp, id) {
  const date = new Date(timestamp);
  const stamp = `${String(date.getUTCFullYear()).slice(-2)}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
  return `NM-${stamp}-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

function budgetEstimate(range) {
  if (range.includes('أكثر من 100,000')) return 125000;
  if (range.includes('50,000 إلى 100,000')) return 75000;
  if (range.includes('25,000 إلى 50,000')) return 37500;
  if (range.includes('10,000 إلى 25,000')) return 17500;
  if (range.includes('5,000 إلى 10,000')) return 7500;
  if (range.includes('أقل من 5,000')) return 4000;
  return 0;
}

function cleanFileName(value) {
  return cleanString(String(value || 'file').replace(/[\\/:*?"<>|]/g, '-'), 140) || 'file';
}

function safeJsonParse(value) {
  try { return JSON.parse(value || '{}'); } catch { return {}; }
}

async function createMessage(request, env, user) {
  const contentType = request.headers.get('Content-Type') || '';
  let body = '';
  let groupId = 'general';
  let file = null;
  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData().catch(() => null);
    if (!form) return json({ error: 'تعذر قراءة الرسالة.' }, 400);
    body = cleanString(form.get('body'), 1000);
    groupId = cleanString(form.get('groupId'), 60);
    const candidate = form.get('pdf');
    if (candidate && typeof candidate === 'object' && 'size' in candidate && candidate.size > 0) file = candidate;
  } else {
    const payload = await readJson(request, 5000);
    body = cleanString(payload?.body, 1000);
    groupId = cleanString(payload?.groupId, 60);
  }
  if (!CHAT_GROUPS.includes(groupId)) groupId = 'general';
  if (!body && !file) return json({ error: 'اكتب رسالة أو أرفق ملف PDF.' }, 400);
  if (file && (!env.UPLOADS || file.size > MAX_CHAT_PDF_SIZE || (file.type !== 'application/pdf' && !String(file.name).toLowerCase().endsWith('.pdf')))) {
    return json({ error: file?.size > MAX_CHAT_PDF_SIZE ? 'حجم ملف PDF يجب ألا يتجاوز 8 ميجابايت.' : 'المرفق يجب أن يكون ملف PDF.' }, 400);
  }
  if (file && !await fileSignatureAllowed(file, 'pdf')) return json({ error: 'محتوى المرفق ليس ملف PDF صالحًا.' }, 400);
  const message = {
    id: crypto.randomUUID(),
    group_id: groupId,
    author_username: user.username,
    author_name: user.name,
    body: body || `ملف PDF: ${cleanFileName(file.name)}`,
    attachment_key: '',
    attachment_name: '',
    attachment_type: '',
    attachment_size: 0,
    created_at: Date.now()
  };
  if (file) {
    message.attachment_name = cleanFileName(file.name);
    message.attachment_type = 'application/pdf';
    message.attachment_size = file.size;
    message.attachment_key = `team-chat/${groupId}/${message.id}-${message.attachment_name}`;
    await env.UPLOADS.put(message.attachment_key, await file.arrayBuffer(), {
      httpMetadata: { contentType: 'application/pdf' },
      customMetadata: { messageId: message.id, groupId, originalName: message.attachment_name }
    });
  }
  try {
    await env.DB.prepare(
      `INSERT INTO employee_messages
       (id, group_id, author_username, author_name, body, attachment_key, attachment_name, attachment_type, attachment_size, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(message.id, message.group_id, message.author_username, message.author_name, message.body,
      message.attachment_key, message.attachment_name, message.attachment_type, message.attachment_size, message.created_at).run();
  } catch (error) {
    if (message.attachment_key) await env.UPLOADS.delete(message.attachment_key);
    throw error;
  }
  await pruneChatGroup(env, groupId);
  return json({ message }, 201);
}

async function getMessageFile(env, id) {
  if (!isUuid(id)) return json({ error: 'معرّف المرفق غير صحيح.' }, 400);
  if (!env.UPLOADS) return json({ error: 'مخزن الملفات غير متاح.' }, 503);
  const message = await env.DB.prepare(
    'SELECT attachment_key, attachment_name, attachment_type FROM employee_messages WHERE id = ?'
  ).bind(id).first();
  if (!message?.attachment_key) return json({ error: 'المرفق غير موجود.' }, 404);
  const object = await env.UPLOADS.get(message.attachment_key);
  if (!object) return json({ error: 'المرفق غير موجود.' }, 404);
  const headers = new Headers();
  headers.set('Content-Type', message.attachment_type || 'application/pdf');
  headers.set('Content-Disposition', `attachment; filename="${cleanFileName(message.attachment_name)}"`);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}

async function createSystemMessage(env, body) {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO employee_messages (id, group_id, author_username, author_name, body, created_at)
     VALUES (?, 'general', 'SYSTEM', 'NEW MEDIA SYSTEM', ?, ?)`
  ).bind(id, cleanString(body, 1000), Date.now()).run();
  await pruneChatGroup(env, 'general');
}

async function pruneChatGroup(env, groupId) {
  const overflow = await env.DB.prepare(
    `SELECT id, attachment_key FROM employee_messages WHERE group_id = ?
     ORDER BY created_at DESC LIMIT 1000 OFFSET ?`
  ).bind(groupId, MAX_CHAT_MESSAGES_PER_GROUP).all();
  const rows = overflow.results || [];
  for (const row of rows) if (row.attachment_key && env.UPLOADS) await env.UPLOADS.delete(row.attachment_key);
  if (rows.length) await env.DB.batch(rows.map((row) => env.DB.prepare('DELETE FROM employee_messages WHERE id = ?').bind(row.id)));
}

async function createClient(request, env, user) {
  const payload = await readJson(request, 12000);
  if (!payload) return json({ error: 'تعذر قراءة البيانات.' }, 400);
  const client = normalizeClient(payload);
  if (!client.name) return json({ error: 'اسم العميل مطلوب.' }, 400);
  const now = Date.now();
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO employee_clients
     (id, name, contact, service, value, status, pipeline_stage, next_step, owner, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, client.name, client.contact, client.service, client.value, legacyClientStatus(client.status), client.status, client.nextStep, client.owner, user.username, now, now).run();
  await recordActivity(env, user, 'إضافة عميل', 'client', id, client.name);
  if (client.status === 'won') await createSystemMessage(env, `🎉 مبروك! تم إقفال صفقة «${client.name}» بنجاح.`);
  return json({ ok: true, id }, 201);
}

async function updateClient(request, env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف العميل غير صحيح.' }, 400);
  const payload = await readJson(request, 12000);
  if (!payload) return json({ error: 'تعذر قراءة البيانات.' }, 400);
  const current = await env.DB.prepare('SELECT * FROM employee_clients WHERE id = ?').bind(id).first();
  if (!current) return json({ error: 'العميل غير موجود.' }, 404);
  const merged = normalizeClient({
    name: payload.name ?? current.name,
    contact: payload.contact ?? current.contact,
    service: payload.service ?? current.service,
    value: payload.value ?? current.value,
    status: payload.status ?? current.pipeline_stage ?? current.status,
    nextStep: payload.nextStep ?? current.next_step,
    owner: payload.owner ?? current.owner
  });
  if (!merged.name) return json({ error: 'اسم العميل مطلوب.' }, 400);
  await env.DB.prepare(
    `UPDATE employee_clients SET name = ?, contact = ?, service = ?, value = ?, status = ?, pipeline_stage = ?,
     next_step = ?, owner = ?, updated_at = ? WHERE id = ?`
  ).bind(merged.name, merged.contact, merged.service, merged.value, legacyClientStatus(merged.status), merged.status, merged.nextStep, merged.owner, Date.now(), id).run();
  if ((current.pipeline_stage || current.status) !== 'won' && merged.status === 'won') {
    await createSystemMessage(env, `🎉 مبروك! تم إقفال صفقة «${merged.name}» بنجاح.`);
  }
  return json({ ok: true });
}

async function deleteClient(env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف العميل غير صحيح.' }, 400);
  const client = await env.DB.prepare('SELECT id, created_by FROM employee_clients WHERE id = ?').bind(id).first();
  if (!client) return json({ error: 'العميل غير موجود.' }, 404);
  if (client.created_by === 'WEBSITE') {
    const application = await env.DB.prepare('SELECT id FROM client_applications WHERE id = ?').bind(id).first();
    if (application) return deleteApplication(env, user, id);
  }
  await env.DB.prepare('DELETE FROM employee_clients WHERE id = ?').bind(id).run();
  await recordActivity(env, user, 'حذف عميل', 'client', id);
  return json({ ok: true });
}

function normalizeServicePackage(payload) {
  const numericPrice = Number(payload?.price || 0);
  const factsInput = Array.isArray(payload?.facts) ? payload.facts : String(payload?.facts || '').split(/\r?\n/);
  return {
    name: cleanString(payload?.name, 120),
    audience: cleanString(payload?.audience, 120),
    category: cleanString(payload?.category, 80),
    price: Number.isFinite(numericPrice) ? Math.max(0, Math.min(numericPrice, 1_000_000_000)) : 0,
    cadence: cleanString(payload?.cadence, 40) || 'للمشروع',
    summary: cleanString(payload?.summary, 600),
    facts: factsInput.map((fact) => cleanString(String(fact), 140)).filter(Boolean).slice(0, 12),
    isActive: payload?.isActive === true || payload?.isActive === 1 || ['1','true','on'].includes(String(payload?.isActive || '').toLowerCase()),
    sortOrder: Math.max(0, Math.min(Number(payload?.sortOrder || 0) || 0, 10000))
  };
}

function validPackageId(id) { return /^[a-z0-9-]{3,80}$/i.test(id || ''); }

async function createServicePackage(request, env, user) {
  const payload = await readJson(request, 16000);
  if (!payload) return json({ error: 'تعذر قراءة بيانات الباقة.' }, 400);
  const item = normalizeServicePackage(payload);
  if (!item.name || !item.summary) return json({ error: 'اسم الباقة ووصفها مطلوبان.' }, 400);
  const id = crypto.randomUUID(), now = Date.now();
  await env.DB.prepare(`INSERT INTO service_packages
    (id,name,audience,category,price,cadence,summary,facts_json,is_active,sort_order,created_by,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,item.name,item.audience,item.category,item.price,item.cadence,item.summary,JSON.stringify(item.facts),item.isActive?1:0,item.sortOrder,user.username,now,now).run();
  await recordActivity(env,user,'إضافة باقة','package',id,item.name);
  return json({ ok:true,id },201);
}

async function updateServicePackage(request, env, user, id) {
  if (!validPackageId(id)) return json({ error: 'معرّف الباقة غير صحيح.' }, 400);
  const current = await env.DB.prepare('SELECT * FROM service_packages WHERE id=?').bind(id).first();
  if (!current) return json({ error: 'الباقة غير موجودة.' }, 404);
  const payload = await readJson(request, 16000);
  if (!payload) return json({ error: 'تعذر قراءة بيانات الباقة.' }, 400);
  const item = normalizeServicePackage({
    name:payload.name??current.name,audience:payload.audience??current.audience,category:payload.category??current.category,
    price:payload.price??current.price,cadence:payload.cadence??current.cadence,summary:payload.summary??current.summary,
    facts:payload.facts??safeJsonParse(current.facts_json),isActive:payload.isActive??Boolean(current.is_active),sortOrder:payload.sortOrder??current.sort_order
  });
  if (!item.name || !item.summary) return json({ error: 'اسم الباقة ووصفها مطلوبان.' }, 400);
  await env.DB.prepare(`UPDATE service_packages SET name=?,audience=?,category=?,price=?,cadence=?,summary=?,facts_json=?,is_active=?,sort_order=?,updated_at=? WHERE id=?`)
    .bind(item.name,item.audience,item.category,item.price,item.cadence,item.summary,JSON.stringify(item.facts),item.isActive?1:0,item.sortOrder,Date.now(),id).run();
  await recordActivity(env,user,'تحديث باقة','package',id,item.name);
  return json({ ok:true });
}

async function deleteServicePackage(env, user, id) {
  if (!validPackageId(id)) return json({ error: 'معرّف الباقة غير صحيح.' }, 400);
  const item = await env.DB.prepare('SELECT name FROM service_packages WHERE id=?').bind(id).first();
  if (!item) return json({ error: 'الباقة غير موجودة.' }, 404);
  await env.DB.prepare('UPDATE service_packages SET is_active=0,updated_at=? WHERE id=?').bind(Date.now(),id).run();
  await recordActivity(env,user,'إخفاء باقة','package',id,item.name);
  return json({ ok:true });
}

async function createTask(request, env, user) {
  const payload = await readJson(request, 8000);
  if (!payload) return json({ error: 'تعذر قراءة البيانات.' }, 400);
  const task = normalizeTask(payload);
  if (!task.title) return json({ error: 'عنوان المهمة مطلوب.' }, 400);
  const now = Date.now();
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO employee_tasks
     (id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, task.title, task.clientName, task.assignee, task.dueDate, task.priority, task.status, user.username, now, now).run();
  return json({ ok: true, id }, 201);
}

async function updateTask(request, env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف المهمة غير صحيح.' }, 400);
  const payload = await readJson(request, 8000);
  if (!payload) return json({ error: 'تعذر قراءة البيانات.' }, 400);
  const current = await env.DB.prepare('SELECT * FROM employee_tasks WHERE id = ?').bind(id).first();
  if (!current) return json({ error: 'المهمة غير موجودة.' }, 404);
  const merged = normalizeTask({
    title: payload.title ?? current.title,
    clientName: payload.clientName ?? current.client_name,
    assignee: payload.assignee ?? current.assignee,
    dueDate: payload.dueDate ?? current.due_date,
    priority: payload.priority ?? current.priority,
    status: payload.status ?? current.status
  });
  await env.DB.prepare(
    `UPDATE employee_tasks SET title = ?, client_name = ?, assignee = ?, due_date = ?,
     priority = ?, status = ?, updated_at = ? WHERE id = ?`
  ).bind(merged.title, merged.clientName, merged.assignee, merged.dueDate, merged.priority, merged.status, Date.now(), id).run();
  return json({ ok: true });
}

async function deleteTask(env, user, id) {
  if (!isUuid(id)) return json({ error: 'معرّف المهمة غير صحيح.' }, 400);
  const result = await env.DB.prepare('DELETE FROM employee_tasks WHERE id = ?').bind(id).run();
  if (!result.meta?.changes) return json({ error: 'المهمة غير موجودة.' }, 404);
  await recordActivity(env, user, 'حذف مهمة', 'task', id);
  return json({ ok: true });
}

async function updateBusinessLead(request, env, user, id) {
  if (!/^MKB1-\d{3,4}$/.test(id)) return json({ error: 'معرّف الفرصة غير صحيح.' }, 400);
  const payload = await readJson(request, 12000);
  if (!payload) return json({ error: 'تعذر قراءة البيانات.' }, 400);
  const current = await env.DB.prepare('SELECT * FROM business_leads WHERE id = ?').bind(id).first();
  if (!current) return json({ error: 'الفرصة غير موجودة.' }, 404);
  const contactStatus = LEAD_STATUSES.includes(payload.contactStatus) ? payload.contactStatus : current.contact_status;
  const outcome = LEAD_OUTCOMES.includes(payload.outcome) ? payload.outcome : current.outcome;
  const requestedOwner = cleanString(payload.owner, 32).toUpperCase();
  const owner = requestedOwner && configuredTeamUsernames(env).includes(requestedOwner) ? requestedOwner : current.owner;
  const notes = payload.notes === undefined ? current.notes : cleanString(payload.notes, 1200);
  const shouldStamp = payload.markContacted === true || ['contacted', 'interested', 'follow_up', 'not_interested'].includes(contactStatus);
  await env.DB.prepare(
    `UPDATE business_leads SET contact_status = ?, owner = ?, outcome = ?, last_contact_at = ?,
     notes = ?, updated_by = ?, updated_at = ? WHERE id = ?`
  ).bind(contactStatus, owner, outcome, shouldStamp ? Date.now() : Number(current.last_contact_at || 0),
    notes, user.username, Date.now(), id).run();
  return json({ ok: true });
}

async function deleteBusinessLead(env, user, id) {
  if (!/^MKB1-\d{3,4}$/.test(id)) return json({ error: 'معرّف الفرصة غير صحيح.' }, 400);
  const lead = await env.DB.prepare('SELECT id FROM business_leads WHERE id = ?').bind(id).first();
  if (!lead) return json({ error: 'الفرصة غير موجودة.' }, 404);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO business_lead_deletions (id, deleted_by, deleted_at)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET deleted_by = excluded.deleted_by, deleted_at = excluded.deleted_at`
    ).bind(id, user.username, now),
    env.DB.prepare('DELETE FROM business_leads WHERE id = ?').bind(id)
  ]);
  await recordActivity(env, user, 'حذف فرصة', 'lead', id);
  return json({ ok: true });
}

async function assignLeadCategory(request, env, user) {
  const payload = await readJson(request, 5000);
  if (!payload) return json({ error: 'تعذر قراءة البيانات.' }, 400);
  const city = cleanString(payload.city, 80);
  const category = cleanString(payload.category, 120);
  const owner = cleanString(payload.owner, 32).toUpperCase();
  if (!city || !category || !configuredTeamUsernames(env).includes(owner)) {
    return json({ error: 'اختر التصنيف والمسؤول أولًا.' }, 400);
  }
  const result = await env.DB.prepare(
    `UPDATE business_leads SET owner = ?, updated_by = ?, updated_at = ?
     WHERE city = ? AND category = ?`
  ).bind(owner, user.username, Date.now(), city, category).run();
  const count = Number(result.meta?.changes || 0);
  await recordActivity(env, user, 'توزيع تصنيف فرص', 'lead_category', `${city}:${category}`, `${category} ← ${owner} (${count})`);
  return json({ ok: true, count });
}

async function recordActivity(env, user, action, entityType = '', entityId = '', detail = '') {
  await env.DB.prepare(
    `INSERT INTO employee_activity_log
     (actor_username, actor_name, actor_role, action, entity_type, entity_id, detail, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(user.username, user.name, roleForUsername(user.username), cleanString(action, 100),
    cleanString(entityType, 60), cleanString(entityId, 160), cleanString(detail, 500), Date.now()).run();
  await env.DB.prepare(
    'DELETE FROM employee_activity_log WHERE id NOT IN (SELECT id FROM employee_activity_log ORDER BY created_at DESC LIMIT 100)'
  ).run();
}

async function convertBusinessLeadToTask(request, env, user, id) {
  if (!/^MKB1-\d{3,4}$/.test(id)) return json({ error: 'معرّف الفرصة غير صحيح.' }, 400);
  const payload = await readJson(request, 5000) || {};
  const lead = await env.DB.prepare('SELECT * FROM business_leads WHERE id = ?').bind(id).first();
  if (!lead) return json({ error: 'الفرصة غير موجودة.' }, 404);
  if (lead.converted_task_id) return json({ ok: true, id: lead.converted_task_id, alreadyConverted: true });
  const requestedOwner = cleanString(payload.owner, 32).toUpperCase();
  const owner = configuredTeamUsernames(env).includes(requestedOwner) ? requestedOwner : (lead.owner || user.username);
  const now = Date.now();
  const taskId = crypto.randomUUID();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO employee_tasks
       (id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, '', ?, 'open', ?, ?, ?)`
    ).bind(taskId, `التواصل مع ${lead.name}`, lead.name, owner, Number(lead.priority) === 1 ? 'high' : 'normal', user.username, now, now),
    env.DB.prepare(
      `UPDATE business_leads SET contact_status = 'working', owner = ?, converted_task_id = ?, updated_by = ?, updated_at = ? WHERE id = ?`
    ).bind(owner, taskId, user.username, now, id)
  ]);
  return json({ ok: true, id: taskId }, 201);
}

async function convertBusinessLeadToClient(request, env, user, id) {
  if (!/^MKB1-\d{3,4}$/.test(id)) return json({ error: 'معرّف الفرصة غير صحيح.' }, 400);
  const payload = await readJson(request, 5000) || {};
  const lead = await env.DB.prepare('SELECT * FROM business_leads WHERE id = ?').bind(id).first();
  if (!lead) return json({ error: 'الفرصة غير موجودة.' }, 404);
  if (lead.converted_client_id) return json({ ok: true, id: lead.converted_client_id, alreadyConverted: true });
  const requestedOwner = cleanString(payload.owner, 32).toUpperCase();
  const owner = configuredTeamUsernames(env).includes(requestedOwner) ? requestedOwner : (lead.owner || user.username);
  const now = Date.now();
  const clientId = crypto.randomUUID();
  const contact = [lead.phone, lead.email].filter(Boolean).join(' · ');
  await env.DB.batch([
     env.DB.prepare(
       `INSERT INTO employee_clients
        (id, name, contact, service, value, status, pipeline_stage, next_step, owner, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, 0, 'lead', 'lead', ?, ?, ?, ?, ?)`
    ).bind(clientId, lead.name, contact, lead.recommended_service, `مراجعة فرصة ${lead.id} وتحديد موعد اكتشاف`, owner, user.username, now, now),
    env.DB.prepare(
      `UPDATE business_leads SET contact_status = 'converted', outcome = 'converted', owner = ?,
       converted_client_id = ?, last_contact_at = ?, updated_by = ?, updated_at = ? WHERE id = ?`
    ).bind(owner, clientId, now, user.username, now, id)
  ]);
  await recordActivity(env, user, 'تحويل فرصة إلى عميل', 'lead', id, lead.name);
  return json({ ok: true, id: clientId }, 201);
}

function normalizeClient(payload) {
  const status = CLIENT_STATUSES.includes(payload.status) ? payload.status : 'lead';
  const numericValue = Number(payload.value || 0);
  return {
    name: cleanString(payload.name, 120),
    contact: cleanString(payload.contact, 160),
    service: cleanString(payload.service, 160),
    value: Number.isFinite(numericValue) ? Math.max(0, Math.min(numericValue, 1_000_000_000)) : 0,
    status,
    nextStep: cleanString(payload.nextStep ?? payload.next_step, 300),
    owner: cleanString(payload.owner, 60)
  };
}

function legacyClientStatus(status) {
  if (['lead','discovery','proposal','won','active'].includes(status)) return status;
  if (['retained','closed'].includes(status)) return 'active';
  return 'proposal';
}

function normalizeTask(payload) {
  const priority = TASK_PRIORITIES.includes(payload.priority) ? payload.priority : 'normal';
  const status = TASK_STATUSES.includes(payload.status) ? payload.status : 'open';
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(String(payload.dueDate || '')) ? payload.dueDate : '';
  return {
    title: cleanString(payload.title, 180),
    clientName: cleanString(payload.clientName ?? payload.client_name, 120),
    assignee: cleanString(payload.assignee, 60),
    dueDate,
    priority,
    status
  };
}

function employeeHtmlResponse(html) {
  const headers = securityHeaders(new Headers({ 'Content-Type': 'text/html; charset=utf-8' }), { html: true });
  headers.set('Cache-Control', 'no-store');
  return new Response(html, { status: 200, headers });
}

function privateHtmlResponse(html) {
  const headers = securityHeaders(new Headers({ 'Content-Type': 'text/html; charset=utf-8' }), { html: true, firebase: true });
  headers.set('Cache-Control', 'no-store');
  return new Response(html, { status: 200, headers });
}

function json(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
    ...extraHeaders
  });
  return new Response(JSON.stringify(data), { status, headers });
}

async function readJson(request, maxLength) {
  const type = request.headers.get('Content-Type') || '';
  if (!type.toLowerCase().includes('application/json')) return null;
  const text = await request.text();
  if (!text || text.length > maxLength) return null;
  try {
    const value = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function cleanString(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function safeClientNext(value) {
  const next = cleanString(value || '/client/portal', 500);
  return next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/client/portal';
}

function validOrigin(request, url) {
  const origin = request.headers.get('Origin');
  const fetchSite = (request.headers.get('Sec-Fetch-Site') || '').toLowerCase();
  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) return false;
  return !origin || origin === url.origin;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');
}

function readAuthConfig(env) {
  try {
    const config = JSON.parse(env.EMPLOYEE_AUTH_CONFIG || '{}');
    if (!config.users || typeof config.users !== 'object') throw new Error('invalid config');
    return config;
  } catch {
    return { users: {} };
  }
}

function configuredTeamUsernames(env) {
  return Object.keys(readAuthConfig(env).users || {}).map((username) => String(username).toUpperCase());
}

function roleForUsername(username) {
  const normalized = String(username || '').toUpperCase();
  if (normalized === 'MOY') return 'super_admin';
  if (['AK', 'AZOZ', 'EMAD', 'TURKI'].includes(normalized)) return 'manager';
  return 'employee';
}

function hasRole(user, minimum) {
  const order = { employee: 1, manager: 2, super_admin: 3 };
  return (order[roleForUsername(user?.username)] || 0) >= (order[minimum] || 99);
}

function securityHeaders(input = new Headers(), options = {}) {
  const headers = new Headers(input);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()');
  headers.set('Cross-Origin-Opener-Policy', options.firebase ? 'same-origin-allow-popups' : 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', options.html ? 'same-origin' : 'same-site');
  if (options.html) {
    const inlineScriptHashes = [
      "'sha256-ndLNAMbMb6Lj1BuNHOd5kCg7wLZIMbIdeq8fGPGuiVI='",
      "'sha256-ZpIsx7qRxnTggQmrSPie/W50KaU0xIWptY8CWp4Y4LM='",
      "'sha256-VZqHdmFeYueEy6c1p+codH7KSQ46Vb9jaaQ+FAhQuX0='",
      "'sha256-xJhyz8QKMfSS8oF6MiA4A3mvY7TgsREIP3VVtjY+yBM='",
      "'sha256-+bThsQXAU4MLjclLoLKAgkEJBG9LmWEjqo6i3i1FMp4='",
      "'sha256-6iRH9bbhlQ97k0KghZKJQzPqY7y7l2POENeH5Xun1+8='",
      "'sha256-PmgFQeOqSJiAQaXJAmFcNmxTUfErIV3uLqmCJ7u/2YI='",
      "'sha256-h+oEoT9097gWM1uxJ7YRnX542PZLJvq3Wn6W3d9XOOg='",
      "'sha256-DfmCNzJA+9a2ObhQOc+DC2uLx2KCynaCvJ1vHPB8YrI='",
      "'sha256-Op6alKSYavs08/G7WPPYPlgBMv6zq50xjT9ZRtW10FA='",
      "'sha256-+QD3imx2tSDAen8T0skcWUeZu64ME3UKdtk93SzUWzk='",
      "'sha256-ZZVWUGtMU4LhKuJ935X/H1HFrjvUo6DVGylLXJbTAx4='",
      "'sha256-grU1SQdF1J2/VRMQajNGeYpCR9gQaL1C1z+CmbplNPM='"
    ].join(' ');
    const firebaseScripts = options.firebase ? ' https://www.gstatic.com' : '';
    const firebaseConnect = options.firebase ? ' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com' : '';
    const firebaseFrames = options.firebase ? 'frame-src https://*.firebaseapp.com https://accounts.google.com;' : '';
    headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self'${firebaseScripts} ${inlineScriptHashes}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'${firebaseConnect}; media-src 'self'; ${firebaseFrames} base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests`);
  }
  return headers;
}

function secureAssetResponse(response, url, method) {
  const type = (response.headers.get('Content-Type') || '').toLowerCase();
  const html = type.includes('text/html') || url.pathname.endsWith('.html') || (!url.pathname.includes('.') && !type);
  const headers = securityHeaders(response.headers, { html });
  if (html && (url.pathname === '/' || url.pathname === '/index.html') && method === 'GET') {
    headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    headers.set('CDN-Cache-Control', 'public, max-age=300');
  } else if (!html && method === 'GET') {
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function fileSignatureAllowed(file, extension) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const starts = (...values) => values.every((value, index) => bytes[index] === value);
  const ascii = decoder.decode(bytes);
  if (extension === 'pdf') return ascii.startsWith('%PDF-');
  if (extension === 'png') return starts(0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A);
  if (extension === 'jpg' || extension === 'jpeg') return starts(0xFF,0xD8,0xFF);
  if (extension === 'webp') return ascii.startsWith('RIFF') && ascii.slice(8,12) === 'WEBP';
  if (['docx','pptx','xlsx','zip'].includes(extension)) return starts(0x50,0x4B,0x03,0x04) || starts(0x50,0x4B,0x05,0x06) || starts(0x50,0x4B,0x07,0x08);
  if (extension === 'doc' || extension === 'ppt' || extension === 'xls') return starts(0xD0,0xCF,0x11,0xE0,0xA1,0xB1,0x1A,0xE1);
  return false;
}

async function verifyPassword(password, account, pepper) {
  if (!pepper) return false;
  try {
    const iterations = Math.max(100000, Math.min(Number(account.iterations || 100000), 100000));
    const secretInput = `${password}\u0000${pepper}`;
    const key = await crypto.subtle.importKey('raw', encoder.encode(secretInput), 'PBKDF2', false, ['deriveBits']);
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: base64UrlToBytes(account.salt), iterations },
      key,
      256
    );
    return constantTimeEqual(new Uint8Array(derived), base64UrlToBytes(account.hash));
  } catch {
    return false;
  }
}

async function createSession(user, env) {
  const now = Math.floor(Date.now() / 1000);
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({
    sub: user.username,
    name: user.name,
    iat: now,
    exp: now + SESSION_MAX_AGE,
    nonce: crypto.randomUUID()
  })));
  const signature = await hmac(payload, env.EMPLOYEE_SESSION_SECRET, 'sign');
  return `${payload}.${bytesToBase64Url(signature)}`;
}

async function createClientSession(identity, env) {
  const now = Math.floor(Date.now() / 1000);
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({
    sub: identity.uid,
    email: identity.email,
    aud: 'newmedia-client',
    iat: now,
    exp: now + CLIENT_SESSION_MAX_AGE,
    nonce: crypto.randomUUID()
  })));
  const signature = await hmac(payload, env.EMPLOYEE_SESSION_SECRET, 'sign');
  return `${payload}.${bytesToBase64Url(signature)}`;
}

async function readClientSession(request, env) {
  if (!env.EMPLOYEE_SESSION_SECRET) return null;
  const token = readCookie(request.headers.get('Cookie') || '', CLIENT_SESSION_COOKIE);
  if (!token) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  try {
    if (!await hmac(payload, env.EMPLOYEE_SESSION_SECRET, 'verify', base64UrlToBytes(signature))) return null;
    const value = JSON.parse(decoder.decode(base64UrlToBytes(payload)));
    const now = Math.floor(Date.now() / 1000);
    if (!value.sub || !value.email || value.aud !== 'newmedia-client' || !value.exp || value.exp <= now) return null;
    return { uid: cleanString(value.sub, 128), email: cleanString(value.email, 160) };
  } catch { return null; }
}

async function readSession(request, env) {
  if (!env.EMPLOYEE_SESSION_SECRET) return null;
  const token = readCookie(request.headers.get('Cookie') || '', SESSION_COOKIE);
  if (!token) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  try {
    const verified = await hmac(payload, env.EMPLOYEE_SESSION_SECRET, 'verify', base64UrlToBytes(signature));
    if (!verified) return null;
    const value = JSON.parse(decoder.decode(base64UrlToBytes(payload)));
    const now = Math.floor(Date.now() / 1000);
    if (!value.sub || !value.name || !value.exp || value.exp <= now) return null;
    const config = readAuthConfig(env);
    if (!config.users[value.sub]) return null;
    return { username: cleanString(value.sub, 32), name: cleanString(value.name, 60) };
  } catch {
    return null;
  }
}

async function hmac(payload, secret, mode, signature) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret || ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    mode === 'verify' ? ['verify'] : ['sign']
  );
  if (mode === 'verify') return crypto.subtle.verify('HMAC', key, signature, encoder.encode(payload));
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
}

async function sha256Base64(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function readCookie(header, name) {
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=');
  }
  return '';
}

function sessionCookie(token) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

function clientSessionCookie(token) {
  return `${CLIENT_SESSION_COOKIE}=${token}; Path=/; Max-Age=${CLIENT_SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

function clearClientSessionCookie() {
  return `${CLIENT_SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
