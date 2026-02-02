import { getExamById, updateExam } from "@/services/examination/exam.service";
import { Exam } from "@/services/examination/exam.types";
import {
  getAllExamQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/questions/question.service";
import { Question } from "@/services/questions/question.types";
import { useToastStore } from "@/store/toast.store";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { AddQuestionPayload } from "@/services/questions/question.service";

type ExamErrors = Record<string, string>;
type QuestionErrors = Record<string, string>;

const ExamEditPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);
  const id = examId ?? "";

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingExam, setSavingExam] = useState(false);
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
    if (!questionForm.text?.trim()) err.text = "Question text is required";
    const mark = questionForm.mark ?? 0;
    if (mark < 1 || Number.isNaN(mark)) err.mark = "Mark must be at least 1";
    if (questionForm.type === "MCQ" && questionForm.mcq) {
      const choices = questionForm.mcq.choices ?? [];
      if (choices.length < 2) err.choices = "Add at least 2 choices";
      else {
        const empty = choices.some((c) => !c.text?.trim());
        if (empty) err.choices = "All choices must have text";
        const hasCorrect = choices.some((c) => c.isCorrect);
        if (!hasCorrect) err.choices = "Select at least one correct choice";
      }
    }
    setQuestionErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddQuestion = async () => {
    if (!id) return;
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
    try {
      const q = await addQuestion(Number(id), payload);
      setQuestions((prev) => [...prev, q]);
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
    }
  };

  const handleUpdateQuestion = async () => {
    if (editingQId == null) return;
    setQuestionErrors({});
    if (!validateQuestionForm()) {
      showToast("Please fix the errors below", "error", "Validation");
      return;
    }
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
    }
  };

  const handleDeleteQuestion = async (quesId: number) => {
    if (!window.confirm("Delete this question?")) return;
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
          >
            Update question
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={handleAddQuestion}
            disabled={!questionForm.text?.trim()}
          >
            Add question
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

  if (loading) return <p className="text-muted">Loading exam...</p>;
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
        className={`exam-edit-form-section ${
          successFlash === "exam" ? "success-flash" : ""
        }`}
      >
        <h3 className="exam-edit-section-title">Exam details</h3>
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
            Course name
            <input
              type="text"
              value={form.courseName ?? ""}
              onChange={(e) => {
                setForm((f) => ({ ...f, courseName: e.target.value }));
                if (examErrors.courseName)
                  setExamErrors((e) => ({ ...e, courseName: "" }));
              }}
              className={`exam-edit-input ${
                examErrors.courseName ? "has-error" : ""
              }`}
            />
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
          <div className="exam-edit-question-form-section exam-edit-question-form-inline">
            <h3 className="exam-edit-section-title">New question</h3>
            {renderQuestionForm("add")}
          </div>
        )}

        <ul className="exam-edit-questions-list">
          {questions.map((q) => (
            <li key={q.id} className="exam-edit-question-list-item">
              <div
                className={`exam-edit-question-row ${
                  successFlashRowId === q.id ? "question-row-success-flash" : ""
                }`}
              >
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
              {/* Edit form: shown directly below the selected question */}
              {editingQId === q.id && (
                <div className="exam-edit-question-form-section exam-edit-question-form-inline">
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
    </div>
  );
};

export default ExamEditPage;
