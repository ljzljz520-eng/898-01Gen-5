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
  setTeacher: (teacher: string) => void;
  setWorkload: (workload: 'all' | 'low' | 'medium' | 'high') => void;
  setExamMethod: (examMethod: 'all' | 'easy' | 'medium' | 'hard') => void;
  resetFilters: () => void;
  clearSelectedCourse: () => void;
  refreshCourses: () => void;
}

const initialFilters: FilterOptions = {
  type: 'all',
  sortBy: 'rating',
  searchQuery: '',
  teacher: '',
  workload: 'all',
  examMethod: 'all',
};

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  filteredCourses: [],
  selectedCourse: null,
  filters: initialFilters,
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

  setTeacher: (teacher: string) => {
    const filters = { ...get().filters, teacher };
    const filteredCourses = filterCourses(get().courses, filters);
    set({ filters, filteredCourses });
  },

  setWorkload: (workload: 'all' | 'low' | 'medium' | 'high') => {
    const filters = { ...get().filters, workload };
    const filteredCourses = filterCourses(get().courses, filters);
    set({ filters, filteredCourses });
  },

  setExamMethod: (examMethod: 'all' | 'easy' | 'medium' | 'hard') => {
    const filters = { ...get().filters, examMethod };
    const filteredCourses = filterCourses(get().courses, filters);
    set({ filters, filteredCourses });
  },

  resetFilters: () => {
    const filteredCourses = filterCourses(get().courses, initialFilters);
    set({ filters: initialFilters, filteredCourses });
  },

  clearSelectedCourse: () => {
    set({ selectedCourse: null });
  },

  refreshCourses: () => {
    get().loadCourses();
  },
}));
