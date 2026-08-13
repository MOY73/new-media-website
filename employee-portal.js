(() => {
  'use strict';

  const page = document.body?.dataset.portalPage;
  if (!page) return;

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };

  const formatNumber = new Intl.NumberFormat('ar-SA');
  const formatMoney = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  });
  const formatDateTime = new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  function setThemeButton() {
    const button = qs('#themeBtn');
    if (!button) return;
    const isLight = document.documentElement.classList.contains('light');
    button.textContent = isLight ? '☾' : '☼';
    button.setAttribute('aria-label', isLight ? 'تفعيل المظهر الداكن' : 'تفعيل المظهر الفاتح');
  }

  function initializeTheme() {
    setThemeButton();
    qs('#themeBtn')?.addEventListener('click', () => {
      const preferences = window.NMPreferences;
      if (preferences?.toggleTheme) {
        preferences.toggleTheme();
      } else {
        document.documentElement.classList.toggle('light');
      }
      setThemeButton();
    });
  }

  async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const response = await fetch(path, {
      credentials: 'same-origin',
      ...options,
      headers,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'تعذر إكمال الطلب الآن.');
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function setMessage(node, message, isError = false) {
    if (!node) return;
    node.textContent = message || '';
    node.classList.toggle('is-error', Boolean(message && isError));
  }

  async function initializeLogin() {
    const form = qs('#loginForm');
    const username = qs('#username');
    const password = qs('#password');
    const message = qs('#loginMessage');
    const submitButton = qs('#loginButton');
    const toggle = qs('#togglePassword');

    toggle?.addEventListener('click', () => {
      const show = password.type === 'password';
      password.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'إخفاء' : 'إظهار';
      toggle.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const userValue = username.value.trim();
      if (!userValue || !password.value) {
        setMessage(message, 'اكتب اسم المستخدم وكلمة المرور.', true);
        return;
      }

      setMessage(message, 'جاري التحقق من الحساب...');
      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
      try {
        await api('/api/employee/login', {
          method: 'POST',
          body: JSON.stringify({ username: userValue, password: password.value }),
        });
        window.location.replace('/team/workspace');
      } catch (error) {
        password.value = '';
        password.focus();
        setMessage(message, error.message, true);
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
      }
    });

    username?.focus();
  }

  const STATUS_ORDER = ['lead', 'discovery', 'proposal', 'won', 'active'];
  const STATUS_META = {
    lead: { label: 'فرصة جديدة', next: 'discovery' },
    discovery: { label: 'مرحلة الاكتشاف', next: 'proposal' },
    proposal: { label: 'عرض مرسل', next: 'won' },
    won: { label: 'تم الإغلاق', next: 'active' },
    active: { label: 'عميل نشط', next: null },
  };
  const VIEW_TITLES = {
    applications: 'طلبات التقديم عبر الموقع',
    clients: 'العملاء والفرص',
    clientspace: 'بوابة العملاء والتسليم',
    leads: 'فرص مكة',
    chat: 'محادثة الفريق',
    packages: 'الباقات المعتمدة',
    pricing: 'مرجع الأسعار الداخلي',
    workflow: 'آلية العمل الموحّدة',
    services: 'الأقسام والخدمات',
    library: 'مكتبة ملفات الموظفين',
    activity: 'سجل نشاط الفريق',
  };
  const CHAT_GROUPS = [
    { id: 'general', label: 'العام', short: 'NM', description: 'مساحة الفريق المشتركة' },
    { id: 'digital-presence', label: 'الحضور الرقمي', short: 'DP', description: 'إدارة المنصات والمجتمع' },
    { id: 'creative-content', label: 'المحتوى والإنتاج', short: 'CP', description: 'الأفكار والتصميم والتصوير' },
    { id: 'brand-identity', label: 'الهوية والعلامة', short: 'BI', description: 'الاستراتيجية والنظام البصري' },
    { id: 'web-experience', label: 'المواقع والتجارب', short: 'WX', description: 'المواقع والواجهات والتطوير' },
    { id: 'growth-performance', label: 'النمو والأداء', short: 'GP', description: 'الحملات والقياس والتحسين' },
  ];
  const LEAD_CITIES = [
    ['مكة المكرمة', 'مكة'],
    ['جدة', 'جدة'],
    ['الرياض', 'الرياض'],
    ['المدينة المنورة', 'المدينة'],
    ['الخبر', 'الخبر'],
    ['الدمام', 'الدمام'],
  ];
  const state = {
    data: null,
    currentView: 'overview',
    loading: false,
    pollId: null,
    staticRendered: false,
    leadFilters: { search: '', neighborhood: 'all', category: 'all', priority: 'all', status: 'all' },
    leadCity: 'مكة المكرمة',
    leadPage: 1,
    chatGroup: 'general',
  };

  function initials(value) {
    const parts = String(value || 'NM').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'NM';
  }

  function displayDate(value) {
    const date = new Date(Number(value) || value);
    return Number.isNaN(date.getTime()) ? 'الآن' : formatDateTime.format(date);
  }

  function emptyState(message) {
    return element('div', 'portal-empty', message);
  }

  function showToast(message, isError = false) {
    const toast = qs('#portalToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-portal-modal');
    window.setTimeout(() => qs('input, select, textarea', modal)?.focus(), 80);
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    if (!qs('.portal-modal.is-visible')) document.body.classList.remove('has-portal-modal');
  }

  function switchView(view) {
    if (!qs(`[data-view-panel="${view}"]`)) return;
    state.currentView = view;
    qsa('[data-view-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.viewPanel === view));
    qsa('[data-view]').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view && (!button.dataset.leadCity || button.dataset.leadCity === state.leadCity)));
    const title = view === 'overview'
      ? `مرحبًا، ${state.data?.user?.name || 'فريق NEW MEDIA'}`
      : view === 'leads'
        ? `فرص ${LEAD_CITIES.find(([city]) => city === state.leadCity)?.[1] || state.leadCity}`
        : VIEW_TITLES[view];
    qs('#viewTitle').textContent = title;
    qs('#appSidebar')?.classList.remove('is-open');
    qs('#appContent')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', view === 'overview' ? '#overview' : `#${view}`);
  }

  function renderIdentity() {
    const user = state.data.user;
    qs('#userName').textContent = user.name;
    qs('#userHandle').textContent = `@${user.username}`;
    qs('#userAvatar').textContent = initials(user.name);
    qs('#userRole').textContent = user.role === 'super_admin' ? 'أعلى مدير' : user.role === 'manager' ? 'مدير' : 'موظف';
    qs('#activityNavItem').hidden = !['super_admin', 'manager'].includes(user.role);
    qs('#viewTitle').textContent = `مرحبًا، ${user.name}`;

    const today = new Date(state.data.serverTime || Date.now());
    qs('#todayLabel').textContent = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(today);
    qs('#todayNumber').textContent = new Intl.NumberFormat('ar-SA').format(today.getDate());
    qs('#todayMonth').textContent = new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(today);
  }

  function renderPresence() {
    const users = state.data.onlineUsers || [];
    const container = qs('#onlinePresence');
    if (!container) return;
    const nodes = users.slice(0, 20).map((user) => {
      const avatar = element('span', 'online-person', initials(user.name || user.username));
      avatar.title = `${user.name || user.username} · متصل الآن`;
      return avatar;
    });
    if (users.length > 20) {
      const more = element('button', 'online-more', `+${users.length - 20}`); more.type = 'button'; more.title = 'عرض بقية المتصلين'; nodes.push(more);
    }
    container.replaceChildren(...nodes);
  }

  function renderActivity() {
    const list = qs('#activityList');
    if (!list) return;
    if (!['super_admin', 'manager'].includes(state.data.user.role)) {
      list.replaceChildren(emptyState('هذا السجل متاح للمدير وأعلى مدير فقط.'));
      return;
    }
    const roleLabel = (role) => role === 'super_admin' ? 'أعلى مدير' : role === 'manager' ? 'مدير' : 'موظف';
    const rows = (state.data.activityLog || []).map((entry) => {
      const row = element('article', 'activity-row');
      const user = element('div', 'activity-user');
      user.append(element('strong', '', entry.actor_name), element('span', '', `${roleLabel(entry.actor_role)} · @${entry.actor_username}`));
      const copy = [entry.action, entry.detail].filter(Boolean).join(' — ');
      const time = element('time', '', displayDate(entry.created_at));
      row.append(element('div', 'activity-avatar', initials(entry.actor_name)), user, element('div', 'activity-copy', copy), time);
      return row;
    });
    list.replaceChildren(...(rows.length ? rows : [emptyState('لا يوجد نشاط مسجل بعد.') ]));
  }

  function renderMetrics() {
    const stats = state.data.stats;
    const won = state.data.clients.filter((client) => client.status === 'won').length;
    const metrics = [
      ['إجمالي العملاء', formatNumber.format(stats.clients), 'كل السجلات المشتركة'],
      ['الفرص المفتوحة', formatNumber.format(stats.opportunities), 'تحتاج متابعة أو عرض'],
      ['قيمة المسار', formatMoney.format(stats.pipelineValue), 'إجمالي القيمة المتوقعة'],
      ['العملاء النشطون', formatNumber.format(stats.active), 'في مرحلة التنفيذ'],
      ['إغلاقات ناجحة', formatNumber.format(won), 'جاهزة للتهيئة'],
    ];
    const cards = metrics.map(([label, value, hint]) => {
      const card = element('article', 'metric-card');
      card.append(element('span', '', label), element('strong', '', value), element('small', '', hint));
      return card;
    });
    qs('#metricsGrid').replaceChildren(...cards);
    qs('#clientsBadge').textContent = String(stats.opportunities);
    const applicationsBadge = qs('#applicationsBadge');
    if (applicationsBadge) applicationsBadge.textContent = String(stats.newApplications || 0);
    const leadsBadge = qs('#leadsBadge');
    if (leadsBadge) leadsBadge.textContent = String(stats.untouchedLeads || 0);
  }

  function renderMiniPipeline() {
    const max = Math.max(1, ...STATUS_ORDER.map((status) => state.data.clients.filter((client) => client.status === status).length));
    const nodes = STATUS_ORDER.map((status) => {
      const count = state.data.clients.filter((client) => client.status === status).length;
      const stage = element('article', 'mini-pipeline__stage');
      const bar = element('i');
      const level = count === 0 ? 0 : Math.max(1, Math.min(5, Math.ceil((count / max) * 5)));
      bar.classList.add(`level-${level}`);
      stage.append(bar, element('strong', '', formatNumber.format(count)), element('span', '', STATUS_META[status].label));
      return stage;
    });
    qs('#miniPipeline').replaceChildren(...nodes);
  }

  async function toggleTask(task) {
    try {
      await api(`/api/employee/tasks/${encodeURIComponent(task.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: task.status === 'done' ? 'open' : 'done' }),
      });
      await refreshData({ quiet: true });
      showToast(task.status === 'done' ? 'أعيدت المهمة إلى القائمة.' : 'تم إنجاز المهمة.');
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function createTaskNode(task) {
    const row = element('article', `task-item${task.status === 'done' ? ' is-done' : ''}`);
    const toggle = element('button', '', task.status === 'done' ? '✓' : '');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', task.status === 'done' ? 'إعادة فتح المهمة' : 'تحديد المهمة كمكتملة');
    toggle.addEventListener('click', () => toggleTask(task));
    const copy = element('div');
    copy.append(
      element('strong', '', task.title),
      element('span', '', [task.client_name, task.assignee, task.due_date].filter(Boolean).join(' • ') || 'بدون تفاصيل إضافية')
    );
    const remove = element('button', 'task-delete', '×');
    remove.type = 'button';
    remove.setAttribute('aria-label', `حذف المهمة ${task.title}`);
    remove.addEventListener('click', async () => {
      if (!window.confirm(`حذف المهمة «${task.title}»؟`)) return;
      remove.disabled = true;
      try {
        await api(`/api/employee/tasks/${encodeURIComponent(task.id)}`, { method: 'DELETE' });
        await refreshData({ quiet: true });
        showToast('تم حذف المهمة.');
      } catch (error) { showToast(error.message, true); }
      finally { remove.disabled = false; }
    });
    row.append(toggle, copy, remove);
    return row;
  }

  function renderTasks() {
    const tasks = state.data.tasks.slice(0, 7);
    qs('#overviewTasks').replaceChildren(...(tasks.length ? tasks.map(createTaskNode) : [emptyState('لا توجد مهام حتى الآن. أضف أول مهمة للفريق.') ]));
  }

  function createChatNode(message) {
    const own = message.author_username === state.data.user.username;
    const system = message.author_username === 'SYSTEM';
    const row = element('article', `chat-message${own ? ' is-own' : ''}${system ? ' is-system' : ''}`);
    const avatar = element('div', 'chat-message__avatar', initials(message.author_name));
    const content = element('div', 'chat-message__content');
    const meta = element('div', 'chat-message__meta');
    meta.append(element('strong', '', message.author_name), element('span', '', displayDate(message.created_at)));
    const bubble = element('div', 'chat-message__bubble', message.body);
    if (message.attachment_name) {
      const attachment = element('a', 'chat-attachment');
      attachment.href = `/api/employee/message-files/${encodeURIComponent(message.id)}`;
      attachment.download = message.attachment_name;
      attachment.append(element('b', '', 'PDF'), element('span', '', message.attachment_name));
      bubble.append(attachment);
    }
    content.append(meta, bubble);
    row.append(avatar, content);
    return row;
  }

  function renderChat() {
    const room = CHAT_GROUPS.find((item) => item.id === state.chatGroup) || CHAT_GROUPS[0];
    const groups = qs('#chatGroups');
    groups?.replaceChildren(...CHAT_GROUPS.map((item) => {
      const button = element('button', `chat-group-button${item.id === room.id ? ' is-active' : ''}`);
      button.type = 'button';
      button.append(element('b', '', item.short), element('span', '', item.label));
      button.addEventListener('click', () => {
        state.chatGroup = item.id;
        renderChat();
        qs('#chatInput')?.focus();
      });
      return button;
    }));
    if (qs('#chatRoomLogo')) qs('#chatRoomLogo').textContent = room.short;
    if (qs('#chatRoomTitle')) qs('#chatRoomTitle').textContent = room.label;
    if (qs('#chatRoomDescription')) qs('#chatRoomDescription').textContent = room.description;
    if (qs('#chatInput')) qs('#chatInput').placeholder = `اكتب في ${room.label} أو أرفق PDF...`;

    const messages = (state.data.messages || []).filter((message) => (message.group_id || 'general') === room.id);
    const fullChat = qs('#chatMessages');
    const shouldStick = !fullChat?.dataset.ready || (fullChat.scrollHeight - fullChat.scrollTop - fullChat.clientHeight < 120);
    fullChat.replaceChildren(...(messages.length ? messages.map(createChatNode) : [emptyState('ابدأ أول تحديث مع الفريق.') ]));
    if (shouldStick) fullChat.scrollTop = fullChat.scrollHeight;
    fullChat.dataset.ready = 'true';

    const generalMessages = (state.data.messages || []).filter((message) => (message.group_id || 'general') === 'general');
    const previewRows = generalMessages.slice(-3).reverse().map((message) => {
      const row = element('article', 'chat-preview__row');
      const copy = element('div');
      copy.append(element('strong', '', message.author_name), element('span', '', message.body));
      row.append(
        element('b', '', initials(message.author_name)),
        copy,
        element('time', '', displayDate(message.created_at))
      );
      return row;
    });
    qs('#chatPreview').replaceChildren(...(previewRows.length ? previewRows : [emptyState('لا توجد رسائل بعد.') ]));
  }

  function clientCard(client) {
    const card = element('article', 'client-card');
    const top = element('div', 'client-card__top');
    top.append(element('h3', '', client.name), element('span', 'client-card__value', formatMoney.format(Number(client.value || 0))));
    card.append(top, element('span', 'client-card__service', client.service || 'الخدمة غير محددة'));

    if (client.next_step) {
      const detail = element('p', 'client-card__detail');
      detail.append(element('b', '', 'التالي:'), document.createTextNode(` ${client.next_step}`));
      card.append(detail);
    }
    if (client.contact) {
      const detail = element('p', 'client-card__detail');
      detail.append(element('b', '', 'التواصل:'), document.createTextNode(` ${client.contact}`));
      card.append(detail);
    }

    const actions = element('div', 'client-card__actions');
    const owner = element('span', 'client-card__owner');
    owner.append(element('i', '', initials(client.owner || client.created_by)), document.createTextNode(client.owner || client.created_by || 'الفريق'));
    actions.append(owner);
    const next = STATUS_META[client.status]?.next;
    if (next) {
      const move = element('button', '', `نقل إلى ${STATUS_META[next].label} `);
      move.type = 'button';
      move.addEventListener('click', async () => {
        move.disabled = true;
        try {
          await api(`/api/employee/clients/${encodeURIComponent(client.id)}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: next }),
          });
          await refreshData({ quiet: true });
          showToast(`انتقل ${client.name} إلى ${STATUS_META[next].label}.`);
        } catch (error) {
          showToast(error.message, true);
        } finally {
          move.disabled = false;
        }
      });
      actions.append(move);
    }
    const remove = element('button', 'client-delete', 'حذف');
    remove.type = 'button';
    remove.addEventListener('click', async () => {
      const linkedRequest = client.created_by === 'WEBSITE';
      const warning = linkedRequest
        ? `حذف «${client.name}»؟\nسيُحذف أيضاً طلب الموقع والمهمة والمرفقات المرتبطة به.`
        : `حذف العميل «${client.name}» من مسار الفرص؟`;
      if (!window.confirm(warning)) return;
      remove.disabled = true;
      try {
        await api(`/api/employee/clients/${encodeURIComponent(client.id)}`, { method: 'DELETE' });
        await refreshData({ quiet: true });
        showToast(`تم حذف ${client.name}.`);
      } catch (error) { showToast(error.message, true); }
      finally { remove.disabled = false; }
    });
    actions.append(remove);
    card.append(actions);
    return card;
  }

  function renderPipeline() {
    const columns = STATUS_ORDER.map((status) => {
      const clients = state.data.clients.filter((client) => client.status === status);
      const column = element('section', 'pipeline-column');
      const head = element('div', 'pipeline-column__head');
      const title = element('div');
      title.append(element('i'), element('strong', '', STATUS_META[status].label));
      head.append(title, element('span', '', formatNumber.format(clients.length)));
      const body = element('div', 'pipeline-column__body');
      body.replaceChildren(...(clients.length ? clients.map(clientCard) : [emptyState('لا توجد سجلات في هذه المرحلة.') ]));
      column.append(head, body);
      return column;
    });
    qs('#pipelineBoard').replaceChildren(...columns);
  }

  const APPLICATION_STATUS = {
    new: { label: 'جديد', next: 'reviewing' },
    reviewing: { label: 'قيد المراجعة', next: 'contacted' },
    contacted: { label: 'تم التواصل', next: 'qualified' },
    qualified: { label: 'مؤهل', next: 'closed' },
    closed: { label: 'مغلق', next: null },
  };

  function detailRow(label, value) {
    if (!value || (Array.isArray(value) && !value.length)) return null;
    const row = element('div', 'application-detail__row');
    row.append(element('span', '', label), element('p', '', Array.isArray(value) ? value.join('، ') : value));
    return row;
  }

  function applicationCard(application) {
    const details = application.details || {};
    const card = element('article', 'application-card');
    const header = element('button', 'application-card__head');
    header.type = 'button';
    header.setAttribute('aria-expanded', 'false');
    const identity = element('div', 'application-card__identity');
    identity.append(element('span', '', application.reference), element('h3', '', application.organization || application.full_name), element('p', '', `${application.full_name} · ${application.services}`));
    const meta = element('div', 'application-card__meta');
    meta.append(element('span', `application-status application-status--${application.status}`, APPLICATION_STATUS[application.status]?.label || application.status), element('time', '', displayDate(application.created_at)), element('b', '', '+'));
    header.append(identity, meta);

    const body = element('div', 'application-card__body');
    const summary = element('section', 'application-summary');
    [
      ['ملخص الطلب', application.project_summary], ['التواصل', `${application.phone} · ${application.email}`],
      ['الميزانية', application.budget_range], ['موعد البدء', details.start_window],
      ['الهدف', details.primary_goal], ['الجمهور', details.target_audience]
    ].forEach(([label, value]) => { const row = detailRow(label, value); if (row) summary.append(row); });
    const deep = element('section', 'application-detail');
    [
      ['التفاصيل الكاملة', details.project_details], ['التحدي الحالي', details.current_challenge],
      ['نوع التعاون', details.engagement_type], ['ميزانية الإعلان', details.media_budget],
      ['القطاع', details.industry], ['الموقع', details.location], ['منصب مقدم الطلب', details.job_title],
      ['الموقع الإلكتروني', details.website_url], ['حسابات المنظمة', details.social_accounts],
      ['المنافسون', details.competitors], ['مراجع تعجبه', details.references],
      ['جاهزية القرار', details.decision_readiness], ['تعامل سابق مع وكالة', details.previous_agency],
      ['مصدر المعرفة', details.referral_source], ['ملاحظات النطاق', details.scope_notes]
    ].forEach(([label, value]) => { const row = detailRow(label, value); if (row) deep.append(row); });

    const files = element('div', 'application-files');
    if (application.files?.length) {
      files.append(element('strong', '', `المرفقات (${application.files.length})`));
      application.files.forEach((file) => {
        const link = element('a', '', file.original_name);
        link.href = `/api/employee/application-files/${encodeURIComponent(file.id)}`;
        link.target = '_blank';
        link.rel = 'noopener';
        const item = element('div');
        item.append(link, element('small', '', `${Math.ceil(Number(file.size_bytes || 0) / 1024)} KB`));
        files.append(item);
      });
    }

    const actions = element('div', 'application-card__actions');
    actions.append(element('span', '', application.email_status === 'sent' ? 'تم إرسال إشعار البريد' : 'محفوظ داخل النظام'));
    const actionButtons = element('div', 'application-card__buttons');
    const nextStatus = APPLICATION_STATUS[application.status]?.next;
    if (nextStatus) {
      const advance = element('button', '', `نقل إلى: ${APPLICATION_STATUS[nextStatus].label} `);
      advance.type = 'button';
      advance.addEventListener('click', async () => {
        advance.disabled = true;
        try {
          await api(`/api/employee/applications/${encodeURIComponent(application.id)}`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
          await refreshData({ quiet: true });
          showToast(`تم تحديث الطلب ${application.reference}.`);
        } catch (error) { showToast(error.message, true); }
        finally { advance.disabled = false; }
      });
      actionButtons.append(advance);
    }
    const remove = element('button', 'application-delete', 'حذف الطلب');
    remove.type = 'button';
    remove.addEventListener('click', async () => {
      const confirmed = window.confirm(`حذف الطلب ${application.reference}؟\nسيُحذف طلب الموقع والفرصة والمهمة والمرفقات المرتبطة به نهائياً.`);
      if (!confirmed) return;
      remove.disabled = true;
      try {
        await api(`/api/employee/applications/${encodeURIComponent(application.id)}`, { method: 'DELETE' });
        await refreshData({ quiet: true });
        showToast(`تم حذف الطلب ${application.reference}.`);
      } catch (error) { showToast(error.message, true); }
      finally { remove.disabled = false; }
    });
    actionButtons.append(remove);
    actions.append(actionButtons);
    body.append(summary, deep);
    if (application.files?.length) body.append(files);
    body.append(actions);
    header.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(open));
    });
    card.append(header, body);
    return card;
  }

  function renderApplications() {
    const applications = state.data.applications || [];
    qs('#applicationsList')?.replaceChildren(...(applications.length ? applications.map(applicationCard) : [emptyState('لم تصل طلبات عبر الموقع حتى الآن.') ]));
  }

  const CLIENT_PROJECT_STATUS = { new: 'جديد', scheduled: 'مجدول', in_progress: 'قيد التنفيذ', waiting_client: 'بانتظار العميل', completed: 'مكتمل', cancelled: 'ملغي' };
  const CLIENT_REQUEST_STATUS = { new: 'جديد', reviewing: 'قيد المراجعة', in_progress: 'قيد التنفيذ', waiting_client: 'بانتظار العميل', completed: 'مكتمل', cancelled: 'ملغي' };
  function clientName(uid) {
    const profile = (state.data.clientProfiles || []).find((item) => item.firebase_uid === uid);
    return profile?.display_name || profile?.organization || profile?.email || 'عميل';
  }
  function renderClientWorkspace() {
    const profiles = state.data.clientProfiles || [], projects = state.data.clientProjects || [], requests = state.data.clientRequests || [], deliveries = state.data.clientDeliveries || [];
    qs('#clientPortalBadge').textContent = String(profiles.length);
    const summary = [
      ['حسابات العملاء', profiles.length], ['مشاريع نشطة', projects.filter((p) => !['completed','cancelled'].includes(p.status)).length],
      ['طلبات مفتوحة', requests.filter((r) => !['completed','cancelled'].includes(r.status)).length], ['تسليمات بانتظار الاعتماد', deliveries.filter((d) => d.status === 'delivered').length]
    ].map(([label, value]) => { const node = element('article'); node.append(element('span', '', label), element('strong', '', String(value))); return node; });
    qs('#clientspaceSummary')?.replaceChildren(...summary);
    const clientNodes = profiles.map((profile) => { const card = element('article', 'clientspace-item'); card.append(element('div', 'clientspace-avatar', initials(profile.display_name || profile.email)), element('div', 'clientspace-copy')); const copy = qs('.clientspace-copy', card); copy.append(element('strong', '', profile.display_name || 'عميل جديد'), element('span', '', profile.organization || profile.email), element('small', '', `${projects.filter((p) => p.client_uid === profile.firebase_uid).length} مشروع`)); return card; });
    qs('#clientPortalClients')?.replaceChildren(...(clientNodes.length ? clientNodes : [emptyState('تظهر حسابات العملاء هنا بعد أول تسجيل دخول.') ]));
    const projectNodes = projects.map((project) => { const card = element('article', 'clientspace-project'); const head = element('div'); head.append(element('strong', '', project.title), element('span', '', clientName(project.client_uid))); const controls = element('div', 'clientspace-controls'); const status = leadSelect('', Object.keys(CLIENT_PROJECT_STATUS), project.status, CLIENT_PROJECT_STATUS); const progress = element('input'); progress.type='number'; progress.min='0'; progress.max='100'; progress.value=project.progress; progress.setAttribute('aria-label','نسبة الإنجاز'); const save=element('button','','حفظ'); save.type='button'; save.addEventListener('click', async()=>{ save.disabled=true; try { await api(`/api/employee/client-projects/${project.id}`,{method:'PATCH',body:JSON.stringify({status:status.value,progress:Number(progress.value)})}); await refreshData({quiet:true}); showToast('تم تحديث المشروع.'); } catch(error){showToast(error.message,true);} finally{save.disabled=false;} }); controls.append(status,progress,save); card.append(head, element('p','',project.current_stage || project.service || 'بانتظار تحديد المرحلة'), controls); return card; });
    qs('#clientPortalProjects')?.replaceChildren(...(projectNodes.length ? projectNodes : [emptyState('لا توجد مشاريع مشتركة بعد.') ]));
    const requestNodes = requests.map((request) => { const card=element('article','clientspace-request'); const copy=element('div'); copy.append(element('strong','',request.title),element('span','',clientName(request.client_uid)),element('p','',request.details)); const controls=element('div','clientspace-controls'); const status=leadSelect('',Object.keys(CLIENT_REQUEST_STATUS),request.status,CLIENT_REQUEST_STATUS); const note=element('input'); note.value=request.employee_note||''; note.placeholder='ملاحظة للعميل'; const save=element('button','','تحديث'); save.type='button'; save.addEventListener('click',async()=>{save.disabled=true;try{await api(`/api/employee/client-requests/${request.id}`,{method:'PATCH',body:JSON.stringify({status:status.value,employeeNote:note.value})});await refreshData({quiet:true});showToast('تم تحديث طلب العميل.');}catch(error){showToast(error.message,true);}finally{save.disabled=false;}}); controls.append(status,note,save); card.append(copy,controls); return card; });
    qs('#clientPortalRequests')?.replaceChildren(...(requestNodes.length ? requestNodes : [emptyState('لا توجد طلبات داخلية بعد.') ]));
    const deliveryNodes = deliveries.map((delivery)=>{ const card=element('article','clientspace-item'); const icon=element('div','clientspace-avatar','↓'); const copy=element('div','clientspace-copy'); copy.append(element('strong','',delivery.title),element('span','',clientName(delivery.client_uid)),element('small','',`${delivery.original_name} · ${delivery.status==='approved'?'اعتمده العميل':'بانتظار الاعتماد'}`)); card.append(icon,copy); return card; });
    qs('#clientPortalDeliveries')?.replaceChildren(...(deliveryNodes.length ? deliveryNodes : [emptyState('لم ترفع تسليمات بعد.') ]));
    const projectSelect = qs('#clientProjectUser');
    if (projectSelect) { const selected=projectSelect.value; const options=profiles.map(clientOption); projectSelect.replaceChildren(element('option','','اختر العميل'),...options); projectSelect.firstElementChild.value=''; projectSelect.value=profiles.some((p)=>p.firebase_uid===selected)?selected:''; }
    populateDeliveryClientOptions();
    refreshClientDeliveryProjects();
    renderClientSupport();
  }

  function clientOption(profile) {
    const label = [profile.display_name, profile.organization, profile.email].filter(Boolean).join(' · ');
    const option = element('option','',label); option.value=profile.firebase_uid; return option;
  }

  function populateDeliveryClientOptions() {
    const select=qs('#clientDeliveryUser'); if(!select)return;
    const selected=select.value, query=String(qs('#clientDeliverySearch')?.value||'').trim().toLowerCase();
    const profiles=(state.data?.clientProfiles||[]).filter((profile)=>!query||[profile.display_name,profile.organization,profile.email,profile.phone].some((value)=>String(value||'').toLowerCase().includes(query)));
    const first=element('option','',profiles.length?'اختر العميل':'لا توجد نتيجة مطابقة'); first.value='';
    select.replaceChildren(first,...profiles.map(clientOption));
    if(profiles.some((profile)=>profile.firebase_uid===selected)) select.value=selected;
    else { select.value=''; refreshClientDeliveryProjects(); }
  }

  const SUPPORT_STATUS = { open:'مفتوحة', in_progress:'قيد المعالجة', waiting_client:'بانتظار العميل', resolved:'تم الحل', closed:'إغلاق التذكرة' };
  function renderClientSupport() {
    const tickets=state.data.clientSupportTickets||[], messages=state.data.clientSupportMessages||[];
    const open=tickets.filter((ticket)=>!['resolved','closed'].includes(ticket.status)).length;
    if(qs('#clientSupportBadge')) qs('#clientSupportBadge').textContent=`${open} مفتوحة`;
    const nodes=tickets.map((ticket)=>{
      const card=element('article','client-support-ticket');
      const head=element('header'); const title=element('div'); title.append(element('span','',`${clientName(ticket.client_uid)} · ${ticket.category}`),element('strong','',ticket.subject)); const status=leadSelect('',Object.keys(SUPPORT_STATUS),ticket.status,SUPPORT_STATUS); head.append(title,status);
      const thread=element('div','client-support-thread');
      (messages.filter((message)=>message.ticket_id===ticket.id)).forEach((message)=>{const bubble=element('div',`client-support-message is-${message.sender_type}`);bubble.append(element('strong','',message.sender_type==='client'?clientName(ticket.client_uid):message.sender_name),element('p','',message.body),element('small','',displayDate(message.created_at)));thread.append(bubble);});
      const reply=element('form','client-support-reply'); const input=element('textarea'); input.placeholder='اكتب ردك للعميل...'; input.maxLength=2500; const send=element('button','','إرسال الرد');send.type='submit';
      reply.append(input,send); reply.addEventListener('submit',async(event)=>{event.preventDefault();const body=input.value.trim();if(!body)return;send.disabled=true;try{await api(`/api/employee/support-tickets/${ticket.id}/messages`,{method:'POST',body:JSON.stringify({body})});await refreshData({quiet:true});showToast('وصل ردك للعميل.');}catch(error){showToast(error.message,true);}finally{send.disabled=false;}});
      status.addEventListener('change',async()=>{status.disabled=true;try{await api(`/api/employee/support-tickets/${ticket.id}`,{method:'PATCH',body:JSON.stringify({status:status.value})});await refreshData({quiet:true});showToast('تم تحديث حالة التذكرة.');}catch(error){showToast(error.message,true);}finally{status.disabled=false;}});
      card.append(head,thread,reply); return card;
    });
    qs('#clientSupportTickets')?.replaceChildren(...(nodes.length?nodes:[emptyState('لا توجد تذاكر دعم حتى الآن.') ]));
  }

  function refreshClientDeliveryProjects() {
    const select=qs('#clientDeliveryProject'), uid=qs('#clientDeliveryUser')?.value||''; if(!select)return;
    const options=(state.data?.clientProjects||[]).filter((project)=>project.client_uid===uid).map((project)=>{const option=element('option','',project.title);option.value=project.id;return option;});
    const empty=element('option','','بدون مشروع محدد');empty.value='';select.replaceChildren(empty,...options);
  }

  function renderPackages() {
    const cards = state.data.knowledge.packages.map((item, index) => {
      const card = element('article', 'package-card');
      card.append(element('span', 'package-card__index', `PACKAGE / ${String(index + 1).padStart(2, '0')}`));
      card.append(element('h3', '', item.name));
      const price = element('div', 'package-card__price');
      price.append(element('strong', '', formatNumber.format(item.price)), element('span', '', `ر.س / ${item.cadence}`));
      card.append(price, element('p', '', item.summary));
      const facts = element('ul');
      item.facts.forEach((fact) => facts.append(element('li', '', fact)));
      card.append(facts);
      return card;
    });
    qs('#packageGrid').replaceChildren(...cards);
  }

  function renderPricing() {
    const blocks = state.data.knowledge.pricing.map((group, index) => {
      const block = element('section', `pricing-block${index === 0 ? ' is-open' : ''}`);
      const head = element('button', 'pricing-block__head');
      head.type = 'button';
      head.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
      const copy = element('div');
      copy.append(element('h3', '', group.title), element('p', '', group.note));
      head.append(copy, element('span', '', '+'));
      head.addEventListener('click', () => {
        const open = block.classList.toggle('is-open');
        head.setAttribute('aria-expanded', String(open));
      });
      const body = element('div', 'pricing-block__body');
      const table = element('table', 'pricing-table');
      const tableBody = element('tbody');
      group.items.forEach(([service, price]) => {
        const row = element('tr');
        row.append(element('td', '', service), element('td', '', price));
        tableBody.append(row);
      });
      table.append(tableBody);
      body.append(table);
      block.append(head, body);
      return block;
    });
    qs('#pricingStack').replaceChildren(...blocks);
  }

  function renderWorkflow() {
    const cards = state.data.knowledge.workflow.map(([title, description], index) => {
      const card = element('article', 'workflow-card');
      card.append(
        element('span', 'workflow-card__num', String(index + 1).padStart(2, '0')),
        element('h3', '', title),
        element('p', '', description)
      );
      return card;
    });
    qs('#workflowGrid').replaceChildren(...cards);
    qs('#rulesList').replaceChildren(...state.data.knowledge.rules.map((rule) => element('li', '', rule)));
  }

  function renderServices() {
    const cards = state.data.knowledge.services.map((service, index) => {
      const card = element('article', 'service-card');
      const top = element('div', 'service-card__top');
      top.append(element('span', '', `DIVISION / ${String(index + 1).padStart(2, '0')}`), element('i'));
      card.append(top, element('h3', '', service.name), element('p', '', service.purpose));
      const columns = element('div', 'service-card__columns');
      const ownership = element('div');
      ownership.append(element('strong', '', 'نطاق الملكية'));
      service.ownership.forEach((value) => ownership.append(element('span', '', value)));
      const metrics = element('div');
      metrics.append(element('strong', '', 'مؤشرات النجاح'));
      service.metrics.forEach((value) => metrics.append(element('span', '', value)));
      columns.append(ownership, metrics);
      card.append(columns);
      return card;
    });
    qs('#servicesGrid').replaceChildren(...cards);
  }

  const LEAD_STATUS_META = {
    new: 'جديد', working: 'قيد العمل', contacted: 'تم التواصل', interested: 'مهتم',
    follow_up: 'متابعة', not_interested: 'غير مهتم', converted: 'تم التحويل',
  };
  const LEAD_OUTCOME_META = {
    not_contacted: 'لم يتم التواصل', no_answer: 'لم يرد', follow_up: 'يحتاج متابعة',
    interested: 'مهتم', not_interested: 'غير مهتم', converted: 'تم التحويل',
  };
  function teamMembers() {
    const members = (state.data?.teamMembers || []).map((member) => String(member.username || '').toUpperCase()).filter(Boolean);
    return ['', ...new Set(members)];
  }

  function teamMemberLabels() {
    const labels = { '': 'غير مسند' };
    (state.data?.teamMembers || []).forEach((member) => {
      const username = String(member.username || '').toUpperCase();
      if (username) labels[username] = `${member.name || username} · ${username}`;
    });
    return labels;
  }

  function leadSelect(className, values, selected, labels) {
    const select = element('select', className);
    values.forEach((value) => {
      const option = element('option', '', labels[value] || value || 'غير مسند');
      option.value = value;
      option.selected = value === selected;
      select.append(option);
    });
    return select;
  }

  async function updateLead(lead, payload, successMessage) {
    await api(`/api/employee/leads/${encodeURIComponent(lead.id)}`, {
      method: 'PATCH', body: JSON.stringify(payload),
    });
    await refreshData({ quiet: true });
    showToast(successMessage);
  }

  function leadCard(lead) {
    const card = element('article', `lead-card lead-card--p${lead.priority}`);
    const top = element('div', 'lead-card__top');
    const identity = element('div');
    identity.append(
      element('span', 'lead-card__ref', `${lead.id} · ${lead.neighborhood} · ${lead.category}`),
      element('h3', '', lead.name),
      element('p', '', lead.activity)
    );
    top.append(identity, element('b', 'lead-priority', `P${lead.priority}`));

    const score = element('div', 'lead-score');
    score.append(element('span', '', 'درجة الملاءمة'), element('strong', '', `${lead.score}/100`));
    const contact = element('div', 'lead-contact');
    if (lead.phone) {
      const phone = element('a', '', lead.phone); phone.href = `tel:${lead.phone.replace(/\s/g, '')}`; contact.append(phone);
    }
    if (lead.email) {
      const email = element('a', '', lead.email); email.href = `mailto:${lead.email}`; contact.append(email);
    }
    if (!lead.phone && !lead.email) contact.append(element('span', '', 'لا توجد بيانات تواصل مباشرة'));

    const service = element('div', 'lead-service');
    service.append(element('small', '', 'الخدمة المقترحة'), element('p', '', lead.recommended_service));
    const controls = element('div', 'lead-controls');
    const owners = teamMembers();
    if (lead.owner && !owners.includes(lead.owner)) owners.push(lead.owner);
    const owner = leadSelect('lead-owner', owners, lead.owner || '', teamMemberLabels());
    const status = leadSelect('lead-state', Object.keys(LEAD_STATUS_META), lead.contact_status, LEAD_STATUS_META);
    const outcome = leadSelect('lead-outcome', Object.keys(LEAD_OUTCOME_META), lead.outcome, LEAD_OUTCOME_META);
    const save = element('button', 'lead-save', 'حفظ الحالة'); save.type = 'button';
    save.addEventListener('click', async () => {
      save.disabled = true;
      try { await updateLead(lead, { owner: owner.value, contactStatus: status.value, outcome: outcome.value }, `تم تحديث ${lead.name}.`); }
      catch (error) { showToast(error.message, true); } finally { save.disabled = false; }
    });
    controls.append(owner, status, outcome, save);

    const actions = element('div', 'lead-actions');
    const maps = element('a', '', 'فتح الخرائط'); maps.href = lead.maps_url; maps.target = '_blank'; maps.rel = 'noopener';
    const website = lead.website ? element('a', '', 'الموقع') : null;
    if (website) { website.href = lead.website; website.target = '_blank'; website.rel = 'noopener'; }
    const task = element('button', '', lead.converted_task_id ? 'مضافة للمهام' : 'تحويل لمهمة'); task.type = 'button'; task.disabled = Boolean(lead.converted_task_id);
    task.addEventListener('click', async () => {
      task.disabled = true;
      try {
        await api(`/api/employee/leads/${encodeURIComponent(lead.id)}/convert-task`, { method: 'POST', body: JSON.stringify({ owner: owner.value }) });
        await refreshData({ quiet: true }); showToast(`أضيفت مهمة التواصل مع ${lead.name}.`);
      } catch (error) { task.disabled = false; showToast(error.message, true); }
    });
    const client = element('button', 'lead-convert', lead.converted_client_id ? 'مضاف للعملاء' : 'تحويل لعميل'); client.type = 'button'; client.disabled = Boolean(lead.converted_client_id);
    client.addEventListener('click', async () => {
      if (!window.confirm(`تحويل ${lead.name} إلى مسار العملاء؟`)) return;
      client.disabled = true;
      try {
        await api(`/api/employee/leads/${encodeURIComponent(lead.id)}/convert-client`, { method: 'POST', body: JSON.stringify({ owner: owner.value }) });
        await refreshData({ quiet: true }); showToast(`أضيف ${lead.name} إلى مسار العملاء.`);
      } catch (error) { client.disabled = false; showToast(error.message, true); }
    });
    const remove = element('button', 'lead-delete', 'حذف الفرصة'); remove.type = 'button';
    remove.addEventListener('click', async () => {
      if (!window.confirm(`حذف فرصة «${lead.name}» نهائيًا من قائمة الاستهداف؟`)) return;
      remove.disabled = true;
      try {
        await api(`/api/employee/leads/${encodeURIComponent(lead.id)}`, { method: 'DELETE' });
        await refreshData({ quiet: true });
        showToast(`تم حذف فرصة ${lead.name}.`);
      } catch (error) { remove.disabled = false; showToast(error.message, true); }
    });
    actions.append(maps); if (website) actions.append(website); actions.append(task, client, remove);
    card.append(top, score, contact, service, controls, actions);
    return card;
  }

  function renderLeads() {
    const allLeads = state.data.leads || [];
    const categoryOwner = qs('#leadCategoryOwner');
    if (categoryOwner) {
      const selectedOwner = categoryOwner.value;
      categoryOwner.replaceChildren(...teamMembers().map((username) => {
        const option = element('option', '', username ? teamMemberLabels()[username] : 'اختر المسؤول');
        option.value = username;
        option.selected = username === selectedOwner;
        return option;
      }));
    }
    const leadCity = (lead) => lead.city || 'مكة المكرمة';
    const cityLeads = allLeads.filter((lead) => leadCity(lead) === state.leadCity);
    const neighborhoods = [...new Set(cityLeads.map((lead) => lead.neighborhood))].sort((a, b) => a.localeCompare(b, 'ar'));
    const categories = [...new Set(cityLeads.map((lead) => lead.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ar'));
    const neighborhoodSelect = qs('#leadNeighborhood');
    if (neighborhoodSelect) {
      neighborhoodSelect.replaceChildren();
      const allOption = element('option', '', 'كل الأحياء'); allOption.value = 'all'; neighborhoodSelect.append(allOption);
      neighborhoods.forEach((name) => { const option = element('option', '', name); option.value = name; neighborhoodSelect.append(option); });
      if (neighborhoods.includes(state.leadFilters.neighborhood)) neighborhoodSelect.value = state.leadFilters.neighborhood;
      else state.leadFilters.neighborhood = 'all';
    }
    const categorySelect = qs('#leadCategory');
    if (categorySelect) {
      categorySelect.replaceChildren();
      const allOption = element('option', '', 'كل التصنيفات'); allOption.value = 'all'; categorySelect.append(allOption);
      categories.forEach((name) => { const option = element('option', '', name); option.value = name; categorySelect.append(option); });
      if (categories.includes(state.leadFilters.category)) categorySelect.value = state.leadFilters.category;
      else state.leadFilters.category = 'all';
    }
    const filters = state.leadFilters;
    const query = filters.search.trim().toLowerCase();
    const leads = cityLeads.filter((lead) => {
      const haystack = `${lead.name} ${lead.activity} ${lead.phone} ${lead.email} ${lead.neighborhood}`.toLowerCase();
      return (!query || haystack.includes(query)) &&
        (filters.neighborhood === 'all' || lead.neighborhood === filters.neighborhood) &&
        (filters.category === 'all' || lead.category === filters.category) &&
        (filters.priority === 'all' || String(lead.priority) === filters.priority) &&
        (filters.status === 'all' || lead.contact_status === filters.status);
    });
    const p1 = cityLeads.filter((lead) => Number(lead.priority) === 1).length;
    const p2 = cityLeads.filter((lead) => Number(lead.priority) === 2).length;
    const p3 = cityLeads.filter((lead) => Number(lead.priority) === 3).length;
    const kpis = [
      ['كل الفرص', cityLeads.length], ['أولوية P1', p1], ['أولوية P2', p2], ['أولوية P3', p3],
    ].map(([label, value]) => { const item = element('article'); item.append(element('span', '', label), element('strong', '', formatNumber.format(value))); return item; });
    qs('#leadsKpis')?.replaceChildren(...kpis);
    const cityLabel = LEAD_CITIES.find(([city]) => city === state.leadCity)?.[1] || state.leadCity;
    const isMakkah = state.leadCity === 'مكة المكرمة';
    qs('#leadsIntroKicker').textContent = isMakkah ? 'MAKKAH PROSPECTING / 1,000 VERIFIED LEADS' : `${state.leadCity.toUpperCase()} PROSPECTING / READY FOR NEXT BATCH`;
    qs('#leadsIntroTitle').textContent = `فرص ${cityLabel}`;
    qs('#leadsIntroCopy').textContent = isMakkah
      ? 'ألف منشأة عامة موزعة على 23 حيًا وقطاعات متعددة. لكل فرصة مصدر ورابط خرائط وتاريخ جمع؛ راجع بياناتها قبل التواصل ثم عيّن المسؤول وسجّل النتيجة.'
      : `قسم ${cityLabel} جاهز لاستقبال دفعة الفرص القادمة. لن تظهر هنا أي بيانات حتى تتم إضافتها ومراجعتها.`;
    qs('#leadsExcelLink').hidden = !isMakkah;
    qsa('[data-lead-city]').forEach((button) => {
      const cityCount = allLeads.filter((lead) => leadCity(lead) === button.dataset.leadCity).length;
      const badge = qs('em', button); if (badge) badge.textContent = formatNumber.format(cityCount);
      button.classList.toggle('is-active', state.currentView === 'leads' && button.dataset.leadCity === state.leadCity);
    });
    const pageSize = 50;
    const pageCount = Math.max(1, Math.ceil(leads.length / pageSize));
    state.leadPage = Math.min(Math.max(1, state.leadPage), pageCount);
    const start = (state.leadPage - 1) * pageSize;
    const visibleLeads = leads.slice(start, start + pageSize);
    qs('#leadsGrid')?.replaceChildren(...(visibleLeads.length ? visibleLeads.map(leadCard) : [emptyState('لا توجد فرص مطابقة لهذه التصفية.') ]));
    const count = qs('#leadsVisibleCount');
    if (count) count.textContent = leads.length
      ? `الصفحة ${formatNumber.format(state.leadPage)} من ${formatNumber.format(pageCount)} · ${formatNumber.format(start + 1)}–${formatNumber.format(start + visibleLeads.length)} من ${formatNumber.format(leads.length)} فرصة`
      : 'لا توجد فرص في هذا التصنيف';
    const pagination = qs('#leadPagination');
    if (pagination) {
      const buttons = [];
      for (let page = 1; page <= pageCount; page += 1) {
        const button = element('button', `page-button${page === state.leadPage ? ' is-active' : ''}`, formatNumber.format(page));
        button.type = 'button'; button.setAttribute('aria-label', `الصفحة ${page}`);
        button.addEventListener('click', () => { state.leadPage = page; renderLeads(); qs('#leadsGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        buttons.push(button);
      }
      pagination.replaceChildren(...(pageCount > 1 ? buttons : []));
    }
    const assignButton = qs('#assignLeadCategory');
    if (assignButton) assignButton.disabled = filters.category === 'all' || !cityLeads.length;
  }

  function renderLibrary() {
    const documents = [
      ['نموذج عمل الوكالة', 'التشغيل والمسار العملي', 'new-media-agency-work-model.pdf'],
      ['باقات العملاء', 'نسخة الباقات العربية', 'new-media-client-packages-ar.pdf'],
      ['الحوكمة والقواعد', 'قواعد الشركة والاعتمادات', 'new-media-company-governance-rules.pdf'],
      ['الأقسام والأدوار', 'دليل مسؤوليات الفريق', 'new-media-departments-roles-handbook.pdf'],
      ['الخدمات والباقات والأسعار', 'مرجع التسعير الداخلي', 'new-media-service-packages-pricing.pdf'],
      ['دليل الخدمات والأقسام', 'النسخة العربية الشاملة', 'new-media-services-departments-guide-ar.pdf'],
    ];
    const cards = documents.map(([title, note, file], index) => {
      const card = element('article', 'document-card');
      card.append(element('span', '', `PDF / ${String(index + 1).padStart(2, '0')}`), element('h3', '', title), element('p', '', note));
      const link = element('a', '', 'فتح المرجع'); link.href = `/team/library/${file}`; link.target = '_blank'; link.rel = 'noopener'; card.append(link);
      return card;
    });
    qs('#documentLibrary')?.replaceChildren(...cards);
  }

  function renderAll() {
    renderIdentity();
    renderPresence();
    renderMetrics();
    renderMiniPipeline();
    renderTasks();
    renderChat();
    renderPipeline();
    renderApplications();
    renderClientWorkspace();
    renderLeads();
    renderActivity();
    if (!state.staticRendered) {
      renderPackages();
      renderPricing();
      renderWorkflow();
      renderServices();
      renderLibrary();
      state.staticRendered = true;
    }
  }

  async function refreshData({ quiet = false } = {}) {
    if (state.loading) return;
    state.loading = true;
    const sync = qs('#syncLabel');
    if (!quiet) sync.textContent = 'جاري المزامنة';
    try {
      state.data = await api('/api/employee/data');
      renderAll();
      sync.textContent = 'متزامن الآن';
      sync.parentElement?.classList.remove('is-error');
    } catch (error) {
      if (error.status === 401) {
        window.location.replace('/team/login');
        return;
      }
      sync.textContent = 'تعذر التزامن';
      sync.parentElement?.classList.add('is-error');
      if (!quiet) showToast(error.message, true);
    } finally {
      state.loading = false;
    }
  }

  function formPayload(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function bindDashboardEvents() {
    qsa('[data-view]:not([data-lead-city])').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
    qsa('[data-lead-city]').forEach((button) => button.addEventListener('click', () => {
      state.leadCity = button.dataset.leadCity;
      state.leadFilters.neighborhood = 'all';
      state.leadFilters.category = 'all';
      state.leadPage = 1;
      switchView('leads');
      renderLeads();
    }));
    qs('#leadsNavToggle')?.addEventListener('click', () => {
      const group = qs('#leadsNavGroup');
      const expanded = !group?.classList.contains('is-open');
      group?.classList.toggle('is-open', expanded);
      qs('#leadsNavToggle')?.setAttribute('aria-expanded', String(expanded));
    });
    qsa('[data-jump-view]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.jumpView)));
    qs('#sidebarOpen')?.addEventListener('click', () => qs('#appSidebar')?.classList.add('is-open'));
    qs('#sidebarClose')?.addEventListener('click', () => qs('#appSidebar')?.classList.remove('is-open'));
    qs('#quickAddClient')?.addEventListener('click', () => openModal('clientModal'));
    qs('#addClientFromView')?.addEventListener('click', () => openModal('clientModal'));
    qs('#quickAddTask')?.addEventListener('click', () => openModal('taskModal'));
    qs('#openClientProjectModal')?.addEventListener('click', () => openModal('clientProjectModal'));
    qs('#openClientDeliveryModal')?.addEventListener('click', () => openModal('clientDeliveryModal'));
    qs('#clientDeliveryUser')?.addEventListener('change', refreshClientDeliveryProjects);
    qs('#clientDeliverySearch')?.addEventListener('input', populateDeliveryClientOptions);
    const leadFilterBindings = [
      ['#leadSearch', 'search', 'input'], ['#leadNeighborhood', 'neighborhood', 'change'],
      ['#leadCategory', 'category', 'change'],
      ['#leadPriority', 'priority', 'change'], ['#leadStatus', 'status', 'change'],
    ];
    leadFilterBindings.forEach(([selector, key, eventName]) => qs(selector)?.addEventListener(eventName, (event) => {
      state.leadFilters[key] = event.currentTarget.value;
      state.leadPage = 1;
      renderLeads();
    }));
    qs('#assignLeadCategory')?.addEventListener('click', async () => {
      const category = state.leadFilters.category;
      const owner = qs('#leadCategoryOwner')?.value || '';
      if (category === 'all' || !owner) { showToast('اختر تصنيفًا ومسؤولًا أولًا.', true); return; }
      if (!window.confirm(`توزيع كل فرص تصنيف «${category}» في ${state.leadCity} على ${owner}؟`)) return;
      const button = qs('#assignLeadCategory'); button.disabled = true;
      try {
        const result = await api('/api/employee/leads/assign-category', { method: 'POST', body: JSON.stringify({ city: state.leadCity, category, owner }) });
        await refreshData({ quiet: true });
        showToast(`تم توزيع ${formatNumber.format(result.count || 0)} فرصة على ${owner}.`);
      } catch (error) { showToast(error.message, true); } finally { button.disabled = false; }
    });
    qsa('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') qsa('.portal-modal.is-visible').forEach((modal) => closeModal(modal.id));
    });

    qs('#logoutButton')?.addEventListener('click', async () => {
      try {
        await api('/api/employee/logout', { method: 'POST' });
      } finally {
        window.location.replace('/team/login');
      }
    });

    qs('#clientForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const message = qs('#clientFormMessage');
      const button = qs('button[type="submit"]', form);
      button.disabled = true;
      setMessage(message, 'جاري حفظ العميل...');
      try {
        await api('/api/employee/clients', { method: 'POST', body: JSON.stringify(formPayload(form)) });
        form.reset();
        setMessage(message, '');
        closeModal('clientModal');
        await refreshData({ quiet: true });
        showToast('تمت إضافة العميل إلى اللوحة المشتركة.');
      } catch (error) {
        setMessage(message, error.message, true);
      } finally {
        button.disabled = false;
      }
    });

    qs('#taskForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const message = qs('#taskFormMessage');
      const button = qs('button[type="submit"]', form);
      button.disabled = true;
      setMessage(message, 'جاري إضافة المهمة...');
      try {
        await api('/api/employee/tasks', { method: 'POST', body: JSON.stringify(formPayload(form)) });
        form.reset();
        setMessage(message, '');
        closeModal('taskModal');
        await refreshData({ quiet: true });
        showToast('أضيفت المهمة إلى مساحة الفريق.');
      } catch (error) {
        setMessage(message, error.message, true);
      } finally {
        button.disabled = false;
      }
    });

    qs('#clientProjectForm')?.addEventListener('submit', async (event) => {
      event.preventDefault(); const form=event.currentTarget, button=qs('button[type="submit"]',form), message=qs('#clientProjectFormMessage'); button.disabled=true; setMessage(message,'جاري إنشاء المشروع...');
      try { await api('/api/employee/client-projects',{method:'POST',body:JSON.stringify(formPayload(form))}); form.reset(); setMessage(message,''); closeModal('clientProjectModal'); await refreshData({quiet:true}); showToast('ظهر المشروع الآن في حساب العميل.'); }
      catch(error){setMessage(message,error.message,true);} finally{button.disabled=false;}
    });

    qs('#clientDeliveryForm')?.addEventListener('submit', async (event) => {
      event.preventDefault(); const form=event.currentTarget, button=qs('button[type="submit"]',form), message=qs('#clientDeliveryFormMessage'); button.disabled=true; setMessage(message,'جاري رفع التسليم...');
      try { await api('/api/employee/client-deliveries',{method:'POST',body:new FormData(form)}); form.reset(); refreshClientDeliveryProjects(); setMessage(message,''); closeModal('clientDeliveryModal'); await refreshData({quiet:true}); showToast('وصل التسليم إلى حساب العميل.'); }
      catch(error){setMessage(message,error.message,true);} finally{button.disabled=false;}
    });

    qs('#chatForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = qs('#chatInput');
      const body = input.value.trim();
      const fileInput = qs('#chatPdf');
      const file = fileInput?.files?.[0];
      if (!body && !file) return;
      if (file && (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))) {
        showToast('المرفق يجب أن يكون ملف PDF.', true);
        return;
      }
      if (file && file.size > 8 * 1024 * 1024) {
        showToast('حجم ملف PDF يجب ألا يتجاوز 8 ميجابايت.', true);
        return;
      }
      const button = qs('button[type="submit"]', event.currentTarget);
      button.disabled = true;
      try {
        const payload = new FormData();
        payload.append('body', body);
        payload.append('groupId', state.chatGroup);
        if (file) payload.append('pdf', file);
        await api('/api/employee/messages', { method: 'POST', body: payload });
        input.value = '';
        if (fileInput) fileInput.value = '';
        if (qs('#chatFileName')) qs('#chatFileName').textContent = '';
        await refreshData({ quiet: true });
      } catch (error) {
        showToast(error.message, true);
      } finally {
        button.disabled = false;
      }
    });

    qs('#chatPdf')?.addEventListener('change', (event) => {
      const file = event.currentTarget.files?.[0];
      const label = qs('#chatFileName');
      if (!file) {
        if (label) label.textContent = '';
        return;
      }
      if ((file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) || file.size > 8 * 1024 * 1024) {
        event.currentTarget.value = '';
        if (label) label.textContent = '';
        showToast(file.size > 8 * 1024 * 1024 ? 'حجم ملف PDF يجب ألا يتجاوز 8 ميجابايت.' : 'المرفق يجب أن يكون ملف PDF.', true);
        return;
      }
      if (label) label.textContent = file.name;
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshData({ quiet: true });
    });
  }

  async function initializeDashboard() {
    bindDashboardEvents();
    await refreshData();
    if (!state.data) return;
    const initialView = window.location.hash.slice(1) || 'overview';
    const isValidView = initialView === 'overview' || Object.hasOwn(VIEW_TITLES, initialView);
    switchView(isValidView ? initialView : 'overview');
    state.pollId = window.setInterval(() => {
      if (!document.hidden) refreshData({ quiet: true });
    }, 15000);
  }

  initializeTheme();
  if (page === 'login') initializeLogin();
  if (page === 'dashboard') initializeDashboard();
})();
