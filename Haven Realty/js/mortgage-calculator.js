/**
 * Haven Realty - Advanced Mortgage & Financial Modeler
 * Computes monthly carrying costs, SVG donut breakdown, and full amortization schedule.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMortgageCalculator();
});

function initMortgageCalculator() {
  const propSelect = document.getElementById("mc-property-select");
  const priceInput = document.getElementById("mc-price");
  const priceSlider = document.getElementById("mc-price-slider");
  const downDollarInput = document.getElementById("mc-down-dollar");
  const downPercentInput = document.getElementById("mc-down-percent");
  const downPercentSlider = document.getElementById("mc-down-percent-slider");
  const termButtons = document.querySelectorAll(".mc-term-btn");
  const rateInput = document.getElementById("mc-rate");
  const rateSlider = document.getElementById("mc-rate-slider");
  const taxInput = document.getElementById("mc-tax");
  const insuranceInput = document.getElementById("mc-insurance");
  const hoaInput = document.getElementById("mc-hoa");

  // Output Elements
  const totalMonthlyEl = document.getElementById("mc-total-monthly-output");
  const loanAmountEl = document.getElementById("mc-loan-amount-output");
  const totalInterestEl = document.getElementById("mc-total-interest-output");
  const totalRepaymentEl = document.getElementById("mc-total-repayment-output");
  const payoffDateEl = document.getElementById("mc-payoff-date-output");
  const piMonthlyEl = document.getElementById("mc-pi-monthly");
  const taxMonthlyEl = document.getElementById("mc-tax-monthly");
  const insMonthlyEl = document.getElementById("mc-ins-monthly");
  const hoaMonthlyEl = document.getElementById("mc-hoa-monthly");
  const pmiMonthlyEl = document.getElementById("mc-pmi-monthly");

  const chartSvg = document.getElementById("mc-chart-svg");
  const amortizationTbody = document.getElementById("mc-amortization-tbody");
  const exportCsvBtn = document.getElementById("mc-export-csv-btn");

  let selectedTermYears = 30;

  // 1. Populate Property Quick Presets Dropdown
  if (propSelect) {
    propSelect.innerHTML = `<option value="">-- Or Select from Haven Estates --</option>` +
      HAVEN_PROPERTIES.map(p => `<option value="${p.id}">${p.title} (${p.priceDisplay})</option>`).join("");

    propSelect.addEventListener("change", () => {
      const propId = propSelect.value;
      if (!propId) return;
      const p = HAVEN_PROPERTIES.find(item => item.id === propId);
      if (p) {
        priceInput.value = p.price;
        priceSlider.value = p.price;
        downPercentSlider.value = 20;
        downPercentInput.value = 20;
        taxInput.value = p.propertyTaxesYearly || Math.round(p.price * 0.008);
        hoaInput.value = p.hoaMonthly || 0;
        calculateMortgage();
        showToast(`Loaded financial parameters for "${p.title}"`, "info");
      }
    });
  }

  // 2. Check URL Parameter for price
  const params = new URLSearchParams(window.location.search);
  if (params.has("price")) {
    const p = parseFloat(params.get("price"));
    if (p > 0) {
      priceInput.value = p;
      priceSlider.value = Math.min(p, 50000000);
    }
  }

  // 3. Term Selection
  termButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      termButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTermYears = parseInt(btn.dataset.term, 10);
      calculateMortgage();
    });
  });

  // 4. Main Calculator Function
  function calculateMortgage() {
    let price = parseFloat(priceInput.value) || 0;
    let downPercent = parseFloat(downPercentInput.value) || 0;
    let downDollar = Math.round(price * (downPercent / 100));
    downDollarInput.value = downDollar;

    let rate = parseFloat(rateInput.value) || 0;
    let annualTaxes = parseFloat(taxInput.value) || 0;
    let annualIns = parseFloat(insuranceInput.value) || 0;
    let monthlyHoa = parseFloat(hoaInput.value) || 0;

    let loanAmount = Math.max(0, price - downDollar);
    let monthlyRate = (rate / 100) / 12;
    let totalMonths = selectedTermYears * 12;

    let monthlyPI = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPI = totalMonths > 0 ? loanAmount / totalMonths : 0;
    }

    let monthlyTax = annualTaxes / 12;
    let monthlyIns = annualIns / 12;
    // PMI if down payment is under 20%
    let monthlyPMI = downPercent < 20 ? (loanAmount * 0.007) / 12 : 0;

    let totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyHoa + monthlyPMI;
    let totalRepayment = (monthlyPI * totalMonths) + downDollar;
    let totalInterest = Math.max(0, (monthlyPI * totalMonths) - loanAmount);

    // Payoff Date
    const payoff = new Date();
    payoff.setFullYear(payoff.getFullYear() + selectedTermYears);
    const payoffMonthName = payoff.toLocaleString("en-US", { month: "long" });
    const payoffYear = payoff.getFullYear();

    // Render Summary Numbers
    if (totalMonthlyEl) totalMonthlyEl.textContent = formatPrice(Math.round(totalMonthly)) + " / mo";
    if (loanAmountEl) loanAmountEl.textContent = formatPrice(Math.round(loanAmount));
    if (totalInterestEl) totalInterestEl.textContent = formatPrice(Math.round(totalInterest));
    if (totalRepaymentEl) totalRepaymentEl.textContent = formatPrice(Math.round(totalRepayment));
    if (payoffDateEl) payoffDateEl.textContent = `${payoffMonthName} ${payoffYear}`;

    if (piMonthlyEl) piMonthlyEl.textContent = formatPrice(Math.round(monthlyPI));
    if (taxMonthlyEl) taxMonthlyEl.textContent = formatPrice(Math.round(monthlyTax));
    if (insMonthlyEl) insMonthlyEl.textContent = formatPrice(Math.round(monthlyIns));
    if (hoaMonthlyEl) hoaMonthlyEl.textContent = formatPrice(Math.round(monthlyHoa));
    if (pmiMonthlyEl) {
      pmiMonthlyEl.textContent = formatPrice(Math.round(monthlyPMI));
      pmiMonthlyEl.parentElement.style.display = monthlyPMI > 0 ? "flex" : "none";
    }

    // Render SVG Donut Chart
    renderDonutChart(monthlyPI, monthlyTax, monthlyIns, monthlyHoa, monthlyPMI);

    // Render Amortization Schedule
    renderAmortizationSchedule(loanAmount, monthlyRate, monthlyPI, selectedTermYears);
  }

  // 5. Render SVG Donut Breakdown Chart
  function renderDonutChart(pi, tax, ins, hoa, pmi) {
    if (!chartSvg) return;
    const total = pi + tax + ins + hoa + pmi;
    if (total <= 0) return;

    const data = [
      { name: "Principal & Interest", value: pi, color: "#C2A277" },
      { name: "Property Tax", value: tax, color: "#121417" },
      { name: "Home Insurance", value: ins, color: "#585A5C" },
      { name: "HOA / Maintenance", value: hoa, color: "#8C6F47" },
      { name: "PMI", value: pmi, color: "#C0392B" }
    ].filter(d => d.value > 0);

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    let circles = data.map(d => {
      const fraction = d.value / total;
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += fraction * circumference;

      return `
        <circle cx="100" cy="100" r="${radius}" fill="none" stroke="${d.color}" stroke-width="26"
          stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}"
          style="transition: stroke-dasharray 0.5s ease;" />
      `;
    }).join("");

    chartSvg.innerHTML = `
      <g transform="rotate(-90 100 100)">
        ${circles}
      </g>
      <text x="100" y="96" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="22" font-weight="600" fill="#121417">
        ${Math.round((pi / total) * 100)}%
      </text>
      <text x="100" y="112" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="600" letter-spacing="0.08em" fill="#888682">
        PRINCIPAL &amp; INT
      </text>
    `;
  }

  // 6. Generate Annual Amortization Table
  let currentScheduleRows = [];

  function renderAmortizationSchedule(principal, monthlyRate, monthlyPI, termYears) {
    if (!amortizationTbody) return;

    let balance = principal;
    let totalInterestPaid = 0;
    currentScheduleRows = [];
    const currentYear = new Date().getFullYear();

    for (let year = 1; year <= termYears; year++) {
      let annualPrincipal = 0;
      let annualInterest = 0;

      for (let month = 1; month <= 12; month++) {
        if (balance <= 0) break;
        let interestPayment = balance * monthlyRate;
        let principalPayment = monthlyPI - interestPayment;

        if (principalPayment > balance) {
          principalPayment = balance;
        }

        annualInterest += interestPayment;
        annualPrincipal += principalPayment;
        balance -= principalPayment;
      }

      totalInterestPaid += annualInterest;

      currentScheduleRows.push({
        year: currentYear + year,
        startBalance: balance + annualPrincipal,
        principal: annualPrincipal,
        interest: annualInterest,
        totalInterest: totalInterestPaid,
        endBalance: Math.max(0, balance)
      });
    }

    amortizationTbody.innerHTML = currentScheduleRows.map(row => `
      <tr>
        <td style="font-weight:600;">Year ${row.year}</td>
        <td>$${formatNumber(Math.round(row.startBalance))}</td>
        <td style="color:var(--color-success); font-weight:600;">+$${formatNumber(Math.round(row.principal))}</td>
        <td style="color:var(--color-danger);">$${formatNumber(Math.round(row.interest))}</td>
        <td>$${formatNumber(Math.round(row.totalInterest))}</td>
        <td style="font-weight:700;">$${formatNumber(Math.round(row.endBalance))}</td>
      </tr>
    `).join("");
  }

  // 7. Export Amortization Table to CSV
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", () => {
      if (currentScheduleRows.length === 0) return;
      let csv = "Year,Starting Balance,Principal Paid,Interest Paid,Total Interest to Date,Ending Balance\n";
      currentScheduleRows.forEach(r => {
        csv += `${r.year},${Math.round(r.startBalance)},${Math.round(r.principal)},${Math.round(r.interest)},${Math.round(r.totalInterest)},${Math.round(r.endBalance)}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `haven-amortization-schedule.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Amortization Schedule exported to CSV!", "success");
    });
  }

  // 8. Event Listeners for Two-Way Inputs & Sliders
  // Price syncing
  if (priceInput && priceSlider) {
    priceInput.addEventListener("input", () => {
      priceSlider.value = priceInput.value;
      calculateMortgage();
    });
    priceSlider.addEventListener("input", () => {
      priceInput.value = priceSlider.value;
      calculateMortgage();
    });
  }

  // Down Payment Dollar & Percent Syncing
  if (downDollarInput) {
    downDollarInput.addEventListener("input", () => {
      const price = parseFloat(priceInput.value) || 1;
      const dollar = parseFloat(downDollarInput.value) || 0;
      const pct = Math.min(100, Math.max(0, Math.round((dollar / price) * 100)));
      downPercentInput.value = pct;
      downPercentSlider.value = pct;
      calculateMortgage();
    });
  }

  if (downPercentInput && downPercentSlider) {
    downPercentInput.addEventListener("input", () => {
      downPercentSlider.value = downPercentInput.value;
      calculateMortgage();
    });
    downPercentSlider.addEventListener("input", () => {
      downPercentInput.value = downPercentSlider.value;
      calculateMortgage();
    });
  }

  // Rate Syncing
  if (rateInput && rateSlider) {
    rateInput.addEventListener("input", () => {
      rateSlider.value = rateInput.value;
      calculateMortgage();
    });
    rateSlider.addEventListener("input", () => {
      rateInput.value = rateSlider.value;
      calculateMortgage();
    });
  }

  // Taxes, Insurance, HOA inputs
  [taxInput, insuranceInput, hoaInput].forEach(inp => {
    if (inp) inp.addEventListener("input", calculateMortgage);
  });

  // Initial Calculation
  calculateMortgage();
}
