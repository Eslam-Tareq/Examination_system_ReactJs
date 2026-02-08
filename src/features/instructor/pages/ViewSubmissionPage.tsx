import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { submissionService, SubmissionDetail } from "@/services/submissions";
// import { QuestionResultCard } from "../components/submissions/QuestionResultCard"; // To be created
// import { ScoreSummary } from "../components/submissions/ScoreSummary"; // To be created

export const ViewSubmissionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await submissionService.getSubmissionWithAnswers(parseInt(id));
        setSubmission(data);
      } catch (err) {
        console.error("Failed to load submission details", err);
        setError("Failed to load submission details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading submission details...</div>;
  }

  if (error || !submission) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">{error || "Submission not found"}</div>
        <button 
          onClick={() => navigate("/instructor/submissions")}
          className="px-4 py-2 bg-bg-secondary text-white rounded-lg hover:bg-bg-tertiary"
        >
          Back to Submissions
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <button 
          onClick={() => navigate("/instructor/submissions")}
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors self-start"
        >
          <ArrowLeft size={20} />
          <span>Back to Submissions</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            <span className="text-accent-primary">{submission.Course_Name}</span>
            <span className="mx-2 text-text-secondary">-</span>
            {submission.Exam_Title}
          </h1>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Info */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-white/5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="text-accent-secondary" size={20} />
            STUDENT INFO
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Name</span>
              <span className="text-white font-medium">{submission.Student_Name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">ID</span>
              <span className="text-white font-medium">{submission.Stud_ID}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Track</span>
              <span className="text-white font-medium">{submission.Track_Name}</span>
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="bg-bg-secondary p-6 rounded-xl border border-white/5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-accent-primary" size={20} />
            EXAM DETAILS
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Date Submitted</span>
              <span className="text-white font-medium">
                {new Date(submission.Submit_Date!).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Duration</span>
              <span className="text-white font-medium">
                {submission.Time_Taken_Minutes} / {submission.Exam_Duration_Minutes} mins
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Attempt</span>
              <span className="text-white font-medium">
                {submission.Attempt_No} / {submission.Max_Attempt}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-bg-secondary p-8 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           {/* Grade Circle would go here */}
           <div 
            className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-bg-primary shadow-lg"
            style={{ 
              borderColor: submission.Grade! >= 90 ? 'var(--success)' :
                          submission.Grade! >= 80 ? 'var(--accent-primary)' :
                          submission.Grade! >= 60 ? '#f59e0b' : 'var(--danger)',
              color: submission.Grade! >= 90 ? 'var(--success)' :
                     submission.Grade! >= 80 ? 'var(--accent-primary)' :
                     submission.Grade! >= 60 ? '#f59e0b' : 'var(--danger)'
            }}
           >
             <span className="text-2xl font-bold">{submission.Grade}%</span>
             <span className="text-xs text-text-secondary uppercase">Grade</span>
           </div>
           
           <div>
             <h2 className="text-xl font-bold text-white mb-2">Score Summary</h2>
             <div className="flex gap-4 text-sm">
               <div className="px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 flex items-center gap-1">
                 <CheckCircle size={14} />
                 <span>{submission.Correct_Answers} Correct</span>
               </div>
               <div className="px-3 py-1 rounded-full bg-danger/10 text-danger border border-danger/20 flex items-center gap-1">
                 <XCircle size={14} />
                 <span>{submission.Total_Questions - submission.Correct_Answers} Incorrect</span>
               </div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-center md:text-right">
          <div>
             <div className="text-text-secondary text-sm mb-1 uppercase tracking-wider">Points</div>
             <div className="text-2xl font-mono text-white">
               {submission.Points_Earned} <span className="text-text-secondary text-base">/ {submission.Total_Points}</span>
             </div>
          </div>
          <div>
             <div className="text-text-secondary text-sm mb-1 uppercase tracking-wider">Minutes</div>
             <div className="text-2xl font-mono text-white">
               {submission.Time_Taken_Minutes}
             </div>
          </div>
        </div>
      </div>

      {/* Question Review Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">
          Question Review
        </h2>
        
        {submission.Questions.map((question, index) => (
          <div 
            key={question.Ques_ID} 
            className="bg-bg-secondary p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white font-medium text-lg flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-bg-tertiary border border-white/10 text-accent-primary font-bold text-sm">
                  {index + 1}
                </span>
                <span className="pt-1">{question.Ques_Text}</span>
              </h3>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-mono text-text-secondary">{question.Ques_Mark} pts</span>
                {question.Is_Correct ? (
                  <CheckCircle className="text-success" size={24} />
                ) : (
                  <XCircle className="text-danger" size={24} />
                )}
              </div>
            </div>

            <div className="space-y-3 pl-8">
              {question.Ques_Type === "MCQ" && question.Choices?.map((choice) => {
                const isStudentChoice = question.Student_Answer === choice.Choice_No;
                const isCorrectChoice = choice.IsCorrect;
                
                let borderColor = "border-white/5";
                let bgColor = "bg-bg-tertiary";
                let icon = <div className="w-4 h-4 rounded-full border border-text-secondary" />;

                if (isCorrectChoice) {
                  borderColor = "border-success";
                  bgColor = "bg-success/5";
                  icon = <CheckCircle size={16} className="text-success" />;
                } else if (isStudentChoice && !isCorrectChoice) {
                  borderColor = "border-danger";
                  bgColor = "bg-danger/5";
                  icon = <XCircle size={16} className="text-danger" />;
                }

                return (
                  <div 
                    key={choice.Choice_No}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor} ${bgColor} transition-colors`}
                  >
                    {icon}
                    <span className={`text-sm ${isCorrectChoice ? "text-success font-medium" : isStudentChoice ? "text-danger" : "text-text-secondary"}`}>
                      {choice.Choice_Text}
                    </span>
                    {isCorrectChoice && <span className="ml-auto text-xs font-bold text-success uppercase tracking-wider">Correct</span>}
                    {isStudentChoice && !isCorrectChoice && <span className="ml-auto text-xs font-bold text-danger uppercase tracking-wider">Selected</span>}
                  </div>
                );
              })}

              {question.Ques_Type === "TF" && (
                <div className="flex gap-4">
                   {[true, false].map((val) => {
                     const isCorrect = question.Correct_Choice === val;
                     const isStudent = question.Student_Answer === val;
                     
                     let borderColor = "border-white/5";
                     let bgColor = "bg-bg-tertiary";
                     
                     if (isCorrect) {
                        borderColor = "border-success";
                        bgColor = "bg-success/5";
                     } else if (isStudent && !isCorrect) {
                        borderColor = "border-danger";
                        bgColor = "bg-danger/5";
                     }

                     return (
                       <div 
                         key={String(val)}
                         className={`flex-1 p-3 rounded-lg border ${borderColor} ${bgColor} text-center font-medium ${isCorrect ? 'text-success' : isStudent ? 'text-danger' : 'text-text-secondary'}`}
                       >
                         {val ? "True" : "False"}
                         {isCorrect && <span className="block text-xs uppercase mt-1">Correct</span>}
                         {isStudent && !isCorrect && <span className="block text-xs uppercase mt-1">Student Answer</span>}
                       </div>
                     )
                   })}
                </div>
              )}
            </div>
            
            {!question.Is_Correct && (
               <div className="mt-4 pt-4 border-t border-white/5 pl-8">
                 <p className="text-sm text-danger font-medium flex items-center gap-2">
                   <XCircle size={14} />
                   Student Answer: <span className="capitalize">{
                     question.Ques_Type === 'TF' 
                       ? (question.Student_Answer ? "True" : "False")
                       : String(question.Student_Answer) // Should probably map back to text for MCQ if not showing all options, but we show options above
                   }</span>
                 </p>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
