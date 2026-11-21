/* ==========================================================================
   Athletx site script (vanilla JS, no dependencies)
   - Mobile menu toggle (closes on link click, outside click and Escape)
   - aria-current on the nav link for the current page
   - Scroll reveal, skipped for people who prefer reduced motion
   - Footer year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Mobile nav ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const closeMenu = () => {
    if (!toggle || !navLinks) return;
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---- Mark the current page in the nav ---- */
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (page && href === page) link.setAttribute('aria-current', 'page');
  });

  /* ---- Scroll reveal ---- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll(
      '.section-head, .showcase, .card, .step, .privacy-grid, .table-wrap, .cta .container'
    );

    document.body.classList.add('reveal-ready');
    items.forEach((item, i) => {
      item.setAttribute('data-reveal', '');
      if (item.matches('.card, .step')) {
        item.style.setProperty('--reveal-delay', `${(i % 4) * 80}ms`);
      }
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  /* ---- Footer year ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
