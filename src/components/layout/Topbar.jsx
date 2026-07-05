import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();
  
  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'System Admin';
      case 'ADMINSCHOOL': return 'School Admin';
      case 'TEACHER': return 'Teacher';
      case 'STUDENT': return 'Student';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'ADMINSCHOOL': return 'badge-warning';
      case 'TEACHER': return 'badge-info';
      case 'STUDENT': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">Overview</h2>
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="topbar-divider"></div>
        
        <div className="topbar-profile">
          <div className="profile-info text-right">
            <span className="profile-name">{user?.email?.split('@')[0]}</span>
            <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
              {getRoleLabel(user?.role)}
            </span>
          </div>
          <div className="profile-avatar">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
