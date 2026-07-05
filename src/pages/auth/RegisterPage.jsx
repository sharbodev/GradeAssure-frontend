import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, User, GraduationCap, Users } from 'lucide-react';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleRequest, setRoleRequest] = useState('STUDENT');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val) => {
    return val.endsWith('@gmail.com');
  };

  const validatePassword = (val) => {
    if (val.length <= 6) return false;
    const hasUppercase = /[A-Z]/.test(val);
    const hasDigit = /[0-9]/.test(val);
    return hasUppercase && hasDigit;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email must end with @gmail.com');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be longer than 6 characters, contain at least one uppercase letter and one digit.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await register({
      fullName,
      email,
      password,
      roleRequest
    });

    setIsSubmitting(false);

    if (result.success) {
      const redirectMap = {
        'ADMIN': '/admin/dashboard',
        'ADMINSCHOOL': '/schooladmin/dashboard',
        'TEACHER': '/teacher/dashboard',
        'STUDENT': '/student/dashboard',
      };
      navigate(redirectMap[result.role] || '/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex justify-center mb-2">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Register a new GradeAssure portal account</p>
        </div>

        {error && (
          <div className="badge badge-danger text-center w-full p-2" style={{ borderRadius: 'var(--radius-md)', textTransform: 'none', letterSpacing: 'normal' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="fullName"
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <User size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="john@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="At least 6 chars, 1 uppercase, 1 digit"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Lock size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Select Your Role</label>
            <div className="role-selector-grid">
              <div 
                className={`role-option-card ${roleRequest === 'STUDENT' ? 'selected' : ''}`}
                onClick={() => setRoleRequest('STUDENT')}
              >
                <GraduationCap className="role-icon" />
                <span className="role-label">Student</span>
              </div>
              <div 
                className={`role-option-card ${roleRequest === 'TEACHER' ? 'selected' : ''}`}
                onClick={() => setRoleRequest('TEACHER')}
              >
                <Users className="role-icon" />
                <span className="role-label">Teacher</span>
              </div>
              <div 
                className={`role-option-card ${roleRequest === 'ADMINSCHOOL' ? 'selected' : ''}`}
                onClick={() => setRoleRequest('ADMINSCHOOL')}
              >
                <ShieldCheck className="role-icon" />
                <span className="role-label">School Admin</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
