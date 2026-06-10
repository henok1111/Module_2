import { Temporal } from "@js-temporal/polyfill";
import { Student, isStudent, parseStudent } from "./models/student.model.js";

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