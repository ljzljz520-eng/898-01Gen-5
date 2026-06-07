import { ContentIssue, ContentReviewResult, RatingDimensions } from '../types';

const SENSITIVE_WORDS = [
  '傻逼', '草泥马', '操你妈', '去死', '垃圾老师', '废物',
  '考题', '试题', '期末题', '期中考试题', '考试题目',
  '答案', '标准答案', '考试答案', '期末答案',
  '作弊', '代考', '替考', '泄题',
];

const EXAM_LEAK_PATTERNS = [
  /第[一二三四五六七八九十\d]+题/,
  /选择题第/,
  /填空题第/,
  /简答题第/,
  /论述题第/,
  /计算题第/,
  /考点是/,
  /考了[^吗呢啊？?！!,.。，]{2,}/,
  /答案是/,
  /选[ABCDE]/,
];

const PERSONAL_ATTACK_PATTERNS = [
  /老师是[傻蠢笨呆]/,
  /老师真[傻蠢笨呆]/,
  /老师太[傻蠢笨呆]/,
  /垃圾老师/,
  /废物老师/,
  /不配当老师/,
];

export function detectSensitiveWords(content: string): ContentIssue[] {
  const issues: ContentIssue[] = [];
  
  for (const word of SENSITIVE_WORDS) {
    const lowerContent = content.toLowerCase();
    const lowerWord = word.toLowerCase();
    let index = lowerContent.indexOf(lowerWord);
    
    while (index !== -1) {
      let severity: 'warning' | 'block' = 'warning';
      let message = `检测到敏感词："${word}"`;
      
      if (PERSONAL_ATTACK_PATTERNS.some(pattern => pattern.test(content))) {
        severity = 'block';
        message = '禁止人身攻击，请文明评价';
      }
      
      if (word.includes('题') || word.includes('答案') || word.includes('泄题')) {
        severity = 'block';
        message = '评价内容不得包含考试题及答案相关内容';
      }
      
      issues.push({
        type: 'sensitive_word',
        severity,
        message,
        position: { start: index, end: index + word.length },
      });
      
      index = lowerContent.indexOf(lowerWord, index + 1);
    }
  }
  
  return issues;
}

export function detectExamLeak(content: string): ContentIssue[] {
  const issues: ContentIssue[] = [];
  
  for (const pattern of EXAM_LEAK_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      issues.push({
        type: 'exam_leak',
        severity: 'block',
        message: '检测到可能包含考试内容，评价不得泄露试题或答案',
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length,
        },
      });
    }
  }
  
  return issues;
}

export function detectMaliciousRating(
  ratings: RatingDimensions,
  content: string
): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const values = Object.values(ratings);
  const allOnes = values.every(v => v === 1);
  const allFives = values.every(v => v === 5);
  const trimmedContent = content.trim();
  const contentTooShort = trimmedContent.length < 10;
  const contentMeaningless = /^(.)\1*$/.test(trimmedContent.replace(/\s/g, ''));
  
  if ((allOnes || allFives) && (contentTooShort || contentMeaningless)) {
    issues.push({
      type: 'malicious_rating',
      severity: 'warning',
      message: '为保证评价质量，极端评分请补充详细评价内容（至少10字）',
    });
  }
  
  const allSame = values.every(v => v === values[0]);
  if (allSame && contentTooShort) {
    issues.push({
      type: 'malicious_rating',
      severity: 'warning',
      message: '所有维度评分相同，请补充具体评价说明',
    });
  }
  
  return issues;
}

export function reviewContent(
  content: string,
  ratings: RatingDimensions
): ContentReviewResult {
  const allIssues: ContentIssue[] = [];
  
  allIssues.push(...detectSensitiveWords(content));
  allIssues.push(...detectExamLeak(content));
  allIssues.push(...detectMaliciousRating(ratings, content));
  
  const blockedReasons = allIssues
    .filter(issue => issue.severity === 'block')
    .map(issue => issue.message);
  
  const warnings = allIssues
    .filter(issue => issue.severity === 'warning')
    .map(issue => issue.message);
  
  const passed = blockedReasons.length === 0;
  
  return {
    passed,
    warnings,
    blockedReasons,
    detectedIssues: allIssues,
  };
}

export function highlightContentIssues(content: string, issues: ContentIssue[]): string {
  if (issues.length === 0) return content;
  
  const sortedIssues = [...issues].sort((a, b) => {
    const posA = a.position?.start ?? 0;
    const posB = b.position?.start ?? 0;
    return posB - posA;
  });
  
  let result = content;
  for (const issue of sortedIssues) {
    if (!issue.position) continue;
    const { start, end } = issue.position;
    const before = result.slice(0, start);
    const marked = result.slice(start, end);
    const after = result.slice(end);
    
    const className = issue.severity === 'block' 
      ? 'bg-red-200 text-red-800 line-through' 
      : 'bg-yellow-200 text-yellow-800';
    
    result = `${before}<span class="${className}">${marked}</span>${after}`;
  }
  
  return result;
}
