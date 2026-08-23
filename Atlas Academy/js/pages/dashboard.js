/**
 * Atlas Academy - Student Dashboard Controller
 */

let activeTab = "enrolled";

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();

  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      renderDashboard();
    });
  }
});

function renderDashboard() {
  if (!window.atlasState || !window.ATLAS_DATA) return;

  renderUserHeader();
  renderStatisticsRibbon();
  renderContinueLearningBanner();
  renderTabBadges();

  // Render current tab content
  if (activeTab === "enrolled") renderEnrolledCourses();
  if (activeTab === "upcoming") renderUpcomingLessons();
  if (activeTab === "certificates") renderCertificatesShowcase();
  if (activeTab === "bookmarks") renderBookmarksTab();
  if (activeTab === "activity") renderActivityTimeline();
}

function renderUserHeader() {
  const user = window.atlasState.getUser();
  const avatar = document.getElementById("dash-user-avatar");
  const heading = document.getElementById("dash-welcome-heading");
  const headline = document.getElementById("dash-user-headline");

  if (avatar && user.avatar) avatar.src = user.avatar;
  if (heading && user.name) heading.textContent = `Welcome back, ${user.name.split(" ")[0]}`;
  if (headline && user.title) headline.textContent = `${user.title} • Member since ${user.memberSince || '2026'}`;
}

function renderStatisticsRibbon() {
  const stats = window.atlasState.getOverallStats();

  const inProgressEl = document.getElementById("stat-in-progress-count");
  const streakEl = document.getElementById("stat-streak-days");
  const hoursEl = document.getElementById("stat-hours-learned");
  const certsEl = document.getElementById("stat-certs-count");

  if (inProgressEl) inProgressEl.textContent = stats.inProgressCount;
  if (streakEl) streakEl.textContent = stats.streakDays;
  if (hoursEl) hoursEl.textContent = stats.totalHoursLearned;
  if (certsEl) certsEl.textContent = stats.certificatesCount;
}

function renderTabBadges() {
  const enrolled = window.atlasState.getEnrolledCourses();
  const certs = window.atlasState.getCertificates();
  const bookmarked = window.atlasState.getBookmarkedCourses();

  const countEnrolled = document.getElementById("tab-count-enrolled");
  const countCerts = document.getElementById("tab-count-certificates");
  const countBookmarks = document.getElementById("tab-count-bookmarks");

  if (countEnrolled) countEnrolled.textContent = enrolled.length;
  if (countCerts) countCerts.textContent = certs.length;
  if (countBookmarks) countBookmarks.textContent = bookmarked.length;
}

