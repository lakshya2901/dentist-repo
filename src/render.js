/**
 * Turns config.js into HTML strings. Runs at build time (and in the dev server),
 * so the shipped page is plain static HTML. You normally don't need to edit this
 * file — change text in config.js and layout in the CSS files.
 */
import { config } from './config.js';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- Icons (24x24 stroke icons, decorative) ---------- */
const ICONS = {
  tooth: 'M12 5.5c-1-1.2-2.4-2-4-2C5.5 3.5 4 5.5 4 8c0 2 .8 3.5 1.4 5.5C6 16 6.3 20.5 8 20.5c1.6 0 1.5-4.5 4-4.5s2.4 4.5 4 4.5c1.7 0 2-4.5 2.6-7C19.2 11.5 20 10 20 8c0-2.5-1.5-4.5-4-4.5-1.6 0-3 .8-4 2z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  clipboard: 'M9 4h6v3H9zM7 5.5H6a1 1 0 00-1 1V20a1 1 0 001 1h12a1 1 0 001-1V6.5a1 1 0 00-1-1h-1M9 12h6M9 16h4',
  implant: 'M8 3h8M10 3v3m4-3v3M8 6h8M9 10h6M9 13.5h6M10 17h4M11 20.5h2',
  braces: 'M3 12h18M7 7.5v9M12 7.5v9M17 7.5v9M5.5 10.5h3v3h-3zM10.5 10.5h3v3h-3zM15.5 10.5h3v3h-3z',
  root: 'M7 3h10v6c0 3-1.5 4-1.5 7l-.5 5h-3l-.5-5h-1l-.5 5h-3l-.5-5C8.5 13 7 12 7 9z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  lens: 'M12 3.5c-4 0-7 3.6-7 8.5s3 8.5 7 8.5 7-3.600 7-8.5-3-8.5-7-8.5zM12 3.5c-2 0-3 3.800-3 8.500s1 8.500 3 8.500',
  glasses: 'M3 15a3.500 3.500 0 107 0 3.500 3.500 0 00-7 0zM14 15a3.500 3.500 0 107 0 3.500 3.500 0 00-7 0zM10 15h4M3 15l1.500-7M21 15l-1.500-7',
  drop: 'M12 3s6 6.500 6 11a6 6 0 01-12 0c0-4.500 6-11 6-11z',
  retina: 'M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M12 9.500a2.500 2.500 0 100 5 2.500 2.500 0 000-5z',
  laser: 'M12 2.500v3.500M12 18v3.500M2.500 12H6M18 12h3.500M5.500 5.500L8 8M16 16l2.500 2.500M18.500 5.500L16 8M8 16l-2.500 2.500M12 9a3 3 0 100 6 3 3 0 000-6z',
  pin: 'M12 21s7-6.200 7-11.500a7 7 0 10-14 0C5 14.800 12 21 12 21zM12 7.500a2.200 2.200 0 100 4.400 2.200 2.200 0 000-4.400z',
  phone: 'M5 4h4l2 5-2.500 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  mail: 'M3 6h18v12H3zM3 7l9 6.500L21 7',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3.500 2',
};
const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${ICONS[name] || ICONS.tooth}"/></svg>`;

const SOCIAL_PATHS = {
  Facebook: 'M14 8h3V4h-3a4 4 0 00-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.500a.500.500 0 01.500-.500z',
  Instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.500-1.500h.01',
  YouTube: 'M3 8a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3zM10 9v6l5-3z',
};

/* ---------- Brand mark ---------- */
const markSvg = (spec) =>
  spec === 'eye'
    ? '<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15" fill="var(--accent)"/><path d="M5 16s4.500-7 11-7 11 7 11 7-4.500 7-11 7S5 16 5 16z" fill="none" stroke="var(--accent-ink)" stroke-width="1.800"/><circle cx="16" cy="16" r="3.500" fill="var(--accent-ink)"/></svg>'
    : '<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15" fill="var(--accent)"/><path d="M16 11.500c-1-1.400-2.300-2-3.800-2-2.500 0-4.200 2-4.200 4.600 0 1.800.7 3 1.200 4.700.5 2 .7 5.200 2.100 5.200 1.300 0 1.300-3.400 3.200-3.400s1.900 3.400 3.200 3.400c1.400 0 1.600-3.200 2.100-5.200.5-1.700 1.200-2.900 1.200-4.700 0-2.600-1.700-4.600-4.200-4.600-1.500 0-2.800.6-3.800 2z" fill="var(--accent-ink)"/></svg>';

