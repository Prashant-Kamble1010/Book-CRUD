import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />,
  };

  return (
    <div className={`toast-notification toast-${toast.type || 'info'}`}>
      {icons[toast.type] || icons.info}
      <span className="toast-message">{toast.message}</span>
      <button type="button" className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}
