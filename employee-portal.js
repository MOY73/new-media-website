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
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
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
    leads: 'فرص مكة',
    chat: 'محادثة الفريق',
    packages: 'الباقات المعتمدة',
    pricing: 'مرجع الأسعار الداخلي',
    workflow: 'آلية العمل الموحّدة',
    services: 'الأقسام والخدمات',
    library: 'مكتبة ملفات الموظفين',
  };
  const state = {
    data: null,
    currentView: 'overview',
    loading: false,
    pollId: null,
    staticRendered: false,
    leadFilters: { search: '', neighborhood: 'all', priority: 'all', status: 'all' },
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
    qsa('[data-view]').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
    const title = view === 'overview'
      ? `مرحبًا، ${state.data?.user?.name || 'فريق NEW MEDIA'}`
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
    qs('#viewTitle').textContent = `مرحبًا، ${user.name}`;

    const today = new Date(state.data.serverTime || Date.now());
    qs('#todayLabel').textContent = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(today);
    qs('#todayNumber').textContent = new Intl.NumberFormat('ar-SA').format(today.getDate());
    qs('#todayMonth').textContent = new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(today);
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
    const row = element('article', `chat-message${own ? ' is-own' : ''}`);
    const avatar = element('div', 'chat-message__avatar', initials(message.author_name));
    const content = element('div', 'chat-message__content');
    const meta = element('div', 'chat-message__meta');
    meta.append(element('strong', '', message.author_name), element('span', '', displayDate(message.created_at)));
    content.append(meta, element('div', 'chat-message__bubble', message.body));
    row.append(avatar, content);
    return row;
  }

  function renderChat() {
    const messages = state.data.messages;
    const fullChat = qs('#chatMessages');
    fullChat.replaceChildren(...(messages.length ? messages.map(createChatNode) : [emptyState('ابدأ أول تحديث مع الفريق.') ]));
    fullChat.scrollTop = fullChat.scrollHeight;

    const previewRows = messages.slice(-3).reverse().map((message) => {
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
  const TEAM_MEMBERS = ['', 'MOY', 'AK', 'AZOZ', 'EMAD'];

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
      element('span', 'lead-card__ref', `${lead.id} · ${lead.neighborhood}`),
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
    const owner = leadSelect('lead-owner', TEAM_MEMBERS, lead.owner || '', Object.fromEntries(TEAM_MEMBERS.map((item) => [item, item || 'غير مسند'])));
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
    actions.append(maps); if (website) actions.append(website); actions.append(task, client);
    card.append(top, score, contact, service, controls, actions);
    return card;
  }

  function renderLeads() {
    const allLeads = state.data.leads || [];
    const neighborhoods = [...new Set(allLeads.map((lead) => lead.neighborhood))];
    const neighborhoodSelect = qs('#leadNeighborhood');
    if (neighborhoodSelect && neighborhoodSelect.options.length === 1) {
      neighborhoods.forEach((name) => { const option = element('option', '', name); option.value = name; neighborhoodSelect.append(option); });
    }
    const filters = state.leadFilters;
    const query = filters.search.trim().toLowerCase();
    const leads = allLeads.filter((lead) => {
      const haystack = `${lead.name} ${lead.activity} ${lead.phone} ${lead.email} ${lead.neighborhood}`.toLowerCase();
      return (!query || haystack.includes(query)) &&
        (filters.neighborhood === 'all' || lead.neighborhood === filters.neighborhood) &&
        (filters.priority === 'all' || String(lead.priority) === filters.priority) &&
        (filters.status === 'all' || lead.contact_status === filters.status);
    });
    const contacted = allLeads.filter((lead) => lead.contact_status !== 'new').length;
    const converted = allLeads.filter((lead) => lead.contact_status === 'converted').length;
    const p1 = allLeads.filter((lead) => Number(lead.priority) === 1).length;
    const kpis = [
      ['كل الفرص', allLeads.length], ['شركات P1', p1], ['بدأ التواصل', contacted], ['تحولت لعملاء', converted],
    ].map(([label, value]) => { const item = element('article'); item.append(element('span', '', label), element('strong', '', formatNumber.format(value))); return item; });
    qs('#leadsKpis')?.replaceChildren(...kpis);
    qs('#leadsGrid')?.replaceChildren(...(leads.length ? leads.map(leadCard) : [emptyState('لا توجد فرص مطابقة لهذه التصفية.') ]));
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
    renderMetrics();
    renderMiniPipeline();
    renderTasks();
    renderChat();
    renderPipeline();
    renderApplications();
    renderLeads();
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
    qsa('[data-view]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
    qsa('[data-jump-view]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.jumpView)));
    qs('#sidebarOpen')?.addEventListener('click', () => qs('#appSidebar')?.classList.add('is-open'));
    qs('#sidebarClose')?.addEventListener('click', () => qs('#appSidebar')?.classList.remove('is-open'));
    qs('#quickAddClient')?.addEventListener('click', () => openModal('clientModal'));
    qs('#addClientFromView')?.addEventListener('click', () => openModal('clientModal'));
    qs('#quickAddTask')?.addEventListener('click', () => openModal('taskModal'));
    const leadFilterBindings = [
      ['#leadSearch', 'search', 'input'], ['#leadNeighborhood', 'neighborhood', 'change'],
      ['#leadPriority', 'priority', 'change'], ['#leadStatus', 'status', 'change'],
    ];
    leadFilterBindings.forEach(([selector, key, eventName]) => qs(selector)?.addEventListener(eventName, (event) => {
      state.leadFilters[key] = event.currentTarget.value;
      renderLeads();
    }));
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

    qs('#chatForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = qs('#chatInput');
      const body = input.value.trim();
      if (!body) return;
      const button = qs('button[type="submit"]', event.currentTarget);
      button.disabled = true;
      try {
        await api('/api/employee/messages', { method: 'POST', body: JSON.stringify({ body }) });
        input.value = '';
        await refreshData({ quiet: true });
      } catch (error) {
        showToast(error.message, true);
      } finally {
        button.disabled = false;
      }
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
