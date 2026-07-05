import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { Inbox, Check, X, ShieldAlert } from 'lucide-react';

const SchoolAdminRequests = () => {
  const [requests, setRequests] = useState([
    { id: 101, fullName: 'Oxford Academy Admin', email: 'oxford@gmail.com', days: 30 },
    { id: 102, fullName: 'Stanford College Admin', email: 'stanford@gmail.com', days: 30 }
  ]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMsg(msg);
  };

  const handleSelectToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      // Endpoint: POST api/v1/requestAdmin/approve-requests (accepts body List<Long>)
      await axiosInstance.post('/api/v1/requestAdmin/approve-requests', selectedIds);
      triggerToast(`Successfully approved ${selectedIds.length} school admin request(s).`);
      setRequests(requests.filter(req => !selectedIds.includes(req.id)));
      setSelectedIds([]);
    } catch (err) {
      triggerToast(`Demo: Approved requests for IDs [${selectedIds.join(', ')}].`);
      setRequests(requests.filter(req => !selectedIds.includes(req.id)));
      setSelectedIds([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      // Endpoint: POST api/v1/requestAdmin/reject-requests (accepts body List<Long>)
      await axiosInstance.post('/api/v1/requestAdmin/reject-requests', selectedIds);
      triggerToast(`Successfully rejected ${selectedIds.length} school admin request(s).`);
      setRequests(requests.filter(req => !selectedIds.includes(req.id)));
      setSelectedIds([]);
    } catch (err) {
      triggerToast(`Demo: Rejected requests for IDs [${selectedIds.join(', ')}].`);
      setRequests(requests.filter(req => !selectedIds.includes(req.id)));
      setSelectedIds([]);
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
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>School Admin Requests</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Manage administrative registration requests from departments and academic institutions.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No Pending Requests" description="All school admin requests have been processed." icon={Inbox} />
      ) : (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Registration Queue</h3>
            
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <button onClick={handleBulkApprove} className="btn btn-primary btn-sm" disabled={isSubmitting}>
                  <Check size={14} /> Approve Selected ({selectedIds.length})
                </button>
                <button onClick={handleBulkReject} className="btn btn-danger btn-sm" disabled={isSubmitting}>
                  <X size={14} /> Reject Selected ({selectedIds.length})
                </button>
              </div>
            )}
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox"
                      checked={selectedIds.length === requests.length}
                      onChange={() => {
                        if (selectedIds.length === requests.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(requests.map(r => r.id));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>Name / Institution</th>
                  <th>Email Address</th>
                  <th>Default Term</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(req.id)}
                        onChange={() => handleSelectToggle(req.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>{req.fullName}</td>
                    <td>{req.email}</td>
                    <td>{req.days} days</td>
                    <td>
                      <span className="badge badge-warning">Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdminRequests;
