/** Testimonial carousel: native scroll-snap + prev/next buttons + dot pagination. No autoplay (accessibility). */
export function initTestimonials() {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.carousel-track');
    const slides = [...track.children];
    const dotsWrap = root.querySelector('[data-dots]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const go = (i) => {
      const n = Math.max(0, Math.min(slides.length - 1, i));
      const s = slides[n];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
    };
    const current = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      return slides.reduce((best, s, i) => (Math.abs(s.offsetLeft + s.clientWidth / 2 - mid) < Math.abs(slides[best].offsetLeft + slides[best].clientWidth / 2 - mid) ? i : best), 0);
    };

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsWrap.append(b);
      return b;
    });
    const sync = () => {
      const c = current();
      dots.forEach((d, i) => (i === c ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    };
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    sync();

    root.querySelector('[data-prev]').addEventListener('click', () => go(current() - 1));
    root.querySelector('[data-next]').addEventListener('click', () => go(current() + 1));
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });
  });
}
