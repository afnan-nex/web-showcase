/**
 * OrbitDesk Marketing Landing Page View Controller
 */

const OrbitLandingView = {
  init() {
    this.initPricingToggle();
    this.initFaqAccordion();
    this.initLiveDemo();
    this.initSmoothScroll();
  },

  initSmoothScroll() {
    const navLinks = document.querySelectorAll('.marketing-header .nav-link, .footer-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && !href.startsWith('#/')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  },

  initPricingToggle() {
    const toggle = document.getElementById('pricing-billing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', (e) => {
      const isAnnual = e.target.checked;
      const starterPrice = document.getElementById('price-starter');
      const proPrice = document.getElementById('price-pro');
      const enterprisePrice = document.getElementById('price-enterprise');
      const periodLabels = document.querySelectorAll('.plan-period');

      if (isAnnual) {
        if (starterPrice) starterPrice.textContent = '16';
        if (proPrice) proPrice.textContent = '39';
        if (enterprisePrice) enterprisePrice.textContent = '89';
        periodLabels.forEach(p => p.textContent = '/ user / mo (billed annually)');
      } else {
        if (starterPrice) starterPrice.textContent = '20';
        if (proPrice) proPrice.textContent = '49';
        if (enterprisePrice) enterprisePrice.textContent = '109';
        periodLabels.forEach(p => p.textContent = '/ user / mo (billed monthly)');
      }
    });
  },

  initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      if (btn) {
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          // Close others
          faqItems.forEach(i => {
            i.classList.remove('active');
            const q = i.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  },

  initLiveDemo() {
    // Quick interaction inside the marketing hero preview
    const demoTaskCheckboxes = document.querySelectorAll('.demo-preview-checkbox');
    demoTaskCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const row = e.target.closest('tr');
        if (row) {
          if (e.target.checked) {
            row.classList.add('is-done');
            window.OrbitToast.success('Preview Task marked as completed!');
          } else {
            row.classList.remove('is-done');
          }
        }
      });
    });
  }
};

window.OrbitLandingView = OrbitLandingView;
