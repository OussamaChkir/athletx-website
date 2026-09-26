/* ==========================================================================
   Athletx — Site script
   Vanilla JS only. Handles: mobile nav toggle, closing the menu on link
   click / outside click, active nav-link state, and a single subtle
   hero entrance animation (kept minimal per design guidance).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu after choosing a link (mobile) */
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu on outside click */
    document.addEventListener('click', (e) => {
      const clickedInsideNav = navLinks.contains(e.target) || toggle.contains(e.target);
      if (!clickedInsideNav && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Highlight current page in nav ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- One orchestrated hero entrance (respects reduced-motion) ---- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');

  if (hero && !prefersReducedMotion) {
    const revealEls = hero.querySelectorAll('.eyebrow, h1, .lead, .hero-actions, .hero-stats, .hero-visual');
    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.transitionDelay = `${i * 90}ms`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealEls.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ---- Reveal sections and cards as they enter the viewport ---- */
  if (!prefersReducedMotion) {
    const revealItems = document.querySelectorAll(
      '.section-head, .feature-card, .step, .cta .container'
    );

    if ('IntersectionObserver' in window) {
      document.body.classList.add('reveal-ready');
      revealItems.forEach((item, index) => {
        item.setAttribute('data-reveal', '');
        if (item.matches('.feature-card, .step')) {
          item.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
        }
      });

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });

      revealItems.forEach((item) => revealObserver.observe(item));
    }
  }
});
