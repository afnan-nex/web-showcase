/**
 * OrbitDesk Universal Modal System
 */

const OrbitModal = {
  activeModal: null,

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    this.activeModal = modal;
    document.body.style.overflow = 'hidden';

    // Auto-focus first input if present
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  },

  close(modalId) {
    const modal = modalId ? document.getElementById(modalId) : this.activeModal;
    if (!modal) return;
    modal.classList.remove('active');
    this.activeModal = null;
    document.body.style.overflow = '';
  },

  init() {
    // Backdrop click dismiss
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.close();
      }
    });

    // Escape key dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  },

  // Task Modal Form Population & Open
  openTaskModal(task = null, defaultDate = null, defaultProjectId = null, defaultStatus = null) {
    const modal = document.getElementById('modal-task');
    if (!modal) return;

    const titleEl = document.getElementById('task-modal-title');
    const form = document.getElementById('form-task');
    const taskIdInput = document.getElementById('task-input-id');
    const titleInput = document.getElementById('task-input-title');
    const descInput = document.getElementById('task-input-desc');
    const projectSelect = document.getElementById('task-input-project');
    const assigneeSelect = document.getElementById('task-input-assignee');
    const prioritySelect = document.getElementById('task-input-priority');
    const statusSelect = document.getElementById('task-input-status');
    const dueDateInput = document.getElementById('task-input-duedate');
    const tagsInput = document.getElementById('task-input-tags');
    const deleteBtn = document.getElementById('task-modal-delete-btn');

    // Populate Projects dropdown
    const state = window.OrbitStore.state;
    projectSelect.innerHTML = state.projects.map(p => `
      <option value="${p.id}">${p.name}</option>
    `).join('');

    // Populate Assignees dropdown
    assigneeSelect.innerHTML = state.users.map(u => `
      <option value="${u.id}">${u.name} (${u.role})</option>
    `).join('');

    if (task) {
      titleEl.textContent = 'Edit Task';
      taskIdInput.value = task.id;
      titleInput.value = task.title;
      descInput.value = task.description || '';
      projectSelect.value = task.projectId || (state.projects[0] ? state.projects[0].id : '');
      assigneeSelect.value = task.assigneeId || (state.users[0] ? state.users[0].id : '');
      prioritySelect.value = task.priority || 'medium';
      statusSelect.value = task.status || 'todo';
      dueDateInput.value = task.dueDate || new Date().toISOString().split('T')[0];
      tagsInput.value = (task.tags || []).join(', ');
      if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    } else {
      titleEl.textContent = 'Create New Task';
      form.reset();
      taskIdInput.value = '';
      if (defaultDate) dueDateInput.value = defaultDate;
      else dueDateInput.value = new Date().toISOString().split('T')[0];

      if (defaultProjectId) projectSelect.value = defaultProjectId;
      if (defaultStatus) statusSelect.value = defaultStatus;
      else statusSelect.value = 'todo';

      if (deleteBtn) deleteBtn.style.display = 'none';
    }

    this.open('modal-task');
  },

  // Project Modal Form Population & Open
  openProjectModal(project = null) {
    const modal = document.getElementById('modal-project');
    if (!modal) return;

    const titleEl = document.getElementById('project-modal-title');
    const form = document.getElementById('form-project');
    const idInput = document.getElementById('project-input-id');
    const nameInput = document.getElementById('project-input-name');
    const descInput = document.getElementById('project-input-desc');
    const categorySelect = document.getElementById('project-input-category');
    const colorInput = document.getElementById('project-input-color');
    const targetDateInput = document.getElementById('project-input-targetdate');
    const leadSelect = document.getElementById('project-input-lead');
    const deleteBtn = document.getElementById('project-modal-delete-btn');

    const state = window.OrbitStore.state;
    leadSelect.innerHTML = state.users.map(u => `
      <option value="${u.id}">${u.name} (${u.role})</option>
    `).join('');

    if (project) {
      titleEl.textContent = 'Edit Project';
      idInput.value = project.id;
      nameInput.value = project.name;
      descInput.value = project.description || '';
      categorySelect.value = project.category || 'Engineering';
      colorInput.value = project.color || '#4f46e5';
      targetDateInput.value = project.targetDate || '';
      leadSelect.value = project.leadId || '';
      if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    } else {
      titleEl.textContent = 'Create New Project';
      form.reset();
      idInput.value = '';
      targetDateInput.value = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];
      colorInput.value = '#4f46e5';
      if (deleteBtn) deleteBtn.style.display = 'none';
    }

    this.open('modal-project');
  },

  // Confirmation Dialog helper
  confirm(title, message, onConfirm, danger = false) {
    const modal = document.getElementById('modal-confirm');
    if (!modal) return;

    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-msg').textContent = message;
    const confirmBtn = document.getElementById('confirm-modal-action-btn');

    confirmBtn.className = danger ? 'btn btn-danger' : 'btn btn-primary';
    confirmBtn.onclick = () => {
      onConfirm();
      OrbitModal.close('modal-confirm');
    };

    this.open('modal-confirm');
  }
};

window.OrbitModal = OrbitModal;
