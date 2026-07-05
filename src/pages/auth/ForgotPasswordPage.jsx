import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { ShieldCheck, Mail, Lock, Key } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Send email, 2: Verify code, 3: Reset password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setIsSubmitting(true);
    try {
      // GET api/v1/auth/sendcode?email=...
      await axiosInstance.get('/api/v1/auth/sendcode', { params: { email } });
      setMessage('A verification code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code. Verify email exists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) return;
    setError('');
    setIsSubmitting(true);
    try {
      // GET api/v1/auth/changepassword?email=...&code=...
      await axiosInstance.get('/api/v1/auth/changepassword', { params: { email, code } });
      setMessage('Code verified. Set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length <= 6) {
      setError('Password must be longer than 6 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      // GET api/v1/auth/checkpassword?password1=...&password=...&email=...
      // Note: password1 is new password, password is confirm password, email is email
      await axiosInstance.get('/api/v1/auth/checkpassword', { 
        params: { 
          password1: password, 
          password: confirmPassword, 
          email 
        } 
      });
      setMessage('Password successfully changed. You can now login.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex justify-center mb-2">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Recover your GradeAssure portal access</p>
        </div>

        {error && (
          <div className="badge badge-danger text-center w-full p-2" style={{ borderRadius: 'var(--radius-md)', textTransform: 'none', letterSpacing: 'normal' }}>
            {error}
          </div>
        )}

        {message && (
          <div className="badge badge-success text-center w-full p-2" style={{ borderRadius: 'var(--radius-md)', textTransform: 'none', letterSpacing: 'normal' }}>
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="auth-form">
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
            <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="auth-form">
            <div className="input-group">
              <label className="input-label" htmlFor="code">Verification Code</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="code"
                  type="text"
                  className="input-field"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Key size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="input-group">
              <label className="input-label" htmlFor="password">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Lock size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <Lock size={16} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Remember your password? <Link to="/auth/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
