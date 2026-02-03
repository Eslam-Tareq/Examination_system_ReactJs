import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "@/services/examination/exam.service";
import { useAuthStore } from "@/store";
import { addQuestion } from "@/services/questions/question.service";
import { useToastStore } from "@/store/toast.store";
import { getInstructorCourses } from "@/services/courses/course.service";
import type { Course } from "@/services/courses/course.types";
import type { AddQuestionPayload } from "@/services/questions/question.service";
import { ExamStatus } from "@/services/examination/exam.types";

type ExamForm = {
  title: string;
  date: string;
  duration: number;
  status: ExamStatus;
  courseName: string;
};

type ExamErrors = Record<string, string>;
type QuestionErrors = Record<string, string>;

const initialQuestionForm: Partial<AddQuestionPayload> = {
  type: "MCQ",
  mark: 1,
  text: "",
  mcq: { allowMulti: false, choices: [{ text: "", isCorrect: false }] },
  tf: { correctChoice: false },
};

const CreateExamPage = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<ExamForm>({
    title: "",
    date: "",
    duration: 60,
    status: "upcoming",
    courseName: "",
  });
  const [questions, setQuestions] = useState<AddQuestionPayload[]>([]);
  const [questionForm, setQuestionForm] =
    useState<Partial<AddQuestionPayload>>(initialQuestionForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [examErrors, setExamErrors] = useState<ExamErrors>({});
  const [questionErrors, setQuestionErrors] = useState<QuestionErrors>({});
  const [creating, setCreating] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const addFormRef = useRef<HTMLDivElement>(null);

  const instructorId = user?.id ?? 2;

  useEffect(() => {
    getInstructorCourses(instructorId).then(setCourses);
  }, [instructorId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showAddForm &&
        addFormRef.current &&
        !addFormRef.current.contains(e.target as Node)
      ) {
        setShowAddForm(false);
        setQuestionErrors({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddForm]);

  const validateExamForm = (): boolean => {
    const err: ExamErrors = {};
    if (!form.title?.trim()) err.title = "Title is required";
    if (!form.date?.trim()) err.date = "Date is required";
    const duration = form.duration ?? 0;
    if (duration <= 0 || Number.isNaN(duration))
      err.duration = "Duration must be greater than 0";
    if (!form.courseName?.trim()) err.courseName = "Course name is required";
    setExamErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateQuestionForm = (): boolean => {
    const err: QuestionErrors = {};
    const text = questionForm.text?.trim() ?? "";
    if (!text) err.text = "Question text is required";
    else if (text.length < 10)
      err.text = "Question must be at least 10 characters";
    const mark = questionForm.mark ?? 0;
    if (mark < 1 || Number.isNaN(mark))
      err.mark = "Points must be greater than 0";
    if (!questionForm.type) err.type = "Please select question type";
    if (questionForm.type === "MCQ" && questionForm.mcq) {
      const choices = questionForm.mcq.choices ?? [];
      if (choices.length < 2) err.choices = "Add at least 2 options";
      else {
        const empty = choices.some((c) => !c.text?.trim());
        if (empty) err.choices = "All options must have text";
        const hasCorrect = choices.some((c) => c.isCorrect);
        if (!hasCorrect) err.choices = "Select at least one correct answer";
      }
    }
    setQuestionErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddQuestionToList = () => {
    setQuestionErrors({});
    if (!validateQuestionForm()) {
      showToast("Please fix the errors below", "error", "Validation");
      return;
    }
    const payload: AddQuestionPayload = {
      text: questionForm.text!,
      type: questionForm.type!,
      mark: questionForm.mark ?? 1,
    };
    if (questionForm.type === "MCQ" && questionForm.mcq) {
      payload.mcq = questionForm.mcq;
    } else if (questionForm.type === "TF" && questionForm.tf) {
      payload.tf = questionForm.tf;
    }
    setQuestions((prev) => [...prev, payload]);
    setQuestionForm(initialQuestionForm);
    setShowAddForm(false);
    setQuestionErrors({});
    showToast("Question added to exam", "success");
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateExam = async () => {
    setExamErrors({});
    if (!validateExamForm()) {
      showToast("Please fix the exam details", "error", "Validation");
      return;
    }
    setCreating(true);
    try {
      const exam = await createExam({
        ...form,
        questionsCount: questions.length,
      });
      if (!exam) throw new Error("Failed to create exam");
      for (const q of questions) {
        await addQuestion(Number(exam.id), q);
      }
      showToast("Exam created successfully", "success", "Created");
      navigate(`/instructor/examinations/${exam.id}/edit`);
    } catch {
      showToast("Failed to create exam", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleAddChoice = () => {
    setQuestionForm((f) => {
      const prevChoices = f.mcq?.choices ?? [];
      return {
        ...f,
        mcq: {
          ...f.mcq!,
          choices: [...prevChoices, { text: "", isCorrect: false }],
        },
      };
    });
  };

  const handleChoiceTextChange = (index: number, text: string) => {
    setQuestionForm((f) => {
      const choices = [...(f.mcq?.choices ?? [])];
      const c = choices[index];
      if (!c) return f;
      choices[index] = { ...c, text };
      return { ...f, mcq: { ...f.mcq!, choices } };
    });
  };

  const handleCorrectChoiceChange = (index: number) => {
    setQuestionForm((f) => {
      const allowMulti = f.mcq?.allowMulti ?? false;
      const choices = (f.mcq?.choices ?? []).map((ch, j) => {
        if (allowMulti) {
          return j === index ? { ...ch, isCorrect: !ch.isCorrect } : ch;
        }
        return { ...ch, isCorrect: j === index };
      });
      return { ...f, mcq: { ...f.mcq!, choices } };
    });
  };

  return (
    <div className="exam-edit-page">
      <header className="exam-edit-header">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/instructor/examinations")}
        >
          Back to Examinations
        </button>
        <h2 className="exam-preview-title">Create Exam</h2>
      </header>

      <section className="exam-edit-form-section exam-details-section">
        <h3 className="exam-edit-section-title">Exam Details</h3>
        <div className="exam-edit-form">
          <label>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                setForm((f) => ({ ...f, title: e.target.value }));
                if (examErrors.title)
                  setExamErrors((e) => ({ ...e, title: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.title ? "has-error" : ""
              }`}
              placeholder="e.g. Midterm Exam"
            />
            {examErrors.title && (
              <span className="field-error">{examErrors.title}</span>
            )}
          </label>
          <label>
            Date
            <input
              type="text"
              value={form.date}
              onChange={(e) => {
                setForm((f) => ({ ...f, date: e.target.value }));
                if (examErrors.date) setExamErrors((e) => ({ ...e, date: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.date ? "has-error" : ""
              }`}
              placeholder="e.g. Feb 15, 2026 10:00 AM"
            />
            {examErrors.date && (
              <span className="field-error">{examErrors.date}</span>
            )}
          </label>
          <label>
            Duration (mins)
            <input
              type="number"
              min={1}
              value={form.duration}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  duration: Number(e.target.value),
                }));
                if (examErrors.duration)
                  setExamErrors((e) => ({ ...e, duration: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.duration ? "has-error" : ""
              }`}
            />
            {examErrors.duration && (
              <span className="field-error">{examErrors.duration}</span>
            )}
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as ExamStatus,
                }))
              }
              className="exam-edit-input"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label>
            Course
            <select
              value={form.courseName}
              onChange={(e) => {
                setForm((f) => ({ ...f, courseName: e.target.value }));
                if (examErrors.courseName)
                  setExamErrors((e) => ({ ...e, courseName: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.courseName ? "has-error" : ""
              }`}
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.Course_ID} value={c.Course_Name}>
                  {c.Course_Name}
                </option>
              ))}
            </select>
            {examErrors.courseName && (
              <span className="field-error">{examErrors.courseName}</span>
            )}
          </label>
        </div>
      </section>

      <section className="exam-edit-questions-section">
        <div className="exam-edit-questions-header">
          <h3 className="exam-edit-section-title">
            Questions ({questions.length})
          </h3>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setQuestionErrors({});
              setShowAddForm(true);
              setQuestionForm(initialQuestionForm);
            }}
          >
            + Add question
          </button>
        </div>

        {showAddForm && (
          <div
            ref={addFormRef}
            className="exam-edit-question-form-section exam-edit-question-form-inline exam-edit-question-form-slide"
          >
            <h3 className="exam-edit-section-title">New question</h3>
            <div className="exam-edit-question-form">
              <label>
                Question text (min 10 characters)
                <input
                  type="text"
                  value={questionForm.text ?? ""}
                  onChange={(e) => {
                    setQuestionForm((f) => ({ ...f, text: e.target.value }));
                    if (questionErrors.text)
                      setQuestionErrors((e) => ({ ...e, text: "" }));
                  }}
                  className={`exam-edit-input ${
                    questionErrors.text ? "has-error" : ""
                  }`}
                  placeholder="Enter question text"
                />
                {questionErrors.text && (
                  <span className="field-error">{questionErrors.text}</span>
                )}
              </label>
              <label>
                Type
                <select
                  value={questionForm.type ?? "MCQ"}
                  onChange={(e) =>
                    setQuestionForm((f) => ({
                      ...f,
                      type: e.target.value as "MCQ" | "TF",
                    }))
                  }
                  className="exam-edit-input"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="TF">True / False</option>
                </select>
              </label>
              <label>
                Mark
                <input
                  type="number"
                  min={1}
                  value={questionForm.mark ?? 1}
                  onChange={(e) => {
                    setQuestionForm((f) => ({
                      ...f,
                      mark: Number(e.target.value),
                    }));
                    if (questionErrors.mark)
                      setQuestionErrors((e) => ({ ...e, mark: "" }));
                  }}
                  className={`exam-edit-input ${
                    questionErrors.mark ? "has-error" : ""
                  }`}
                />
                {questionErrors.mark && (
                  <span className="field-error">{questionErrors.mark}</span>
                )}
              </label>

              {questionForm.type === "TF" && (
                <label>
                  Correct answer
                  <select
                    value={questionForm.tf?.correctChoice ? "true" : "false"}
                    onChange={(e) =>
                      setQuestionForm((f) => ({
                        ...f,
                        tf: {
                          correctChoice: e.target.value === "true",
                        },
                      }))
                    }
                    className="exam-edit-input"
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                </label>
              )}

              {questionForm.type === "MCQ" && questionForm.mcq && (
                <div className="exam-edit-mcq-choices">
                  {questionErrors.choices && (
                    <span className="field-error">
                      {questionErrors.choices}
                    </span>
                  )}
                  <label className="exam-edit-allow-multi">
                    <input
                      type="checkbox"
                      checked={questionForm.mcq.allowMulti ?? false}
                      onChange={(e) =>
                        setQuestionForm((f) => ({
                          ...f,
                          mcq: f.mcq
                            ? { ...f.mcq, allowMulti: e.target.checked }
                            : { allowMulti: e.target.checked, choices: [] },
                        }))
                      }
                    />
                    Allow multiple correct answers
                  </label>
                  <span>Options (min 2, select correct)</span>
                  {(questionForm.mcq.choices ?? []).map((c, i) => (
                    <div key={i} className="exam-edit-choice-row">
                      <input
                        type="text"
                        value={c.text}
                        onChange={(e) =>
                          handleChoiceTextChange(i, e.target.value)
                        }
                        className="exam-edit-input"
                        placeholder={`Option ${i + 1}`}
                      />
                      <label className="exam-edit-correct-check">
                        <input
                          type={
                            questionForm.mcq?.allowMulti ? "checkbox" : "radio"
                          }
                          name={
                            questionForm.mcq?.allowMulti
                              ? undefined
                              : "correctMcq"
                          }
                          checked={c.isCorrect}
                          onChange={() => handleCorrectChoiceChange(i)}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-secondary-small"
                    onClick={handleAddChoice}
                  >
                    + Add option
                  </button>
                </div>
              )}

              <div className="exam-edit-form-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAddQuestionToList}
                  disabled={addingQuestion}
                >
                  Add to exam
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setQuestionErrors({});
                    setShowAddForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="exam-edit-questions-list">
          {questions.map((q, index) => (
            <li key={index} className="exam-edit-question-list-item">
              <div className="exam-edit-question-row">
                <span className="exam-edit-question-number">#{index + 1}</span>
                <div className="exam-edit-question-info">
                  <span className="exam-edit-question-type">{q.type}</span>
                  <span className="exam-edit-question-mark">{q.mark} pt</span>
                  <span className="exam-edit-question-text">
                    {q.text.slice(0, 60)}
                    {q.text.length > 60 ? "…" : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {questions.length === 0 && !showAddForm && (
          <p className="text-muted">
            No questions yet. Add at least one question above.
          </p>
        )}
      </section>

      <div className="exam-edit-form-actions" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleCreateExam}
          disabled={creating}
        >
          {creating ? "Creating…" : "Create Exam"}
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate("/instructor/examinations")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateExamPage;
