import React from 'react';

const Loader = ({ label = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full mt-4" style={{ minHeight: '150px' }}>
      <div className="animate-pulse" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)', animationDelay: '0.2s' }}></div>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)', animationDelay: '0.4s' }}></div>
      </div>
      <div className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
    </div>
  );
};

export default Loader;
