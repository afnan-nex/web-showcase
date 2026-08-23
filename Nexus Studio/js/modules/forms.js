/**
 * NEXUS STUDIO — INQUIRY FORM, VALIDATION, DRAFT AUTOSAVE & FILE SIMULATOR
 * Production-grade form handling with local storage persistence and client vault
 */

const FormManager = {
  DRAFT_KEY: "nexus_contact_draft",
  HISTORY_KEY: "nexus_inquiries_history",

  form: null,
  filesList: [],
  isSubmitting: false,

  init() {
    this.form = document.querySelector("#project-inquiry-form");
    this.initDraftBanner();
    this.initFileUpload();
    this.initSubmissionVault();
    this.initNDAModal();

    if (!this.form) return;

    this.bindFormEvents();
  },

  bindFormEvents() {
    // Autosave on input change
    this.form.addEventListener("input", () => {
      this.saveDraft();
    });

    this.form.addEventListener("change", () => {
      this.saveDraft();
    });

    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  /* --------------------------------------------------------------------------
     1. Draft Saving & Restoration
     -------------------------------------------------------------------------- */
  saveDraft() {
    if (this.isSubmitting) return;

    const data = this.getFormData();
    // Only save if at least one meaningful field has data
    if (data.name || data.email || data.company || data.message) {
      const draftObj = {
        data,
        timestamp: new Date().toISOString()
      };
      try {
        localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draftObj));
      } catch (e) {}
    }
  },

  initDraftBanner() {
    const rawDraft = localStorage.getItem(this.DRAFT_KEY);
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft);
      const container = document.querySelector("#draft-alert-container");
      if (!container) return;

      const formattedTime = new Date(draft.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      container.innerHTML = `
        <div class="draft-alert-banner">
          <div>
            <strong>Saved Draft Found</strong> (${formattedTime}) — Would you like to restore your previous inquiry?
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-sm btn-primary" id="btn-restore-draft">Restore Draft</button>
            <button type="button" class="btn btn-sm btn-secondary" id="btn-discard-draft">Discard</button>
          </div>
        </div>
      `;

      document.querySelector("#btn-restore-draft").addEventListener("click", () => {
        this.populateForm(draft.data);
        container.innerHTML = "";
        ToastManager.showToast({
          title: "Draft Restored",
          message: "Your inquiry draft has been successfully restored.",
          type: "success"
        });
      });

      document.querySelector("#btn-discard-draft").addEventListener("click", () => {
        localStorage.removeItem(this.DRAFT_KEY);
        container.innerHTML = "";
        ToastManager.showToast({
          title: "Draft Discarded",
          message: "The previous draft was removed.",
          type: "info"
        });
      });
    } catch (err) {
      localStorage.removeItem(this.DRAFT_KEY);
    }
  },

  getFormData() {
    if (!this.form) return {};

    const formData = new FormData(this.form);
    const services = [];
    this.form.querySelectorAll('input[name="services"]:checked').forEach(cb => {
      services.push(cb.value);
    });

    const budgetEl = this.form.querySelector('input[name="budget"]:checked');
    const timelineEl = this.form.querySelector('input[name="timeline"]:checked');

    return {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      company: (formData.get("company") || "").toString().trim(),
      budget: budgetEl ? budgetEl.value : "$50k – $100k",
      timeline: timelineEl ? timelineEl.value : "3 – 6 Months",
      services: services,
      message: (formData.get("message") || "").toString().trim(),
      consent: this.form.querySelector("#consent-checkbox") ? this.form.querySelector("#consent-checkbox").checked : false
    };
  },

  populateForm(data) {
    if (!this.form || !data) return;

    if (data.name) this.form.querySelector("#input-name").value = data.name;
    if (data.email) this.form.querySelector("#input-email").value = data.email;
    if (data.company) this.form.querySelector("#input-company").value = data.company;
    if (data.message) this.form.querySelector("#input-message").value = data.message;

    if (data.budget) {
      const budgetRadio = this.form.querySelector(`input[name="budget"][value="${data.budget}"]`);
      if (budgetRadio) budgetRadio.checked = true;
    }

    if (data.timeline) {
      const timelineRadio = this.form.querySelector(`input[name="timeline"][value="${data.timeline}"]`);
      if (timelineRadio) timelineRadio.checked = true;
    }

    if (Array.isArray(data.services)) {
      this.form.querySelectorAll('input[name="services"]').forEach(cb => {
        cb.checked = data.services.includes(cb.value);
      });
    }

    if (data.consent && this.form.querySelector("#consent-checkbox")) {
      this.form.querySelector("#consent-checkbox").checked = data.consent;
    }
  },

  /* --------------------------------------------------------------------------
     2. File Upload Simulation
     -------------------------------------------------------------------------- */
  initFileUpload() {
    const dropzone = document.querySelector("#file-dropzone");
    const fileInput = document.querySelector("#file-input");
    const fileListEl = document.querySelector("#file-list-container");

    if (!dropzone || !fileInput || !fileListEl) return;

    // Trigger click on file input
    dropzone.addEventListener("click", (e) => {
      if (e.target.closest(".file-item-remove")) return;
      fileInput.click();
    });

    // Drag & drop states
    ["dragenter", "dragover"].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(event => {
      dropzone.addEventListener(event, (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFilesAdded(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFilesAdded(Array.from(e.target.files));
      }
    });
  },

  handleFilesAdded(files) {
    const fileListEl = document.querySelector("#file-list-container");

    files.forEach(file => {
      const fileId = "file-" + Math.random().toString(36).substr(2, 9);
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;

      const fileObj = {
        id: fileId,
        name: file.name,
        size: formattedSize,
        type: file.type || "Document"
      };

      this.filesList.push(fileObj);

      const itemEl = document.createElement("div");
      itemEl.className = "file-item";
      itemEl.id = fileId;
      itemEl.innerHTML = `
        <div style="flex: 1; min-width: 0;">
          <div class="file-item-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <span style="font-weight: 500; font-size: 0.85rem; text-overflow: ellipsis; overflow: hidden;">${file.name}</span>
            <span class="text-muted font-mono" style="font-size: 0.75rem;">(${formattedSize})</span>
          </div>
          <div class="upload-progress-bar">
            <div class="upload-progress-fill" style="width: 0%;"></div>
          </div>
        </div>
        <button type="button" class="file-item-remove" aria-label="Remove file">&times;</button>
      `;

      fileListEl.appendChild(itemEl);

      // Simulate realistic upload progress
      const progressFill = itemEl.querySelector(".upload-progress-fill");
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 25) + 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        progressFill.style.width = progress + "%";
      }, 100);

      // Remove handler
      itemEl.querySelector(".file-item-remove").addEventListener("click", () => {
        this.filesList = this.filesList.filter(f => f.id !== fileId);
        itemEl.remove();
      });
    });

    ToastManager.showToast({
      title: "File Attached",
      message: `${files.length} document(s) uploaded successfully.`,
      type: "success"
    });
  },

  /* --------------------------------------------------------------------------
     3. Validation & Submission Handling
     -------------------------------------------------------------------------- */
  validate(data) {
    let isValid = true;
    const errors = {};

    // Clear existing error states
    document.querySelectorAll(".form-group").forEach(el => el.classList.remove("has-error"));

    // Name validation
    if (!data.name || data.name.length < 2) {
      isValid = false;
      this.showFieldError("input-name", "Please enter your full name (minimum 2 characters).");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      isValid = false;
      this.showFieldError("input-email", "Please provide a valid corporate email address.");
    }

    // Message validation
    if (!data.message || data.message.length < 15) {
      isValid = false;
      this.showFieldError("input-message", "Please share at least 15 characters regarding your project scope.");
    }

    // Consent validation
    const consentEl = document.querySelector("#consent-checkbox");
    if (consentEl && !consentEl.checked) {
      isValid = false;
      const group = consentEl.closest(".form-group") || consentEl.parentElement;
      if (group) group.classList.add("has-error");
      ToastManager.showToast({
        title: "Consent Required",
        message: "Please agree to our privacy terms and mutual NDA.",
        type: "error"
      });
    }

    return isValid;
  },

  showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const group = input.closest(".form-group");
    if (group) {
      group.classList.add("has-error");
      let msgEl = group.querySelector(".form-error-msg");
      if (!msgEl) {
        msgEl = document.createElement("div");
        msgEl.className = "form-error-msg";
        group.appendChild(msgEl);
      }
      msgEl.textContent = message;
    }
  },

  handleSubmit() {
    const data = this.getFormData();
    if (!this.validate(data)) {
      ToastManager.showToast({
        title: "Incomplete Fields",
        message: "Please review the highlighted fields in the inquiry form.",
        type: "error"
      });
      return;
    }

    this.isSubmitting = true;
    const submitBtn = this.form.querySelector("#submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
      Transmitting Encrypted Inquiry...
    `;

    // Simulate transmission delay
    setTimeout(() => {
      const inquiryId = "NX-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
      const submissionRecord = {
        id: inquiryId,
        timestamp: new Date().toISOString(),
        ...data,
        attachments: this.filesList.map(f => f.name)
      };

      // Save to localStorage history vault
      const existingHistory = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || "[]");
      existingHistory.unshift(submissionRecord);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(existingHistory));

      // Remove draft
      localStorage.removeItem(this.DRAFT_KEY);

      // Reset form
      this.form.reset();
      this.filesList = [];
      const fileListEl = document.querySelector("#file-list-container");
      if (fileListEl) fileListEl.innerHTML = "";

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      this.isSubmitting = false;

      // Show confirmation dialog
      this.showSuccessModal(submissionRecord);
    }, 1200);
  },

  showSuccessModal(record) {
    let modal = document.querySelector("#inquiry-success-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "inquiry-success-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-container">
        <button class="modal-close-btn" id="success-modal-close" aria-label="Close">&times;</button>
        <span class="badge" style="margin-bottom: 1rem; color: var(--color-success); border-color: rgba(16, 185, 129, 0.3);">
          TRANSMISSION CONFIRMED
        </span>
        <h2 class="h2" style="margin-bottom: 0.75rem;">Inquiry Received</h2>
        <p class="text-secondary" style="margin-bottom: 2rem;">
          Thank you, <strong>${record.name}</strong>. Your project dossier has been logged directly into our executive review queue.
        </p>

        <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="text-muted font-mono" style="font-size: 0.8125rem;">INQUIRY ID</span>
            <span class="font-mono" style="font-weight: 700; color: var(--accent-primary);">${record.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="text-muted font-mono" style="font-size: 0.8125rem;">BUDGET TIER</span>
            <span>${record.budget}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="text-muted font-mono" style="font-size: 0.8125rem;">TIMELINE</span>
            <span>${record.timeline}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span class="text-muted font-mono" style="font-size: 0.8125rem;">RESPONSE SLA</span>
            <span style="color: var(--color-success); font-weight: 600;">Within 24 Hours</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" id="success-modal-done">Done</button>
          <a href="work.html" class="btn btn-primary">Explore Portfolio &rarr;</a>
        </div>
      </div>
    `;

    modal.classList.add("active");

    const closeHandler = () => modal.classList.remove("active");
    modal.querySelector("#success-modal-close").addEventListener("click", closeHandler);
    modal.querySelector("#success-modal-done").addEventListener("click", closeHandler);
  },

  /* --------------------------------------------------------------------------
     4. Hidden Submissions Vault Interface
     -------------------------------------------------------------------------- */
  initSubmissionVault() {
    // Keyboard shortcut Shift + H
    document.addEventListener("keydown", (e) => {
      if (e.shiftKey && e.key === "H") {
        this.openVaultModal();
      }
    });

    // Vault trigger buttons in footer
    document.querySelectorAll("[data-open-vault]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openVaultModal();
      });
    });
  },

  openVaultModal() {
    const history = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || "[]");

    let modal = document.querySelector("#vault-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "vault-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const tableRows = history.length === 0
      ? `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No inquiries recorded yet. Submit a test inquiry on the Contact page to populate this vault.</td></tr>`
      : history.map(item => `
        <tr>
          <td class="font-mono" style="color: var(--accent-primary); font-weight: 600;">${item.id}</td>
          <td><strong>${item.name}</strong><br><span class="text-muted" style="font-size: 0.75rem;">${item.company || 'Direct'}</span></td>
          <td>${item.email}</td>
          <td>${item.budget}</td>
          <td class="font-mono" style="font-size: 0.75rem;">${new Date(item.timestamp).toLocaleDateString()}</td>
        </tr>
      `).join("");

    modal.innerHTML = `
      <div class="modal-container" style="max-width: 820px;">
        <button class="modal-close-btn" id="vault-modal-close" aria-label="Close">&times;</button>
        <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 0.5rem;">
          <h2 class="h2">Inquiry Vault & Log</h2>
          <span class="badge font-mono">${history.length} RECORDS</span>
        </div>
        <p class="text-secondary" style="font-size: 0.875rem; margin-bottom: 1.5rem;">
          Simulated local client ledger stored directly in your browser's <code>localStorage</code>.
        </p>

        <div style="overflow-x: auto; max-height: 380px;">
          <table class="vault-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Email</th>
                <th>Budget</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <button type="button" class="btn btn-sm btn-secondary" id="vault-export-json" ${history.length === 0 ? 'disabled' : ''}>Export JSON</button>
          <button type="button" class="btn btn-sm btn-secondary" id="vault-clear-all" style="color: var(--color-error); border-color: rgba(239, 68, 68, 0.3);" ${history.length === 0 ? 'disabled' : ''}>Clear Vault Records</button>
        </div>
      </div>
    `;

    modal.classList.add("active");

    modal.querySelector("#vault-modal-close").addEventListener("click", () => modal.classList.remove("active"));

    const exportBtn = modal.querySelector("#vault-export-json");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nexus-inquiries-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const clearBtn = modal.querySelector("#vault-clear-all");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to purge all inquiry logs from localStorage?")) {
          try {
            localStorage.removeItem(this.HISTORY_KEY);
          } catch (e) {}
          modal.classList.remove("active");
          ToastManager.showToast({
            title: "Vault Purged",
            message: "All stored inquiries have been erased.",
            type: "info"
          });
        }
      });
    }
  },

  /* --------------------------------------------------------------------------
     5. Bilateral Mutual Non-Disclosure Agreement (M-NDA) Modal
     -------------------------------------------------------------------------- */
  initNDAModal() {
    document.querySelectorAll("[data-open-nda]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNDAModal();
      });
    });
  },

  openNDAModal() {
    let modal = document.querySelector("#nda-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "nda-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-container" style="max-width: 720px;">
        <button class="modal-close-btn" id="nda-modal-close" aria-label="Close">&times;</button>
        <span class="badge badge-outline" style="margin-bottom: 1rem;">LEGAL GOVERNANCE</span>
        <h2 class="h2" style="margin-bottom: 0.5rem;">Bilateral Mutual NDA</h2>
        <p class="text-secondary" style="font-size: 0.875rem; margin-bottom: 1.5rem;">
          Standard Swiss &amp; Global Technology Non-Disclosure Agreement (Ref: NX-NDA-2026).
        </p>

        <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); max-height: 280px; overflow-y: auto; font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary);">
          <p style="margin-bottom: 1rem;"><strong>1. Purpose:</strong> This Agreement governs disclosures made by and between the Disclosing Party and Nexus Studio AG regarding prospective technology architecture, brand engineering, software specifications, and commercial strategies.</p>
          <p style="margin-bottom: 1rem;"><strong>2. Confidential Information:</strong> All technical schemas, proprietary algorithms, financial disclosures, UI/UX designs, and executive roadmaps transmitted through this portal shall remain strictly confidential.</p>
          <p style="margin-bottom: 1rem;"><strong>3. Non-Disclosure &amp; Security:</strong> Nexus Studio agrees to apply AES-256 equivalent standard of care and shall not disclose or distribute proprietary disclosures to third parties without prior written consent.</p>
          <p><strong>4. Governing Law:</strong> This Agreement shall be governed by and construed in accordance with the substantive laws of Switzerland, jurisdiction of the Commercial Court of the Canton of Zurich.</p>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem; gap: 1rem;">
          <button type="button" class="btn btn-primary btn-sm" id="nda-modal-acknowledge">Acknowledge Terms</button>
        </div>
      </div>
    `;

    modal.classList.add("active");

    const closeModal = () => modal.classList.remove("active");
    modal.querySelector("#nda-modal-close").addEventListener("click", closeModal);
    modal.querySelector("#nda-modal-acknowledge").addEventListener("click", closeModal);
  }
};
