export function formatSemester(semester: string): string {
  const parts = semester.split('-');
  if (parts.length !== 3) return semester;
  
  const [startYear, endYear, term] = parts;
  const termName = term === '1' ? '秋季学期' : '春季学期';
  return `${startYear}-${endYear} ${termName}`;
}

export function getSemesterYear(semester: string): string {
  const parts = semester.split('-');
  return parts[0] || '';
}

export function getSemesterDisplay(semester: string): string {
  const parts = semester.split('-');
  if (parts.length !== 3) return semester;
  
  const [startYear, , term] = parts;
  const termName = term === '1' ? '秋' : '春';
  return `${startYear.slice(2)}${termName}`;
}

export function compareSemester(a: string, b: string): number {
  return b.localeCompare(a);
}

export function generateAvailableSemesters(): string[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const semesters: string[] = [];
  
  for (let year = currentYear - 3; year <= currentYear; year++) {
    semesters.push(`${year}-${year + 1}-1`);
    semesters.push(`${year}-${year + 1}-2`);
  }
  
  return semesters.sort(compareSemester);
}

export function isOldSemester(semester: string, yearsAgo: number = 3): boolean {
  const parts = semester.split('-');
  if (parts.length !== 3) return false;
  
  const startYear = parseInt(parts[0], 10);
  const currentYear = new Date().getFullYear();
  
  return currentYear - startYear >= yearsAgo;
}

export function getSemesterWarning(semester: string): string | null {
  if (isOldSemester(semester, 3)) {
    return '注意：这是3年前的评价，课程内容可能已调整';
  }
  return null;
}
