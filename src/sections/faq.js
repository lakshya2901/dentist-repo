/** Accessible accordion: buttons toggle aria-expanded; arrow keys / Home / End move between headers. */
export function initFaq() {
  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const buttons = [...root.querySelectorAll('.acc-btn')];
    buttons.forEach((btn, i) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.classList.toggle('open', !open);
      });
      btn.addEventListener('keydown', (e) => {
        const move = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: buttons.length - 1 }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        buttons[(move + buttons.length) % buttons.length].focus();
      });
    });
  });
}
