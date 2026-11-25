/**
 * Appointment form: client-side validation, success state and a submit stub.
 */

/**
 * ▶ CONNECT YOUR BACKEND HERE ◀
 * Receives a plain object: { name, phone, email, date, time, service, message }.
 * Must resolve on success and throw on failure (the form shows an error message).
 *
 * Examples:
 *   // Any JSON API:
 *   const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
 *   if (!res.ok) throw new Error('Request failed');
 *
 *   // Formspree: set booking.endpoint to https://formspree.io/f/XXXX and use the fetch above.
 *   // EmailJS:   import emailjs from '@emailjs/browser'; await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY);
 *
 * Until `booking.endpoint` is set in config.js nothing is sent: the data is only
 * logged to the console so you can test the UI.
 */
async function sendBooking(data, endpoint) {
  if (!endpoint) {
    console.info('[booking] No endpoint configured — nothing was sent. Payload:', data);
    return;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Booking request failed (${res.status})`);
}

const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your full name.' : ''),
  phone: (v) => (/^[+()\d][\d\s().-]{6,19}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
  date: (v) => {
    if (!v) return 'Please choose a preferred date.';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(v + 'T00:00:00') < today ? 'Please choose today or a future date.' : '';
  },
  time: (v) => (v ? '' : 'Please choose a preferred time.'),
  service: (v) => (v ? '' : 'Please select a service.'),
};

export function initBooking() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const success = document.getElementById('booking-success');
  const formError = document.getElementById('form-error');
  const submit = form.querySelector('[type=submit]');

  // No past dates in the picker.
  const iso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  form.elements.date.min = iso;

  const check = (field) => {
    const msg = RULES[field.name]?.(field.value) ?? '';
    document.getElementById(`${field.id}-err`).textContent = msg;
    msg ? field.setAttribute('aria-invalid', 'true') : field.removeAttribute('aria-invalid');
    return !msg;
  };

  Object.keys(RULES).forEach((n) => {
    const f = form.elements[n];
    f.addEventListener('blur', () => check(f));
    f.addEventListener('input', () => f.hasAttribute('aria-invalid') && check(f));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.hidden = true;
    const invalid = Object.keys(RULES).map((n) => form.elements[n]).filter((f) => !check(f));
    if (invalid.length) return invalid[0].focus();

    const data = Object.fromEntries(new FormData(form));
    if (data.company) return; // honeypot filled → bot; silently ignore
    delete data.company;

    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      await sendBooking(data, form.dataset.endpoint);
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error(err);
      formError.textContent = 'Sorry, something went wrong. Please try again or call us.';
      formError.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Request appointment';
    }
  });

  document.getElementById('booking-reset').addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    form.elements.name.focus();
  });
}
