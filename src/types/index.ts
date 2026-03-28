// 黑话术语类型定义
export interface BlackWord {
  id: string;
  term: string;
  category: string[];
  meanings: string[];
  examples: string[];
  risk: string;
}

// 历史记录类型定义
export interface HistoryRecord {
  id: string;
  text: string;
  timestamp: number;
  matchedTerms: string[];
}

// 收藏术语类型定义
export interface FavoriteTerm {
  id: string;
  term: string;
  meaning: string;
  category: string[];
  timestamp: number;
}

// 翻译结果类型定义
export interface TranslationResult {
  term: string;
  meanings: string[];
  category: string[];
}