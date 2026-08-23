/**
 * MediCare Plus - Individual Doctor Profile Controller
 * Renders verified doctor credentials, schedule timetable, reviews, and booking widget.
 */

document.addEventListener("DOMContentLoaded", () => {
  DoctorProfileController.init();
});

const DoctorProfileController = {
  currentDoctor: null,

  init() {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get("id") || "doc-sarah-jenkins"; // fallback default

    this.currentDoctor = MEDICAL_DATA.doctors.find(d => d.id === doctorId) || MEDICAL_DATA.doctors[0];
    
    if (this.currentDoctor) {
      document.title = `${this.currentDoctor.name}, ${this.currentDoctor.title} — MediCare Plus`;
      this.render();
    }
  },

  render() {
    const doc = this.currentDoctor;
    const container = document.getElementById("doctorProfileContainer");
    if (!container) return;

    // Generate schedule rows
    const days = [
      { key: "monday", label: "Monday" },
      { key: "tuesday", label: "Tuesday" },
      { key: "wednesday", label: "Wednesday" },
      { key: "thursday", label: "Thursday" },
      { key: "friday", label: "Friday" },
      { key: "saturday", label: "Saturday" }
    ];

    let scheduleRows = "";
    days.forEach(day => {
      const slots = doc.workingHours[day.key];
      if (slots && slots.length > 0) {
        const formattedSlots = slots.map(t => StorageManager.formatTime12h(t)).join(", ");
        scheduleRows += `
          <tr>
            <td style="font-weight:600; width:140px;">${day.label}</td>
            <td><span class="badge badge-success">Active Hours</span></td>
            <td style="color:var(--color-neutral-800);">${formattedSlots}</td>
          </tr>
        `;
      } else {
        scheduleRows += `
          <tr>
            <td style="font-weight:600; width:140px;">${day.label}</td>
            <td><span class="badge badge-neutral">Off / Surgery</span></td>
            <td class="text-muted">Inpatient Rounds or Operating Theatre</td>
          </tr>
        `;
      }
    });

    // Education timeline items
    const educationItems = doc.education.map(edu => `
      <div class="timeline-item">
        <strong>${escapeHtml(edu.degree)}</strong>
        <span>${escapeHtml(edu.institution)} • Class of ${edu.year}</span>
      </div>
    `).join("");

    // Board certifications items
    const certItems = doc.certifications.map(cert => `
      <li style="display:flex; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem; font-size:0.9375rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-700)" stroke-width="2" style="flex-shrink:0; margin-top:2px;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>${escapeHtml(cert)}</span>
      </li>
    `).join("");

    // Reviews items
    const reviewCards = doc.reviews.map(rev => `
      <div class="review-item-card">
        <div class="review-meta">
          <strong>${escapeHtml(rev.patientName)}</strong>
          <span class="text-muted">${rev.date}</span>
        </div>
        <div style="color:var(--color-warning-700); font-size:0.875rem; margin-bottom:0.35rem;">
          ${"★".repeat(Math.floor(rev.rating))} <span style="color:var(--color-neutral-700); font-weight:600; font-size:0.8125rem;">${rev.rating.toFixed(1)} / 5.0</span>
        </div>
        <p style="font-size:0.875rem; color:var(--color-neutral-700); margin-bottom:0; font-style:italic;">
          "${escapeHtml(rev.comment)}"
        </p>
      </div>
    `).join("");

    // Insurance tags
    const insuranceBadges = doc.insuranceAccepted.map(ins => `
      <span class="badge badge-neutral" style="font-size:0.8125rem; padding:0.35rem 0.65rem;">${escapeHtml(ins)}</span>
    `).join("");

    container.innerHTML = `
      <div class="profile-layout">
        
        <!-- Left Main Profile Column -->
        <div>
          <!-- Header Hero Card -->
          <div class="profile-header-card">
            <img src="${doc.photo}" alt="${escapeHtml(doc.name)}" class="profile-avatar-lg" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';">
            <div class="profile-title-area">
              <span class="badge badge-primary" style="margin-bottom:0.4rem;">${escapeHtml(doc.departmentName)}</span>
              <h1>${escapeHtml(doc.name)}, ${escapeHtml(doc.title)}</h1>
              <div class="profile-role-line">${escapeHtml(doc.role)}</div>
              <p class="text-muted" style="margin-bottom:0; font-size:0.9375rem;">${escapeHtml(doc.specialty)}</p>

              <div class="profile-highlights-grid">
                <div class="profile-highlight-item">
                  <strong>${doc.experienceYears} Years</strong>
                  <span>Clinical Experience</span>
                </div>
                <div class="profile-highlight-item">
                  <strong style="color:var(--color-warning-700);">★ ${doc.rating.toFixed(2)}</strong>
                  <span>${doc.reviewCount} Verified Reviews</span>
                </div>
                <div class="profile-highlight-item">
                  <strong>${doc.languages.join(", ")}</strong>
                  <span>Languages Spoken</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Biography & Clinical Focus -->
          <section class="profile-section-card">
            <h2>Physician Biography & Clinical Approach</h2>
            <p style="font-size:0.9375rem; line-height:1.7;">${escapeHtml(doc.bio)}</p>

            <h3 style="font-size:1.0625rem; margin-top:1.25rem; margin-bottom:0.5rem;">Sub-Specialties & Areas of Expertise</h3>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${doc.subSpecialties.map(sub => `<span class="badge badge-neutral" style="font-size:0.8125rem; padding:0.35rem 0.65rem;">${escapeHtml(sub)}</span>`).join("")}
            </div>
          </section>

          <!-- Weekly Schedule Table -->
          <section class="profile-section-card">
            <h2>Weekly Consultation Schedule</h2>
            <p class="text-muted text-sm" style="margin-bottom:1rem;">Doctor's standard weekly clinical availability. Actual slots subject to real-time booking verification.</p>
            
            <div class="schedule-table-wrap">
              <table class="schedule-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Clinic Status</th>
                    <th>Available Session Slots</th>
                  </tr>
                </thead>
                <tbody>
                  ${scheduleRows}
                </tbody>
              </table>
            </div>
          </section>

          <!-- Education & Training Timeline -->
          <section class="profile-section-card">
            <h2>Medical Education & Postgraduate Training</h2>
            <div class="timeline-list">
              ${educationItems}
            </div>

            <h3 style="font-size:1.0625rem; margin-top:1.5rem; margin-bottom:0.75rem;">Board Certifications & Fellowships</h3>
            <ul>
              ${certItems}
            </ul>
          </section>

          <!-- Patient Reviews -->
          <section class="profile-section-card">
            <h2>Verified Patient Feedback & Outcomes</h2>
            <div class="reviews-summary-box">
              <div class="reviews-score">★ ${doc.rating.toFixed(2)}</div>
              <div>
                <strong style="font-size:1.0625rem; display:block;">Overall Patient Satisfaction</strong>
                <span class="text-muted text-sm">Based on ${doc.reviewCount} post-consultation evaluations</span>
              </div>
            </div>

            <div>
              ${reviewCards}
            </div>
          </section>

          <!-- Insurance Accepted -->
          <section class="profile-section-card">
            <h2>Accepted Insurance Plans</h2>
            <p class="text-muted text-sm" style="margin-bottom:0.75rem;">This physician is in-network with the following major healthcare networks:</p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              ${insuranceBadges}
            </div>
          </section>
        </div>

        <!-- Right Sticky Booking Card -->
        <div>
          <div class="profile-booking-sticky">
            <div class="booking-widget-card">
              <div class="booking-widget-header">
                <span class="text-xs text-muted" style="text-transform:uppercase; letter-spacing:0.05em; display:block;">Standard Specialist Consultation</span>
                <div class="booking-widget-fee">$${doc.consultationFee} <span style="font-size:0.875rem; font-weight:normal; color:var(--color-neutral-600);">/ visit</span></div>
                <div style="margin-top:0.5rem;">
                  <span class="badge badge-success">Next Available: ${escapeHtml(doc.nextAvailable)}</span>
                </div>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label class="form-label" style="font-size:0.8125rem;">Clinical Location</label>
                <p class="text-sm" style="color:var(--color-neutral-700); margin-bottom:0.75rem;">
                  <strong>${escapeHtml(doc.locations[0])}</strong>
                </p>

                <label class="form-label" style="font-size:0.8125rem;">Available Formats</label>
                <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-bottom:1rem;">
                  ${doc.consultationTypes.map(t => `<span class="badge badge-neutral">${escapeHtml(t)}</span>`).join("")}
                </div>
              </div>

              <a href="appointment.html?doctorId=${doc.id}" class="btn btn-primary btn-block btn-lg" style="margin-bottom:0.75rem;">
                Book Appointment with ${escapeHtml(doc.name.split(" ")[1] || doc.name)}
              </a>

              <p class="text-xs text-muted text-center" style="margin-bottom:0;">
                Direct calendar booking with real-time slot verification. No upfront deposit required.
              </p>
            </div>
          </div>
        </div>

      </div>
    `;
  }
};
