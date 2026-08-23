/**
 * Atlas Academy - Course Detail Controller
 */

let currentCourse = null;

document.addEventListener("DOMContentLoaded", () => {
  loadCourseDetails();

  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      updateEnrollmentUI();
      updateBookmarkUI();
      renderCurriculumAccordion();
    });
  }
});

function loadCourseDetails() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id") || "course-web-101";

  if (!window.ATLAS_DATA) return;
  currentCourse = ATLAS_DATA.courses.find(c => c.id === courseId) || ATLAS_DATA.courses[0];

  document.title = `${currentCourse.title} — Atlas Academy`;

  // Breadcrumbs & Badges
  const catBreadcrumb = document.getElementById("course-breadcrumb-category");
  if (catBreadcrumb) catBreadcrumb.textContent = currentCourse.categoryName;

  const badge = document.getElementById("course-badge");
  if (badge) badge.textContent = currentCourse.badge || currentCourse.categoryName;

  const level = document.getElementById("course-level");
  if (level) level.textContent = currentCourse.level;

  // Title & Tagline
  const title = document.getElementById("course-title");
  if (title) title.textContent = currentCourse.title;

  const tagline = document.getElementById("course-tagline");
  if (tagline) tagline.textContent = currentCourse.tagline;

  // Stats
  const rating = document.getElementById("course-rating");
  if (rating) rating.textContent = currentCourse.rating;

  const reviews = document.getElementById("course-reviews-count");
  if (reviews) reviews.textContent = `(${currentCourse.reviewsCount} reviews)`;

  const students = document.getElementById("course-students-count");
  if (students) students.textContent = currentCourse.studentsCount.toLocaleString();

  const duration = document.getElementById("course-duration");
  if (duration) duration.textContent = currentCourse.duration;

  const price = document.getElementById("course-price-display");
  if (price) price.textContent = `$${currentCourse.price}`;

  const thumb = document.getElementById("course-thumb");
  if (thumb) thumb.src = currentCourse.thumbnail;

  const overview = document.getElementById("course-overview-text");
  if (overview) overview.textContent = currentCourse.overview;

  // Outcomes
  const outcomesList = document.getElementById("course-outcomes-list");
  if (outcomesList) {
    outcomesList.innerHTML = currentCourse.learningOutcomes.map(item => `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <span style="color: var(--accent-success); margin-top: 2px;">${ATLAS_ICONS.check}</span>
        <span style="font-size: 0.925rem; color: var(--text-primary); line-height: 1.5;">${item}</span>
      </div>
    `).join("");
  }

  // Prerequisites
  const prereqsList = document.getElementById("course-prereqs-list");
  if (prereqsList) {
    prereqsList.innerHTML = currentCourse.prerequisites.map(p => `
      <li style="margin-bottom: 8px;">${p}</li>
    `).join("");
  }

  // Instructor
  const instructor = ATLAS_DATA.instructors.find(i => i.id === currentCourse.instructorId);
  if (instructor) {
    const instAvatar = document.getElementById("instructor-avatar");
    if (instAvatar) instAvatar.src = instructor.avatar;

    const instName = document.getElementById("instructor-name");
    if (instName) instName.textContent = instructor.name;

    const instTitle = document.getElementById("instructor-title");
    if (instTitle) instTitle.textContent = instructor.title;

    const instBio = document.getElementById("instructor-bio");
    if (instBio) instBio.textContent = instructor.bio;

    const instStudents = document.getElementById("instructor-students");
    if (instStudents) instStudents.textContent = `${instructor.studentsCount.toLocaleString()} Students`;

    const instRating = document.getElementById("instructor-rating");
    if (instRating) instRating.textContent = `★ ${instructor.rating} Rating`;
  }

  // Certificate Link
  const certLink = document.getElementById("preview-cert-link");
  if (certLink) certLink.href = `certificate.html?course=${currentCourse.id}`;

  renderCurriculumAccordion();
  updateEnrollmentUI();
  updateBookmarkUI();
}

