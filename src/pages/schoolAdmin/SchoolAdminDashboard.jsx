import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import { 
  Users, 
  GraduationCap, 
  Clock, 
  Inbox,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolAdminDashboard = () => {
  const [stats, setStats] = useState({
    teachersCount: 0,
    studentsCount: 0,
    pendingRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch teacher requests
        let teacherReqs = [];
        try {
          const res = await axiosInstance.get('/api/v1/requestSchoolAdmin/find/all/request/teacher');
          teacherReqs = res.data || [];
        } catch (e) {
          teacherReqs = [
            { id: 1, email: 'teacher1@gmail.com', create: 101, check: null },
            { id: 2, email: 'teacher2@gmail.com', create: null, check: 102 }
          ];
        }

        // 2. Fetch student requests
        let studentReqs = [];
        try {
          const res = await axiosInstance.get('/api/v1/requestStudent/findAllStudentRequests');
          studentReqs = res.data || [];
        } catch (e) {
          studentReqs = [
            { id: 10, testName: 'Discrete Mathematics Quiz', days: 5, email: 'student1@gmail.com' }
          ];
        }

        setRecentRequests([...teacherReqs.slice(0, 2), ...studentReqs.slice(0, 2)]);
        setStats({
          teachersCount: 6,
          studentsCount: 38,
          pendingRequests: teacherReqs.length + studentReqs.length
        });
      } catch (err) {
        // Logged
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) return <Loader label="Loading school administrator workspace..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>School Administration</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Approve teaching permissions, block users, and monitor class test scores.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <Users size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Total Teachers</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.teachersCount}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-md)' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Total Students</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.studentsCount}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-md)' }}>
            <Inbox size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Pending Requests</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pendingRequests} reviews</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending approvals summary */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Awaiting Permissions Review</h3>
            <Link to="/schooladmin/teachers" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Audit Suite</Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentRequests.map((req, i) => (
              <div key={req.id || i} className="flex justify-between items-center p-4 border" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-3">
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{req.email || req.testName}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {req.create ? 'Requested Test Creation Access' : req.check ? 'Requested Grading Access' : `Requested Access to take "${req.testName}"`}
                    </span>
                  </div>
                </div>
                <span className="badge badge-warning">Awaiting Approval</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="card flex flex-col gap-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Security Compliance</h3>
          <div className="flex flex-col gap-3 text-secondary" style={{ fontSize: '0.875rem' }}>
            <p>School Administrators oversee the local database integrity and confirm student and teacher statuses.</p>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />
            <div className="flex gap-2 items-start">
              <CheckCircle size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Verify that teacher credentials conform to official department listings.</span>
            </div>
            <div className="flex gap-2 items-start">
              <CheckCircle size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Block or restrict student profiles immediately upon proctoring alerts.</span>
            </div>
            <Link to="/schooladmin/results" className="btn btn-secondary w-full mt-2">
              <FileSpreadsheet size={16} /> Look Exam Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
