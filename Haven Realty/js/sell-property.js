/**
 * Haven Realty - Sell Property & Instant Valuation Estimator
 * Handles multi-step form navigation, dynamic valuation calculation, and seller request persistence.
 */

document.addEventListener("DOMContentLoaded", () => {
  initSellPropertyWizard();
});

function initSellPropertyWizard() {
  const steps = [
    document.getElementById("step-1"),
    document.getElementById("step-2"),
    document.getElementById("step-3"),
    document.getElementById("step-4")
  ];

  const stepIndicators = document.querySelectorAll(".wizard-step-indicator");
  const nextBtns = document.querySelectorAll(".wizard-next-btn");
  const prevBtns = document.querySelectorAll(".wizard-prev-btn");
  const form = document.getElementById("sell-property-form");

  // Form Inputs for Valuation Engine
  const locationSelect = document.getElementById("sell-location");
  const typeSelect = document.getElementById("sell-type");
  const sqftInput = document.getElementById("sell-sqft");
  const bedsSelect = document.getElementById("sell-beds");
  const bathsSelect = document.getElementById("sell-baths");
  const conditionSelect = document.getElementById("sell-condition");
  const amenityCheckboxes = document.querySelectorAll(".sell-amenity-checkbox");

  // Valuation Output Elements (Step 3)
  const valRangeMinEl = document.getElementById("val-range-min");
  const valRangeMaxEl = document.getElementById("val-range-max");
  const valAverageEl = document.getElementById("val-average");
  const valPricePerSqFtEl = document.getElementById("val-psqft");

  let currentStepIndex = 0;

  function showStep(index) {
    if (index < 0 || index >= steps.length) return;
    currentStepIndex = index;

    steps.forEach((step, idx) => {
      if (step) step.style.display = idx === index ? "block" : "none";
    });

    stepIndicators.forEach((ind, idx) => {
      ind.classList.toggle("active", idx === index);
      ind.classList.toggle("completed", idx < index);
    });

    // If moving into Step 3, calculate the valuation estimate!
    if (index === 2) {
      computeValuationEstimate();
    }

    window.scrollTo({ top: 150, behavior: "smooth" });
  }

  // 1. Dynamic Valuation Engine
  function computeValuationEstimate() {
    const loc = locationSelect ? locationSelect.value : "Beverly Hills";
    const type = typeSelect ? typeSelect.value : "villa";
    const sqft = parseFloat(sqftInput?.value) || 5000;
    const condition = conditionSelect ? conditionSelect.value : "mint";
    
    // Base price per sq ft by prime location tier
    let basePSqFt = 1800;
    if (loc === "Beverly Hills") basePSqFt = 2300;
    else if (loc === "Tribeca & SoHo") basePSqFt = 3400;
    else if (loc === "Palm Beach & Miami") basePSqFt = 2600;
    else if (loc === "Aspen") basePSqFt = 2200;
    else if (loc === "Mayfair London") basePSqFt = 2800;
    else if (loc === "Lake Como") basePSqFt = 2100;

    // Type multiplier
    let typeMult = 1.0;
    if (type === "penthouse") typeMult = 1.25;
    if (type === "waterfront") typeMult = 1.35;
    if (type === "villa") typeMult = 1.15;

    // Condition multiplier
    let condMult = 1.0;
    if (condition === "new") condMult = 1.2;
    if (condition === "mint") condMult = 1.05;
    if (condition === "renovation") condMult = 0.85;

    // Count checked luxury amenities (each adds +2.5% premium)
    const checkedCount = Array.from(amenityCheckboxes).filter(cb => cb.checked).length;
    const amenityMult = 1 + (checkedCount * 0.025);

    const calculatedPSqFt = Math.round(basePSqFt * typeMult * condMult * amenityMult);
    const estimatedMid = Math.round(sqft * calculatedPSqFt);
    const estimatedMin = Math.round(estimatedMid * 0.93);
    const estimatedMax = Math.round(estimatedMid * 1.08);

    if (valRangeMinEl) valRangeMinEl.textContent = formatPrice(estimatedMin);
    if (valRangeMaxEl) valRangeMaxEl.textContent = formatPrice(estimatedMax);
    if (valAverageEl) valAverageEl.textContent = formatPrice(estimatedMid);
    if (valPricePerSqFtEl) valPricePerSqFtEl.textContent = `$${formatNumber(calculatedPSqFt)} / sq ft`;
  }

  // 2. Navigation Button Listeners
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Basic validation for Step 1
      if (currentStepIndex === 0) {
        const address = document.getElementById("sell-address")?.value;
        if (!address) {
          showToast("Please provide the property address before proceeding.", "warning");
          return;
        }
      }
      showStep(currentStepIndex + 1);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      showStep(currentStepIndex - 1);
    });
  });

  // 3. Final Submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const sellerName = document.getElementById("sell-name")?.value;
      const sellerEmail = document.getElementById("sell-email")?.value;
      const sellerPhone = document.getElementById("sell-phone")?.value;
      const address = document.getElementById("sell-address")?.value;
      const timeline = document.getElementById("sell-timeline")?.value;
      const notes = document.getElementById("sell-notes")?.value;

      const record = HavenStorage.saveSellerValuation({
        sellerName,
        sellerEmail,
        sellerPhone,
        address,
        location: locationSelect?.value,
        propertyType: typeSelect?.value,
        sqft: sqftInput?.value,
        timeline,
        notes,
        estimatedValuation: valAverageEl ? valAverageEl.textContent : "Pending Review"
      });

      // Show Confirmation Modal / Card
      const confirmationModal = document.getElementById("valuation-success-modal");
      const refIdEl = document.getElementById("valuation-ref-id");
      if (refIdEl) refIdEl.textContent = `#${record.id}`;
      if (confirmationModal) confirmationModal.classList.add("open");

      showToast(`Valuation application #${record.id} submitted! A managing director will contact you.`, "success", 6000);
      form.reset();
    });
  }

  showStep(0);
}
