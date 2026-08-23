/**
 * NORTHSTAR COMMERCE - Information & Policy Modal Component
 * Renders complete, authentic brand policies, sustainability monographs, and terms.
 */

import { getSvgIcon } from '../utils/helpers.js';

const INFO_CONTENT = {
  privacy: {
    title: 'Client Privacy & Data Confidentiality',
    subtitle: 'Revision 2026.08 — Northstar Atelier Compliance',
    body: `
      <p>Northstar Commerce collects client data exclusively for the fulfillment of orders, courier dispatch tracking, and archival warranty records. We do not sell, rent, or trade client telemetry or payment credentials to third-party data brokers.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Information Collected</h4>
      <p>When an order is authorized, we record full name, shipping destination, encrypted contact info, and tokenized payment verification. We do not store raw cardholder CVV codes.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Local Storage</h4>
      <p>Your shopping bag, saved wishlist, and local order logs are persisted directly inside your client browser storage for instant retrieval and offline continuity.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Data Erasure</h4>
      <p>Clients may purge all stored local profile data anytime via the Client Portal settings or by clearing browser cache.</p>
    `
  },
  terms: {
    title: 'Terms of Sale & Client Agreement',
    subtitle: 'Governing Archival Acquisitions',
    body: `
      <p>By authorizing an order through Northstar Commerce, you agree to our standard terms of sale, authentic craftsmanship certifications, and courier dispatch guidelines.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Order Authenticity</h4>
      <p>All items listed on Northstar Commerce are 100% authentic, numbered studio editions crafted in direct collaboration with our partner ateliers in Biella, Florence, Kyoto, and Okayama.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Pricing & Taxes</h4>
      <p>Prices are denominated in USD. Applicable local state taxes and duties are computed and itemized transparently at checkout prior to final payment authorization.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Title of Goods</h4>
      <p>Title and risk of loss pass to the client upon recorded courier handover with signature verification.</p>
    `
  },
  sustainability: {
    title: 'The Sustainability & Materials Manifesto',
    subtitle: 'Traceable Textiles, Recycled Alloys & Zero Waste Packaging',
    body: `
      <p>We reject planned obsolescence. Our design philosophy mandates that every garment, acoustic peripheral, and ceramic vessel withstand decades of tactile utility.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Traceable Raw Fibres</h4>
      <p>100% of our wools are sourced from non-mulesed farms in Biella and Australia. Our denim uses GOTS certified organic long-staple cotton, woven on vintage Japanese low-tension shuttle looms.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Monolithic Metals</h4>
      <p>Our electronics utilize Grade 5 aerospace titanium and 6061-T6 aluminum milled with 98% recycled swarf recovery.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Circular Packaging</h4>
      <p>All shipments are dispatched in FSC-certified unbleached corrugated cartons with water-activated starch tape and unbleached organic cotton dust bags.</p>
    `
  },
  shipping: {
    title: 'Worldwide Concierge Courier & Shipping',
    subtitle: 'Insured Priority Dispatch',
    body: `
      <p>Every Northstar order is inspected by hand, wrapped in organic cotton dust packaging, and dispatched via insured courier.</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
        <tr style="border-bottom: 1px solid var(--color-border); font-weight: 600;">
          <td style="padding: 8px 0;">Method</td>
          <td style="padding: 8px 0;">Transit Window</td>
          <td style="padding: 8px 0; text-align: right;">Cost</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-border-subtle);">
          <td style="padding: 8px 0;">Standard Tracked Delivery</td>
          <td style="padding: 8px 0;">3–5 Business Days</td>
          <td style="padding: 8px 0; text-align: right;">Free over $150 ($15 below)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-border-subtle);">
          <td style="padding: 8px 0;">Express Priority Courier</td>
          <td style="padding: 8px 0;">1–2 Business Days</td>
          <td style="padding: 8px 0; text-align: right;">$25.00</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">White-Glove Overnight</td>
          <td style="padding: 8px 0;">Next Day (Morning)</td>
          <td style="padding: 8px 0; text-align: right;">$45.00</td>
        </tr>
      </table>
      <p>All shipments include end-to-end tracking and direct signature verification upon delivery.</p>
    `
  },
  returns: {
    title: '30-Day Doorstep Complimentary Returns',
    subtitle: 'Hassle-Free Trial Guarantee',
    body: `
      <p>We want you to experience our pieces in your personal daily environment. If any item does not exceed your exacting expectations, return it within 30 days of delivery.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Condition of Returns</h4>
      <p>Items must be in unworn, unwashed condition with intact security tags, original dust bags, and presentation boxes.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Prepaid Courier Pickup</h4>
      <p>Initiate a return request via your Client Portal. We supply a prepaid DHL/FedEx return label and schedule a doorstep courier collection at your convenience.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Rapid Refund</h4>
      <p>Refunds are credited to your original payment method within 48 hours of atelier inspection.</p>
    `
  },
  warranty: {
    title: 'Lifetime Archival Warranty',
    subtitle: 'Structural Integrity Guarantee',
    body: `
      <p>Northstar pieces are engineered to outlive temporary trends. We provide comprehensive repair and warranty coverage against structural and material defects.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Outerwear & Leather Goods</h4>
      <p>Lifetime coverage for hardware (zippers, horn buttons, rivets) and structural stitching seams.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Electronics & Acoustics</h4>
      <p>3-Year comprehensive hardware warranty covering planar transducer drivers, wireless charging ICs, and mechanical keyboard switches.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Atelier Restoration Service</h4>
      <p>Our European ateliers provide re-waxing, leather conditioning, and sole replacement services at nominal cost.</p>
    `
  },
  security: {
    title: 'Security Verification & Payment Protocols',
    subtitle: 'Bank-Grade 256-Bit SSL Protection',
    body: `
      <p>All transactions processed through Northstar Commerce are encrypted end-to-end adhering to Level 1 PCI-DSS financial industry standards.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. End-to-End Encryption</h4>
      <p>Payment data is transmitted over TLS 1.3 cryptographic protocols with modern AES-256 GCM cipher suites.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Fraud Shielding</h4>
      <p>3D-Secure 2.0 biometric verification and real-time velocity monitoring protect client identities against unauthorized card usage.</p>
    `
  }
};

export const InfoModal = {
  modalEl: null,

  init() {
    this.modalEl = document.getElementById('info-modal');
    if (!this.modalEl) return;

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
    });

    // Global listener for info triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-info-topic]');
      if (trigger) {
        e.preventDefault();
        const topic = trigger.getAttribute('data-info-topic');
        this.open(topic);
      }
    });
  },

  open(topicKey) {
    if (!this.modalEl) return;
    const content = INFO_CONTENT[topicKey] || INFO_CONTENT.privacy;

    const card = this.modalEl.querySelector('.info-modal-card');
    if (card) {
      card.innerHTML = `
        <button type="button" class="modal-close-btn" aria-label="Close information dialog">
          ${getSvgIcon('close')}
        </button>
        <div class="text-xs text-uppercase font-semibold" style="letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 4px;">
          ${content.subtitle}
        </div>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-4);">${content.title}</h2>
        <div class="divider-subtle" style="margin: 12px 0 18px;"></div>
        <div style="font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7;">
          ${content.body}
        </div>
        <div style="margin-top: var(--space-8); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-primary btn-sm modal-close-btn">Understood</button>
        </div>
      `;
    }

    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }
};
