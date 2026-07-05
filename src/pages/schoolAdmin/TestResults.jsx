import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Search, Award, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TestResults = () => {
  const [testName, setTestName] = useState('Algorithms & Data Structures Final');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = async () => {
    if (!testName) return;
    try {
      setIsLoading(true);
      // Endpoint: GET api/v1/schoolAdmin/find/all/test/students?testName=...
      const response = await axiosInstance.get('/api/v1/schoolAdmin/find/all/test/students', {
        params: { testName }
      });
      setResults(response.data || []);
    } catch (err) {
      // Mock data fallback
      setResults([
        { id: 10, fullName: 'Bob Student', datePassing: '2026-07-02T11:20:00', point: 85, maxPoint: 100, checked: true, status: 'YES' },
        { id: 11, fullName: 'Jane Student', datePassing: '2026-07-03T09:15:00', point: 92, maxPoint: 100, checked: true, status: 'YES' },
        { id: 12, fullName: 'John Doe', datePassing: '2026-07-04T12:00:00', point: 45, maxPoint: 100, checked: true, status: 'NO' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Global Exam Results</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Search exam titles to pull class statistics and review proctored scores.</p>
      </div>

      {/* Search form */}
      <div className="card">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
          <div className="input-group flex-1">
            <label className="input-label" htmlFor="searchTest">Exam Title / Subject Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="searchTest"
                type="text"
                className="input-field"
                placeholder="e.g. Algorithms & Data Structures Final"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Search size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            Pull Results
          </button>
        </form>
      </div>

      {isLoading ? (
        <Loader label={`Fetching results for "${testName}"...`} />
      ) : results.length === 0 ? (
        <EmptyState title="No Results Found" description={`We couldn't find any submissions for "${testName}".`} icon={Award} />
      ) : (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>Grades Sheet</h3>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Date Completed</th>
                  <th>Points Scored</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => {
                  const getStatusBadge = (status) => {
                    switch (status) {
                      case 'YES':
                        return <span className="badge badge-success">Passed</span>;
                      case 'NO':
                        return <span className="badge badge-danger">Failed</span>;
                      default:
                        return <span className="badge badge-warning">Grading</span>;
                    }
                  };

                  return (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 600 }}>{res.fullName}</td>
                      <td>{new Date(res.datePassing).toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: res.status === 'YES' ? 'var(--success)' : 'var(--danger)' }}>
                        {res.point} / {res.maxPoint}
                      </td>
                      <td>{getStatusBadge(res.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
