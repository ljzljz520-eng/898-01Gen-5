import React from 'react';
import { Review } from '../types';
import { getRatingDistribution } from '../utils/rating';

interface RatingDistributionProps {
  reviews: Review[];
  className?: string;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  reviews,
  className = '',
}) => {
  const distribution = getRatingDistribution(reviews);
  const total = reviews.length;

  if (total === 0) return null;

  const getPercentage = (count: number) => (count / total) * 100;

  const ratingLabels = ['不推荐', '慎选', '一般', '推荐', '非常推荐'];
  const barColors = [
    'bg-danger-500',
    'bg-orange-500',
    'bg-accent-500',
    'bg-primary-500',
    'bg-success-500',
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating] || 0;
        const percentage = getPercentage(count);
        const label = ratingLabels[rating - 1];
        const barColor = barColors[rating - 1];

        return (
          <div key={rating} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600 flex items-center gap-1">
              <span className="font-medium">{rating}</span>
              <span className="text-xs text-gray-400">★</span>
              <span className="text-xs text-gray-500 hidden sm:inline">
                {label}
              </span>
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm text-gray-500">
              {count}人
            </div>
          </div>
        );
      })}
    </div>
  );
};
