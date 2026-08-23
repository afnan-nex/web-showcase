/**
 * Haven Realty - Saved Properties & Comparison Matrix Controller
 * Manages favorites grid, comparison matrix table, difference highlighting, and tab switching.
 */

document.addEventListener("DOMContentLoaded", () => {
  initSavedAndCompareHub();
});

function initSavedAndCompareHub() {
  const tabFavBtn = document.getElementById("tab-btn-favorites");
  const tabCompBtn = document.getElementById("tab-btn-compare");
  const sectionFav = document.getElementById("section-favorites");
  const sectionComp = document.getElementById("section-compare");

  const favGrid = document.getElementById("saved-favorites-grid");
  const favEmpty = document.getElementById("saved-favorites-empty");
  const favCountHeader = document.getElementById("saved-favorites-count-header");

  const compTableContainer = document.getElementById("comparison-table-container");
  const compEmpty = document.getElementById("comparison-empty");
  const compCountHeader = document.getElementById("comparison-count-header");
  const highlightDiffToggle = document.getElementById("toggle-highlight-diffs");
  const clearCompareBtn = document.getElementById("clear-compare-btn");
  const addPropSelect = document.getElementById("compare-add-property-select");

  let highlightDiffsActive = false;

  // 1. Tab Switching & URL Hash Support
  function switchTab(tabName) {
    if (tabName === "compare") {
      tabCompBtn?.classList.add("active");
      tabFavBtn?.classList.remove("active");
      if (sectionComp) sectionComp.style.display = "block";
      if (sectionFav) sectionFav.style.display = "none";
      window.location.hash = "compare";
      renderCompareMatrix();
    } else {
      tabFavBtn?.classList.add("active");
      tabCompBtn?.classList.remove("active");
      if (sectionFav) sectionFav.style.display = "block";
      if (sectionComp) sectionComp.style.display = "none";
      window.location.hash = "favorites";
      renderFavoritesGrid();
    }
  }

  if (tabFavBtn) tabFavBtn.addEventListener("click", () => switchTab("favorites"));
  if (tabCompBtn) tabCompBtn.addEventListener("click", () => switchTab("compare"));

  // Check initial hash
  if (window.location.hash === "#compare") {
    switchTab("compare");
  } else {
    switchTab("favorites");
  }

  // 2. Render Saved Favorites Grid
  function renderFavoritesGrid() {
    const favIds = HavenStorage.getFavorites();
    const favProps = favIds.map(id => HAVEN_PROPERTIES.find(p => p.id === id)).filter(Boolean);

    if (favCountHeader) favCountHeader.textContent = `(${favProps.length})`;

    if (favProps.length === 0) {
      if (favGrid) favGrid.innerHTML = "";
      if (favEmpty) favEmpty.style.display = "block";
      return;
    }

    if (favEmpty) favEmpty.style.display = "none";
    if (favGrid) {
      favGrid.innerHTML = favProps.map(p => renderPropertyCardHTML(p)).join("");
    }
  }

  // 3. Render Comparison Matrix
  function renderCompareMatrix() {
    const compIds = HavenStorage.getCompare();
    const compProps = compIds.map(id => HAVEN_PROPERTIES.find(p => p.id === id)).filter(Boolean);

    if (compCountHeader) compCountHeader.textContent = `(${compProps.length}/4)`;

    // Populate Add Property dropdown with non-compared properties
    if (addPropSelect) {
      const available = HAVEN_PROPERTIES.filter(p => !compIds.includes(p.id));
      addPropSelect.innerHTML = `<option value="">+ Add Property to Compare (${4 - compProps.length} slots left)</option>` +
        available.map(p => `<option value="${p.id}">${p.title} — ${p.priceDisplay}</option>`).join("");
      addPropSelect.disabled = compProps.length >= 4;
    }

    if (compProps.length === 0) {
      if (compTableContainer) compTableContainer.innerHTML = "";
      if (compEmpty) compEmpty.style.display = "block";
      return;
    }

    if (compEmpty) compEmpty.style.display = "none";

    // All available unique amenities
    const allAmenitiesList = [
      "Swimming Pool",
      "Ocean View",
      "Private Elevator",
      "Wine Cellar",
      "Wellness Spa",
      "Helipad",
      "Tennis Court",
      "Smart Home",
      "Garage",
      "Concierge",
      "Fireplace",
      "Security System"
    ];

    // Helper to check if values in a row are different
    function isDifferent(values) {
      if (values.length <= 1) return false;
      return new Set(values).size > 1;
    }

    const priceDiff = isDifferent(compProps.map(p => p.price));
    const typeDiff = isDifferent(compProps.map(p => p.type));
    const bedsDiff = isDifferent(compProps.map(p => p.bedrooms));
    const bathsDiff = isDifferent(compProps.map(p => p.bathrooms));
    const areaDiff = isDifferent(compProps.map(p => p.area));
    const lotDiff = isDifferent(compProps.map(p => p.lotSize));
    const yearDiff = isDifferent(compProps.map(p => p.yearBuilt));
    const hoaDiff = isDifferent(compProps.map(p => p.hoaMonthly));
    const taxDiff = isDifferent(compProps.map(p => p.propertyTaxesYearly));

    const diffClass = (diff) => (highlightDiffsActive && diff) ? "highlight-diff" : "";

    let html = `
      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th style="vertical-align:bottom; padding-bottom:1.5rem;">
                <div style="font-size:1.1rem; font-family:var(--font-serif); margin-bottom:0.4rem;">Residence Comparison</div>
                <div style="font-size:0.75rem; color:var(--color-text-muted); font-weight:normal;">Side-by-side architectural analysis</div>
              </th>
              ${compProps.map(p => `
                <td style="width:${Math.max(220, 100 / (compProps.length + 1))}%; vertical-align:top;">
                  <div class="compare-card-header">
                    <button type="button" class="compare-remove-btn" onclick="removeCompareProp('${p.id}')" title="Remove column">&times;</button>
                    <div style="aspect-ratio:16/10; border-radius:var(--radius-xs); overflow:hidden; margin-bottom:0.75rem;">
                      <img src="${p.images[0]}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;" />
                    </div>
                    <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:0.25rem;">
                      <a href="property-detail.html?id=${p.id}">${p.title}</a>
                    </h4>
                    <div style="font-size:0.8rem; color:var(--color-text-secondary); margin-bottom:0.5rem;">
                      ${p.location.neighborhood}, ${p.location.city}
                    </div>
                    <div style="font-family:var(--font-serif); font-size:1.35rem; font-weight:600; color:var(--color-gold-dark);">
                      ${p.priceDisplay}
                    </div>
                  </div>
                </td>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            <tr class="${diffClass(priceDiff)}">
              <th>Price / Sq Ft</th>
              ${compProps.map(p => `<td><strong>$${formatNumber(p.pricePerSqFt)}</strong></td>`).join("")}
            </tr>
            <tr class="${diffClass(typeDiff)}">
              <th>Architecture &amp; Type</th>
              ${compProps.map(p => `<td><span style="text-transform:capitalize;">${p.type}</span></td>`).join("")}
            </tr>
            <tr class="${diffClass(bedsDiff)}">
              <th>Bedrooms</th>
              ${compProps.map(p => `<td>${p.bedrooms > 0 ? p.bedrooms + ' Beds' : 'Commercial'}</td>`).join("")}
            </tr>
            <tr class="${diffClass(bathsDiff)}">
              <th>Bathrooms</th>
              ${compProps.map(p => `<td>${p.bathrooms} Baths</td>`).join("")}
            </tr>
            <tr class="${diffClass(areaDiff)}">
              <th>Interior Footprint</th>
              ${compProps.map(p => `<td>${formatNumber(p.area)} Sq Ft</td>`).join("")}
            </tr>
            <tr class="${diffClass(lotDiff)}">
              <th>Lot / Grounds</th>
              ${compProps.map(p => `<td>${p.lotSize}</td>`).join("")}
            </tr>
            <tr class="${diffClass(yearDiff)}">
              <th>Year Built</th>
              ${compProps.map(p => `<td>${p.yearBuilt}</td>`).join("")}
            </tr>
            <tr class="${diffClass(hoaDiff)}">
              <th>Monthly HOA / Maintenance</th>
              ${compProps.map(p => `<td>$${formatNumber(p.hoaMonthly)} / mo</td>`).join("")}
            </tr>
            <tr class="${diffClass(taxDiff)}">
              <th>Annual Property Tax</th>
              ${compProps.map(p => `<td>$${formatNumber(p.propertyTaxesYearly)} / yr</td>`).join("")}
            </tr>
            <tr>
              <th>Garage &amp; Motor Court</th>
              ${compProps.map(p => `<td>${p.garage}</td>`).join("")}
            </tr>
            <tr>
              <th colspan="${compProps.length + 1}" style="background:var(--color-surface-subtle); text-transform:uppercase; letter-spacing:0.08em; font-size:0.75rem; color:var(--color-gold-dark);">
                Curated Amenities Matrix
              </th>
            </tr>
            ${allAmenitiesList.map(am => {
              const amDiff = isDifferent(compProps.map(p => p.amenities.includes(am)));
              return `
                <tr class="${diffClass(amDiff)}">
                  <th>${am}</th>
                  ${compProps.map(p => {
                    const has = p.amenities.includes(am);
                    return `
                      <td>
                        ${has ? `<span style="color:var(--color-success); font-weight:bold; font-size:1.1rem;">&#10003; Included</span>` : `<span style="color:var(--color-text-muted); font-size:0.9rem;">&mdash;</span>`}
                      </td>
                    `;
                  }).join("")}
                </tr>
              `;
            }).join("")}
            <tr>
              <th>Actions</th>
              ${compProps.map(p => `
                <td>
                  <a href="property-detail.html?id=${p.id}" class="btn btn-primary btn-sm" style="width:100%; margin-bottom:0.5rem;">View Residence</a>
                  <button type="button" class="btn btn-secondary btn-sm" style="width:100%;" onclick="openAppointmentModal('${p.id}', '${p.agentId}')">Book Showing</button>
                </td>
              `).join("")}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    if (compTableContainer) compTableContainer.innerHTML = html;
  }

  // Window handler for removing comparison item
  window.removeCompareProp = function(propId) {
    HavenStorage.removeFromCompare(propId);
    renderCompareMatrix();
  };

  // Add Property to Compare Select
  if (addPropSelect) {
    addPropSelect.addEventListener("change", () => {
      const selectedId = addPropSelect.value;
      if (!selectedId) return;

      const res = HavenStorage.addToCompare(selectedId);
      if (res.success) {
        showToast("Added property to comparison matrix", "success");
        renderCompareMatrix();
      } else {
        showToast("Cannot add property to comparison.", "warning");
      }
    });
  }

  // Highlight Differences Toggle
  if (highlightDiffToggle) {
    highlightDiffToggle.addEventListener("click", () => {
      highlightDiffsActive = !highlightDiffsActive;
      highlightDiffToggle.classList.toggle("btn-gold", highlightDiffsActive);
      highlightDiffToggle.classList.toggle("btn-secondary", !highlightDiffsActive);
      highlightDiffToggle.textContent = highlightDiffsActive ? "Highlighting Differences (Active)" : "Highlight Differences";
      renderCompareMatrix();
    });
  }

  // Clear Compare Queue
  if (clearCompareBtn) {
    clearCompareBtn.addEventListener("click", () => {
      HavenStorage.clearCompare();
      showToast("Cleared comparison matrix", "info");
      renderCompareMatrix();
    });
  }

  // Listen to external state changes
  window.addEventListener("favorites-updated", () => {
    if (sectionFav && sectionFav.style.display !== "none") renderFavoritesGrid();
  });
  window.addEventListener("compare-updated", () => {
    if (sectionComp && sectionComp.style.display !== "none") renderCompareMatrix();
  });
}
