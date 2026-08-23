/**
 * MediCare Plus - Doctor Directory Controller
 * Handles multi-criteria filtering, live search, sorting, URL params sync,
 * and dynamic doctor card rendering.
 */

document.addEventListener("DOMContentLoaded", () => {
  DoctorsController.init();
});

const DoctorsController = {
  state: {
    searchQuery: "",
    specialties: [],
    languages: [],
    locations: [],
    genders: [],
    consultTypes: [],
    availabilities: [],
    sortBy: "rating"
  },

  init() {
    this.readUrlParams();
    this.bindEvents();
    this.render();
  },

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has("specialty")) {
      const sp = params.get("specialty");
      this.state.specialties = [sp];
    }
    
    if (params.has("query")) {
      this.state.searchQuery = params.get("query");
      const searchInput = document.getElementById("doctorSearchInput");
      if (searchInput) searchInput.value = this.state.searchQuery;
    }

    if (params.has("consultType")) {
      this.state.consultTypes = [params.get("consultType")];
    }

    this.syncCheckboxUI();
  },

  syncCheckboxUI() {
    // Check specialty checkboxes
    document.querySelectorAll("input[name='specialty']").forEach(cb => {
      cb.checked = this.state.specialties.includes(cb.value);
    });

    // Check language checkboxes
    document.querySelectorAll("input[name='language']").forEach(cb => {
      cb.checked = this.state.languages.includes(cb.value);
    });

    // Check location checkboxes
    document.querySelectorAll("input[name='location']").forEach(cb => {
      cb.checked = this.state.locations.includes(cb.value);
    });

    // Check gender checkboxes
    document.querySelectorAll("input[name='gender']").forEach(cb => {
      cb.checked = this.state.genders.includes(cb.value);
    });

    // Check consultType checkboxes
    document.querySelectorAll("input[name='consultType']").forEach(cb => {
      cb.checked = this.state.consultTypes.includes(cb.value);
    });

    // Check availability checkboxes
    document.querySelectorAll("input[name='availability']").forEach(cb => {
      cb.checked = this.state.availabilities.includes(cb.value);
    });
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("doctorSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.state.searchQuery = e.target.value.trim();
        this.render();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("doctorSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.render();
      });
    }

    // Filter checkboxes
    const filterContainer = document.getElementById("filterSidebar");
    if (filterContainer) {
      filterContainer.addEventListener("change", (e) => {
        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
          this.updateFiltersFromDOM();
          this.render();
        }
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }
  },

  updateFiltersFromDOM() {
    this.state.specialties = Array.from(document.querySelectorAll("input[name='specialty']:checked")).map(cb => cb.value);
    this.state.languages = Array.from(document.querySelectorAll("input[name='language']:checked")).map(cb => cb.value);
    this.state.locations = Array.from(document.querySelectorAll("input[name='location']:checked")).map(cb => cb.value);
    this.state.genders = Array.from(document.querySelectorAll("input[name='gender']:checked")).map(cb => cb.value);
    this.state.consultTypes = Array.from(document.querySelectorAll("input[name='consultType']:checked")).map(cb => cb.value);
    this.state.availabilities = Array.from(document.querySelectorAll("input[name='availability']:checked")).map(cb => cb.value);
  },

  resetFilters() {
    this.state = {
      searchQuery: "",
      specialties: [],
      languages: [],
      locations: [],
      genders: [],
      consultTypes: [],
      availabilities: [],
      sortBy: "rating"
    };

    const searchInput = document.getElementById("doctorSearchInput");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("doctorSortSelect");
    if (sortSelect) sortSelect.value = "rating";

    this.syncCheckboxUI();
    this.render();
  },

  getFilteredDoctors() {
    let docs = [...MEDICAL_DATA.doctors];
    const q = this.state.searchQuery.toLowerCase();

    // Query filter
    if (q) {
      docs = docs.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.departmentName.toLowerCase().includes(q) ||
        d.subSpecialties.some(sub => sub.toLowerCase().includes(q)) ||
        d.languages.some(lang => lang.toLowerCase().includes(q))
      );
    }

    // Specialty filter
    if (this.state.specialties.length > 0) {
      docs = docs.filter(d => this.state.specialties.includes(d.departmentId));
    }

    // Language filter
    if (this.state.languages.length > 0) {
      docs = docs.filter(d =>
        d.languages.some(lang => this.state.languages.includes(lang))
      );
    }

    // Location filter
    if (this.state.locations.length > 0) {
      docs = docs.filter(d =>
        d.locations.some(loc => this.state.locations.includes(loc))
      );
    }

    // Gender filter
    if (this.state.genders.length > 0) {
      docs = docs.filter(d => this.state.genders.includes(d.gender));
    }

    // Consultation Type filter
    if (this.state.consultTypes.length > 0) {
      docs = docs.filter(d => {
        return this.state.consultTypes.some(type => {
          if (type.toLowerCase().includes("in-person")) return d.consultationTypes.includes("In-Person");
          if (type.toLowerCase().includes("video")) return d.consultationTypes.includes("Video Consultation");
          return false;
        });
      });
    }

    // Availability filter
    if (this.state.availabilities.length > 0) {
      docs = docs.filter(d => this.state.availabilities.includes(d.nextAvailable));
    }

    // Sorting
    switch (this.state.sortBy) {
      case "rating":
        docs.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        docs.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case "fee-asc":
        docs.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "fee-desc":
        docs.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "name":
        docs.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        docs.sort((a, b) => b.rating - a.rating);
    }

    return docs;
  },

  render() {
    const listContainer = document.getElementById("doctorsGrid");
    const countBadge = document.getElementById("doctorResultCount");
    const activeFiltersStrip = document.getElementById("activeFiltersStrip");

    if (!listContainer) return;

    const filtered = this.getFilteredDoctors();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} physician${filtered.length === 1 ? '' : 's'} available`;
    }

    this.renderActiveFilters(activeFiltersStrip);

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-doctors-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-400)" stroke-width="1.5" style="margin:0 auto 1rem;">
            <circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <h3>No Matching Physicians Found</h3>
          <p class="text-muted text-sm" style="max-width:400px; margin:0.5rem auto 1.5rem;">We couldn't find any doctors matching your specific filter criteria. Try clearing some filters or searching for another medical term.</p>
          <button class="btn btn-outline" onclick="DoctorsController.resetFilters()">Clear All Filters</button>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(doc => {
      html += `
        <article class="doc-card" data-doctor-id="${doc.id}">
          <div class="doc-card-header">
            <img src="${doc.photo}" alt="${escapeHtml(doc.name)}" class="doc-avatar" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';">
            <div class="doc-header-info">
              <span class="doc-dept-badge">${escapeHtml(doc.departmentName)}</span>
              <h2 class="doc-name">
                <a href="doctor-profile.html?id=${doc.id}">${escapeHtml(doc.name)}, ${escapeHtml(doc.title)}</a>
              </h2>
              <p class="doc-specialty">${escapeHtml(doc.specialty)}</p>
              
              <div class="doc-rating-line">
                <span class="star">★ ${doc.rating.toFixed(2)}</span>
                <span class="text-muted">(${doc.reviewCount} verified reviews)</span>
                <span>•</span>
                <span class="badge badge-success">Next: ${escapeHtml(doc.nextAvailable)}</span>
              </div>
            </div>
          </div>

          <div class="doc-card-body">
            <div class="doc-detail-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${escapeHtml(doc.locations.join(", "))}</span>
            </div>

            <div class="doc-detail-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>Languages: <strong>${escapeHtml(doc.languages.join(", "))}</strong></span>
            </div>

            <div class="doc-detail-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span>Experience: <strong>${doc.experienceYears} Years Clinical Practice</strong></span>
            </div>

            <div class="doc-tags-list">
              ${doc.consultationTypes.map(t => `<span class="badge badge-neutral">${escapeHtml(t)}</span>`).join("")}
            </div>
          </div>

          <div class="doc-card-footer">
            <div class="doc-fee-box">
              <span class="fee-label">Consultation Fee</span>
              <span class="fee-amount">$${doc.consultationFee}</span>
            </div>
            <div class="doc-card-actions">
              <a href="doctor-profile.html?id=${doc.id}" class="btn btn-outline btn-sm">Full Profile</a>
              <a href="appointment.html?doctorId=${doc.id}" class="btn btn-primary btn-sm">Book Appointment</a>
            </div>
          </div>
        </article>
      `;
    });

    listContainer.innerHTML = html;
  },

  renderActiveFilters(container) {
    if (!container) return;

    const tags = [];

    if (this.state.searchQuery) {
      tags.push({ label: `Search: "${this.state.searchQuery}"`, key: "query" });
    }

    this.state.specialties.forEach(sp => {
      const dept = MEDICAL_DATA.departments.find(d => d.id === sp);
      tags.push({ label: dept ? dept.shortName : sp, key: "specialty", val: sp });
    });

    this.state.languages.forEach(lang => {
      tags.push({ label: `Language: ${lang}`, key: "language", val: lang });
    });

    this.state.locations.forEach(loc => {
      const shortLoc = loc.includes("Main") ? "Main Center" : (loc.includes("Westside") ? "Westside" : "North Suburban");
      tags.push({ label: shortLoc, key: "location", val: loc });
    });

    this.state.genders.forEach(g => {
      tags.push({ label: `Gender: ${g}`, key: "gender", val: g });
    });

    this.state.consultTypes.forEach(t => {
      tags.push({ label: t, key: "consultType", val: t });
    });

    this.state.availabilities.forEach(a => {
      tags.push({ label: `Available: ${a}`, key: "availability", val: a });
    });

    if (tags.length === 0) {
      container.innerHTML = "";
      return;
    }

    let html = `<span>Active Filters:</span>`;
    tags.forEach((tag, idx) => {
      html += `
        <span class="active-filter-tag">
          ${escapeHtml(tag.label)}
          <span class="active-filter-remove" onclick="DoctorsController.removeSpecificFilter('${tag.key}', '${tag.val || ''}')">&times;</span>
        </span>
      `;
    });

    html += `<button class="filter-reset-btn" onclick="DoctorsController.resetFilters()" style="margin-left:0.5rem;">Reset All</button>`;

    container.innerHTML = html;
  },

  removeSpecificFilter(key, val) {
    if (key === "query") {
      this.state.searchQuery = "";
      const searchInput = document.getElementById("doctorSearchInput");
      if (searchInput) searchInput.value = "";
    } else if (key === "specialty") {
      this.state.specialties = this.state.specialties.filter(s => s !== val);
    } else if (key === "language") {
      this.state.languages = this.state.languages.filter(l => l !== val);
    } else if (key === "location") {
      this.state.locations = this.state.locations.filter(loc => loc !== val);
    } else if (key === "gender") {
      this.state.genders = this.state.genders.filter(g => g !== val);
    } else if (key === "consultType") {
      this.state.consultTypes = this.state.consultTypes.filter(t => t !== val);
    } else if (key === "availability") {
      this.state.availabilities = this.state.availabilities.filter(a => a !== val);
    }

    this.syncCheckboxUI();
    this.render();
  }
};
