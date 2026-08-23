/**
 * OrbitDesk Reactive State Store
 * Handles central state mutations, event broadcasting, and query helpers.
 */

class StateStore {
  constructor() {
    this.state = window.OrbitData.loadState();
    this.listeners = {};
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
    // Also notify global wildcard
    if (this.listeners['*']) {
      this.listeners['*'].forEach(cb => cb({ event, data }));
    }
  }

  persist() {
    window.OrbitData.saveState(this.state);
  }

  // --- Workspace Actions ---
  switchWorkspace(workspaceId) {
    this.state.workspaces.forEach(ws => {
      ws.isCurrent = ws.id === workspaceId;
    });
    const current = this.state.workspaces.find(ws => ws.isCurrent);
    this.persist();
    this.logActivity('switched workspace to', current.name);
    this.notify('workspace:changed', current);
    this.notify('state:updated', this.state);
  }

  getCurrentWorkspace() {
    return this.state.workspaces.find(ws => ws.isCurrent) || this.state.workspaces[0];
  }

  // --- Task Actions ---
  addTask(taskInput) {
    const user = window.OrbitAuth ? window.OrbitAuth.getCurrentUser() : null;
    const newTask = {
      id: 'tsk-' + Date.now(),
      title: taskInput.title.trim(),
      description: taskInput.description ? taskInput.description.trim() : '',
      projectId: taskInput.projectId || (this.state.projects[0] ? this.state.projects[0].id : ''),
      assigneeId: taskInput.assigneeId || (user ? user.id : 'usr-1'),
      priority: taskInput.priority || 'medium',
      status: taskInput.status || 'todo',
      dueDate: taskInput.dueDate || new Date().toISOString().split('T')[0],
      tags: Array.isArray(taskInput.tags) ? taskInput.tags : (taskInput.tags ? taskInput.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.state.tasks.unshift(newTask);
    this.persist();
    this.logActivity('created task', newTask.title, newTask.projectId);
    this.notify('task:created', newTask);
    this.notify('state:updated', this.state);
    return newTask;
  }

  updateTask(taskId, updates) {
    const index = this.state.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;

    const oldTask = this.state.tasks[index];
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const updatedTask = { ...oldTask, ...updates };
    this.state.tasks[index] = updatedTask;
    this.persist();

    if (updates.status && updates.status !== oldTask.status) {
      this.logActivity(`changed status to "${updates.status}" on`, updatedTask.title, updatedTask.projectId);
    } else {
      this.logActivity('updated task', updatedTask.title, updatedTask.projectId);
    }

    this.notify('task:updated', updatedTask);
    this.notify('state:updated', this.state);
    return updatedTask;
  }

  toggleTaskComplete(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return null;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    task.status = newStatus;
    this.persist();

    if (newStatus === 'done') {
      this.logActivity('completed task', task.title, task.projectId);
    } else {
      this.logActivity('reopened task', task.title, task.projectId);
    }

    this.notify('task:toggled', task);
    this.notify('state:updated', this.state);
    return task;
  }

  deleteTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return false;

    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    this.persist();
    this.logActivity('deleted task', task.title, task.projectId);
    this.notify('task:deleted', taskId);
    this.notify('state:updated', this.state);
    return true;
  }

  // --- Project Actions ---
  addProject(projectInput) {
    const newProject = {
      id: 'proj-' + Date.now(),
      name: projectInput.name.trim(),
      description: projectInput.description ? projectInput.description.trim() : '',
      status: projectInput.status || 'inprogress',
      color: projectInput.color || '#4f46e5',
      category: projectInput.category || 'General',
      leadId: projectInput.leadId || 'usr-1',
      createdAt: new Date().toISOString().split('T')[0],
      targetDate: projectInput.targetDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
    };

    this.state.projects.unshift(newProject);
    this.persist();
    this.logActivity('created project', newProject.name, newProject.id);
    this.notify('project:created', newProject);
    this.notify('state:updated', this.state);
    return newProject;
  }

  updateProject(projectId, updates) {
    const index = this.state.projects.findIndex(p => p.id === projectId);
    if (index === -1) return null;

    const old = this.state.projects[index];
    const updated = { ...old, ...updates };
    this.state.projects[index] = updated;
    this.persist();
    this.logActivity('updated project details for', updated.name, updated.id);
    this.notify('project:updated', updated);
    this.notify('state:updated', this.state);
    return updated;
  }

  archiveProject(projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return null;

    project.status = project.status === 'archived' ? 'inprogress' : 'archived';
    this.persist();
    this.logActivity(project.status === 'archived' ? 'archived project' : 'unarchived project', project.name, project.id);
    this.notify('project:archived', project);
    this.notify('state:updated', this.state);
    return project;
  }

  deleteProject(projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return false;

    // Unlink tasks from this project or remove
    this.state.tasks.forEach(t => {
      if (t.projectId === projectId) {
        t.projectId = '';
      }
    });

    this.state.projects = this.state.projects.filter(p => p.id !== projectId);
    this.persist();
    this.logActivity('deleted project', project.name);
    this.notify('project:deleted', projectId);
    this.notify('state:updated', this.state);
    return true;
  }

  // --- Activity Feed ---
  logActivity(action, target, projectId = null) {
    const user = window.OrbitAuth ? window.OrbitAuth.getCurrentUser() : null;
    const activity = {
      id: 'act-' + Date.now() + Math.random().toString(36).substr(2, 4),
      actorId: user ? user.id : 'usr-1',
      action,
      target,
      projectId: projectId || '',
      timestamp: new Date().toISOString()
    };

    this.state.activities.unshift(activity);
    if (this.state.activities.length > 100) {
      this.state.activities.pop();
    }
    this.persist();
    this.notify('activity:logged', activity);
  }

  // --- Query Helpers ---
  getUser(userId) {
    return this.state.users.find(u => u.id === userId) || { name: 'Unassigned', avatar: '?', color: '#94a3b8' };
  }

  getProject(projectId) {
    return this.state.projects.find(p => p.id === projectId) || { name: 'General / None', color: '#94a3b8' };
  }

  getProjectTasks(projectId) {
    return this.state.tasks.filter(t => t.projectId === projectId);
  }

  getProjectCompletion(projectId) {
    const tasks = this.getProjectTasks(projectId);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'done').length;
    return Math.round((completed / tasks.length) * 100);
  }

  getProjectHealth(projectId) {
    const tasks = this.getProjectTasks(projectId);
    if (tasks.length === 0) return { label: 'On Track', color: 'success' };
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length;
    if (overdue >= 2) return { label: 'Delayed', color: 'danger' };
    if (overdue === 1) return { label: 'At Risk', color: 'warning' };
    return { label: 'On Track', color: 'success' };
  }

  isTaskOverdue(task) {
    if (!task.dueDate || task.status === 'done') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  }

  getStats() {
    const totalTasks = this.state.tasks.length;
    const completedTasks = this.state.tasks.filter(t => t.status === 'done').length;
    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = this.state.tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length;
    const inProgressTasks = this.state.tasks.filter(t => t.status === 'inprogress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const activeProjects = this.state.projects.filter(p => p.status !== 'archived').length;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      inProgressTasks,
      completionRate,
      activeProjects
    };
  }

  reloadFromDisk() {
    this.state = window.OrbitData.loadState();
    this.notify('state:updated', this.state);
  }
}

window.OrbitStore = new StateStore();
