import React from 'react';
import { Search, FileQuestion, AlertCircle, MessageSquare } from 'lucide-react';

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'error' | 'review' | 'default';
  action?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  title = '暂无内容',
  description = '这里什么都没有',
  icon = 'default',
  action,
  className = '',
}) => {
  const iconMap = {
    search: Search,
    error: AlertCircle,
    review: MessageSquare,
    default: FileQuestion,
  };

  const IconComponent = iconMap[icon];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <IconComponent className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
        {title}
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default Empty;
