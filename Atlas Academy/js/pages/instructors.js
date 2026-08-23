/**
 * Atlas Academy - Instructors Directory Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  renderInstructorsList();
});

function renderInstructorsList() {
  const container = document.getElementById("instructors-list-grid");
  if (!container || !window.ATLAS_DATA) return;

  container.innerHTML = ATLAS_DATA.instructors.map(inst => {
    // Find courses taught by this instructor
    const taughtCourses = ATLAS_DATA.courses.filter(c => c.instructorId === inst.id);

    return `
      <div class="card" style="padding: 32px; display: flex; flex-direction: column;">
        <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 20px;">
          <img src="${inst.avatar}" alt="${inst.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-medium); flex-shrink: 0;" />
          <div>
            <h2 style="font-size: 1.35rem; margin-bottom: 4px;">${inst.name}</h2>
            <div style="font-size: 0.85rem; color: var(--accent-primary); font-family: var(--font-mono); margin-bottom: 4px;">${inst.role}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${inst.title}</div>
          </div>
        </div>

        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 24px;">
          ${inst.bio}
        </p>

        <!-- Stats Bar -->
        <div style="display: flex; gap: 24px; padding: 14px 18px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 24px; font-family: var(--font-mono); font-size: 0.8rem;">
          <div>
            <span style="color: var(--text-muted);">Students: </span>
            <strong style="color: var(--text-primary);">${inst.studentsCount.toLocaleString()}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted);">Rating: </span>
            <strong style="color: var(--accent-gold);">★ ${inst.rating}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted);">Courses: </span>
            <strong style="color: var(--text-primary);">${taughtCourses.length}</strong>
          </div>
        </div>

        <!-- Courses Taught -->
        <div style="margin-top: auto;">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 0.08em;">
            Taught Masterclasses
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${taughtCourses.map(c => `
              <a href="course-detail.html?id=${c.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); transition: all 0.15s;" onmouseover="this.style.borderColor='var(--border-medium)'; this.style.transform='translateX(3px)'" onmouseout="this.style.borderColor='var(--border-subtle)'; this.style.transform='none'">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary);">${c.title}</div>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-primary);">View →</span>
              </a>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
}
