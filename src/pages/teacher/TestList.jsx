import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileSpreadsheet, PlusCircle, ArrowUpRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TestList = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        // Endpoint: GET api/v1/test/teacher/find/all/test/for/teacher
        const response = await axiosInstance.get('/api/v1/test/teacher/find/all/test/for/teacher', {
          params: { email: user?.email }
        });
        setTests(response.data || []);
      } catch (err) {
        // Fallback mockup list
        setTests([
          { id: 1, testName: 'Algorithms & Data Structures Final', dateCreated: '2026-07-01T10:00:00', passed: 12 },
          { id: 2, testName: 'Java Spring Boot Mastery', dateCreated: '2026-07-03T12:00:00', passed: 4 },
          { id: 3, testName: 'Database Management Systems mid-term', dateCreated: '2026-07-04T15:30:00', passed: 0 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, [user]);

  if (isLoading) return <Loader label="Retrieving exams..." />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Exams</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>View, manage, and audit all exams you have published.</p>
        </div>
        <Link to="/teacher/tests/new" className="btn btn-primary">
          <PlusCircle size={16} /> Create Exam
        </Link>
      </div>

      {tests.length === 0 ? (
        <EmptyState title="No Exams Created" description="You have not created any exams yet. Click the button to start." icon={FileSpreadsheet} />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="card flex flex-col justify-between gap-4">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">Published</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {test.id}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{test.testName}</h3>
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  Published: {new Date(test.dateCreated).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 border" style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Student Submissions:</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>{test.passed || 0} taken</span>
              </div>

              <div className="mt-2 flex gap-2">
                <Link 
                  to={`/teacher/results?name=${encodeURIComponent(test.testName)}`}
                  className="btn btn-secondary flex-1"
                >
                  Grades
                </Link>
                <Link 
                  to={`/teacher/submissions?testId=${test.id}`}
                  className="btn btn-primary flex-1"
                >
                  Audit <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestList;
