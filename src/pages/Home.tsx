import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, MessageSquare, TrendingUp, PenSquare } from 'lucide-react';
import { useCourseStore } from '../store/useCourseStore';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { SortSelector } from '../components/SortSelector';
import { CourseCard } from '../components/CourseCard';
import { Empty } from '../components/Empty';

export const Home: React.FC = () => {
  const {
    filteredCourses,
    filters,
    isLoading,
    loadCourses,
    setSearchQuery,
    setFilterType,
    setSortBy,
  } = useCourseStore();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const stats = [
    { icon: GraduationCap, label: '优质课程', value: '12+', color: 'text-primary-600 bg-primary-100' },
    { icon: Users, label: '学长学姐', value: '1000+', color: 'text-accent-600 bg-accent-100' },
    { icon: MessageSquare, label: '真实评价', value: '2000+', color: 'text-success-600 bg-success-50' },
    { icon: TrendingUp, label: '平均满意度', value: '4.2', color: 'text-purple-600 bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-slate-50">
      <section className="relative py-16 sm:py-24 grain-overlay overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-50" />
        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center opacity-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              面向全校学生的选课指南
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-serif mb-6 text-balance leading-tight">
              选课经验墙
              <span className="block text-primary-600 mt-2">学长学姐帮你避坑</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 text-balance">
              来自往届学生的真实选课体验，帮助你做出明智的课程选择。
              按课程、老师、考核方式和作业量筛选，找到最适合你的课程。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/review/new" className="btn-primary inline-flex items-center justify-center gap-2">
                <PenSquare className="w-5 h-5" />
                分享你的选课经验
              </Link>
              <a
                href="#courses"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                浏览课程
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="courses" className="py-12 sm:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchBar
                value={filters.searchQuery}
                onChange={setSearchQuery}
                placeholder="搜索课程名称、老师、学院或课程代码..."
              />
            </div>
            <div className="flex items-center gap-3">
              <SortSelector value={filters.sortBy} onChange={setSortBy} />
            </div>
          </div>

          <FilterTabs
            activeType={filters.type}
            onChange={setFilterType}
            className="mb-8"
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <Empty
              title="没有找到匹配的课程"
              description="试试调整搜索关键词或筛选条件"
              icon="search"
            />
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-serif">
                选课经验墙
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              致力于为高校学生提供真实、可靠的课程评价，
              帮助每一位同学做出明智的选课决策。
            </p>
            <p className="text-gray-400 text-xs">
              © 2025 选课经验墙. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
