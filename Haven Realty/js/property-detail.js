/**
 * Haven Realty - Property Detail Page Controller
 * Handles dynamic property loading, fullscreen lightbox gallery, floor plans viewer,
 * embedded mortgage calculator pre-fill, inquiry submission, and appointment booking.
 */

let currentLightboxIndex = 0;
let currentPropertyImages = [];
let isZoomed = false;

document.addEventListener("DOMContentLoaded", () => {
  initPropertyDetailPage();
});

function initPropertyDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedId = urlParams.get("id");
  let property = HAVEN_PROPERTIES.find(p => p.id === requestedId);

  if (!property) {
    property = HAVEN_PROPERTIES[0];
    if (requestedId) {
      setTimeout(() => {
        showToast(`Requested residence ID "${requestedId}" was not found. Displaying flagship estate.`, "info", 5000);
      }, 400);
    }
  }

  // Update Breadcrumb
  const breadcrumbEl = document.getElementById("detail-breadcrumb-active");
  if (breadcrumbEl) breadcrumbEl.textContent = property.title;

  // Track recently viewed in localStorage
  HavenStorage.addRecentlyViewed(property.id);

  // Update Page Title
  document.title = `${property.title} | Haven Realty`;

  // Render All Detail Sections
  renderHeroAndGallery(property);
  renderHeaderAndSpecs(property);
  renderFeaturesAndAmenities(property);
  renderFloorPlans(property);
  renderDescription(property);
  renderLocationAndLandmarks(property);
  renderAgentCard(property);
  renderEmbeddedMortgageCalculator(property);
  renderSimilarProperties(property);

  // Initialize Fullscreen Lightbox
  initLightboxGallery(property.images);

  // Initialize Page Action Buttons (Save, Share, Print)
  initDetailPageActions(property);
}

// 1. Render Gallery (Large Main Feature + 4 Sub-thumbs)
function renderHeroAndGallery(prop) {
  const galleryGrid = document.getElementById("detail-gallery-container");
  if (!galleryGrid) return;

  currentPropertyImages = prop.images;

  const mainImg = prop.images[0];
  const secondaryImgs = prop.images.slice(1, 5);

  galleryGrid.innerHTML = `
    <div class="gallery-main-hero" onclick="openLightbox(0)">
      <img src="${mainImg}" alt="${prop.title} Feature View" />
      <div class="property-card-badges" style="top:1.5rem; left:1.5rem;">
        <span class="badge ${prop.status === 'for-rent' ? 'badge-rent' : 'badge-gold'}">
          ${prop.status === 'for-rent' ? 'For Lease' : 'For Sale'}
        </span>
        ${prop.featured ? `<span class="badge badge-dark">Curated Masterpiece</span>` : ''}
      </div>
    </div>
    <div class="gallery-thumbs-grid">
      ${secondaryImgs.map((img, idx) => `
        <div class="gallery-sub-thumb" onclick="openLightbox(${idx + 1})">
          <img src="${img}" alt="${prop.title} Gallery View ${idx + 2}" loading="lazy" />
        </div>
      `).join("")}
    </div>
    <button type="button" class="gallery-view-all-btn" onclick="openLightbox(0)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span>View All ${prop.images.length} Photographs</span>
    </button>
  `;
}

