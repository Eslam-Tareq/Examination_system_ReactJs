import { QuestionDTO } from "./question.types";

/**
 * Mock for exam questions. Replace with real API when backend is ready.
 * Real API: GET /exams/:examId/questions?page=&pageSize=
 * Response shape: { success, total, questions: QuestionDTO[] }
 * See: src/services/mock/BACKEND_API_MAPPING.md
 *
 * When backend is ready: set USE_MOCK = false in app.config; the question.service
 * will call getQuestionsApi(examId, page, pageSize) and map the same DTOs.
 */

const MCQ_TEMPLATES: {
  text: string;
  choices: { text: string; isCorrect: boolean }[];
}[] = [
  {
    text: "What is a stack?",
    choices: [
      { text: "LIFO structure", isCorrect: true },
      { text: "FIFO structure", isCorrect: false },
      { text: "Tree structure", isCorrect: false },
    ],
  },
  {
    text: "Which is a linear data structure?",
    choices: [
      { text: "Array", isCorrect: true },
      { text: "Tree", isCorrect: false },
      { text: "Graph", isCorrect: false },
    ],
  },
  {
    text: "What does CPU stand for?",
    choices: [
      { text: "Central Processing Unit", isCorrect: true },
      { text: "Computer Personal Unit", isCorrect: false },
      { text: "Central Program Utility", isCorrect: false },
    ],
  },
  {
    text: "In OS, what is a process?",
    choices: [
      { text: "Program in execution", isCorrect: true },
      { text: "A file", isCorrect: false },
      { text: "A device", isCorrect: false },
    ],
  },
  {
    text: "Which is a sorting algorithm?",
    choices: [
      { text: "QuickSort", isCorrect: true },
      { text: "BFS", isCorrect: false },
      { text: "Dijkstra", isCorrect: false },
    ],
  },
  {
    text: "What is a primary key?",
    choices: [
      { text: "Unique identifier in a table", isCorrect: true },
      { text: "A foreign key", isCorrect: false },
      { text: "An index", isCorrect: false },
    ],
  },
  {
    text: "HTTP stands for?",
    choices: [
      { text: "HyperText Transfer Protocol", isCorrect: true },
      { text: "High Transfer Text Protocol", isCorrect: false },
      { text: "Hyper Transfer Text Protocol", isCorrect: false },
    ],
  },
  {
    text: "What is encapsulation?",
    choices: [
      { text: "Bundling data and methods", isCorrect: true },
      { text: "Inheritance", isCorrect: false },
      { text: "Polymorphism", isCorrect: false },
    ],
  },
  {
    text: "Which is a database type?",
    choices: [
      { text: "Relational", isCorrect: true },
      { text: "Linear", isCorrect: false },
      { text: "Circular", isCorrect: false },
    ],
  },
  {
    text: "What is an algorithm?",
    choices: [
      { text: "Step-by-step procedure", isCorrect: true },
      { text: "A data structure", isCorrect: false },
      { text: "A variable", isCorrect: false },
    ],
  },
  {
    text: "RAM stands for?",
    choices: [
      { text: "Random Access Memory", isCorrect: true },
      { text: "Read Access Memory", isCorrect: false },
      { text: "Run All Memory", isCorrect: false },
    ],
  },
  {
    text: "What is a linked list?",
    choices: [
      { text: "Nodes connected by pointers", isCorrect: true },
      { text: "Array of elements", isCorrect: false },
      { text: "A stack", isCorrect: false },
    ],
  },
  {
    text: "Which is an OS scheduling algorithm?",
    choices: [
      { text: "Round Robin", isCorrect: true },
      { text: "Bubble Sort", isCorrect: false },
      { text: "Binary Search", isCorrect: false },
    ],
  },
  {
    text: "What is SQL?",
    choices: [
      { text: "Structured Query Language", isCorrect: true },
      { text: "Simple Query Logic", isCorrect: false },
      { text: "Stored Query List", isCorrect: false },
    ],
  },
  {
    text: "What is a variable?",
    choices: [
      { text: "Named storage for data", isCorrect: true },
      { text: "A function", isCorrect: false },
      { text: "A constant", isCorrect: false },
    ],
  },
  {
    text: "Which is a network protocol?",
    choices: [
      { text: "TCP", isCorrect: true },
      { text: "HTML", isCorrect: false },
      { text: "CSS", isCorrect: false },
    ],
  },
  {
    text: "What is recursion?",
    choices: [
      { text: "Function calling itself", isCorrect: true },
      { text: "A loop", isCorrect: false },
      { text: "A variable", isCorrect: false },
    ],
  },
  {
    text: "What is a queue?",
    choices: [
      { text: "FIFO structure", isCorrect: true },
      { text: "LIFO structure", isCorrect: false },
      { text: "Random access", isCorrect: false },
    ],
  },
  {
    text: "Which is a programming paradigm?",
    choices: [
      { text: "OOP", isCorrect: true },
      { text: "CPU", isCorrect: false },
      { text: "API", isCorrect: false },
    ],
  },
  {
    text: "What is an API?",
    choices: [
      { text: "Application Programming Interface", isCorrect: true },
      { text: "A database", isCorrect: false },
      { text: "A server", isCorrect: false },
    ],
  },
];

