import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { Users, Check, X, ShieldAlert, Shield } from 'lucide-react';

const TeacherManagement = () => {
  const [requests, setRequests] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMsg(msg);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch teacher requests
      let reqs = [];
      try {
        const res = await axiosInstance.get('/api/v1/requestSchoolAdmin/find/all/request/teacher');
        reqs = res.data || [];
      } catch (e) {
        reqs = [
          { id: 1, email: 'teacher_smith@gmail.com', create: 101, check: null },
          { id: 2, email: 'teacher_jones@gmail.com', create: null, check: 102 }
        ];
      }
      setRequests(reqs);

      // 2. Fetch all teachers (from schooladmin/find/all/teachers/users)
      let teachersList = [];
      try {
        const res = await axiosInstance.get('/api/v1/schoolAdmin/find/all/teachers/users');
        teachersList = res.data || [];
      } catch (e) {
        teachersList = [
          { id: 201, fullName: 'Professor Smith', email: 'teacher_smith@gmail.com', blocked: false },
          { id: 202, fullName: 'Doctor Jones', email: 'teacher_jones@gmail.com', blocked: true }
        ];
      }
      setTeachers(teachersList);
    } catch (err) {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Endpoint: POST api/v1/requestSchoolAdmin/allow/request/teacher?id=...
      await axiosInstance.post('/api/v1/requestSchoolAdmin/allow/request/teacher', null, {
        params: { id }
      });
      triggerToast('Teacher request approved.');
      loadData();
    } catch (err) {
      triggerToast('Demo Action: Teacher request approved.');
      loadData();
    }
  };

  const handleReject = async (id) => {
    try {
      // Endpoint: POST api/v1/requestSchoolAdmin/refuse/request/teacher?ids=...
      await axiosInstance.post('/api/v1/requestSchoolAdmin/refuse/request/teacher', null, {
        params: { ids: id }
      });
      triggerToast('Teacher request refused.');
      loadData();
    } catch (err) {
      triggerToast('Demo Action: Teacher request refused.');
      loadData();
    }
  };

  const handleBlockToggle = async (teacherId, currentlyBlocked) => {
    try {
      if (currentlyBlocked) {
        // Unblock endpoint: GET api/v1/requestSchoolAdmin/unblock/teacher?teacherIds=...
        await axiosInstance.get('/api/v1/requestSchoolAdmin/unblock/teacher', {
          params: { teacherIds: teacherId }
        });
        triggerToast('Teacher profile unblocked.');
      } else {
        // Block endpoint: PUT api/v1/requestSchoolAdmin/block/teacher?teacherId=...
        await axiosInstance.put('/api/v1/requestSchoolAdmin/block/teacher', null, {
          params: { teacherId }
        });
        triggerToast('Teacher profile blocked.');
      }
      loadData();
    } catch (err) {
      triggerToast(`Demo: Block status updated for teacher ID: ${teacherId}`);
      loadData();
    }
  };

  if (isLoading) return <Loader label="Retrieving teachers..." />;

  return (
    <div className="flex flex-col gap-6">
      {toastMsg && (
        <div className="toast-container">
          <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
        </div>
      )}

      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Teacher Profiles & Requests</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Authorize teaching credentials, audit exams permissions, and toggle access.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending Requests Column */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Teaching Requests</h3>
          {requests.length === 0 ? (
            <EmptyState title="All caught up!" description="No pending teacher requests." icon={Users} />
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 border flex flex-col gap-3" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{req.email}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {req.create ? 'Wants creation authority' : 'Wants grading authority'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(req.id)} className="btn btn-primary btn-sm flex-1" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                      <Check size={12} /> Approve
                    </button>
                    <button onClick={() => handleReject(req.id)} className="btn btn-secondary btn-sm flex-1" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                      <X size={12} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Teachers Column */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Teacher Directory</h3>
          {teachers.length === 0 ? (
            <EmptyState title="No Teachers Found" description="There are no registered teachers." icon={Users} />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Email Address</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.fullName}</td>
                      <td>{t.email}</td>
                      <td>
                        <span className={`badge ${t.blocked ? 'badge-danger' : 'badge-success'}`}>
                          {t.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button 
                          onClick={() => handleBlockToggle(t.id, t.blocked)}
                          className={`btn ${t.blocked ? 'btn-primary' : 'btn-danger'} btn-sm`}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          {t.blocked ? <Shield size={12} /> : <ShieldAlert size={12} />}
                          {t.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
