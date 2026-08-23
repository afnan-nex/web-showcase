/**
 * Frame & Form — Master Application Controller (app.js)
 * Coordinates router, audio, cursor, gallery lightbox, bookmarks, command palette & inquiries.
 */

import { PROJECTS, DISCIPLINES } from './data.js';
import { sound } from './audio.js';
import { CustomCursor } from './cursor.js';
import { GalleryLightbox } from './gallery.js';
import { EffectsController } from './effects.js';
import { AppRouter } from './router.js';

class FrameAndFormApp {
  constructor() {
    this.bookmarks = [];
    this.inquiries = [];

    try {
      if (typeof localStorage !== 'undefined') {
        this.bookmarks = JSON.parse(localStorage.getItem('ff_bookmarks') || '[]');
        this.inquiries = JSON.parse(localStorage.getItem('ff_inquiries') || '[]');
      }
    } catch (e) {
      console.warn("Storage access restricted, using memory store:", e);
    }

    this.cursor = null;
    this.gallery = null;
    this.effects = null;
    this.router = null;

    this.paletteOpen = false;
    this.savedDrawerOpen = false;

    this.init();
  }

  init() {
    // 1. Instantiate Core Subsystems
    this.cursor = new CustomCursor();
    this.gallery = new GalleryLightbox();
    this.effects = new EffectsController();
    this.router = new AppRouter(this);

    // 2. Initialize HUD & Global Listeners
    this.initGlobalHUD();
    this.initCommandPalette();
    this.initSavedDrawer();
    this.initShortcuts();

    // 3. Start Router
    this.router.init();

    // 4. Initial Bookmarks Badge Sync
    this.updateBookmarkBadge();
  }