function renderContinueLearningBanner() {
  const container = document.getElementById("continue-learning-section");
  if (!container) return;

  const enrolled = window.atlasState.getEnrolledCourses();
  if (enrolled.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="margin-bottom: 40px;">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        </div>
        <div class="empty-state-title">No Enrolled Courses Yet</div>
        <p class="empty-state-desc">Explore our curriculum of masterclasses across distributed computing, design systems, and tech strategy.</p>
        <a href="courses.html" class="btn btn-primary">Browse Course Catalog</a>
      </div>
    `;
    return;
  }

  // Find first course with <100% progress, or fall back to first enrolled
  const activeCourse = enrolled.find(c => window.atlasState.getCourseProgress(c.id).percentage < 100) || enrolled[0];
  const progress = window.atlasState.getCourseProgress(activeCourse.id);
  const instructor = ATLAS_DATA.instructors.find(i => i.id === activeCourse.instructorId);

  // Find next incomplete lesson
  let nextLesson = null;
  let nextModIndex = 1;
  let nextLesIndex = 1;

  for (let m = 0; m < activeCourse.curriculum.length; m++) {
    for (let l = 0; l < activeCourse.curriculum[m].lessons.length; l++) {
      const les = activeCourse.curriculum[m].lessons[l];
      if (!window.atlasState.isLessonCompleted(les.id)) {
        nextLesson = les;
        nextModIndex = m + 1;
        nextLesIndex = l + 1;
        break;
      }
    }
    if (nextLesson) break;
  }

  if (!nextLesson) {
    nextLesson = activeCourse.curriculum[0].lessons[0];
  }

  container.innerHTML = `
    <div class="continue-learning-card">
      <div class="continue-thumb-wrap">
        <img src="${activeCourse.thumbnail}" alt="${activeCourse.title}" />
        <a href="lesson.html?course=${activeCourse.id}&lesson=${nextLesson.id}" class="continue-play-overlay">
          <div class="play-circle-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </a>
      </div>

      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <div class="eyebrow" style="margin-bottom: 0;">Up Next in Your Queue</div>
          <span class="badge badge-accent">${activeCourse.categoryName}</span>
        </div>

        <h2 style="font-size: 1.5rem; margin-bottom: 8px;">
          <a href="lesson.html?course=${activeCourse.id}&lesson=${nextLesson.id}" style="color: var(--text-primary);">${nextLesson.title}</a>
        </h2>

        <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 16px;">
          From: <strong style="color: var(--text-secondary);">${activeCourse.title}</strong> • Module ${nextModIndex}, Lesson ${nextLesIndex} (${nextLesson.duration})
        </div>

        <!-- Progress Bar -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-mono); margin-bottom: 6px;">
            <span style="color: var(--text-muted);">Overall Course Completion</span>
            <strong style="color: ${progress.percentage === 100 ? 'var(--accent-success)' : 'var(--accent-primary)'};">${progress.percentage}% (${progress.completedLessons}/${progress.totalLessons} Lessons)</strong>
          </div>
          <div class="progress-bar-wrap" style="height: 8px;">
            <div class="progress-bar-fill ${progress.percentage === 100 ? 'success' : ''}" style="width: ${progress.percentage}%;"></div>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: gap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${instructor?.avatar || ''}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
            <div style="font-size: 0.8rem;">
              <span style="color: var(--text-muted);">Faculty: </span>
              <strong style="color: var(--text-primary);">${instructor?.name || 'Faculty Lead'}</strong>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <a href="course-detail.html?id=${activeCourse.id}" class="btn btn-outline btn-sm">
              View Syllabus
            </a>
            <a href="lesson.html?course=${activeCourse.id}&lesson=${nextLesson.id}" class="btn btn-accent btn-sm">
              Resume Lesson →
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function switchDashboardTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll(".dashboard-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content-pane").forEach(pane => pane.style.display = "none");

  // Highlight active button
  const buttons = document.querySelectorAll(".dashboard-tab-btn");
  if (tabId === "enrolled" && buttons[0]) buttons[0].classList.add("active");
  if (tabId === "upcoming" && buttons[1]) buttons[1].classList.add("active");
  if (tabId === "certificates" && buttons[2]) buttons[2].classList.add("active");
  if (tabId === "bookmarks" && buttons[3]) buttons[3].classList.add("active");
  if (tabId === "activity" && buttons[4]) buttons[4].classList.add("active");

  const activePane = document.getElementById(`tab-content-${tabId}`);
  if (activePane) activePane.style.display = "block";

  renderDashboard();
}

