import { mockCourses } from "@/services/courses/course.mock";
import type {
  Student,
  StudentCourse,
  StudentSummary,
  Track,
} from "./students.types";

const tracks: Track[] = [
  { Track_ID: 1, Track_Name: "Computer Science" },
  { Track_ID: 2, Track_Name: "Software Engineering" },
  { Track_ID: 3, Track_Name: "AI & Data Science" },
  { Track_ID: 4, Track_Name: "Cybersecurity" },
  { Track_ID: 5, Track_Name: "Mobile Development" },
  { Track_ID: 6, Track_Name: "DevOps" },
];

const firstNames = [
  "Ahmed",
  "Mohamed",
  "Ali",
  "Omar",
  "Youssef",
  "Hassan",
  "Mostafa",
  "Mahmoud",
  "Karim",
  "Tarek",
  "Amr",
  "Khaled",
  "Hatem",
  "Eslam",
  "Nour",
  "Yasin",
  "Ibrahim",
  "Walid",
  "Hany",
  "Alaa",
  "Sara",
  "Mona",
  "Aya",
  "Nadia",
  "Dina",
  "Nourhan",
  "Hager",
  "Farah",
  "Salma",
  "Laila",
];

const lastNames = [
  "Hassan",
  "Fahmy",
  "Salem",
  "Nassar",
  "Ibrahim",
  "Mahmoud",
  "Gamal",
  "Tawfik",
  "Mostafa",
  "Saad",
  "Abdelrahman",
  "El-Sayed",
  "Amin",
  "Khalil",
  "Farouk",
  "El Sherif",
  "Ashraf",
  "Hamdy",
  "Kandil",
  "Zahran",
];

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const phoneFor = (id: number) => {
  const base = 1000000 + ((id * 53) % 9000000);
  const prefix = ["010", "011", "012", "015"][id % 4];
  return `${prefix}${base}`;
};

const emailFor = (first: string, last: string, id: number) => {
  const handle = `${first}.${last}`.toLowerCase().replace(/\s+/g, "");
  return `${handle}${id}@student.examly.edu.eg`;
};

const enrollmentDateFor = (id: number) => {
  const day = (id % 28) + 1;
  const month = ((id % 12) + 1).toString().padStart(2, "0");
  const year = 2025 + Math.floor(id / 80);
  return `${year}-${month}-${day.toString().padStart(2, "0")}`;
};

const students: Student[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const first = randomChoice(firstNames);
  const last = randomChoice(lastNames);
  const track = tracks[id % tracks.length];
  return {
    Stud_ID: id,
    Stud_First_Name: first,
    Stud_Last_Name: last,
    Email: emailFor(first, last, id),
    Phone: phoneFor(id),
    Track_ID: track.Track_ID,
    Enrollment_Date: enrollmentDateFor(id),
  };
});

const courseIds = mockCourses.map((c) => c.Course_ID);

const enrollments: StudentCourse[] = students.map((s, idx) => {
  const courseId = courseIds[idx % courseIds.length];
  const used = randomInt(1, 3);
  const grade = randomInt(60, 100);
  const status: StudentCourse["Status"] = grade >= 60 ? "Success" : "Fail";
  return {
    Stud_ID: s.Stud_ID,
    Course_ID: courseId,
    Used_Attempt: used,
    Highest_Grade: grade,
    Status: status,
  };
});

export const mockTracks = tracks;
export const mockStudents = students;
export const mockEnrollments = enrollments;

export const buildStudentSummaries = (
  instructorId: number,
): StudentSummary[] => {
  const instructorCourses = mockCourses
    .filter((c) => c.Inst_ID === instructorId)
    .map((c) => c.Course_ID);

  const summaries: StudentSummary[] = enrollments
    .filter((e) => instructorCourses.includes(e.Course_ID))
    .map((e) => {
      const student = students.find((s) => s.Stud_ID === e.Stud_ID)!;
      const course = mockCourses.find((c) => c.Course_ID === e.Course_ID)!;
      const track = tracks.find((t) => t.Track_ID === student.Track_ID)!;
      return {
        Stud_ID: student.Stud_ID,
        Name: `${student.Stud_First_Name} ${student.Stud_Last_Name}`,
        Email: student.Email,
        Phone: student.Phone,
        Track_Name: track.Track_Name,
        Course_ID: course.Course_ID,
        Course_Name: course.Course_Name,
        Used_Attempt: e.Used_Attempt,
        Highest_Grade: e.Highest_Grade,
        Status: e.Status,
        Enrollment_Date: student.Enrollment_Date,
      };
    });

  return summaries;
};
