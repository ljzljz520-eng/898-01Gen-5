import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ContentReviewResult } from '../types';

interface ContentReviewAlertProps {
  reviewResult: ContentReviewResult | null;
  className?: string;
}

export const ContentReviewAlert: React.FC<ContentReviewAlertProps> = ({
  reviewResult,
  className = '',
}) => {
  if (!reviewResult) return null;

  const { passed, warnings, blockedReasons } = reviewResult;

  if (passed && warnings.length === 0) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-success-50 border border-success-500/20 rounded-xl ${className}`}>
        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
        <p className="text-sm text-success-700 font-medium">
          内容审核通过，可以提交
        </p>
      </div>
    );
  }

  if (!passed) {
    return (
      <div className={`space-y-2 ${className}`}>
        {blockedReasons.map((reason, index) => (
          <div
            key={`block-${index}`}
            className="flex items-start gap-3 p-4 bg-danger-50 border border-danger-500/20 rounded-xl"
          >
            <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger-700 font-medium">{reason}</p>
          </div>
        ))}
        {warnings.map((warning, index) => (
          <div
            key={`warn-${index}`}
            className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-500/20 rounded-xl"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{warning}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {warnings.map((warning, index) => (
        <div
          key={`warn-${index}`}
          className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-500/20 rounded-xl"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-700 font-medium">温馨提示</p>
            <p className="text-sm text-amber-600 mt-1">{warning}</p>
            <p className="text-xs text-amber-500 mt-2">
              您的评价将进入待审核状态，审核通过后才会公开展示
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
