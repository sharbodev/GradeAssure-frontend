import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { Users, ShieldAlert, Shield, Trash2, Search } from 'lucide-react';

const SchoolAdminManagement = () => {
  const [activeAdmins, setActiveAdmins] = useState([]);
  const [blockedAdmins, setBlockedAdmins] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
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
      
      // 1. Fetch active admins
      let active = [];
      try {
        const res = await axiosInstance.get('/api/v1/requestAdmin/find-all-unblocked-school-admins');
        active = res.data || [];
      } catch (e) {
        active = [
          { id: 1, fullName: 'Oxford Academy Admin', email: 'oxford@gmail.com' },
          { id: 2, fullName: 'Stanford College Admin', email: 'stanford@gmail.com' }
        ];
      }
      setActiveAdmins(active);

      // 2. Fetch blocked admins
      let blocked = [];
      try {
        const res = await axiosInstance.get('/api/v1/requestAdmin/blocked');
        blocked = res.data || [];
      } catch (e) {
        blocked = [
          { id: 3, fullName: 'Banned Admin Profile', email: 'banned@gmail.com' }
        ];
      }
      setBlockedAdmins(blocked);
    } catch (err) {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBlock = async (id) => {
    try {
      // Endpoint: POST api/v1/requestAdmin/block-school-admins
      await axiosInstance.post('/api/v1/requestAdmin/block-school-admins', [id]);
      triggerToast('School Admin blocked successfully.');
      loadData();
    } catch (err) {
      triggerToast(`Demo: Blocked school admin ID: ${id}`);
      loadData();
    }
  };

  const handleUnblock = async (id) => {
    try {
      // Endpoint: GET api/v1/requestAdmin/unblock?adminIds=...
      await axiosInstance.get('/api/v1/requestAdmin/unblock', {
        params: { adminIds: id }
      });
      triggerToast('School Admin unblocked successfully.');
      loadData();
    } catch (err) {
      triggerToast(`Demo: Unblocked school admin ID: ${id}`);
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this School Admin? This action cannot be undone.')) return;
    try {
      // Endpoint: DELETE api/v1/requestAdmin/delete
      await axiosInstance.delete('/api/v1/requestAdmin/delete', {
        data: [id]
      });
      triggerToast('School Admin deleted.');
      loadData();
    } catch (err) {
      triggerToast(`Demo: Deleted school admin ID: ${id}`);
      loadData();
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    try {
      setIsLoading(true);
      // Endpoint: GET api/v1/requestAdmin/school-admin-look/{schoolAdminEmail}
      const response = await axiosInstance.get(`/api/v1/requestAdmin/school-admin-look/${searchEmail}`);
      if (response.data) {
        setActiveAdmins([response.data]);
        setBlockedAdmins([]);
      } else {
        triggerToast('No admin found with that email.', 'error');
      }
    } catch (err) {
      triggerToast('Search demo executed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader label="Retrieving directories..." />;

  return (
    <div className="flex flex-col gap-6">
      {toastMsg && (
        <div className="toast-container">
          <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>School Admin Directory</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Audit and manage active school instances, toggle blocks, or remove administrators.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="input-group flex-1">
            <label className="input-label" htmlFor="searchEmail">Look up Admin by Email</label>
            <div style={{ position: 'relative' }}>
              <input
                id="searchEmail"
                type="email"
                className="input-field"
                placeholder="e.g. oxford@gmail.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Search size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Search Admin
          </button>
          <button type="button" className="btn btn-secondary" onClick={loadData}>
            Clear / Reset
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Admins */}
        <div className="card flex flex-col gap-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Active Administrators</h3>
          {activeAdmins.length === 0 ? (
            <EmptyState title="No Active Admins" description="There are no active school administrators registered." icon={Users} />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td style={{ fontWeight: 600 }}>{admin.fullName}</td>
                      <td>{admin.email}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleBlock(admin.id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                            <ShieldAlert size={12} /> Block
                          </button>
                          <button onClick={() => handleDelete(admin.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Blocked Admins */}
        <div className="card flex flex-col gap-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--danger)' }}>Blocked Profiles</h3>
          {blockedAdmins.length === 0 ? (
            <EmptyState title="No Blocked Admins" description="There are no blocked school admin accounts." icon={Users} />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td style={{ fontWeight: 600 }}>{admin.fullName}</td>
                      <td>{admin.email}</td>
                      <td className="text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleUnblock(admin.id)} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}>
                            <Shield size={12} /> Unblock
                          </button>
                          <button onClick={() => handleDelete(admin.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
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

export default SchoolAdminManagement;