  /* -------------------------------------------------------------
     GLOBAL HUD CONTROLS
     ------------------------------------------------------------- */
  initGlobalHUD() {
    // Audio Toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundLabel = document.getElementById('sound-toggle-label');
    if (soundBtn) {
      const updateSoundUI = () => {
        if (sound.isEnabled) {
          soundBtn.classList.add('active');
          if (soundLabel) soundLabel.textContent = 'SOUND: ON';
        } else {
          soundBtn.classList.remove('active');
          if (soundLabel) soundLabel.textContent = 'SOUND: OFF';
        }
      };
      updateSoundUI();

      soundBtn.addEventListener('click', () => {
        const state = sound.toggle();
        updateSoundUI();
        this.showToast(state ? 'Procedural Audio Enabled' : 'Procedural Audio Muted');
      });
    }

    // Saved Drawer Trigger
    const savedBtn = document.getElementById('saved-toggle-btn');
    if (savedBtn) {
      savedBtn.addEventListener('click', () => this.toggleSavedDrawer());
    }

    // Command Palette Trigger
    const cmdBtn = document.getElementById('cmd-palette-btn');
    if (cmdBtn) {
      cmdBtn.addEventListener('click', () => this.openCommandPalette());
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        sound.playClick();
      });
    }
  }

  /* -------------------------------------------------------------
     BOOKMARKING & MOODBOARD SYSTEM
     ------------------------------------------------------------- */
  getBookmarks() {
    return this.bookmarks;
  }

  isBookmarked(id) {
    return this.bookmarks.includes(id);
  }

  toggleBookmark(id) {
    const project = PROJECTS.find(p => p.id === id || p.slug === id);
    if (!project) return;

    const index = this.bookmarks.indexOf(project.id);
    let added = false;

    if (index === -1) {
      this.bookmarks.push(project.id);
      added = true;
      sound.playSuccess();
      this.showToast(`Added "${project.title}" to Moodboard`);
    } else {
      this.bookmarks.splice(index, 1);
      sound.playClick();
      this.showToast(`Removed "${project.title}" from Moodboard`);
    }

    localStorage.setItem('ff_bookmarks', JSON.stringify(this.bookmarks));
    this.updateBookmarkBadge();
    this.renderSavedDrawer();

    // Update any bookmark buttons currently in DOM
    const btns = document.querySelectorAll(`[data-bookmark-id="${project.id}"]`);
    btns.forEach(btn => {
      btn.classList.toggle('saved', added);
      btn.classList.toggle('active', added);
      if (btn.classList.contains('bookmark-icon-btn')) {
        btn.textContent = added ? '★' : '☆';
      }
    });

    return added;
  }

  updateBookmarkBadge() {
    const badge = document.getElementById('saved-badge-count');
    if (badge) {
      badge.textContent = this.bookmarks.length;
    }
  }

  toggleSavedDrawer() {
    this.savedDrawerOpen = !this.savedDrawerOpen;
    const drawer = document.querySelector('.saved-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');

    if (drawer && backdrop) {
      drawer.classList.toggle('open', this.savedDrawerOpen);
      backdrop.classList.toggle('open', this.savedDrawerOpen);
    }

    if (this.savedDrawerOpen) {
      this.renderSavedDrawer();
      sound.playTransition();
    } else {
      sound.playClick();
    }
  }

  initSavedDrawer() {
    const drawerClose = document.getElementById('saved-drawer-close');
    const backdrop = document.querySelector('.drawer-backdrop');
    const exportBtn = document.getElementById('export-moodboard-btn');
    const clearBtn = document.getElementById('clear-moodboard-btn');

    if (drawerClose) drawerClose.addEventListener('click', () => this.toggleSavedDrawer());
    if (backdrop) backdrop.addEventListener('click', () => this.toggleSavedDrawer());

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const savedProjects = PROJECTS.filter(p => this.bookmarks.includes(p.id));
        if (!savedProjects.length) {
          this.showToast('Your Moodboard is empty.');
          return;
        }

        const textDossier = `FRAME & FORM — MOODBOARD EXPORT\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
          savedProjects.map(p => `• [${p.year}] ${p.title} (${p.discipline})\n  Client: ${p.client}\n  Location: ${p.location}\n  Link: https://frameandform.studio/#project?id=${p.slug}\n`).join('\n');

        navigator.clipboard.writeText(textDossier).then(() => {
          sound.playSuccess();
          this.showToast('Moodboard dossier copied to clipboard.');
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.bookmarks = [];
        localStorage.setItem('ff_bookmarks', JSON.stringify([]));
        this.updateBookmarkBadge();
        this.renderSavedDrawer();
        this.showToast('Moodboard cleared.');
        sound.playClick();
      });
    }
  }

  renderSavedDrawer() {
    const body = document.querySelector('.drawer-body');
    if (!body) return;

    const savedProjects = PROJECTS.filter(p => this.bookmarks.includes(p.id));

    if (!savedProjects.length) {
      body.innerHTML = `
        <div style="text-align:center; padding: 4rem 1rem; color:var(--text-muted); font-family:var(--font-mono); font-size:0.8rem;">
          <div style="font-size:2rem; margin-bottom:1rem; opacity:0.3;">★</div>
          <p style="color:var(--text-primary); font-weight:500; margin-bottom:0.4rem;">Your saved collection is empty.</p>
          <p style="font-size:0.72rem; opacity:0.7; max-width:280px; margin: 0 auto 1.5rem;">Click the star on any project across the catalog to curate your private moodboard.</p>
          <a href="#work" class="hud-btn clickable" style="display:inline-flex;" onclick="document.querySelector('.drawer-backdrop').click();">Explore Works Catalog →</a>
        </div>
      `;
      return;
    }

    body.innerHTML = savedProjects.map(p => `
      <div class="saved-item-card">
        <img src="${p.coverImage}" alt="${p.title}" class="saved-item-thumb" />
        <div class="saved-item-info">
          <div class="font-display" style="font-size:1.1rem; font-weight:600;">
            <a href="#project?id=${p.slug}" class="clickable" onclick="document.querySelector('.drawer-backdrop').click();">${p.title}</a>
          </div>
          <div class="font-mono text-muted" style="font-size:0.72rem;">${p.client} · ${p.discipline}</div>
        </div>
        <button class="bookmark-icon-btn clickable saved" data-remove-saved="${p.id}" title="Remove from moodboard" style="width:28px; height:28px; font-size:0.75rem;">
          ✕
        </button>
      </div>
    `).join('');

    // Bind remove buttons
    const removeBtns = body.querySelectorAll('[data-remove-saved]');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-remove-saved');
        this.toggleBookmark(id);
      });
    });
  }

  /* -------------------------------------------------------------
     COMMAND PALETTE (CMD+K / CTRL+K)
     ------------------------------------------------------------- */
  initCommandPalette() {
    const overlay = document.querySelector('.command-palette-overlay');
    const input = document.getElementById('palette-input');
    const list = document.getElementById('palette-results-list');

    if (!overlay || !input || !list) return;

    const renderResults = (query = '') => {
      const q = query.toLowerCase().trim();
      list.innerHTML = '';

      // 1. Navigation items
      const navItems = [
        { title: 'Home', subtitle: 'Flagship Overview & Selected Reels', href: '#home', type: 'PAGE' },
        { title: 'Works Catalog', subtitle: 'Complete 12 Projects with Filters', href: '#work', type: 'PAGE' },
        { title: 'About & Manifesto', subtitle: 'Studio Philosophy, Clients & Awards', href: '#about', type: 'PAGE' },
        { title: 'Archive', subtitle: 'Chronological Data Index 2018-2026', href: '#archive', type: 'PAGE' },
        { title: 'Initiate Commission', subtitle: 'Interactive Project Brief Builder', href: '#contact', type: 'PAGE' }
      ];

      // 2. Project items
      const projectItems = PROJECTS.map(p => ({
        title: p.title,
        subtitle: `${p.client} · ${p.discipline} (${p.year})`,
        href: `#project?id=${p.slug}`,
        type: 'PROJECT'
      }));

      // Combine & Filter
      const allItems = [...navItems, ...projectItems].filter(item => {
        return !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
      });

      if (!allItems.length) {
        list.innerHTML = `<div style="padding:1.5rem; text-align:center; font-family:var(--font-mono); color:var(--text-muted); font-size:0.8rem;">No results found for "${query}"</div>`;
        return;
      }

      allItems.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = `palette-item clickable ${index === 0 ? 'active' : ''}`;
        el.setAttribute('data-href', item.href);
        el.innerHTML = `
          <div>
            <div style="font-weight:600; color:var(--text-primary);">${item.title}</div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.15rem;">${item.subtitle}</div>
          </div>
          <span class="meta-pill" style="font-size:0.6rem;">${item.type}</span>
        `;

        el.addEventListener('click', () => {
          this.closeCommandPalette();
          this.router.navigate(item.href);
        });

        list.appendChild(el);
      });
    };

    input.addEventListener('input', (e) => renderResults(e.target.value));

    // Keyboard navigation in palette
    input.addEventListener('keydown', (e) => {
      const items = list.querySelectorAll('.palette-item');
      let activeIndex = Array.from(items).findIndex(it => it.classList.contains('active'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          if (activeIndex >= 0) items[activeIndex].classList.remove('active');
          activeIndex = (activeIndex + 1) % items.length;
          items[activeIndex].classList.add('active');
          items[activeIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          if (activeIndex >= 0) items[activeIndex].classList.remove('active');
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          items[activeIndex].classList.add('active');
          items[activeIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          const href = items[activeIndex].getAttribute('data-href');
          this.closeCommandPalette();
          if (href) this.router.navigate(href);
        }
      } else if (e.key === 'Escape') {
        this.closeCommandPalette();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (!e.target.closest('.command-palette-box')) {
        this.closeCommandPalette();
      }
    });
  }

  openCommandPalette() {
    const overlay = document.querySelector('.command-palette-overlay');
    const input = document.getElementById('palette-input');
    if (!overlay || !input) return;

    this.paletteOpen = true;
    overlay.classList.add('open');
    input.value = '';
    input.focus();

    // Trigger initial render
    const event = new Event('input');
    input.dispatchEvent(event);

    sound.playClick();
  }

  closeCommandPalette() {
    const overlay = document.querySelector('.command-palette-overlay');
    if (!overlay) return;
    this.paletteOpen = false;
    overlay.classList.remove('open');
  }

  initShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Command / Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (this.paletteOpen) {
          this.closeCommandPalette();
        } else {
          this.openCommandPalette();
        }
      }

      // 'M' for global Mute
      if (e.key.toLowerCase() === 'm' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) soundBtn.click();
      }
    });
  }

  /* -------------------------------------------------------------
     COMMISSION / INQUIRY SUBMISSION
     ------------------------------------------------------------- */
  getInquiries() {
    return this.inquiries;
  }

  submitInquiry() {
    const nameEl = document.getElementById('client-name');
    const orgEl = document.getElementById('client-org');
    const emailEl = document.getElementById('client-email');
    const synopsisEl = document.getElementById('client-synopsis');
    const budgetSlider = document.getElementById('budget-slider');
    const submitBtn = document.querySelector('.submit-btn-cta[type="submit"]');

    if (!nameEl || !orgEl || !emailEl || !nameEl.value.trim() || !emailEl.value.trim()) {
      this.showToast('Please provide your name, organization, and valid email.');
      return;
    }

    // Selected scopes
    const scopeChips = document.querySelectorAll('#scope-chips .chip-choice.selected');
    const scopes = Array.from(scopeChips).map(c => c.getAttribute('data-val')).join(', ') || 'Comprehensive Creative Direction';

    // Selected timeline
    const timelineChip = document.querySelector('#timeline-chips .chip-choice.selected');
    const timeline = timelineChip ? timelineChip.getAttribute('data-val') : 'Q3 / Q4 2026';

    const submissionId = `FF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionData = {
      id: submissionId,
      name: nameEl.value.trim(),
      org: orgEl.value.trim() || 'Independent',
      email: emailEl.value.trim(),
      type: scopes,
      timeline: timeline,
      budget: budgetSlider ? `$${parseInt(budgetSlider.value, 10).toLocaleString()}` : '$75,000',
      synopsis: synopsisEl ? synopsisEl.value.trim() : '',
      timestamp: new Date().toLocaleString(),
      status: 'CONFIRMED'
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Compiling Dossier...</span> <span>⏳</span>';
    }

    setTimeout(() => {
      this.inquiries.unshift(submissionData);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ff_inquiries', JSON.stringify(this.inquiries));
        }
      } catch (e) {
        console.warn("Storage write failed:", e);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Transmit Commission Brief</span> <span>→</span>';
      }

      // Show confirmation UI
      const receiptBox = document.getElementById('submission-receipt-box');
      const receiptId = document.getElementById('receipt-id');
      const receiptSummary = document.getElementById('receipt-summary');

      if (receiptBox && receiptId && receiptSummary) {
        receiptId.innerHTML = `<span style="font-weight:700;">${submissionId}</span> <button type="button" class="hud-btn clickable" id="copy-receipt-id-btn" style="margin-left:0.75rem; padding:0.2rem 0.5rem; font-size:0.65rem;">COPY ID</button>`;
        receiptSummary.innerHTML = `
          <strong>Client:</strong> ${submissionData.name} (${submissionData.org})<br>
          <strong>Scope:</strong> ${submissionData.type}<br>
          <strong>Budget Allocation:</strong> ${submissionData.budget} · <strong>Timeline:</strong> ${submissionData.timeline}<br>
          <strong>Dossier Reference:</strong> Recorded in Studio Intake Registry
        `;
        receiptBox.style.display = 'block';
        receiptBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const copyBtn = document.getElementById('copy-receipt-id-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(submissionId).then(() => {
              this.showToast(`Reference ID #${submissionId} copied to clipboard`);
              sound.playClick();
            });
          });
        }
      }

      sound.playSuccess();
      this.showToast(`Commission Brief #${submissionId} Logged Successfully`);
    }, 450);
  }

  /* -------------------------------------------------------------
     TOAST NOTIFICATIONS
     ------------------------------------------------------------- */
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  /* -------------------------------------------------------------
     AFTER-RENDER HOOK
     ------------------------------------------------------------- */
  afterRender() {
    // 1. Re-bind dynamic bookmark buttons
    const bookmarkBtns = document.querySelectorAll('[data-bookmark-id]');
    bookmarkBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-bookmark-id');
        this.toggleBookmark(id);
      });
    });

    // 2. Refresh IntersectionObserver reveals
    if (this.effects) {
      this.effects.refreshReveals();
    }

    // 3. Reset Cursor Hover
    if (this.cursor) {
      this.cursor.refresh();
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FrameAndFormApp();
});
