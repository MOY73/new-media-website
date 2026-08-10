const SESSION_COOKIE = 'nm_employee_session';
const SESSION_MAX_AGE = 60 * 60 * 12;
const LOGIN_LIMIT = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const CLIENT_STATUSES = ['lead', 'discovery', 'proposal', 'won', 'active'];
const TASK_STATUSES = ['open', 'done'];
const TASK_PRIORITIES = ['low', 'normal', 'high'];

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
   ON employee_login_attempts(updated_at)`
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
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/employee/')) {
      return handleEmployeeApi(request, env, url);
    }

    if (url.pathname === '/employee-dashboard.html') {
      const user = await readSession(request, env);
      if (!user) return Response.redirect(new URL('/employee-login.html', url), 302);
      return employeeAssetResponse(request, env);
    }

    if (url.pathname === '/employee-login.html') {
      const user = await readSession(request, env);
      if (user) return Response.redirect(new URL('/employee-dashboard.html', url), 302);
      return employeeAssetResponse(request, env);
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
    ? await verifyPassword(password, comparisonAccount)
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
    env.DB.prepare('SELECT id, title, client_name, assignee, due_date, priority, status, created_by, created_at, updated_at FROM employee_tasks ORDER BY status ASC, due_date ASC, updated_at DESC LIMIT 250')
  ]);
  const messages = [...(results[0].results || [])].reverse();
  const clients = results[1].results || [];
  const tasks = results[2].results || [];
  const pipelineValue = clients.reduce((sum, item) => sum + Number(item.value || 0), 0);
  return json({
    user,
    messages,
    clients,
    tasks,
    stats: {
      clients: clients.length,
      opportunities: clients.filter((item) => ['lead', 'discovery', 'proposal'].includes(item.status)).length,
      active: clients.filter((item) => item.status === 'active').length,
      openTasks: tasks.filter((item) => item.status === 'open').length,
      pipelineValue
    },
    knowledge: KNOWLEDGE,
    serverTime: Date.now()
  });
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

async function employeeAssetResponse(request, env) {
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
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

async function verifyPassword(password, account) {
  const iterations = Math.max(100000, Math.min(Number(account.iterations || 160000), 300000));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: base64UrlToBytes(account.salt), iterations },
    key,
    256
  );
  return constantTimeEqual(new Uint8Array(derived), base64UrlToBytes(account.hash));
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