// 2. Render Header & Key Specifications
function renderHeaderAndSpecs(prop) {
  const titleEl = document.getElementById("detail-title");
  const taglineEl = document.getElementById("detail-tagline");
  const priceEl = document.getElementById("detail-price");
  const addressEl = document.getElementById("detail-address");
  const specsBar = document.getElementById("detail-specs-bar");

  if (titleEl) titleEl.textContent = prop.title;
  if (taglineEl) taglineEl.textContent = prop.tagline;
  if (priceEl) priceEl.textContent = prop.priceDisplay;
  if (addressEl) {
    addressEl.textContent = `${prop.location.address}, ${prop.location.neighborhood}, ${prop.location.city}, ${prop.location.state} ${prop.location.zip}`;
  }

  if (specsBar) {
    specsBar.innerHTML = `
      <div class="detail-spec-item">
        <span class="detail-spec-label">Interior Area</span>
        <span class="detail-spec-val">${formatNumber(prop.area)} <span style="font-size:0.8rem; font-weight:400;">Sq Ft</span></span>
      </div>
      <div class="detail-spec-item">
        <span class="detail-spec-label">Bedrooms</span>
        <span class="detail-spec-val">${prop.bedrooms > 0 ? prop.bedrooms : 'Commercial'}</span>
      </div>
      <div class="detail-spec-item">
        <span class="detail-spec-label">Bathrooms</span>
        <span class="detail-spec-val">${prop.bathrooms}</span>
      </div>
      <div class="detail-spec-item">
        <span class="detail-spec-label">Estate Grounds</span>
        <span class="detail-spec-val">${prop.lotSize}</span>
      </div>
      <div class="detail-spec-item">
        <span class="detail-spec-label">Year Built</span>
        <span class="detail-spec-val">${prop.yearBuilt}</span>
      </div>
      <div class="detail-spec-item">
        <span class="detail-spec-label">Price / Sq Ft</span>
        <span class="detail-spec-val">$${formatNumber(prop.pricePerSqFt)}</span>
      </div>
    `;
  }
}

// 3. Render Features & Curated Amenities Matrix
function renderFeaturesAndAmenities(prop) {
  const keyFeaturesList = document.getElementById("detail-key-features-list");
  const amenitiesList = document.getElementById("detail-amenities-list");

  if (keyFeaturesList) {
    keyFeaturesList.innerHTML = prop.keyFeatures.map(kf => `
      <li style="display:flex; align-items:flex-start; gap:0.75rem; font-size:0.98rem; margin-bottom:0.85rem; color:var(--color-text-secondary);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.5" style="flex-shrink:0; margin-top:2px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${kf}</span>
      </li>
    `).join("");
  }

  if (amenitiesList) {
    amenitiesList.innerHTML = prop.amenities.map(am => `
      <div style="display:flex; align-items:center; gap:0.6rem; padding:0.85rem 1rem; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-xs);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
        <span style="font-size:0.9rem; font-weight:600; color:var(--color-text-primary);">${am}</span>
      </div>
    `).join("");
  }
}

