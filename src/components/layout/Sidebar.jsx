import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Users, 
  GraduationCap, 
  FileSpreadsheet, 
  PlusCircle, 
  ClipboardCheck, 
  Send, 
  History, 
  LogOut,
  ShieldCheck 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const renderNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Inbox size={20} />
              <span>Admin Requests</span>
            </NavLink>
            <NavLink to="/admin/school-admins" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>School Admins</span>
            </NavLink>
          </>
        );
      case 'ADMINSCHOOL':
        return (
          <>
            <NavLink to="/schooladmin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/schooladmin/teachers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Teachers</span>
            </NavLink>
            <NavLink to="/schooladmin/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={20} />
              <span>Students</span>
            </NavLink>
            <NavLink to="/schooladmin/results" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={20} />
              <span>Exam Results</span>
            </NavLink>
          </>
        );
      case 'TEACHER':
        return (
          <>
            <NavLink to="/teacher/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/teacher/tests" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={20} />
              <span>My Tests</span>
            </NavLink>
            <NavLink to="/teacher/tests/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <PlusCircle size={20} />
              <span>Create Test</span>
            </NavLink>
            <NavLink to="/teacher/submissions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <ClipboardCheck size={20} />
              <span>Grade Exams</span>
            </NavLink>
            <NavLink to="/teacher/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Send size={20} />
              <span>Send Requests</span>
            </NavLink>
          </>
        );
      case 'STUDENT':
        return (
          <>
            <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/student/tests/available" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={20} />
              <span>Available Tests</span>
            </NavLink>
            <NavLink to="/student/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <History size={20} />
              <span>Test History</span>
            </NavLink>
            <NavLink to="/student/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Send size={20} />
              <span>Access Requests</span>
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <ShieldCheck size={26} className="text-primary" />
        <span className="brand-text">GradeAssure</span>
      </div>
      
      <nav className="sidebar-nav">
        {renderNavLinks()}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="btn-logout">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