const TF_TEMPLATES: { text: string; correct: boolean }[] = [
  { text: "Queue works as FIFO.", correct: true },
  { text: "Stack is LIFO.", correct: true },
  { text: "Binary search requires sorted data.", correct: true },
  { text: "A process can have multiple threads.", correct: true },
  { text: "Primary key can be null.", correct: false },
  { text: "HTTP is stateless.", correct: true },
  { text: "Arrays have fixed size in Java.", correct: true },
  { text: "SQL is a programming language.", correct: false },
  { text: "Recursion always uses less memory than iteration.", correct: false },
  { text: "TCP guarantees delivery.", correct: true },
  { text: "Encapsulation hides implementation details.", correct: true },
  { text: "A graph can have cycles.", correct: true },
  { text: "RAM is volatile.", correct: true },
  { text: "Python is compiled only.", correct: false },
  { text: "DNS translates domain names to IP.", correct: true },
];

function buildMcq(
  quesId: number,
  examId: number,
  template: (typeof MCQ_TEMPLATES)[0],
  index: number
): QuestionDTO {
  return {
    quesId,
    examId,
    text: template.text + (index > 0 ? ` (${index + 1})` : ""),
    type: "MCQ",
    mark: 2,
    mcq: {
      allowMulti: index % 4 === 0,
      choices: template.choices.map((c, i) => ({
        choiceNo: i + 1,
        text: c.text,
        isCorrect: c.isCorrect,
      })),
    },
  };
}

function buildTf(
  quesId: number,
  examId: number,
  template: (typeof TF_TEMPLATES)[0],
  index: number
): QuestionDTO {
  return {
    quesId,
    examId,
    text: template.text + (index > 0 ? ` (${index + 1})` : ""),
    type: "TF",
    mark: 1,
    tf: { correctChoice: template.correct },
  };
}

/** Build questions for one exam: mix of MCQ and TF; count varies by exam (20 for 1–3, 10 for 4–10, 5 for 11–30). */
function questionsForExam(
  examId: number,
  count: number,
  startQuesId: number
): QuestionDTO[] {
  const out: QuestionDTO[] = [];
  let qid = startQuesId;
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      out.push(
        buildMcq(qid++, examId, MCQ_TEMPLATES[i % MCQ_TEMPLATES.length], i)
      );
    } else {
      out.push(
        buildTf(qid++, examId, TF_TEMPLATES[i % TF_TEMPLATES.length], i)
      );
    }
  }
  return out;
}

/** Exam 1–3: 20 questions each; 4–10: 10 each; 11–30: 5 each. */
function buildAllMockQuestions(): QuestionDTO[] {
  const all: QuestionDTO[] = [];
  let quesId = 1;
  for (let examId = 1; examId <= 30; examId++) {
    const count = examId <= 3 ? 20 : examId <= 10 ? 10 : 5;
    all.push(...questionsForExam(examId, count, quesId));
    quesId += count;
  }
  return all;
}

const MOCK_QUESTIONS = buildAllMockQuestions();

/** Session overlay for edit page: add/update/delete during session */
const sessionAdded: QuestionDTO[] = [];
const sessionDeletedIds = new Set<number>();
const sessionUpdated = new Map<number, QuestionDTO>();
let nextTempId = 100000;