function renderCurriculumAccordion() {
  const container = document.getElementById("curriculum-accordion-container");
  const meta = document.getElementById("curriculum-summary-meta");
  if (!container || !currentCourse) return;

  let totalModules = currentCourse.curriculum.length;
  let totalLessons = 0;
  currentCourse.curriculum.forEach(m => totalLessons += m.lessons.length);

  if (meta) {
    meta.textContent = `${totalModules} Modules • ${totalLessons} Lessons • ${currentCourse.duration} Total Time`;
  }

  const isEnrolled = window.atlasState ? window.atlasState.isEnrolled(currentCourse.id) : false;

  container.innerHTML = currentCourse.curriculum.map((mod, modIdx) => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
      <div style="padding: 16px 20px; background: var(--bg-surface-subtle); display: flex; align-items: center; justify-content: space-between; cursor: pointer;" onclick="toggleModule(${modIdx})">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-primary); font-weight: 700;">
            0${modIdx + 1}
          </span>
          <span style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${mod.moduleTitle}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 16px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
          <span>${mod.lessons.length} lessons</span>
          <span>${mod.moduleDuration}</span>
          <span id="module-arrow-${modIdx}" style="transition: transform 0.2s;">▼</span>
        </div>
      </div>

      <div id="module-content-${modIdx}" style="display: block; border-top: 1px solid var(--border-subtle);">
        ${mod.lessons.map(les => {
          const isDone = window.atlasState ? window.atlasState.isLessonCompleted(les.id) : false;
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid var(--border-subtle); font-size: 0.875rem;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="color: ${isDone ? 'var(--accent-success)' : 'var(--text-muted)'};">
                  ${isDone ? ATLAS_ICONS.check : (les.type === 'quiz' ? '❓' : ATLAS_ICONS.play)}
                </span>
                <span style="color: var(--text-primary); font-weight: ${isDone ? '400' : '500'};">${les.title}</span>
                ${les.freePreview ? `<span class="badge badge-outline" style="font-size: 0.7rem; padding: 2px 6px;">Free Preview</span>` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${les.duration}</span>
                ${isEnrolled ? `
                  <a href="lesson.html?course=${currentCourse.id}&lesson=${les.id}" class="btn btn-ghost btn-sm" style="font-size: 0.75rem;">
                    Launch →
                  </a>
                ` : (les.freePreview ? `
                  <button class="btn btn-ghost btn-sm" style="font-size: 0.75rem; color: var(--accent-primary);" onclick="openSamplePreviewModal()">
                    Preview
                  </button>
                ` : '')}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

function toggleModule(idx) {
  const content = document.getElementById(`module-content-${idx}`);
  const arrow = document.getElementById(`module-arrow-${idx}`);
  if (content) {
    if (content.style.display === "none") {
      content.style.display = "block";
      if (arrow) arrow.style.transform = "rotate(0deg)";
    } else {
      content.style.display = "none";
      if (arrow) arrow.style.transform = "rotate(-90deg)";
    }
  }
}

function expandAllModules() {
  if (!currentCourse) return;
  currentCourse.curriculum.forEach((_, idx) => {
    const content = document.getElementById(`module-content-${idx}`);
    const arrow = document.getElementById(`module-arrow-${idx}`);
    if (content) content.style.display = "block";
    if (arrow) arrow.style.transform = "rotate(0deg)";
  });
}

function updateEnrollmentUI() {
  if (!currentCourse || !window.atlasState) return;

  const isEnrolled = window.atlasState.isEnrolled(currentCourse.id);
  const enrollBtn = document.getElementById("enroll-action-btn");
  const progressBox = document.getElementById("enrollment-progress-box");
  const progressFill = document.getElementById("enrollment-progress-fill");
  const progressPercent = document.getElementById("enrollment-progress-percent");

  if (isEnrolled) {
    const progress = window.atlasState.getCourseProgress(currentCourse.id);
    if (enrollBtn) {
      enrollBtn.textContent = progress.percentage === 100 ? "Review Completed Course" : `Resume Learning (${progress.percentage}%)`;
      enrollBtn.className = "btn btn-accent btn-lg w-full";
      enrollBtn.onclick = () => {
        window.location.href = `lesson.html?course=${currentCourse.id}`;
      };
    }

    if (progressBox) progressBox.style.display = "block";
    if (progressFill) progressFill.style.width = `${progress.percentage}%`;
    if (progressPercent) progressPercent.textContent = `${progress.percentage}%`;
  } else {
    if (enrollBtn) {
      enrollBtn.textContent = `Enroll in Masterclass ($${currentCourse.price})`;
      enrollBtn.className = "btn btn-primary btn-lg w-full";
      enrollBtn.onclick = handleEnrollClick;
    }
    if (progressBox) progressBox.style.display = "none";
  }
}

function handleEnrollClick() {
  if (!currentCourse || !window.atlasState) return;

  window.atlasState.enrollCourse(currentCourse.id);
  window.AtlasToast.show({
    title: "Enrolled Successfully!",
    message: `You now have full access to ${currentCourse.title}. Opening classroom...`,
    type: "info"
  });

  updateEnrollmentUI();
  renderCurriculumAccordion();

  setTimeout(() => {
    window.location.href = `lesson.html?course=${currentCourse.id}`;
  }, 1000);
}

function updateBookmarkUI() {
  if (!currentCourse || !window.atlasState) return;

  const isBookmarked = window.atlasState.isCourseBookmarked(currentCourse.id);
  const bookmarkBtn = document.getElementById("bookmark-action-btn");
  const bookmarkText = document.getElementById("bookmark-btn-text");

  if (bookmarkBtn) {
    if (isBookmarked) {
      bookmarkBtn.classList.add("btn-gold");
      bookmarkBtn.classList.remove("btn-outline");
      if (bookmarkText) bookmarkText.textContent = "Bookmarked";
    } else {
      bookmarkBtn.classList.remove("btn-gold");
      bookmarkBtn.classList.add("btn-outline");
      if (bookmarkText) bookmarkText.textContent = "Bookmark";
    }
  }
}

function handleDetailBookmarkClick() {
  if (!currentCourse || !window.atlasState) return;
  const isBookmarked = window.atlasState.toggleCourseBookmark(currentCourse.id);
  updateBookmarkUI();

  window.AtlasToast.show({
    title: isBookmarked ? "Bookmark Saved" : "Bookmark Removed",
    message: isBookmarked ? "Course pinned to your student workspace." : "Course removed from bookmarks."
  });
}

function handleShareClick() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    window.AtlasToast.show({
      title: "Link Copied",
      message: "Course URL copied to clipboard."
    });
  }
}

function openSamplePreviewModal() {
  const modal = document.getElementById("sample-preview-modal");
  if (modal) modal.classList.add("open");
}

function closeSamplePreviewModal() {
  const modal = document.getElementById("sample-preview-modal");
  if (modal) modal.classList.remove("open");
}
