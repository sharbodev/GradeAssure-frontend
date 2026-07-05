import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileSpreadsheet, Lock, Unlock, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AvailableTests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableTests = async () => {
      try {
        setIsLoading(true);
        // Endpoint: GET api/v1/testStudent/find/all/test/for/take
        const response = await axiosInstance.get('/api/v1/testStudent/find/all/test/for/take');
        setTests(response.data || []);
      } catch (err) {
        // Mock data fallback
        setTests([
          { id: 1, testName: 'Algorithms & Data Structures Final', dateCreated: '2026-07-01T10:00:00', access: true, passed: 0 },
          { id: 2, testName: 'Java Spring Boot Mastery', dateCreated: '2026-07-03T12:00:00', access: true, passed: 0 },
          { id: 3, testName: 'Database Management Systems mid-term', dateCreated: '2026-07-04T15:30:00', access: false, passed: 0 },
          { id: 4, testName: 'Computer Networks Quiz', dateCreated: '2026-07-05T09:00:00', access: false, passed: 0 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableTests();
  }, []);

  if (isLoading) return <Loader label="Loading available exams..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Available Exams</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Below are the exams assigned to you. Start or request access to locked ones.</p>
      </div>

      {tests.length === 0 ? (
        <EmptyState title="No Exams Available" description="There are currently no tests assigned to your profile." icon={FileSpreadsheet} />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="card flex flex-col justify-between gap-4">
              <div className="flex justify-between items-start">
                <div style={{ padding: '0.625rem', backgroundColor: test.access ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)', color: test.access ? 'var(--success)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)' }}>
                  {test.access ? <Unlock size={20} /> : <Lock size={20} />}
                </div>
                <span className={`badge ${test.access ? 'badge-success' : 'badge-danger'}`}>
                  {test.access ? 'Open' : 'Locked'}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{test.testName}</h3>
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  Assigned: {new Date(test.dateCreated).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-2">
                {test.access ? (
                  <Link 
                    to={`/student/tests/take?name=${encodeURIComponent(test.testName)}`} 
                    className="btn btn-primary w-full"
                  >
                    <Play size={16} style={{ fill: '#fff' }} /> Start Exam
                  </Link>
                ) : (
                  <Link 
                    to={`/student/requests?testName=${encodeURIComponent(test.testName)}`}
                    className="btn btn-secondary w-full"
                  >
                    Request Access <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableTests;
