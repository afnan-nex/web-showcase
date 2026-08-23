/**
 * OrbitDesk Enterprise Chart Engine
 * Lightweight, high-DPI Canvas & SVG rendering with clear axes, labels, and tooltips.
 */

const OrbitCharts = {
  // Setup canvas for Retina/HiDPI screens
  setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  },

  // Velocity Area / Line Chart
  renderVelocityChart(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const { ctx, width, height } = this.setupCanvas(canvas);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 35, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Sample 7-day velocity points or dynamic calculated from tasks
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const valuesCompleted = options.completed || [3, 5, 8, 6, 11, 7, 10];
    const valuesCreated = options.created || [2, 4, 6, 5, 8, 4, 6];

    const maxVal = Math.max(...valuesCompleted, ...valuesCreated, 12);

    // Draw Y grid & labels
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e2e8f0';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;

    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const yVal = Math.round((maxVal / ySteps) * i);
      const yPos = padding.top + chartH - (i / ySteps) * chartH;

      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(width - padding.right, yPos);
      ctx.stroke();

      ctx.fillText(yVal.toString(), padding.left - 8, yPos);
    }

    // Draw X labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xStep = chartW / (days.length - 1);

    days.forEach((day, index) => {
      const xPos = padding.left + index * xStep;
      ctx.fillText(day, xPos, height - padding.bottom + 8);
    });

    // Helper to draw smooth series
    const drawSeries = (data, strokeColor, fillColor, isArea = false) => {
      const points = data.map((val, idx) => ({
        x: padding.left + idx * xStep,
        y: padding.top + chartH - (val / maxVal) * chartH
      }));

      ctx.beginPath();
      points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else {
          const prev = points[idx - 1];
          const cx = (prev.x + p.x) / 2;
          ctx.bezierCurveTo(cx, prev.y, cx, p.y, p.x, p.y);
        }
      });

      if (isArea) {
        ctx.lineTo(padding.left + chartW, padding.top + chartH);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      } else {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw points
        points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }
    };

    // Render Completed Area & Line
    drawSeries(valuesCompleted, 'transparent', 'rgba(79, 70, 229, 0.08)', true);
    drawSeries(valuesCompleted, '#4f46e5', '', false);

    // Render Created Line
    drawSeries(valuesCreated, '#0ea5e9', '', false);
  },

  // Donut / Status Breakdown Chart
  renderStatusDonut(canvasId, counts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const { ctx, width, height } = this.setupCanvas(canvas);
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    const innerRadius = radius * 0.65;

    const categories = [
      { label: 'Backlog', value: counts.backlog || 1, color: '#64748b' },
      { label: 'To Do', value: counts.todo || 3, color: '#0284c7' },
      { label: 'In Progress', value: counts.inprogress || 4, color: '#d97706' },
      { label: 'In Review', value: counts.inreview || 2, color: '#7c3aed' },
      { label: 'Done', value: counts.done || 5, color: '#059669' }
    ];

    const total = categories.reduce((sum, c) => sum + c.value, 0) || 1;
    let currentAngle = -Math.PI / 2;

    categories.forEach(cat => {
      const sliceAngle = (cat.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = cat.color;
      ctx.fill();
      currentAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#0f172a';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY - 8);

    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
    ctx.fillText('TOTAL TASKS', centerX, centerY + 10);
  },

  // Vertical Bar Chart for Priority Distribution
  renderPriorityBarChart(canvasId, priorityCounts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const { ctx, width, height } = this.setupCanvas(canvas);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 35, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const priorities = [
      { key: 'low', label: 'Low', count: priorityCounts.low || 0, color: '#64748b' },
      { key: 'medium', label: 'Medium', count: priorityCounts.medium || 0, color: '#0284c7' },
      { key: 'high', label: 'High', count: priorityCounts.high || 0, color: '#ea580c' },
      { key: 'urgent', label: 'Urgent', count: priorityCounts.urgent || 0, color: '#dc2626' }
    ];

    const maxVal = Math.max(...priorities.map(p => p.count), 6);

    // Y Axis Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e2e8f0';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 3; i++) {
      const val = Math.round((maxVal / 3) * i);
      const y = padding.top + chartH - (i / 3) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(val.toString(), padding.left - 6, y);
    }

    // Bars
    const barWidth = 32;
    const groupWidth = chartW / priorities.length;

    priorities.forEach((p, idx) => {
      const x = padding.left + idx * groupWidth + (groupWidth - barWidth) / 2;
      const barH = (p.count / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barH);
      ctx.fill();

      // Label below
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#475569';
      ctx.fillText(p.label, x + barWidth / 2, height - padding.bottom + 8);
    });
  }
};

window.OrbitCharts = OrbitCharts;
