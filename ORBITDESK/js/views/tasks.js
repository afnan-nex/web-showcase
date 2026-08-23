/**
 * OrbitDesk Tasks View Controller
 * High-density Data Table & Kanban Board with multi-parameter filtering, sorting, and batch actions.
 */

const OrbitTasksView = {
  viewMode: 'table', // 'table' or 'kanban'
  filters: {
    search: '',
    project: 'all',
    assignee: 'all',
    priority: 'all',
    status: 'all',
    due: 'all'
  },
  sortBy: 'dueDate',
  sortOrder: 'asc',
  selectedTaskIds: new Set(),

  init() {
    // Search input
    const searchInput = document.getElementById('task-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Filter dropdowns
    ['project', 'assignee', 'priority', 'status', 'due'].forEach(key => {
      const select = document.getElementById(`task-filter-${key}`);
      if (select) {
        select.addEventListener('change', (e) => {
          this.filters[key] = e.target.value;
          this.render();
        });
      }
    });

    // Populate dynamic filter options
    this.populateFilterDropdowns();
  },

  populateFilterDropdowns() {
    const state = window.OrbitStore.state;

    const projSelect = document.getElementById('task-filter-project');
    if (projSelect) {
      const current = projSelect.value;
      projSelect.innerHTML = `<option value="all">All Projects</option>` +
        state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      projSelect.value = current || 'all';
    }

    const assignSelect = document.getElementById('task-filter-assignee');
    if (assignSelect) {
      const current = assignSelect.value;
      assignSelect.innerHTML = `<option value="all">All Assignees</option>` +
        state.users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
      assignSelect.value = current || 'all';
    }
  },

  setViewMode(mode) {
    this.viewMode = mode;
    const tableBtn = document.getElementById('task-view-table-btn');
    const kanbanBtn = document.getElementById('task-view-kanban-btn');

    if (tableBtn && kanbanBtn) {
      if (mode === 'table') {
        tableBtn.classList.add('active');
        kanbanBtn.classList.remove('active');
      } else {
        kanbanBtn.classList.add('active');
        tableBtn.classList.remove('active');
      }
    }
    this.render();
  },

  getFilteredAndSortedTasks() {
    const state = window.OrbitStore.state;
    let tasks = [...state.tasks];
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter search
    if (this.filters.search) {
      const q = this.filters.search;
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Filter Project
    if (this.filters.project !== 'all') {
      tasks = tasks.filter(t => t.projectId === this.filters.project);
    }

    // Filter Assignee
    if (this.filters.assignee !== 'all') {
      tasks = tasks.filter(t => t.assigneeId === this.filters.assignee);
    }

    // Filter Priority
    if (this.filters.priority !== 'all') {
      tasks = tasks.filter(t => t.priority === this.filters.priority);
    }

    // Filter Status
    if (this.filters.status !== 'all') {
      tasks = tasks.filter(t => t.status === this.filters.status);
    }

    // Filter Due Date
    if (this.filters.due === 'overdue') {
      tasks = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < todayStr);
    } else if (this.filters.due === 'today') {
      tasks = tasks.filter(t => t.dueDate === todayStr);
    } else if (this.filters.due === 'upcoming') {
      tasks = tasks.filter(t => t.dueDate && t.dueDate > todayStr);
    }

    // Sorting
    const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
    tasks.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'dueDate') {
        comparison = (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      } else if (this.sortBy === 'priority') {
        comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      } else if (this.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (this.sortBy === 'createdAt') {
        comparison = (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    return tasks;
  },

  setSort(field) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.render();
  },

  render() {
    this.populateFilterDropdowns();
    const container = document.getElementById('tasks-view-container');
    if (!container) return;

    const tasks = this.getFilteredAndSortedTasks();
    const batchBar = document.getElementById('tasks-batch-bar');

    // Update batch action bar visibility
    if (batchBar) {
      if (this.selectedTaskIds.size > 0) {
        batchBar.style.display = 'flex';
        document.getElementById('tasks-selected-count').textContent = `${this.selectedTaskIds.size} selected`;
      } else {
        batchBar.style.display = 'none';
      }
    }

    if (this.viewMode === 'table') {
      this.renderTable(container, tasks);
    } else {
      this.renderKanban(container, tasks);
    }
  },

  renderTable(container, tasks) {
    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 60px 20px;">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <div class="empty-state-title">No tasks matching current filter</div>
          <div class="empty-state-desc">Try resetting your filters or create a new task.</div>
          <button class="btn btn-primary btn-sm" onclick="OrbitTasksView.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 36px; text-align: center;">
                <input type="checkbox" id="task-select-all" onchange="OrbitTasksView.toggleSelectAll(this.checked)">
              </th>
              <th class="sortable" onclick="OrbitTasksView.setSort('title')">Task Title ${this.sortBy === 'title' ? (this.sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Project</th>
              <th class="sortable" onclick="OrbitTasksView.setSort('status')">Status</th>
              <th class="sortable" onclick="OrbitTasksView.setSort('priority')">Priority ${this.sortBy === 'priority' ? (this.sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
              <th class="sortable" onclick="OrbitTasksView.setSort('dueDate')">Due Date ${this.sortBy === 'dueDate' ? (this.sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Assignee</th>
              <th>Tags</th>
              <th style="text-align: right; width: 80px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(t => {
              const isDone = t.status === 'done';
              const isOverdue = !isDone && t.dueDate && t.dueDate < todayStr;
              const isToday = !isDone && t.dueDate === todayStr;
              const proj = window.OrbitStore.getProject(t.projectId);
              const user = window.OrbitStore.getUser(t.assigneeId);
              const isSelected = this.selectedTaskIds.has(t.id);

              let dateDisplay = `<span style="font-size:0.75rem;">${t.dueDate || '—'}</span>`;
              if (isOverdue) {
                dateDisplay = `<span class="badge badge-priority-urgent">Overdue (${t.dueDate})</span>`;
              } else if (isToday) {
                dateDisplay = `<span class="badge badge-priority-medium">Today</span>`;
              }

              return `
                <tr class="${isDone ? 'is-done' : ''} ${isSelected ? 'selected' : ''}">
                  <td style="text-align: center;">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="OrbitTasksView.toggleSelectTask('${t.id}', this.checked)">
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap: 8px;">
                      <label class="checkbox-label" style="margin:0;">
                        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="OrbitStore.toggleTaskComplete('${t.id}')">
                        <span class="checkbox-custom"></span>
                      </label>
                      <span class="task-title" style="font-weight:500; cursor:pointer;" onclick="OrbitModal.openTaskModal(OrbitStore.state.tasks.find(x => x.id === '${t.id}'))">
                        ${t.title}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="width:8px; height:8px; border-radius:2px; background-color:${proj.color};"></span>
                      <span style="font-size:0.8rem;">${proj.name}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-status-${t.status}">${t.status}</span>
                  </td>
                  <td>
                    <span class="badge badge-priority-${t.priority}">
                      <span class="badge-dot"></span>
                      ${t.priority}
                    </span>
                  </td>
                  <td>${dateDisplay}</td>
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;" title="${user.name} (${user.role})">
                      <div class="avatar avatar-xs" style="background-color:${user.color}; color:white;">${user.avatar}</div>
                      <span style="font-size:0.78rem;">${user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                      ${(t.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-sm btn-ghost" title="Edit Task" onclick="OrbitModal.openTaskModal(OrbitStore.state.tasks.find(x => x.id === '${t.id}'))">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-sm btn-danger-ghost" title="Delete Task" onclick="OrbitModal.confirm('Delete Task', 'Are you sure you want to permanently delete this task?', () => OrbitStore.deleteTask('${t.id}'), true)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderKanban(container, tasks) {
    const columns = [
      { id: 'backlog', title: 'Backlog', color: '#64748b' },
      { id: 'todo', title: 'To Do', color: '#0284c7' },
      { id: 'inprogress', title: 'In Progress', color: '#d97706' },
      { id: 'inreview', title: 'In Review', color: '#7c3aed' },
      { id: 'done', title: 'Done', color: '#059669' }
    ];

    const todayStr = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div class="kanban-board">
        ${columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return `
            <div class="kanban-col" data-status="${col.id}">
              <div class="kanban-col-header">
                <div class="kanban-col-title">
                  <span style="width:8px; height:8px; border-radius:50%; background-color:${col.color};"></span>
                  ${col.title}
                </div>
                <span class="badge-count">${colTasks.length}</span>
              </div>
              <div class="kanban-col-cards">
                ${colTasks.map(t => {
                  const proj = window.OrbitStore.getProject(t.projectId);
                  const user = window.OrbitStore.getUser(t.assigneeId);
                  const isOverdue = t.status !== 'done' && t.dueDate && t.dueDate < todayStr;

                  return `
                    <div class="task-card" onclick="OrbitModal.openTaskModal(OrbitStore.state.tasks.find(x => x.id === '${t.id}'))">
                      <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span class="badge badge-priority-${t.priority}">${t.priority}</span>
                        <div style="display:flex; gap:2px;">
                          ${col.id !== 'backlog' ? `<button class="btn btn-sm btn-ghost" style="padding:1px 4px; font-size:10px;" title="Move left" onclick="event.stopPropagation(); OrbitTasksView.moveTaskStatus('${t.id}', -1)">←</button>` : ''}
                          ${col.id !== 'done' ? `<button class="btn btn-sm btn-ghost" style="padding:1px 4px; font-size:10px;" title="Move right" onclick="event.stopPropagation(); OrbitTasksView.moveTaskStatus('${t.id}', 1)">→</button>` : ''}
                        </div>
                      </div>
                      <div class="task-card-title">${t.title}</div>
                      <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; color:var(--text-muted);">
                        <span style="width:6px; height:6px; border-radius:2px; background-color:${proj.color};"></span>
                        <span class="text-truncate">${proj.name}</span>
                      </div>
                      <div class="task-card-meta">
                        <span style="font-size:0.72rem; ${isOverdue ? 'color:var(--danger); font-weight:600;' : ''}">${t.dueDate || 'No date'}</span>
                        <div class="avatar avatar-xs" style="background-color:${user.color}; color:white;" title="${user.name}">${user.avatar}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
                <button class="btn btn-sm btn-outline w-full" style="border-style:dashed; margin-top:4px;" onclick="OrbitModal.openTaskModal(null, null, null, '${col.id}')">
                  + Add task
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  moveTaskStatus(taskId, direction) {
    const statuses = ['backlog', 'todo', 'inprogress', 'inreview', 'done'];
    const task = window.OrbitStore.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      window.OrbitStore.updateTask(taskId, { status: statuses[nextIndex] });
    }
  },

  toggleSelectTask(taskId, checked) {
    if (checked) this.selectedTaskIds.add(taskId);
    else this.selectedTaskIds.delete(taskId);
    this.render();
  },

  toggleSelectAll(checked) {
    const tasks = this.getFilteredAndSortedTasks();
    if (checked) {
      tasks.forEach(t => this.selectedTaskIds.add(t.id));
    } else {
      this.selectedTaskIds.clear();
    }
    this.render();
  },

  batchMarkDone() {
    this.selectedTaskIds.forEach(id => {
      window.OrbitStore.updateTask(id, { status: 'done' });
    });
    window.OrbitToast.success(`${this.selectedTaskIds.size} tasks marked as done.`);
    this.selectedTaskIds.clear();
    this.render();
  },

  batchDelete() {
    window.OrbitModal.confirm(
      'Delete Selected Tasks',
      `Are you sure you want to delete ${this.selectedTaskIds.size} selected tasks?`,
      () => {
        this.selectedTaskIds.forEach(id => {
          window.OrbitStore.deleteTask(id);
        });
        window.OrbitToast.info('Selected tasks deleted.');
        this.selectedTaskIds.clear();
        this.render();
      },
      true
    );
  },

  resetFilters() {
    this.filters = {
      search: '',
      project: 'all',
      assignee: 'all',
      priority: 'all',
      status: 'all',
      due: 'all'
    };
    const searchInput = document.getElementById('task-search-input');
    if (searchInput) searchInput.value = '';
    ['project', 'assignee', 'priority', 'status', 'due'].forEach(k => {
      const el = document.getElementById(`task-filter-${k}`);
      if (el) el.value = 'all';
    });
    this.render();
  }
};

window.OrbitTasksView = OrbitTasksView;
