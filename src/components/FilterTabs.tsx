import React from 'react';
import { CourseType } from '../types';

interface FilterTabsProps {
  activeType: CourseType | 'all';
  onChange: (type: CourseType | 'all') => void;
  className?: string;
}

const tabs: Array<{ key: CourseType | 'all'; label: string }> = [
  { key: 'all', label: '全部课程' },
  { key: 'major_required', label: '专业必修' },
  { key: 'general', label: '通识课' },
  { key: 'interdisciplinary', label: '跨院课' },
];

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeType,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 overflow-x-auto scrollbar-hide pb-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeType === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
