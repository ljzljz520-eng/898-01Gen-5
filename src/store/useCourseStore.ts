import { create } from 'zustand';
import { CourseWithStats, FilterOptions, CourseType } from '../types';
import {
  getAllCoursesWithStats,
  filterCourses,
  getCourseWithStats,
} from '../services/courseService';
import { initializeData } from '../services/courseService';

interface CourseState {
  courses: CourseWithStats[];
  filteredCourses: CourseWithStats[];
  selectedCourse: CourseWithStats | null;
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
  
  loadCourses: () => void;
  loadCourseDetail: (courseId: string) => void;
  setFilterType: (type: CourseType | 'all') => void;
  setSortBy: (sortBy: 'rating' | 'review_count' | 'latest') => void;
  setSearchQuery: (query: string) => void;
  clearSelectedCourse: () => void;
  refreshCourses: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  filteredCourses: [],
  selectedCourse: null,
  filters: {
    type: 'all',
    sortBy: 'rating',
    searchQuery: '',
  },
  isLoading: false,
  error: null,

  loadCourses: () => {
    set({ isLoading: true, error: null });
    try {
      initializeData();
      const courses = getAllCoursesWithStats();
      const filteredCourses = filterCourses(courses, get().filters);
      set({ courses, filteredCourses, isLoading: false });
    } catch (error) {
      set({ error: '加载课程列表失败', isLoading: false });
    }
  },

  loadCourseDetail: (courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const course = getCourseWithStats(courseId);
      set({ selectedCourse: course || null, isLoading: false });
    } catch (error) {
      set({ error: '加载课程详情失败', isLoading: false });
    }
  },

  setFilterType: (type: CourseType | 'all') => {
    const filters = { ...get().filters, type };
    const filteredCourses = filterCourses(get().courses, filters);
    set({ filters, filteredCourses });
  },

  setSortBy: (sortBy: 'rating' | 'review_count' | 'latest') => {
    const filters = { ...get().filters, sortBy };
    const filteredCourses = filterCourses(get().courses, filters);
    set({ filters, filteredCourses });
  },

  setSearchQuery: (searchQuery: string) => {
    const filters = { ...get().filters, searchQuery };
    const filteredCourses = filterCourses(get().courses, filters);
    set({ filters, filteredCourses });
  },

  clearSelectedCourse: () => {
    set({ selectedCourse: null });
  },

  refreshCourses: () => {
    get().loadCourses();
  },
}));
