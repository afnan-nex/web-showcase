/**
 * NEXUS STUDIO — TESTIMONIAL & SLIDER COMPONENT
 * Rotating carousel with autoplay, pause on hover, keyboard navigation, and dots
 */

const TestimonialSlider = {
  container: null,
  slides: [],
  dots: [],
  prevBtn: null,
  nextBtn: null,
  dotsContainer: null,
  currentIndex: 0,
  autoplayInterval: null,
  AUTOPLAY_DELAY: 7000,
  isPaused: false,

  init() {
    this.container = document.querySelector(".testimonial-carousel");
    if (!this.container || typeof TESTIMONIALS_DATA === "undefined") return;

    this.renderSlides();
    this.bindEvents();
    this.startAutoplay();
  },

  renderSlides() {
    const track = this.container.querySelector(".testimonial-track-container");
    this.dotsContainer = this.container.querySelector(".testimonial-dots");
    this.prevBtn = this.container.querySelector(".testimonial-prev");
    this.nextBtn = this.container.querySelector(".testimonial-next");

    if (!track) return;

    track.innerHTML = TESTIMONIALS_DATA.map((t, idx) => `
      <div class="testimonial-slide ${idx === 0 ? 'is-active' : ''}" data-slide-index="${idx}">
        <blockquote class="testimonial-quote">
          "${t.quote}"
        </blockquote>
        <div class="testimonial-author-wrap">
          <img src="${t.avatar}" alt="${t.author}" class="testimonial-avatar" loading="lazy">
          <div>
            <div class="testimonial-name">${t.author}</div>
            <div class="testimonial-role">${t.role}, ${t.company} — ${t.location}</div>
          </div>
        </div>
      </div>
    `).join("");

    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = TESTIMONIALS_DATA.map((_, idx) => `
        <button class="testimonial-dot ${idx === 0 ? 'active' : ''}" data-dot-index="${idx}" aria-label="Go to slide ${idx + 1}"></button>
      `).join("");
    }

    this.slides = this.container.querySelectorAll(".testimonial-slide");
    this.dots = this.container.querySelectorAll(".testimonial-dot");
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.prevSlide();
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.nextSlide();
        this.resetAutoplay();
      });
    }

    if (this.dotsContainer) {
      this.dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
          const index = parseInt(dot.getAttribute("data-dot-index"), 10);
          this.goToSlide(index);
          this.resetAutoplay();
        });
      });
    }

    // Pause autoplay on mouse enter / resume on leave
    this.container.addEventListener("mouseenter", () => {
      this.isPaused = true;
    });

    this.container.addEventListener("mouseleave", () => {
      this.isPaused = false;
    });

    // Keyboard navigation when carousel is focused or hovered
    document.addEventListener("keydown", (e) => {
      const rect = this.container.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInViewport) return;

      if (e.key === "ArrowLeft") {
        this.prevSlide();
        this.resetAutoplay();
      } else if (e.key === "ArrowRight") {
        this.nextSlide();
        this.resetAutoplay();
      }
    });
  },

  goToSlide(index) {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;

    this.slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add("is-active");
      } else {
        slide.classList.remove("is-active");
      }
    });

    this.dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add("active");
        dot.setAttribute("aria-current", "true");
      } else {
        dot.classList.remove("active");
        dot.removeAttribute("aria-current");
      }
    });

    this.currentIndex = index;
  },

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  },

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  },

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, this.AUTOPLAY_DELAY);
  },

  resetAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }
};
