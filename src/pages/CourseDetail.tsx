import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Users, 
  PenSquare,
  Filter
} from 'lucide-react';
import { useCourseStore } from '../store/useCourseStore';
import { useUiStore } from '../store/useUiStore';
import { RatingStars } from '../components/RatingStars';
import { RatingDistribution } from '../components/RatingDistribution';
import { ReviewCard } from '../components/ReviewCard';
import { Empty } from '../components/Empty';
import { getCourseTypeLabel, getCourseTypeTagClass } from '../services/courseService';
import { formatSemester } from '../utils/semester';
import { 
  getRatingLabel, 
  getRatingColor, 
  getRatingDimensionLabel,
  getRatingDimensionDescription 
} from '../utils/rating';
import { getReviewsByCourseId, getSemestersWithReviewCount } from '../services/reviewService';
import { Review } from '../types';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { selectedCourse, loadCourseDetail, clearSelectedCourse, isLoading, refreshCourses } = useCourseStore();
  const showToast = useUiStore(state => state.showToast);
  
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [semesters, setSemesters] = useState<Array<{ semester: string; count: number }>>([]);

  useEffect(() => {
    if (courseId) {
      loadCourseDetail(courseId);
    }
    return () => clearSelectedCourse();
  }, [courseId, loadCourseDetail, clearSelectedCourse]);

  useEffect(() => {
    if (courseId) {
      const allReviews = getReviewsByCourseId(courseId);
      const semesterOptions = getSemestersWithReviewCount(courseId);
      setSemesters(semesterOptions);
      
      if (selectedSemester === 'all') {
        setReviews(allReviews);
      } else {
        setReviews(allReviews.filter(r => r.semester === selectedSemester));
      }
    }
  }, [courseId, selectedSemester, selectedCourse]);

  const handleHelpful = () => {
    if (courseId) {
      refreshCourses();
      loadCourseDetail(courseId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-64 bg-white rounded-2xl" />
            <div className="h-96 bg-white rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <Empty
            title="课程不存在"
            description="请检查课程链接是否正确"
            icon="error"
          />
          <div className="flex justify-center mt-8">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ratingDimensions = [
    { key: 'avgDifficulty', label: '课程难度', value: selectedCourse.avgDifficulty },
    { key: 'avgWorkload', label: '作业量', value: selectedCourse.avgWorkload },
    { key: 'avgExamMethod', label: '考核方式', value: selectedCourse.avgExamMethod },
    { key: 'avgGrading', label: '给分厚道度', value: selectedCourse.avgGrading },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回课程列表
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 opacity-0 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`tag ${getCourseTypeTagClass(selectedCourse.type)}`}>
                  {getCourseTypeLabel(selectedCourse.type)}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  {selectedCourse.code}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif mb-4">
                {selectedCourse.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{selectedCourse.teacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <span>{selectedCourse.credits} 学分</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>{selectedCourse.department}</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 text-center">
                <div className={`text-6xl font-bold font-serif ${getRatingColor(selectedCourse.avgOverall)} mb-2`}>
                  {selectedCourse.avgOverall.toFixed(1)}
                </div>
                <RatingStars rating={selectedCourse.avgOverall} size="lg" />
                <p className={`text-lg font-medium mt-2 ${getRatingColor(selectedCourse.avgOverall)}`}>
                  {getRatingLabel(selectedCourse.avgOverall)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  共 {selectedCourse.reviewCount} 条评价
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {ratingDimensions.map(({ key, label, value }) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</p>
                    <RatingStars rating={value} size="sm" />
                    <p className="text-xs text-gray-400 mt-1">
                      {getRatingDimensionDescription(key.replace('avg', '').toLowerCase() as any)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 font-serif">
                评价列表
                <span className="text-base font-normal text-gray-500 ml-2">
                  ({reviews.length} 条)
                </span>
              </h2>
              
              {semesters.length > 0 && (
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="input-field py-2 pr-8 text-sm"
                  >
                    <option value="all">全部学期</option>
                    {semesters.map(({ semester, count }) => (
                      <option key={semester} value={semester}>
                        {formatSemester(semester)} ({count}条)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ReviewCard review={review} onHelpful={handleHelpful} />
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                title="暂无评价"
                description={selectedSemester === 'all' 
                  ? '成为第一个评价这门课的人吧！' 
                  : '该学期暂无评价，试试查看其他学期'}
                icon="review"
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">评分分布</h3>
              <RatingDistribution reviews={selectedCourse.reviews} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">各维度评分</h3>
              <div className="space-y-4">
                {ratingDimensions.map(({ key, label, value }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {getRatingDimensionLabel(key.replace('avg', '').toLowerCase() as any)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {value.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
                        style={{ width: `${(value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={`/review/new?courseId=${selectedCourse.id}`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <PenSquare className="w-5 h-5" />
              分享你的选课体验
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
