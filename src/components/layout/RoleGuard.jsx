import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 mt-4" style={{ minHeight: '60vh' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse text-primary" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Loading GradeAssure...
          </div>
          <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Verifying your credentials</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to default home page of their role if not authorized here
    const roleRedirects = {
      'ADMIN': '/admin/dashboard',
      'ADMINSCHOOL': '/schooladmin/dashboard',
      'TEACHER': '/teacher/dashboard',
      'STUDENT': '/student/dashboard',
    };
    return <Navigate to={roleRedirects[user.role] || '/auth/login'} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
