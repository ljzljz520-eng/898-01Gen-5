import { Review, ReviewFormData } from '../types';
import { mockReviews } from '../data/reviews';
import {
  getReviewsFromStorage,
  setReviewsToStorage,
} from '../utils/storage';
import { reviewContent } from './contentReviewService';

export function generateReviewId(): string {
  return `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getAllReviews(): Review[] {
  return getReviewsFromStorage() || mockReviews;
}

export function getReviewsByCourseId(courseId: string): Review[] {
  const reviews = getAllReviews();
  return reviews
    .filter(r => r.courseId === courseId && r.status === 'approved')
    .sort((a, b) => b.semester.localeCompare(a.semester) || 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReviewsByCourseAndSemester(
  courseId: string,
  semester: string
): Review[] {
  const reviews = getReviewsByCourseId(courseId);
  return reviews.filter(r => r.semester === semester);
}

export function getAvailableSemestersForCourse(courseId: string): string[] {
  const reviews = getReviewsByCourseId(courseId);
  const semesters = new Set(reviews.map(r => r.semester));
  return Array.from(semesters).sort((a, b) => b.localeCompare(a));
}

export async function submitReview(formData: ReviewFormData): Promise<{
  success: boolean;
  review?: Review;
  error?: string;
  warnings?: string[];
}> {
  const reviewResult = reviewContent(formData.content, formData.ratings);
  
  if (!reviewResult.passed) {
    return {
      success: false,
      error: reviewResult.blockedReasons[0] || '内容审核未通过',
      warnings: reviewResult.warnings,
    };
  }
  
  const newReview: Review = {
    id: generateReviewId(),
    courseId: formData.courseId,
    semester: formData.semester,
    difficulty: formData.ratings.difficulty,
    workload: formData.ratings.workload,
    examMethod: formData.ratings.examMethod,
    grading: formData.ratings.grading,
    content: formData.content,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
    status: reviewResult.warnings.length > 0 ? 'pending' : 'approved',
  };
  
  const reviews = getAllReviews();
  reviews.unshift(newReview);
  setReviewsToStorage(reviews);
  
  return {
    success: true,
    review: newReview,
    warnings: reviewResult.warnings,
  };
}

export function incrementHelpfulCount(reviewId: string): boolean {
  const reviews = getAllReviews();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex !== -1) {
    reviews[reviewIndex].helpfulCount++;
    setReviewsToStorage(reviews);
    return true;
  }
  
  return false;
}

export function reportReview(reviewId: string, reason: string): boolean {
  console.log(`Review ${reviewId} reported for: ${reason}`);
  return true;
}

export function getPendingReviews(): Review[] {
  const reviews = getAllReviews();
  return reviews
    .filter(r => r.status === 'pending')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getRejectedReviews(): Review[] {
  const reviews = getAllReviews();
  return reviews
    .filter(r => r.status === 'rejected')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function approveReview(reviewId: string): boolean {
  const reviews = getAllReviews();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex !== -1 && reviews[reviewIndex].status === 'pending') {
    reviews[reviewIndex].status = 'approved';
    setReviewsToStorage(reviews);
    return true;
  }
  
  return false;
}

export function rejectReview(reviewId: string, reason: string): boolean {
  const reviews = getAllReviews();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex !== -1) {
    reviews[reviewIndex].status = 'rejected';
    setReviewsToStorage(reviews);
    console.log(`Review ${reviewId} rejected for: ${reason}`);
    return true;
  }
  
  return false;
}

export function getReviewStats(): {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
} {
  const reviews = getAllReviews();
  return {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  };
}

export function getSemestersWithReviewCount(courseId: string): Array<{
  semester: string;
  count: number;
}> {
  const reviews = getReviewsByCourseId(courseId);
  const semesterMap = new Map<string, number>();
  
  reviews.forEach(r => {
    semesterMap.set(r.semester, (semesterMap.get(r.semester) || 0) + 1);
  });
  
  return Array.from(semesterMap.entries())
    .map(([semester, count]) => ({ semester, count }))
    .sort((a, b) => b.semester.localeCompare(a.semester));
}
