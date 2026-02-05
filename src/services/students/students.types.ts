export type Track = {
  Track_ID: number;
  Track_Name: string;
};

export type Student = {
  Stud_ID: number;
  Stud_First_Name: string;
  Stud_Last_Name: string;
  Email: string;
  Phone: string;
  Track_ID: number;
  Enrollment_Date: string;
};

export type StudentCourse = {
  Stud_ID: number;
  Course_ID: number;
  Used_Attempt: number;
  Highest_Grade: number;
  Status: "Success" | "Fail";
};

export type StudentSummary = {
  Stud_ID: number;
  Name: string;
  Email: string;
  Phone: string;
  Track_Name: string;
  Course_ID: number;
  Course_Name: string;
  Used_Attempt: number;
  Highest_Grade: number;
  Status: "Success" | "Fail";
  Enrollment_Date: string;
};
