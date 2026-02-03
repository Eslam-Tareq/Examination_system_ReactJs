import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "@/services/examination/exam.service";
import { useAuthStore } from "@/store";
import { addQuestion } from "@/services/questions/question.service";
import { useToastStore } from "@/store/toast.store";
import { getInstructorCourses } from "@/services/courses/course.service";
const initialQuestionForm = {
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
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        title: "",
        date: "",
        duration: 60,
        status: "upcoming",
        courseName: "",
    });
    const [questions, setQuestions] = useState([]);
    const [questionForm, setQuestionForm] = useState(initialQuestionForm);
    const [showAddForm, setShowAddForm] = useState(false);
    const [examErrors, setExamErrors] = useState({});
    const [questionErrors, setQuestionErrors] = useState({});
    const [creating, setCreating] = useState(false);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const addFormRef = useRef(null);
    const instructorId = user?.id ?? 2;
    useEffect(() => {
        getInstructorCourses(instructorId).then(setCourses);
    }, [instructorId]);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showAddForm &&
                addFormRef.current &&
                !addFormRef.current.contains(e.target)) {
                setShowAddForm(false);
                setQuestionErrors({});
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAddForm]);
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
        setExamErrors(err);
        return Object.keys(err).length === 0;
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
        setQuestionErrors(err);
        return Object.keys(err).length === 0;
    };
    const handleAddQuestionToList = () => {
        setQuestionErrors({});
        if (!validateQuestionForm()) {
            showToast("Please fix the errors below", "error", "Validation");
            return;
        }
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
        setQuestions((prev) => [...prev, payload]);
        setQuestionForm(initialQuestionForm);
        setShowAddForm(false);
        setQuestionErrors({});
        showToast("Question added to exam", "success");
    };
    const handleRemoveQuestion = (index) => {
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
            if (!exam)
                throw new Error("Failed to create exam");
            for (const q of questions) {
                await addQuestion(Number(exam.id), q);
            }
            showToast("Exam created successfully", "success", "Created");
            navigate(`/instructor/examinations/${exam.id}/edit`);
        }
        catch {
            showToast("Failed to create exam", "error");
        }
        finally {
            setCreating(false);
        }
    };
    const handleAddChoice = () => {
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
    return (_jsxs("div", { className: "exam-edit-page", children: [_jsxs("header", { className: "exam-edit-header", children: [_jsx("button", { type: "button", className: "btn-back", onClick: () => navigate("/instructor/examinations"), children: "Back to Examinations" }), _jsx("h2", { className: "exam-preview-title", children: "Create Exam" })] }), _jsxs("section", { className: "exam-edit-form-section exam-details-section", children: [_jsx("h3", { className: "exam-edit-section-title", children: "Exam Details" }), _jsxs("div", { className: "exam-edit-form", children: [_jsxs("label", { children: ["Title", _jsx("input", { type: "text", value: form.title, onChange: (e) => {
                                            setForm((f) => ({ ...f, title: e.target.value }));
                                            if (examErrors.title)
                                                setExamErrors((e) => ({ ...e, title: "" }));
                                        }, className: `exam-edit-input ${examErrors.title ? "has-error" : ""}`, placeholder: "e.g. Midterm Exam" }), examErrors.title && (_jsx("span", { className: "field-error", children: examErrors.title }))] }), _jsxs("label", { children: ["Date", _jsx("input", { type: "text", value: form.date, onChange: (e) => {
                                            setForm((f) => ({ ...f, date: e.target.value }));
                                            if (examErrors.date)
                                                setExamErrors((e) => ({ ...e, date: "" }));
                                        }, className: `exam-edit-input ${examErrors.date ? "has-error" : ""}`, placeholder: "e.g. Feb 15, 2026 10:00 AM" }), examErrors.date && (_jsx("span", { className: "field-error", children: examErrors.date }))] }), _jsxs("label", { children: ["Duration (mins)", _jsx("input", { type: "number", min: 1, value: form.duration, onChange: (e) => {
                                            setForm((f) => ({
                                                ...f,
                                                duration: Number(e.target.value),
                                            }));
                                            if (examErrors.duration)
                                                setExamErrors((e) => ({ ...e, duration: "" }));
                                        }, className: `exam-edit-input ${examErrors.duration ? "has-error" : ""}` }), examErrors.duration && (_jsx("span", { className: "field-error", children: examErrors.duration }))] }), _jsxs("label", { children: ["Status", _jsxs("select", { value: form.status, onChange: (e) => setForm((f) => ({
                                            ...f,
                                            status: e.target.value,
                                        })), className: "exam-edit-input", children: [_jsx("option", { value: "upcoming", children: "Upcoming" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "completed", children: "Completed" })] })] }), _jsxs("label", { children: ["Course", _jsxs("select", { value: form.courseName, onChange: (e) => {
                                            setForm((f) => ({ ...f, courseName: e.target.value }));
                                            if (examErrors.courseName)
                                                setExamErrors((e) => ({ ...e, courseName: "" }));
                                        }, className: `exam-edit-input ${examErrors.courseName ? "has-error" : ""}`, children: [_jsx("option", { value: "", children: "Select course" }), courses.map((c) => (_jsx("option", { value: c.Course_Name, children: c.Course_Name }, c.Course_ID)))] }), examErrors.courseName && (_jsx("span", { className: "field-error", children: examErrors.courseName }))] })] })] }), _jsxs("section", { className: "exam-edit-questions-section", children: [_jsxs("div", { className: "exam-edit-questions-header", children: [_jsxs("h3", { className: "exam-edit-section-title", children: ["Questions (", questions.length, ")"] }), _jsx("button", { type: "button", className: "btn-primary", onClick: () => {
                                    setQuestionErrors({});
                                    setShowAddForm(true);
                                    setQuestionForm(initialQuestionForm);
                                }, children: "+ Add question" })] }), showAddForm && (_jsxs("div", { ref: addFormRef, className: "exam-edit-question-form-section exam-edit-question-form-inline exam-edit-question-form-slide", children: [_jsx("h3", { className: "exam-edit-section-title", children: "New question" }), _jsxs("div", { className: "exam-edit-question-form", children: [_jsxs("label", { children: ["Question text (min 10 characters)", _jsx("input", { type: "text", value: questionForm.text ?? "", onChange: (e) => {
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
                                                }, className: `exam-edit-input ${questionErrors.mark ? "has-error" : ""}` }), questionErrors.mark && (_jsx("span", { className: "field-error", children: questionErrors.mark }))] }), questionForm.type === "TF" && (_jsxs("label", { children: ["Correct answer", _jsxs("select", { value: questionForm.tf?.correctChoice ? "true" : "false", onChange: (e) => setQuestionForm((f) => ({
                                                    ...f,
                                                    tf: {
                                                        correctChoice: e.target.value === "true",
                                                    },
                                                })), className: "exam-edit-input", children: [_jsx("option", { value: "false", children: "False" }), _jsx("option", { value: "true", children: "True" })] })] })), questionForm.type === "MCQ" && questionForm.mcq && (_jsxs("div", { className: "exam-edit-mcq-choices", children: [questionErrors.choices && (_jsx("span", { className: "field-error", children: questionErrors.choices })), _jsxs("label", { className: "exam-edit-allow-multi", children: [_jsx("input", { type: "checkbox", checked: questionForm.mcq.allowMulti ?? false, onChange: (e) => setQuestionForm((f) => ({
                                                            ...f,
                                                            mcq: f.mcq
                                                                ? { ...f.mcq, allowMulti: e.target.checked }
                                                                : { allowMulti: e.target.checked, choices: [] },
                                                        })) }), "Allow multiple correct answers"] }), _jsx("span", { children: "Options (min 2, select correct)" }), (questionForm.mcq.choices ?? []).map((c, i) => (_jsxs("div", { className: "exam-edit-choice-row", children: [_jsx("input", { type: "text", value: c.text, onChange: (e) => handleChoiceTextChange(i, e.target.value), className: "exam-edit-input", placeholder: `Option ${i + 1}` }), _jsxs("label", { className: "exam-edit-correct-check", children: [_jsx("input", { type: questionForm.mcq?.allowMulti ? "checkbox" : "radio", name: questionForm.mcq?.allowMulti
                                                                    ? undefined
                                                                    : "correctMcq", checked: c.isCorrect, onChange: () => handleCorrectChoiceChange(i) }), "Correct"] })] }, i))), _jsx("button", { type: "button", className: "btn-secondary-small", onClick: handleAddChoice, children: "+ Add option" })] })), _jsxs("div", { className: "exam-edit-form-actions", children: [_jsx("button", { type: "button", className: "btn-primary", onClick: handleAddQuestionToList, disabled: addingQuestion, children: "Add to exam" }), _jsx("button", { type: "button", className: "btn-cancel", onClick: () => {
                                                    setQuestionErrors({});
                                                    setShowAddForm(false);
                                                }, children: "Cancel" })] })] })] })), _jsx("ul", { className: "exam-edit-questions-list", children: questions.map((q, index) => (_jsx("li", { className: "exam-edit-question-list-item", children: _jsxs("div", { className: "exam-edit-question-row", children: [_jsxs("span", { className: "exam-edit-question-number", children: ["#", index + 1] }), _jsxs("div", { className: "exam-edit-question-info", children: [_jsx("span", { className: "exam-edit-question-type", children: q.type }), _jsxs("span", { className: "exam-edit-question-mark", children: [q.mark, " pt"] }), _jsxs("span", { className: "exam-edit-question-text", children: [q.text.slice(0, 60), q.text.length > 60 ? "…" : ""] })] }), _jsx("button", { type: "button", className: "btn-delete", onClick: () => handleRemoveQuestion(index), children: "Remove" })] }) }, index))) }), questions.length === 0 && !showAddForm && (_jsx("p", { className: "text-muted", children: "No questions yet. Add at least one question above." }))] }), _jsxs("div", { className: "exam-edit-form-actions", style: { marginTop: 24 }, children: [_jsx("button", { type: "button", className: "btn-primary", onClick: handleCreateExam, disabled: creating, children: creating ? "Creating…" : "Create Exam" }), _jsx("button", { type: "button", className: "btn-cancel", onClick: () => navigate("/instructor/examinations"), children: "Cancel" })] })] }));
};
export default CreateExamPage;
