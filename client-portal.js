import { getFirebaseServices } from './firebase-client.js';
import { SUPPORT_TOPICS, findSupportAnswers } from './support-faq.js';

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = { data: null, view: 'overview', auth: null, authSdk: null };
const views = { overview: 'مساحتك مع New Media', projects: 'مشاريعي', requests: 'طلباتي', deliveries: 'التسليمات', explore: 'مستواي والباقات', support: 'الدعم والتذاكر', profile: 'الملف الشخصي' };
let supportTopic = 'all';
const statusText = { new: 'وصل للفريق', reviewing: 'قيد المراجعة', scheduled: 'مجدول', in_progress: 'قيد التنفيذ', waiting_client: 'بانتظارك', completed: 'مكتمل', approved: 'تم الاستلام', cancelled: 'ملغي', pending: 'قيد المراجعة', delivered: 'جاهز للاستلام' };
const packages = [
  ['باقة الحضور', 'هوية واضحة وموقع احترافي يقدّمك كما تستحق.', 'تبدأ من 3,499 ر.س'],
  ['باقة النمو', 'محتوى وإدارة وإعلانات تعمل كمنظومة واحدة.', 'تبدأ من 2,999 ر.س شهريًا'],
  ['باقة الشراكة', 'فريق متكامل يغطي الهوية والموقع والمحتوى والنمو.', 'تبدأ من 9,999 ر.س شهريًا'],
];

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const response = await fetch(path, { credentials: 'same-origin', ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || 'تعذر إكمال الطلب.'); error.status = response.status; throw error; }
  return data;
}

