# Mock → Backend API Mapping

When the backend APIs are ready, set `USE_MOCK = false` in `src/config/app.config.ts` and wire the services below to the real endpoints.

---

## Auth

| Mock                                   | Real API               | Notes                                                                                   |
| -------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `mockLogin` (auth/mocks/login.mock.ts) | `POST /api/auth/login` | Body: `{ username, password }`. Response: `{ success, message, data: { user, token } }` |

---

## Examinations

| Mock                                      | Real API                                        | Notes                                                                        |
| ----------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `getExamsMock` (examination/exam.mock.ts) | `GET /exams?status=upcoming\|active\|completed` | Response: `{ success, data: ExamDTO[] }`. Map DTO to `Exam` in exam.service. |
| `getExamsMockPaginated` (exam.mock.ts)    | `GET /exams?status=&page=&pageSize=`            | Response: `{ success, data: ExamDTO[], total }`. Used by global pagination.  |

---

## Questions

Question DTOs align with DB schema: **Question** (Ques_ID, Exam_ID, Ques_Text, Ques_Type, Ques_Mark), **Question_MCQ** (Allow_Multi), **Question_TF** (Correct_Choice BIT), **MCQ_Choice** (Choice_No, Choice_Text, IsCorrect BIT).

| Mock                                            | Real API                                                | Notes                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `getQuestionsMock` (questions/question.mock.ts) | `GET /exams/:examId/questions?page=&pageSize=`          | Response: `{ success, total, questions: QuestionDTO[] }`. Map DTOs in question.service. |
| `addQuestionMock` / `updateQuestionMock`        | `POST /exams/:examId/questions`, `PATCH /questions/:id` | Payload includes `mcq.allowMulti` for multiple correct choices.                         |

---

## Future endpoints (add when backend is ready)

- **Courses**: e.g. `GET /courses` for instructor dashboard
- **Students**: e.g. `GET /students` or `GET /courses/:id/students`
- **Submissions**: e.g. `GET /exams/:id/submissions`
- **Create/Update Exam**: `POST /exams`, `PATCH /exams/:id`
- **Create/Update Question**: `POST /exams/:id/questions`, `PATCH /questions/:id`
