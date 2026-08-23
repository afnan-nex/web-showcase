/**
 * SUMMIT EVENTS — DIGITAL TICKETS WALLET JAVASCRIPT
 * Displays purchased digital passes, dynamic SVG QR codes, ticket inspection modal, transfers, calendar sync, printing.
 */

document.addEventListener("DOMContentLoaded", () => {
  SummitTicketsWallet.init();
});

const SummitTicketsWallet = {
  tickets: [],
  activeFilter: "active", // active, past, transferred

  init() {
    this.createTransferModalDOM();
    this.createPassViewerModalDOM();
    this.bindFilterTabs();
    this.renderTickets();

    window.addEventListener("ticketsUpdated", () => this.renderTickets());
  },

  bindFilterTabs() {
    const tabs = document.querySelectorAll(".tkt-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.activeFilter = tab.getAttribute("data-tab");
        this.renderTickets();
      });
    });
  },

  renderTickets() {
    this.tickets = SummitStorage.getTickets();
    const container = document.getElementById("tickets-wallet-container");
    if (!container) return;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    let filtered = this.tickets;
    if (this.activeFilter === "active") {
      filtered = this.tickets.filter(t => t.status === "active" && t.eventDate >= todayStr);
    } else if (this.activeFilter === "past") {
      filtered = this.tickets.filter(t => t.status === "past" || t.eventDate < todayStr);
    } else if (this.activeFilter === "transferred") {
      filtered = this.tickets.filter(t => t.status === "transferred");
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl);">
          <svg class="icon" viewBox="0 0 24 24" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <h3>No ${this.activeFilter} digital passes found</h3>
          <p style="margin: 0.5rem 0 1.5rem; color: var(--text-muted);">Explore upcoming events and reserve your digital passes today.</p>
          <a href="events.html" class="btn btn-primary">Discover Events &rarr;</a>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const qrSvg = SummitUI.generateQRCodeSVG(`SUMMIT:${t.id}:${t.orderId}:${t.barcode}`, 100, "#FFFFFF", "transparent");

      return `
        <div class="pass-card" data-ticket-id="${t.id}">
          <div class="pass-header" style="background: linear-gradient(135deg, ${t.accentColor || '#FF3366'}, #111);">
            <div>
              <span style="font-size:0.7rem; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;">SUMMIT PASS</span>
              <div style="font-family:monospace; font-size:0.8rem; font-weight:700;">#${t.id}</div>
            </div>
            <span class="badge ${t.status === 'transferred' ? 'badge-seat' : 'badge-live'}">
              ${t.status === 'transferred' ? 'Transferred' : 'Active'}
            </span>
          </div>

          <div class="pass-body">
            <h3 class="pass-title">${t.eventTitle}</h3>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; display:block;">Date & Time</span>
                <strong style="font-size:0.85rem;">${t.eventDateDisplay}</strong>
              </div>
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; display:block;">Tier</span>
                <strong style="font-size:0.85rem; color:var(--brand-primary);">${t.tierName}</strong>
              </div>
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; display:block;">Venue</span>
                <span style="font-size:0.85rem;">${t.venueName}</span>
              </div>
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; display:block;">Seats</span>
                <span style="font-size:0.85rem; font-weight:700;">${(t.seats || []).join(', ')}</span>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface-raised); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-color-subtle);">
              <div>
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; display:block;">Attendee</span>
                <strong style="font-size:0.9rem;">${t.attendeeName}</strong>
                ${t.status === 'transferred' ? `<span style="font-size:0.75rem; color:var(--accent-cyan); display:block;">Sent to: ${t.transferredTo}</span>` : ''}
              </div>
              <div>
                ${qrSvg}
              </div>
            </div>
          </div>

          <div class="pass-footer-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-view-full-pass" data-tkt-id="${t.id}" style="flex:1;">
              View Digital Pass
            </button>
            ${t.status === 'active' ? `
              <button type="button" class="btn btn-outline btn-sm btn-transfer-pass" data-tkt-id="${t.id}">
                Transfer
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");

    // View Pass Action
    container.querySelectorAll(".btn-view-full-pass").forEach(btn => {
      btn.addEventListener("click", () => {
        const tktId = btn.getAttribute("data-tkt-id");
        this.openPassViewer(tktId);
      });
    });

    // Transfer Action
    container.querySelectorAll(".btn-transfer-pass").forEach(btn => {
      btn.addEventListener("click", () => {
        const tktId = btn.getAttribute("data-tkt-id");
        this.openTransferModal(tktId);
      });
    });
  },

  // ----------------- FULL PASS VIEWER MODAL -----------------
  createPassViewerModalDOM() {
    if (document.getElementById("summit-pass-viewer-modal")) return;

    const modalHTML = `
      <div id="summit-pass-viewer-modal" class="general-modal" role="dialog" aria-modal="true">
        <div class="modal-backdrop"></div>
        <div class="modal-container animate-scale-up" style="max-width: 700px;">
          <div class="modal-header">
            <span class="checkout-brand-badge">DIGITAL PASS WALLET</span>
            <button type="button" class="modal-close" id="btn-close-pass-viewer">&times;</button>
          </div>
          <div class="modal-body" id="pass-viewer-modal-body" style="padding: 2rem; overflow-y: auto;">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    document.getElementById("btn-close-pass-viewer").addEventListener("click", () => {
      SummitUI.closeModal("summit-pass-viewer-modal");
    });
  },

  openPassViewer(ticketId) {
    const ticket = SummitStorage.getTicketById(ticketId);
    if (!ticket) return;

    const bodyEl = document.getElementById("pass-viewer-modal-body");
    const qrSvg = SummitUI.generateQRCodeSVG(`SUMMIT:${ticket.id}:${ticket.orderId}:${ticket.attendeeName}:${ticket.barcode}`, 180, "#000000", "#FFFFFF");

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="digital-ticket-container" style="margin-bottom:1.5rem;">
          <div class="ticket-header-strip" style="background: linear-gradient(135deg, ${ticket.accentColor || '#FF3366'}, #111);">
            <div class="ticket-brand">SUMMIT DIGITAL PASS</div>
            <div class="ticket-id-tag">${ticket.id}</div>
          </div>

          <div class="ticket-body-content">
            <div class="ticket-hero-details">
              <h4 class="ticket-event-title">${ticket.eventTitle}</h4>
              <div class="ticket-meta-grid">
                <div class="meta-item">
                  <span class="meta-lbl">DATE</span>
                  <span class="meta-val">${ticket.eventDateDisplay}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">TIME / DOORS</span>
                  <span class="meta-val">${ticket.eventTimeDisplay}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">VENUE</span>
                  <span class="meta-val">${ticket.venueName}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">LOCATION</span>
                  <span class="meta-val">${ticket.venueCity}</span>
                </div>
              </div>
            </div>

            <div class="ticket-perforated-divider">
              <div class="notch notch-left"></div>
              <div class="perforated-line"></div>
              <div class="notch notch-right"></div>
            </div>

            <div class="ticket-stub-details">
              <div class="stub-info">
                <div class="stub-row">
                  <div>
                    <span class="meta-lbl">ATTENDEE</span>
                    <span class="meta-val text-bold">${ticket.attendeeName}</span>
                  </div>
                  <div>
                    <span class="meta-lbl">TIER</span>
                    <span class="meta-val text-accent">${ticket.tierName}</span>
                  </div>
                </div>
                <div class="stub-row mt-2">
                  <div>
                    <span class="meta-lbl">SEATS</span>
                    <span class="meta-val">${(ticket.seats || []).join(", ")}</span>
                  </div>
                  <div>
                    <span class="meta-lbl">ORDER ID</span>
                    <span class="meta-val">#${ticket.orderId}</span>
                  </div>
                </div>
              </div>

              <div class="stub-qr-code">
                ${qrSvg}
                <span class="qr-caption">Pass Barcode: ${ticket.barcode.substring(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:1rem;">
          <button type="button" class="btn btn-primary" onclick="window.print()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Pass (PDF)
          </button>
          <button type="button" class="btn btn-secondary" id="btn-viewer-add-cal">
            Add to Calendar
          </button>
        </div>
      `;

      document.getElementById("btn-viewer-add-cal").addEventListener("click", () => {
        const event = SummitStorage.getEventById(ticket.eventId) || {
          title: ticket.eventTitle,
          date: ticket.eventDate,
          venueName: ticket.venueName,
          address: ticket.venueCity,
          slug: "summit-pass"
        };
        SummitUI.downloadCalendarEvent(event);
      });
    }

    SummitUI.openModal("summit-pass-viewer-modal");
  },

  // ----------------- TRANSFER TICKET MODAL -----------------
  createTransferModalDOM() {
    if (document.getElementById("summit-transfer-modal")) return;

    const modalHTML = `
      <div id="summit-transfer-modal" class="general-modal" role="dialog" aria-modal="true">
        <div class="modal-backdrop"></div>
        <div class="modal-container animate-scale-up" style="max-width: 500px;">
          <div class="modal-header">
            <div>
              <span class="checkout-brand-badge">TRANSFER PASS</span>
              <h3 class="modal-title" style="margin-top:0.2rem;">Send Ticket to Friend</h3>
            </div>
            <button type="button" class="modal-close" id="btn-close-transfer-modal">&times;</button>
          </div>
          <div class="modal-body" style="padding: 2rem;">
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1.5rem;">
              Transferring this digital ticket pass will generate a new cryptographic QR code and issue the pass directly to your recipient.
            </p>
            <form id="transfer-ticket-form">
              <input type="hidden" id="transfer-ticket-target-id" />
              <div class="form-group" style="margin-bottom:1rem;">
                <label for="transfer-recipient-email" class="field-label required">Recipient Email Address</label>
                <input type="email" id="transfer-recipient-email" class="form-control" required placeholder="friend@example.com" />
              </div>
              <div class="form-group" style="margin-bottom:1.5rem;">
                <label for="transfer-note" class="field-label">Personal Message (Optional)</label>
                <textarea id="transfer-note" class="form-control" rows="2" placeholder="Here is your ticket for the event! See you there."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block">
                Confirm & Transfer Ticket Pass &rarr;
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    document.getElementById("btn-close-transfer-modal").addEventListener("click", () => {
      SummitUI.closeModal("summit-transfer-modal");
    });

    document.getElementById("transfer-ticket-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const tktId = document.getElementById("transfer-ticket-target-id").value;
      const recipientEmail = document.getElementById("transfer-recipient-email").value.trim();

      if (!recipientEmail) return;

      const success = SummitStorage.transferTicket(tktId, recipientEmail);
      if (success) {
        SummitUI.showToast(`Ticket pass transferred to ${recipientEmail} 🎉`, "success");
        SummitUI.closeModal("summit-transfer-modal");
        this.renderTickets();
      }
    });
  },

  openTransferModal(ticketId) {
    document.getElementById("transfer-ticket-target-id").value = ticketId;
    document.getElementById("transfer-recipient-email").value = "";
    SummitUI.openModal("summit-transfer-modal");
  }
};