function initials(value) { return String(value || 'NM').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function date(value) { return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(new Date(Number(value))); }
function empty(text) { return `<div class="client-empty">${text}</div>`; }
function toast(text, error = false) { const node = qs('#clientToast'); node.textContent = text; node.classList.toggle('is-error', error); node.classList.add('is-visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2800); }
function escapeHtml(value) { const div = document.createElement('div'); div.textContent = String(value || ''); return div.innerHTML; }

function switchView(view) {
  if (!views[view]) return;
  state.view = view;
  qsa('[data-client-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.clientPanel === view));
  qsa('[data-client-view]').forEach((button) => button.classList.toggle('is-active', button.dataset.clientView === view));
  qs('#clientViewTitle').textContent = views[view];
  qs('#clientSidebar').classList.remove('is-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', view === 'overview' ? '/client/portal' : `/client/portal#${view}`);
}

function renderIdentity() {
  const profile = state.data.profile;
  qs('#clientName').textContent = profile.display_name || profile.email.split('@')[0];
  qs('#clientEmail').textContent = profile.email;
  qs('#clientAvatar').textContent = initials(profile.display_name || profile.email);
  qs('#welcomeKicker').textContent = `أهلًا، ${(profile.display_name || 'بك').split(' ')[0]}`;
  const form = qs('#clientProfileForm');
  form.elements.displayName.value = profile.display_name || '';
  form.elements.organization.value = profile.organization || '';
  form.elements.phone.value = profile.phone || '';
  form.elements.email.value = profile.email;
}

function projectCard(project) {
  const progress = Math.max(0, Math.min(100, Number(project.progress || 0)));
  return `<article class="client-project-card"><header><span>${escapeHtml(project.service || 'مشروع New Media')}</span><small class="client-status">${statusText[project.status] || project.status}</small></header><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary || 'نعمل على تفاصيل المشروع ونسلمك كل مرحلة هنا.')}</p><div class="project-progress"><div><i style="width:${progress}%"></i></div><span>${progress}% · ${escapeHtml(project.current_stage || 'مرحلة التجهيز')}</span></div></article>`;
}

function renderProjects() {
  const projects = state.data.projects || [];
  qs('#clientProjects').innerHTML = projects.length ? projects.map(projectCard).join('') : empty('لا يوجد مشروع نشط بعد. أرسل طلبك الأول وسيتواصل معك الفريق.');
  qs('#overviewProjects').innerHTML = projects.length ? projects.slice(0, 2).map(projectCard).join('') : empty('سيظهر أول مشروع لك هنا بعد اعتماده.');
  qs('#projectsCount').textContent = projects.length;
  const select = qs('#requestProject');
  select.innerHTML = '<option value="">طلب عام</option>' + projects.map((p) => `<option value="${p.id}">${escapeHtml(p.title)}</option>`).join('');
}

function renderRequests() {
  const requests = state.data.requests || [], applications = state.data.applications || [];
  qs('#requestsCount').textContent = requests.length + applications.length;
  const internal = requests.map((item) => `<article class="client-list-row"><div><span class="client-status">${statusText[item.status] || item.status}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.details)}</p>${item.employee_note ? `<p><b>رد الفريق:</b> ${escapeHtml(item.employee_note)}</p>` : ''}<small>${date(item.created_at)}</small></div><div class="client-list-actions"><span>${item.priority === 'high' ? 'عاجل' : item.priority === 'low' ? 'مرن' : 'عادي'}</span></div></article>`);
  const intake = applications.map((item) => `<article class="client-list-row"><div><span class="client-status">${statusText[item.status] || item.status}</span><h3>طلب مشروع ${escapeHtml(item.reference)}</h3><p>${escapeHtml(item.project_summary)}</p><small>${escapeHtml(item.services)} · ${date(item.created_at)}</small></div><div class="client-list-actions"><span>طلب شامل</span></div></article>`);
  qs('#clientRequests').innerHTML = internal.length || intake.length ? [...intake, ...internal].join('') : empty('لم ترسل أي طلب بعد. استخدم زر «طلب جديد».');
}

function renderDeliveries() {
  const deliveries = state.data.deliveries || [];
  qs('#deliveriesCount').textContent = deliveries.filter((d) => d.status !== 'approved').length;
  const markup = deliveries.length ? deliveries.map((item) => `<article class="client-list-row"><div><span class="client-status">${statusText[item.status] || item.status}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.message || 'تسليم جديد من فريق New Media.')}</p><small>${date(item.created_at)} · ${escapeHtml(item.original_name)}</small></div><div class="client-list-actions"><a href="/api/client/deliveries/${item.id}/file" target="_blank" rel="noopener">تحميل الملف</a>${item.status !== 'approved' ? `<button class="is-primary" data-approve-delivery="${item.id}">تأكيد الاستلام</button>` : ''}</div></article>`).join('') : empty('لا توجد تسليمات حتى الآن. ستظهر ملفاتك هنا فور رفعها من الفريق.');
  qs('#clientDeliveries').innerHTML = markup;
  const ready = deliveries.filter((d) => d.status !== 'approved');
  qs('#overviewDeliveries').innerHTML = ready.length ? ready.slice(0, 2).map((item) => `<div class="client-list-row"><div><h3>${escapeHtml(item.title)}</h3><small>${escapeHtml(item.original_name)}</small></div><div class="client-list-actions"><a href="/api/client/deliveries/${item.id}/file">تحميل</a></div></div>`).join('') : empty('كل التسليمات مستلمة، أو لا يوجد تسليم جديد.');
  qsa('[data-approve-delivery]').forEach((button) => button.addEventListener('click', () => approveDelivery(button.dataset.approveDelivery)));
}

function renderExplore() {
  const progress = state.data.progress || { visited_sections: [], score: 0, level: 1 };
  const sections = [
    ['services', 'خدماتنا', '/#services'], ['work', 'أعمالنا', '/work-archive'], ['about', 'من نحن', '/#about'], ['digital', 'الحضور الرقمي', '/digital-presence'], ['creative', 'الإنتاج الإبداعي', '/creative-production'], ['brand', 'الهوية والتجربة', '/brand-experience'], ['web', 'المواقع والتجارب', '/web-experience'], ['growth', 'النمو والأداء', '/growth-performance'],
  ];
  const visited = new Set(progress.visited_sections || []);
  qs('#exploreChecklist').innerHTML = sections.map(([id, label, href]) => `<a class="explore-item ${visited.has(id) ? 'is-done' : ''}" href="${href}" data-explore="${id}"><span>${label}</span><i>${visited.has(id) ? '✓' : '↗'}</i></a>`).join('');
  const score = Math.min(100, Math.max(Number(progress.score || 0), visited.size * 12));
  const level = score >= 85 ? 4 : score >= 60 ? 3 : score >= 30 ? 2 : 1;
  const names = ['البداية', 'المستكشف', 'صاحب الرؤية', 'جاهز للانطلاق'];
  qs('#clientLevel').textContent = String(level).padStart(2, '0');
  qs('#levelName').textContent = names[level - 1];
  qs('#levelTrack').style.width = `${score}%`;
  qs('#progressPercent').textContent = `${score}%`;
  qs('#progressRing').style.setProperty('--progress', `${score}%`);
  qs('#clientPackages').innerHTML = `<div class="client-panel-head"><div><span>PACKAGES</span><h3>${level >= 3 ? 'الباقات الأنسب لك' : 'أكمل الجولة لفتح الباقات'}</h3></div></div>` + packages.map(([name, desc, price]) => `<article class="client-package ${level >= 3 ? '' : 'is-locked'}"><h3>${name}</h3><p>${desc}</p><strong>${price}</strong></article>`).join('');
  qsa('[data-explore]').forEach((link) => link.addEventListener('click', () => navigator.sendBeacon?.('/api/client/progress', new Blob([JSON.stringify({ section: link.dataset.explore })], { type: 'application/json' }))));
}

function renderMetrics() {
  const projects = state.data.projects || [], requests = state.data.requests || [], applications = state.data.applications || [], deliveries = state.data.deliveries || [];
  qs('#clientMetrics').innerHTML = [['مشاريع نشطة', projects.filter((p) => !['completed', 'cancelled'].includes(p.status)).length], ['طلبات مفتوحة', requests.filter((r) => !['completed', 'cancelled'].includes(r.status)).length + applications.filter((r) => r.status !== 'closed').length], ['جاهز للاستلام', deliveries.filter((d) => d.status !== 'approved').length], ['تم استلامه', deliveries.filter((d) => d.status === 'approved').length]].map(([label, value]) => `<div class="client-metric"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function supportStatus(status) { return ({ open: 'مفتوحة', in_progress: 'قيد المعالجة', waiting_client: 'بانتظار ردك', resolved: 'تم الحل', closed: 'مغلقة' })[status] || status; }
function renderSupportFaq() {
  const query = qs('#supportFaqSearch')?.value || '';
  qs('#supportTopics').innerHTML = SUPPORT_TOPICS.map(([id, label]) => `<button type="button" class="${supportTopic === id ? 'is-active' : ''}" data-support-topic="${id}">${label}</button>`).join('');
  const matches = findSupportAnswers(query, supportTopic);
  qs('#supportFaqList').innerHTML = matches.length ? matches.map((item) => `<details class="support-faq-item"><summary>${escapeHtml(item.title)}<i>+</i></summary><p>${escapeHtml(item.answer)}</p></details>`).join('') : empty('لم نجد جوابًا مطابقًا. افتح تذكرة وسيجيبك الفريق.');
  qsa('[data-support-topic]').forEach((button) => button.addEventListener('click', () => { supportTopic = button.dataset.supportTopic; renderSupportFaq(); }));
}

function renderSupport() {
  renderSupportFaq();
  const tickets = state.data.supportTickets || [], messages = state.data.supportMessages || [];
  const open = tickets.filter((ticket) => !['resolved', 'closed'].includes(ticket.status));
  qs('#supportCount').textContent = open.length;
  qs('#clientSupportTickets').innerHTML = tickets.length ? tickets.map((ticket) => {
    const thread = messages.filter((message) => message.ticket_id === ticket.id);
    const canReply = ticket.status !== 'closed';
    return `<article class="support-ticket"><header><div><span>${escapeHtml(ticket.category)}</span><h3>${escapeHtml(ticket.subject)}</h3></div><em data-status="${ticket.status}">${supportStatus(ticket.status)}</em></header><div class="support-thread">${thread.map((message) => `<div class="support-message is-${message.sender_type}"><strong>${message.sender_type === 'client' ? 'أنت' : escapeHtml(message.sender_name || 'فريق New Media')}</strong><p>${escapeHtml(message.body)}</p><small>${date(message.created_at)}</small></div>`).join('')}</div>${canReply ? `<form class="support-reply-form" data-ticket-reply="${ticket.id}"><textarea name="body" maxlength="2500" required placeholder="اكتب ردك للفريق..."></textarea><button type="submit">إرسال الرد</button></form>` : ''}</article>`;
  }).join('') : empty('لا توجد تذاكر حتى الآن. استخدم الإجابات السريعة أو افتح تذكرة جديدة.');
  qsa('[data-ticket-reply]').forEach((form) => form.addEventListener('submit', submitSupportReply));
}

async function submitSupportReply(event) {
  event.preventDefault(); const form = event.currentTarget, button = qs('button', form), body = form.elements.body.value.trim();
  if (!body) return; button.disabled = true;
  try { await api(`/api/client/support-tickets/${form.dataset.ticketReply}/messages`, { method: 'POST', body: JSON.stringify({ body }) }); await refresh(); toast('وصل ردك للفريق.'); }
  catch (error) { toast(error.message, true); } finally { button.disabled = false; }
}

function renderAll() { renderIdentity(); renderMetrics(); renderProjects(); renderRequests(); renderDeliveries(); renderExplore(); renderSupport(); }

async function refresh() {
  try { state.data = await api('/api/client/data'); renderAll(); }
  catch (error) { if (error.status === 401) location.replace(`/client/login?next=${encodeURIComponent(location.pathname + location.hash)}`); else toast(error.message, true); }
}

async function approveDelivery(id) {
  try { await api(`/api/client/deliveries/${encodeURIComponent(id)}/approve`, { method: 'POST', body: '{}' }); await refresh(); toast('تم تأكيد الاستلام للفريق.'); }
  catch (error) { toast(error.message, true); }
}

function openRequest() { qs('#requestModal').classList.add('is-visible'); qs('#requestModal').setAttribute('aria-hidden', 'false'); }
function closeRequest() { qs('#requestModal').classList.remove('is-visible'); qs('#requestModal').setAttribute('aria-hidden', 'true'); }
function openSupport() { qs('#supportModal').classList.add('is-visible'); qs('#supportModal').setAttribute('aria-hidden', 'false'); }
function closeSupport() { qs('#supportModal').classList.remove('is-visible'); qs('#supportModal').setAttribute('aria-hidden', 'true'); }

qsa('[data-client-view]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.clientView)));
qsa('[data-jump-client]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.jumpClient)));
qsa('[data-open-request]').forEach((button) => button.addEventListener('click', openRequest));
qsa('[data-close-request]').forEach((button) => button.addEventListener('click', closeRequest));
qs('#openSupportTicket')?.addEventListener('click', openSupport);
qsa('[data-close-support]').forEach((button) => button.addEventListener('click', closeSupport));
qs('#supportFaqSearch')?.addEventListener('input', renderSupportFaq);
qs('#openClientNav').addEventListener('click', () => qs('#clientSidebar').classList.add('is-open'));
qs('#closeClientNav').addEventListener('click', () => qs('#clientSidebar').classList.remove('is-open'));

qs('#clientRequestForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget, message = qs('#requestMessage');
  message.textContent = 'جاري إرسال الطلب...'; message.classList.remove('is-error');
  try { await api('/api/client/requests', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); closeRequest(); await refresh(); switchView('requests'); toast('وصل طلبك للفريق بنجاح.'); }
  catch (error) { message.textContent = error.message; message.classList.add('is-error'); }
});

qs('#clientProfileForm').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget, message = qs('#profileMessage');
  try { await api('/api/client/profile', { method: 'PATCH', body: JSON.stringify(Object.fromEntries(new FormData(form))) }); message.textContent = 'تم حفظ بياناتك.'; await refresh(); }
  catch (error) { message.textContent = error.message; message.classList.add('is-error'); }
});

qs('#supportTicketForm')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget, message = qs('#supportMessage'), button = qs('button[type="submit"]', form);
  message.textContent = 'جاري إرسال التذكرة...'; message.classList.remove('is-error'); button.disabled = true;
  try { await api('/api/client/support-tickets', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); closeSupport(); await refresh(); switchView('support'); toast('فُتحت تذكرتك بنجاح.'); }
  catch (error) { message.textContent = error.message; message.classList.add('is-error'); } finally { button.disabled = false; }
});

qs('#clientLogout').addEventListener('click', async () => { try { await api('/api/client/logout', { method: 'POST', body: '{}' }); await state.authSdk.signOut(state.auth); } finally { location.replace('/client/login'); } });

const firebase = await getFirebaseServices(); state.auth = firebase.auth; state.authSdk = firebase.authSdk;
const initial = location.hash.slice(1); if (views[initial]) state.view = initial;
await refresh(); switchView(state.view);