// 4. Render Architectural Floor Plans
function renderFloorPlans(prop) {
  const tabsContainer = document.getElementById("floorplan-tabs");
  const viewerContainer = document.getElementById("floorplan-viewer");

  if (!tabsContainer || !viewerContainer) return;

  tabsContainer.innerHTML = prop.floorPlans.map((fp, idx) => `
    <button type="button" class="btn btn-secondary btn-sm floorplan-tab-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
      ${fp.level}
    </button>
  `).join("");

  function updatePlanView(idx) {
    const plan = prop.floorPlans[idx];
    viewerContainer.innerHTML = `
      <div style="background-color:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-xs); padding:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--color-border-subtle); padding-bottom:1rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--color-text-primary); margin-bottom:0.25rem;">${plan.level}</h4>
            <p style="font-size:0.92rem; color:var(--color-text-secondary);">${plan.description}</p>
          </div>
          <div style="background-color:var(--color-gold-light); padding:0.5rem 1rem; border-radius:var(--radius-xs); font-weight:700; color:var(--color-gold-dark); font-size:0.9rem;">
            ${plan.dimensions}
          </div>
        </div>
        <!-- Architectural Floor Plan Blueprint Schematic SVG -->
        <div style="position:relative; width:100%; height:320px; background-color:#16191D; border-radius:var(--radius-xs); overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <svg width="100%" height="100%" viewBox="0 0 800 320" style="position:absolute; inset:0; opacity:0.85;">
            <defs>
              <pattern id="fp-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#2B3038" stroke-width="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fp-grid)" />
            <!-- Architectural Blueprint Vectors -->
            <rect x="100" y="40" width="600" height="240" fill="none" stroke="#C2A277" stroke-width="2" />
            <line x1="320" y1="40" x2="320" y2="280" stroke="#C2A277" stroke-width="1.5" />
            <line x1="520" y1="40" x2="520" y2="180" stroke="#C2A277" stroke-width="1.5" />
            <line x1="520" y1="180" x2="700" y2="180" stroke="#C2A277" stroke-width="1.5" />
            <text x="210" y="160" fill="#E8E4DD" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" text-anchor="middle" font-weight="600">GRAND SALON &amp; LOGGIA</text>
            <text x="420" y="150" fill="#E8E4DD" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" text-anchor="middle" font-weight="600">CHEF'S ATELIER</text>
            <text x="610" y="110" fill="#E8E4DD" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" text-anchor="middle" font-weight="600">PRIMARY WING</text>
            <text x="610" y="240" fill="#C2A277" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" text-anchor="middle" font-weight="600">WELLNESS SUITE</text>
          </svg>
        </div>
      </div>
    `;
  }

  updatePlanView(0);

  tabsContainer.querySelectorAll(".floorplan-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      tabsContainer.querySelectorAll(".floorplan-tab-btn").forEach(b => {
        b.classList.remove("active");
        b.style.backgroundColor = "transparent";
        b.style.borderColor = "var(--color-border)";
        b.style.color = "var(--color-text-primary)";
      });
      btn.classList.add("active");
      btn.style.backgroundColor = "var(--color-surface-dark)";
      btn.style.borderColor = "var(--color-surface-dark)";
      btn.style.color = "#FFFFFF";
      updatePlanView(parseInt(btn.dataset.idx, 10));
    });
  });
}

// 5. Render Editorial Description
function renderDescription(prop) {
  const descEl = document.getElementById("detail-description");
  if (descEl) {
    descEl.innerHTML = `
      <p style="font-size:1.15rem; line-height:1.8; color:var(--color-text-primary); margin-bottom:1.5rem; font-family:var(--font-serif);">
        ${prop.description}
      </p>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1.5rem; margin-top:2rem; padding:1.5rem; background:var(--color-surface-subtle); border-radius:var(--radius-xs);">
        <div>
          <strong style="display:block; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-gold-dark); margin-bottom:0.25rem;">Garage &amp; Motor Court</strong>
          <span style="font-size:0.95rem; color:var(--color-text-secondary);">${prop.garage}</span>
        </div>
        <div>
          <strong style="display:block; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-gold-dark); margin-bottom:0.25rem;">Association &amp; Maintenance</strong>
          <span style="font-size:0.95rem; color:var(--color-text-secondary);">$${formatNumber(prop.hoaMonthly)} / month</span>
        </div>
        <div>
          <strong style="display:block; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-gold-dark); margin-bottom:0.25rem;">Annual Property Tax (Est.)</strong>
          <span style="font-size:0.95rem; color:var(--color-text-secondary);">$${formatNumber(prop.propertyTaxesYearly)} / year</span>
        </div>
        <div>
          <strong style="display:block; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-gold-dark); margin-bottom:0.25rem;">Security &amp; Automation</strong>
          <span style="font-size:0.95rem; color:var(--color-text-secondary);">Crestron OS / Biometric Concierge</span>
        </div>
      </div>
    `;
  }
}

