/**
 * Frame & Form — Spatial Effects, Scroll Reveals, Parallax & World Clocks
 */

export class EffectsController {
  constructor() {
    this.observer = null;
    this.floatingPreview = document.querySelector('.floating-preview');
    this.previewImg = this.floatingPreview ? this.floatingPreview.querySelector('img') : null;
    this.clocks = [
      { id: 'tyo-time', tz: 'Asia/Tokyo' },
      { id: 'zrh-time', tz: 'Europe/Zurich' },
      { id: 'cdg-time', tz: 'Europe/Paris' },
      { id: 'nyc-time', tz: 'America/New_York' }
    ];

    this.initObserver();
    this.initWorldClocks();
    this.initFloatingPreview();
    this.initHorizontalDrag();
  }

  initObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in-view');
        }
      });
    }, options);

    this.refreshReveals();
  }

  refreshReveals() {
    const revealEls = document.querySelectorAll('.reveal-init:not(.reveal-in-view)');
    revealEls.forEach(el => this.observer.observe(el));
  }

  initWorldClocks() {
    const updateTimes = () => {
      const now = new Date();
      this.clocks.forEach(clock => {
        const el = document.getElementById(clock.id);
        if (el) {
          try {
            const timeStr = now.toLocaleTimeString('en-GB', {
              timeZone: clock.tz,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
            el.textContent = timeStr;
          } catch (e) {
            // fallback
            el.textContent = '--:--:--';
          }
        }
      });
    };

    updateTimes();
    setInterval(updateTimes, 1000);
  }

  initFloatingPreview() {
    if (!this.floatingPreview) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX + 20;
      targetY = e.clientY + 20;
    });

    const animatePreview = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (this.floatingPreview.classList.contains('visible')) {
        this.floatingPreview.style.left = `${currentX}px`;
        this.floatingPreview.style.top = `${currentY}px`;
      }
      requestAnimationFrame(animatePreview);
    };
    animatePreview();

    // Delegate hover for preview items
    document.body.addEventListener('mouseover', (e) => {
      const row = e.target.closest('[data-preview-img]');
      if (row && this.previewImg && this.floatingPreview) {
        const src = row.getAttribute('data-preview-img');
        if (src) {
          this.previewImg.src = src;
          this.floatingPreview.classList.add('visible');
        }
      }
    });

    document.body.addEventListener('mouseout', (e) => {
      const row = e.target.closest('[data-preview-img]');
      if (row && this.floatingPreview) {
        this.floatingPreview.classList.remove('visible');
      }
    });
  }

  initHorizontalDrag() {
    // Allows dragging reel smoothly
    document.body.addEventListener('wheel', (e) => {
      const reel = e.target.closest('.reel-container');
      if (reel) {
        // Map vertical wheel to horizontal scroll when hovering over reel
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          reel.scrollLeft += e.deltaY * 1.5;
        }
      }
    }, { passive: false });

    // Drag-to-scroll logic
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    document.body.addEventListener('mousedown', (e) => {
      const reel = e.target.closest('.reel-container');
      if (!reel) return;
      isDown = true;
      startX = e.pageX - reel.offsetLeft;
      scrollLeft = reel.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    document.body.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const reel = e.target.closest('.reel-container');
      if (!reel) return;
      e.preventDefault();
      const x = e.pageX - reel.offsetLeft;
      const walk = (x - startX) * 1.8;
      reel.scrollLeft = scrollLeft - walk;
    });
  }
}
