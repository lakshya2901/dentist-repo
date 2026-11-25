import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Treatment timeline: the line fills with scroll and each step lights up as it is reached. */
export function initProcess() {
  gsap.registerPlugin(ScrollTrigger);
  const list = document.querySelector('.timeline');
  if (!list) return;
  const steps = [...list.querySelectorAll('.step')];

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    list.style.setProperty('--progress', 1);
    steps.forEach((s) => s.classList.add('active'));
    return;
  }

  ScrollTrigger.create({
    trigger: list,
    start: 'top 70%',
    end: 'bottom 60%',
    scrub: 0.4,
    onUpdate: (self) => list.style.setProperty('--progress', self.progress),
  });
  steps.forEach((step) =>
    ScrollTrigger.create({
      trigger: step,
      start: 'top 65%',
      toggleClass: { targets: step, className: 'active' },
    })
  );
}