// 6. Render Location & Neighborhood Landmarks
function renderLocationAndLandmarks(prop) {
  const container = document.getElementById("detail-location-container");
  if (!container) return;

  const landmarks = [
    { title: "Private Aviation FBO", distance: "14 min drive", desc: "Signature Flight Support Jet Center" },
    { title: "Michelin 3-Star Dining", distance: "6 min drive", desc: "Private Tasting Rooms & Sommelier Cellars" },
    { title: "Deep-Water Yacht Harbor", distance: "9 min drive", desc: "Megayacht Berths & Private Sailing Club" },
    { title: "Elite Preparatory Academies", distance: "8 min drive", desc: "Premier International Curriculum" }
  ];

  container.innerHTML = `
    <div style="background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-xs); padding:2rem;">
      <div style="margin-bottom:1.5rem;">
        <h4 style="font-family:var(--font-serif); font-size:1.35rem; margin-bottom:0.35rem;">${prop.location.neighborhood} Enclave Profile</h4>
        <p style="color:var(--color-text-secondary); font-size:0.92rem;">
          Situated in ${prop.location.city}, this address offers supreme discretion, immediate access to private aviation, cultural centers, and world-class culinary experiences.
        </p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1.25rem;">
        ${landmarks.map(l => `
          <div style="padding:1rem; background:var(--color-bg); border-radius:var(--radius-xs); border:1px solid var(--color-border-subtle);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
              <strong style="font-size:0.9rem; color:var(--color-text-primary);">${l.title}</strong>
              <span style="font-size:0.75rem; font-weight:700; color:var(--color-gold-dark);">${l.distance}</span>
            </div>
            <span style="font-size:0.82rem; color:var(--color-text-muted);">${l.desc}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// 7. Render Listing Agent Card
function renderAgentCard(prop) {
  const agent = HAVEN_AGENTS.find(a => a.id === prop.agentId) || HAVEN_AGENTS[0];
  const container = document.getElementById("detail-agent-card-container");
  if (!container) return;

  container.innerHTML = `
    <div class="agent-card" style="position:sticky; top:calc(var(--header-height) + 1.5rem);">
      <div class="agent-card-img-wrap" style="aspect-ratio: 16 / 12;">
        <img src="${agent.image}" alt="${agent.name}" class="agent-card-img" />
      </div>
      <div class="agent-card-info">
        <span class="eyebrow" style="margin-bottom:0.25rem;">Exclusive Listing Partner</span>
        <h3 class="agent-card-name" style="font-size:1.5rem;">${agent.name}</h3>
        <div class="agent-card-title">${agent.title}</div>
        <p style="font-size:0.88rem; color:var(--color-text-secondary); margin-bottom:1.25rem; line-height:1.5;">
          ${agent.bio}
        </p>
        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem; font-size:0.88rem;">
          <a href="tel:${agent.phone}" style="display:flex; align-items:center; gap:0.5rem; color:var(--color-text-primary); font-weight:600;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>${agent.phone}</span>
          </a>
          <a href="mailto:${agent.email}" style="display:flex; align-items:center; gap:0.5rem; color:var(--color-text-secondary);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>${agent.email}</span>
          </a>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <button type="button" class="btn btn-gold" style="width:100%;" onclick="openAppointmentModal('${prop.id}', '${agent.id}')">
            Schedule Private Showing
          </button>
          <button type="button" class="btn btn-secondary" style="width:100%;" onclick="openInquiryModal('${prop.id}', 'Digital Dossier')">
            Request Architectural Dossier
          </button>
        </div>
      </div>
    </div>
  `;
}

// 8. Render Embedded Mortgage Calculator
function renderEmbeddedMortgageCalculator(prop) {
  const container = document.getElementById("detail-mortgage-widget");
  if (!container) return;

  const initialPrice = prop.price;
  const initialDown = Math.round(initialPrice * 0.20);
  const initialRate = 6.25;
  const initialYears = 30;

  container.innerHTML = `
    <div style="background-color:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-xs); padding:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="eyebrow" style="margin-bottom:0.25rem;">Asset Financial Modeler</span>
          <h4 style="font-family:var(--font-serif); font-size:1.4rem;">Mortgage &amp; Carrying Cost Estimator</h4>
        </div>
        <a href="mortgage-calculator.html?price=${initialPrice}" class="btn btn-secondary btn-sm">
          Full Amortization Model &rarr;
        </a>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:center;">
        <div>
          <div class="form-group">
            <label class="form-label" for="embed-price-input">Property Price ($)</label>
            <input type="number" id="embed-price-input" class="form-control" value="${initialPrice}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="embed-down-input">Down Payment (20% default)</label>
            <input type="number" id="embed-down-input" class="form-control" value="${initialDown}" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label" for="embed-rate-input">Interest Rate (%)</label>
              <input type="number" step="0.1" id="embed-rate-input" class="form-control" value="${initialRate}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="embed-term-select">Loan Term</label>
              <select id="embed-term-select" class="form-control">
                <option value="30">30 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
              </select>
            </div>
          </div>
        </div>

        <div style="background:var(--color-bg); padding:1.75rem; border-radius:var(--radius-xs); border:1px solid var(--color-border);">
          <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-text-muted);">Estimated Monthly Payment</span>
          <div id="embed-monthly-output" style="font-family:var(--font-serif); font-size:2.4rem; font-weight:600; color:var(--color-gold-dark); margin:0.35rem 0 1rem;">
            $0
          </div>
          <div style="font-size:0.85rem; color:var(--color-text-secondary); display:flex; flex-direction:column; gap:0.5rem; border-top:1px solid var(--color-border); padding-top:0.75rem;">
            <div style="display:flex; justify-content:space-between;">
              <span>Principal &amp; Interest:</span>
              <strong id="embed-pi-output">$0</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Estimated Tax &amp; Insurance:</span>
              <strong>$${formatNumber(Math.round((prop.propertyTaxesYearly || 36000) / 12))} / mo</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Total Loan Amount:</span>
              <strong id="embed-loan-output">$0</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Calculation Logic
  function calculateEmbedded() {
    const price = parseFloat(document.getElementById("embed-price-input")?.value) || 0;
    const down = parseFloat(document.getElementById("embed-down-input")?.value) || 0;
    const rate = parseFloat(document.getElementById("embed-rate-input")?.value) || 0;
    const termYears = parseInt(document.getElementById("embed-term-select")?.value, 10) || 30;

    const loanAmount = Math.max(0, price - down);
    const monthlyRate = (rate / 100) / 12;
    const totalMonths = termYears * 12;

    let monthlyPI = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPI = totalMonths > 0 ? loanAmount / totalMonths : 0;
    }

    const monthlyTaxes = Math.round((prop.propertyTaxesYearly || 36000) / 12);
    const totalMonthly = monthlyPI + monthlyTaxes;

    const monthlyOutEl = document.getElementById("embed-monthly-output");
    const piOutEl = document.getElementById("embed-pi-output");
    const loanOutEl = document.getElementById("embed-loan-output");

    if (monthlyOutEl) monthlyOutEl.textContent = formatPrice(Math.round(totalMonthly)) + " / mo";
    if (piOutEl) piOutEl.textContent = formatPrice(Math.round(monthlyPI));
    if (loanOutEl) loanOutEl.textContent = formatPrice(Math.round(loanAmount));
  }

  calculateEmbedded();

  ["embed-price-input", "embed-down-input", "embed-rate-input", "embed-term-select"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", calculateEmbedded);
    document.getElementById(id)?.addEventListener("change", calculateEmbedded);
  });
}

// 9. Render Similar Properties
function renderSimilarProperties(currentProp) {
  const container = document.getElementById("detail-similar-grid");
  if (!container) return;

  const similar = HAVEN_PROPERTIES.filter(p => p.id !== currentProp.id && (p.type === currentProp.type || Math.abs(p.price - currentProp.price) < 10000000)).slice(0, 3);
  
  if (similar.length === 0) {
    container.innerHTML = HAVEN_PROPERTIES.filter(p => p.id !== currentProp.id).slice(0, 3).map(p => renderPropertyCardHTML(p)).join("");
  } else {
    container.innerHTML = similar.map(p => renderPropertyCardHTML(p)).join("");
  }
}

// 10. Lightbox Gallery Controller (Fullscreen, zoom, thumbs, keyboard arrows)
function initLightboxGallery(images) {
  const modal = document.getElementById("lightbox-modal");
  const mainImg = document.getElementById("lightbox-main-img");
  const counterEl = document.getElementById("lightbox-counter");
  const thumbsContainer = document.getElementById("lightbox-thumbs");
  const prevBtn = document.getElementById("lightbox-prev-btn");
  const nextBtn = document.getElementById("lightbox-next-btn");
  const zoomBtn = document.getElementById("lightbox-zoom-btn");
  const closeBtn = document.getElementById("lightbox-close-btn");

  if (!modal || !mainImg) return;

  window.openLightbox = function(index) {
    currentLightboxIndex = index;
    isZoomed = false;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    updateLightbox();
  };

  window.closeLightbox = function() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    isZoomed = false;
    if (mainImg) mainImg.classList.remove("zoomed");
  };

  function updateLightbox() {
    if (currentLightboxIndex < 0) currentLightboxIndex = images.length - 1;
    if (currentLightboxIndex >= images.length) currentLightboxIndex = 0;

    mainImg.src = images[currentLightboxIndex];
    if (counterEl) counterEl.textContent = `Photograph ${currentLightboxIndex + 1} of ${images.length}`;

    if (thumbsContainer) {
      thumbsContainer.innerHTML = images.map((img, idx) => `
        <div class="lightbox-thumb-item ${idx === currentLightboxIndex ? 'active' : ''}" onclick="openLightbox(${idx})">
          <img src="${img}" alt="Thumbnail ${idx + 1}" />
        </div>
      `).join("");
    }
  }

  function prevImage() {
    currentLightboxIndex--;
    updateLightbox();
  }

  function nextImage() {
    currentLightboxIndex++;
    updateLightbox();
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    mainImg.classList.toggle("zoomed", isZoomed);
  }

  if (prevBtn) prevBtn.addEventListener("click", prevImage);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);
  if (closeBtn) closeBtn.addEventListener("click", window.closeLightbox);
  if (zoomBtn) zoomBtn.addEventListener("click", toggleZoom);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape, Z)
  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") window.closeLightbox();
    if (e.key.toLowerCase() === "z") toggleZoom();
  });
}

// 11. Detail Page Action Buttons (Save, Share, Compare, Print)
function initDetailPageActions(prop) {
  const saveBtn = document.getElementById("detail-save-btn");
  const compareBtn = document.getElementById("detail-compare-btn");
  const shareBtn = document.getElementById("detail-share-btn");
  const printBtn = document.getElementById("detail-print-btn");

  if (saveBtn) {
    const isFav = HavenStorage.isFavorite(prop.id);
    saveBtn.classList.toggle("active", isFav);

    saveBtn.addEventListener("click", () => {
      const added = HavenStorage.toggleFavorite(prop.id);
      saveBtn.classList.toggle("active", added);
      if (added) {
        showToast(`Saved "${prop.title}" to your curated portfolio`, "success");
      } else {
        showToast(`Removed "${prop.title}" from saved properties`, "info");
      }
    });
  }

  if (compareBtn) {
    const isComp = HavenStorage.isInCompare(prop.id);
    compareBtn.classList.toggle("compare-active", isComp);

    compareBtn.addEventListener("click", () => {
      if (HavenStorage.isInCompare(prop.id)) {
        HavenStorage.removeFromCompare(prop.id);
        compareBtn.classList.remove("compare-active");
        showToast(`Removed "${prop.title}" from comparison`, "info");
      } else {
        const res = HavenStorage.addToCompare(prop.id);
        if (res.success) {
          compareBtn.classList.add("compare-active");
          showToast(`Added "${prop.title}" to comparison (${res.list.length}/4)`, "success");
        } else {
          showToast("Maximum 4 properties can be compared simultaneously.", "warning");
        }
      }
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("Property link copied to confidential clipboard!", "success");
        });
      } else {
        showToast(`Sharable URL: ${window.location.href}`, "info");
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