function renderEnrolledCourses() {
  const container = document.getElementById("enrolled-courses-grid");
  if (!container) return;

  const enrolled = window.atlasState.getEnrolledCourses();
  if (enrolled.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-title">No Enrolled Courses</div>
        <p class="empty-state-desc">You are not currently enrolled in any courses.</p>
        <a href="courses.html" class="btn btn-primary">Browse Courses</a>
      </div>
    `;
    return;
  }

  container.innerHTML = enrolled.map(course => {
    const progress = window.atlasState.getCourseProgress(course.id);
    const instructor = ATLAS_DATA.instructors.find(i => i.id === course.instructorId);

    return `
      <div class="card" style="padding: 24px;">
        <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px;">
          <img src="${course.thumbnail}" alt="${course.title}" style="width: 120px; aspect-ratio: 16/10; object-fit: cover; border-radius: var(--radius-md); flex-shrink: 0;" />
          <div style="flex-grow: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span class="badge badge-accent" style="font-size: 0.72rem;">${course.categoryName}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${course.duration}</span>
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 4px;">
              <a href="lesson.html?course=${course.id}">${course.title}</a>
            </h3>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Lead: ${instructor?.name}</div>
          </div>
        </div>

        <!-- Progress -->
        <div style="margin-bottom: 20px; padding: 14px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-family: var(--font-mono); margin-bottom: 6px;">
            <span style="color: var(--text-muted);">Curriculum Completed</span>
            <strong style="color: ${progress.percentage === 100 ? 'var(--accent-success)' : 'var(--accent-primary)'};">${progress.percentage}% (${progress.completedLessons}/${progress.totalLessons} Lessons)</strong>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill ${progress.percentage === 100 ? 'success' : ''}" style="width: ${progress.percentage}%;"></div>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
          ${progress.percentage === 100 ? `
            <a href="certificate.html?course=${course.id}" class="badge badge-gold" style="padding: 6px 12px; cursor: pointer;">
              🏆 View Official Diploma
            </a>
          ` : `
            <button class="btn btn-ghost btn-sm" style="color: var(--text-muted); font-size: 0.75rem;" onclick="testCompleteCourse('${course.id}')" title="Instantly complete for demo purposes">
              ⚡ Test 100% Complete
            </button>
          `}

          <div style="display: flex; gap: 8px;">
            <a href="course-detail.html?id=${course.id}" class="btn btn-outline btn-sm">Syllabus</a>
            <a href="lesson.html?course=${course.id}" class="btn btn-primary btn-sm">Enter Classroom →</a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderUpcomingLessons() {
  const container = document.getElementById("upcoming-lessons-list");
  if (!container) return;

  container.innerHTML = `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="text-align: center; padding: 10px 16px; background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); font-family: var(--font-mono);">
          <div style="font-size: 0.75rem; color: var(--accent-primary); text-transform: uppercase;">Aug</div>
          <div style="font-size: 1.4rem; font-weight: 700;">26</div>
        </div>
        <div>
          <div class="badge badge-gold" style="font-size: 0.7rem; margin-bottom: 4px;">Live Cohort Workshop</div>
          <h4 style="font-size: 1.05rem; margin-bottom: 4px;">Architecture Breakdown: Zero-Downtime Database Migrations</h4>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Hosted by Dr. Alistair Vance • 6:00 PM UTC • Zoom Live Classroom</div>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="window.AtlasToast.show({ title: 'Calendar Invite Added', message: 'Added to your Google/Outlook calendar.' })">
        Add to Calendar
      </button>
    </div>

    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="text-align: center; padding: 10px 16px; background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); font-family: var(--font-mono);">
          <div style="font-size: 0.75rem; color: var(--accent-primary); text-transform: uppercase;">Sep</div>
          <div style="font-size: 1.4rem; font-weight: 700;">02</div>
        </div>
        <div>
          <div class="badge badge-accent" style="font-size: 0.7rem; margin-bottom: 4px;">Design Systems Clinic</div>
          <h4 style="font-size: 1.05rem; margin-bottom: 4px;">Figma Tokens to Multi-Brand Code: Office Hours</h4>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Hosted by Elena Rostova • 5:00 PM UTC • Interactive Q&A</div>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="window.AtlasToast.show({ title: 'Calendar Invite Added', message: 'Added to your Google/Outlook calendar.' })">
        Add to Calendar
      </button>
    </div>
  `;
}

function renderCertificatesShowcase() {
  const container = document.getElementById("certificates-display-container");
  if (!container) return;

  const certs = window.atlasState.getCertificates();

  if (certs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" style="color: var(--accent-gold);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
        </div>
        <div class="empty-state-title">No Certificates Unlocked Yet</div>
        <p class="empty-state-desc">
          Official Verifiable Diplomas are generated when you reach 100% syllabus completion and pass all module assessments in an enrolled course.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="btn btn-primary" onclick="switchDashboardTab('enrolled')">Continue Learning</button>
          <button class="btn btn-gold" onclick="testCompleteCourse('course-web-101')">⚡ Unlock Demo Diploma (TypeScript)</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-2" style="gap: 24px;">
      ${certs.map(cert => `
        <div class="cert-card">
          <div class="cert-seal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <div class="eyebrow" style="color: var(--accent-gold); margin-bottom: 4px;">Official Diploma Granted</div>
          <h3 style="font-size: 1.25rem; margin-bottom: 6px;">${cert.courseTitle}</h3>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
            Recipient: <strong style="color: var(--text-primary);">${cert.recipientName}</strong> • ${cert.totalHours}
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); padding: 10px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
            Credential ID: <strong style="color: var(--text-primary);">${cert.id}</strong><br/>
            Issued: ${cert.issueDate}
          </div>

          <div style="display: flex; gap: 10px; margin-top: auto;">
            <a href="certificate.html?course=${cert.courseId}" class="btn btn-gold btn-sm w-full" target="_blank">
              View & Print Diploma
            </a>
            <button class="btn btn-outline btn-sm" onclick="copyCertLink('${cert.courseId}')" title="Copy Verification Link">
              Copy Link
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderBookmarksTab() {
  const container = document.getElementById("bookmarks-courses-grid");
  if (!container) return;

  const bookmarked = window.atlasState.getBookmarkedCourses();
  if (bookmarked.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-title">No Saved Bookmarks</div>
        <p class="empty-state-desc">You haven't bookmarked any courses yet. Bookmark programs from the course catalog to quickly access them later.</p>
        <a href="courses.html" class="btn btn-outline">Explore Catalog</a>
      </div>
    `;
    return;
  }

  container.innerHTML = bookmarked.map(c => renderCourseCard(c)).join("");
}

function renderActivityTimeline() {
  const container = document.getElementById("dashboard-activity-feed");
  if (!container) return;

  const logs = window.atlasState.getActivityLog();
  if (logs.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px;">No recent activity.</div>`;
    return;
  }

  container.innerHTML = logs.map(item => {
    let nodeClass = "node-lesson";
    let icon = "✓";
    if (item.type === "quiz_passed") { nodeClass = "node-quiz"; icon = "★"; }
    if (item.type === "enrolled") { nodeClass = "node-enrolled"; icon = "+"; }
    if (item.type === "course_completed") { nodeClass = "node-enrolled"; icon = "🏆"; }

    const timeAgo = formatTimeAgo(item.timestamp);

    return `
      <div class="activity-item">
        <div class="activity-node ${nodeClass}">
          ${icon}
        </div>
        <div class="activity-content">
          <div class="activity-title">${item.title}</div>
          <div class="activity-detail">${item.detail} • <strong style="color: var(--text-primary);">${item.courseName}</strong></div>
          <div class="activity-time">${timeAgo}</div>
        </div>
      </div>
    `;
  }).join("");
}

function formatTimeAgo(isoString) {
  if (!isoString) return "Recently";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

function testCompleteCourse(courseId) {
  window.atlasState.completeEntireCourse(courseId);
  window.AtlasToast.show({
    title: "100% Mastery Achieved! 🏆",
    message: "All lessons & quizzes completed. Your official diploma has been generated!",
    type: "gold",
    duration: 6000
  });
  renderDashboard();
}

function copyCertLink(courseId) {
  const url = `${window.location.origin}/certificate.html?course=${courseId}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    window.AtlasToast.show({
      title: "Credential Link Copied",
      message: "Direct certificate verification URL copied to clipboard."
    });
  }
}

function exportStudentData() {
  window.atlasState.exportDataJSON();
  window.AtlasToast.show({
    title: "Data Exported",
    message: "Your learning progress, notes, and certificates were exported as JSON."
  });
}
