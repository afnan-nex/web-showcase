/**
 * Atlas Academy - Homepage Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHomeCategories();
  renderFeaturedCourses();
  renderFacultyShowcase();
  renderHomeTestimonials();

  // Listen to state changes (e.g. bookmarks or enrollments) and refresh cards
  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      renderFeaturedCourses();
    });
  }
});

function renderHomeCategories() {
  const container = document.getElementById("home-categories-grid");
  if (!container || !window.ATLAS_DATA) return;

  container.innerHTML = ATLAS_DATA.categories.map(cat => `
    <a href="courses.html?cat=${cat.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--border-medium)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--border-subtle)'; this.style.transform='none'">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 36px; height: 36px; border-radius: 6px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent-primary); font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem;">
          #
        </div>
        <div>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${cat.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${cat.count} Masterclasses</div>
        </div>
      </div>
      <span style="color: var(--text-muted); font-size: 1.1rem;">→</span>
    </a>
  `).join("");
}

function renderFeaturedCourses() {
  const container = document.getElementById("home-featured-courses-grid");
  if (!container || !window.ATLAS_DATA) return;

  const featured = ATLAS_DATA.courses.slice(0, 6);
  container.innerHTML = featured.map(course => renderCourseCard(course)).join("");
}

function renderFacultyShowcase() {
  const container = document.getElementById("home-faculty-grid");
  if (!container || !window.ATLAS_DATA) return;

  const faculty = ATLAS_DATA.instructors.slice(0, 3);
  container.innerHTML = faculty.map(inst => `
    <div class="card" style="padding: 28px;">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
        <img src="${inst.avatar}" alt="${inst.name}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-medium);" />
        <div>
          <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${inst.name}</h3>
          <div style="font-size: 0.78rem; color: var(--accent-primary); font-family: var(--font-mono);">${inst.role}</div>
        </div>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
        ${inst.bio}
      </p>
      <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
        <span>${inst.studentsCount.toLocaleString()} Students</span>
        <span style="color: var(--accent-gold);">★ ${inst.rating} Rating</span>
      </div>
    </div>
  `).join("");
}

function renderHomeTestimonials() {
  const container = document.getElementById("home-testimonials-grid");
  if (!container || !window.ATLAS_DATA) return;

  container.innerHTML = ATLAS_DATA.testimonials.map(t => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 32px; display: flex; flex-direction: column; justify-content: space-between;">
      <p style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.65; margin-bottom: 24px; font-style: italic;">
        "${t.quote}"
      </p>
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${t.avatar}" alt="${t.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-medium);" />
        <div>
          <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary);">${t.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${t.role}</div>
        </div>
      </div>
    </div>
  `).join("");
}
