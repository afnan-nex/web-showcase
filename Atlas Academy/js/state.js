/**
 * Atlas Academy - State Management Engine
 * Handles persistence with LocalStorage, reactive updates, and analytics computation
 */

const STORAGE_KEY = "atlas_academy_state_v1";

const DEFAULT_INITIAL_STATE = {
  user: {
    name: "Julian Hayes",
    title: "Senior Staff Engineer & Systems Lead",
    email: "julian.hayes@atlas-fellow.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    memberSince: "January 2026",
    streakDays: 14,
    weeklyGoalHours: 10,
    timeSpentSeconds: 47800 // ~13.2 hours
  },
  enrollments: {
    "course-web-101": {
      enrolledAt: "2026-08-01T09:00:00.000Z",
      lastAccessedLessonId: "les-web-101-4",
      status: "in-progress"
    },
    "course-uiux-201": {
      enrolledAt: "2026-08-10T14:30:00.000Z",
      lastAccessedLessonId: "les-uiux-201-2",
      status: "in-progress"
    }
  },
  completedLessons: {
    "les-web-101-1": true,
    "les-web-101-2": true,
    "les-web-101-3": true,
    "les-uiux-201-1": true
  },
  videoProgress: {
    "les-web-101-4": 420,
    "les-uiux-201-2": 180
  },
  notes: [
    {
      id: "note-1724300001",
      courseId: "course-web-101",
      courseTitle: "Full-Stack TypeScript & Modern Cloud Architecture",
      lessonId: "les-web-101-1",
      lessonTitle: "Generics, Conditional Types & Template Literal Types",
      timestamp: "08:45",
      timestampSec: 525,
      content: "Key architectural takeaway: `Awaited<ReturnType<T>>` recursively resolves unwrapped promise payloads at build time, preventing runtime async mismatch in API handlers.",
      createdAt: "2026-08-12T16:20:00.000Z"
    },
    {
      id: "note-1724300002",
      courseId: "course-uiux-201",
      courseTitle: "Enterprise Design Systems & Interaction Architecture",
      lessonId: "les-uiux-201-1",
      lessonTitle: "Systemic Spacing, Modular Scales & Color Science",
      timestamp: "14:10",
      timestampSec: 850,
      content: "OKLCH palette generation provides uniform perceptual chroma step curves. Use semantic tokens (`surface-canvas-subtle`) instead of raw hex values (`#1E293B`) to ensure dark mode fidelity.",
      createdAt: "2026-08-15T11:05:00.000Z"
    }
  ],
  bookmarks: {
    courses: ["course-py-301", "course-biz-601"],
    lessons: [
      {
        courseId: "course-web-101",
        lessonId: "les-web-101-2",
        lessonTitle: "Type Invariant API Contracts with Zod & OpenAPI"
      }
    ]
  },
  quizResults: {
    "quiz-web-101-m1": {
      quizId: "quiz-web-101-m1",
      courseId: "course-web-101",
      score: 100,
      totalQuestions: 4,
      correctCount: 4,
      passed: true,
      attempts: 1,
      completedAt: "2026-08-13T10:45:00.000Z"
    }
  },
  activityLog: [
    {
      id: "act-1",
      type: "quiz_passed",
      title: "Passed Assessment: Type Systems & Schema Invariants",
      courseName: "Full-Stack TypeScript",
      detail: "Scored 100% on first attempt",
      timestamp: "2026-08-13T10:45:00.000Z"
    },
    {
      id: "act-2",
      type: "lesson_completed",
      title: "Completed: Generics, Conditional Types & Template Literal Types",
      courseName: "Full-Stack TypeScript",
      detail: "Module 1 • Lesson 1",
      timestamp: "2026-08-12T16:40:00.000Z"
    },
    {
      id: "act-3",
      type: "enrolled",
      title: "Enrolled in Enterprise Design Systems & Interaction Architecture",
      courseName: "Enterprise Design Systems",
      detail: "Instructor: Elena Rostova",
      timestamp: "2026-08-10T14:30:00.000Z"
    }
  ]
};

