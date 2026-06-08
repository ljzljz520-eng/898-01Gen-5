import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Shield,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { 
  getPendingReviews, 
  getRejectedReviews, 
  approveReview, 
  rejectReview,
  getReviewStats 
} from '../services/reviewService';
import { getCourseById } from '../services/courseService';
import { useUiStore } from '../store/useUiStore';
import { useCourseStore } from '../store/useCourseStore';
import { Review } from '../types';
import { formatSemester } from '../utils/semester';
import { RatingStars } from '../components/RatingStars';

type TabType = 'pending' | 'rejected';

export const AdminReview: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useUiStore(state => state.showToast);
  const refreshCourses = useCourseStore(state => state.refreshCourses);
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [rejectedReviews, setRejectedReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPendingReviews(getPendingReviews());
    setRejectedReviews(getRejectedReviews());
    setStats(getReviewStats());
  };

  const handleApprove = (reviewId: string) => {
    if (approveReview(reviewId)) {
      showToast('评价已通过审核', 'success');
      refreshCourses();
      loadData();
    } else {
      showToast('操作失败，请重试', 'error');
    }
  };

  const handleReject = (reviewId: string) => {
    const reason = rejectReason || '内容不符合社区规范';
    if (rejectReview(reviewId, reason)) {
      showToast(`评价已拒绝：${reason}`, 'warning');
      refreshCourses();
      loadData();
    } else {
      showToast('操作失败，请重试', 'error');
    }
    setShowRejectModal(null);
    setRejectReason('');
  };

  const currentReviews = activeTab === 'pending' ? pendingReviews : rejectedReviews;

  const getCourseName = (courseId: string) => {
    const course = getCourseById(courseId);
    return course ? `${course.name} - ${course.teacher}` : '未知课程';
  };

  const statCards = [
    { label: '总评价数', value: stats.total, icon: MessageSquare, color: 'text-primary-600 bg-primary-100' },
    { label: '已通过', value: stats.approved, icon: CheckCircle, color: 'text-success-600 bg-success-100' },
    { label: '待审核', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-100' },
    { label: '已拒绝', value: stats.rejected, icon: XCircle, color: 'text-danger-600 bg-danger-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
                内容审核中心
              </h1>
              <p className="text-gray-500">管理和审核用户提交的评价内容</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              待审核 ({pendingReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'rejected'
                  ? 'bg-danger-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              已拒绝 ({rejectedReviews.length})
            </button>
          </div>

          {currentReviews.length === 0 ? (
            <div className="text-center py-16">
              {activeTab === 'pending' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-success-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    暂无待审核内容
                  </h3>
                  <p className="text-gray-500">所有评价都已审核完毕，干得漂亮！</p>
                </>
              ) : (
                <>
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    暂无已拒绝内容
                  </h3>
                  <p className="text-gray-500">还没有拒绝过任何评价</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getCourseName(review.courseId)}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatSemester(review.semester)} · {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    {review.status === 'pending' && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        待审核
                      </span>
                    )}
                    {review.status === 'rejected' && (
                      <span className="px-2 py-1 bg-danger-100 text-danger-700 text-xs rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        已拒绝
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">课程难度</p>
                      <RatingStars rating={review.difficulty} size="sm" />
                      <p className="text-sm font-semibold text-gray-900 mt-1">{review.difficulty}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">作业量</p>
                      <RatingStars rating={review.workload} size="sm" />
                      <p className="text-sm font-semibold text-gray-900 mt-1">{review.workload}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">考核方式</p>
                      <RatingStars rating={review.examMethod} size="sm" />
                      <p className="text-sm font-semibold text-gray-900 mt-1">{review.examMethod}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">给分厚道度</p>
                      <RatingStars rating={review.grading} size="sm" />
                      <p className="text-sm font-semibold text-gray-900 mt-1">{review.grading}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {review.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        通过审核
                      </button>
                      <button
                        onClick={() => setShowRejectModal(review.id)}
                        className="flex-1 px-4 py-3 bg-danger-50 text-danger-600 hover:bg-danger-100 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        拒绝
                      </button>
                    </div>
                  )}

                  {review.status === 'rejected' && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      重新审核通过
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                拒绝评价
              </h3>
              <p className="text-gray-600 mb-4">请选择或输入拒绝原因：</p>
              <div className="space-y-2 mb-4">
                {['内容包含敏感词', '涉嫌试题泄露', '恶意打分或评价过短', '人身攻击或不文明用语', '其他原因'].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectReason(reason)}
                    className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
                      rejectReason === reason
                        ? 'bg-danger-50 text-danger-700 border-2 border-danger-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleReject(showRejectModal)}
                  disabled={!rejectReason}
                  className="flex-1 px-4 py-3 bg-danger-500 text-white hover:bg-danger-600 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认拒绝
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
