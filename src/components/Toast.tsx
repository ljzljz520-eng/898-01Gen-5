import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-danger-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-500/20';
      case 'error':
        return 'bg-danger-50 border-danger-500/20';
      case 'warning':
        return 'bg-amber-50 border-amber-500/20';
      default:
        return 'bg-primary-50 border-primary-500/20';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-fade-in-up ${getBgColor(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 text-sm font-medium text-gray-800">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
};
