/**
 * OrbitDesk Dashboard View Controller
 */

const OrbitDashboardView = {
  render() {
    const state = window.OrbitStore.state;
    const stats = window.OrbitStore.getStats();

    // 1. Update KPI Cards
    const kpiProjects = document.getElementById('dash-kpi-projects');
    const kpiTasks = document.getElementById('dash-kpi-tasks');
    const kpiRate = document.getElementById('dash-kpi-rate');
    const kpiOverdue = document.getElementById('dash-kpi-overdue');

    if (kpiProjects) kpiProjects.textContent = stats.activeProjects;
    if (kpiTasks) kpiTasks.textContent = (stats.totalTasks - stats.completedTasks);
    if (kpiRate) kpiRate.textContent = `${stats.completionRate}%`;
    if (kpiOverdue) {
      kpiOverdue.textContent = stats.overdueTasks;
      const card = kpiOverdue.closest('.kpi-card');
      if (stats.overdueTasks > 0) {
        kpiOverdue.style.color = 'var(--danger)';
      } else {
        kpiOverdue.style.color = 'var(--success)';
      }
    }

    // 2. Render Velocity Chart
    const past7DaysCompleted = [2, 4, 3, 5, 7, stats.completedTasks > 4 ? 4 : 2, stats.completedTasks];
    const past7DaysCreated = [3, 2, 4, 6, 5, 3, stats.totalTasks > 6 ? 5 : 3];
    window.OrbitCharts.renderVelocityChart('dash-velocity-canvas', {
      completed: past7DaysCompleted,
      created: past7DaysCreated
    });

    // 3. Render Active Projects Widget
    this.renderProjectsWidget();

    // 4. Render Upcoming Deadlines Widget
    this.renderUpcomingTasksWidget();

    // 5. Render Activity Stream
    this.renderActivityStream();
  },

  renderProjectsWidget() {
    const container = document.getElementById('dash-projects-list');
    if (!container) return;

    const state = window.OrbitStore.state;
    const activeProjects = state.projects.filter(p => p.status !== 'archived').slice(0, 4);

    if (activeProjects.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 20px;">
          <p class="empty-state-desc">No active projects found.</p>
          <button class="btn btn-sm btn-primary" onclick="OrbitModal.openProjectModal()">+ Create Project</button>
        </div>
      `;
      return;
    }

    container.innerHTML = activeProjects.map(p => {
      const completion = window.OrbitStore.getProjectCompletion(p.id);
      const health = window.OrbitStore.getProjectHealth(p.id);
      const tasks = window.OrbitStore.getProjectTasks(p.id);

      return `
        <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-3); cursor: pointer;" onclick="OrbitProjectsView.openProjectDetail('${p.id}')">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="width:10px; height:10px; border-radius:3px; background-color:${p.color}; display:inline-block;"></span>
              <strong style="font-size:0.9rem; color:var(--text-primary);">${p.name}</strong>
            </div>
            <span class="badge badge-${health.color === 'success' ? 'status-done' : (health.color === 'warning' ? 'priority-high' : 'priority-urgent')}">
              ${health.label}
            </span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom: 6px;">
            <span>${tasks.length} tasks</span>
            <span style="font-weight:600;">${completion}% done</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${health.color}" style="width: ${completion}%"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderUpcomingTasksWidget() {
    const container = document.getElementById('dash-upcoming-list');
    if (!container) return;

    const state = window.OrbitStore.state;
    const openTasks = state.tasks
      .filter(t => t.status !== 'done')
      .sort((a, b) => (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1)
      .slice(0, 5);

    if (openTasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <p class="empty-state-desc">All tasks completed! Great work.</p>
        </div>
      `;
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    container.innerHTML = openTasks.map(t => {
      const isOverdue = t.dueDate && t.dueDate < todayStr;
      const isToday = t.dueDate === todayStr;
      const proj = window.OrbitStore.getProject(t.projectId);
      const assignee = window.OrbitStore.getUser(t.assigneeId);

      let dateBadge = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.dueDate || 'No date'}</span>`;
      if (isOverdue) {
        dateBadge = `<span class="badge badge-priority-urgent">Overdue</span>`;
      } else if (isToday) {
        dateBadge = `<span class="badge badge-priority-medium">Today</span>`;
      }

      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid var(--border);">
          <div style="display:flex; align-items:center; gap: 10px; flex:1; min-width:0;">
            <label class="checkbox-label" style="margin:0;">
              <input type="checkbox" onchange="OrbitStore.toggleTaskComplete('${t.id}')">
              <span class="checkbox-custom"></span>
            </label>
            <div style="overflow:hidden;">
              <div class="text-truncate" style="font-size:0.875rem; font-weight:500; color:var(--text-primary); cursor:pointer;" onclick="OrbitModal.openTaskModal(OrbitStore.state.tasks.find(x => x.id === '${t.id}'))">
                ${t.title}
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted);">
                ${proj.name} • ${assignee.name}
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap: 8px; flex-shrink:0;">
            ${dateBadge}
            <span class="badge badge-priority-${t.priority}">${t.priority}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  renderActivityStream() {
    const container = document.getElementById('dash-activity-list');
    if (!container) return;

    const state = window.OrbitStore.state;
    const activities = state.activities.slice(0, 6);

    if (activities.length === 0) {
      container.innerHTML = `<div style="padding:16px; color:var(--text-muted); font-size:0.85rem;">No recent activities.</div>`;
      return;
    }

    container.innerHTML = activities.map(act => {
      const user = window.OrbitStore.getUser(act.actorId);
      const timeAgo = this.formatRelativeTime(act.timestamp);

      return `
        <div class="activity-item">
          <div class="avatar avatar-sm" style="background-color:${user.color}; color:white;">
            ${user.avatar}
          </div>
          <div class="activity-content">
            <div class="activity-text">
              <span class="activity-actor">${user.name}</span>
              ${act.action}
              <span class="activity-target">"${act.target}"</span>
            </div>
            <div class="activity-time">${timeAgo}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  formatRelativeTime(isoString) {
    if (!isoString) return 'just now';
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
};

window.OrbitDashboardView = OrbitDashboardView;
