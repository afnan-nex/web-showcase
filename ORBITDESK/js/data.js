/**
 * OrbitDesk Data Layer & Realistic SaaS Seed Generator
 * Manages local storage persistence, state hydration, export/import, and initial data.
 */

const STORAGE_KEY = 'orbitdesk_state_v1';
const AUTH_KEY = 'orbitdesk_auth_session_v1';

// Helper to format ISO dates relative to today
function getDateOffset(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// Seed Team Members (Believable Engineering & Product Org)
const DEFAULT_USERS = [
  { id: 'usr-1', name: 'Alex Rivera', email: 'alex.rivera@orbitdesk.io', role: 'VP of Product', avatar: 'AR', color: '#4f46e5' },
  { id: 'usr-2', name: 'Elena Rostova', email: 'elena.rostova@orbitdesk.io', role: 'Staff Infrastructure Architect', avatar: 'ER', color: '#0ea5e9' },
  { id: 'usr-3', name: 'Marcus Chen', email: 'marcus.chen@orbitdesk.io', role: 'Lead Frontend Engineer', avatar: 'MC', color: '#10b981' },
  { id: 'usr-4', name: 'Sarah Jenkins', email: 'sarah.jenkins@orbitdesk.io', role: 'Principal Product Designer', avatar: 'SJ', color: '#f59e0b' },
  { id: 'usr-5', name: 'David Kim', email: 'david.kim@orbitdesk.io', role: 'Site Reliability Lead', avatar: 'DK', color: '#8b5cf6' },
  { id: 'usr-6', name: 'Priya Sharma', email: 'priya.sharma@orbitdesk.io', role: 'Cloud Platform Engineer', avatar: 'PS', color: '#06b6d4' },
  { id: 'usr-7', name: 'Liam O\'Connor', email: 'liam.oconnor@orbitdesk.io', role: 'Security Operations Engineer', avatar: 'LO', color: '#ec4899' }
];

// Seed Projects
const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Orbit UI v2 Design System',
    description: 'Complete overhaul of web design tokens, typography scales, WCAG 2.1 AAA accessibility contrast, and micro-interactions.',
    status: 'inprogress',
    color: '#4f46e5',
    category: 'Design & UX',
    leadId: 'usr-4',
    createdAt: getDateOffset(-25),
    targetDate: getDateOffset(14)
  },
  {
    id: 'proj-2',
    name: 'Multi-Region Kubernetes Migration',
    description: 'Transitioning core microservice clusters to multi-region EKS with automated zero-downtime canary rollouts and Istio service mesh.',
    status: 'inprogress',
    color: '#0ea5e9',
    category: 'DevOps & Infra',
    leadId: 'usr-5',
    createdAt: getDateOffset(-40),
    targetDate: getDateOffset(7)
  },
  {
    id: 'proj-3',
    name: 'Enterprise SAML 2.0 & SCIM Integration',
    description: 'Okta, Azure AD, and Google Workspace SSO integration with SCIM v2 automated user provisioning and granular RBAC matrix.',
    status: 'inprogress',
    color: '#10b981',
    category: 'Security & Auth',
    leadId: 'usr-2',
    createdAt: getDateOffset(-18),
    targetDate: getDateOffset(21)
  },
  {
    id: 'proj-4',
    name: 'Offline-First Mobile Sync Engine',
    description: 'SQLite CRDT sync engine, APNS background push notifications, and biometric auth for iOS & Android native clients.',
    status: 'todo',
    color: '#8b5cf6',
    category: 'Mobile Engine',
    leadId: 'usr-3',
    createdAt: getDateOffset(-12),
    targetDate: getDateOffset(35)
  },
  {
    id: 'proj-5',
    name: 'GraphQL Federation Gateway v3',
    description: 'Unified subgraph query planner, Apollo Router migration, and Redis cache layer under 15ms p99 latency SLA.',
    status: 'inprogress',
    color: '#06b6d4',
    category: 'Core Services',
    leadId: 'usr-1',
    createdAt: getDateOffset(-10),
    targetDate: getDateOffset(28)
  }
];