function getMergedQuestionsForExam(examId: number): QuestionDTO[] {
  const base = MOCK_QUESTIONS.filter(
    (q) => q.examId === examId && !sessionDeletedIds.has(q.quesId)
  );
  const updated = base.map((q) => sessionUpdated.get(q.quesId) ?? q);
  const added = sessionAdded.filter((q) => q.examId === examId);
  return [...updated, ...added];
}

export const getQuestionsMock = async (
  examId: number,
  page: number,
  pageSize: number
) => {
  await new Promise((r) => setTimeout(r, 300));

  const filtered = getMergedQuestionsForExam(examId);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const questions = filtered.slice(start, start + pageSize);

  return { total, questions };
};

/** Get all questions for an exam (e.g. edit page). Same merge logic. */
export const getAllQuestionsMock = async (
  examId: number
): Promise<QuestionDTO[]> => {
  await new Promise((r) => setTimeout(r, 200));
  return getMergedQuestionsForExam(examId);
};

export type AddQuestionPayload = {
  text: string;
  type: "MCQ" | "TF";
  mark: number;
  mcq?: {
    allowMulti: boolean;
    choices: { text: string; isCorrect: boolean }[];
  };
  tf?: { correctChoice: boolean };
};

/** Add question. Real API: POST /exams/:examId/questions */
export const addQuestionMock = async (
  examId: number,
  payload: AddQuestionPayload
): Promise<QuestionDTO> => {
  await new Promise((r) => setTimeout(r, 300));
  const quesId = nextTempId++;
  const dto: QuestionDTO = {
    quesId,
    examId,
    text: payload.text,
    type: payload.type,
    mark: payload.mark,
    ...(payload.type === "MCQ" &&
      payload.mcq && {
        mcq: {
          allowMulti: payload.mcq.allowMulti,
          choices: payload.mcq.choices.map((c, i) => ({
            choiceNo: i + 1,
            text: c.text,
            isCorrect: c.isCorrect,
          })),
        },
      }),
    ...(payload.type === "TF" &&
      payload.tf && { tf: { correctChoice: payload.tf.correctChoice } }),
  };
  sessionAdded.push(dto);
  return dto;
};

/** Update question. Real API: PATCH /questions/:id */
export const updateQuestionMock = async (
  quesId: number,
  payload: Partial<AddQuestionPayload>
): Promise<QuestionDTO | null> => {
  await new Promise((r) => setTimeout(r, 300));
  const inAdded = sessionAdded.find((q) => q.quesId === quesId);
  if (inAdded) {
    if (payload.text != null) inAdded.text = payload.text;
    if (payload.type != null) inAdded.type = payload.type;
    if (payload.mark != null) inAdded.mark = payload.mark;
    if (payload.mcq != null)
      inAdded.mcq = {
        allowMulti: payload.mcq.allowMulti ?? false,
        choices: payload.mcq.choices.map((c, i) => ({
          choiceNo: i + 1,
          text: c.text,
          isCorrect: c.isCorrect,
        })),
      };
    if (payload.tf != null)
      inAdded.tf = { correctChoice: payload.tf.correctChoice };
    return inAdded;
  }
  const fromBase = MOCK_QUESTIONS.find((q) => q.quesId === quesId);
  if (fromBase) {
    const updated: QuestionDTO = {
      ...fromBase,
      ...(payload.text != null && { text: payload.text }),
      ...(payload.type != null && { type: payload.type }),
      ...(payload.mark != null && { mark: payload.mark }),
      ...(payload.mcq != null && {
        mcq: {
          allowMulti: payload.mcq.allowMulti ?? false,
          choices: payload.mcq.choices.map((c, i) => ({
            choiceNo: i + 1,
            text: c.text,
            isCorrect: c.isCorrect,
          })),
        },
      }),
      ...(payload.tf != null && {
        tf: { correctChoice: payload.tf.correctChoice },
      }),
    };
    sessionUpdated.set(quesId, updated);
    return updated;
  }
  return null;
};

/** Delete question. Real API: DELETE /questions/:id */
export const deleteQuestionMock = async (
  quesId: number
): Promise<{ success: boolean }> => {
  await new Promise((r) => setTimeout(r, 200));
  const inAdded = sessionAdded.findIndex((q) => q.quesId === quesId);
  if (inAdded >= 0) {
    sessionAdded.splice(inAdded, 1);
    return { success: true };
  }
  sessionDeletedIds.add(quesId);
  return { success: true };
};
