import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import { 
  FileSpreadsheet, 
  PlusCircle, 
  ClipboardCheck, 
  Users, 
  ArrowUpRight, 
  Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    pendingGrading: 0,
    totalStudents: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherDashboard = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch tests created by this teacher
        let testsList = [];
        try {
          const res = await axiosInstance.get('/api/v1/test/teacher/find/all/test/for/teacher', {
            params: { email: user?.email }
          });
          testsList = res.data || [];
        } catch (e) {
          testsList = [
            { id: 1, testName: 'Algorithms & Data Structures Final', dateCreated: '2026-07-01T10:00:00', passed: 12 },
            { id: 2, testName: 'Java Spring Boot Mastery', dateCreated: '2026-07-03T12:00:00', passed: 4 }
          ];
        }

        setRecentTests(testsList);
        setStats({
          totalTests: testsList.length,
          pendingGrading: 3, // Mocked pending student submissions
          totalStudents: 16
        });
      } catch (err) {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherDashboard();
  }, [user]);

  if (isLoading) return <Loader label="Loading teacher workspace..." />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Teacher Workspace</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Design exams, review submissions, and manage proctoring points.</p>
        </div>
        <Link to="/teacher/tests/new" className="btn btn-primary">
          <PlusCircle size={16} /> Create New Exam
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Exams Created</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalTests}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-md)' }}>
            <ClipboardCheck size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Pending Reviews</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pendingGrading} submissions</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-md)' }}>
            <Users size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Assigned Students</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalStudents} profiles</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Exams created list */}
        <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Active Class Exams</h3>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Created Date</th>
                  <th>Submissions</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test) => (
                  <tr key={test.id}>
                    <td style={{ fontWeight: 600 }}>{test.testName}</td>
                    <td>{new Date(test.dateCreated).toLocaleDateString()}</td>
                    <td>{test.passed} taken</td>
                    <td className="text-right">
                      <Link to={`/teacher/results?name=${encodeURIComponent(test.testName)}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        View Grades <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proctoring details Card */}
        <div className="card flex flex-col gap-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Multimedia Grading</h3>
          <div className="flex flex-col gap-3 text-secondary" style={{ fontSize: '0.875rem' }}>
            <p>GradeAssure lets students submit recordings for proctored exams.</p>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />
            
            <div className="flex gap-2 items-start">
              <Activity size={16} className="text-warning" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Verify microphone recording waveforms for voice responses.</span>
            </div>
            
            <div className="flex gap-2 items-start">
              <Activity size={16} className="text-warning" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Review full-frame video stream submissions to check student environment.</span>
            </div>
            
            <Link to="/teacher/submissions" className="btn btn-primary w-full mt-2">
              <ClipboardCheck size={16} /> Open Grading Suite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
