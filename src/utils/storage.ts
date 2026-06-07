const STORAGE_KEYS = {
  COURSES: 'course_review_courses',
  REVIEWS: 'course_review_reviews',
  INITIALIZED: 'course_review_initialized',
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

export function getCoursesFromStorage() {
  return getFromStorage(STORAGE_KEYS.COURSES, null);
}

export function setCoursesToStorage(courses: unknown): void {
  setToStorage(STORAGE_KEYS.COURSES, courses);
}

export function getReviewsFromStorage() {
  return getFromStorage(STORAGE_KEYS.REVIEWS, null);
}

export function setReviewsToStorage(reviews: unknown): void {
  setToStorage(STORAGE_KEYS.REVIEWS, reviews);
}

export function isDataInitialized(): boolean {
  return getFromStorage(STORAGE_KEYS.INITIALIZED, false);
}

export function markDataInitialized(): void {
  setToStorage(STORAGE_KEYS.INITIALIZED, true);
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
