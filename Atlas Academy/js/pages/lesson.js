/**
 * Atlas Academy - Classroom & Lesson Player Controller
 * Full Video Simulation, Notes with Timestamps, Interactive Quizzes, and Syllabus Sync
 */

let currentCourseId = "course-web-101";
let currentLessonId = "les-web-101-1";
let currentCourse = null;
let currentLesson = null;
let currentModule = null;

// Video Simulation State
let isPlaying = false;
let currentTimeSec = 0;
let durationSec = 1450; // default ~24m
let playbackSpeed = 1.0;
let isMuted = false;
let animFrameId = null;
let canvasCtx = null;

// Active Tabs
let activeLessonTab = "overview";

document.addEventListener("DOMContentLoaded", () => {
  initUrlParams();
  loadLessonData();
  initPlayerCanvas();
  initKeyboardShortcuts();

  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      updateTopBarProgress();
      renderSyllabusSidebar();
      renderNotesList();
    });
  }
});

function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("course")) currentCourseId = params.get("course");
  if (params.has("lesson")) currentLessonId = params.get("lesson");
}

function loadLessonData() {
  if (!window.ATLAS_DATA) return;

  currentCourse = ATLAS_DATA.courses.find(c => c.id === currentCourseId) || ATLAS_DATA.courses[0];
  currentCourseId = currentCourse.id;

  // Auto-enroll if not enrolled
  if (window.atlasState && !window.atlasState.isEnrolled(currentCourseId)) {
    window.atlasState.enrollCourse(currentCourseId);
  }

  // Find lesson and parent module
  let found = false;
  for (const mod of currentCourse.curriculum) {
    for (const les of mod.lessons) {
      if (les.id === currentLessonId) {
        currentLesson = les;
        currentModule = mod;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!found) {
    currentLesson = currentCourse.curriculum[0].lessons[0];
    currentModule = currentCourse.curriculum[0];
    currentLessonId = currentLesson.id;
  }

  if (window.atlasState) {
    window.atlasState.setLastAccessedLesson(currentCourseId, currentLessonId);
  }

  // Set video duration
  durationSec = currentLesson.videoLengthSec || parseDurationToSec(currentLesson.duration) || 900;
  currentTimeSec = 0;
  isPlaying = false;

  // Populate UI
  document.title = `${currentLesson.title} — ${currentCourse.title} | Atlas Academy`;

  const topCourseTitle = document.getElementById("classroom-course-title");
  if (topCourseTitle) topCourseTitle.textContent = currentCourse.title;

  const topLessonCrumb = document.getElementById("classroom-lesson-crumb");
  if (topLessonCrumb) topLessonCrumb.textContent = currentLesson.title;

  const moduleTag = document.getElementById("lesson-module-tag");
  if (moduleTag) moduleTag.textContent = currentModule.moduleTitle;

  const headingTitle = document.getElementById("lesson-heading-title");
  if (headingTitle) headingTitle.textContent = currentLesson.title;

  const durationText = document.getElementById("lesson-duration-text");
  if (durationText) durationText.textContent = currentLesson.duration;

  const instructorText = document.getElementById("lesson-instructor-text");
  const instructor = ATLAS_DATA.instructors.find(i => i.id === currentCourse.instructorId);
  if (instructorText) instructorText.textContent = instructor?.name || "Lead Faculty";

  const summaryContent = document.getElementById("lesson-summary-content");
  if (summaryContent) summaryContent.textContent = currentLesson.summary || currentCourse.tagline;

  // Update Player Time display
  updatePlayerTimeDisplay();
  updateScrubberUI();
  updatePlayPauseUI();

  // If lesson is a quiz, auto-switch to quiz tab
  if (currentLesson.type === "quiz") {
    switchLessonTab("quiz");
  } else {
    switchLessonTab("overview");
  }

  updateTopBarProgress();
  updateCompletionButtonUI();
  updateBookmarkButtonUI();
  renderSyllabusSidebar();
  renderNotesList();
  renderResourcesList();
  renderQuizPanel();
}

/* --- Interactive Canvas Player Simulation --- */
function initPlayerCanvas() {
  const canvas = document.getElementById("player-canvas");
  if (!canvas) return;
  canvasCtx = canvas.getContext("2d");

  function renderFrame(timestamp) {
    drawPlayerVisual(timestamp);
    if (isPlaying) {
      currentTimeSec += (0.016 * playbackSpeed);
      if (currentTimeSec >= durationSec) {
        currentTimeSec = durationSec;
        isPlaying = false;
        updatePlayPauseUI();
        onVideoCompleted();
      }
      updatePlayerTimeDisplay();
      updateScrubberUI();
    }
    animFrameId = requestAnimationFrame(renderFrame);
  }

  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(renderFrame);
}

function drawPlayerVisual(time) {
  if (!canvasCtx) return;
  const ctx = canvasCtx;
  const w = 1280;
  const h = 720;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, "#080c14");
  bgGrad.addColorStop(1, "#111827");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle Technical Grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Technical HUD Overlay & Waveform
  const t = time * 0.002;
  const isCurrentlyPlaying = isPlaying;

  // Render Dynamic Waveform in Center
  ctx.lineWidth = 2;
  const centerY = h / 2 + 30;
  const wavePoints = 80;
  
  ctx.beginPath();
  for (let i = 0; i < wavePoints; i++) {
    const x = (w / wavePoints) * i;
    const freq = isCurrentlyPlaying ? Math.sin(t * 2 + i * 0.15) * Math.cos(t + i * 0.05) : 0.2;
    const amp = isCurrentlyPlaying ? 40 : 8;
    const y = centerY + freq * amp;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = isCurrentlyPlaying ? "#3b82f6" : "#64748b";
  ctx.stroke();

  // Top Left Watermark & Video Title
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(currentLesson?.title || "Atlas Classroom", 60, 80);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "16px 'JetBrains Mono', monospace";
  ctx.fillText(`${currentCourse?.title} • ${currentModule?.moduleTitle}`, 60, 112);

  // Top Right Live Bitrate / Resolution Tag
  ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
  ctx.fillRect(w - 240, 50, 180, 36);
  ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
  ctx.strokeRect(w - 240, 50, 180, 36);

  ctx.fillStyle = "#60a5fa";
  ctx.font = "600 14px 'JetBrains Mono', monospace";
  ctx.fillText(`4K PRO • ${playbackSpeed}x SPEED`, w - 225, 74);

  // Lesson Status Watermark in Center if Paused
  if (!isPlaying) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.font = "bold 72px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillText("ATLAS ACADEMY", w / 2, centerY - 80);
    ctx.textAlign = "left";
  }
}

function toggleVideoPlayback() {
  isPlaying = !isPlaying;
  updatePlayPauseUI();
}

function updatePlayPauseUI() {
  const overlay = document.getElementById("player-center-overlay");
  const playIcon = document.getElementById("ctrl-play-icon");

  if (overlay) {
    if (isPlaying) {
      overlay.classList.add("hidden");
    } else {
      overlay.classList.remove("hidden");
    }
  }

  if (playIcon) {
    playIcon.innerHTML = isPlaying ? ATLAS_ICONS.pause : ATLAS_ICONS.play;
  }
}

function handleScrubberClick(event) {
  const track = document.getElementById("player-scrub-track");
  if (!track) return;
  const rect = track.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, clickX / rect.width));
  currentTimeSec = pct * durationSec;
  updatePlayerTimeDisplay();
  updateScrubberUI();
}

