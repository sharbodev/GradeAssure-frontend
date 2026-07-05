import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleGuard from './components/layout/RoleGuard';
import PageLayout from './components/layout/PageLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableTests from './pages/student/AvailableTests';
import TakeTest from './pages/student/TakeTest';
import TestHistory from './pages/student/TestHistory';
import StudentSendRequest from './pages/student/SendRequest';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TestBuilder from './pages/teacher/TestBuilder';
import TestList from './pages/teacher/TestList';
import TestGrading from './pages/teacher/TestGrading';
import TestResultsView from './pages/teacher/TestResultsView';
import TeacherSendRequest from './pages/teacher/SendRequest';

// School Admin Pages
import SchoolAdminDashboard from './pages/schoolAdmin/SchoolAdminDashboard';
import TeacherManagement from './pages/schoolAdmin/TeacherManagement';
import StudentManagement from './pages/schoolAdmin/StudentManagement';
import SchoolAdminTestResults from './pages/schoolAdmin/TestResults';

// Super Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SchoolAdminRequests from './pages/admin/SchoolAdminRequests';
import SchoolAdminManagement from './pages/admin/SchoolAdminManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth Routes */}
          <Route path="/auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Routes by Role */}
          
          {/* 1. STUDENT ROUTE */}
          <Route element={<RoleGuard allowedRoles={['STUDENT']} />}>
            <Route element={<PageLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/tests/available" element={<AvailableTests />} />
              <Route path="/student/tests/take" element={<TakeTest />} />
              <Route path="/student/history" element={<TestHistory />} />
              <Route path="/student/requests" element={<StudentSendRequest />} />
            </Route>
          </Route>

          {/* 2. TEACHER ROUTE */}
          <Route element={<RoleGuard allowedRoles={['TEACHER']} />}>
            <Route element={<PageLayout />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/tests" element={<TestList />} />
              <Route path="/teacher/tests/new" element={<TestBuilder />} />
              <Route path="/teacher/submissions" element={<TestGrading />} />
              <Route path="/teacher/results" element={<TestResultsView />} />
              <Route path="/teacher/requests" element={<TeacherSendRequest />} />
            </Route>
          </Route>

          {/* 3. SCHOOL ADMIN ROUTE */}
          <Route element={<RoleGuard allowedRoles={['ADMINSCHOOL']} />}>
            <Route element={<PageLayout />}>
              <Route path="/schooladmin/dashboard" element={<SchoolAdminDashboard />} />
              <Route path="/schooladmin/teachers" element={<TeacherManagement />} />
              <Route path="/schooladmin/students" element={<StudentManagement />} />
              <Route path="/schooladmin/results" element={<SchoolAdminTestResults />} />
            </Route>
          </Route>

          {/* 4. SUPER ADMIN ROUTE */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route element={<PageLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<SchoolAdminRequests />} />
              <Route path="/admin/school-admins" element={<SchoolAdminManagement />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