// Seed Tasks
const DEFAULT_TASKS = [
  {
    id: 'tsk-101',
    title: 'Audit WCAG 2.1 AA accessibility contrast ratios across all buttons',
    projectId: 'proj-1',
    assigneeId: 'usr-4',
    priority: 'high',
    status: 'done',
    dueDate: getDateOffset(-3),
    tags: ['Design', 'A11y', 'Figma'],
    description: 'Ensure all primary and secondary button components meet minimum 4.5:1 contrast against surface tokens in light and dark mode.',
    createdAt: getDateOffset(-14)
  },
  {
    id: 'tsk-102',
    title: 'Implement Dark Mode CSS variable tokens & seamless switch transition',
    projectId: 'proj-1',
    assigneeId: 'usr-3',
    priority: 'urgent',
    status: 'done',
    dueDate: getDateOffset(-1),
    tags: ['Frontend', 'Theme', 'CSS'],
    description: 'Implement root data-theme toggling and verify contrast ratios for zinc and slate palette with zero-flash rehydration.',
    createdAt: getDateOffset(-10)
  },
  {
    id: 'tsk-103',
    title: 'Build Figma Component Library token sync CLI script',
    projectId: 'proj-1',
    assigneeId: 'usr-4',
    priority: 'medium',
    status: 'inreview',
    dueDate: getDateOffset(2),
    tags: ['DesignOps', 'Figma', 'CLI'],
    description: 'Automate JSON design tokens export from Figma Styles to variables.css via webhooks and GitHub Actions.',
    createdAt: getDateOffset(-6)
  },
  {
    id: 'tsk-104',
    title: 'Design high-density 32px data table with sticky headers & zebra rows',
    projectId: 'proj-1',
    assigneeId: 'usr-1',
    priority: 'high',
    status: 'inprogress',
    dueDate: getDateOffset(1),
    tags: ['UI', 'Tables', 'Components'],
    description: 'Compact 32px row height table with multi-column sorting, column reordering, and batch selection checkboxes.',
    createdAt: getDateOffset(-4)
  },
  {
    id: 'tsk-105',
    title: 'Provision multi-region EKS clusters in us-east-1 and eu-west-1',
    projectId: 'proj-2',
    assigneeId: 'usr-5',
    priority: 'urgent',
    status: 'done',
    dueDate: getDateOffset(-6),
    tags: ['Terraform', 'Kubernetes', 'AWS'],
    description: 'Deploy Terraform modules for EKS clusters with VPC peering, Cilium CNI, and ingress controllers.',
    createdAt: getDateOffset(-28)
  },
  {
    id: 'tsk-106',
    title: 'Configure Prometheus and Grafana alertmanager endpoints',
    projectId: 'proj-2',
    assigneeId: 'usr-6',
    priority: 'high',
    status: 'inreview',
    dueDate: getDateOffset(0), // Due Today
    tags: ['Monitoring', 'SRE', 'Grafana'],
    description: 'Set up P99 latency alerts and error threshold rules (>0.1% 5xx) for API gateway endpoints.',
    createdAt: getDateOffset(-8)
  },
  {
    id: 'tsk-107',
    title: 'Stress-test Redis cluster failover under 50,000 requests/sec',
    projectId: 'proj-2',
    assigneeId: 'usr-2',
    priority: 'urgent',
    status: 'inprogress',
    dueDate: getDateOffset(-1), // Overdue for demo realism
    tags: ['Performance', 'Infra', 'Redis'],
    description: 'Simulate primary node network partition with Chaos Mesh and measure replica promotion latency.',
    createdAt: getDateOffset(-9)
  },
  {
    id: 'tsk-108',
    title: 'Integrate SAML 2.0 metadata parser for Okta and Azure AD SSO',
    projectId: 'proj-3',
    assigneeId: 'usr-2',
    priority: 'urgent',
    status: 'inprogress',
    dueDate: getDateOffset(3),
    tags: ['Auth', 'Security', 'SAML'],
    description: 'Support SP-initiated and IdP-initiated SAML assertion validation with certificate rollover logic.',
    createdAt: getDateOffset(-15)
  },
  {
    id: 'tsk-109',
    title: 'Create RBAC permission matrix for Custom Enterprise Roles',
    projectId: 'proj-3',
    assigneeId: 'usr-7',
    priority: 'high',
    status: 'todo',
    dueDate: getDateOffset(5),
    tags: ['Security', 'RBAC', 'Backend'],
    description: 'Define granular CRUD capabilities for Workspace Owner, Team Admin, Billing Manager, and Read-Only Auditor.',
    createdAt: getDateOffset(-5)
  },
  {
    id: 'tsk-110',
    title: 'Build automated SCIM v2 user deprovisioning webhook endpoint',
    projectId: 'proj-3',
    assigneeId: 'usr-7',
    priority: 'medium',
    status: 'todo',
    dueDate: getDateOffset(9),
    tags: ['SCIM', 'Security', 'API'],
    description: 'Handle instant employee offboarding signals from Okta and revoke active sessions immediately.',
    createdAt: getDateOffset(-3)
  },
  {
    id: 'tsk-111',
    title: 'Implement SQLite offline CRDT sync protocol on iOS client',
    projectId: 'proj-4',
    assigneeId: 'usr-3',
    priority: 'high',
    status: 'todo',
    dueDate: getDateOffset(14),
    tags: ['Mobile', 'Offline', 'SQLite'],
    description: 'Bidirectional sync with Conflict-Free Replicated Data Types (CRDTs) to handle concurrent edits offline.',
    createdAt: getDateOffset(-7)
  },
  {
    id: 'tsk-112',
    title: 'Implement Push Notification payloads for iOS APNS and Android FCM',
    projectId: 'proj-4',
    assigneeId: 'usr-3',
    priority: 'medium',
    status: 'backlog',
    dueDate: getDateOffset(20),
    tags: ['Mobile', 'iOS', 'FCM'],
    description: 'Support rich notification actions with inline task completion and mention alerts.',
    createdAt: getDateOffset(-5)
  },
  {
    id: 'tsk-113',
    title: 'Deploy Apollo Router v1.38 with distributed tracing via OpenTelemetry',
    projectId: 'proj-5',
    assigneeId: 'usr-1',
    priority: 'medium',
    status: 'inprogress',
    dueDate: getDateOffset(7),
    tags: ['GraphQL', 'Tracing', 'Apollo'],
    description: 'Inject traceparent headers across all downstream REST and gRPC microservices.',
    createdAt: getDateOffset(-4)
  },
  {
    id: 'tsk-114',
    title: 'Benchmarking GraphQL query cost analysis algorithm',
    projectId: 'proj-5',
    assigneeId: 'usr-2',
    priority: 'low',
    status: 'backlog',
    dueDate: getDateOffset(24),
    tags: ['GraphQL', 'Security', 'DoS'],
    description: 'Limit cyclic query depths to prevent Denial of Service on nested relations.',
    createdAt: getDateOffset(-2)
  }
];

