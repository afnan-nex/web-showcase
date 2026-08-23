/**
 * Atlas Academy - Student Profile & Data Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();
  renderMasterNotesRepository();
  renderProfileBookmarks();

  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      loadProfileData();
      renderMasterNotesRepository();
      renderProfileBookmarks();
    });
  }
});

function loadProfileData() {
  if (!window.atlasState) return;
  const user = window.atlasState.getUser();

  const nameInput = document.getElementById("input-name");
  const titleInput = document.getElementById("input-title");
  const emailInput = document.getElementById("input-email");
  const goalInput = document.getElementById("input-goal");

  const dispName = document.getElementById("profile-display-name");
  const dispTitle = document.getElementById("profile-display-title");
  const avatar = document.getElementById("profile-avatar-lg");

  if (nameInput && user.name) nameInput.value = user.name;
  if (titleInput && user.title) titleInput.value = user.title;
  if (emailInput && user.email) emailInput.value = user.email;
  if (goalInput && user.weeklyGoalHours) goalInput.value = user.weeklyGoalHours;

  if (dispName && user.name) dispName.textContent = user.name;
  if (dispTitle && user.title) dispTitle.textContent = `${user.title} • Active Fellow`;
  if (avatar && user.avatar) avatar.src = user.avatar;
}

function saveProfileChanges(event) {
  event.preventDefault();
  if (!window.atlasState) return;

  const name = document.getElementById("input-name").value.trim();
  const title = document.getElementById("input-title").value.trim();
  const email = document.getElementById("input-email").value.trim();
  const weeklyGoalHours = parseInt(document.getElementById("input-goal").value) || 10;

  window.atlasState.updateUser({
    name,
    title,
    email,
    weeklyGoalHours
  });

  window.AtlasToast.show({
    title: "Profile Saved",
    message: "Your changes have been saved to your local storage state.",
    type: "info"
  });
}

function renderMasterNotesRepository() {
  const container = document.getElementById("all-notes-list");
  const badge = document.getElementById("all-notes-count-badge");
  if (!container || !window.atlasState) return;

  const notes = window.atlasState.getNotes();
  if (badge) badge.textContent = `${notes.length} ${notes.length === 1 ? 'Note' : 'Notes'}`;

  if (notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 32px;">
        <div class="empty-state-title">No Notes Captured Yet</div>
        <p class="empty-state-desc">When you take notes in the classroom video player, they will be indexed here with their precise timestamps.</p>
        <a href="student-dashboard.html" class="btn btn-outline btn-sm">Go to Dashboard</a>
      </div>
    `;
    return;
  }

  container.innerHTML = notes.map(note => `
    <div class="note-item-card">
      <div class="note-item-header">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${note.courseTitle || 'Masterclass'}</span>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${note.lessonTitle || 'Lesson'}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <a href="lesson.html?course=${note.courseId}&lesson=${note.lessonId}" class="note-timestamp-badge" title="Open lesson at this timestamp">
            ⏱ ${note.timestamp || '00:00'}
          </a>
          <button class="btn-ghost" style="padding: 2px; color: var(--text-muted);" onclick="deleteProfileNote('${note.id}')" title="Delete Note">
            ${ATLAS_ICONS.trash}
          </button>
        </div>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.55; margin-top: 8px; white-space: pre-wrap;">
        ${escapeHtml(note.content)}
      </p>
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 10px;">
        Saved on ${new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
      </div>
    </div>
  `).join("");
}

function deleteProfileNote(noteId) {
  if (!window.atlasState) return;
  window.atlasState.deleteNote(noteId);
  renderMasterNotesRepository();
  window.AtlasToast.show({ title: "Note Deleted", message: "Removed from repository." });
}

function renderProfileBookmarks() {
  const container = document.getElementById("profile-bookmarks-grid");
  if (!container || !window.atlasState) return;

  const bookmarked = window.atlasState.getBookmarkedCourses();
  if (bookmarked.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 24px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        No bookmarked courses.
      </div>
    `;
    return;
  }

  container.innerHTML = bookmarked.map(c => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div class="badge badge-accent" style="font-size: 0.7rem; margin-bottom: 6px;">${c.categoryName}</div>
        <h4 style="font-size: 0.95rem; margin-bottom: 6px;">
          <a href="course-detail.html?id=${c.id}" style="color: var(--text-primary);">${c.title}</a>
        </h4>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${c.duration} • ★ ${c.rating}</div>
      </div>
      <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center;">
        <a href="course-detail.html?id=${c.id}" class="btn btn-outline btn-sm" style="font-size: 0.75rem;">View Syllabus</a>
        <button class="btn-ghost" style="color: var(--accent-gold); padding: 4px;" onclick="removeProfileBookmark('${c.id}')" title="Remove Bookmark">
          ${ATLAS_ICONS.bookmarkFilled}
        </button>
      </div>
    </div>
  `).join("");
}

function removeProfileBookmark(courseId) {
  if (!window.atlasState) return;
  window.atlasState.toggleCourseBookmark(courseId);
  renderProfileBookmarks();
  window.AtlasToast.show({ title: "Bookmark Removed", message: "Course removed from saved items." });
}

function exportData() {
  if (window.atlasState) {
    window.atlasState.exportDataJSON();
    window.AtlasToast.show({ title: "Export Triggered", message: "Downloading JSON state file." });
  }
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const res = window.atlasState.importDataJSON(text);
    if (res.success) {
      window.AtlasToast.show({
        title: "Backup Restored! ✓",
        message: "Your progress, notes, and certificates have been imported.",
        type: "gold"
      });
      loadProfileData();
      renderMasterNotesRepository();
      renderProfileBookmarks();
    } else {
      window.AtlasToast.show({
        title: "Import Failed",
        message: res.error || "Invalid file format",
        type: "error"
      });
    }
  };
  reader.readAsText(file);
}

function resetDemoData() {
  if (confirm("Are you sure you want to reset all progress, notes, and certificates back to the default demo state?")) {
    if (window.atlasState) {
      window.atlasState.resetToDemoState();
      window.AtlasToast.show({
        title: "State Reset",
        message: "Reloaded default demo user profile and progress."
      });
      loadProfileData();
      renderMasterNotesRepository();
      renderProfileBookmarks();
    }
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
    }
  });
}
