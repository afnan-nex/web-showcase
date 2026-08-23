/**
 * MediCare Plus - Multi-Step Appointment Booking Engine (Production Grade)
 * Manages 6-step clinical booking flow, real-time doctor availability checking,
 * conflict prevention, form validation, unique ID generation, and ICS download.
 */

document.addEventListener("DOMContentLoaded", () => {
  AppointmentWizard.init();
});

const AppointmentWizard = {
  currentStep: 1,
  totalSteps: 6,

  bookingData: {
    doctor: null,
    appointmentType: "In-Person Specialist Consultation",
    date: null,
    time: null,
    patient: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "Female",
      insuranceProvider: "Blue Cross Blue Shield",
      policyNumber: "",
      reason: "",
      isFirstTime: true
    },
    createdAppointment: null
  },

  calendarState: {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() // 0-indexed
  },

  departmentFilter: "",

  init() {
    this.readUrlParams();
    this.bindEvents();
    this.renderCurrentStep();
  },

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has("doctorId")) {
      const docId = params.get("doctorId");
      const foundDoc = MEDICAL_DATA.doctors.find(d => d.id === docId);
      if (foundDoc) {
        this.bookingData.doctor = foundDoc;
        this.currentStep = 2; // Jump directly to appointment type
      }
    }

    if (params.has("department") && !this.bookingData.doctor) {
      this.departmentFilter = params.get("department");
    }
  },

  bindEvents() {
    // Next / Prev buttons
    const prevBtn = document.getElementById("wizardPrevBtn");
    const nextBtn = document.getElementById("wizardNextBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.goToPrevStep());
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.goToNextStep());
    }
  },

  goToNextStep() {
    // Validate current step
    if (!this.validateStep(this.currentStep)) {
      return;
    }

    if (this.currentStep === 5) {
      // Move to Step 6 (Confirmation Review)
      this.currentStep = 6;
      this.renderCurrentStep();
      return;
    }

    if (this.currentStep === 6 && !this.bookingData.createdAppointment) {
      // Actually submit and create the appointment
      this.submitBooking();
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderCurrentStep();
    }
  },

  goToPrevStep() {
    if (this.bookingData.createdAppointment) return; // Cannot go back after final confirmation
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderCurrentStep();
    }
  },

  validateStep(step) {
    if (step === 1) {
      if (!this.bookingData.doctor) {
        App.showToast("Please select a physician to continue", "error");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!this.bookingData.appointmentType) {
        App.showToast("Please select an appointment type", "error");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!this.bookingData.date) {
        App.showToast("Please select an available appointment date", "error");
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!this.bookingData.time) {
        App.showToast("Please select an available time slot", "error");
        return false;
      }
      return true;
    }

    if (step === 5) {
      return this.validatePatientForm();
    }

    return true;
  },

  validatePatientForm() {
    const fullName = document.getElementById("patientFullName");
    const email = document.getElementById("patientEmail");
    const phone = document.getElementById("patientPhone");
    const dob = document.getElementById("patientDob");
    const gender = document.getElementById("patientGender");
    const insuranceProvider = document.getElementById("patientInsurance");
    const policyNumber = document.getElementById("patientPolicyNumber");
    const reason = document.getElementById("patientReason");
    const isFirstTime = document.getElementById("patientFirstTime");

    let isValid = true;

    // Reset error classes
    document.querySelectorAll(".form-control").forEach(fc => fc.classList.remove("is-invalid"));

    // Full name
    if (!fullName || fullName.value.trim().length < 3) {
      if (fullName) fullName.classList.add("is-invalid");
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      if (email) email.classList.add("is-invalid");
      isValid = false;
    }

    // Phone (minimum 10 digits)
    const phoneDigits = (phone ? phone.value : "").replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      if (phone) phone.classList.add("is-invalid");
      isValid = false;
    }

    // DOB
    if (!dob || !dob.value) {
      if (dob) dob.classList.add("is-invalid");
      isValid = false;
    } else {
      const dobDate = new Date(dob.value);
      const today = new Date();
      if (dobDate >= today || isNaN(dobDate.getTime())) {
        dob.classList.add("is-invalid");
        isValid = false;
      }
    }

    // Reason
    if (!reason || reason.value.trim().length < 5) {
      if (reason) reason.classList.add("is-invalid");
      isValid = false;
    }

    if (!isValid) {
      App.showToast("Please correct the highlighted fields before proceeding", "error");
      return false;
    }

    // Save into state
    this.bookingData.patient = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      dob: dob.value,
      gender: gender ? gender.value : "Female",
      insuranceProvider: insuranceProvider ? insuranceProvider.value : "None",
      policyNumber: policyNumber ? policyNumber.value.trim() : "",
      reason: reason.value.trim(),
      isFirstTime: isFirstTime ? isFirstTime.checked : true
    };

    return true;
  },

  submitBooking() {
    const d = this.bookingData;
    const appointmentPayload = {
      doctorId: d.doctor.id,
      doctorName: d.doctor.name,
      doctorTitle: d.doctor.title,
      doctorDepartment: d.doctor.departmentName,
      doctorPhoto: d.doctor.photo,
      appointmentType: d.appointmentType,
      appointmentReason: d.patient.reason,
      date: d.date,
      time: d.time,
      location: d.doctor.locations[0] || "MediCare Plus Main Medical Center",
      patientName: d.patient.fullName,
      patientEmail: d.patient.email,
      patientPhone: d.patient.phone,
      patientDob: d.patient.dob,
      patientGender: d.patient.gender,
      insuranceProvider: d.patient.insuranceProvider,
      policyNumber: d.patient.policyNumber,
      fee: d.doctor.consultationFee
    };

    const res = StorageManager.createAppointment(appointmentPayload);

    if (!res.success) {
      App.showToast("Booking conflict: " + res.error, "error");
      return;
    }

    this.bookingData.createdAppointment = res.appointment;
    App.showToast("Appointment confirmed! ID: " + res.appointment.id, "success");
    this.renderCurrentStep();
  },

  renderCurrentStep() {
    this.updateProgressIndicator();

    const bodyContainer = document.getElementById("wizardCardBody");
    const prevBtn = document.getElementById("wizardPrevBtn");
    const nextBtn = document.getElementById("wizardNextBtn");
    const titleElem = document.getElementById("wizardStepTitle");
    const descElem = document.getElementById("wizardStepDesc");

    if (!bodyContainer) return;

    // Reset controls visibility
    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 && !this.bookingData.createdAppointment ? "inline-flex" : "none";
    }

    if (nextBtn) {
      if (this.bookingData.createdAppointment) {
        nextBtn.style.display = "none";
      } else {
        nextBtn.style.display = "inline-flex";
        if (this.currentStep === 5) {
          nextBtn.textContent = "Review Details →";
        } else if (this.currentStep === 6) {
          nextBtn.textContent = "Confirm & Book Appointment ✓";
        } else {
          nextBtn.textContent = "Continue →";
        }
      }
    }

    switch (this.currentStep) {
      case 1:
        if (titleElem) titleElem.textContent = "Step 1: Select Physician or Specialist";
        if (descElem) descElem.textContent = "Choose from our board-certified clinical faculty.";
        this.renderStep1(bodyContainer);
        break;
      case 2:
        if (titleElem) titleElem.textContent = "Step 2: Choose Consultation Type";
        if (descElem) descElem.textContent = `Select the format for your visit with ${this.bookingData.doctor ? this.bookingData.doctor.name : 'your doctor'}.`;
        this.renderStep2(bodyContainer);
        break;
      case 3:
        if (titleElem) titleElem.textContent = "Step 3: Choose Appointment Date";
        if (descElem) descElem.textContent = "Select an available date on the clinical schedule calendar.";
        this.renderStep3(bodyContainer);
        break;
      case 4:
        if (titleElem) titleElem.textContent = "Step 4: Select Session Time Slot";
        if (descElem) descElem.textContent = `Available slots for ${this.formatDateReadable(this.bookingData.date)}`;
        this.renderStep4(bodyContainer);
        break;
      case 5:
        if (titleElem) titleElem.textContent = "Step 5: Patient Demographic & Insurance Details";
        if (descElem) descElem.textContent = "Provide patient verification and consultation notes.";
        this.renderStep5(bodyContainer);
        break;
      case 6:
        if (this.bookingData.createdAppointment) {
          if (titleElem) titleElem.textContent = "Appointment Successfully Booked";
          if (descElem) descElem.textContent = "Your appointment reference and instructions have been generated.";
          this.renderSuccessReceipt(bodyContainer);
        } else {
          if (titleElem) titleElem.textContent = "Step 6: Review & Final Confirmation";
          if (descElem) descElem.textContent = "Review appointment specifics before confirming.";
          this.renderStep6Review(bodyContainer);
        }
        break;
    }
  },

  updateProgressIndicator() {
    for (let s = 1; s <= this.totalSteps; s++) {
      const stepItem = document.getElementById(`stepIndicator-${s}`);
      if (!stepItem) continue;

      stepItem.classList.remove("active", "completed");

      if (this.bookingData.createdAppointment) {
        stepItem.classList.add("completed");
      } else if (s === this.currentStep) {
        stepItem.classList.add("active");
      } else if (s < this.currentStep) {
        stepItem.classList.add("completed");
      }
    }
  },

  // -------------------------------------------------------------
  // STEP 1: DOCTOR SELECT
  // -------------------------------------------------------------
  renderStep1(container) {
    let docs = [...MEDICAL_DATA.doctors];

    if (this.departmentFilter) {
      docs = docs.filter(d => d.departmentId === this.departmentFilter);
    }

    let html = `
      <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <input type="text" id="wizardDocSearch" class="form-control" placeholder="Search doctor by name, specialty, or condition..." style="max-width:340px; font-size:0.875rem;">
        <span class="text-xs text-muted">Showing ${docs.length} Specialist${docs.length === 1 ? '' : 's'}</span>
      </div>
      <div class="doctor-select-grid" id="wizardDocGrid">
    `;

    docs.forEach(doc => {
      const isSelected = this.bookingData.doctor && this.bookingData.doctor.id === doc.id;
      html += `
        <div class="doctor-select-card ${isSelected ? 'selected' : ''}" onclick="AppointmentWizard.selectDoctor('${doc.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ') AppointmentWizard.selectDoctor('${doc.id}')">
          <img src="${doc.photo}" alt="${escapeHtml(doc.name)}" class="doc-sel-avatar" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';">
          <div class="doc-sel-info">
            <span class="badge badge-primary" style="font-size:0.65rem; margin-bottom:0.15rem;">${escapeHtml(doc.departmentName)}</span>
            <div class="doc-sel-name">${escapeHtml(doc.name)}, ${escapeHtml(doc.title)}</div>
            <div class="doc-sel-spec">${escapeHtml(doc.specialty)}</div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--color-neutral-700);">
              <span style="color:var(--color-warning-700); font-weight:600;">★ ${doc.rating.toFixed(2)}</span>
              <strong>$${doc.consultationFee}</strong>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Search filter
    const searchInput = document.getElementById("wizardDocSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll(".doctor-select-card").forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(q) ? "flex" : "none";
        });
      });
    }
  },

  selectDoctor(doctorId) {
    const doc = MEDICAL_DATA.doctors.find(d => d.id === doctorId);
    if (doc) {
      this.bookingData.doctor = doc;
      this.bookingData.date = null; // reset date when doc changes
      this.bookingData.time = null; // reset time
      this.renderStep1(document.getElementById("wizardCardBody"));
    }
  },

  // -------------------------------------------------------------
  // STEP 2: APPOINTMENT TYPE
  // -------------------------------------------------------------
  renderStep2(container) {
    const types = [
      {
        id: "In-Person Specialist Consultation",
        title: "In-Person Specialist Consultation",
        desc: "Comprehensive bedside examination, symptom investigation, and diagnostic orders at our medical center.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        badge: "Standard (45 min)"
      },
      {
        id: "Telehealth Video Consultation",
        title: "Telehealth Video Consultation",
        desc: "Secure, encrypted HD video visit via patient portal for initial evaluation or follow-up.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
        badge: "Virtual (30 min)"
      },
      {
        id: "Follow-up & Treatment Review",
        title: "Follow-Up & Treatment Review",
        desc: "Review recent lab diagnostics, medication response, or post-procedure rehabilitation progress.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
        badge: "Follow-up (30 min)"
      },
      {
        id: "Comprehensive Clinical Assessment",
        title: "Comprehensive Clinical Assessment",
        desc: "In-depth multi-organ health audit including full biometric evaluation and organ health panel.",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        badge: "Extended (60 min)"
      }
    ];

    let html = `<div class="appoint-type-grid">`;
    types.forEach(t => {
      const isSelected = this.bookingData.appointmentType === t.id;
      html += `
        <div class="appoint-type-card ${isSelected ? 'selected' : ''}" onclick="AppointmentWizard.selectAppointType('${t.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ') AppointmentWizard.selectAppointType('${t.id}')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="appoint-type-icon">${t.icon}</div>
            <span class="badge badge-neutral">${t.badge}</span>
          </div>
          <h4>${escapeHtml(t.title)}</h4>
          <p>${escapeHtml(t.desc)}</p>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
  },

  selectAppointType(typeId) {
    this.bookingData.appointmentType = typeId;
    this.renderStep2(document.getElementById("wizardCardBody"));
  },

  // -------------------------------------------------------------
  // STEP 3: DATE SELECTION (Calendar Widget)
  // -------------------------------------------------------------
  renderStep3(container) {
    const doc = this.bookingData.doctor;
    const year = this.calendarState.currentYear;
    const month = this.calendarState.currentMonth;

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayNameKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    let calendarCells = "";

    // Blank cells before first day
    for (let b = 0; b < firstDayIndex; b++) {
      calendarCells += `<div class="cal-day-cell disabled" style="background:transparent; border:none;" aria-hidden="true"></div>`;
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const dayOfWeekKey = dayNameKeys[cellDate.getDay()];
      
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const isPast = cellDate < today;
      const isDocWorkingDay = doc && doc.workingHours[dayOfWeekKey] && doc.workingHours[dayOfWeekKey].length > 0;
      const isDisabled = isPast || !isDocWorkingDay;
      const isSelected = this.bookingData.date === dateString;
      const isToday = cellDate.getTime() === today.getTime();

      calendarCells += `
        <button type="button"
             class="cal-day-cell ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}"
             ${!isDisabled ? `onclick="AppointmentWizard.selectDate('${dateString}')"` : 'disabled'}
             aria-label="${monthNames[month]} ${day}, ${year} ${isDisabled ? '(Unavailable)' : '(Available)'}">
          <span>${day}</span>
        </button>
      `;
    }

    container.innerHTML = `
      <div class="calendar-widget">
        <div class="calendar-header">
          <button type="button" class="calendar-nav-btn" onclick="AppointmentWizard.changeMonth(-1)" aria-label="Previous month">&larr;</button>
          <h3 style="font-size:1.125rem; font-weight:700;">${monthNames[month]} ${year}</h3>
          <button type="button" class="calendar-nav-btn" onclick="AppointmentWizard.changeMonth(1)" aria-label="Next month">&rarr;</button>
        </div>

        <div class="calendar-weekdays">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>

        <div class="calendar-days-grid">
          ${calendarCells}
        </div>

        <div style="margin-top:1.25rem; font-size:0.75rem; color:var(--color-neutral-600); display:flex; justify-content:space-around;">
          <span>● Active: Available</span>
          <span style="opacity:0.6;">○ Muted: Non-working / Past</span>
          <span style="color:var(--color-accent-700);">▪ Dot: Today</span>
        </div>
      </div>
    `;
  },

  changeMonth(delta) {
    this.calendarState.currentMonth += delta;
    if (this.calendarState.currentMonth > 11) {
      this.calendarState.currentMonth = 0;
      this.calendarState.currentYear++;
    } else if (this.calendarState.currentMonth < 0) {
      this.calendarState.currentMonth = 11;
      this.calendarState.currentYear--;
    }
    this.renderStep3(document.getElementById("wizardCardBody"));
  },

  selectDate(dateStr) {
    this.bookingData.date = dateStr;
    this.bookingData.time = null; // reset time when date changes
    this.renderStep3(document.getElementById("wizardCardBody"));
  },

  // -------------------------------------------------------------
  // STEP 4: TIME SLOT SELECTION
  // -------------------------------------------------------------
  renderStep4(container) {
    const docId = this.bookingData.doctor.id;
    const dateStr = this.bookingData.date;

    const slots = StorageManager.getAvailableSlots(docId, dateStr);

    if (slots.length === 0) {
      container.innerHTML = `
        <div class="slots-container text-center" style="padding:2.5rem; background:var(--color-neutral-50); border:1px solid var(--color-neutral-200); border-radius:var(--radius-lg);">
          <h3 style="margin-bottom:0.5rem;">No Available Slots on this Date</h3>
          <p class="text-muted text-sm" style="margin-bottom:1.5rem;">Dr. ${escapeHtml(this.bookingData.doctor.name)} is fully booked or off clinic duty on ${this.formatDateReadable(dateStr)}.</p>
          <button class="btn btn-outline btn-sm" onclick="AppointmentWizard.goToPrevStep()">Choose Another Date</button>
        </div>
      `;
      return;
    }

    // Partition slots into morning and afternoon
    const morningSlots = slots.filter(s => {
      const h = parseInt(s.time.split(":")[0], 10);
      return h < 12;
    });

    const afternoonSlots = slots.filter(s => {
      const h = parseInt(s.time.split(":")[0], 10);
      return h >= 12;
    });

    const renderSlotButtons = (slotList) => {
      return slotList.map(slot => {
        const isSelected = this.bookingData.time === slot.time;
        return `
          <button type="button"
                  class="slot-btn ${!slot.isAvailable ? 'disabled' : ''} ${isSelected ? 'selected' : ''}"
                  ${slot.isAvailable ? `onclick="AppointmentWizard.selectTimeSlot('${slot.time}')"` : 'disabled'}>
            ${slot.displayTime}
            ${!slot.isAvailable ? `<span style="display:block; font-size:0.65rem;">(${slot.statusText})</span>` : ''}
          </button>
        `;
      }).join("");
    };

    let html = `
      <div class="slots-container">
        <p class="text-sm text-center text-muted" style="margin-bottom:1.25rem;">
          Consultation times reflect Eastern Time (ET). Please select your preferred session.
        </p>
    `;

    if (morningSlots.length > 0) {
      html += `
        <div style="margin-bottom:1.25rem;">
          <strong style="font-size:0.8125rem; color:var(--color-neutral-700); text-transform:uppercase; letter-spacing:0.04em;">Morning Sessions (08:00 - 12:00)</strong>
          <div class="slots-grid" style="margin-top:0.4rem;">
            ${renderSlotButtons(morningSlots)}
          </div>
        </div>
      `;
    }

    if (afternoonSlots.length > 0) {
      html += `
        <div>
          <strong style="font-size:0.8125rem; color:var(--color-neutral-700); text-transform:uppercase; letter-spacing:0.04em;">Afternoon Sessions (12:00 - 18:00)</strong>
          <div class="slots-grid" style="margin-top:0.4rem;">
            ${renderSlotButtons(afternoonSlots)}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  selectTimeSlot(timeStr) {
    this.bookingData.time = timeStr;
    this.renderStep4(document.getElementById("wizardCardBody"));
  },

  // -------------------------------------------------------------
  // STEP 5: PATIENT FORM
  // -------------------------------------------------------------
  renderStep5(container) {
    const p = this.bookingData.patient;

    container.innerHTML = `
      <form id="patientInfoForm" onsubmit="event.preventDefault(); AppointmentWizard.goToNextStep();">
        <div style="background:var(--color-primary-50); border:1px solid var(--color-primary-100); border-radius:var(--radius-md); padding:0.75rem 1rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <span class="text-sm" style="color:var(--color-primary-900);">Demo Patient Quick-Fill: Eleanor Vance</span>
          <button type="button" class="btn btn-sm btn-outline" onclick="AppointmentWizard.autofillDemoPatient()">Autofill Demo Patient</button>
        </div>

        <div class="patient-form-grid">
          <div class="form-group">
            <label for="patientFullName" class="form-label">Full Legal Name <span class="required-star">*</span></label>
            <input type="text" id="patientFullName" class="form-control" placeholder="e.g. Eleanor Vance" value="${escapeHtml(p.fullName)}" required>
            <div class="invalid-feedback">Please provide your full legal name.</div>
          </div>

          <div class="form-group">
            <label for="patientEmail" class="form-label">Email Address <span class="required-star">*</span></label>
            <input type="email" id="patientEmail" class="form-control" placeholder="e.g. eleanor.vance@example.com" value="${escapeHtml(p.email)}" required>
            <div class="invalid-feedback">Please enter a valid email address for confirmation.</div>
          </div>

          <div class="form-group">
            <label for="patientPhone" class="form-label">Contact Phone <span class="required-star">*</span></label>
            <input type="tel" id="patientPhone" class="form-control" placeholder="e.g. (555) 234-8901" value="${escapeHtml(p.phone)}" oninput="AppointmentWizard.formatPhoneInput(this)" required>
            <div class="invalid-feedback">Please provide a valid 10-digit phone number.</div>
          </div>

          <div class="form-group">
            <label for="patientDob" class="form-label">Date of Birth <span class="required-star">*</span></label>
            <input type="date" id="patientDob" class="form-control" value="${escapeHtml(p.dob)}" required>
            <div class="invalid-feedback">Please select a valid birth date.</div>
          </div>

          <div class="form-group">
            <label for="patientGender" class="form-label">Biological Gender <span class="required-star">*</span></label>
            <select id="patientGender" class="form-control form-select">
              <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other / Prefer not to specify</option>
            </select>
          </div>

          <div class="form-group">
            <label for="patientInsurance" class="form-label">Health Insurance Provider</label>
            <select id="patientInsurance" class="form-control form-select">
              <option value="Blue Cross Blue Shield" ${p.insuranceProvider === 'Blue Cross Blue Shield' ? 'selected' : ''}>Blue Cross Blue Shield</option>
              <option value="Aetna Health" ${p.insuranceProvider === 'Aetna Health' ? 'selected' : ''}>Aetna Health</option>
              <option value="Medicare / CMS" ${p.insuranceProvider === 'Medicare / CMS' ? 'selected' : ''}>Medicare / CMS</option>
              <option value="UnitedHealthcare" ${p.insuranceProvider === 'UnitedHealthcare' ? 'selected' : ''}>UnitedHealthcare</option>
              <option value="Cigna Healthcare" ${p.insuranceProvider === 'Cigna Healthcare' ? 'selected' : ''}>Cigna Healthcare</option>
              <option value="Self-Pay" ${p.insuranceProvider === 'Self-Pay' ? 'selected' : ''}>Self-Pay (No Insurance)</option>
            </select>
          </div>

          <div class="form-group" style="grid-column:1/-1;">
            <label for="patientPolicyNumber" class="form-label">Insurance Policy / Member ID #</label>
            <input type="text" id="patientPolicyNumber" class="form-control" placeholder="e.g. BCBS-88941029-MA" value="${escapeHtml(p.policyNumber)}">
          </div>

          <div class="form-group" style="grid-column:1/-1;">
            <label for="patientReason" class="form-label">Reason for Consultation & Symptoms <span class="required-star">*</span></label>
            <textarea id="patientReason" class="form-control" rows="3" placeholder="Briefly describe your symptoms, medical concerns, or referral notes..." required>${escapeHtml(p.reason)}</textarea>
            <div class="invalid-feedback">Please describe your symptoms or visit reason.</div>
          </div>
        </div>

        <div class="form-check">
          <input type="checkbox" id="patientFirstTime" class="form-check-input" ${p.isFirstTime ? 'checked' : ''}>
          <label for="patientFirstTime" class="form-check-label">This is my first time consulting with Dr. ${escapeHtml(this.bookingData.doctor.name)}</label>
        </div>
      </form>
    `;
  },

  formatPhoneInput(input) {
    let numbers = input.value.replace(/\D/g, "");
    if (numbers.length > 10) numbers = numbers.slice(0, 10);
    if (numbers.length >= 6) {
      input.value = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else if (numbers.length >= 3) {
      input.value = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      input.value = numbers;
    }
  },

  autofillDemoPatient() {
    const demo = StorageManager.getPatientProfile();
    document.getElementById("patientFullName").value = demo.fullName;
    document.getElementById("patientEmail").value = demo.email;
    document.getElementById("patientPhone").value = demo.phone;
    document.getElementById("patientDob").value = demo.dob;
    document.getElementById("patientGender").value = demo.gender;
    document.getElementById("patientInsurance").value = demo.insurance.provider;
    document.getElementById("patientPolicyNumber").value = demo.insurance.policyNumber;
    document.getElementById("patientReason").value = "Routine follow-up evaluation and blood pressure medication titration";
    App.showToast("Demo patient data autofilled", "info");
  },

  // -------------------------------------------------------------
  // STEP 6: CONFIRMATION REVIEW
  // -------------------------------------------------------------
  renderStep6Review(container) {
    const d = this.bookingData;

    container.innerHTML = `
      <div class="confirmation-summary-card">
        <div class="summary-header">
          <img src="${d.doctor.photo}" alt="${escapeHtml(d.doctor.name)}" style="width:50px; height:50px; border-radius:var(--radius-md); object-fit:cover;">
          <div>
            <strong style="font-size:1.125rem;">${escapeHtml(d.doctor.name)}, ${escapeHtml(d.doctor.title)}</strong>
            <span class="text-sm text-muted" style="display:block;">${escapeHtml(d.doctor.departmentName)} • ${escapeHtml(d.doctor.specialty)}</span>
          </div>
        </div>

        <div class="summary-details-grid">
          <div class="summary-item">
            <span>Appointment Type</span>
            <strong>${escapeHtml(d.appointmentType)}</strong>
          </div>

          <div class="summary-item">
            <span>Date & Time</span>
            <strong>${this.formatDateReadable(d.date)} at ${StorageManager.formatTime12h(d.time)}</strong>
          </div>

          <div class="summary-item">
            <span>Clinical Location</span>
            <strong>${escapeHtml(d.doctor.locations[0])}</strong>
          </div>

          <div class="summary-item">
            <span>Consultation Fee</span>
            <strong>$${d.doctor.consultationFee} <span style="font-size:0.75rem; font-weight:normal; color:var(--color-neutral-500);">(Subject to insurance copay)</span></strong>
          </div>

          <div class="summary-item">
            <span>Patient Name</span>
            <strong>${escapeHtml(d.patient.fullName)} (${escapeHtml(d.patient.gender)}, DOB: ${d.patient.dob})</strong>
          </div>

          <div class="summary-item">
            <span>Insurance Carrier</span>
            <strong>${escapeHtml(d.patient.insuranceProvider)} ${d.patient.policyNumber ? `(${escapeHtml(d.patient.policyNumber)})` : ''}</strong>
          </div>

          <div class="summary-item" style="grid-column:1/-1;">
            <span>Reason for Visit</span>
            <p class="text-sm" style="margin-bottom:0; color:var(--color-neutral-800);">${escapeHtml(d.patient.reason)}</p>
          </div>
        </div>
      </div>

      <div style="background:var(--color-primary-50); border:1px solid var(--color-primary-100); border-radius:var(--radius-md); padding:1rem; font-size:0.8125rem; color:var(--color-neutral-700);">
        <strong>Cancellation & Rescheduling Policy:</strong> Appointments can be modified or cancelled up to 24 hours prior to the scheduled time without fee penalty directly through your patient portal.
      </div>
    `;
  },

  // -------------------------------------------------------------
  // SUCCESS RECEIPT
  // -------------------------------------------------------------
  renderSuccessReceipt(container) {
    const appt = this.bookingData.createdAppointment;

    container.innerHTML = `
      <div class="receipt-success-box">
        <div class="receipt-success-icon">
          <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style="font-size:1.75rem; color:var(--color-primary-950); margin-bottom:0.25rem;">Appointment Confirmed!</h2>
        <p class="text-muted text-sm" style="margin-bottom:0.5rem;">Your booking has been registered in the MediCare Plus clinical scheduling system.</p>
        <div class="booking-ref-badge">REFERENCE: ${appt.id}</div>
        <p class="text-xs text-muted" style="margin-top:0.25rem;">A confirmation notification has been dispatched to <strong>${escapeHtml(appt.patientEmail)}</strong>.</p>
      </div>

      <div class="confirmation-summary-card">
        <div class="summary-details-grid">
          <div class="summary-item">
            <span>Attending Specialist</span>
            <strong>${escapeHtml(appt.doctorName)}, ${escapeHtml(appt.doctorTitle)}</strong>
          </div>
          <div class="summary-item">
            <span>Date & Time</span>
            <strong>${this.formatDateReadable(appt.date)} at ${StorageManager.formatTime12h(appt.time)}</strong>
          </div>
          <div class="summary-item">
            <span>Location</span>
            <strong>${escapeHtml(appt.location)}</strong>
          </div>
          <div class="summary-item">
            <span>Appointment Type</span>
            <strong>${escapeHtml(appt.appointmentType)}</strong>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center; margin-top:1.5rem;">
        <button class="btn btn-outline" onclick="AppointmentWizard.downloadIcsFile()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Add to Calendar (.ics)
        </button>

        <button class="btn btn-outline" onclick="window.print()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Appointment Slip
        </button>

        <a href="patient-portal.html#appointments" class="btn btn-primary">
          View in Patient Portal &rarr;
        </a>
      </div>
    `;
  },

  /**
   * Export standard iCalendar (.ics) file
   */
  downloadIcsFile() {
    const appt = this.bookingData.createdAppointment;
    if (!appt) return;

    const [year, month, day] = appt.date.split("-").map(Number);
    const [hours, minutes] = appt.time.split(":").map(Number);

    const pad = (n) => String(n).padStart(2, "0");
    const startTimeStr = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;
    
    // Default 45 min duration
    const endMinutesTotal = hours * 60 + minutes + 45;
    const endH = Math.floor(endMinutesTotal / 60);
    const endM = endMinutesTotal % 60;
    const endTimeStr = `${year}${pad(month)}${pad(day)}T${pad(endH)}${pad(endM)}00`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MediCare Plus//Hospital Appointment System//EN",
      "BEGIN:VEVENT",
      `UID:${appt.id}@medicareplus.org`,
      `DTSTAMP:${startTimeStr}Z`,
      `DTSTART:${startTimeStr}`,
      `DTEND:${endTimeStr}`,
      `SUMMARY:MediCare Plus: ${appt.appointmentType} with ${appt.doctorName}`,
      `DESCRIPTION:Appointment Reference: ${appt.id}\\nSpecialist: ${appt.doctorName} (${appt.doctorDepartment})\\nReason: ${appt.appointmentReason}`,
      `LOCATION:${appt.location}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Appointment-${appt.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast("Calendar file (.ics) downloaded", "success");
  },

  formatDateReadable(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
};
