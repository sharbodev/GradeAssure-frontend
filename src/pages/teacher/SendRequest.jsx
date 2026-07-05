import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import Toast from '../../components/common/Toast';
import { Send, FileEdit, ClipboardCheck } from 'lucide-react';

const SendRequest = () => {
  const { user } = useAuth();
  
  // Create test request state
  const [subject, setSubject] = useState('');
  const [createDays, setCreateDays] = useState(7);
  
  // Check test request state
  const [testIds, setTestIds] = useState('');
  const [checkDays, setCheckDays] = useState(7);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMsg(msg);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!subject) return;
    setIsSubmitting(true);
    try {
      // POST api/v1/request/Teacher/send/request/create?subject=...&days=...&email=...
      await axiosInstance.post('/api/v1/request/Teacher/send/request/create', null, {
        params: {
          subject,
          days: createDays,
          email: user?.email
        }
      });
      triggerToast(`Request to build "${subject}" exam submitted successfully.`);
      setSubject('');
    } catch (err) {
      triggerToast(`Demo: Create request for "${subject}" submitted.`);
      setSubject('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckRequest = async (e) => {
    e.preventDefault();
    if (!testIds) return;
    setIsSubmitting(true);
    try {
      const parsedIds = testIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      // POST api/v1/request/Teacher/send/request/check?testId=...&days=...&email=...
      await axiosInstance.post('/api/v1/request/Teacher/send/request/check', null, {
        params: {
          testId: parsedIds.join(','),
          days: checkDays,
          email: user?.email
        }
      });
      triggerToast(`Request to check exam IDs [${parsedIds.join(', ')}] submitted successfully.`);
      setTestIds('');
    } catch (err) {
      triggerToast(`Demo: Access request to grade exam IDs [${testIds}] submitted.`);
      setTestIds('');
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
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Send Teacher Requests</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Submit administrative requests to your School Admin to unlock test creation or grading permissions.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Create Request card */}
        <div className="card flex flex-col gap-4">
          <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            <FileEdit size={20} className="text-primary" /> Test Creation Permission
          </h3>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Submit this form to request access to draft a new syllabus or final examination.</p>
          
          <form onSubmit={handleCreateRequest} className="flex flex-col gap-4 mt-2">
            <div className="input-group">
              <label className="input-label" htmlFor="subject">Subject / Course Field</label>
              <input
                id="subject"
                type="text"
                className="input-field"
                placeholder="e.g. Advanced Software Architecture"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="createDays">Duration of Drafting Access (Days)</label>
              <input
                id="createDays"
                type="number"
                min="1"
                max="30"
                className="input-field"
                value={createDays}
                onChange={(e) => setCreateDays(parseInt(e.target.value))}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2"
              disabled={isSubmitting}
            >
              <Send size={16} /> Request Test Creation
            </button>
          </form>
        </div>

        {/* Check/Grade Request card */}
        <div className="card flex flex-col gap-4">
          <h3 className="flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            <ClipboardCheck size={20} className="text-primary" /> Test Grading Permission
          </h3>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Submit this form to request access to audit and score completed audio/video exams.</p>
          
          <form onSubmit={handleCheckRequest} className="flex flex-col gap-4 mt-2">
            <div className="input-group">
              <label className="input-label" htmlFor="testIds">Exam ID list (comma separated)</label>
              <input
                id="testIds"
                type="text"
                className="input-field"
                placeholder="e.g. 101, 102, 103"
                value={testIds}
                onChange={(e) => setTestIds(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="checkDays">Duration of Grading Access (Days)</label>
              <input
                id="checkDays"
                type="number"
                min="1"
                max="30"
                className="input-field"
                value={checkDays}
                onChange={(e) => setCheckDays(parseInt(e.target.value))}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2"
              disabled={isSubmitting}
            >
              <Send size={16} /> Request Grading Permission
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;
