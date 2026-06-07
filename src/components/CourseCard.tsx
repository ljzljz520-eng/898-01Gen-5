import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock } from 'lucide-react';
import { CourseWithStats } from '../types';
import { RatingStars } from './RatingStars';
import { getCourseTypeLabel, getCourseTypeTagClass } from '../services/courseService';
import { getSemesterDisplay, isOldSemester, getSemesterWarning } from '../utils/semester';
import { getRatingLabel, getRatingColor } from '../utils/rating';

interface CourseCardProps {
  course: CourseWithStats;
  index?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0 }) => {
  const hasOldReviews = course.latestSemester && isOldSemester(course.latestSemester);
  const warning = course.latestSemester ? getSemesterWarning(course.latestSemester) : null;
  
  const animationDelay = `${index * 0.1}s`;

  return (
    <Link
      to={`/course/${course.id}`}
      className="block opacity-0 animate-fade-in-up card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-primary-200"
      style={{ animationDelay }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`tag ${getCourseTypeTagClass(course.type)}`}>
                {getCourseTypeLabel(course.type)}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {course.code}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif truncate">
              {course.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.teacher}
            </p>
          </div>
          
          <div className="flex flex-col items-center ml-4">
            <div className={`text-3xl font-bold font-serif ${getRatingColor(course.avgOverall)}`}>
              {course.avgOverall.toFixed(1)}
            </div>
            <RatingStars rating={course.avgOverall} size="sm" />
            <span className={`text-xs mt-1 font-medium ${getRatingColor(course.avgOverall)}`}>
              {getRatingLabel(course.avgOverall)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span>{course.credits} 学分</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{course.department}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {course.reviewCount} 条评价
            </span>
          </div>
          
          {course.latestSemester && (
            <div className="flex items-center gap-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                hasOldReviews ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {getSemesterDisplay(course.latestSemester)}
              </span>
              {hasOldReviews && warning && (
                <span className="text-xs text-amber-600 hidden sm:inline">
                  可能过时
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
