import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = 'There is nothing to display here yet.', icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center card mt-4" style={{ minHeight: '250px' }}>
      <div style={{ 
        width: '56px', 
        height: '56px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(255,255,255,0.03)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '1rem',
        border: '1px solid var(--border)'
      }}>
        <Icon size={24} className="text-muted" />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h4>
      <p className="text-secondary" style={{ fontSize: '0.875rem', maxWidth: '300px' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