/** Static illustration shown if WebGL is unavailable (CSS/SVG only). */
const fallbackSvg = (spec) =>
  spec === 'eye'
    ? `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of an eye"><defs><radialGradient id="fi" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#0b1233"/><stop offset=".3" stop-color="#2b5bff"/><stop offset=".85" stop-color="#5ee1ff"/><stop offset="1" stop-color="#17306e"/></radialGradient></defs><path d="M20 150c50-85 110-120 180-120s130 35 180 120c-50 85-110 120-180 120S70 235 20 150z" fill="#f6f8ff"/><circle cx="200" cy="150" r="82" fill="url(#fi)"/><circle cx="200" cy="150" r="34" fill="#050818"/><circle cx="172" cy="122" r="14" fill="#fff" opacity=".85"/></svg>`
    : `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of a tooth"><defs><linearGradient id="ft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#bfeeee"/></linearGradient></defs><path d="M200 70c-20-24-50-34-80-26-34 10-48 46-40 84 6 28 18 52 22 82 4 30 12 54 30 52 24-3 22-62 68-62s44 59 68 62c18 2 26-22 30-52 4-30 16-54 22-82 8-38-6-74-40-84-30-8-60 2-80 26z" fill="url(#ft)" stroke="#19b6b0" stroke-width="3"/></svg>`;

