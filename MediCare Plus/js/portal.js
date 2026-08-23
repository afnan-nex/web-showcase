/**
 * MediCare Plus - Patient Portal Controller (Production Grade)
 * Manages demo patient dashboard, appointments CRUD (cancel/reschedule/view),
 * prescriptions refill requests, laboratory diagnostic reviews, and profile updating.
 */

document.addEventListener("DOMContentLoaded", () => {
  PortalController.init();
});

const PortalController = {
  currentTab: "dashboard",
  appointmentToCancel: null,

  init() {
    this.readHash();
    this.bindEvents();
    this.render();
  },

  readHash() {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["dashboard", "appointments", "prescriptions", "test-results", "profile", "notifications"].includes(hash)) {
      this.currentTab = hash;
    }
  },

  bindEvents() {
    // Tab item clicks
    const navItems = document.querySelectorAll(".portal-nav-item");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const tab = item.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    // Hash change listener
    window.addEventListener("hashchange", () => {
      this.readHash();
      this.render();
    });

    // Profile form submit
    const profileForm = document.getElementById("editProfileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveProfileUpdates();
      });
    }

    // Cancel modal backdrop close
    const cancelModal = document.getElementById("cancelApptModal");
    const closeCancelBtn = document.getElementById("closeCancelModalBtn");
    if (cancelModal && closeCancelBtn) {
      closeCancelBtn.addEventListener("click", () => {
        cancelModal.classList.remove("open");
      });
      cancelModal.addEventListener("click", (e) => {
        if (e.target === cancelModal) cancelModal.classList.remove("open");
      });
    }
  },

  switchTab(tab) {
    this.currentTab = tab;
    window.location.hash = tab;
    this.render();
  },

  render() {
    this.syncNavUI();
    this.renderActiveTab();
  },

  syncNavUI() {
    const navItems = document.querySelectorAll(".portal-nav-item");
    navItems.forEach(item => {
      if (item.getAttribute("data-tab") === this.currentTab) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    const panes = document.querySelectorAll(".portal-tab-pane");
    panes.forEach(pane => {
      if (pane.id === `tab-${this.currentTab}`) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });
  },

  renderActiveTab() {
    switch (this.currentTab) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "appointments":
        this.renderAppointments();
        break;
      case "prescriptions":
        this.renderPrescriptions();
        break;
      case "test-results":
        this.renderLabResults();
        break;
      case "profile":
        this.renderProfile();
        break;
      case "notifications":
        this.renderNotificationsTab();
        break;
    }
  },

  // -------------------------------------------------------------
  // TAB: DASHBOARD
  // -------------------------------------------------------------
  renderDashboard() {
    const p = StorageManager.getPatientProfile();
    const appointments = StorageManager.getAppointments();
    
    // Find next upcoming confirmed appointment
    const upcoming = appointments.filter(a => a.status === "Confirmed").sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    const upcomingBanner = document.getElementById("dashUpcomingBanner");
    if (upcomingBanner) {
      if (upcoming) {
        upcomingBanner.innerHTML = `
          <div style="background:var(--color-primary-900); color:var(--color-white); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <span class="badge badge-primary" style="background:rgba(255,255,255,0.15); color:#FFF; border-color:rgba(255,255,255,0.25); margin-bottom:0.35rem;">Upcoming Specialist Appointment</span>
              <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:0.25rem;">${escapeHtml(upcoming.appointmentType)} with ${escapeHtml(upcoming.doctorName)}</h3>
              <p style="color:var(--color-neutral-300); font-size:0.875rem; margin-bottom:0;">
                📅 <strong>${upcoming.date}</strong> at <strong>${StorageManager.formatTime12h(upcoming.time)}</strong> • 📍 ${escapeHtml(upcoming.location)}
              </p>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.1); color:#FFF; border-color:rgba(255,255,255,0.3);" onclick="PortalController.switchTab('appointments')">View All Appointments</button>
            </div>
          </div>
        `;
      } else {
        upcomingBanner.innerHTML = `
          <div style="background:var(--color-neutral-100); border:1px solid var(--color-neutral-300); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <h4 style="margin-bottom:0.25rem;">No Upcoming Appointments Scheduled</h4>
              <p class="text-sm text-muted" style="margin-bottom:0;">You are not currently scheduled for any specialist clinic visits.</p>
            </div>
            <a href="appointment.html" class="btn btn-primary btn-sm">Schedule an Appointment</a>
          </div>
        `;
      }
    }

    // Render vitals
    const vitalsContainer = document.getElementById("dashVitalsGrid");
    if (vitalsContainer && p.vitals) {
      vitalsContainer.innerHTML = `
        <div class="vital-card">
          <div class="vital-label">Blood Pressure</div>
          <div class="vital-value">${escapeHtml(p.vitals.bloodPressure)}</div>
          <span class="text-xs text-muted">Recorded ${p.vitals.lastRecorded}</span>
        </div>
        <div class="vital-card">
          <div class="vital-label">Resting Heart Rate</div>
          <div class="vital-value">${escapeHtml(p.vitals.heartRate)}</div>
          <span class="text-xs text-muted">Normal sinus rhythm</span>
        </div>
        <div class="vital-card">
          <div class="vital-label">Body Mass Index (BMI)</div>
          <div class="vital-value">${escapeHtml(p.vitals.bmi)}</div>
          <span class="text-xs text-muted">Optimal healthy range</span>
        </div>
        <div class="vital-card">
          <div class="vital-label">Blood Oxygen (SpO2)</div>
          <div class="vital-value">${escapeHtml(p.vitals.spO2)}</div>
          <span class="text-xs text-muted">Optimal ambient level</span>
        </div>
      `;
    }
  },

  // -------------------------------------------------------------
  // TAB: APPOINTMENTS
  // -------------------------------------------------------------
  renderAppointments(filterStatus = "all") {
    const list = StorageManager.getAppointments();
    const container = document.getElementById("portalAppointmentsList");
    if (!container) return;

    let filtered = [...list];
    if (filterStatus !== "all") {
      filtered = filtered.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-doctors-state" style="padding:2.5rem; text-align:center; background:#FFF; border:1px solid var(--color-neutral-200); border-radius:var(--radius-lg);">
          <h4>No appointments found under this status.</h4>
          <p class="text-muted text-sm" style="margin:0.5rem 0 1rem;">You can schedule a new consultation with our specialists anytime.</p>
          <a href="appointment.html" class="btn btn-primary btn-sm">Schedule Appointment</a>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(appt => {
      let statusBadge = `<span class="badge badge-success">Confirmed</span>`;
      if (appt.status === "Completed") statusBadge = `<span class="badge badge-neutral">Completed</span>`;
      if (appt.status === "Cancelled") statusBadge = `<span class="badge badge-danger">Cancelled</span>`;

      html += `
        <div class="portal-appt-card" data-id="${appt.id}">
          <div class="portal-appt-header">
            <div>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--color-neutral-500); display:block;">ID: ${appt.id}</span>
              <h3 style="font-size:1.125rem; margin-bottom:0.2rem; color:var(--color-neutral-900);">
                ${escapeHtml(appt.appointmentType)} with ${escapeHtml(appt.doctorName)}
              </h3>
              <span class="text-xs text-muted">${escapeHtml(appt.doctorDepartment || '')}</span>
            </div>
            <div>
              ${statusBadge}
            </div>
          </div>

          <div class="portal-appt-grid">
            <div>
              <span>Date & Session Time</span>
              <strong>${appt.date} at ${StorageManager.formatTime12h(appt.time)}</strong>
            </div>
            <div>
              <span>Location / Platform</span>
              <strong>${escapeHtml(appt.location)}</strong>
            </div>
            <div>
              <span>Consultation Fee</span>
              <strong>$${appt.fee || 280} (${escapeHtml(appt.insuranceProvider || 'Self-Pay')})</strong>
            </div>
          </div>

          ${appt.appointmentReason ? `
            <div style="background:var(--color-neutral-50); border-radius:var(--radius-sm); padding:0.5rem 0.75rem; margin-bottom:0.75rem; font-size:0.8125rem;">
              <span class="text-xs text-muted" style="display:block; text-transform:uppercase;">Reason for Consultation:</span>
              <span>${escapeHtml(appt.appointmentReason)}</span>
            </div>
          ` : ''}

          ${appt.clinicalNotes ? `
            <div style="background:var(--color-primary-50); border-left:3px solid var(--color-primary-800); padding:0.5rem 0.75rem; margin-bottom:0.75rem; font-size:0.8125rem;">
              <strong style="color:var(--color-primary-900); display:block;">Physician Clinical Summary:</strong>
              <span>${escapeHtml(appt.clinicalNotes)}</span>
            </div>
          ` : ''}

          <div class="portal-appt-actions">
            ${appt.status === "Confirmed" ? `
              <button class="btn btn-danger btn-sm" onclick="PortalController.openCancelModal('${appt.id}')">Cancel Visit</button>
              <a href="appointment.html?doctorId=${appt.doctorId}" class="btn btn-outline btn-sm">Reschedule</a>
            ` : `
              <a href="appointment.html?doctorId=${appt.doctorId}" class="btn btn-outline btn-sm">Book Again</a>
            `}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  openCancelModal(id) {
    this.appointmentToCancel = id;
    const modal = document.getElementById("cancelApptModal");
    const apptIdSpan = document.getElementById("cancelModalApptId");
    if (apptIdSpan) apptIdSpan.textContent = id;
    if (modal) {
      modal.classList.add("open");
    }
  },

  confirmCancellation() {
    if (!this.appointmentToCancel) return;
    const reasonSelect = document.getElementById("cancelReasonSelect");
    const reason = reasonSelect ? reasonSelect.value : "Patient requested cancellation";

    const res = StorageManager.cancelAppointment(this.appointmentToCancel, reason);
    const modal = document.getElementById("cancelApptModal");
    if (modal) modal.classList.remove("open");

    if (res.success) {
      App.showToast(`Appointment ${this.appointmentToCancel} has been cancelled successfully`, "info");
      this.renderAppointments();
      this.appointmentToCancel = null;
    } else {
      App.showToast(res.error, "error");
    }
  },

  // -------------------------------------------------------------
  // TAB: PRESCRIPTIONS
  // -------------------------------------------------------------
  renderPrescriptions() {
    const list = StorageManager.getPrescriptions();
    const container = document.getElementById("portalPrescriptionsGrid");
    if (!container) return;

    let html = "";
    list.forEach(rx => {
      html += `
        <div class="prescription-card" data-rx-id="${rx.id}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="rx-badge">Rx #${rx.id}</div>
            <span class="badge ${rx.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${rx.status}</span>
          </div>

          <h3 class="rx-name">${escapeHtml(rx.medicationName)}</h3>
          <div class="text-sm text-bold" style="color:var(--color-neutral-800); margin-bottom:0.5rem;">Dosage: ${escapeHtml(rx.dosage)}</div>
          
          <div class="rx-instructions">
            <strong>Sig:</strong> ${escapeHtml(rx.instructions)}
          </div>

          <div style="font-size:0.8125rem; color:var(--color-neutral-600); margin-bottom:0.75rem;">
            <div>Prescriber: <strong>${escapeHtml(rx.prescribingDoctor)}</strong></div>
            <div>Refills Remaining: <strong>${rx.refillsRemaining}</strong></div>
            <div>Dispensing Pharmacy: <strong>${escapeHtml(rx.pharmacy)}</strong></div>
          </div>

          <div style="margin-top:auto; padding-top:0.75rem; border-top:1px solid var(--color-neutral-100);">
            ${rx.refillRequested ? `
              <button class="btn btn-outline btn-sm btn-block" disabled style="color:var(--color-success-700); font-weight:600;">✓ Refill Transmitted to Pharmacy</button>
            ` : rx.refillsRemaining > 0 && rx.status === 'Active' ? `
              <button class="btn btn-primary btn-sm btn-block" onclick="PortalController.requestPrescriptionRefill('${rx.id}')">Request Electronic Refill</button>
            ` : `
              <button class="btn btn-outline btn-sm btn-block" disabled>No Refills Remaining (Consult Required)</button>
            `}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  requestPrescriptionRefill(rxId) {
    const res = StorageManager.requestRefill(rxId);
    if (res.success) {
      App.showToast(`Refill request for Rx #${rxId} transmitted to pharmacy`, "success");
      this.renderPrescriptions();
    } else {
      App.showToast(res.error, "error");
    }
  },

  // -------------------------------------------------------------
  // TAB: TEST RESULTS
  // -------------------------------------------------------------
  renderLabResults() {
    const list = StorageManager.getLabResults();
    const container = document.getElementById("portalLabList");
    if (!container) return;

    let html = "";
    list.forEach(lab => {
      html += `
        <div class="lab-card" data-lab-id="${lab.id}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <span class="text-xs text-muted" style="font-family:var(--font-mono);">${lab.id}</span>
              <h3 style="font-size:1.125rem; color:var(--color-neutral-900); margin-bottom:0.2rem;">${escapeHtml(lab.testName)}</h3>
              <div class="text-sm text-muted">Ordering Clinician: ${escapeHtml(lab.orderDoctor)} • Specimen Date: ${lab.specimenDate}</div>
            </div>
            <div>
              <span class="badge badge-success">${escapeHtml(lab.status)}</span>
            </div>
          </div>

          <div style="background:var(--color-neutral-50); border-radius:var(--radius-md); padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.875rem;">
            <strong>Pathologist Interpretation:</strong> ${escapeHtml(lab.summary)}
          </div>

          <table class="lab-metrics-table">
            <thead>
              <tr>
                <th>Diagnostic Parameter</th>
                <th>Observed Value</th>
                <th>Standard Reference Interval</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${lab.metrics.map(m => `
                <tr>
                  <td><strong>${escapeHtml(m.parameter)}</strong></td>
                  <td>${escapeHtml(m.value)}</td>
                  <td class="text-muted">${escapeHtml(m.reference)}</td>
                  <td><span class="badge badge-success">${escapeHtml(m.status)}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div style="display:flex; justify-content:flex-end; margin-top:1rem;">
            <button class="btn btn-outline btn-sm" onclick="PortalController.downloadLabReport('${lab.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF Report
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  downloadLabReport(labId) {
    const lab = StorageManager.getLabResultById(labId);
    if (!lab) return;

    const content = `MEDICARE PLUS HOSPITAL & SPECIALTY CLINICS\nCENTRAL DIAGNOSTIC PATHOLOGY REPORT (CAP ACCREDITED)\n=======================================================\nReport Identifier: ${lab.id}\nPatient Name: Eleanor Vance (MRN: PAT-94021)\nDate of Birth: 1988-04-12 | Biological Gender: Female\nDiagnostic Test: ${lab.testName}\nOrdering Physician: ${lab.orderDoctor}\nSpecimen Collection: ${lab.specimenDate}\nFinal Verification: ${lab.reportedDate}\nClinical Laboratory: ${lab.laboratory}\nStatus: ${lab.status}\n\nPATHOLOGIST CLINICAL INTERPRETATION:\n${lab.summary}\n\nQUANTITATIVE BIOMARKER VALUES:\n` +
      lab.metrics.map(m => ` - ${m.parameter.padEnd(32)}: ${m.value.padEnd(14)} (Reference: ${m.reference.padEnd(20)}) [${m.status}]`).join("\n") +
      `\n\n=======================================================\nReport signed electronically by Laboratory Medical Director.`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `MediCare-Diagnostic-${lab.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast("Diagnostic report downloaded successfully", "success");
  },

  // -------------------------------------------------------------
  // TAB: PROFILE
  // -------------------------------------------------------------
  renderProfile() {
    const p = StorageManager.getPatientProfile();

    const nameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");
    const dobInput = document.getElementById("profileDob");
    const addressInput = document.getElementById("profileAddress");
    const ecNameInput = document.getElementById("profileEcName");
    const ecPhoneInput = document.getElementById("profileEcPhone");

    if (nameInput) nameInput.value = p.fullName;
    if (emailInput) emailInput.value = p.email;
    if (phoneInput) phoneInput.value = p.phone;
    if (dobInput) dobInput.value = p.dob;
    if (addressInput) addressInput.value = p.address;
    if (ecNameInput && p.emergencyContact) ecNameInput.value = p.emergencyContact.name;
    if (ecPhoneInput && p.emergencyContact) ecPhoneInput.value = p.emergencyContact.phone;

    // Render allergies list
    const allergiesContainer = document.getElementById("profileAllergiesList");
    if (allergiesContainer && p.allergies) {
      allergiesContainer.innerHTML = p.allergies.map(a => `
        <span class="badge badge-danger" style="padding:0.4rem 0.6rem; font-size:0.8125rem;">⚠️ ${escapeHtml(a.name)} (${escapeHtml(a.severity)})</span>
      `).join("");
    }

    // Render chronic conditions list
    const conditionsContainer = document.getElementById("profileConditionsList");
    if (conditionsContainer && p.chronicConditions) {
      conditionsContainer.innerHTML = p.chronicConditions.map(c => `
        <span class="badge badge-neutral" style="padding:0.4rem 0.6rem; font-size:0.8125rem;">🩺 ${escapeHtml(c)}</span>
      `).join("");
    }
  },

  saveProfileUpdates() {
    const name = document.getElementById("profileFullName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();
    const phone = document.getElementById("profilePhone").value.trim();
    const address = document.getElementById("profileAddress").value.trim();
    const ecName = document.getElementById("profileEcName").value.trim();
    const ecPhone = document.getElementById("profileEcPhone").value.trim();

    if (!name || !email || !phone) {
      App.showToast("Please fill in all required contact fields", "error");
      return;
    }

    StorageManager.updatePatientProfile({
      fullName: name,
      email: email,
      phone: phone,
      address: address,
      emergencyContact: {
        name: ecName,
        relation: "Spouse",
        phone: ecPhone
      }
    });

    App.showToast("Patient medical profile updated successfully", "success");
  },

  // -------------------------------------------------------------
  // TAB: NOTIFICATIONS
  // -------------------------------------------------------------
  renderNotificationsTab() {
    const list = StorageManager.getNotifications();
    const container = document.getElementById("portalNotificationsList");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `<p class="text-muted">No notifications stored.</p>`;
      return;
    }

    let html = "";
    list.forEach(n => {
      html += `
        <div class="notif-item ${n.read ? '' : 'unread'}" style="margin-bottom:0.75rem;">
          <div class="notif-item-header">
            <span class="notif-item-title">${escapeHtml(n.title)}</span>
            <span class="notif-item-time">${App.formatRelativeTime(n.timestamp)}</span>
          </div>
          <p class="notif-item-msg">${escapeHtml(n.message)}</p>
          ${n.actionUrl ? `<a href="${n.actionUrl}" class="btn btn-outline btn-sm" style="font-size:0.75rem; padding:0.2rem 0.5rem;">Go to Item</a>` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  }
};