function updateScrubberUI() {
  const fill = document.getElementById("player-scrub-fill");
  const thumb = document.getElementById("player-scrub-thumb");
  const pct = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  if (fill) fill.style.width = `${pct}%`;
  if (thumb) thumb.style.left = `${pct}%`;
}

function updatePlayerTimeDisplay() {
  const timeText = document.getElementById("player-time-text");
  const stampPreview = document.getElementById("stamp-preview-text");

  const currentFormatted = formatSeconds(currentTimeSec);
  const totalFormatted = formatSeconds(durationSec);

  if (timeText) timeText.textContent = `${currentFormatted} / ${totalFormatted}`;
  if (stampPreview) stampPreview.textContent = currentFormatted;
}

function skipTime(seconds) {
  currentTimeSec = Math.max(0, Math.min(durationSec, currentTimeSec + seconds));
  updatePlayerTimeDisplay();
  updateScrubberUI();
}

function toggleMute() {
  isMuted = !isMuted;
  const volIcon = document.getElementById("ctrl-volume-icon");
  if (volIcon) {
    volIcon.innerHTML = isMuted ? ATLAS_ICONS.volumeMute : ATLAS_ICONS.volume;
  }
}

function changePlaybackSpeed(speedVal) {
  playbackSpeed = parseFloat(speedVal) || 1.0;
}

function toggleFullscreen() {
  const elem = document.getElementById("player-wrapper");
  if (!elem) return;
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) elem.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

