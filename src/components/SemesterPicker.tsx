import React from 'react';
import { Calendar } from 'lucide-react';
import { generateAvailableSemesters, formatSemester } from '../utils/semester';

interface SemesterPickerProps {
  value: string;
  onChange: (semester: string) => void;
  placeholder?: string;
  className?: string;
}

export const SemesterPicker: React.FC<SemesterPickerProps> = ({
  value,
  onChange,
  placeholder = '请选择修读学期',
  className = '',
}) => {
  const semesters = generateAvailableSemesters();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-left transition-all duration-200 ${
          value
            ? 'border-gray-300 text-gray-900'
            : 'border-gray-200 text-gray-500'
        } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-300`}
      >
        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <span className="flex-1">
          {value ? formatSemester(value) : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto animate-fade-in-up">
          {semesters.map((semester) => (
            <button
              key={semester}
              type="button"
              onClick={() => {
                onChange(semester);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
                value === semester
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{formatSemester(semester)}</span>
                {value === semester && (
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
