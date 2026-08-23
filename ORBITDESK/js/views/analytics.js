/**
 * OrbitDesk Analytics View Controller
 * Dynamic data visualization, throughput metrics, and workload capacity reports.
 */

const OrbitAnalyticsView = {
  render() {
    const state = window.OrbitStore.state;
    const stats = window.OrbitStore.getStats();

    // 1. Update Analytic Metric Badges
    const totalEl = document.getElementById('analytics-total-tasks');
    const compRateEl = document.getElementById('analytics-comp-rate');
    const overdueEl = document.getElementById('analytics-overdue-count');
    const activeProjEl = document.getElementById('analytics-active-proj');

    if (totalEl) totalEl.textContent = stats.totalTasks;
    if (compRateEl) compRateEl.textContent = `${stats.completionRate}%`;
    if (overdueEl) overdueEl.textContent = stats.overdueTasks;
    if (activeProjEl) activeProjEl.textContent = stats.activeProjects;

    // 2. Count Statuses for Donut
    const statusCounts = {
      backlog: state.tasks.filter(t => t.status === 'backlog').length,
      todo: state.tasks.filter(t => t.status === 'todo').length,
      inprogress: state.tasks.filter(t => t.status === 'inprogress').length,
      inreview: state.tasks.filter(t => t.status === 'inreview').length,
      done: state.tasks.filter(t => t.status === 'done').length
    };
    window.OrbitCharts.renderStatusDonut('analytics-status-donut', statusCounts);

    // 3. Count Priorities for Bar Chart
    const priorityCounts = {
      low: state.tasks.filter(t => t.priority === 'low').length,
      medium: state.tasks.filter(t => t.priority === 'medium').length,
      high: state.tasks.filter(t => t.priority === 'high').length,
      urgent: state.tasks.filter(t => t.priority === 'urgent').length
    };
    window.OrbitCharts.renderPriorityBarChart('analytics-priority-canvas', priorityCounts);

    // 4. Render Velocity Chart
    const velocityData = [
      Math.max(1, stats.completedTasks - 4),
      Math.max(2, stats.completedTasks - 3),
      Math.max(1, stats.completedTasks - 2),
      Math.max(3, stats.completedTasks - 1),
      stats.completedTasks,
      Math.max(2, stats.completedTasks + 1),
      Math.max(4, stats.completedTasks + 2)
    ];
    window.OrbitCharts.renderVelocityChart('analytics-velocity-canvas', {
      completed: velocityData,
      created: [2, 3, 4, 3, 5, 2, 4]
    });

    // 5. Render Team Workload Bars
    this.renderWorkloadSection();
  },

  renderWorkloadSection() {
    const container = document.getElementById('analytics-workload-list');
    if (!container) return;

    const state = window.OrbitStore.state;
    const users = state.users || [];

    container.innerHTML = users.map(u => {
      const userTasks = state.tasks.filter(t => t.assigneeId === u.id);
      const openTasks = userTasks.filter(t => t.status !== 'done');
      const maxCapacity = 8;
      const capacityPct = Math.min(100, Math.round((openTasks.length / maxCapacity) * 100));

      let capacityColor = 'success';
      if (capacityPct > 80) capacityColor = 'danger';
      else if (capacityPct > 60) capacityColor = 'warning';

      return `
        <div style="margin-bottom: var(--space-4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 6px;">
            <div style="display:flex; align-items:center; gap: 8px;">
              <div class="avatar avatar-xs" style="background-color:${u.color}; color:white;">${u.avatar}</div>
              <div>
                <strong style="font-size:0.85rem; color:var(--text-primary);">${u.name}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted); margin-left: 4px;">(${u.role})</span>
              </div>
            </div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">
              <strong>${openTasks.length} active</strong> / ${userTasks.length} total tasks (${capacityPct}% capacity)
            </div>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${capacityColor}" style="width: ${capacityPct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.OrbitAnalyticsView = OrbitAnalyticsView;
