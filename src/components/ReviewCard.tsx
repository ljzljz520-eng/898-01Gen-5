import React, { useState } from 'react';
import { ThumbsUp, Flag, AlertTriangle, Calendar } from 'lucide-react';
import { Review } from '../types';
import { RatingStars } from './RatingStars';
import { 
  formatSemester, 
  getSemesterWarning, 
  isOldSemester 
} from '../utils/semester';
import { 
  getRatingDimensionLabel,
  calculateOverallRating
} from '../utils/rating';
import { incrementHelpfulCount, reportReview } from '../services/reviewService';
import { useUiStore } from '../store/useUiStore';

interface ReviewCardProps {
  review: Review;
  onHelpful?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const showToast = useUiStore(state => state.showToast);
  
  const overallRating = calculateOverallRating({
    difficulty: review.difficulty,
    workload: review.workload,
    examMethod: review.examMethod,
    grading: review.grading,
  });
  
  const warning = getSemesterWarning(review.semester);
  const isOld = isOldSemester(review.semester);

  const handleHelpful = () => {
    if (hasVoted) {
      showToast('您已经标记过这条评价了', 'info');
      return;
    }
    
    const success = incrementHelpfulCount(review.id);
    if (success) {
      setHasVoted(true);
      showToast('感谢您的反馈！', 'success');
      onHelpful?.();
    }
  };

  const handleReport = () => {
    if (!reportReason.trim()) {
      showToast('请填写举报原因', 'warning');
      return;
    }
    
    reportReview(review.id, reportReason);
    setShowReportModal(false);
    setReportReason('');
    showToast('举报已提交，我们会尽快审核', 'success');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const ratingItems = [
    { key: 'difficulty', value: review.difficulty },
    { key: 'workload', value: review.workload },
    { key: 'examMethod', value: review.examMethod },
    { key: 'grading', value: review.grading },
  ] as const;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{formatSemester(review.semester)}</span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RatingStars rating={overallRating} size="sm" showValue />
          </div>
        </div>

        {isOld && warning && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{warning}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {ratingItems.map(({ key, value }) => (
            <div key={key} className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                {getRatingDimensionLabel(key)}
              </p>
              <div className="flex justify-center">
                <RatingStars rating={value} size="sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleHelpful}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              hasVoted
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">
              有用 ({review.helpfulCount + (hasVoted ? 1 : 0)})
            </span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <Flag className="w-4 h-4" />
            <span className="text-sm">举报</span>
          </button>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-4">举报评价</h3>
            <p className="text-sm text-gray-600 mb-4">
              请选择举报原因，我们会尽快审核处理。
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input-field mb-4"
            >
              <option value="">请选择举报原因</option>
              <option value="spam">垃圾广告</option>
              <option value="insult">人身攻击</option>
              <option value="exam_leak">泄露试题</option>
              <option value="fake">虚假评价</option>
              <option value="other">其他原因</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReport}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                提交举报
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
