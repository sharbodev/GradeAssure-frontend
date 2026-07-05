import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success" />;
      case 'error':
        return <AlertCircle size={18} className="text-danger" />;
      case 'warning':
        return <AlertCircle size={18} className="text-warning" />;
      default:
        return null;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      {getIcon()}
      <div style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{message}</div>
      <button 
        onClick={onClose} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
