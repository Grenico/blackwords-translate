import { defineStore } from 'pinia';
import type { HistoryRecord, FavoriteTerm } from '../types';

export const useUserStore = defineStore('user', {
  state: () => ({
    history: [] as HistoryRecord[],
    favorites: [] as FavoriteTerm[],
  }),

  actions: {
    // 初始化数据（从localStorage读取）
    initialize() {
      const savedHistory = localStorage.getItem('blackword_history');
      const savedFavorites = localStorage.getItem('blackword_favorites');

      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
      }
      if (savedFavorites) {
        this.favorites = JSON.parse(savedFavorites);
      }
    },

    // 添加历史记录
    addHistory(text: string, matchedTerms: string[]) {
      const historyRecord: HistoryRecord = {
        id: Date.now().toString(),
        text,
        timestamp: Date.now(),
        matchedTerms,
      };

      // 移除重复记录
      this.history = this.history.filter(h => h.text !== text);
      
      // 添加到历史记录开头
      this.history.unshift(historyRecord);
      
      // 最多保留50条历史记录
      if (this.history.length > 50) {
        this.history = this.history.slice(0, 50);
      }

      this.saveHistory();
    },

    // 删除历史记录
    deleteHistory(id: string) {
      this.history = this.history.filter(h => h.id !== id);
      this.saveHistory();
    },

    // 清空历史记录
    clearHistory() {
      this.history = [];
      this.saveHistory();
    },

    // 添加收藏
    addFavorite(id: string, term: string, meaning: string, category: string[]) {
      // 检查是否已收藏
      if (this.favorites.some(f => f.id === id)) {
        return;
      }

      const favorite: FavoriteTerm = {
        id,
        term,
        meaning,
        category,
        timestamp: Date.now(),
      };

      this.favorites.push(favorite);
      this.saveFavorites();
    },

    // 删除收藏
    removeFavorite(id: string) {
      this.favorites = this.favorites.filter(f => f.id !== id);
      this.saveFavorites();
    },

    // 检查是否已收藏
    isFavorite(id: string): boolean {
      return this.favorites.some(f => f.id === id);
    },

    // 保存历史记录到localStorage
    saveHistory() {
      localStorage.setItem('blackword_history', JSON.stringify(this.history));
    },

    // 保存收藏到localStorage
    saveFavorites() {
      localStorage.setItem('blackword_favorites', JSON.stringify(this.favorites));
    },
  },
});