// Seed Activities
const DEFAULT_ACTIVITIES = [
  {
    id: 'act-1',
    actorId: 'usr-4',
    action: 'completed task',
    target: 'Audit WCAG 2.1 AA accessibility contrast ratios across all buttons',
    projectId: 'proj-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString()
  },
  {
    id: 'act-2',
    actorId: 'usr-3',
    action: 'completed task',
    target: 'Implement Dark Mode CSS variable tokens & seamless switch transition',
    projectId: 'proj-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    id: 'act-3',
    actorId: 'usr-6',
    action: 'submitted for review',
    target: 'Configure Prometheus and Grafana alertmanager endpoints',
    projectId: 'proj-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'act-4',
    actorId: 'usr-7',
    action: 'created task',
    target: 'Create RBAC permission matrix for Custom Enterprise Roles',
    projectId: 'proj-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString()
  },
  {
    id: 'act-5',
    actorId: 'usr-2',
    action: 'updated status on',
    target: 'Integrate SAML 2.0 metadata parser for Okta and Azure AD SSO',
    projectId: 'proj-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString()
  }
];

// Seed Workspaces List
const DEFAULT_WORKSPACES = [
  { id: 'ws-1', name: 'Acme Software Corp', plan: 'Enterprise Plan', isCurrent: true },
  { id: 'ws-2', name: 'OrbitLabs Research', plan: 'Pro Plan', isCurrent: false },
  { id: 'ws-3', name: 'Personal Playground', plan: 'Starter Plan', isCurrent: false }
];

// Data Layer Singleton
const OrbitData = {
  getInitialState() {
    return {
      workspaces: JSON.parse(JSON.stringify(DEFAULT_WORKSPACES)),
      users: JSON.parse(JSON.stringify(DEFAULT_USERS)),
      projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
      tasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
      activities: JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES)),
      settings: {
        workspaceName: 'Acme Software Corp',
        timezone: 'UTC-05:00 (Eastern Time)',
        dateFormat: 'YYYY-MM-DD',
        emailNotifications: true,
        activityDigest: 'daily',
        autoArchiveDays: 30
      }
    };
  },

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = this.getInitialState();
        this.saveState(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error('Malformed state in storage');
      }
      return parsed;
    } catch (e) {
      console.warn('Storage corrupted or empty, resetting baseline state:', e);
      const initial = this.getInitialState();
      this.saveState(initial);
      return initial;
    }
  },

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  },

  resetWorkspace() {
    const fresh = this.getInitialState();
    this.saveState(fresh);
    return fresh;
  },

  generateDemoData() {
    const demo = this.getInitialState();
    this.saveState(demo);
    return demo;
  },

  exportJSON() {
    try {
      const state = this.loadState();
      const filename = `orbitdesk_backup_${state.settings.workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      if (window.OrbitToast) {
        window.OrbitToast.success('Workspace backup exported successfully.');
      }
    } catch (e) {
      if (window.OrbitToast) {
        window.OrbitToast.error('Failed to export backup: ' + e.message);
      }
    }
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.tasks || !Array.isArray(parsed.tasks) || !parsed.projects || !Array.isArray(parsed.projects)) {
        throw new Error('Invalid schema: file must contain valid tasks and projects arrays.');
      }
      this.saveState(parsed);
      return { success: true, state: parsed };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

window.OrbitData = OrbitData;
