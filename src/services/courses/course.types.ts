export type Course = {
  Course_ID: number;
  Course_Name: string;
  Max_Attempt: number;
  Inst_ID: number;
  Track_Name: string;
  Students_Count: number;
  Exams_Count: number;
  Last_Updated: string;
  Passing_Grade: number;
  Topics: { Topic_ID: number; Topic_Name: string }[];
};
