/**
 * Frame & Form — Immersive Lightbox Gallery
 * Fullscreen, zoom & pan, keyboard controls, metadata HUD, filmstrip scrubber.
 */

import { sound } from './audio.js';

export class GalleryLightbox {
  constructor() {
    this.overlay = document.querySelector('.lightbox-overlay');
    this.stage = document.querySelector('.lightbox-main-stage');
    this.imgWrapper = document.querySelector('.lightbox-img-wrapper');
    this.mainImg = document.querySelector('.lightbox-main-img');
    this.captionEl = document.querySelector('.lightbox-caption');
    this.cameraMetaEl = document.querySelector('.lightbox-camera-meta');
    this.counterEl = document.querySelector('.lightbox-counter');
    this.thumbsContainer = document.querySelector('.lightbox-thumbnails');
    this.closeBtn = document.querySelector('.lightbox-close-btn');
    this.fullscreenBtn = document.querySelector('.lightbox-fullscreen-btn');
    this.zoomBtn = document.querySelector('.lightbox-zoom-btn');
    this.prevBtn = document.querySelector('.lightbox-nav-arrow.prev');
    this.nextBtn = document.querySelector('.lightbox-nav-arrow.next');

    this.images = [];
    this.currentIndex = 0;
    this.isOpen = false;
    this.isZoomed = false;
    this.zoomLevel = 1;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.panPos = { x: 0, y: 0 };

    this.bindEvents();
  }

  bindEvents() {
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    if (this.zoomBtn) this.zoomBtn.addEventListener('click', () => this.toggleZoom());

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'z':
        case 'Z':
          this.toggleZoom();
          break;
      }
    });

    // Zoom and pan interaction
    if (this.imgWrapper) {
      this.imgWrapper.addEventListener('click', (e) => {
        if (!this.isDragging) {
          this.toggleZoom(e);
        }
      });

      this.imgWrapper.addEventListener('mousedown', (e) => {
        if (!this.isZoomed) return;
        this.isDragging = true;
        this.dragStart.x = e.clientX - this.panPos.x;
        this.dragStart.y = e.clientY - this.panPos.y;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDragging || !this.isZoomed) return;
        this.panPos.x = e.clientX - this.dragStart.x;
        this.panPos.y = e.clientY - this.dragStart.y;
        this.updateTransform();
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      // Mouse wheel zoom
      this.imgWrapper.addEventListener('wheel', (e) => {
        if (!this.isOpen) return;
        e.preventDefault();
        if (e.deltaY < 0) {
          this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3.5);
          this.isZoomed = true;
        } else {
          this.zoomLevel = Math.max(this.zoomLevel - 0.25, 1);
          if (this.zoomLevel === 1) {
            this.isZoomed = false;
            this.panPos = { x: 0, y: 0 };
          }
        }
        this.updateTransform();
      }, { passive: false });
    }
  }

  open(images, startIndex = 0) {
    this.images = images || [];
    this.currentIndex = startIndex;
    this.isOpen = true;
    this.resetZoom();

    if (this.overlay) {
      this.overlay.classList.add('open');
    }
    document.body.style.overflow = 'hidden';

    this.renderCurrent();
    this.renderThumbnails();
    sound.playTransition();
  }

  close() {
    this.isOpen = false;
    this.resetZoom();
    if (this.overlay) {
      this.overlay.classList.remove('open');
    }
    document.body.style.overflow = '';
    sound.playClick();
  }

  next() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetZoom();
    this.renderCurrent();
    sound.playHover();
  }

  prev() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetZoom();
    this.renderCurrent();
    sound.playHover();
  }

  goTo(index) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.resetZoom();
      this.renderCurrent();
      sound.playHover();
    }
  }

  renderCurrent() {
    const item = this.images[this.currentIndex];
    if (!item) return;

    if (this.mainImg) {
      this.mainImg.src = item.url;
      this.mainImg.alt = item.caption || 'Project Gallery Image';
    }

    if (this.captionEl) {
      this.captionEl.textContent = item.caption || `Image ${this.currentIndex + 1}`;
    }

    if (this.cameraMetaEl) {
      this.cameraMetaEl.textContent = item.camera ? `${item.camera} · ${item.dimension || ''}` : 'Medium Format Capture';
    }

    if (this.counterEl) {
      this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.images.length).padStart(2, '0')}`;
    }

    // Highlight active thumbnail
    if (this.thumbsContainer) {
      const thumbs = this.thumbsContainer.querySelectorAll('.lightbox-thumb');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === this.currentIndex);
      });
    }
  }

  renderThumbnails() {
    if (!this.thumbsContainer) return;
    this.thumbsContainer.innerHTML = '';

    this.images.forEach((item, index) => {
      const thumb = document.createElement('img');
      thumb.className = `lightbox-thumb clickable ${index === this.currentIndex ? 'active' : ''}`;
      thumb.src = item.url;
      thumb.alt = item.caption || `Thumbnail ${index + 1}`;
      thumb.setAttribute('data-cursor', 'view');
      thumb.addEventListener('click', () => this.goTo(index));
      this.thumbsContainer.appendChild(thumb);
    });
  }

  toggleZoom() {
    if (this.isZoomed) {
      this.resetZoom();
    } else {
      this.isZoomed = true;
      this.zoomLevel = 2.2;
      this.updateTransform();
    }
    sound.playClick();
  }

  resetZoom() {
    this.isZoomed = false;
    this.zoomLevel = 1;
    this.panPos = { x: 0, y: 0 };
    this.updateTransform();
  }

  updateTransform() {
    if (!this.imgWrapper) return;
    this.imgWrapper.style.transform = `translate3d(${this.panPos.x}px, ${this.panPos.y}px, 0) scale(${this.zoomLevel})`;
    this.imgWrapper.style.cursor = this.isZoomed ? (this.isDragging ? 'grabbing' : 'grab') : 'zoom-in';
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
    sound.playClick();
  }
}
