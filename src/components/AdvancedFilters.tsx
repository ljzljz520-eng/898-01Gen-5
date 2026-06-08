import React, { useState, useMemo } from 'react';
import { Filter, X, User, BookOpen, FileText, RotateCcw } from 'lucide-react';
import { getAllTeachers } from '../services/courseService';

interface AdvancedFiltersProps {
  teacher: string;
  workload: 'all' | 'low' | 'medium' | 'high';
  examMethod: 'all' | 'easy' | 'medium' | 'hard';
  onTeacherChange: (teacher: string) => void;
  onWorkloadChange: (workload: 'all' | 'low' | 'medium' | 'high') => void;
  onExamMethodChange: (examMethod: 'all' | 'easy' | 'medium' | 'hard') => void;
  onReset: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  teacher,
  workload,
  examMethod,
  onTeacherChange,
  onWorkloadChange,
  onExamMethodChange,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const teachers = useMemo(() => getAllTeachers(), []);

  const hasActiveFilters = teacher || workload !== 'all' || examMethod !== 'all';

  const workloadOptions = [
    { value: 'all', label: '全部' },
    { value: 'low', label: '轻松 (≤2分)' },
    { value: 'medium', label: '适中 (2-4分)' },
    { value: 'high', label: '繁重 (>4分)' },
  ];

  const examMethodOptions = [
    { value: 'all', label: '全部' },
    { value: 'easy', label: '简单 (≤2分)' },
    { value: 'medium', label: '适中 (2-4分)' },
    { value: 'hard', label: '困难 (>4分)' },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          高级筛选
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
              {(teacher ? 1 : 0) + (workload !== 'all' ? 1 : 0) + (examMethod !== 'all' ? 1 : 0)}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-primary-600 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            重置筛选
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                授课老师
              </label>
              <select
                value={teacher}
                onChange={(e) => onTeacherChange(e.target.value)}
                className="input-field w-full"
              >
                <option value="">全部老师</option>
                {teachers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {teacher && (
                <button
                  onClick={() => onTeacherChange('')}
                  className="mt-2 text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  清除选择
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                作业量
              </label>
              <div className="flex flex-wrap gap-2">
                {workloadOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onWorkloadChange(option.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      workload === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                考核方式难度
              </label>
              <div className="flex flex-wrap gap-2">
                {examMethodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onExamMethodChange(option.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      examMethod === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                当前筛选：
                {teacher && <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">老师：{teacher} <X onClick={() => onTeacherChange('')} className="w-3 h-3 cursor-pointer" /></span>}
                {workload !== 'all' && <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-accent-100 text-accent-700 rounded-md text-xs">作业量：{workloadOptions.find(o => o.value === workload)?.label} <X onClick={() => onWorkloadChange('all')} className="w-3 h-3 cursor-pointer" /></span>}
                {examMethod !== 'all' && <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 rounded-md text-xs">考核难度：{examMethodOptions.find(o => o.value === examMethod)?.label} <X onClick={() => onExamMethodChange('all')} className="w-3 h-3 cursor-pointer" /></span>}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
