/**
 * Atlas Academy - Pricing Page Controller
 */

let activeBillingCycle = "annual";
let selectedPlan = null;

document.addEventListener("DOMContentLoaded", () => {
  renderPricingCards();
  renderFaqAccordion();
});

function setBillingCycle(cycle) {
  activeBillingCycle = cycle;

  const annualBtn = document.getElementById("billing-annual-btn");
  const monthlyBtn = document.getElementById("billing-monthly-btn");

  if (cycle === "annual") {
    if (annualBtn) {
      annualBtn.className = "btn btn-sm btn-primary";
    }
    if (monthlyBtn) {
      monthlyBtn.className = "btn btn-sm btn-ghost";
    }
  } else {
    if (annualBtn) {
      annualBtn.className = "btn btn-sm btn-ghost";
    }
    if (monthlyBtn) {
      monthlyBtn.className = "btn btn-sm btn-primary";
    }
  }

  renderPricingCards();
}

function renderPricingCards() {
  const container = document.getElementById("pricing-plans-grid");
  if (!container || !window.ATLAS_DATA) return;

  container.innerHTML = ATLAS_DATA.pricingPlans.map(plan => {
    const price = activeBillingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
    const isPro = plan.id === "plan-pro";

    return `
      <div class="card" style="padding: 36px 32px; display: flex; flex-direction: column; position: relative; ${isPro ? 'border-color: var(--accent-primary); box-shadow: var(--shadow-glow); background: linear-gradient(180deg, #161d2f 0%, #101522 100%); transform: translateY(-6px);' : ''}">
        ${plan.badge ? `
          <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%);">
            <span class="badge badge-accent" style="font-weight: 700; padding: 4px 14px;">${plan.badge}</span>
          </div>
        ` : ''}

        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 1.35rem; margin-bottom: 8px;">${plan.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; min-height: 40px;">${plan.subtitle}</p>
        </div>

        <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: baseline; gap: 4px;">
            <span style="font-family: var(--font-mono); font-size: 2.75rem; font-weight: 800; color: var(--text-primary);">$${price}</span>
            <span style="font-size: 0.9rem; color: var(--text-muted); font-family: var(--font-mono);">/ month</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono);">
            ${activeBillingCycle === 'annual' ? plan.billingNote : 'Billed monthly, cancel anytime'}
          </div>
        </div>

        <!-- Features List -->
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; flex-grow: 1;">
          ${plan.features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; color: var(--text-primary); line-height: 1.45;">
              <span style="color: ${isPro ? 'var(--accent-primary)' : 'var(--accent-success)'}; margin-top: 1px;">
                ${ATLAS_ICONS.check}
              </span>
              <span>${f}</span>
            </li>
          `).join("")}
        </ul>

        <button class="btn ${isPro ? 'btn-accent' : 'btn-outline'} btn-lg w-full" onclick="openCheckoutModal('${plan.id}')">
          ${plan.ctaText}
        </button>
      </div>
    `;
  }).join("");
}

function renderFaqAccordion() {
  const container = document.getElementById("faq-accordion-container");
  if (!container || !window.ATLAS_DATA) return;

  container.innerHTML = ATLAS_DATA.faqs.map((faq, idx) => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
      <button style="width: 100%; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; text-align: left; font-weight: 600; font-size: 1rem; color: var(--text-primary); cursor: pointer;" onclick="toggleFaq(${idx})">
        <span>${faq.question}</span>
        <span id="faq-arrow-${idx}" style="color: var(--text-muted); transition: transform 0.2s; margin-left: 16px;">▼</span>
      </button>
      <div id="faq-body-${idx}" style="display: none; padding: 0 24px 20px; color: var(--text-secondary); font-size: 0.925rem; line-height: 1.65; border-top: 1px solid var(--border-subtle);">
        ${faq.answer}
      </div>
    </div>
  `).join("");
}

function toggleFaq(idx) {
  const body = document.getElementById(`faq-body-${idx}`);
  const arrow = document.getElementById(`faq-arrow-${idx}`);
  if (body) {
    if (body.style.display === "none") {
      body.style.display = "block";
      if (arrow) arrow.style.transform = "rotate(180deg)";
    } else {
      body.style.display = "none";
      if (arrow) arrow.style.transform = "rotate(0deg)";
    }
  }
}

function openCheckoutModal(planId) {
  selectedPlan = ATLAS_DATA.pricingPlans.find(p => p.id === planId) || ATLAS_DATA.pricingPlans[1];
  const modal = document.getElementById("checkout-modal");
  const planTitle = document.getElementById("checkout-plan-title");
  const summaryName = document.getElementById("checkout-summary-name");
  const summaryPrice = document.getElementById("checkout-summary-price");

  const price = activeBillingCycle === "annual" ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;

  if (planTitle) planTitle.textContent = `Activate ${selectedPlan.name}`;
  if (summaryName) summaryName.textContent = selectedPlan.name;
  if (summaryPrice) summaryPrice.textContent = `$${price} / month (${activeBillingCycle})`;

  if (modal) modal.classList.add("open");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) modal.classList.remove("open");
}

function confirmSubscription() {
  closeCheckoutModal();
  window.AtlasToast.show({
    title: "Membership Activated!",
    message: `Welcome to ${selectedPlan?.name || "Atlas Pro"}. All course materials and diplomas are unlocked.`,
    type: "gold",
    duration: 5000
  });

  // Automatically enroll user in courses for an immediate all-access experience
  if (window.atlasState && selectedPlan?.id === "plan-pro") {
    ATLAS_DATA.courses.forEach(c => {
      window.atlasState.enrollCourse(c.id);
    });
  }

  setTimeout(() => {
    window.location.href = "student-dashboard.html";
  }, 1200);
}
