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
        window.location.replace('/employee-dashboard');
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
    clients: 'العملاء والفرص',
    chat: 'محادثة الفريق',
    packages: 'الباقات المعتمدة',
    pricing: 'مرجع الأسعار الداخلي',
    workflow: 'آلية العمل الموحّدة',
    services: 'الأقسام والخدمات',
  };
  const state = {
    data: null,
    currentView: 'overview',
    loading: false,
    pollId: null,
    staticRendered: false,
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
    row.append(toggle, copy);
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
      const move = element('button', '', `نقل إلى ${STATUS_META[next].label} ←`);
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

  function renderAll() {
    renderIdentity();
    renderMetrics();
    renderMiniPipeline();
    renderTasks();
    renderChat();
    renderPipeline();
    if (!state.staticRendered) {
      renderPackages();
      renderPricing();
      renderWorkflow();
      renderServices();
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
        window.location.replace('/employee-login');
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
    qsa('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.closeModal)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') qsa('.portal-modal.is-visible').forEach((modal) => closeModal(modal.id));
    });

    qs('#logoutButton')?.addEventListener('click', async () => {
      try {
        await api('/api/employee/logout', { method: 'POST' });
      } finally {
        window.location.replace('/employee-login');
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
