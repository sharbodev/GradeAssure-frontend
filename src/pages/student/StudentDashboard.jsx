import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  Play, 
  ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    availableCount: 0,
    completedCount: 0,
    passingRate: '0%',
    daysLeft: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch available tests for take
        let availableResponse = [];
        try {
          const res = await axiosInstance.get('/api/v1/testStudent/find/all/test/for/take');
          availableResponse = res.data || [];
        } catch (e) {
          // Fallback mock data
          availableResponse = [
            { id: 1, testName: 'Algorithms & Data Structures Final', dateCreated: '2026-07-01T10:00:00', access: true, passed: 0 },
            { id: 2, testName: 'Java Spring Boot Mastery', dateCreated: '2026-07-03T12:00:00', access: true, passed: 0 },
            { id: 3, testName: 'Database Management Systems mid-term', dateCreated: '2026-07-04T15:30:00', access: false, passed: 0 }
          ];
        }

        // 2. Fetch past completed tests
        let historyResponse = [];
        try {
          const res = await axiosInstance.get(`/api/v1/testStudent/find/all/test`, {
            params: { email: user?.email }
          });
          historyResponse = res.data || [];
        } catch (e) {
          // Fallback mock data
          historyResponse = [
            { id: 10, testName: 'Introduction to Software Engineering', datePassing: '2026-06-15T09:00:00', passed: 85 },
            { id: 11, testName: 'Discrete Mathematics Quiz', datePassing: '2026-06-22T14:00:00', passed: 45 }
          ];
        }

        // 3. Fetch deadline days
        let deadlineDays = 5;
        try {
          const res = await axiosInstance.get('/api/v1/testStudent/get/day/deadline');
          deadlineDays = res.data;
        } catch (e) {
          deadlineDays = 6;
        }

        const completed = historyResponse.length;
        const passedTestsCount = historyResponse.filter(t => t.passed >= 60).length; // 60 min passing score
        const rate = completed > 0 ? `${Math.round((passedTestsCount / completed) * 100)}%` : '0%';

        setStats({
          availableCount: availableResponse.filter(t => t.access).length,
          completedCount: completed,
          passingRate: rate,
          daysLeft: deadlineDays
        });

        // Set recent tests (both available and completed mixed)
        setRecentTests(availableResponse.slice(0, 3));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) return <Loader label="Loading student dashboard..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Welcome back, Student!</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Here is your overview for today. Keep up the great work.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Available Exams</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.availableCount}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Completed Exams</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.completedCount}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Success Rate</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.passingRate}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block' }}>Days to Deadline</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.daysLeft} days</span>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-3 gap-6">
        {/* Available tests */}
        <div className="card grid-cols-2 flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
          <div className="flex justify-between items-center">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Active Tests & Assignments</h3>
            <Link to="/student/tests/available" style={{ fontSize: '0.875rem', fontWeight: 500 }}>View All</Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentTests.map((test) => (
              <div key={test.id} className="flex justify-between items-center p-4 border" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-3">
                  <div style={{ padding: '0.5rem', backgroundColor: test.access ? 'var(--primary-light)' : 'rgba(255,255,255,0.03)', color: test.access ? 'var(--primary)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)' }}>
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: test.access ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{test.testName}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Created: {new Date(test.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {test.access ? (
                  <Link to={`/student/tests/take?name=${encodeURIComponent(test.testName)}`} className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.875rem', fontSize: '0.75rem' }}>
                    <Play size={12} style={{ fill: '#fff' }} /> Start Test
                  </Link>
                ) : (
                  <div className="flex items-center gap-1 text-muted" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    <AlertCircle size={14} /> Locked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tip & System Status */}
        <div className="card flex flex-col gap-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Proctoring Guidelines</h3>
          <div className="flex flex-col gap-3 text-secondary" style={{ fontSize: '0.875rem' }}>
            <p>GradeAssure uses advanced audio and video analysis to guarantee clean test submission records.</p>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />
            <div className="flex gap-2 items-start">
              <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Ensure your web camera is active and clear when video questions are presented.</span>
            </div>
            <div className="flex gap-2 items-start">
              <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Speak clearly into your microphone when answering voice prompts.</span>
            </div>
            <div className="flex gap-2 items-start">
              <HelpCircle size={16} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Need access to locked exams? Send an access request via the left panel.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
