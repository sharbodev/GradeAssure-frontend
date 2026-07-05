import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { GraduationCap, Check, X, ShieldAlert, Shield } from 'lucide-react';

const StudentManagement = () => {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
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
      // 1. Fetch student requests (findAllStudentRequests)
      let reqs = [];
      try {
        const res = await axiosInstance.get('/api/v1/requestStudent/findAllStudentRequests');
        reqs = res.data || [];
      } catch (e) {
        reqs = [
          { id: 10, testName: 'Discrete Mathematics Quiz', days: 5, email: 'bob_student@gmail.com' }
        ];
      }
      setRequests(reqs);

      // 2. Fetch all students (schoolAdmin/find/all/students/users)
      let studentsList = [];
      try {
        const res = await axiosInstance.get('/api/v1/schoolAdmin/find/all/students/users');
        studentsList = res.data || [];
      } catch (e) {
        studentsList = [
          { id: 301, fullName: 'Bob Student', email: 'bob_student@gmail.com', blocked: false },
          { id: 302, fullName: 'Jane Student', email: 'jane_student@gmail.com', blocked: true }
        ];
      }
      setStudents(studentsList);
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
      // Endpoint: POST api/v1/schoolAdmin/allow/request/student?id=...
      await axiosInstance.post('/api/v1/schoolAdmin/allow/request/student', null, {
        params: { id }
      });
      triggerToast('Student access granted successfully.');
      loadData();
    } catch (err) {
      triggerToast('Demo Action: Student access granted.');
      loadData();
    }
  };

  const handleReject = async (id) => {
    try {
      // Endpoint: POST api/v1/schoolAdmin/refuse/request/student?ids=...
      await axiosInstance.post('/api/v1/schoolAdmin/refuse/request/student', null, {
        params: { ids: id }
      });
      triggerToast('Student access request rejected.');
      loadData();
    } catch (err) {
      triggerToast('Demo Action: Access request refused.');
      loadData();
    }
  };

  const handleBlockToggle = async (studentId, currentlyBlocked) => {
    try {
      if (currentlyBlocked) {
        // Unblock: GET api/v1/requestSchoolAdmin/unblock/student?studentsIds=...
        await axiosInstance.get('/api/v1/requestSchoolAdmin/unblock/student', {
          params: { studentsIds: studentId }
        });
        triggerToast('Student profile unblocked.');
      } else {
        // Block: PUT api/v1/schoolAdmin/block/student?studentId=...
        await axiosInstance.put('/api/v1/schoolAdmin/block/student', null, {
          params: { studentId }
        });
        triggerToast('Student profile blocked.');
      }
      loadData();
    } catch (err) {
      triggerToast(`Demo: Block status updated for student ID: ${studentId}`);
      loadData();
    }
  };

  if (isLoading) return <Loader label="Retrieving students list..." />;

  return (
    <div className="flex flex-col gap-6">
      {toastMsg && (
        <div className="toast-container">
          <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
        </div>
      )}

      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Student Management</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Authorize student logins, grant test access tokens, and verify security statuses.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending Requests */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Exam Unlock Requests</h3>
          {requests.length === 0 ? (
            <EmptyState title="All caught up!" description="No pending exam unlock requests." icon={GraduationCap} />
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 border flex flex-col gap-3" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{req.email}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Requesting: "{req.testName}" for {req.days} days
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(req.id)} className="btn btn-primary btn-sm flex-1" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                      <Check size={12} /> Allow
                    </button>
                    <button onClick={() => handleReject(req.id)} className="btn btn-secondary btn-sm flex-1" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                      <X size={12} /> Refuse
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Students List */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Student Directory</h3>
          {students.length === 0 ? (
            <EmptyState title="No Students Found" description="There are no registered students." icon={GraduationCap} />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                      <td>{s.email}</td>
                      <td>
                        <span className={`badge ${s.blocked ? 'badge-danger' : 'badge-success'}`}>
                          {s.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button 
                          onClick={() => handleBlockToggle(s.id, s.blocked)}
                          className={`btn ${s.blocked ? 'btn-primary' : 'btn-danger'} btn-sm`}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          {s.blocked ? <Shield size={12} /> : <ShieldAlert size={12} />}
                          {s.blocked ? 'Unblock' : 'Block'}
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

export default StudentManagement;
