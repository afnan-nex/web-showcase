/**
 * NEXUS STUDIO — CUSTOM CURSOR
 * Smooth physics-aware custom cursor with interactive hover states
 */

const CustomCursor = {
  cursorDot: null,
  cursorFollower: null,
  mouseX: -100,
  mouseY: -100,
  followerX: -100,
  followerY: -100,
  isInitialized: false,

  init() {
    // Only initialize on devices with fine pointer (mouse), disable on touchscreens
    if (window.matchMedia("(pointer: coarse)").matches) return;

    this.createCursorElements();
    this.bindEvents();
    this.renderLoop();
  },

  createCursorElements() {
    this.cursorDot = document.createElement("div");
    this.cursorDot.className = "custom-cursor";

    this.cursorFollower = document.createElement("div");
    this.cursorFollower.className = "custom-cursor-follower";

    document.body.appendChild(this.cursorDot);
    document.body.appendChild(this.cursorFollower);
  },

  bindEvents() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isInitialized) {
        this.cursorDot.style.opacity = "1";
        this.cursorFollower.style.opacity = "1";
        this.followerX = this.mouseX;
        this.followerY = this.mouseY;
        this.isInitialized = true;
      }
    });

    document.addEventListener("mouseleave", () => {
      if (this.cursorDot) this.cursorDot.style.opacity = "0";
      if (this.cursorFollower) this.cursorFollower.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      if (this.cursorDot) this.cursorDot.style.opacity = "1";
      if (this.cursorFollower) this.cursorFollower.style.opacity = "1";
    });

    // Delegate hover states on interactive elements
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("a, button, input, select, textarea, .project-card, .gallery-image-card, [data-cursor-hover]");
      if (target) {
        this.cursorDot.classList.add("active");
        this.cursorFollower.classList.add("active");

        if (target.getAttribute("data-cursor-text")) {
          this.cursorDot.classList.add("pointer-text");
          this.cursorDot.textContent = target.getAttribute("data-cursor-text");
        }
      }
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest("a, button, input, select, textarea, .project-card, .gallery-image-card, [data-cursor-hover]");
      if (target) {
        this.cursorDot.classList.remove("active");
        this.cursorFollower.classList.remove("active");
        this.cursorDot.classList.remove("pointer-text");
        this.cursorDot.textContent = "";
      }
    });
  },

  renderLoop() {
    const loop = () => {
      if (this.cursorDot && this.cursorFollower) {
        this.cursorDot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) translate(-50%, -50%)`;

        // Smooth easing follower
        this.followerX += (this.mouseX - this.followerX) * 0.18;
        this.followerY += (this.mouseY - this.followerY) * 0.18;
        this.cursorFollower.style.transform = `translate(${this.followerX}px, ${this.followerY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
};
