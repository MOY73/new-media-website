const SESSION_COOKIE = 'nm_employee_session';
const SESSION_MAX_AGE = 60 * 60 * 12;
const LOGIN_LIMIT = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const EMPLOYEE_LOGIN_HTML = '';
const EMPLOYEE_DASHBOARD_HTML = '';

const CLIENT_STATUSES = ['lead', 'discovery', 'proposal', 'won', 'active'];
const TASK_STATUSES = ['open', 'done'];
const TASK_PRIORITIES = ['low', 'normal', 'high'];
const APPLICATION_STATUSES = ['new', 'reviewing', 'contacted', 'qualified', 'closed'];
const MAX_APPLICATION_FILES = 8;
const MAX_APPLICATION_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(['png','jpg','jpeg','webp','pdf','doc','docx','ppt','pptx','xls','xlsx','zip']);

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS employee_messages (
    id TEXT PRIMARY KEY,
    author_username TEXT NOT NULL,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 1000),
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
    next_step TEXT NOT NULL DEFAULT '',
    owner TEXT NOT NULL DEFAULT '',
    created_by TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employee_clients_status_updated
   ON employee_clients(status, updated_at DESC)`,
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
  )`
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
      ['Landing page', '7,500 ر.س'], ['موقع تعريفي 5-7 صفحات', '18,000 ر.س'], ['موقع ثنائي اللغة', '24,000 ر.س'], ['متجر أساسي', '28,000 ر.س'], ['متجر مخصص', '45,000+ ر.س'], ['صيانة شهرية', '2,500-6,000 ر.س']
    ] },
    { title: 'الحضور والمحتوى', note: 'يعتمد السعر على عدد المنصات وعمق الإنتاج والمجتمع.', items: [
      ['إدارة منصتين', '9,500 ر.س / شهر'], ['إدارة 3 منصات', '12,500 ر.س / شهر'], ['تقويم وكتابة فقط', '4,500 ر.س / شهر'], ['تصاميم فقط', '5,500 ر.س / شهر'], ['إدارة مجتمع', '3,500 ر.س / شهر'], ['منصة إضافية', '2,500 ر.س / شهر']
    ] },
    { title: 'الحملات والأداء', note: 'رسوم الإدارة منفصلة عن ميزانية المنصات.', items: [
      ['قناة واحدة حتى إنفاق 30k', '6,500 ر.س / شهر'], ['قناتان حتى إنفاق 75k', '10,000 ر.س / شهر'], ['3 قنوات حتى إنفاق 150k', '15,000 ر.س / شهر'], ['إنفاق أعلى', '12-15% من الإنفاق'], ['إعداد تتبع أساسي', '4,500 ر.س'], ['لوحة بيانات', '6,500+ ر.س']
    ] },
    { title: 'الهوية والاستراتيجية', note: 'لا نبيع شعارًا فقط عندما يحتاج العميل نظام علامة كاملًا.', items: [
      ['شعار احترافي', '6,500 ر.س'], ['هوية مصغرة', '12,000 ر.س'], ['هوية متكاملة', '25,000 ر.س'], ['استراتيجية علامة', '28,000 ر.س'], ['تسمية وهوية لفظية', '15,000 ر.س'], ['UX/UI موقع', '18,000+ ر.س']
    ] },
    { title: 'الإنتاج الإبداعي', note: 'الأسعار تبدأ من وتثبت بعد المعالجة وقائمة الإنتاج.', items: [
      ['فيديو قصير من مواد العميل', '1,500 ر.س'], ['Reel مصور خفيف', '3,500 ر.س'], ['يوم تصوير محتوى', '8,500 ر.س'], ['فيلم إعلاني', '25,000+ ر.س'], ['موشن 30-45 ثانية', '7,500 ر.س'], ['تصوير منتجات', '4,500+ ر.س']
    ] },
    { title: 'SEO والإضافات', note: 'النتائج تتأثر بالمنافسة والموقع والتنفيذ والوقت.', items: [
      ['SEO أساسي', '5,500 ر.س / شهر'], ['SEO نمو', '9,500 ر.س / شهر'], ['SEO متقدم', '16,000+ ر.س / شهر'], ['تدقيق SEO', '6,500 ر.س'], ['لغة إضافية', '+20-30%'], ['دعم عاجل خلال 24 ساعة', '+25%'], ['ساعة تطوير', '550 ر.س']
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
    { name: 'النمو والأداء', purpose: 'تحويل البيانات والميزانيات إلى طلب وربحية قابلة للقياس.', ownership: ['الإعلانات المدفوعة', 'التتبع والتحليل', 'SEO والمواقع', 'الأتمتة والتحويل'], metrics: ['ROAS', 'CPL / CAC', 'معدل التحويل', 'قيمة العميل'] },
    { name: 'الحضور الرقمي', purpose: 'بناء حضور متسق يشرح القيمة ويخلق محادثات ويحافظ على المجتمع.', ownership: ['استراتيجية القنوات', 'تقويم المحتوى', 'إدارة المجتمع', 'السمعة الرقمية'], metrics: ['الوصول المناسب', 'الحفظ والنقر', 'المحادثات', 'نمو المجتمع'] },
    { name: 'الهوية والتجربة', purpose: 'تحويل النشاط إلى معنى ونظام وتجربة واضحة ومتذكرة.', ownership: ['استراتيجية العلامة', 'النظام البصري', 'الهوية اللفظية', 'UX/UI'], metrics: ['الوضوح', 'الاتساق', 'التذكر', 'نجاح المهام'] },
    { name: 'الاستديو الإبداعي', purpose: 'إنتاج أفكار وصور وفيديوهات ونصوص توقف الانتباه وتقنع.', ownership: ['الفكرة والاتجاه', 'الكتابة والسيناريو', 'التصوير والمونتاج', 'الموشن والنسخ'], metrics: ['قبول الاتجاه', 'وقت الإنتاج', 'الاحتفاظ', 'الأداء'] }
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

    if (url.pathname.startsWith('/api/employee/')) {
      return handleEmployeeApi(request, env, url);
    }

    if (/^\/employee-dashboard(?:\.html)?\/?$/.test(url.pathname)) {
      return Response.redirect(new URL('/team/workspace', url), 302);
    }

    if (/^\/employee-login(?:\.html)?\/?$/.test(url.pathname)) {
      return Response.redirect(new URL('/team/login', url), 302);
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

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const notFoundUrl = new URL('/404.html', request.url);
    const notFoundPage = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    return new Response(notFoundPage.body, {
      status: 404,
      headers: notFoundPage.headers,
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
    return json({ user });
  }
  if (url.pathname === '/api/employee/logout' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
  }
  if (url.pathname === '/api/employee/data' && request.method === 'GET') {
    return getPortalData(env, user);
  }
  if (url.pathname.startsWith('/api/employee/application-files/') && request.method === 'GET') {
    return getApplicationFile(env, url.pathname.split('/').pop());
  }
  if (url.pathname.startsWith('/api/employee/applications/') && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateApplication(request, env, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/messages' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createMessage(request, env, user);
  }
  if (url.pathname === '/api/employee/clients' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createClient(request, env, user);
  }
  if (url.pathname.startsWith('/api/employee/clients/') && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateClient(request, env, url.pathname.split('/').pop());
  }
  if (url.pathname === '/api/employee/tasks' && request.method === 'POST') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return createTask(request, env, user);
  }
  if (url.pathname.startsWith('/api/employee/tasks/') && request.method === 'PATCH') {
    if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
    return updateTask(request, env, url.pathname.split('/').pop());
  }

  return json({ error: 'المسار غير موجود.' }, 404);
}

async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch(SCHEMA_STATEMENTS.map((statement) => env.DB.prepare(statement)));
  await env.DB.prepare(
    `INSERT OR IGNORE INTO employee_messages
     (id, author_username, author_name, body, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind('system-welcome', 'SYSTEM', 'NEW MEDIA', 'أهلًا بالفريق. هذه مساحة العمل الداخلية المشتركة.', Date.now()).run();
  schemaReady = true;
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
  const user = { username, name: cleanString(account.name || username, 60) };
  const token = await createSession(user, env);
  return json({ user }, 200, { 'Set-Cookie': sessionCookie(token) });
}

async function getPortalData(env, user) {
  const results = await env.DB.batch([
    env.DB.prepare('SELECT id, author_username, author_name, body, created_at FROM employee_messages ORDER BY created_at DESC LIMIT 80'),
    env.DB.prepare('SELECT id, name, contact, service, value, status, next_step, owner, created_by, created_at, updated_at FROM employee_clients ORDER BY updated_at DESC LIMIT 250'),
    env.DB.prepare('SELECT id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at FROM employee_tasks ORDER BY status ASC, due_date ASC, updated_at DESC LIMIT 250'),
    env.DB.prepare('SELECT id, reference, full_name, organization, email, phone, services, budget_range, project_summary, payload_json, status, attachment_count, email_status, created_at, updated_at FROM client_applications ORDER BY created_at DESC LIMIT 250'),
    env.DB.prepare('SELECT id, application_id, original_name, content_type, size_bytes, created_at FROM client_application_files ORDER BY created_at ASC LIMIT 1000')
  ]);
  const messages = [...(results[0].results || [])].reverse();
  const clients = results[1].results || [];
  const tasks = results[2].results || [];
  const files = results[4].results || [];
  const applications = (results[3].results || []).map((application) => ({
    ...application,
    details: safeJsonParse(application.payload_json),
    files: files.filter((file) => file.application_id === application.id)
  }));
  const pipelineValue = clients.reduce((sum, item) => sum + Number(item.value || 0), 0);
  return json({
    user,
    messages,
    clients,
    tasks,
    applications,
    stats: {
      clients: clients.length,
      opportunities: clients.filter((item) => ['lead', 'discovery', 'proposal'].includes(item.status)).length,
      active: clients.filter((item) => item.status === 'active').length,
      openTasks: tasks.filter((item) => item.status === 'open').length,
      pipelineValue,
      newApplications: applications.filter((item) => item.status === 'new').length
    },
    knowledge: KNOWLEDGE,
    serverTime: Date.now()
  });
}

async function createPublicApplication(request, env, url, ctx) {
  if (!validOrigin(request, url)) return json({ error: 'طلب غير مسموح.' }, 403);
  if (!env.DB) return json({ error: 'تعذر استقبال الطلب الآن. حاول مرة أخرى لاحقاً.' }, 503);
  await ensureSchema(env);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 85 * 1024 * 1024) return json({ error: 'حجم الطلب والملفات أكبر من الحد المسموح.' }, 413);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'تعذر قراءة النموذج المرسل.' }, 400); }
  if (cleanString(form.get('website_confirm'), 100)) return json({ ok: true, reference: 'NM-RECEIVED' }, 202);
  const startedAt = Number(form.get('form_started_at') || 0);
  if (!startedAt || Date.now() - startedAt < 2500) return json({ error: 'تحقق من البيانات ثم حاول الإرسال مرة أخرى.' }, 400);

  const allowedServices = ['النمو والأداء', 'الحضور الرقمي', 'الهوية والتجربة', 'الاستديو الإبداعي'];
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
       (id, reference, full_name, organization, email, phone, services, budget_range, project_summary,
        payload_json, status, attachment_count, email_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?)`
    ).bind(id, reference, payload.full_name, payload.organization, payload.email, payload.phone, serviceLabel,
      payload.budget_range, payload.project_summary, JSON.stringify(payload), files.length, emailStatus, now, now),
    env.DB.prepare(
      `INSERT INTO employee_clients
       (id, name, contact, service, value, status, next_step, owner, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'lead', ?, '', 'WEBSITE', ?, ?)`
    ).bind(id, payload.organization || payload.full_name, `${payload.phone} · ${payload.email}`, serviceLabel,
      estimatedValue, `مراجعة طلب الموقع ${reference} والتواصل مع ${payload.full_name}`, now, now),
    env.DB.prepare(
      `INSERT INTO employee_tasks
       (id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, '', '', 'high', 'open', 'WEBSITE', ?, ?)`
    ).bind(taskId, `مراجعة طلب الموقع — ${reference}`, payload.organization || payload.full_name, now, now),
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

async function updateApplication(request, env, id) {
  if (!isUuid(id)) return json({ error: 'معرّف الطلب غير صحيح.' }, 400);
  const payload = await readJson(request, 3000);
  const status = cleanString(payload?.status, 30);
  if (!APPLICATION_STATUSES.includes(status)) return json({ error: 'حالة الطلب غير صحيحة.' }, 400);
  const result = await env.DB.prepare('UPDATE client_applications SET status = ?, updated_at = ? WHERE id = ?').bind(status, Date.now(), id).run();
  if (!result.meta?.changes) return json({ error: 'الطلب غير موجود.' }, 404);
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
    body: JSON.stringify({ from: sender, to: [recipient], reply_to: application.email, subject: `طلب جديد ${application.reference} — ${application.organization}`, text })
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
  if (range.includes('50,000 – 100,000')) return 75000;
  if (range.includes('25,000 – 50,000')) return 37500;
  if (range.includes('10,000 – 25,000')) return 17500;
  if (range.includes('5,000 – 10,000')) return 7500;
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
  const payload = await readJson(request, 5000);
  const body = cleanString(payload?.body, 1000);
  if (!body) return json({ error: 'اكتب رسالة أولًا.' }, 400);
  const message = {
    id: crypto.randomUUID(),
    author_username: user.username,
    author_name: user.name,
    body,
    created_at: Date.now()
  };
  await env.DB.prepare(
    'INSERT INTO employee_messages (id, author_username, author_name, body, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(message.id, message.author_username, message.author_name, message.body, message.created_at).run();
  return json({ message }, 201);
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
     (id, name, contact, service, value, status, next_step, owner, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, client.name, client.contact, client.service, client.value, client.status, client.nextStep, client.owner, user.username, now, now).run();
  return json({ ok: true, id }, 201);
}

async function updateClient(request, env, id) {
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
    status: payload.status ?? current.status,
    nextStep: payload.nextStep ?? current.next_step,
    owner: payload.owner ?? current.owner
  });
  if (!merged.name) return json({ error: 'اسم العميل مطلوب.' }, 400);
  await env.DB.prepare(
    `UPDATE employee_clients SET name = ?, contact = ?, service = ?, value = ?, status = ?,
     next_step = ?, owner = ?, updated_at = ? WHERE id = ?`
  ).bind(merged.name, merged.contact, merged.service, merged.value, merged.status, merged.nextStep, merged.owner, Date.now(), id).run();
  return json({ ok: true });
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

async function updateTask(request, env, id) {
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
  const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
  headers.set('Cache-Control', 'no-store');
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
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

function validOrigin(request, url) {
  const origin = request.headers.get('Origin');
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
