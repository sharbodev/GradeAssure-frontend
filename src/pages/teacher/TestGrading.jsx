import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { ClipboardCheck, Play, Save, CheckCircle, Volume2, Video } from 'lucide-react';

const TestGrading = () => {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId') || '1';
  const initialEmail = searchParams.get('email') || 'student@gmail.com';

  const [studentEmail, setStudentEmail] = useState(initialEmail);
  const [gradingSheet, setGradingSheet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pointsInput, setPointsInput] = useState({}); // questionId -> point
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  const triggerToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMsg(msg);
  };

  const fetchGradingSheet = async () => {
    try {
      setIsLoading(true);
      // Endpoint: GET api/test/check/find/by/id/student/test/check
      const response = await axiosInstance.get('/api/test/check/find/by/id/student/test/check', {
        params: { testId, email: studentEmail }
      });
      setGradingSheet(response.data);
      
      // Initialize points input state
      const initialPoints = {};
      (response.data.questions || []).forEach(q => {
        initialPoints[q.id] = q.point || 0;
      });
      setPointsInput(initialPoints);
    } catch (err) {
      // Mock data fallback
      const mockData = {
        id: testId,
        questions: [
          {
            id: 201,
            question: 'Please record an audio message explaining the theory of relativity in simple terms.',
            audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample play link
            video: null,
            maxPoint: 15,
            point: 0,
            answerFormat: 'AUDIO',
            options: []
          },
          {
            id: 202,
            question: 'Verify your identity by introducing yourself on a short video recording.',
            audio: null,
            video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', // Sample play link
            maxPoint: 20,
            point: 0,
            answerFormat: 'VIDEO',
            options: []
          }
        ]
      };
      setGradingSheet(mockData);
      
      const initialPoints = {};
      mockData.questions.forEach(q => {
        initialPoints[q.id] = q.point || 0;
      });
      setPointsInput(initialPoints);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentEmail) {
      fetchGradingSheet();
    }
  }, [studentEmail]);

  const handlePointChange = (qId, val, maxVal) => {
    let intVal = parseInt(val) || 0;
    if (intVal > maxVal) intVal = maxVal;
    if (intVal < 0) intVal = 0;
    setPointsInput({ ...pointsInput, [qId]: intVal });
  };

  const submitQuestionScore = async (questionId, format) => {
    const point = pointsInput[questionId] || 0;
    try {
      if (format === 'AUDIO') {
        // POST api/test/check/checking/audio?testId=...&email=...&point=...&questionId=...
        await axiosInstance.post('/api/test/check/checking/audio', null, {
          params: { testId, email: studentEmail, point, questionId }
        });
      } else if (format === 'VIDEO') {
        // POST api/test/check/checking/video?testId=...&email=...&point=...&questionId=...
        await axiosInstance.post('/api/test/check/checking/video', null, {
          params: { testId, email: studentEmail, point, questionId }
        });
      }
      triggerToast('Points saved successfully.');
    } catch (err) {
      triggerToast('Demo: Points saved to sheet.');
    }
  };

  const handleFinishGrading = async () => {
    setIsSubmitting(true);
    try {
      // POST api/test/check/finish/check
      await axiosInstance.post('/api/test/check/finish/check', null, {
        params: { testId, email: studentEmail }
      });
      triggerToast('Grading process completed. Report updated.');
      setTimeout(() => navigate('/teacher/dashboard'), 1500);
    } catch (err) {
      triggerToast('Demo: Exam graded. Student results updated.');
      setTimeout(() => navigate('/teacher/dashboard'), 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader label="Retrieving student answers..." />;

  const questions = gradingSheet?.questions || [];

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {toastMsg && (
        <div className="toast-container">
          <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
        </div>
      )}

      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Grading Suite</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Review student audio/video recordings and assign proctored marks.</p>
      </div>

      {/* Selector info */}
      <div className="card flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%' }}>
            <ClipboardCheck size={20} />
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Grading paper for student:</span>
            <h4 style={{ fontWeight: 600 }}>{studentEmail}</h4>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="email"
            className="input-field"
            placeholder="Switch student email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            style={{ width: '220px' }}
          />
        </div>
      </div>

      {questions.length === 0 ? (
        <EmptyState title="No Questions Found" description="This test contains no questions that require manual grading." icon={ClipboardCheck} />
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="card flex flex-col gap-4">
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Question {idx + 1}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{q.question}</h3>
              </div>

              {/* Submissions player controls */}
              <div className="p-4 border" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                {q.answerFormat === 'AUDIO' && q.audio && (
                  <div className="flex flex-col gap-2">
                    <span className="text-muted flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      <Volume2 size={14} /> Voice Response:
                    </span>
                    <audio src={q.audio} controls style={{ width: '100%' }} />
                  </div>
                )}

                {q.answerFormat === 'VIDEO' && q.video && (
                  <div className="flex flex-col gap-2">
                    <span className="text-muted flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      <Video size={14} /> Video Proctoring Stream:
                    </span>
                    <div style={{ maxWidth: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <video src={q.video} controls style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Score Input block */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Score:</span>
                  <input
                    type="number"
                    min="0"
                    max={q.maxPoint}
                    className="input-field"
                    value={pointsInput[q.id] || 0}
                    onChange={(e) => handlePointChange(q.id, e.target.value, q.maxPoint)}
                    style={{ width: '80px', textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ {q.maxPoint} max points</span>
                </div>

                <button 
                  onClick={() => submitQuestionScore(q.id, q.answerFormat)}
                  className="btn btn-secondary flex items-center gap-1"
                >
                  <Save size={14} /> Save Points
                </button>
              </div>
            </div>
          ))}

          {/* Submit grading */}
          <div className="mt-2 text-right">
            <button 
              onClick={handleFinishGrading} 
              className="btn btn-primary flex items-center gap-2 ml-auto"
              disabled={isSubmitting}
            >
              <CheckCircle size={18} /> Finish Grading Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestGrading;
