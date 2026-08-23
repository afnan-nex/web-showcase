/**
 * Haven Realty - Private Advisors Directory Controller
 * Handles advisor filtering, booking appointments, and active listings link routing.
 */

document.addEventListener("DOMContentLoaded", () => {
  initAgentsDirectory();
});

function initAgentsDirectory() {
  const agentsGrid = document.getElementById("agents-directory-grid");
  const filterChips = document.querySelectorAll(".agent-filter-chip");

  let currentSpecialty = "all";

  function renderAgents() {
    if (!agentsGrid) return;

    const filtered = HAVEN_AGENTS.filter(agent => {
      if (currentSpecialty === "all") return true;
      if (currentSpecialty === "penthouse" && agent.specialty.toLowerCase().includes("penthouse")) return true;
      if (currentSpecialty === "westcoast" && agent.specialty.toLowerCase().includes("beverly hills")) return true;
      if (currentSpecialty === "waterfront" && agent.specialty.toLowerCase().includes("waterfront")) return true;
      if (currentSpecialty === "alpine" && agent.specialty.toLowerCase().includes("alpine")) return true;
      if (currentSpecialty === "europe" && (agent.specialty.toLowerCase().includes("mayfair") || agent.specialty.toLowerCase().includes("european"))) return true;
      if (currentSpecialty === "commercial" && agent.specialty.toLowerCase().includes("commercial")) return true;
      return false;
    });

    agentsGrid.innerHTML = filtered.map(agent => `
      <article class="agent-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="agent-card-img-wrap" style="aspect-ratio: 16 / 14;">
            <img src="${agent.image}" alt="${agent.name}" class="agent-card-img" loading="lazy" />
          </div>
          <div class="agent-card-info">
            <span class="eyebrow" style="margin-bottom:0.25rem;">${agent.specialty}</span>
            <h3 class="agent-card-name">${agent.name}</h3>
            <div class="agent-card-title">${agent.title}</div>
            <p style="font-size:0.88rem; color:var(--color-text-secondary); margin-bottom:1.25rem; line-height:1.6;">
              ${agent.bio}
            </p>
            <div style="background:var(--color-surface-subtle); padding:1rem; border-radius:var(--radius-xs); margin-bottom:1.25rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.8rem;">
              <div>
                <span style="color:var(--color-text-muted); display:block;">Career Volume</span>
                <strong style="color:var(--color-text-primary); font-size:0.95rem;">${agent.salesVolume}</strong>
              </div>
              <div>
                <span style="color:var(--color-text-muted); display:block;">Experience</span>
                <strong style="color:var(--color-text-primary); font-size:0.95rem;">${agent.experienceYears} Years</strong>
              </div>
              <div style="grid-column: span 2; margin-top:0.25rem;">
                <span style="color:var(--color-text-muted); display:block;">Languages</span>
                <strong style="color:var(--color-text-primary);">${agent.languages.join(", ")}</strong>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; margin-bottom:1.5rem;">
              <a href="tel:${agent.phone}" style="display:flex; align-items:center; gap:0.5rem; color:var(--color-text-primary); font-weight:600;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>${agent.phone}</span>
              </a>
              <a href="mailto:${agent.email}" style="display:flex; align-items:center; gap:0.5rem; color:var(--color-text-secondary);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>${agent.email}</span>
              </a>
            </div>
          </div>
        </div>
        <div style="padding: 0 1.5rem 1.5rem; display:flex; gap:0.5rem;">
          <button type="button" class="btn btn-gold btn-sm" style="flex:1;" onclick="openAppointmentModal(null, '${agent.id}')">
            Book Consultation
          </button>
          <a href="properties.html?keyword=${encodeURIComponent(agent.name.split(' ')[0])}" class="btn btn-secondary btn-sm" style="flex:1; text-align:center;">
            View Portfolio
          </a>
        </div>
      </article>
    `).join("");
  }

  // Filter Chips
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentSpecialty = chip.dataset.specialty;
      renderAgents();
    });
  });

  renderAgents();
}
