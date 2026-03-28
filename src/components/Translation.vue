<template><div class="translation-page"><div class="header"><h1>互联网大厂黑话翻译器</h1></div><div class="content"><div class="input-section"><van-field
          v-model="inputText"
          type="textarea"
          placeholder="请输入需要翻译的文本..."
          :rows="4"
          maxlength="500"
          show-word-limit
        /><van-button type="primary" block @click="translate" class="translate-btn">翻译</van-button></div><div class="result-section" v-if="results.length >0"><h3>整句翻译</h3><div class="translated-text">{{ translatedText }}</div><h3>术语解释</h3><div class="result-item" v-for="(result, index) in results" :key="index"><div class="term">{{ result.term }}</div><div class="category" v-if="result.category.length"><span v-for="cat in result.category" :key="cat" class="category-tag">{{ cat }}</span></div><div class="meanings"><p v-for="(meaning, idx) in result.meanings" :key="idx">{{ meaning }}</p></div></div></div><div class="no-result" v-else-if="inputText && !isTranslating"><p>未识别到黑话术语，可尝试其他文本</p></div></div><TermDetail
      v-model:show="showTermDetail"
      :term="selectedTerm"
    /></div></template><script setup lang="ts">import { ref, computed } from 'vue';
import { useBlackwordStore } from '../stores/blackwordStore';
import { useUserStore } from '../stores/userStore';
import TermDetail from './TermDetail.vue';
import type { BlackWord } from '../types';

const blackwordStore = useBlackwordStore();
const userStore = useUserStore();

const inputText = ref('');
const results = ref<any[]>([]);
const isTranslating = ref(false);
const showTermDetail = ref(false);
const selectedTerm = ref<BlackWord>();

// 翻译功能
const translate = () => {
  if (!inputText.value.trim()) return;
  
  isTranslating.value = true;
  
  // 匹配术语
  const matchedResults = blackwordStore.matchTerms(inputText.value);
  results.value = matchedResults;
  
  // 保存历史记录
  const matchedTermIds = matchedResults.map(r => {
    const term = blackwordStore.getTermDetail(r.term);
    return term?.id || '';
  }).filter(Boolean);
  
  userStore.addHistory(inputText.value, matchedTermIds);
  
  isTranslating.value = false;
};

// 整句翻译结果
const translatedText = computed(() => {
  if (!inputText.value || results.value.length === 0) return '';
  
  let text = inputText.value;
  
  // 按术语长度降序排序，优先替换长术语
  const sortedTerms = results.value.sort((a, b) => b.term.length - a.term.length);
  
  sortedTerms.forEach(result => {
    const regex = new RegExp(`${result.term}`, 'gi');
    // 使用第一个释义作为替换文本
    text = text.replace(regex, result.meanings[0]);
  });
  
  return text;
});

</script><style scoped>.translation-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.translate-btn {
  height: 50px;
  font-size: 16px;
}

.result-section {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
}

.result-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.translated-text {
  background-color: #e8f4fd;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #333;
  font-size: 16px;
}

.result-item {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.result-item:last-child {
  margin-bottom: 0;
}

.term {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.category {
  margin-bottom: 10px;
}

.category-tag {
  display: inline-block;
  background-color: #e8f4fd;
  color: #1989fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.meanings {
  line-height: 1.6;
}

.meanings p {
  margin: 5px 0;
  color: #666;
}

.no-result {
  text-align: center;
  padding: 40px;
  color: #999;
}

</style>