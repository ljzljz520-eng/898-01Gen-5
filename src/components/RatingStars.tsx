import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const value = index + 1;
          const isFilled = value <= displayRating;
          
          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              onClick={() => handleClick(value)}
              onMouseEnter={() => interactive && setHoverRating(value)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'
              } focus:outline-none`}
              disabled={!interactive}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors duration-200 ${
                  isFilled
                    ? 'fill-accent-500 text-accent-500'
                    : 'fill-gray-100 text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
