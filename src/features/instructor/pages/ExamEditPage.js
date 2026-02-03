import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getExamById, updateExam } from "@/services/examination/exam.service";
import { getInstructorCourses } from "@/services/courses/course.service";
import { getAllExamQuestions, addQuestion, updateQuestion, deleteQuestion, } from "@/services/questions/question.service";
import { useToastStore } from "@/store/toast.store";
import { useAuthStore } from "@/store";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
const ExamEditPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const showToast = useToastStore((s) => s.showToast);
    const user = useAuthStore((s) => s.user);
    const id = examId ?? "";
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingExam, setSavingExam] = useState(false);
    const [savingQuestion, setSavingQuestion] = useState(false);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingQId, setEditingQId] = useState(null);
    const [form, setForm] = useState({});
    const [questionForm, setQuestionForm] = useState({
        type: "MCQ",
        mark: 1,
        text: "",
        mcq: { allowMulti: false, choices: [{ text: "", isCorrect: false }] },
        tf: { correctChoice: false },
    });
    const [examErrors, setExamErrors] = useState({});
    const [questionErrors, setQuestionErrors] = useState({});
    const [successFlash, setSuccessFlash] = useState(null);
    const [successFlashRowId, setSuccessFlashRowId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [courses, setCourses] = useState([]);
    const editFormRef = useRef(null);
    const addFormRef = useRef(null);
    const instructorId = user?.id ?? 2;
    useEffect(() => {
        getInstructorCourses(instructorId).then(setCourses);
    }, [instructorId]);
    useEffect(() => {
        if (!id)
            return;
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
        const handleClickOutside = (e) => {
            if (showAddForm &&
                addFormRef.current &&
                !addFormRef.current.contains(e.target)) {
                setShowAddForm(false);
                setQuestionErrors({});
            }
            if (editingQId !== null &&
                editFormRef.current &&
                !editFormRef.current.contains(e.target)) {
                const target = e.target;
                if (!target.closest(".exam-edit-question-row")) {
                    setEditingQId(null);
                    setQuestionErrors({});
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAddForm, editingQId]);
    const validateExamForm = () => {
        const err = {};
        if (!form.title?.trim())
            err.title = "Title is required";
        if (!form.date?.trim())
            err.date = "Date is required";
        const duration = form.duration ?? 0;
        if (duration <= 0 || Number.isNaN(duration))
            err.duration = "Duration must be greater than 0";
        if (!form.courseName?.trim())
            err.courseName = "Course name is required";
        const count = form.questionsCount ?? 0;
        if (count < 0 || Number.isNaN(count))
            err.questionsCount = "Questions count must be 0 or more";
        if (!form.status)
            err.status = "Status is required";
        setExamErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleSaveExam = async () => {
        if (!id)
            return;
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
        }
        catch {
            showToast("Failed to update exam", "error");
        }
        finally {
            setSavingExam(false);
        }
    };
    const validateQuestionForm = () => {
        const err = {};
        const text = questionForm.text?.trim() ?? "";
        if (!text)
            err.text = "Question text is required";
        else if (text.length < 10)
            err.text = "Question must be at least 10 characters";
        const mark = questionForm.mark ?? 0;
        if (mark < 1 || Number.isNaN(mark))
            err.mark = "Points must be greater than 0";
        if (!questionForm.type)
            err.type = "Please select question type";
        if (questionForm.type === "MCQ" && questionForm.mcq) {
            const choices = questionForm.mcq.choices ?? [];
            if (choices.length < 2)
                err.choices = "Add at least 2 options";
            else {
                const empty = choices.some((c) => !c.text?.trim());
                if (empty)
                    err.choices = "All options must have text";
                const hasCorrect = choices.some((c) => c.isCorrect);
                if (!hasCorrect)
                    err.choices = "Select at least one correct answer";
            }
        }
        if (questionForm.type === "TF" && questionForm.tf === undefined) {
            err.correctAnswer = "Select correct answer (True or False)";
        }
        setQuestionErrors(err);
        return Object.keys(err).length === 0;
    };
    const isQuestionFormValid = () => {
        const text = questionForm.text?.trim() ?? "";
        if (!text || text.length < 10)
            return false;
        const mark = questionForm.mark ?? 0;
        if (mark < 1 || Number.isNaN(mark))
            return false;
        if (!questionForm.type)
            return false;
        if (questionForm.type === "MCQ" && questionForm.mcq) {
            const choices = questionForm.mcq.choices ?? [];
            if (choices.length < 2)
                return false;
            if (choices.some((c) => !c.text?.trim()))
                return false;
            if (!choices.some((c) => c.isCorrect))
                return false;
        }
        return true;
    };
    const handleAddQuestion = async () => {
        if (!id)
            return;
        setQuestionErrors({});
        if (!validateQuestionForm()) {
            showToast("Please fix the errors below", "error", "Validation");
            return;
        }
        setAddingQuestion(true);
        const payload = {
            text: questionForm.text,
            type: questionForm.type,
            mark: questionForm.mark ?? 1,
        };
        if (questionForm.type === "MCQ" && questionForm.mcq) {
            payload.mcq = questionForm.mcq;
        }
        else if (questionForm.type === "TF" && questionForm.tf) {
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
        }
        catch {
            showToast("Failed to add question", "error");
        }
        finally {
            setAddingQuestion(false);
        }
    };
    const handleUpdateQuestion = async () => {
        if (editingQId == null)
            return;
        setQuestionErrors({});
        if (!validateQuestionForm()) {
            showToast("Please fix the errors below", "error", "Validation");
            return;
        }
        setSavingQuestion(true);
        const payload = {
            text: questionForm.text,
            type: questionForm.type,
            mark: questionForm.mark,
            mcq: questionForm.mcq,
            tf: questionForm.tf,
        };
        try {
            const updated = await updateQuestion(editingQId, payload);
            if (updated) {
                setQuestions((prev) => prev.map((q) => (q.id === editingQId ? updated : q)));
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
        }
        catch {
            showToast("Failed to update question", "error");
        }
        finally {
            setSavingQuestion(false);
        }
    };
    const handleDeleteQuestion = async (quesId) => {
        setDeleteConfirmId(quesId);
    };
    const confirmDeleteQuestion = async () => {
        const quesId = deleteConfirmId;
        if (!quesId)
            return;
        setDeleteConfirmId(null);
        try {
            await deleteQuestion(quesId);
            setQuestions((prev) => prev.filter((q) => q.id !== quesId));
            if (editingQId === quesId)
                setEditingQId(null);
            showToast("Question deleted successfully", "success", "Deleted");
        }
        catch {
            showToast("Failed to delete question", "error");
        }
    };
    const openEditQuestion = (q) => {
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
            mcq: q.type === "MCQ" && q.choices
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
                    ...f.mcq,
                    choices: [...prevChoices, { text: "", isCorrect: false }],
                },
            };
        });
    };
    const handleChoiceTextChange = (index, text) => {
        setQuestionErrors((e) => ({ ...e, choices: "" }));
        setQuestionForm((f) => {
            const choices = [...(f.mcq?.choices ?? [])];
            const c = choices[index];
            if (!c)
                return f;
            choices[index] = { ...c, text };
            return { ...f, mcq: { ...f.mcq, choices } };
        });
    };
    const handleCorrectChoiceChange = (index) => {
        setQuestionErrors((e) => ({ ...e, choices: "" }));
        setQuestionForm((f) => {
            const allowMulti = f.mcq?.allowMulti ?? false;
            const choices = (f.mcq?.choices ?? []).map((ch, j) => {
                if (allowMulti) {
                    return j === index ? { ...ch, isCorrect: !ch.isCorrect } : ch;
                }
                return { ...ch, isCorrect: j === index };
            });
            return { ...f, mcq: { ...f.mcq, choices } };
        });
    };
    const renderQuestionForm = (mode) => (_jsxs("div", { className: "exam-edit-question-form", children: [_jsxs("label", { children: ["Question text", _jsx("input", { type: "text", value: questionForm.text ?? "", onChange: (e) => {
                            setQuestionForm((f) => ({ ...f, text: e.target.value }));
                            if (questionErrors.text)
                                setQuestionErrors((e) => ({ ...e, text: "" }));
                        }, className: `exam-edit-input ${questionErrors.text ? "has-error" : ""}`, placeholder: "Enter question text" }), questionErrors.text && (_jsx("span", { className: "field-error", children: questionErrors.text }))] }), _jsxs("label", { children: ["Type", _jsxs("select", { value: questionForm.type ?? "MCQ", onChange: (e) => setQuestionForm((f) => ({
                            ...f,
                            type: e.target.value,
                        })), className: "exam-edit-input", children: [_jsx("option", { value: "MCQ", children: "MCQ" }), _jsx("option", { value: "TF", children: "True / False" })] })] }), _jsxs("label", { children: ["Mark", _jsx("input", { type: "number", min: 1, value: questionForm.mark ?? 1, onChange: (e) => {
                            setQuestionForm((f) => ({
                                ...f,
                                mark: Number(e.target.value),
                            }));
                            if (questionErrors.mark)
                                setQuestionErrors((e) => ({ ...e, mark: "" }));
                        }, className: `exam-edit-input ${questionErrors.mark ? "has-error" : ""}` }), questionErrors.mark && (_jsx("span", { className: "field-error", children: questionErrors.mark }))] }), questionForm.type === "TF" && (_jsxs("label", { children: ["Correct answer (required)", _jsxs("select", { value: questionForm.tf?.correctChoice ? "true" : "false", onChange: (e) => setQuestionForm((f) => ({
                            ...f,
                            tf: {
                                correctChoice: e.target.value === "true",
                            },
                        })), className: `exam-edit-input ${questionErrors.correctAnswer ? "has-error" : ""}`, children: [_jsx("option", { value: "false", children: "False" }), _jsx("option", { value: "true", children: "True" })] }), questionErrors.correctAnswer && (_jsx("span", { className: "field-error", children: questionErrors.correctAnswer }))] })), questionForm.type === "MCQ" && questionForm.mcq && (_jsxs("div", { className: "exam-edit-mcq-choices", children: [questionErrors.choices && (_jsx("span", { className: "field-error", children: questionErrors.choices })), _jsxs("label", { className: "exam-edit-allow-multi", children: [_jsx("input", { type: "checkbox", checked: questionForm.mcq.allowMulti ?? false, onChange: (e) => setQuestionForm((f) => ({
                                    ...f,
                                    mcq: f.mcq
                                        ? { ...f.mcq, allowMulti: e.target.checked }
                                        : { allowMulti: e.target.checked, choices: [] },
                                })) }), "Allow multiple correct answers"] }), _jsx("span", { children: "Choices" }), (questionForm.mcq.choices ?? []).map((c, i) => (_jsxs("div", { className: "exam-edit-choice-row", children: [_jsx("input", { type: "text", value: c.text, onChange: (e) => handleChoiceTextChange(i, e.target.value), className: "exam-edit-input", placeholder: `Choice ${i + 1}` }), _jsxs("label", { className: "exam-edit-correct-check", children: [_jsx("input", { type: questionForm.mcq?.allowMulti ? "checkbox" : "radio", name: questionForm.mcq?.allowMulti ? undefined : "correctMcq", checked: c.isCorrect, onChange: () => handleCorrectChoiceChange(i) }), "Correct"] })] }, i))), _jsx("button", { type: "button", className: "btn-secondary-small", onClick: handleAddChoice, children: "+ Add choice" })] })), _jsxs("div", { className: "exam-edit-form-actions", children: [mode === "edit" ? (_jsx("button", { type: "button", className: "btn-primary", onClick: handleUpdateQuestion, disabled: savingQuestion, children: savingQuestion ? "Saving…" : "Update question" })) : (_jsx("button", { type: "button", className: "btn-primary", onClick: handleAddQuestion, disabled: addingQuestion, children: addingQuestion ? "Adding…" : "Add question" })), _jsx("button", { type: "button", className: "btn-cancel", onClick: () => {
                            setQuestionErrors({});
                            setShowAddForm(false);
                            setEditingQId(null);
                        }, children: "Cancel" })] })] }));
    if (loading) {
        return (_jsx("div", { className: "exam-edit-page", children: _jsxs("div", { className: "exam-edit-loading", children: [_jsx("div", { className: "skeleton skeleton-header" }), _jsx("div", { className: "skeleton skeleton-section" }), _jsx("div", { className: "skeleton skeleton-section" })] }) }));
    }
    if (!exam)
        return _jsx("p", { className: "text-muted", children: "Exam not found." });
    return (_jsxs("div", { className: "exam-edit-page", children: [_jsxs("header", { className: "exam-edit-header", children: [_jsx("button", { type: "button", className: "btn-back", onClick: () => navigate("/instructor/examinations"), children: "\u2190 Back to Examinations" }), _jsx("h2", { className: "exam-preview-title", children: "Edit Exam" })] }), _jsxs("section", { className: `exam-edit-form-section exam-details-section ${successFlash === "exam" ? "success-flash" : ""}`, children: [_jsx("h3", { className: "exam-edit-section-title", children: "Exam Details" }), _jsxs("div", { className: "exam-edit-form", children: [_jsxs("label", { children: ["Title", _jsx("input", { type: "text", value: form.title ?? "", onChange: (e) => {
                                            setForm((f) => ({ ...f, title: e.target.value }));
                                            if (examErrors.title)
                                                setExamErrors((e) => ({ ...e, title: "" }));
                                        }, className: `exam-edit-input ${examErrors.title ? "has-error" : ""}` }), examErrors.title && (_jsx("span", { className: "field-error", children: examErrors.title }))] }), _jsxs("label", { children: ["Date", _jsx("input", { type: "text", value: form.date ?? "", onChange: (e) => {
                                            setForm((f) => ({ ...f, date: e.target.value }));
                                            if (examErrors.date)
                                                setExamErrors((e) => ({ ...e, date: "" }));
                                        }, className: `exam-edit-input ${examErrors.date ? "has-error" : ""}`, placeholder: "e.g. Feb 5, 2026 10:00 AM" }), examErrors.date && (_jsx("span", { className: "field-error", children: examErrors.date }))] }), _jsxs("label", { children: ["Duration (mins)", _jsx("input", { type: "number", min: 1, value: form.duration ?? "", onChange: (e) => {
                                            setForm((f) => ({ ...f, duration: Number(e.target.value) }));
                                            if (examErrors.duration)
                                                setExamErrors((e) => ({ ...e, duration: "" }));
                                        }, className: `exam-edit-input ${examErrors.duration ? "has-error" : ""}` }), examErrors.duration && (_jsx("span", { className: "field-error", children: examErrors.duration }))] }), _jsxs("label", { children: ["Status", _jsxs("select", { value: form.status ?? "upcoming", onChange: (e) => setForm((f) => ({
                                            ...f,
                                            status: e.target.value,
                                        })), className: "exam-edit-input", children: [_jsx("option", { value: "upcoming", children: "Upcoming" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "completed", children: "Completed" })] })] }), _jsxs("label", { children: ["Course", _jsxs("select", { value: form.courseName ?? "", onChange: (e) => {
                                            setForm((f) => ({ ...f, courseName: e.target.value }));
                                            if (examErrors.courseName)
                                                setExamErrors((e) => ({ ...e, courseName: "" }));
                                        }, className: `exam-edit-input ${examErrors.courseName ? "has-error" : ""}`, children: [_jsx("option", { value: "", children: "Select course" }), courses.map((c) => (_jsx("option", { value: c.Course_Name, children: c.Course_Name }, c.Course_ID)))] }), examErrors.courseName && (_jsx("span", { className: "field-error", children: examErrors.courseName }))] }), _jsxs("label", { children: ["Questions count (display)", _jsx("input", { type: "number", min: 0, value: form.questionsCount ?? 0, onChange: (e) => {
                                            setForm((f) => ({
                                                ...f,
                                                questionsCount: Number(e.target.value),
                                            }));
                                            if (examErrors.questionsCount)
                                                setExamErrors((e) => ({ ...e, questionsCount: "" }));
                                        }, className: `exam-edit-input ${examErrors.questionsCount ? "has-error" : ""}` }), examErrors.questionsCount && (_jsx("span", { className: "field-error", children: examErrors.questionsCount }))] }), _jsx("button", { type: "button", className: "btn-primary", onClick: handleSaveExam, disabled: savingExam, children: savingExam ? "Saving…" : "Update exam" })] })] }), _jsxs("section", { className: "exam-edit-questions-section", children: [_jsxs("div", { className: "exam-edit-questions-header", children: [_jsxs("h3", { className: "exam-edit-section-title", children: ["Questions (", questions.length, ")"] }), _jsx("button", { type: "button", className: "btn-primary", onClick: () => {
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
                                }, children: "+ Add question" })] }), showAddForm && (_jsxs("div", { ref: addFormRef, className: "exam-edit-question-form-section exam-edit-question-form-inline exam-edit-question-form-slide", children: [_jsx("h3", { className: "exam-edit-section-title", children: "New question" }), renderQuestionForm("add")] })), _jsx("ul", { className: "exam-edit-questions-list", children: questions.map((q, index) => (_jsxs("li", { className: `exam-edit-question-list-item ${editingQId === q.id ? "is-editing" : ""}`, children: [_jsxs("div", { className: `exam-edit-question-row ${successFlashRowId === q.id ? "question-row-success-flash" : ""}`, children: [_jsxs("span", { className: "exam-edit-question-number", children: ["#", index + 1] }), _jsxs("div", { className: "exam-edit-question-info", children: [_jsx("span", { className: "exam-edit-question-type", children: q.type }), _jsxs("span", { className: "exam-edit-question-mark", children: [q.mark, " pt"] }), _jsxs("span", { className: "exam-edit-question-text", children: [q.text.slice(0, 60), q.text.length > 60 ? "…" : ""] })] }), _jsxs("div", { className: "exam-edit-question-actions", children: [_jsx("button", { type: "button", className: "btn-edit", onClick: () => openEditQuestion(q), children: "Edit" }), _jsx("button", { type: "button", className: "btn-delete", onClick: () => handleDeleteQuestion(q.id), children: "Delete" })] })] }), editingQId === q.id && (_jsxs("div", { ref: editFormRef, className: "exam-edit-question-form-section exam-edit-question-form-inline exam-edit-question-form-slide", children: [_jsx("h3", { className: "exam-edit-section-title", children: "Edit question" }), renderQuestionForm("edit")] }))] }, q.id))) }), questions.length === 0 && !showAddForm && (_jsx("p", { className: "text-muted", children: "No questions yet. Add one above." }))] }), deleteConfirmId !== null && (_jsx("div", { className: "confirm-modal-overlay", onClick: () => setDeleteConfirmId(null), children: _jsxs("div", { className: "confirm-modal", onClick: (e) => e.stopPropagation(), children: [_jsx("h3", { className: "confirm-modal-title", children: "Delete question?" }), _jsx("p", { className: "confirm-modal-message", children: "This action cannot be undone." }), _jsxs("div", { className: "confirm-modal-actions", children: [_jsx("button", { type: "button", className: "btn-cancel", onClick: () => setDeleteConfirmId(null), children: "Cancel" }), _jsx("button", { type: "button", className: "btn-delete", onClick: confirmDeleteQuestion, children: "Delete" })] })] }) }))] }));
};
export default ExamEditPage;
