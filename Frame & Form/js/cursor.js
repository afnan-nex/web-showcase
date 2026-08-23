/**
 * Frame & Form — Custom Physics Cursor
 * Responsive lerped cursor follower with dynamic state labels.
 */

export class CustomCursor {
  constructor() {
    this.dot = document.querySelector('.cursor-dot');
    this.follower = document.querySelector('.cursor-follower');
    this.label = document.querySelector('.cursor-label');

    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.lerpFactor = 0.16;
    this.isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    this.rafId = null;

    if (!this.isTouch && this.dot && this.follower) {
      this.init();
    }
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
      // Dot moves instantly
      if (this.dot) {
        this.dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    });

    window.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-active');
    });

    window.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-active');
    });

    document.addEventListener('mouseleave', () => {
      if (this.dot) this.dot.style.opacity = '0';
      if (this.follower) this.follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (this.dot) this.dot.style.opacity = '1';
      if (this.follower) this.follower.style.opacity = '1';
    });

    this.bindHoverElements();
    this.render();
  }

  bindHoverElements() {
    // Delegate hover listeners across document
    document.body.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, textarea, .clickable');
      if (!target) {
        this.resetState();
        return;
      }

      const cursorType = target.getAttribute('data-cursor');
      const customLabel = target.getAttribute('data-cursor-label');

      if (cursorType) {
        this.setState(cursorType, customLabel || cursorType.toUpperCase());
      } else {
        this.setState('hover', '');
      }
    });

    document.body.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, textarea, .clickable');
      if (target) {
        this.resetState();
      }
    });
  }

  setState(state, labelText = '') {
    this.resetState();
    document.body.classList.add(`cursor-${state}`);
    if (this.label && labelText) {
      this.label.textContent = labelText;
    }
  }

  resetState() {
    const states = ['cursor-hover', 'cursor-view', 'cursor-drag', 'cursor-zoom', 'cursor-expand', 'cursor-next', 'cursor-prev', 'cursor-close', 'cursor-saved'];
    states.forEach(s => document.body.classList.remove(s));
    if (this.label) {
      this.label.textContent = '';
    }
  }

  render() {
    // Lerp follower position towards target
    this.pos.x += (this.target.x - this.pos.x) * this.lerpFactor;
    this.pos.y += (this.target.y - this.pos.y) * this.lerpFactor;

    if (this.follower) {
      this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  refresh() {
    this.resetState();
  }
}
