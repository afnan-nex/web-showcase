/**
 * MediCare Plus - Medical Services & Departments Controller
 * Manages department switching, service catalog rendering, and service details modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  ServicesController.init();
});

const ServicesController = {
  currentDept: "all",
  searchQuery: "",

  init() {
    this.readUrlParams();
    this.bindEvents();
    this.render();
  },

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("dept")) {
      this.currentDept = params.get("dept");
    }
  },

  bindEvents() {
    // Tab buttons
    const tabBtns = document.querySelectorAll(".dept-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentDept = btn.getAttribute("data-dept");
        this.render();
      });
    });

    // Search input
    const searchInput = document.getElementById("serviceSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.render();
      });
    }

    // Service modal close
    const modal = document.getElementById("serviceDetailModal");
    const closeBtn = document.getElementById("closeServiceModalBtn");
    if (modal && closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    }
  },

  render() {
    this.syncTabUI();
    this.renderDeptShowcase();
    this.renderServicesGrid();
  },

  syncTabUI() {
    const tabBtns = document.querySelectorAll(".dept-tab-btn");
    tabBtns.forEach(btn => {
      if (btn.getAttribute("data-dept") === this.currentDept) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  renderDeptShowcase() {
    const showcaseContainer = document.getElementById("deptShowcaseContainer");
    if (!showcaseContainer) return;

    if (this.currentDept === "all") {
      showcaseContainer.style.display = "none";
      return;
    }

    const dept = MEDICAL_DATA.departments.find(d => d.id === this.currentDept);
    if (!dept) {
      showcaseContainer.style.display = "none";
      return;
    }

    showcaseContainer.style.display = "block";
    showcaseContainer.innerHTML = `
      <div class="dept-showcase">
        <div class="dept-showcase-header">
          <div>
            <span class="badge badge-primary" style="margin-bottom:0.35rem;">Department Division</span>
            <h2 class="dept-showcase-title">${escapeHtml(dept.name)}</h2>
            <div class="dept-showcase-chair">Division Chair: <strong>${escapeHtml(dept.headOfDept)}</strong></div>
          </div>
          <div class="dept-lead-time-box">
            <span>⏱ ${escapeHtml(dept.leadTimes)}</span>
          </div>
        </div>
        <p style="font-size:0.9375rem; color:var(--color-neutral-700); margin-bottom:1rem; line-height:1.6;">${escapeHtml(dept.description)}</p>
        <div>
          <strong style="font-size:0.8125rem; text-transform:uppercase; color:var(--color-neutral-600); display:block; margin-bottom:0.4rem;">Core Clinical Capabilities:</strong>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            ${dept.featuredServices.map(s => `<span class="badge badge-neutral">${escapeHtml(s)}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderServicesGrid() {
    const grid = document.getElementById("servicesGrid");
    const countBadge = document.getElementById("servicesCountBadge");
    if (!grid) return;

    let list = [...MEDICAL_DATA.services];

    if (this.currentDept !== "all") {
      list = list.filter(s => s.departmentId === this.currentDept);
    }

    if (this.searchQuery) {
      list = list.filter(s =>
        s.name.toLowerCase().includes(this.searchQuery) ||
        s.departmentName.toLowerCase().includes(this.searchQuery) ||
        s.description.toLowerCase().includes(this.searchQuery) ||
        s.included.some(item => item.toLowerCase().includes(this.searchQuery))
      );
    }

    if (countBadge) {
      countBadge.textContent = `${list.length} clinical procedure${list.length === 1 ? '' : 's'}`;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; background:#FFF; border:1px solid var(--color-neutral-200); border-radius:var(--radius-lg); padding:3rem; text-align:center;">
          <h3>No Clinical Services Found</h3>
          <p class="text-muted text-sm">Try searching for a different test or switching department filters.</p>
        </div>
      `;
      return;
    }

    let html = "";
    list.forEach(srv => {
      html += `
        <div class="service-card" id="${srv.id}">
          <div class="service-card-top">
            <div>
              <span class="service-dept-name">${escapeHtml(srv.departmentName)}</span>
              <h3 class="service-name">${escapeHtml(srv.name)}</h3>
            </div>
            <span class="badge badge-primary" style="white-space:nowrap;">⏱ ${escapeHtml(srv.duration)}</span>
          </div>

          <p class="service-desc">${escapeHtml(srv.description)}</p>

          <div class="service-included-box">
            <div class="service-included-title">Standard Clinical Protocol Includes:</div>
            <div class="service-included-list">
              ${srv.included.slice(0, 3).map(item => `
                <div class="service-included-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${escapeHtml(item)}</span>
                </div>
              `).join("")}
              ${srv.included.length > 3 ? `<span class="text-xs text-muted" style="margin-top:2px;">+ ${srv.included.length - 3} additional diagnostic evaluations</span>` : ''}
            </div>
          </div>

          <div class="service-card-meta">
            <div>
              <span class="text-xs text-muted" style="text-transform:uppercase; display:block;">Estimated Self-Pay / Co-Pay</span>
              <strong style="font-size:1.0625rem; color:var(--color-neutral-900);">${escapeHtml(srv.estimatedFee)}</strong>
            </div>
            <span class="badge badge-neutral">In-Network Covered</span>
          </div>

          <div class="service-card-actions">
            <button class="btn btn-outline btn-sm" onclick="ServicesController.openDetailModal('${srv.id}')" style="flex:1;">View Protocol</button>
            <a href="appointment.html?department=${srv.departmentId}" class="btn btn-primary btn-sm" style="flex:1;">Schedule Evaluation</a>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  },

  openDetailModal(serviceId) {
    const srv = MEDICAL_DATA.services.find(s => s.id === serviceId);
    const modal = document.getElementById("serviceDetailModal");
    const content = document.getElementById("serviceModalBody");
    if (!srv || !modal || !content) return;

    content.innerHTML = `
      <div style="padding:1.5rem;">
        <span class="badge badge-primary" style="margin-bottom:0.5rem;">${escapeHtml(srv.departmentName)}</span>
        <h2 style="font-size:1.5rem; margin-bottom:0.5rem;">${escapeHtml(srv.name)}</h2>
        <p class="text-muted" style="font-size:0.9375rem; margin-bottom:1.25rem;">${escapeHtml(srv.description)}</p>

        <div style="background:var(--color-neutral-50); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.25rem;">
          <strong style="font-size:0.875rem; color:var(--color-neutral-900); display:block; margin-bottom:0.25rem;">Patient Preparation Instructions</strong>
          <p class="text-sm" style="color:var(--color-neutral-700); margin-bottom:0;">${escapeHtml(srv.preparation)}</p>
        </div>

        <div style="margin-bottom:1.25rem;">
          <strong style="font-size:0.875rem; color:var(--color-neutral-900); display:block; margin-bottom:0.5rem;">Full Clinical Inclusions:</strong>
          <ul style="display:flex; flex-direction:column; gap:0.4rem;">
            ${srv.included.map(item => `
              <li style="display:flex; align-items:center; gap:0.5rem; font-size:0.875rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-700)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${escapeHtml(item)}</span>
              </li>
            `).join("")}
          </ul>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid var(--color-neutral-200);">
          <div>
            <span class="text-xs text-muted" style="text-transform:uppercase; display:block;">Estimated Pricing</span>
            <strong style="font-size:1.125rem;">${escapeHtml(srv.estimatedFee)}</strong>
          </div>
          <a href="appointment.html?department=${srv.departmentId}" class="btn btn-primary">Book Consultation</a>
        </div>
      </div>
    `;

    modal.classList.add("open");
  }
};
