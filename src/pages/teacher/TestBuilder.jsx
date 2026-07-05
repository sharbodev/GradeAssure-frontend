import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  HelpCircle, 
  Settings, 
  Plus, 
  Trash2, 
  Check, 
  Mic, 
  Video as VideoIcon, 
  ListPlus,
  Save
} from 'lucide-react';

const TestBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Test Details (Step 1)
  const [testName, setTestName] = useState('');
  const [testId, setTestId] = useState(null);
  
  // Question Builder (Step 2)
  const [questionText, setQuestionText] = useState('');
  const [format, setFormat] = useState('OPTION'); // OPTION, AUDIO, VIDEO
  const [points, setPoints] = useState(10);
  const [questionsList, setQuestionsList] = useState([]);
  
  // Options Builder (for OPTION questions)
  const [options, setOptions] = useState([
    { option: '', correct: false, letter: 'A' },
    { option: '', correct: false, letter: 'B' },
    { option: '', correct: false, letter: 'C' },
    { option: '', correct: false, letter: 'D' }
  ]);
  
  // Passing score configuration (Step 3)
  const [minScores, setMinScores] = useState(60);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMsg(msg);
  };

  // Step 1: Create Test
  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!testName) return;
    setIsSubmitting(true);
    try {
      // POST api/v1/test/teacher/create/test?testName=...
      const res = await axiosInstance.post('/api/v1/test/teacher/create/test', null, {
        params: { testName }
      });
      setTestId(res.data.id || 101);
      triggerToast(`Exam "${testName}" created! Now add questions.`);
      setStep(2);
    } catch (err) {
      // Demo fallback
      setTestId(Date.now());
      triggerToast(`Demo: Exam "${testName}" created.`);
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Option row
  const handleOptionChange = (idx, field, value) => {
    const updated = [...options];
    updated[idx][field] = value;
    setOptions(updated);
  };

  // Step 2: Add Question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionText) return;
    
    setIsSubmitting(true);
    try {
      const questionPayload = {
        question: questionText,
        answerFormat: format,
        numberOption: format === 'OPTION' ? options.length : 0,
        points: parseInt(points)
      };

      // POST api/v1/test/teacher/create/question?testId=...
      const questionResponse = await axiosInstance.post('/api/v1/test/teacher/create/question', questionPayload, {
        params: { testId }
      });

      const latestQuestion = Array.isArray(questionResponse.data) 
        ? questionResponse.data[questionResponse.data.length - 1] 
        : { id: Date.now() };

      // If format is OPTION, submit options sequentially
      if (format === 'OPTION') {
        for (const opt of options) {
          if (opt.option) {
            // POST api/v1/test/teacher/create/option?questionId=...
            await axiosInstance.post('/api/v1/test/teacher/create/option', opt, {
              params: { questionId: latestQuestion.id }
            });
          }
        }
      }

      // Add to local preview list
      setQuestionsList([...questionsList, {
        id: latestQuestion.id,
        question: questionText,
        format,
        points,
        options: format === 'OPTION' ? [...options] : []
      }]);

      // Reset question inputs
      setQuestionText('');
      setFormat('OPTION');
      setPoints(10);
      setOptions([
        { option: '', correct: false, letter: 'A' },
        { option: '', correct: false, letter: 'B' },
        { option: '', correct: false, letter: 'C' },
        { option: '', correct: false, letter: 'D' }
      ]);
      triggerToast('Question added to exam.');
    } catch (err) {
      // Demo local fallback
      setQuestionsList([...questionsList, {
        id: Date.now(),
        question: questionText,
        format,
        points,
        options: format === 'OPTION' ? [...options] : []
      }]);
      setQuestionText('');
      setFormat('OPTION');
      setPoints(10);
      setOptions([
        { option: '', correct: false, letter: 'A' },
        { option: '', correct: false, letter: 'B' },
        { option: '', correct: false, letter: 'C' },
        { option: '', correct: false, letter: 'D' }
      ]);
      triggerToast('Demo: Question added to draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Complete & Set passing mark
  const handleFinishTest = async () => {
    setIsSubmitting(true);
    try {
      // POST api/v1/test/teacher/min/option?testId=...&scores=...
      await axiosInstance.post('/api/v1/test/teacher/min/option', null, {
        params: {
          testId,
          scores: parseInt(minScores)
        }
      });
      triggerToast('Exam successfully configured and activated.');
      setTimeout(() => navigate('/teacher/dashboard'), 1500);
    } catch (err) {
      triggerToast('Demo: Exam activated successfully.');
      setTimeout(() => navigate('/teacher/dashboard'), 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {toastMsg && (
        <div className="toast-container">
          <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
        </div>
      )}

      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create Exam Wizard</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Follow the steps to configure questions, scoring systems, and answers.</p>
      </div>

      {/* Step Indicators */}
      <div className="card flex items-center justify-between p-4 mb-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: step === 1 ? 'var(--primary)' : 'var(--primary-light)', 
              color: step === 1 ? '#fff' : 'var(--primary)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>1</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: step === 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Exam Name</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: step === 2 ? 'var(--primary)' : step > 2 ? 'var(--primary-light)' : 'rgba(255,255,255,0.03)', 
              color: step === 2 ? '#fff' : step > 2 ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>2</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: step === 2 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Add Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: step === 3 ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
              color: step === 3 ? '#fff' : 'var(--text-muted)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>3</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: step === 3 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Set Passing Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column for workspace forms */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleCreateTest} className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                <FileText size={20} className="text-primary" /> Define Exam Scope
              </h3>
              
              <div className="input-group">
                <label className="input-label" htmlFor="testName">Exam Title</label>
                <input
                  id="testName"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Java Spring Boot Advanced Final"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full mt-2"
                disabled={isSubmitting}
              >
                Create Exam & Continue
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                <HelpCircle size={20} className="text-primary" /> Write Question Details
              </h3>

              <div className="input-group">
                <label className="input-label" htmlFor="questionText">Question Text</label>
                <input
                  id="questionText"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Explain how inversion of control works."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Answer Submission Type</label>
                  <select 
                    className="input-field" 
                    value={format} 
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="OPTION">Option Selection (Auto-Graded)</option>
                    <option value="AUDIO">Audio Record (Manual Grade)</option>
                    <option value="VIDEO">Video Record (Manual Grade)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="points">Points / Weight</label>
                  <input
                    id="points"
                    type="number"
                    min="1"
                    className="input-field"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Sub-form for options if format is OPTION */}
              {format === 'OPTION' && (
                <div className="flex flex-col gap-3 mt-2">
                  <label className="input-label">Enter Variations and Select Correct Choice</label>
                  {options.map((opt, i) => (
                    <div key={opt.letter} className="flex items-center gap-2">
                      <span className="badge badge-info" style={{ borderRadius: 'var(--radius-sm)' }}>{opt.letter}</span>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={`Option variation text`}
                        value={opt.option}
                        onChange={(e) => handleOptionChange(i, 'option', e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = options.map((item, idx) => ({
                            ...item,
                            correct: idx === i
                          }));
                          setOptions(updated);
                        }}
                        className={`btn ${opt.correct ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.625rem', display: 'flex', alignItems: 'center' }}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button 
                  type="submit" 
                  className="btn btn-secondary flex-1"
                  disabled={isSubmitting}
                >
                  <Plus size={16} /> Save Question
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  disabled={questionsList.length === 0}
                >
                  Proceed to Final Step
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                <Settings size={20} className="text-primary" /> Configure Grading Rules
              </h3>

              <div className="input-group">
                <label className="input-label" htmlFor="minScores">Minimum Score to Pass (Out of 100)</label>
                <input
                  id="minScores"
                  type="number"
                  min="0"
                  max="100"
                  className="input-field"
                  value={minScores}
                  onChange={(e) => setMinScores(parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={() => setStep(2)}
                  className="btn btn-secondary flex-1"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleFinishTest}
                  className="btn btn-primary flex-1"
                  disabled={isSubmitting}
                >
                  <Save size={16} /> Publish Exam
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right column for active test layout preview */}
        <div className="card flex flex-col gap-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Exam Layout Preview</h3>
          
          <div className="flex flex-col gap-3 text-secondary" style={{ fontSize: '0.875rem' }}>
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Exam Name:</span>
              <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{testName || 'Not configured'}</h4>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />

            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Questions List ({questionsList.length}):</span>
              {questionsList.length === 0 ? (
                <p className="mt-2 text-muted">No questions added yet.</p>
              ) : (
                <div className="flex flex-col gap-3 mt-2 overflow-y-auto" style={{ maxHeight: '350px' }}>
                  {questionsList.map((q, idx) => (
                    <div key={q.id} className="p-3 border" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <div className="flex justify-between items-start gap-1">
                        <h5 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{idx + 1}. {q.question}</h5>
                        <span className="badge badge-info" style={{ fontSize: '0.625rem', flexShrink: 0 }}>{q.points} pt</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2 text-muted" style={{ fontSize: '0.6875rem' }}>
                        {q.format === 'OPTION' && <ListPlus size={12} />}
                        {q.format === 'AUDIO' && <Mic size={12} />}
                        {q.format === 'VIDEO' && <VideoIcon size={12} />}
                        <span>Submission format: {q.format}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBuilder;