/* ---------- Page ---------- */
export function renderPage() {
  const { clinic, doctor, stats, testimonials, booking } = config;
  const spec = config.specialty === 'eye' ? 'eye' : 'dentist';
  const c = config.content[spec];
  const year = new Date().getFullYear();
  const waHref = `https://wa.me/${esc(clinic.whatsappNumber)}?text=${encodeURIComponent(clinic.whatsappMessage)}`;
  const origin = clinic.siteUrl.replace(/\/$/, '');

  /* ----- <head> ----- */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': spec === 'eye' ? ['MedicalClinic', 'MedicalBusiness'] : ['Dentist', 'MedicalBusiness'],
    name: clinic.name,
    url: origin,
    image: `${origin}/og-image.svg`,
    description: c.metaDescription,
    telephone: clinic.phone,
    email: clinic.email,
    address: { '@type': 'PostalAddress', streetAddress: clinic.address, addressLocality: clinic.city },
    // For eye clinics schema.org has no "Ophthalmology" enum; "Optometric" is the closest MedicalSpecialty.
    medicalSpecialty: spec === 'eye' ? 'Optometric' : 'Dentistry',
    employee: { '@type': 'Person', name: doctor.name, jobTitle: c.doctorRole },
  };
  const head = `
    <title>${esc(c.metaTitle)}</title>
    <meta name="description" content="${esc(c.metaDescription)}" />
    <meta name="theme-color" content="${spec === 'eye' ? '#0a1030' : '#f4fbfb'}" />
    <link rel="canonical" href="${esc(origin)}/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(c.metaTitle)}" />
    <meta property="og:description" content="${esc(c.metaDescription)}" />
    <meta property="og:url" content="${esc(origin)}/" />
    <meta property="og:image" content="${esc(origin)}/og-image.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`;

  /* ----- sections ----- */
  const nav = [
    ['services', 'Services'],
    ['why', 'Why us'],
    ['about', 'Doctor'],
    ['process', 'Process'],
    ['testimonials', 'Reviews'],
    ['faq', 'FAQ'],
    ['contact', 'Contact'],
  ];

  const header = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" id="top">
    <div class="container header-inner">
      <a class="brand" href="#hero" aria-label="${esc(clinic.name)} — home">${markSvg(spec)}<span>${esc(clinic.name)}</span></a>
      <nav class="primary-nav" id="primary-nav" aria-label="Primary">
        <ul>${nav.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul>
        <a class="btn btn-primary btn-sm nav-cta" href="#booking">Book Appointment</a>
      </nav>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </header>`;

  const hero = `
  <section class="section hero" id="hero" data-3d aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
        <h1 id="hero-title">${esc(c.hero.title)}</h1>
        <p class="lead">${esc(c.hero.subtitle)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="#booking">Book Appointment</a>
          <a class="btn btn-ghost" href="${esc(clinic.phoneHref)}">${icon('phone')}Call Now</a>
        </div>
        <p class="hero-note">${icon('clock')}<span>${esc(clinic.hours[0].days)}: ${esc(clinic.hours[0].time)}</span></p>
      </div>
      <div class="hero-visual" aria-hidden="true"><div class="hero-fallback">${fallbackSvg(spec)}</div></div>
    </div>
    <a class="scroll-hint" href="#services" aria-label="Scroll to services"><span></span></a>
  </section>`;

  const services = `
  <section class="section" id="services" data-3d aria-labelledby="services-title">
    <div class="container">
      <header class="section-head align-right" data-reveal>
        <p class="eyebrow">Services</p>
        <h2 id="services-title">${esc(c.servicesIntro.title)}</h2>
        <p class="lead">${esc(c.servicesIntro.text)}</p>
      </header>
      <ul class="card-grid" role="list">
        ${c.services
          .map(
            (s) => `<li class="card service-card" data-reveal data-tilt>
          <span class="icon-badge">${icon(s.icon)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </li>`
          )
          .join('')}
      </ul>
    </div>
  </section>`;

  const why = `
  <section class="section" id="why" data-3d aria-labelledby="why-title">
    <div class="container">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Why choose us</p>
        <h2 id="why-title">${esc(c.whyTitle)}</h2>
        <p class="lead">${esc(c.whyText)}</p>
      </header>
      <ul class="stats" role="list">
        ${stats
          .map(
            (s) => `<li class="card stat" data-reveal>
          <span class="stat-value"><span data-count="${Number(s.value)}">${Number(s.value)}</span>${esc(s.suffix)}</span>
          <span class="stat-label">${esc(s.label)}</span>
          ${s.placeholder ? '<span class="tag">Placeholder figure</span>' : ''}
        </li>`
          )
          .join('')}
      </ul>
    </div>
  </section>`;

  const photo = doctor.photo
    ? `<img src="${esc(doctor.photo)}" alt="${esc(doctor.photoAlt)}" width="480" height="560" loading="lazy" decoding="async" />`
    : `<div class="photo-ph" role="img" aria-label="${esc(doctor.photoAlt)}"><svg viewBox="0 0 120 140" aria-hidden="true"><circle cx="60" cy="48" r="26" fill="currentColor" opacity=".35"/><path d="M10 140c0-34 22-54 50-54s50 20 50 54z" fill="currentColor" opacity=".35"/></svg><span>[DOCTOR PHOTO]</span></div>`;

  const about = `
  <section class="section" id="about" data-3d aria-labelledby="about-title">
    <div class="container about-grid">
      <figure class="doctor-photo card" data-reveal>${photo}</figure>
      <div class="about-copy" data-reveal>
        <p class="eyebrow">About the doctor</p>
        <h2 id="about-title">${esc(doctor.name)}</h2>
        <p class="role">${esc(c.doctorRole)}</p>
        ${doctor.bio.map((p) => `<p>${esc(p)}</p>`).join('')}
        <h3 class="mini-title">Qualifications</h3>
        <ul class="checklist">${doctor.qualifications.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
      </div>
    </div>
  </section>`;

  const process = `
  <section class="section" id="process" data-3d aria-labelledby="process-title">
    <div class="container narrow">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Treatment process</p>
        <h2 id="process-title">${esc(c.process.title)}</h2>
      </header>
      <ol class="timeline">
        <span class="timeline-line" aria-hidden="true"><span class="timeline-fill"></span></span>
        ${c.process.steps
          .map(
            (s, i) => `<li class="step card">
          <span class="step-num" aria-hidden="true">${i + 1}</span>
          <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
        </li>`
          )
          .join('')}
      </ol>
    </div>
  </section>`;

  const reviews = `
  <section class="section" id="testimonials" data-3d aria-labelledby="reviews-title">
    <div class="container">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Testimonials</p>
        <h2 id="reviews-title">What patients say</h2>
        <p class="lead">The reviews below are placeholders and not real patient feedback.</p>
      </header>
      <div class="carousel" role="region" aria-roledescription="carousel" aria-label="Patient testimonials" data-carousel>
        <ul class="carousel-track" role="list" tabindex="0" aria-label="Testimonials, scroll horizontally">
          ${testimonials
            .map(
              (t, i) => `<li class="carousel-slide">
            <figure class="card quote" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${testimonials.length}">
              <span class="tag">Placeholder review</span>
              <blockquote><p>${esc(t.quote)}</p></blockquote>
              <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.detail)}</span></figcaption>
            </figure>
          </li>`
            )
            .join('')}
        </ul>
        <div class="carousel-controls">
          <button type="button" class="round-btn" data-prev aria-label="Previous testimonial">&#8592;</button>
          <div class="dots" data-dots></div>
          <button type="button" class="round-btn" data-next aria-label="Next testimonial">&#8594;</button>
        </div>
      </div>
    </div>
  </section>`;

  const faq = `
  <section class="section solid" id="faq" aria-labelledby="faq-title">
    <div class="container narrow">
      <header class="section-head" data-reveal>
        <p class="eyebrow">FAQ</p>
        <h2 id="faq-title">Frequently asked questions</h2>
      </header>
      <div class="accordion" data-accordion>
        ${c.faqs
          .map(
            (f, i) => `<div class="acc-item">
          <h3><button type="button" class="acc-btn" id="acc-btn-${i}" aria-expanded="false" aria-controls="acc-panel-${i}"><span>${esc(f.q)}</span><span class="acc-icon" aria-hidden="true"></span></button></h3>
          <div class="acc-panel" id="acc-panel-${i}" role="region" aria-labelledby="acc-btn-${i}"><div><p>${esc(f.a)}</p></div></div>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>`;

  const booking_ = `
  <section class="section solid alt" id="booking" aria-labelledby="booking-title">
    <div class="container booking-grid">
      <header class="section-head">
        <p class="eyebrow">Appointments</p>
        <h2 id="booking-title">Book your appointment</h2>
        <p class="lead">Tell us when suits you and we will confirm by phone or email. For urgent problems please call us.</p>
        <p><a class="btn btn-ghost" href="${esc(clinic.phoneHref)}">${icon('phone')}${esc(clinic.phone)}</a></p>
      </header>
      <div class="card form-card">
        <form id="booking-form" novalidate data-endpoint="${esc(booking.endpoint)}">
          <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err" /><p class="error" id="f-name-err" aria-live="polite"></p></div>
          <div class="field-row">
            <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="f-phone-err" /><p class="error" id="f-phone-err" aria-live="polite"></p></div>
            <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err" /><p class="error" id="f-email-err" aria-live="polite"></p></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="f-date">Preferred date</label><input id="f-date" name="date" type="date" required aria-describedby="f-date-err" /><p class="error" id="f-date-err" aria-live="polite"></p></div>
            <div class="field"><label for="f-time">Preferred time</label><input id="f-time" name="time" type="time" required aria-describedby="f-time-err" /><p class="error" id="f-time-err" aria-live="polite"></p></div>
          </div>
          <div class="field"><label for="f-service">Service</label>
            <select id="f-service" name="service" required aria-describedby="f-service-err">
              <option value="">Select a service…</option>
              ${c.services.map((s) => `<option>${esc(s.title)}</option>`).join('')}
              <option>Other / not sure</option>
            </select><p class="error" id="f-service-err" aria-live="polite"></p></div>
          <div class="field"><label for="f-message">Message <span class="opt">(optional)</span></label><textarea id="f-message" name="message" rows="4" maxlength="1000"></textarea></div>
          <div class="hp" aria-hidden="true"><label>Leave empty <input type="text" name="company" tabindex="-1" autocomplete="off" /></label></div>
          <p class="form-error" id="form-error" role="alert" hidden></p>
          <button class="btn btn-primary btn-block" type="submit">Request appointment</button>
          <p class="fineprint">Please do not include sensitive medical details in this form.</p>
        </form>
        <div class="success" id="booking-success" tabindex="-1" hidden>
          <span class="success-icon" aria-hidden="true">&#10003;</span>
          <h3>Thank you — request received</h3>
          <p>We will contact you shortly to confirm your appointment.</p>
          <button type="button" class="btn btn-ghost" id="booking-reset">Make another request</button>
        </div>
      </div>
    </div>
  </section>`;

  const map = clinic.mapEmbedUrl
    ? `<iframe class="map" title="Map showing ${esc(clinic.name)}" src="${esc(clinic.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
    : `<div class="map map-ph" role="img" aria-label="Map placeholder">${icon('pin')}<span>[MAP PLACEHOLDER]<br/>Paste a Google Maps embed URL into config.js</span></div>`;

  const contact = `
  <section class="section solid" id="contact" aria-labelledby="contact-title">
    <div class="container contact-grid">
      <div>
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">Visit ${esc(clinic.name)}</h2>
        <ul class="contact-list" role="list">
          <li>${icon('pin')}<span>${esc(clinic.address)}</span></li>
          <li>${icon('phone')}<a href="${esc(clinic.phoneHref)}">${esc(clinic.phone)}</a></li>
          <li>${icon('mail')}<a href="mailto:${esc(clinic.email)}">${esc(clinic.email)}</a></li>
        </ul>
        <h3 class="mini-title">Opening hours</h3>
        <table class="hours"><tbody>${clinic.hours.map((h) => `<tr><th scope="row">${esc(h.days)}</th><td>${esc(h.time)}</td></tr>`).join('')}</tbody></table>
      </div>
      ${map}
    </div>
  </section>`;

  const footer = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="#hero" aria-label="${esc(clinic.name)} — back to top">${markSvg(spec)}<span>${esc(clinic.name)}</span></a>
        <p class="footer-text">${esc(doctor.name)} · ${esc(c.doctorRole)}<br/>${esc(clinic.city)}</p>
      </div>
      <nav aria-label="Footer"><ul class="footer-links" role="list">${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join('')}<li><a href="#booking">Book Appointment</a></li></ul></nav>
      <ul class="socials" role="list">${clinic.socials
        .map(
          (s) =>
            `<li><a href="${esc(s.url)}" aria-label="${esc(s.name)}" rel="noopener"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${SOCIAL_PATHS[s.name] || SOCIAL_PATHS.Facebook}"/></svg></a></li>`
        )
        .join('')}</ul>
    </div>
    <div class="container footer-bottom">
      <p class="disclaimer">${esc(config.disclaimer)}</p>
      <p>&copy; ${year} ${esc(clinic.name)}. All rights reserved.</p>
    </div>
  </footer>
  <a class="fab fab-whatsapp" href="${waHref}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp (opens in a new tab)"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 00-8.600 15.100L2 22l5-1.300A10 10 0 1012 2zm0 18.200a8.200 8.200 0 01-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1112 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8s-.4-.1-.6.100-.6.800-.8 1-.3.200-.6.100a6.700 6.700 0 01-3.300-2.900c-.3-.4.300-.4.800-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.300 3 3 0 00-.9 2.200 5.200 5.200 0 001.100 2.800 11.900 11.900 0 004.500 4c1.700.7 2.400.8 3.200.7a2.700 2.700 0 001.800-1.300 2.200 2.200 0 00.2-1.300c-.1-.1-.2-.2-.5-.3z"/></svg></a>
  <a class="fab fab-call" href="${esc(clinic.phoneHref)}" aria-label="Call ${esc(clinic.name)}">${icon('phone')}</a>`;

  const body = `
  <div class="stage" id="stage" aria-hidden="true"><canvas id="scene-canvas"></canvas></div>
  ${header}
  <main id="main">${hero}${services}${why}${about}${process}${reviews}${faq}${booking_}${contact}</main>
  ${footer}`;

  return { head, body, specialty: spec };
}