class AtlasState {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_INITIAL_STATE, ...parsed };
      }
    } catch (e) {
      console.warn("AtlasState: Error reading localStorage", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error("AtlasState: Error saving state to localStorage", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error("AtlasState subscriber error:", err);
      }
    });
  }

  /* ================= User Profile ================= */
  getUser() {
    return this.state.user;
  }

  updateUser(updates) {
    this.state.user = { ...this.state.user, ...updates };
    this.saveState();
  }

  addTimeSpent(seconds) {
    this.state.user.timeSpentSeconds = (this.state.user.timeSpentSeconds || 0) + seconds;
    this.saveState();
  }

  /* ================= Enrollment ================= */
  isEnrolled(courseId) {
    return Boolean(this.state.enrollments && this.state.enrollments[courseId]);
  }

  enrollCourse(courseId) {
    if (!this.state.enrollments) this.state.enrollments = {};
    if (!this.state.enrollments[courseId]) {
      const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
      const firstLessonId = course?.curriculum[0]?.lessons[0]?.id || "";
      
      this.state.enrollments[courseId] = {
        enrolledAt: new Date().toISOString(),
        lastAccessedLessonId: firstLessonId,
        status: "in-progress"
      };

      this.logActivity({
        type: "enrolled",
        title: `Enrolled in ${course?.title || "New Course"}`,
        courseName: course?.title || "Course",
        detail: `Instructor: ${this.getInstructorName(course?.instructorId)}`
      });

      this.saveState();
    }
  }

  unenrollCourse(courseId) {
    if (this.state.enrollments && this.state.enrollments[courseId]) {
      delete this.state.enrollments[courseId];
      this.saveState();
    }
  }

  getEnrolledCourseIds() {
    return Object.keys(this.state.enrollments || {});
  }

  getEnrolledCourses() {
    const ids = this.getEnrolledCourseIds();
    return ATLAS_DATA.courses.filter((c) => ids.includes(c.id));
  }

  setLastAccessedLesson(courseId, lessonId) {
    if (this.state.enrollments && this.state.enrollments[courseId]) {
      this.state.enrollments[courseId].lastAccessedLessonId = lessonId;
      this.saveState();
    }
  }

  /* ================= Progress Tracking ================= */
  isLessonCompleted(lessonId) {
    return Boolean(this.state.completedLessons && this.state.completedLessons[lessonId]);
  }

  toggleLessonCompletion(courseId, lessonId) {
    if (!this.state.completedLessons) this.state.completedLessons = {};
    const isCompleted = !this.state.completedLessons[lessonId];
    
    if (isCompleted) {
      this.state.completedLessons[lessonId] = true;
      const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
      const lesson = this.findLesson(courseId, lessonId);
      
      this.logActivity({
        type: "lesson_completed",
        title: `Completed: ${lesson?.title || "Lesson"}`,
        courseName: course?.title || "Course",
        detail: "Marked as completed"
      });
    } else {
      delete this.state.completedLessons[lessonId];
    }

    // Check if course is 100% complete
    this.checkCourseCompletion(courseId);
    this.saveState();
    return isCompleted;
  }

  markLessonComplete(courseId, lessonId) {
    if (!this.state.completedLessons) this.state.completedLessons = {};
    if (!this.state.completedLessons[lessonId]) {
      this.state.completedLessons[lessonId] = true;
      const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
      const lesson = this.findLesson(courseId, lessonId);

      this.logActivity({
        type: "lesson_completed",
        title: `Completed: ${lesson?.title || "Lesson"}`,
        courseName: course?.title || "Course",
        detail: "Marked as completed"
      });

      this.checkCourseCompletion(courseId);
      this.saveState();
    }
  }

  checkCourseCompletion(courseId) {
    const progress = this.getCourseProgress(courseId);
    if (progress.percentage === 100) {
      if (this.state.enrollments && this.state.enrollments[courseId]) {
        if (this.state.enrollments[courseId].status !== "completed") {
          this.state.enrollments[courseId].status = "completed";
          this.state.enrollments[courseId].completedAt = new Date().toISOString();
          
          const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
          this.logActivity({
            type: "course_completed",
            title: `Graduated: ${course?.title}`,
            courseName: course?.title,
            detail: "Earned Official Certificate of Completion"
          });
        }
      }
    }
  }

  getCourseProgress(courseId) {
    const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
    if (!course) return { totalLessons: 0, completedLessons: 0, percentage: 0, isCompleted: false, remainingLessons: 0 };

    let totalLessons = 0;
    let completedLessons = 0;

    course.curriculum.forEach((mod) => {
      mod.lessons.forEach((les) => {
        totalLessons++;
        if (this.isLessonCompleted(les.id)) {
          completedLessons++;
        }
      });
    });

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return {
      totalLessons,
      completedLessons,
      remainingLessons: Math.max(0, totalLessons - completedLessons),
      percentage,
      isCompleted: percentage === 100
    };
  }

  /* ================= Notes ================= */
  getNotes(courseId = null, lessonId = null) {
    let notes = this.state.notes || [];
    if (courseId) {
      notes = notes.filter((n) => n.courseId === courseId);
    }
    if (lessonId) {
      notes = notes.filter((n) => n.lessonId === lessonId);
    }
    return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addNote({ courseId, lessonId, lessonTitle, timestamp, timestampSec, content }) {
    if (!this.state.notes) this.state.notes = [];
    const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
    
    const newNote = {
      id: "note-" + Date.now(),
      courseId,
      courseTitle: course?.title || "Atlas Course",
      lessonId,
      lessonTitle: lessonTitle || "Lesson",
      timestamp: timestamp || "00:00",
      timestampSec: timestampSec || 0,
      content,
      createdAt: new Date().toISOString()
    };

    this.state.notes.unshift(newNote);
    this.saveState();
    return newNote;
  }

  updateNote(noteId, content) {
    if (!this.state.notes) return;
    const idx = this.state.notes.findIndex((n) => n.id === noteId);
    if (idx !== -1) {
      this.state.notes[idx].content = content;
      this.state.notes[idx].updatedAt = new Date().toISOString();
      this.saveState();
    }
  }

  deleteNote(noteId) {
    if (!this.state.notes) return;
    this.state.notes = this.state.notes.filter((n) => n.id !== noteId);
    this.saveState();
  }

  /* ================= Bookmarks ================= */
  isCourseBookmarked(courseId) {
    return Boolean(this.state.bookmarks?.courses?.includes(courseId));
  }

  toggleCourseBookmark(courseId) {
    if (!this.state.bookmarks) this.state.bookmarks = { courses: [], lessons: [] };
    if (!this.state.bookmarks.courses) this.state.bookmarks.courses = [];
    
    const idx = this.state.bookmarks.courses.indexOf(courseId);
    let bookmarked = false;
    if (idx === -1) {
      this.state.bookmarks.courses.push(courseId);
      bookmarked = true;
    } else {
      this.state.bookmarks.courses.splice(idx, 1);
      bookmarked = false;
    }
    this.saveState();
    return bookmarked;
  }

  isLessonBookmarked(lessonId) {
    return Boolean(this.state.bookmarks?.lessons?.some((l) => l.lessonId === lessonId));
  }

  toggleLessonBookmark(courseId, lessonId, lessonTitle) {
    if (!this.state.bookmarks) this.state.bookmarks = { courses: [], lessons: [] };
    if (!this.state.bookmarks.lessons) this.state.bookmarks.lessons = [];

    const idx = this.state.bookmarks.lessons.findIndex((l) => l.lessonId === lessonId);
    let bookmarked = false;
    if (idx === -1) {
      this.state.bookmarks.lessons.push({ courseId, lessonId, lessonTitle });
      bookmarked = true;
    } else {
      this.state.bookmarks.lessons.splice(idx, 1);
      bookmarked = false;
    }
    this.saveState();
    return bookmarked;
  }

  getBookmarkedCourses() {
    const ids = this.state.bookmarks?.courses || [];
    return ATLAS_DATA.courses.filter((c) => ids.includes(c.id));
  }

  /* ================= Quizzes ================= */
  saveQuizResult({ quizId, courseId, score, totalQuestions, correctCount, passed, answers }) {
    if (!this.state.quizResults) this.state.quizResults = {};
    
    const existing = this.state.quizResults[quizId] || { attempts: 0 };
    this.state.quizResults[quizId] = {
      quizId,
      courseId,
      score,
      totalQuestions,
      correctCount,
      passed,
      attempts: (existing.attempts || 0) + 1,
      answers,
      completedAt: new Date().toISOString()
    };

    const quiz = ATLAS_DATA.quizzes[quizId];
    const course = ATLAS_DATA.courses.find((c) => c.id === courseId);

    this.logActivity({
      type: passed ? "quiz_passed" : "quiz_attempt",
      title: `${passed ? "Passed" : "Attempted"}: ${quiz?.title || "Quiz"}`,
      courseName: course?.title || "Course",
      detail: `Score: ${score}% • ${correctCount}/${totalQuestions} correct`
    });

    if (passed) {
      // Find matching lesson ID for this quiz and mark it completed
      const matchingLesson = this.findQuizLesson(courseId, quizId);
      if (matchingLesson) {
        this.markLessonComplete(courseId, matchingLesson.id);
      }
    }

    this.saveState();
    return this.state.quizResults[quizId];
  }

  getQuizResult(quizId) {
    return this.state.quizResults?.[quizId] || null;
  }

  /* ================= Certificates ================= */
  getCertificates() {
    const enrolledIds = this.getEnrolledCourseIds();
    const certs = [];

    enrolledIds.forEach((courseId) => {
      const progress = this.getCourseProgress(courseId);
      if (progress.percentage === 100) {
        const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
        const instructor = ATLAS_DATA.instructors.find((i) => i.id === course?.instructorId);
        const enrollment = this.state.enrollments[courseId];
        
        certs.push({
          id: `ATL-CERT-${courseId.replace("course-", "").toUpperCase()}-9841`,
          courseId,
          courseTitle: course?.title,
          categoryName: course?.categoryName,
          recipientName: this.state.user.name,
          instructorName: instructor?.name,
          instructorTitle: instructor?.title,
          instructorRole: instructor?.role,
          issueDate: enrollment?.completedAt ? new Date(enrollment.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          totalHours: course?.duration,
          credentialUrl: `${window.location.origin}/certificate.html?course=${courseId}`
        });
      }
    });

    return certs;
  }

  /* ================= Activity Logging ================= */
  logActivity({ type, title, courseName, detail }) {
    if (!this.state.activityLog) this.state.activityLog = [];
    this.state.activityLog.unshift({
      id: "act-" + Date.now(),
      type,
      title,
      courseName,
      detail,
      timestamp: new Date().toISOString()
    });
    // Keep max 30 recent activities
    if (this.state.activityLog.length > 30) {
      this.state.activityLog.pop();
    }
  }

  getActivityLog() {
    return this.state.activityLog || [];
  }

  /* ================= Overall Dashboard Analytics ================= */
  getOverallStats() {
    const enrolledCourses = this.getEnrolledCourses();
    const completedCourses = enrolledCourses.filter((c) => this.getCourseProgress(c.id).percentage === 100);
    const inProgressCourses = enrolledCourses.filter((c) => this.getCourseProgress(c.id).percentage < 100);
    
    let totalCompletedLessons = Object.keys(this.state.completedLessons || {}).length;
    let certificates = this.getCertificates();
    let totalHours = (this.state.user.timeSpentSeconds / 3600).toFixed(1);

    return {
      enrolledCount: enrolledCourses.length,
      inProgressCount: inProgressCourses.length,
      completedCount: completedCourses.length,
      totalCompletedLessons,
      certificatesCount: certificates.length,
      streakDays: this.state.user.streakDays || 14,
      totalHoursLearned: totalHours,
      weeklyGoalHours: this.state.user.weeklyGoalHours || 10,
      notesCount: (this.state.notes || []).length,
      bookmarksCount: (this.state.bookmarks?.courses?.length || 0) + (this.state.bookmarks?.lessons?.length || 0)
    };
  }

  /* ================= Helpers ================= */
  findLesson(courseId, lessonId) {
    const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
    if (!course) return null;
    for (const mod of course.curriculum) {
      for (const les of mod.lessons) {
        if (les.id === lessonId) return les;
      }
    }
    return null;
  }

  findQuizLesson(courseId, quizId) {
    const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
    if (!course) return null;
    for (const mod of course.curriculum) {
      for (const les of mod.lessons) {
        if (les.quizId === quizId) return les;
      }
    }
    return null;
  }

  getInstructorName(instructorId) {
    const inst = ATLAS_DATA.instructors.find((i) => i.id === instructorId);
    return inst ? inst.name : "Faculty Lead";
  }

  /* ================= Data Export & Import ================= */
  exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atlas_academy_profile_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === "object") {
        this.state = { ...DEFAULT_INITIAL_STATE, ...parsed };
        this.saveState();
        return { success: true };
      }
      return { success: false, error: "Invalid JSON structure" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDemoState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    this.saveState();
  }

  // Convenience method to unlock a full certificate for testing/demo
  completeEntireCourse(courseId) {
    const course = ATLAS_DATA.courses.find((c) => c.id === courseId);
    if (!course) return;
    this.enrollCourse(courseId);
    course.curriculum.forEach((mod) => {
      mod.lessons.forEach((les) => {
        this.state.completedLessons[les.id] = true;
      });
    });
    this.checkCourseCompletion(courseId);
    this.saveState();
  }
}

// Global Singleton Instance
if (typeof window !== "undefined") {
  window.atlasState = new AtlasState();
}
