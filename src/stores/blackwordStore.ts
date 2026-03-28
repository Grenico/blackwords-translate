import { defineStore } from 'pinia';
import type { BlackWord, TranslationResult } from '../types';
import blackwordsData from '../assets/dicts/blackwords.json';

export const useBlackwordStore = defineStore('blackword', {
  state: () => ({
    dictionary: blackwordsData as BlackWord[],
  }),

  getters: {
    getTermById: (state) => (id: string) => {
      return state.dictionary.find(term => term.id === id);
    },
  },

  actions: {
    // 匹配文本中的黑话术语
    matchTerms(text: string): TranslationResult[] {
      const results: TranslationResult[] = [];
      const matchedTermIds = new Set<string>();

      // 按术语长度降序排序，优先匹配长术语
      const sortedTerms = [...this.dictionary].sort((a, b) => b.term.length - a.term.length);

      sortedTerms.forEach(term => {
        if (matchedTermIds.has(term.id)) return;

        const regex = new RegExp(`${this.escapeRegExp(term.term)}`, 'gi');
        if (regex.test(text)) {
          results.push({
            term: term.term,
            meanings: term.meanings,
            category: term.category,
          });
          matchedTermIds.add(term.id);
        }
      });

      // 返回最多3条结果
      return results.slice(0, 3);
    },

    // 获取术语详情
    getTermDetail(term: string): BlackWord | undefined {
      return this.dictionary.find(t => t.term === term);
    },

    // 转义正则表达式特殊字符
    escapeRegExp(string: string): string {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
  },
});