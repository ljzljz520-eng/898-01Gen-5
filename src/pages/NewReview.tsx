import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar as CalendarIcon,
  Send,
  Info,
  Database,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUiStore } from '../store/useUiStore';
import { useCourseStore } from '../store/useCourseStore';
import { StepIndicator } from '../components/StepIndicator';
import { RatingStars } from '../components/RatingStars';
import { SemesterPicker } from '../components/SemesterPicker';
import { ContentReviewAlert } from '../components/ContentReviewAlert';
import { getAllCourses } from '../services/courseService';
import { submitReview } from '../services/reviewService';
import { reviewContent } from '../services/contentReviewService';
import { 
  getRatingDimensionLabel, 
  getRatingDimensionDescription,
  calculateOverallRating 
} from '../utils/rating';
import { RatingDimensions, ContentReviewResult, Course } from '../types';

const steps = ['选择课程', '选择学期', '维度评分', '填写评价', '提交'];

const initialRatings: RatingDimensions = {
  difficulty: 0,
  workload: 0,
  examMethod: 0,
  grading: 0,
};

export const NewReview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId');
  const showToast = useUiStore(state => state.showToast);
  const refreshCourses = useCourseStore(state => state.refreshCourses);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<string>(preselectedCourseId || '');
  const [semester, setSemester] = useState<string>('');
  const [ratings, setRatings] = useState<RatingDimensions>(initialRatings);
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCourses(getAllCourses());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses;
    const query = courseSearch.toLowerCase();
    return courses.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.teacher.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [courses, courseSearch]);

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  const reviewResult: ContentReviewResult | null = useMemo(() => {
    if (currentStep < 4) return null;
    return reviewContent(content, ratings);
  }, [content, ratings, currentStep]);

  const overallRating = calculateOverallRating(ratings);
  const allRatingsFilled = Object.values(ratings).every(v => v > 0);
  const contentValid = content.trim().length >= 10 && content.trim().length <= 500;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedCourse !== '';
      case 1: return semester !== '';
      case 2: return allRatingsFilled;
      case 3: return contentValid;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRatingChange = (dimension: keyof RatingDimensions, value: number) => {
    setRatings(prev => ({ ...prev, [dimension]: value }));
  };

  const handleSubmit = async () => {
    if (!reviewResult?.passed) {
      showToast(reviewResult?.blockedReasons[0] || '请修正内容后再提交', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitReview({
        courseId: selectedCourse,
        semester,
        ratings,
        content,
      });

      if (result.success) {
        refreshCourses();
        const isPending = result.warnings && result.warnings.length > 0;
        showToast(
          isPending
            ? '评价已提交，将在审核通过后展示（仅保存在本地浏览器）'
            : '评价发布成功！（仅保存在本地浏览器）',
          'success'
        );
        navigate(`/course/${selectedCourse}`);
      } else {
        showToast(result.error || '提交失败，请重试', 'error');
      }
    } catch (error) {
      showToast('提交失败，请重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingItems: Array<{ key: keyof RatingDimensions; emoji: string }> = [
    { key: 'difficulty', emoji: '📚' },
    { key: 'workload', emoji: '📝' },
    { key: 'examMethod', emoji: '✍️' },
    { key: 'grading', emoji: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-2">
            分享选课经验
          </h1>
          <p className="text-gray-600 mb-8">
            帮助更多同学做出明智的选课选择
          </p>

          <StepIndicator steps={steps} currentStep={currentStep} className="mb-10" />

          {currentStep === 0 && (
            <div className="space-y-6 opacity-0 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择要评价的课程
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                    className={`input-field cursor-pointer flex items-center justify-between ${
                      selectedCourse ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {selectedCourseData ? (
                      <span>{selectedCourseData.name} - {selectedCourseData.teacher}</span>
                    ) : (
                      <span>搜索课程名称或老师</span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {showCourseDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          placeholder="搜索课程..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredCourses.length > 0 ? (
                          filteredCourses.map((course) => (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => {
                                setSelectedCourse(course.id);
                                setShowCourseDropdown(false);
                                setCourseSearch('');
                              }}
                              className={`w-full px-4 py-3 text-left transition-colors ${
                                selectedCourse === course.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{course.name}</p>
                                  <p className="text-sm text-gray-500">{course.teacher} · {course.code}</p>
                                </div>
                                <span className={`tag ${
                                  course.type === 'major_required' ? 'tag-major' :
                                  course.type === 'general' ? 'tag-general' : 'tag-interdisciplinary'
                                } text-xs`}>
                                  {course.type === 'major_required' ? '专业必修' :
                                   course.type === 'general' ? '通识课' : '跨院课'}
                                </span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            没有找到匹配的课程
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedCourseData && (
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-primary-900">{selectedCourseData.name}</p>
                      <p className="text-sm text-primary-700">{selectedCourseData.teacher} · {selectedCourseData.credits}学分 · {selectedCourseData.department}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 opacity-0 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择你修读这门课的学期
                </label>
                <SemesterPicker
                  value={semester}
                  onChange={setSemester}
                  placeholder="请选择修读学期"
                />
                <p className="mt-3 text-sm text-gray-500 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  显示修读学期可以帮助后来的同学了解评价的时效性，
                  避免被旧培养方案的内容误导。
                </p>
              </div>

              {selectedCourseData && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    正在评价：<span className="font-medium text-gray-900">{selectedCourseData.name}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 opacity-0 animate-fade-in-up">
              <p className="text-gray-600">
                请从以下四个维度对课程进行评分，分数越高表示越满意。
              </p>

              {ratingItems.map(({ key, emoji }) => (
                <div key={key} className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getRatingDimensionLabel(key)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getRatingDimensionDescription(key)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <RatingStars
                      rating={ratings[key]}
                      size="lg"
                      interactive
                      onChange={(value) => handleRatingChange(key, value)}
                    />
                    <span className="text-3xl font-bold text-gray-300 ml-4 min-w-[60px] text-right">
                      {ratings[key] || '-'}
                    </span>
                  </div>
                </div>
              ))}

              {allRatingsFilled && (
                <div className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl text-center">
                  <p className="text-sm text-gray-600 mb-2">综合评分</p>
                  <p className="text-5xl font-bold font-serif text-primary-700">
                    {overallRating.toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 opacity-0 animate-fade-in-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  详细评价
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="分享你的真实选课体验，包括课程内容、教学方式、给分情况、作业量等方面...（10-500字）"
                  className="input-field h-48 resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className={`${content.trim().length < 10 ? 'text-danger-500' : 'text-gray-500'}`}>
                    {content.trim().length}/500 字
                    {content.trim().length < 10 && '（至少需要10字）'}
                  </span>
                  <span className="text-gray-400">
                    {500 - content.length} 字剩余
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  内容规范
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• 禁止泄露任何考试题目及答案</li>
                  <li>• 禁止人身攻击、辱骂等不文明用语</li>
                  <li>• 请客观评价，避免极端情绪化表达</li>
                  <li>• 评价将经过审核后展示</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  数据存储说明
                </h4>
                <p className="text-sm text-blue-700">
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-500" />
                  您的评价将仅保存在当前浏览器的本地存储（localStorage）中，
                  不会上传到服务器。清除浏览器数据或更换设备后，评价将无法恢复。
                </p>
              </div>

              {selectedCourseData && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{selectedCourseData.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedCourseData.teacher} · {semester}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{overallRating.toFixed(1)}</p>
                    <RatingStars rating={overallRating} size="sm" />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 opacity-0 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900">确认并提交</h2>
              
              <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">课程</p>
                    <p className="text-sm text-gray-500">{selectedCourseData?.teacher}</p>
                  </div>
                  <span className="font-medium text-gray-900">{selectedCourseData?.name}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">修读学期</p>
                  </div>
                  <span className="font-medium text-gray-900">{semester}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                  {ratingItems.map(({ key }) => (
                    <div key={key} className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{getRatingDimensionLabel(key)}</p>
                      <RatingStars rating={ratings[key]} size="sm" />
                      <p className="text-lg font-bold text-gray-900 mt-1">{ratings[key]}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">综合评分</p>
                  <p className="text-4xl font-bold text-primary-600">{overallRating.toFixed(1)}</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
              </div>

              <ContentReviewAlert reviewResult={reviewResult} />
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一步
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                下一步
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!reviewResult?.passed || isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    提交评价
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
