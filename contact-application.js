(() => {
  'use strict';
  const form = document.getElementById('applicationForm');
  if (!form) return;
  const steps = [...document.querySelectorAll('.form-step')];
  const indicators = [...document.querySelectorAll('[data-step-indicator]')];
  const previous = document.getElementById('previousStep');
  const next = document.getElementById('nextStep');
  const submit = document.getElementById('submitApplication');
  const alert = document.getElementById('formAlert');
  const progress = document.getElementById('progressBar');
  const stepLabel = document.getElementById('stepLabel');
  const fileInput = document.getElementById('attachments');
  const fileList = document.getElementById('fileList');
  const uploadZone = document.getElementById('uploadZone');
  const draftStatus = document.getElementById('draftStatus');
  const DRAFT_KEY = 'nm-project-application-draft-v1';
  const MAX_FILES = 8;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  let currentStep = 1;
  let selectedFiles = [];
  let saveTimer;
  document.getElementById('formStartedAt').value = String(Date.now());

  function showAlert(message) {
    alert.textContent = message || '';
    alert.classList.toggle('is-visible', Boolean(message));
  }

  function showStep(number) {
    currentStep = Math.max(1, Math.min(steps.length, number));
    steps.forEach((step) => step.classList.toggle('is-active', Number(step.dataset.step) === currentStep));
    indicators.forEach((item) => {
      const step = Number(item.dataset.stepIndicator);
      item.classList.toggle('is-active', step === currentStep);
      item.classList.toggle('is-complete', step < currentStep);
    });
    previous.hidden = currentStep === 1;
    next.hidden = currentStep === steps.length;
    submit.hidden = currentStep !== steps.length;
    progress.style.width = `${(currentStep / steps.length) * 100}%`;
    stepLabel.textContent = `الخطوة ${currentStep} من ${steps.length}`;
    showAlert('');
    if (currentStep === steps.length) updateReview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateStep(number) {
    const step = steps.find((item) => Number(item.dataset.step) === number);
    const required = [...step.querySelectorAll('[required]')];
    let firstInvalid = null;
    required.forEach((field) => {
      const valid = field.type === 'checkbox' ? field.checked : field.checkValidity();
      field.classList.toggle('is-invalid', !valid);
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (number === 2 && !form.querySelector('input[name="services"]:checked')) {
      showAlert('اختر خدمة واحدة على الأقل حتى نوجّه طلبك للقسم الصحيح.');
      form.querySelector('.service-picker').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    if (firstInvalid) {
      showAlert('أكمل الحقول المطلوبة والمعلّمة باللون البرتقالي قبل المتابعة.');
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    showAlert('');
    return true;
  }

  function draftPayload() {
    const payload = {};
    [...form.elements].forEach((field) => {
      if (!field.name || field.type === 'file' || field.name === 'website_confirm' || field.name === 'form_started_at') return;
      if (field.type === 'checkbox') {
        if (!Array.isArray(payload[field.name])) payload[field.name] = [];
        if (field.checked) payload[field.name].push(field.value);
      } else payload[field.name] = field.value;
    });
    return payload;
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftPayload()));
      draftStatus.textContent = 'تم حفظ التقدم على هذا الجهاز';
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => { draftStatus.textContent = 'يُحفظ تقدمك على هذا الجهاز تلقائياً'; }, 1800);
    } catch {}
  }

  function restoreDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      Object.entries(draft).forEach(([name, value]) => {
        const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
        fields.forEach((field) => {
          if (field.type === 'checkbox') field.checked = Array.isArray(value) && value.includes(field.value);
          else if (typeof value === 'string') field.value = value;
        });
      });
    } catch {}
  }

  function formatSize(bytes) {
    return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function renderFiles() {
    fileList.replaceChildren(...selectedFiles.map((file, index) => {
      const row = document.createElement('div');
      row.className = 'file-item';
      const type = document.createElement('i');
      type.textContent = (file.name.split('.').pop() || 'FILE').slice(0, 4).toUpperCase();
      const copy = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = file.name;
      const size = document.createElement('small');
      size.textContent = formatSize(file.size);
      copy.append(name, size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.setAttribute('aria-label', `حذف ${file.name}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => { selectedFiles.splice(index, 1); syncFiles(); });
      row.append(type, copy, remove);
      return row;
    }));
  }

  function syncFiles() {
    const transfer = new DataTransfer();
    selectedFiles.forEach((file) => transfer.items.add(file));
    fileInput.files = transfer.files;
    renderFiles();
  }

  function addFiles(files) {
    const incoming = [...files];
    const oversized = incoming.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) return showAlert(`الملف «${oversized.name}» أكبر من 10MB.`);
    const unique = incoming.filter((file) => !selectedFiles.some((saved) => saved.name === file.name && saved.size === file.size));
    if (selectedFiles.length + unique.length > MAX_FILES) return showAlert(`يمكنك رفع ${MAX_FILES} ملفات كحد أقصى.`);
    selectedFiles.push(...unique);
    syncFiles();
    showAlert('');
  }

  function value(name) { return String(new FormData(form).get(name) || '').trim(); }
  function updateReview() {
    const services = [...form.querySelectorAll('input[name="services"]:checked')].map((item) => item.value).join('، ');
    const values = {
      identity: `${value('full_name')}. ${value('email')}`,
      organization: value('organization'), services,
      budget: value('budget_range'), start: value('start_window'),
    };
    Object.entries(values).forEach(([key, val]) => {
      const node = document.querySelector(`[data-review="${key}"]`);
      if (node) node.textContent = val || 'غير محدد';
    });
  }

  next.addEventListener('click', () => { if (validateStep(currentStep)) showStep(currentStep + 1); });
  previous.addEventListener('click', () => showStep(currentStep - 1));
  form.addEventListener('input', (event) => { event.target.classList.remove('is-invalid'); window.clearTimeout(saveTimer); saveTimer = window.setTimeout(saveDraft, 500); });
  fileInput.addEventListener('change', () => addFiles(fileInput.files));
  ['dragenter', 'dragover'].forEach((name) => uploadZone.addEventListener(name, (event) => { event.preventDefault(); uploadZone.classList.add('is-dragging'); }));
  ['dragleave', 'drop'].forEach((name) => uploadZone.addEventListener(name, (event) => { event.preventDefault(); uploadZone.classList.remove('is-dragging'); }));
  uploadZone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateStep(currentStep)) return;
    submit.disabled = true;
    submit.querySelector('span').textContent = 'جاري إرسال الطلب...';
    showAlert('');
    try {
      const payload = new FormData(form);
      payload.delete('attachments');
      selectedFiles.forEach((file) => payload.append('attachments', file, file.name));
      const response = await fetch('/api/applications', { method: 'POST', body: payload, credentials: 'same-origin' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'تعذر إرسال الطلب الآن. حاول مرة أخرى.');
      localStorage.removeItem(DRAFT_KEY);
      form.hidden = true;
      document.querySelector('.application-progress').hidden = true;
      document.getElementById('successState').hidden = false;
      document.getElementById('applicationReference').textContent = result.reference || result.id || 'NEW-MEDIA';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showAlert(error.message);
    } finally {
      submit.disabled = false;
      submit.querySelector('span').textContent = 'إرسال الطلب للفريق';
    }
  });

  restoreDraft();
  showStep(1);
})();
