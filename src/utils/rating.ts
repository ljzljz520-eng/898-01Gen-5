import { RatingDimensions, Review } from '../types';

export function calculateOverallRating(ratings: RatingDimensions): number {
  const { difficulty, workload, examMethod, grading } = ratings;
  const sum = difficulty + workload + examMethod + grading;
  return Math.round((sum / 4) * 10) / 10;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-success-500';
  if (rating >= 3.5) return 'text-primary-500';
  if (rating >= 2.5) return 'text-accent-500';
  return 'text-danger-500';
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 4.5) return 'bg-success-500';
  if (rating >= 3.5) return 'bg-primary-500';
  if (rating >= 2.5) return 'bg-accent-500';
  return 'bg-danger-500';
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return '非常推荐';
  if (rating >= 4.0) return '推荐';
  if (rating >= 3.0) return '一般';
  if (rating >= 2.0) return '慎选';
  return '不推荐';
}

export function getRatingDimensionLabel(dimension: keyof RatingDimensions): string {
  const labels: Record<keyof RatingDimensions, string> = {
    difficulty: '课程难度',
    workload: '作业量',
    examMethod: '考核方式',
    grading: '给分厚道度',
  };
  return labels[dimension];
}

export function getRatingDimensionDescription(dimension: keyof RatingDimensions): string {
  const descriptions: Record<keyof RatingDimensions, string> = {
    difficulty: '越低越简单',
    workload: '越低越轻松',
    examMethod: '越低越容易过',
    grading: '越高给分越好',
  };
  return descriptions[dimension];
}

export function aggregateReviews(reviews: Review[]) {
  if (reviews.length === 0) {
    return {
      avgDifficulty: 0,
      avgWorkload: 0,
      avgExamMethod: 0,
      avgGrading: 0,
      avgOverall: 0,
      reviewCount: 0,
      latestSemester: '',
    };
  }

  const sum = reviews.reduce(
    (acc, review) => ({
      difficulty: acc.difficulty + review.difficulty,
      workload: acc.workload + review.workload,
      examMethod: acc.examMethod + review.examMethod,
      grading: acc.grading + review.grading,
    }),
    { difficulty: 0, workload: 0, examMethod: 0, grading: 0 }
  );

  const count = reviews.length;
  const avgDifficulty = Math.round((sum.difficulty / count) * 10) / 10;
  const avgWorkload = Math.round((sum.workload / count) * 10) / 10;
  const avgExamMethod = Math.round((sum.examMethod / count) * 10) / 10;
  const avgGrading = Math.round((sum.grading / count) * 10) / 10;
  const avgOverall = Math.round(((avgDifficulty + avgWorkload + avgExamMethod + avgGrading) / 4) * 10) / 10;

  const latestSemester = [...reviews].sort((a, b) => 
    b.semester.localeCompare(a.semester)
  )[0]?.semester || '';

  return {
    avgDifficulty,
    avgWorkload,
    avgExamMethod,
    avgGrading,
    avgOverall,
    reviewCount: count,
    latestSemester,
  };
}

export function getRatingDistribution(reviews: Review[]): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    const overall = calculateOverallRating({
      difficulty: review.difficulty,
      workload: review.workload,
      examMethod: review.examMethod,
      grading: review.grading,
    });
    const rounded = Math.round(overall);
    if (rounded >= 1 && rounded <= 5) {
      distribution[rounded]++;
    }
  });

  return distribution;
}
