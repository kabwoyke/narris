/**
 * Vanilla form handling for every <form data-narris-form>.
 * - Inline validation with aria-invalid + aria-describedby, honeypot, success and error states.
 * - Posts to config.forms.endpoint when set (Formspree / Web3Forms style JSON POST).
 * - Otherwise (or on failure) falls back to a pre-filled mailto: message. No backend.
 * Markup contract: each field has `name`, optional required flag via `required`, and an error slot
 * `<p data-error-for="fieldname" class="field-error" hidden>`. A `[data-form-status]` region shows results.
 */
import { config } from './config.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const messages = {
  name: 'Please tell us your name.',
  email: 'Please enter a valid email address.',
  message: 'Please add a short message (at least 10 characters).',
};

function validateField(el) {
  const v = el.value.trim();
  if (el.name === 'name' && !v) return messages.name;
  if (el.name === 'email' && !EMAIL_RE.test(v)) return messages.email;
  if (el.name === 'message' && v.length < 10) return messages.message;
  if (el.name === 'consent' && !el.checked) return 'Please confirm you are happy for us to use these details to reply.';
  return '';
}

function setError(form, el, text) {
  const slot = form.querySelector(`[data-error-for="${el.name}"]`);
  if (!slot) return;
  if (text) {
    slot.textContent = text;
    slot.hidden = false;
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', slot.id);
  } else {
    slot.hidden = true;
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }
}

function mailtoHref(data) {
  const lines = [
    `Name: ${data.name}`,
    data.organisation && `Organisation: ${data.organisation}`,
    data.role && `Role: ${data.role}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    data.service && `Service of interest: ${data.service}`,
    data.quote && 'Quotation requested: yes',
    '',
    data.message,
  ].filter((l) => l !== undefined && l !== false && l !== null);
  const subject = data.quote ? 'Quotation request' : 'Enquiry from the website';
  return `mailto:${config.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function show(form, kind, html) {
  const box = form.querySelector('[data-form-status]');
  if (!box) return;
  box.className = `mt-5 border-l-2 px-4 py-3 text-sm ${kind === 'ok' ? 'border-warm bg-white/10' : 'border-[#ffb8a8] bg-white/10'}`;
  box.innerHTML = html;
  box.hidden = false;
  box.focus?.();
}

function initForm(form) {
  // Populate service options from config and honour ?service=
  const select = form.querySelector('select[data-services]');
  if (select) {
    const pre = new URLSearchParams(location.search).get('service');
    select.insertAdjacentHTML('beforeend', config.services.map((s) => `<option value="${s.name}" ${s.id === pre ? 'selected' : ''}>${s.name}</option>`).join(''));
  }
  const quote = form.querySelector('input[name="quote"]');
  if (quote && new URLSearchParams(location.search).get('quote')) quote.checked = true;

  const fields = [...form.querySelectorAll('input[name], textarea[name], select[name]')]
    .filter((el) => ['name', 'email', 'message', 'consent'].includes(el.name));
  fields.forEach((el) => {
    el.addEventListener('blur', () => setError(form, el, validateField(el)));
    el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid')) setError(form, el, validateField(el)); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstBad = null;
    fields.forEach((el) => {
      const err = validateField(el);
      setError(form, el, err);
      if (err && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); return; }

    const fd = new FormData(form);
    // Honeypot: bots fill the hidden field. Pretend success, send nothing.
    if (fd.get('_gotcha')) { show(form, 'ok', 'Thank you. Your message has been received.'); form.reset(); return; }

    const data = Object.fromEntries(fd.entries());
    data.quote = fd.get('quote') ? true : false;
    const btn = form.querySelector('[type="submit"]');
    const label = btn.textContent;
    const endpoint = form.dataset.narrisForm === 'careers' ? config.forms.careersEndpoint : config.forms.endpoint;

    if (endpoint) {
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        show(form, 'ok', '<strong>Thank you.</strong> Your message has been received. We will reply by email.');
        form.reset();
      } catch (err) {
        console.warn('[narris] form submit failed:', err.message);
        show(form, 'error', `Sorry, that did not send. <a class="underline" href="${mailtoHref(data)}">Send it by email instead</a>, or call ${config.contact.phone}.`);
      } finally { btn.disabled = false; btn.textContent = label; }
      return;
    }

    // TODO(client): no endpoint configured yet (config.forms.endpoint). Using the mailto fallback.
    if (config.forms.mailtoFallback) {
      show(form, 'ok', `Your email app should open with your message ready to send. If it does not, write to <a class="underline" href="mailto:${config.contact.email}">${config.contact.email}</a>.`);
      window.location.href = mailtoHref(data);
    } else {
      show(form, 'error', `Online enquiries are not switched on yet. Please call ${config.contact.phone} or email ${config.contact.email}.`);
    }
  });
}

export function initForms() {
  document.querySelectorAll('form[data-narris-form]').forEach(initForm);
}
