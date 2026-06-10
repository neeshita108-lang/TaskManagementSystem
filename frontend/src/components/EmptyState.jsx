import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({ title, message, onAction, actionLabel }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <ClipboardList className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title || 'No tasks found'}</h3>
      <p className="text-slate-500 max-w-xs mb-8">
        {message || "It looks like you haven't added any tasks yet. Start organizing your work today!"}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>{actionLabel || 'Create your first task'}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
