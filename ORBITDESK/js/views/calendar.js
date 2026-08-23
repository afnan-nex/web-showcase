/**
 * OrbitDesk Calendar View Controller
 * Interactive monthly schedule with date-based task allocation and quick creation.
 */

const OrbitCalendarView = {
  currentDate: new Date(),

  init() {
    const prevBtn = document.getElementById('cal-prev-month-btn');
    const nextBtn = document.getElementById('cal-next-month-btn');
    const todayBtn = document.getElementById('cal-today-btn');

    if (prevBtn) {
      prevBtn.onclick = () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
      };
    }
    if (todayBtn) {
      todayBtn.onclick = () => {
        this.currentDate = new Date();
        this.render();
      };
    }
  },

  render() {
    const titleEl = document.getElementById('cal-current-month-title');
    const gridDays = document.getElementById('cal-days-grid');
    if (!gridDays) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (titleEl) {
      titleEl.textContent = `${monthNames[month]} ${year}`;
    }

    // Days in current month
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month, lastDate).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    const todayStr = new Date().toISOString().split('T')[0];
    const tasks = window.OrbitStore.state.tasks || [];

    let cellsHtml = '';

    // Previous month trailing days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevLastDate - x + 1;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cellsHtml += this.renderDayCell(dayNum, dateStr, true, false, tasks);
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      cellsHtml += this.renderDayCell(i, dateStr, false, isToday, tasks);
    }

    // Next month padding days
    for (let j = 1; j <= nextDays; j++) {
      const m = month === 11 ? 1 : month + 2;
      const y = month === 11 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
      cellsHtml += this.renderDayCell(j, dateStr, true, false, tasks);
    }

    gridDays.innerHTML = cellsHtml;
  },

  renderDayCell(dayNumber, dateString, isOtherMonth, isToday, allTasks) {
    const dayTasks = allTasks.filter(t => t.dueDate === dateString);

    return `
      <div class="calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}" onclick="OrbitCalendarView.handleDayClick('${dateString}')">
        <div class="calendar-day-header">
          <span class="calendar-day-number">${dayNumber}</span>
          ${dayTasks.length > 0 ? `<span class="badge-count" style="height:16px; font-size:0.65rem;">${dayTasks.length}</span>` : ''}
        </div>
        <div class="calendar-tasks-list">
          ${dayTasks.slice(0, 3).map(t => {
            const proj = window.OrbitStore.getProject(t.projectId);
            return `
              <div class="cal-task-pill" style="border-left-color: ${proj.color || 'var(--primary)'};" onclick="event.stopPropagation(); OrbitModal.openTaskModal(OrbitStore.state.tasks.find(x => x.id === '${t.id}'))" title="${t.title} (${t.priority})">
                ${t.status === 'done' ? '✓ ' : ''}${t.title}
              </div>
            `;
          }).join('')}
          ${dayTasks.length > 3 ? `<div style="font-size:0.68rem; color:var(--text-muted); font-weight:600;">+${dayTasks.length - 3} more</div>` : ''}
        </div>
      </div>
    `;
  },

  handleDayClick(dateString) {
    window.OrbitModal.openTaskModal(null, dateString);
  }
};

window.OrbitCalendarView = OrbitCalendarView;
