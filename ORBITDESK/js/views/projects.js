/**
 * OrbitDesk Projects View Controller
 */

const OrbitProjectsView = {
  activeFilter: 'all',
  searchQuery: '',
  viewMode: 'grid', // 'grid' or 'list'
  currentDetailProjectId: null,

  init() {
    const searchInput = document.getElementById('project-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    const filterSelect = document.getElementById('project-status-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.activeFilter = e.target.value;
        this.render();
      });
    }
  },

  setViewMode(mode) {
    this.viewMode = mode;
    const gridBtn = document.getElementById('project-view-grid-btn');
    const listBtn = document.getElementById('project-view-list-btn');

    if (gridBtn && listBtn) {
      if (mode === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
      } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
      }
    }
    this.render();
  },

  render() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    const state = window.OrbitStore.state;
    let filtered = state.projects || [];

    // Filter by status
    if (this.activeFilter !== 'all') {
      if (this.activeFilter === 'active') {
        filtered = filtered.filter(p => p.status !== 'archived');
      } else {
        filtered = filtered.filter(p => p.status === this.activeFilter);
      }
    }

    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery) ||
        (p.description && p.description.toLowerCase().includes(this.searchQuery)) ||
        (p.category && p.category.toLowerCase().includes(this.searchQuery))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <div class="empty-state-title">No projects found</div>
          <div class="empty-state-desc">Try adjusting your search criteria or create a new workspace project.</div>
          <button class="btn btn-primary" onclick="OrbitModal.openProjectModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create New Project
          </button>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'grid') {
      container.className = 'projects-grid';
      container.innerHTML = filtered.map(p => this.renderProjectCard(p)).join('');
    } else {
      container.className = 'table-container';
      container.innerHTML = this.renderProjectTable(filtered);
    }

    // If detail modal is active, update its task list
    if (this.currentDetailProjectId && document.getElementById('modal-project-detail').classList.contains('active')) {
      this.populateProjectDetailTasks(this.currentDetailProjectId);
    }
  },

  renderProjectCard(p) {
    const completion = window.OrbitStore.getProjectCompletion(p.id);
    const health = window.OrbitStore.getProjectHealth(p.id);
    const tasks = window.OrbitStore.getProjectTasks(p.id);
    const lead = window.OrbitStore.getUser(p.leadId);
    const isArchived = p.status === 'archived';

    return `
      <div class="project-card ${isArchived ? 'opacity-75' : ''}">
        <div class="project-card-header">
          <div style="display:flex; align-items:center; gap: 12px;">
            <div class="project-icon-badge" style="background-color: ${p.color};">
              ${p.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div class="project-card-title">${p.name}</div>
              <span class="tag" style="margin-top:2px;">${p.category || 'General'}</span>
            </div>
          </div>
          <span class="badge badge-${health.color === 'success' ? 'status-done' : (health.color === 'warning' ? 'priority-high' : 'priority-urgent')}">
            ${health.label}
          </span>
        </div>

        <p class="project-card-desc">${p.description || 'No description provided.'}</p>

        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom: 6px;">
            <span>Progress (${tasks.filter(t => t.status === 'done').length}/${tasks.length} tasks)</span>
            <span style="font-weight:600; color:var(--text-primary);">${completion}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${health.color}" style="width: ${completion}%"></div>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; padding-top: var(--space-3); border-top: 1px solid var(--border); font-size:0.8rem; color:var(--text-muted);">
          <div style="display:flex; align-items:center; gap: 6px;">
            <div class="avatar avatar-xs" style="background-color:${lead.color}; color:white;">${lead.avatar}</div>
            <span style="font-size:0.75rem;">${lead.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap: 4px;">
            <button class="btn btn-sm btn-ghost" title="View details & tasks" onclick="OrbitProjectsView.openProjectDetail('${p.id}')">
              View
            </button>
            <button class="btn btn-sm btn-ghost" title="Edit project" onclick="OrbitModal.openProjectModal(OrbitStore.state.projects.find(x => x.id === '${p.id}'))">
              Edit
            </button>
            <button class="btn btn-sm btn-ghost" title="${isArchived ? 'Unarchive' : 'Archive'}" onclick="OrbitStore.archiveProject('${p.id}'); OrbitToast.info('Project ${isArchived ? 'unarchived' : 'archived'}');">
              ${isArchived ? 'Restore' : 'Archive'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderProjectTable(projects) {
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Category</th>
            <th>Health</th>
            <th>Progress</th>
            <th>Lead</th>
            <th>Target Date</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(p => {
            const completion = window.OrbitStore.getProjectCompletion(p.id);
            const health = window.OrbitStore.getProjectHealth(p.id);
            const tasks = window.OrbitStore.getProjectTasks(p.id);
            const lead = window.OrbitStore.getUser(p.leadId);

            return `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="OrbitProjectsView.openProjectDetail('${p.id}')">
                    <span style="width:10px; height:10px; border-radius:3px; background-color:${p.color};"></span>
                    <strong style="color:var(--text-primary);">${p.name}</strong>
                  </div>
                </td>
                <td><span class="tag">${p.category || 'General'}</span></td>
                <td>
                  <span class="badge badge-${health.color === 'success' ? 'status-done' : (health.color === 'warning' ? 'priority-high' : 'priority-urgent')}">
                    ${health.label}
                  </span>
                </td>
                <td style="min-width: 140px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="progress-track" style="flex:1;">
                      <div class="progress-fill ${health.color}" style="width: ${completion}%"></div>
                    </div>
                    <span style="font-size:0.75rem; font-weight:600;">${completion}%</span>
                  </div>
                </td>
                <td>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <div class="avatar avatar-xs" style="background-color:${lead.color}; color:white;">${lead.avatar}</div>
                    <span>${lead.name}</span>
                  </div>
                </td>
                <td><span style="font-size:0.75rem;">${p.targetDate || 'No date'}</span></td>
                <td style="text-align:right;">
                  <button class="btn btn-sm btn-ghost" onclick="OrbitProjectsView.openProjectDetail('${p.id}')">Details</button>
                  <button class="btn btn-sm btn-ghost" onclick="OrbitModal.openProjectModal(OrbitStore.state.projects.find(x => x.id === '${p.id}'))">Edit</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  openProjectDetail(projectId) {
    const project = window.OrbitStore.getProject(projectId);
    if (!project) return;

    this.currentDetailProjectId = projectId;
    const modal = document.getElementById('modal-project-detail');
    if (!modal) return;

    const titleEl = document.getElementById('project-detail-title');
    const descEl = document.getElementById('project-detail-desc');
    const addTaskBtn = document.getElementById('project-detail-add-task-btn');

    titleEl.textContent = project.name;
    descEl.textContent = project.description || 'No description provided.';

    this.populateProjectDetailTasks(projectId);

    if (addTaskBtn) {
      addTaskBtn.onclick = () => {
        window.OrbitModal.close('modal-project-detail');
        window.OrbitModal.openTaskModal(null, null, projectId);
      };
    }

    window.OrbitModal.open('modal-project-detail');
  },

  populateProjectDetailTasks(projectId) {
    const tasksContainer = document.getElementById('project-detail-tasks');
    if (!tasksContainer) return;

    const tasks = window.OrbitStore.getProjectTasks(projectId);

    if (tasks.length === 0) {
      tasksContainer.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <p class="empty-state-desc">No tasks in this project yet.</p>
        </div>
      `;
      return;
    }

    tasksContainer.innerHTML = tasks.map(t => {
      const assignee = window.OrbitStore.getUser(t.assigneeId);
      const isDone = t.status === 'done';
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding: 8px 12px; border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:6px; background-color:var(--bg-surface);">
          <div style="display:flex; align-items:center; gap:10px;">
            <label class="checkbox-label" style="margin:0;">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="OrbitStore.toggleTaskComplete('${t.id}')">
              <span class="checkbox-custom"></span>
            </label>
            <span style="font-size:0.85rem; cursor:pointer; ${isDone ? 'text-decoration:line-through; opacity:0.6;' : ''}" onclick="OrbitModal.close('modal-project-detail'); OrbitModal.openTaskModal(OrbitStore.state.tasks.find(x => x.id === '${t.id}'))">
              ${t.title}
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-priority-${t.priority}">${t.priority}</span>
            <span class="badge badge-status-${t.status}">${t.status}</span>
            <div class="avatar avatar-xs" style="background-color:${assignee.color}; color:white;" title="${assignee.name}">${assignee.avatar}</div>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.OrbitProjectsView = OrbitProjectsView;