function onVideoCompleted() {
  if (window.atlasState) {
    window.atlasState.markLessonComplete(currentCourseId, currentLessonId);
    window.atlasState.addTimeSpent(Math.round(durationSec));
  }
  updateCompletionButtonUI();
  updateTopBarProgress();
  renderSyllabusSidebar();

  window.AtlasToast.show({
    title: "Lesson Completed! ✓",
    message: "Your progress has been recorded. Advancing to the next module.",
    type: "info"
  });
}

/* --- Keyboard Shortcuts --- */
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Avoid triggering when focused on note textarea or search
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;

    if (e.code === "Space" || e.key.toLowerCase() === "k") {
      e.preventDefault();
      toggleVideoPlayback();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      skipTime(-5);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      skipTime(5);
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key.toLowerCase() === "m") {
      e.preventDefault();
      toggleMute();
    }
  });
}

/* --- Tabs Management --- */
function switchLessonTab(tabId) {
  activeLessonTab = tabId;
  document.querySelectorAll(".lesson-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".lesson-tab-panel").forEach(panel => panel.style.display = "none");

  const buttons = document.querySelectorAll(".lesson-tab-btn");
  if (tabId === "overview" && buttons[0]) buttons[0].classList.add("active");
  if (tabId === "notes" && buttons[1]) buttons[1].classList.add("active");
  if (tabId === "resources" && buttons[2]) buttons[2].classList.add("active");
  if (tabId === "quiz" && buttons[3]) buttons[3].classList.add("active");

  const targetPanel = document.getElementById(`lesson-panel-${tabId}`);
  if (targetPanel) targetPanel.style.display = "block";
}

/* --- Top Bar & Progress --- */
function updateTopBarProgress() {
  if (!window.atlasState || !currentCourse) return;
  const progress = window.atlasState.getCourseProgress(currentCourse.id);

  const text = document.getElementById("classroom-progress-text");
  const fill = document.getElementById("classroom-progress-fill");

  if (text) text.textContent = `${progress.percentage}%`;
  if (fill) fill.style.width = `${progress.percentage}%`;
}

function updateCompletionButtonUI() {
  if (!window.atlasState || !currentLesson) return;
  const isDone = window.atlasState.isLessonCompleted(currentLesson.id);
  const btn = document.getElementById("classroom-complete-btn");

  if (btn) {
    if (isDone) {
      btn.textContent = "✓ Completed";
      btn.className = "btn btn-outline btn-sm";
      btn.style.color = "var(--accent-success)";
      btn.style.borderColor = "var(--accent-success)";
    } else {
      btn.textContent = "Mark Complete";
      btn.className = "btn btn-primary btn-sm";
      btn.style.color = "";
      btn.style.borderColor = "";
    }
  }
}

function toggleClassroomLessonCompletion() {
  if (!window.atlasState || !currentLesson) return;
  const isNowDone = window.atlasState.toggleLessonCompletion(currentCourseId, currentLesson.id);
  updateCompletionButtonUI();
  updateTopBarProgress();
  renderSyllabusSidebar();

  window.AtlasToast.show({
    title: isNowDone ? "Lesson Completed" : "Lesson Unchecked",
    message: isNowDone ? "Recorded in your study progress." : "Removed from completed status."
  });
}

function updateBookmarkButtonUI() {
  if (!window.atlasState || !currentLesson) return;
  const isBookmarked = window.atlasState.isLessonBookmarked(currentLesson.id);
  const btn = document.getElementById("classroom-bookmark-btn");
  const label = document.getElementById("classroom-bookmark-label");

  if (btn) {
    if (isBookmarked) {
      btn.classList.add("btn-gold");
      btn.classList.remove("btn-outline");
      if (label) label.textContent = "Bookmarked";
    } else {
      btn.classList.remove("btn-gold");
      btn.classList.add("btn-outline");
      if (label) label.textContent = "Bookmark";
    }
  }
}

function toggleClassroomLessonBookmark() {
  if (!window.atlasState || !currentLesson) return;
  const isNowBookmarked = window.atlasState.toggleLessonBookmark(currentCourseId, currentLesson.id, currentLesson.title);
  updateBookmarkButtonUI();

  window.AtlasToast.show({
    title: isNowBookmarked ? "Lesson Bookmarked" : "Bookmark Removed",
    message: isNowBookmarked ? "Pinned to your student dashboard." : "Removed from bookmarks."
  });
}

/* --- Notes Manager --- */
function captureCurrentTimestamp() {
  const formatted = formatSeconds(currentTimeSec);
  const stampPreview = document.getElementById("stamp-preview-text");
  if (stampPreview) stampPreview.textContent = formatted;
  window.AtlasToast.show({ title: "Timestamp Pinned", message: `Note will link to ${formatted}` });
}

function saveNewLessonNote() {
  const textarea = document.getElementById("lesson-note-textarea");
  if (!textarea || !textarea.value.trim() || !window.atlasState) return;

  const content = textarea.value.trim();
  const formattedTime = formatSeconds(currentTimeSec);

  window.atlasState.addNote({
    courseId: currentCourseId,
    lessonId: currentLessonId,
    lessonTitle: currentLesson.title,
    timestamp: formattedTime,
    timestampSec: Math.round(currentTimeSec),
    content
  });

  textarea.value = "";
  renderNotesList();

  window.AtlasToast.show({
    title: "Note Saved",
    message: `Pinned to timestamp ${formattedTime}`
  });
}

function renderNotesList() {
  const container = document.getElementById("lesson-notes-list-container");
  const badge = document.getElementById("lesson-notes-badge");
  if (!container || !window.atlasState) return;

  const notes = window.atlasState.getNotes(currentCourseId, currentLessonId);
  if (badge) badge.textContent = notes.length;

  if (notes.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 32px; font-size: 0.875rem;">
        No notes created for this lesson yet. Type in the box above to capture key insights with timestamps.
      </div>
    `;
    return;
  }

  container.innerHTML = notes.map(note => `
    <div class="note-item-card" id="${note.id}">
      <div class="note-item-header">
        <span class="note-timestamp-badge" onclick="seekToTimestamp(${note.timestampSec || 0})" title="Jump to this video timestamp">
          ⏱ ${note.timestamp || "00:00"}
        </span>
        <div style="display: flex; gap: 8px;">
          <button class="btn-ghost" style="padding: 2px; color: var(--text-muted);" onclick="deleteLessonNote('${note.id}')" title="Delete Note">
            ${ATLAS_ICONS.trash}
          </button>
        </div>
      </div>
      <div style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.55; white-space: pre-wrap;">${escapeHtml(note.content)}</div>
      <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-top: 8px;">
        Saved on ${new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  `).join("");
}

function seekToTimestamp(sec) {
  currentTimeSec = Math.max(0, Math.min(durationSec, sec));
  updatePlayerTimeDisplay();
  updateScrubberUI();
  if (!isPlaying) toggleVideoPlayback();
  window.AtlasToast.show({ title: "Seek", message: `Jumped to ${formatSeconds(sec)}` });
}

function deleteLessonNote(noteId) {
  if (!window.atlasState) return;
  window.atlasState.deleteNote(noteId);
  renderNotesList();
  window.AtlasToast.show({ title: "Note Deleted", message: "Removed from your repository." });
}

/* --- Resources Panel --- */
function renderResourcesList() {
  const container = document.getElementById("lesson-resources-list-container");
  const badge = document.getElementById("lesson-resources-badge");
  if (!container) return;

  const resources = currentLesson?.resources || [
    { name: `${currentLesson?.title || 'Lesson'}-Cheatsheet.pdf`, size: "1.4 MB", type: "pdf" },
    { name: `module-starter-code.zip`, size: "480 KB", type: "zip" }
  ];

  if (badge) badge.textContent = resources.length;

  container.innerHTML = resources.map(res => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--accent-primary);">
          ${ATLAS_ICONS.fileText}
        </div>
        <div>
          <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${res.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${res.size} • Official Materials</div>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="downloadLessonResource('${res.name}')">
        ${ATLAS_ICONS.download} Download
      </button>
    </div>
  `).join("");
}

function downloadLessonResource(name) {
  window.AtlasToast.show({
    title: "Download Started",
    message: `Saved ${name} for offline reference.`,
    type: "info"
  });
}

/* --- Interactive Quiz Panel --- */
function renderQuizPanel() {
  const container = document.getElementById("lesson-quiz-container");
  if (!container || !window.ATLAS_DATA) return;

  const quizId = currentLesson?.quizId || currentCourse?.curriculum[0]?.lessons.find(l => l.quizId)?.quizId || "quiz-web-101-m1";
  const quiz = ATLAS_DATA.quizzes[quizId];

  if (!quiz) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 40px;">
        No assessment attached to this specific lesson. Check the final lesson in this module for the milestone quiz.
      </div>
    `;
    return;
  }

  const existingResult = window.atlasState ? window.atlasState.getQuizResult(quiz.id) : null;

  container.innerHTML = `
    <div class="quiz-header">
      <div>
        <div class="eyebrow" style="margin-bottom: 2px;">Interactive Assessment</div>
        <h3 style="font-size: 1.25rem;">${quiz.title}</h3>
      </div>
      <div style="text-align: right; font-family: var(--font-mono); font-size: 0.8rem;">
        <span style="color: var(--text-muted);">Passing Score: </span>
        <strong style="color: var(--accent-gold);">${quiz.passingScore}%</strong>
        ${existingResult ? `<br/><span style="color: ${existingResult.passed ? 'var(--accent-success)' : 'var(--accent-danger)'};">Last Attempt: ${existingResult.score}%</span>` : ''}
      </div>
    </div>

    <form id="quiz-form" onsubmit="submitQuiz(event, '${quiz.id}')">
      ${quiz.questions.map((q, qIdx) => `
        <div class="quiz-question-box" id="q-box-${q.id}">
          <div class="quiz-question-title">
            <span style="font-family: var(--font-mono); color: var(--accent-primary); font-size: 0.9rem; margin-right: 6px;">0${qIdx + 1}.</span>
            ${q.question}
          </div>

          <div class="quiz-options-list">
            ${q.options.map((opt, oIdx) => `
              <label class="quiz-option-btn" for="q-${q.id}-opt-${oIdx}">
                <input type="radio" name="${q.id}" id="q-${q.id}-opt-${oIdx}" value="${oIdx}" style="display: none;" onchange="handleOptionSelect(this)" />
                <span class="quiz-option-letter">${String.fromCharCode(65 + oIdx)}</span>
                <span>${opt}</span>
              </label>
            `).join("")}
          </div>

          <div id="q-explanation-${q.id}" class="quiz-explanation" style="display: none;">
            ${q.explanation}
          </div>
        </div>
      `).join("")}

      <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid var(--border-subtle);">
        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
          Answer all ${quiz.questions.length} questions to evaluate comprehension.
        </span>
        <button type="submit" class="btn btn-primary btn-md">
          Submit Assessment
        </button>
      </div>
    </form>
  `;
}

function handleOptionSelect(input) {
  const box = input.closest(".quiz-options-list");
  box.querySelectorAll(".quiz-option-btn").forEach(lbl => lbl.classList.remove("selected"));
  input.closest(".quiz-option-btn").classList.add("selected");
}

function submitQuiz(event, quizId) {
  event.preventDefault();
  const quiz = ATLAS_DATA.quizzes[quizId];
  if (!quiz) return;

  const form = document.getElementById("quiz-form");
  const formData = new FormData(form);

  let correctCount = 0;
  const totalQuestions = quiz.questions.length;
  const userAnswers = [];

  quiz.questions.forEach((q) => {
    const selected = formData.get(q.id);
    const selectedIdx = selected !== null ? parseInt(selected) : -1;
    const isCorrect = selectedIdx === q.correctIndex;
    if (isCorrect) correctCount++;

    userAnswers.push({ questionId: q.id, selectedIdx, isCorrect });

    // Highlight correct & incorrect options
    const box = document.getElementById(`q-box-${q.id}`);
    const labels = box.querySelectorAll(".quiz-option-btn");
    labels.forEach((lbl, idx) => {
      lbl.classList.remove("correct", "incorrect", "selected");
      if (idx === q.correctIndex) {
        lbl.classList.add("correct");
      } else if (idx === selectedIdx) {
        lbl.classList.add("incorrect");
      }
    });

    // Show explanation
    const expl = document.getElementById(`q-explanation-${q.id}`);
    if (expl) expl.style.display = "block";
  });

  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quiz.passingScore;

  if (window.atlasState) {
    window.atlasState.saveQuizResult({
      quizId,
      courseId: currentCourseId,
      score,
      totalQuestions,
      correctCount,
      passed,
      answers: userAnswers
    });
  }

  window.AtlasToast.show({
    title: passed ? "Assessment Passed! 🏆" : "Assessment Needs Review",
    message: `You scored ${score}% (${correctCount}/${totalQuestions} correct).`,
    type: passed ? "gold" : "error",
    duration: 5000
  });

  updateTopBarProgress();
  renderSyllabusSidebar();
}

/* --- Syllabus Sidebar --- */
function renderSyllabusSidebar() {
  const treeContainer = document.getElementById("syllabus-module-tree");
  const courseTitle = document.getElementById("sidebar-course-title");
  const compCount = document.getElementById("sidebar-completed-count");
  const totalCount = document.getElementById("sidebar-total-count");
  const certBox = document.getElementById("sidebar-cert-unlock-box");

  if (!treeContainer || !currentCourse) return;

  const progress = window.atlasState ? window.atlasState.getCourseProgress(currentCourse.id) : { completedLessons: 0, totalLessons: 0, percentage: 0 };

  if (courseTitle) courseTitle.textContent = currentCourse.title;
  if (compCount) compCount.textContent = progress.completedLessons;
  if (totalCount) totalCount.textContent = progress.totalLessons;

  treeContainer.innerHTML = currentCourse.curriculum.map((mod, modIdx) => `
    <div class="syllabus-module-group">
      <div class="syllabus-module-header" onclick="toggleSidebarModule(${modIdx})">
        <span>${mod.moduleTitle}</span>
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${mod.moduleDuration}</span>
      </div>

      <div id="side-mod-${modIdx}">
        ${mod.lessons.map(les => {
          const isCurrent = les.id === currentLessonId;
          const isDone = window.atlasState ? window.atlasState.isLessonCompleted(les.id) : false;

          return `
            <div class="syllabus-lesson-item ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}" onclick="selectLesson('${les.id}')">
              <div class="syllabus-checkbox" onclick="event.stopPropagation(); toggleLessonCheck('${les.id}')" title="Click to toggle completion">
                ${isDone ? '✓' : ''}
              </div>
              <div style="flex-grow: 1;">
                <div>${les.title}</div>
                <div class="syllabus-lesson-meta">
                  ${les.type === 'quiz' ? 'Assessment' : 'Video'} • ${les.duration}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");

  // Bottom Certificate Unlock Box
  if (certBox) {
    if (progress.percentage === 100) {
      certBox.innerHTML = `
        <div style="text-align: center;">
          <div style="color: var(--accent-gold); font-size: 1.5rem; margin-bottom: 4px;">🏆</div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--accent-gold); margin-bottom: 4px;">100% Course Mastery</div>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 12px;">Your verifiable official diploma is generated!</p>
          <a href="certificate.html?course=${currentCourse.id}" class="btn btn-gold btn-sm w-full" target="_blank">
            Claim & Print Diploma
          </a>
        </div>
      `;
    } else {
      certBox.innerHTML = `
        <div style="font-size: 0.78rem; color: var(--text-muted); text-align: center;">
          Complete <strong style="color: var(--text-primary);">${progress.remainingLessons} more ${progress.remainingLessons === 1 ? 'lesson' : 'lessons'}</strong> to unlock your official diploma.
        </div>
      `;
    }
  }
}

function toggleSidebarModule(idx) {
  const modEl = document.getElementById(`side-mod-${idx}`);
  if (modEl) {
    modEl.style.display = modEl.style.display === "none" ? "block" : "none";
  }
}

function selectLesson(lessonId) {
  currentLessonId = lessonId;
  const newUrl = `${window.location.pathname}?course=${currentCourseId}&lesson=${lessonId}`;
  window.history.replaceState({}, "", newUrl);
  loadLessonData();
}

function toggleLessonCheck(lessonId) {
  if (!window.atlasState) return;
  window.atlasState.toggleLessonCompletion(currentCourseId, lessonId);
  updateTopBarProgress();
  updateCompletionButtonUI();
  renderSyllabusSidebar();
}

function navigateToAdjacentLesson(direction) {
  if (!currentCourse) return;
  const allLessons = [];
  currentCourse.curriculum.forEach(m => {
    m.lessons.forEach(l => allLessons.push(l));
  });

  const currIdx = allLessons.findIndex(l => l.id === currentLessonId);
  const targetIdx = currIdx + direction;

  if (targetIdx >= 0 && targetIdx < allLessons.length) {
    selectLesson(allLessons[targetIdx].id);
  } else {
    window.AtlasToast.show({
      title: direction > 0 ? "Course Finished!" : "Beginning of Course",
      message: direction > 0 ? "You have reached the end of this syllabus." : "This is the first lesson."
    });
  }
}

/* --- Helpers --- */
function parseDurationToSec(durationStr) {
  if (!durationStr) return 900;
  const parts = durationStr.split(":").map(p => parseInt(p));
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 900;
}

function formatSeconds(sec) {
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);

  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function escapeHtml(str) {
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
