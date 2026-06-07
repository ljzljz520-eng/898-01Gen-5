export type CourseType = 'major_required' | 'general' | 'interdisciplinary';

export interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  type: CourseType;
  department: string;
  credits: number;
  description: string;
}

export interface Review {
  id: string;
  courseId: string;
  semester: string;
  difficulty: number;
  workload: number;
  examMethod: number;
  grading: number;
  content: string;
  createdAt: string;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CourseWithStats extends Course {
  avgDifficulty: number;
  avgWorkload: number;
  avgExamMethod: number;
  avgGrading: number;
  avgOverall: number;
  reviewCount: number;
  latestSemester: string;
  reviews: Review[];
}

export interface RatingDimensions {
  difficulty: number;
  workload: number;
  examMethod: number;
  grading: number;
}

export interface ContentReviewResult {
  passed: boolean;
  warnings: string[];
  blockedReasons: string[];
  detectedIssues: ContentIssue[];
}

export interface ContentIssue {
  type: 'sensitive_word' | 'exam_leak' | 'malicious_rating';
  severity: 'warning' | 'block';
  message: string;
  position?: { start: number; end: number };
}

export interface FilterOptions {
  type: CourseType | 'all';
  sortBy: 'rating' | 'review_count' | 'latest';
  searchQuery: string;
}

export type ReviewFormData = {
  courseId: string;
  semester: string;
  ratings: RatingDimensions;
  content: string;
};
