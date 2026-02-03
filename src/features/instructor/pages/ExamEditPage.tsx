import { getExamById, updateExam } from "@/services/examination/exam.service";
import { getInstructorCourses } from "@/services/courses/course.service";
import type { Course } from "@/services/courses/course.types";
import { Exam } from "@/services/examination/exam.types";
import {
  getAllExamQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/questions/question.service";
import { Question } from "@/services/questions/question.types";
import { useToastStore } from "@/store/toast.store";
import { useAuthStore } from "@/store";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { AddQuestionPayload } from "@/services/questions/question.service";

type ExamErrors = Record<string, string>;
type QuestionErrors = Record<string, string>;

const ExamEditPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);
  const id = examId ?? "";

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingExam, setSavingExam] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQId, setEditingQId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Exam>>({});
  const [questionForm, setQuestionForm] = useState<Partial<AddQuestionPayload>>(
    {
      type: "MCQ",
      mark: 1,
      text: "",
      mcq: { allowMulti: false, choices: [{ text: "", isCorrect: false }] },
      tf: { correctChoice: false },
    }
  );
  const [examErrors, setExamErrors] = useState<ExamErrors>({});
  const [questionErrors, setQuestionErrors] = useState<QuestionErrors>({});
  const [successFlash, setSuccessFlash] = useState<"exam" | null>(null);
  const [successFlashRowId, setSuccessFlashRowId] = useState<number | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const editFormRef = useRef<HTMLDivElement>(null);
  const addFormRef = useRef<HTMLDivElement>(null);

  const instructorId = user?.id ?? 2;

  useEffect(() => {
    getInstructorCourses(instructorId).then(setCourses);
  }, [instructorId]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getExamById(id), getAllExamQuestions(Number(id))])
      .then(([e, qs]) => {
        setExam(e ?? null);
        setForm(e ?? {});
        setQuestions(qs);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
      if (
        editingQId !== null &&
        editFormRef.current &&
        !editFormRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement;
        if (!target.closest(".exam-edit-question-row")) {
          setEditingQId(null);
          setQuestionErrors({});
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddForm, editingQId]);

  const validateExamForm = (): boolean => {
    const err: ExamErrors = {};
    if (!form.title?.trim()) err.title = "Title is required";
    if (!form.date?.trim()) err.date = "Date is required";
    const duration = form.duration ?? 0;
    if (duration <= 0 || Number.isNaN(duration))
      err.duration = "Duration must be greater than 0";
    if (!form.courseName?.trim()) err.courseName = "Course name is required";
    const count = form.questionsCount ?? 0;
    if (count < 0 || Number.isNaN(count))
      err.questionsCount = "Questions count must be 0 or more";
    if (!form.status) err.status = "Status is required";
    setExamErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveExam = async () => {
    if (!id) return;
    setExamErrors({});
    if (!validateExamForm()) {
      showToast("Please fix the errors below", "error", "Validation");
      return;
    }
    setSavingExam(true);
    try {
      await updateExam(id, {
        title: form.title,
        date: form.date,
        duration: form.duration,
        status: form.status,
        questionsCount: form.questionsCount,
        courseName: form.courseName,
      });
      setExam((prev) => (prev ? { ...prev, ...form } : null));
      setSuccessFlash("exam");
      setTimeout(() => setSuccessFlash(null), 1500);
      showToast("Exam updated successfully", "success", "Saved");
    } catch {
      showToast("Failed to update exam", "error");
    } finally {
      setSavingExam(false);
    }
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
    if (questionForm.type === "TF" && questionForm.tf === undefined) {
      err.correctAnswer = "Select correct answer (True or False)";
    }
    setQuestionErrors(err);
    return Object.keys(err).length === 0;
  };

  const isQuestionFormValid = (): boolean => {
    const text = questionForm.text?.trim() ?? "";
    if (!text || text.length < 10) return false;
    const mark = questionForm.mark ?? 0;
    if (mark < 1 || Number.isNaN(mark)) return false;
    if (!questionForm.type) return false;
    if (questionForm.type === "MCQ" && questionForm.mcq) {
      const choices = questionForm.mcq.choices ?? [];
      if (choices.length < 2) return false;
      if (choices.some((c) => !c.text?.trim())) return false;
      if (!choices.some((c) => c.isCorrect)) return false;
    }
    return true;
  };

  const handleAddQuestion = async () => {
    if (!id) return;
    setQuestionErrors({});
    if (!validateQuestionForm()) {
      showToast("Please fix the errors below", "error", "Validation");
      return;
    }
    setAddingQuestion(true);
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
    try {
      const q = await addQuestion(Number(id), payload);
      setQuestions((prev) => [...prev, q]);
      setForm((f) => ({ ...f, questionsCount: questions.length + 1 }));
      setQuestionForm({
        type: "MCQ",
        mark: 1,
        text: "",
        mcq: { allowMulti: false, choices: [{ text: "", isCorrect: false }] },
        tf: { correctChoice: false },
      });
      setShowAddForm(false);
      setQuestionErrors({});
      showToast("Question added successfully", "success", "Saved");
    } catch {
      showToast("Failed to add question", "error");
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (editingQId == null) return;
    setQuestionErrors({});
    if (!validateQuestionForm()) {
      showToast("Please fix the errors below", "error", "Validation");
      return;
    }
    setSavingQuestion(true);
    const payload: Partial<AddQuestionPayload> = {
      text: questionForm.text,
      type: questionForm.type,
      mark: questionForm.mark,
      mcq: questionForm.mcq,
      tf: questionForm.tf,
    };
    try {
      const updated = await updateQuestion(editingQId, payload);
      if (updated) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === editingQId ? updated : q))
        );
        setSuccessFlashRowId(editingQId);
        setTimeout(() => setSuccessFlashRowId(null), 1200);
        setEditingQId(null);
        setQuestionForm({
          type: "MCQ",
          mark: 1,
          text: "",
          mcq: { allowMulti: false, choices: [{ text: "", isCorrect: false }] },
          tf: { correctChoice: false },
        });
        showToast("Question updated successfully", "success", "Saved");
      }
    } catch {
      showToast("Failed to update question", "error");
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (quesId: number) => {
    setDeleteConfirmId(quesId);
  };

  const confirmDeleteQuestion = async () => {
    const quesId = deleteConfirmId;
    if (!quesId) return;
    setDeleteConfirmId(null);
    try {
      await deleteQuestion(quesId);
      setQuestions((prev) => prev.filter((q) => q.id !== quesId));
      if (editingQId === quesId) setEditingQId(null);
      showToast("Question deleted successfully", "success", "Deleted");
    } catch {
      showToast("Failed to delete question", "error");
    }
  };

  const openEditQuestion = (q: Question) => {
    setQuestionErrors({});
    if (editingQId === q.id) {
      setEditingQId(null);
      return;
    }
    setEditingQId(q.id);
    setQuestionForm({
      text: q.text,
      type: q.type,
      mark: q.mark,
      mcq:
        q.type === "MCQ" && q.choices
          ? {
              allowMulti: q.allowMulti ?? false,
              choices: q.choices.map((c) => ({
                text: c.text,
                isCorrect: c.isCorrect,
              })),
            }
          : { allowMulti: false, choices: [{ text: "", isCorrect: false }] },
      tf: { correctChoice: q.correctTF ?? false },
    });
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const handleAddChoice = () => {
    setQuestionErrors((e) => ({ ...e, choices: "" }));
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
    setQuestionErrors((e) => ({ ...e, choices: "" }));
    setQuestionForm((f) => {
      const choices = [...(f.mcq?.choices ?? [])];
      const c = choices[index];
      if (!c) return f;
      choices[index] = { ...c, text };
      return { ...f, mcq: { ...f.mcq!, choices } };
    });
  };

  const handleCorrectChoiceChange = (index: number) => {
    setQuestionErrors((e) => ({ ...e, choices: "" }));
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

  const renderQuestionForm = (mode: "add" | "edit") => (
    <div className="exam-edit-question-form">
      <label>
        Question text
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
          Correct answer (required)
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
            className={`exam-edit-input ${
              questionErrors.correctAnswer ? "has-error" : ""
            }`}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
          {questionErrors.correctAnswer && (
            <span className="field-error">{questionErrors.correctAnswer}</span>
          )}
        </label>
      )}

      {questionForm.type === "MCQ" && questionForm.mcq && (
        <div className="exam-edit-mcq-choices">
          {questionErrors.choices && (
            <span className="field-error">{questionErrors.choices}</span>
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
          <span>Choices</span>
          {(questionForm.mcq.choices ?? []).map((c, i) => (
            <div key={i} className="exam-edit-choice-row">
              <input
                type="text"
                value={c.text}
                onChange={(e) => handleChoiceTextChange(i, e.target.value)}
                className="exam-edit-input"
                placeholder={`Choice ${i + 1}`}
              />
              <label className="exam-edit-correct-check">
                <input
                  type={questionForm.mcq?.allowMulti ? "checkbox" : "radio"}
                  name={questionForm.mcq?.allowMulti ? undefined : "correctMcq"}
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
            + Add choice
          </button>
        </div>
      )}

      <div className="exam-edit-form-actions">
        {mode === "edit" ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpdateQuestion}
            disabled={savingQuestion}
          >
            {savingQuestion ? "Saving…" : "Update question"}
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={handleAddQuestion}
            disabled={addingQuestion}
          >
            {addingQuestion ? "Adding…" : "Add question"}
          </button>
        )}
        <button
          type="button"
          className="btn-cancel"
          onClick={() => {
            setQuestionErrors({});
            setShowAddForm(false);
            setEditingQId(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="exam-edit-page">
        <div className="exam-edit-loading">
          <div className="skeleton skeleton-header" />
          <div className="skeleton skeleton-section" />
          <div className="skeleton skeleton-section" />
        </div>
      </div>
    );
  }
  if (!exam) return <p className="text-muted">Exam not found.</p>;

  return (
    <div className="exam-edit-page">
      <header className="exam-edit-header">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/instructor/examinations")}
        >
          ← Back to Examinations
        </button>
        <h2 className="exam-preview-title">Edit Exam</h2>
      </header>

      {/* Exam info form */}
      <section
        className={`exam-edit-form-section exam-details-section ${
          successFlash === "exam" ? "success-flash" : ""
        }`}
      >
        <h3 className="exam-edit-section-title">Exam Details</h3>
        <div className="exam-edit-form">
          <label>
            Title
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => {
                setForm((f) => ({ ...f, title: e.target.value }));
                if (examErrors.title)
                  setExamErrors((e) => ({ ...e, title: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.title ? "has-error" : ""
              }`}
            />
            {examErrors.title && (
              <span className="field-error">{examErrors.title}</span>
            )}
          </label>
          <label>
            Date
            <input
              type="text"
              value={form.date ?? ""}
              onChange={(e) => {
                setForm((f) => ({ ...f, date: e.target.value }));
                if (examErrors.date) setExamErrors((e) => ({ ...e, date: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.date ? "has-error" : ""
              }`}
              placeholder="e.g. Feb 5, 2026 10:00 AM"
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
              value={form.duration ?? ""}
              onChange={(e) => {
                setForm((f) => ({ ...f, duration: Number(e.target.value) }));
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
              value={form.status ?? "upcoming"}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as Exam["status"],
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
              value={form.courseName ?? ""}
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
          <label>
            Questions count (display)
            <input
              type="number"
              min={0}
              value={form.questionsCount ?? 0}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  questionsCount: Number(e.target.value),
                }));
                if (examErrors.questionsCount)
                  setExamErrors((e) => ({ ...e, questionsCount: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.questionsCount ? "has-error" : ""
              }`}
            />
            {examErrors.questionsCount && (
              <span className="field-error">{examErrors.questionsCount}</span>
            )}
          </label>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveExam}
            disabled={savingExam}
          >
            {savingExam ? "Saving…" : "Update exam"}
          </button>
        </div>
      </section>

      {/* Questions list */}
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
              setEditingQId(null);
              setQuestionForm({
                type: "MCQ",
                mark: 1,
                text: "",
                mcq: {
                  allowMulti: false,
                  choices: [{ text: "", isCorrect: false }],
                },
                tf: { correctChoice: false },
              });
            }}
          >
            + Add question
          </button>
        </div>

        {/* Add question form: shown right below "+ Add question" button */}
        {showAddForm && (
          <div
            ref={addFormRef}
            className="exam-edit-question-form-section exam-edit-question-form-inline exam-edit-question-form-slide"
          >
            <h3 className="exam-edit-section-title">New question</h3>
            {renderQuestionForm("add")}
          </div>
        )}

        <ul className="exam-edit-questions-list">
          {questions.map((q, index) => (
            <li
              key={q.id}
              className={`exam-edit-question-list-item ${
                editingQId === q.id ? "is-editing" : ""
              }`}
            >
              <div
                className={`exam-edit-question-row ${
                  successFlashRowId === q.id ? "question-row-success-flash" : ""
                }`}
              >
                <span className="exam-edit-question-number">#{index + 1}</span>
                <div className="exam-edit-question-info">
                  <span className="exam-edit-question-type">{q.type}</span>
                  <span className="exam-edit-question-mark">{q.mark} pt</span>
                  <span className="exam-edit-question-text">
                    {q.text.slice(0, 60)}
                    {q.text.length > 60 ? "…" : ""}
                  </span>
                </div>
                <div className="exam-edit-question-actions">
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => openEditQuestion(q)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Edit form: shown directly below the selected question with slide-down */}
              {editingQId === q.id && (
                <div
                  ref={editFormRef}
                  className="exam-edit-question-form-section exam-edit-question-form-inline exam-edit-question-form-slide"
                >
                  <h3 className="exam-edit-section-title">Edit question</h3>
                  {renderQuestionForm("edit")}
                </div>
              )}
            </li>
          ))}
        </ul>

        {questions.length === 0 && !showAddForm && (
          <p className="text-muted">No questions yet. Add one above.</p>
        )}
      </section>

      {/* Delete confirmation modal */}
      {deleteConfirmId !== null && (
        <div
          className="confirm-modal-overlay"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-modal-title">Delete question?</h3>
            <p className="confirm-modal-message">
              This action cannot be undone.
            </p>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={confirmDeleteQuestion}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEditPage;
