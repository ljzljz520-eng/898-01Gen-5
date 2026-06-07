import { Course, CourseWithStats, FilterOptions } from '../types';
import { mockCourses } from '../data/courses';
import { mockReviews } from '../data/reviews';
import { aggregateReviews } from '../utils/rating';
import {
  getCoursesFromStorage,
  setCoursesToStorage,
  getReviewsFromStorage,
  setReviewsToStorage,
  isDataInitialized,
  markDataInitialized,
} from '../utils/storage';

export function initializeData(): void {
  if (!isDataInitialized()) {
    setCoursesToStorage(mockCourses);
    setReviewsToStorage(mockReviews);
    markDataInitialized();
  }
}

export function getAllCourses(): Course[] {
  initializeData();
  return getCoursesFromStorage() || mockCourses;
}

export function getCourseById(courseId: string): Course | undefined {
  const courses = getAllCourses();
  return courses.find(c => c.id === courseId);
}

export function getCourseWithStats(courseId: string): CourseWithStats | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  
  const reviews = getReviewsFromStorage() || mockReviews;
  const courseReviews = reviews.filter(
    (r: { courseId: string; status: string }) => r.courseId === courseId && r.status === 'approved'
  );
  
  const stats = aggregateReviews(courseReviews);
  
  return {
    ...course,
    ...stats,
    reviews: courseReviews,
  };
}

export function getAllCoursesWithStats(): CourseWithStats[] {
  const courses = getAllCourses();
  const reviews = getReviewsFromStorage() || mockReviews;
  
  return courses.map(course => {
    const courseReviews = reviews.filter(
      (r: { courseId: string; status: string }) => r.courseId === course.id && r.status === 'approved'
    );
    const stats = aggregateReviews(courseReviews);
    return {
      ...course,
      ...stats,
      reviews: courseReviews,
    };
  });
}

export function filterCourses(
  courses: CourseWithStats[],
  filters: FilterOptions
): CourseWithStats[] {
  let filtered = [...courses];
  
  if (filters.type !== 'all') {
    filtered = filtered.filter(c => c.type === filters.type);
  }
  
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.teacher.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query)
    );
  }
  
  switch (filters.sortBy) {
    case 'rating':
      filtered.sort((a, b) => b.avgOverall - a.avgOverall);
      break;
    case 'review_count':
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'latest':
      filtered.sort((a, b) => b.latestSemester.localeCompare(a.latestSemester));
      break;
  }
  
  return filtered;
}

export function getCourseTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    major_required: '专业必修',
    general: '通识课',
    interdisciplinary: '跨院课',
  };
  return labels[type] || type;
}

export function getCourseTypeTagClass(type: string): string {
  const classes: Record<string, string> = {
    major_required: 'tag-major',
    general: 'tag-general',
    interdisciplinary: 'tag-interdisciplinary',
  };
  return classes[type] || '';
}

export function searchCourses(query: string): CourseWithStats[] {
  const allCourses = getAllCoursesWithStats();
  return filterCourses(allCourses, {
    type: 'all',
    sortBy: 'rating',
    searchQuery: query,
  });
}
