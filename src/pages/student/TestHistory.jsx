import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileSpreadsheet, Eye, Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TestHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // Endpoint: GET api/v1/testStudent/find/all/test?email=...
        const response = await axiosInstance.get('/api/v1/testStudent/find/all/test', {
          params: { email: user?.email }
        });
        setHistory(response.data || []);
      } catch (err) {
        // Fallback mock history data
        setHistory([
          { id: 10, testName: 'Algorithms & Data Structures Final', datePassing: '2026-07-02T11:20:00', passed: 85 },
          { id: 11, testName: 'Introduction to Software Engineering', datePassing: '2026-06-15T09:45:00', passed: 90 },
          { id: 12, testName: 'Discrete Mathematics Quiz', datePassing: '2026-06-22T14:15:00', passed: 45 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const viewPdfReport = (testName) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const url = `${API_BASE_URL}/api/v1/reports/look/pdf?testName=${encodeURIComponent(testName)}&email=${encodeURIComponent(user?.email)}`;
    setPdfUrl(url);
  };

  const downloadPdfReport = (testName) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.open(`${API_BASE_URL}/api/v1/reports/download/pdf?testName=${encodeURIComponent(testName)}&email=${encodeURIComponent(user?.email)}`, '_blank');
  };

  if (isLoading) return <Loader label="Loading exam logs..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Test Logs & History</h1>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>View your completed exam records, grades, and export official reports.</p>
      </div>

      {history.length === 0 ? (
        <EmptyState title="No Past Exams" description="You have not completed any exams yet." icon={FileText} />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* List section */}
          <div className="card flex flex-col gap-4" style={{ gridColumn: pdfUrl ? 'span 1' : 'span 3' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Completed Tests</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Exam Name</th>
                    <th>Date Taken</th>
                    <th>Result / Grade</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const isPassed = item.passed >= 60; // Assume 60% passing grade
                    return (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.testName}</td>
                        <td>{new Date(item.datePassing).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 700, color: isPassed ? 'var(--success)' : 'var(--danger)' }}>
                          {item.passed} / 100
                        </td>
                        <td>
                          <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
                            {isPassed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => viewPdfReport(item.testName)} 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              <Eye size={12} /> View
                            </button>
                            <button 
                              onClick={() => downloadPdfReport(item.testName)} 
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              <Download size={12} /> PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PDF Preview Frame panel */}
          {pdfUrl && (
            <div className="card flex flex-col gap-4" style={{ gridColumn: 'span 2' }}>
              <div className="flex justify-between items-center">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Official Report PDF</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setPdfUrl(null)}>Close Preview</button>
              </div>
              <div style={{ width: '100%', height: '500px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe 
                  src={pdfUrl} 
                  title="PDF Report Viewer" 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestHistory;
