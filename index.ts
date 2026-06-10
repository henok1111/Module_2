import { Temporal } from "@js-temporal/polyfill";
import { Student, isStudent, parseStudent } from "./models/student.model.js";
import { AssessmentItem, calculateGrade } from "./models/assessment.model.js";
import { EnrollmentStatus, describeEnrollment } from "./models/enrollment.model.js";
import { CourseStatus, describeCourse, Course } from "./models/course.model.js";
import { ApiResponse, renderResponse } from "./models/api-response.model.js";

// ── Exercise 2: Test the constraints ─────────────────────────

const student: Student = {
  id: "STU-001",
  name: "Hana Tadesse",
  enrollmentDate: Temporal.Now.instant(),
};

// Uncomment to see compiler error — readonly violation:
// student.id = "STU-999";

// Uncomment to see compiler error — gpa might be undefined:
// console.log(student.gpa.toFixed(2));

// Safe access — prints "Not yet graded" because gpa is undefined
console.log(student.gpa?.toFixed(2) ?? "Not yet graded");

// ── Exercise 3: Type Guard ────────────────────────────────────

function processStudent(raw: unknown) {
  if (isStudent(raw)) {
    const gpaDisplay = raw.gpa?.toFixed(2) ?? "Not yet graded";
    console.log(`Student ${raw.name} GPA: ${gpaDisplay}`);
  } else {
    console.error("Invalid student data received");
  }
}

processStudent({ id: "STU-001", name: "Hana", gpa: 3.7 });
// Prints: Student Hana GPA: 3.70

processStudent(42);
// Prints: Invalid student data received

// ── Exercise 3B: parseStudent ─────────────────────────────────

console.log(parseStudent({ id: "STU-001", name: "Hana" }));
// Prints a valid Student object

try {
  parseStudent({ id: 42, name: "Test" });
} catch (e) {
  console.error((e as Error).message);
  // Prints: Expected id to be a string, received number
}

const quiz: AssessmentItem = {
  id: "QUIZ-001",
  kind: "quiz",
  title: "SQL Basics",
  correctAnswers: 8,
  totalQuestions: 10,
};

const lab: AssessmentItem = {
  id: "LAB-001",
  kind: "lab",
  title: "REST API Project",
  functionalityScore: 85,
  codeQualityScore: 90,
};

console.log(`Quiz grade: ${calculateGrade(quiz)}%`);
console.log(`Lab grade: ${calculateGrade(lab)}%`);

// ── Session 2: Exercise 5 — Enrollment Lifecycle ─────────────

const pending: EnrollmentStatus = {
  status: "PENDING",
  requestedAt: Temporal.Now.instant(),
  studentId: "STU-001",
  courseId: "CRS-101",
};

console.log(describeEnrollment(pending));

// ── Session 2: Exercise 5B — Course Lifecycle ─────────────────

const webDev: CourseStatus = {
  status: "ACTIVE",
  enrolledCount: 28,
  startDate: Temporal.PlainDate.from("2026-09-01"),
};

console.log(describeCourse(webDev));

// ── Session 2: Exercise 6 — Generic ApiResponse ───────────────

const studentRes: ApiResponse<Student> = {
  status: "success",
  data: {
    id: "STU-001",
    name: "Dawit Bekele",
    enrollmentDate: Temporal.Now.instant(),
    gpa: 3.4,
  },
  fetchedAt: Temporal.Now.instant(),
};

console.log(
  renderResponse(studentRes, (s) => `${s.name} GPA: ${s.gpa ?? "N/A"}`)
);

const courseListRes: ApiResponse<Course[]> = {
  status: "success",
  data: [
    {
      id: "CRS-101",
      title: "Web Development Fundamentals",
      capacity: 30,
      startDate: Temporal.PlainDate.from("2026-09-01"),
    },
  ],
  fetchedAt: Temporal.Now.instant(),
};

console.log(
  renderResponse(courseListRes, (courses) =>
    courses.map((c) => c.title).join(", ")
  )
);

// ── Session 2: Exercise 7 — Temporal Timestamps ───────────────

const approvedAt = Temporal.Now.instant();
console.log(`Approved at (UTC): ${approvedAt}`);

const addisTime = approvedAt.toZonedDateTimeISO("Africa/Addis_Ababa");
const londonTime = approvedAt.toZonedDateTimeISO("Europe/London");
console.log(`Addis: ${addisTime.toPlainTime()}`);
console.log(`London: ${londonTime.toPlainTime()}`);

const courseStart = Temporal.PlainDate.from("2026-09-01");
const today = Temporal.Now.plainDateISO();
const daysUntilStart = today.until(courseStart).total({ unit: "days" });
console.log(`${Math.floor(daysUntilStart)} days until course starts`);

const deadline = Temporal.PlainDate.from("2026-12-15");
const remaining = today.until(deadline);
console.log(`${remaining.total({ unit: "days" })} days until assignment is due`);