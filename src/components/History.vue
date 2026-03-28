<template><div class="history-page"><div class="header"><h1>历史记录</h1><van-button type="danger" size="small" @click="clearHistory">清空历史</van-button></div><div class="content"><van-empty v-if="history.length === 0" description="暂无历史记录" /><van-list
        v-else
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      ><van-cell
          v-for="item in displayHistory"
          :key="item.id"
          :title="item.text"
          :value="formatTime(item.timestamp)"
          is-link
          @click="viewHistory"
        ></van-cell><van-popup v-model:show="showClearConfirm" position="center" :style="{ width: '80%', maxWidth: '300px' }"><div class="confirm-dialog"><h3>确认清空</h3><p>确定要清空所有历史记录吗？</p><div class="actions"><van-button type="default" @click="showClearConfirm = false">取消</van-button><van-button type="danger" @click="confirmClear">确定</van-button></div></div></van-popup></van-list></div></div></template><script setup lang="ts">import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const loading = ref(false);
const finished = ref(true);
const showClearConfirm = ref(false);

// 历史记录列表
const history = computed(() => userStore.history);

// 分页显示
const displayCount = ref(20);
const displayHistory = computed(() => history.value.slice(0, displayCount.value));

// 加载更多
const loadMore = () => {
  loading.value = true;
  setTimeout(() => {
    displayCount.value += 20;
    loading.value = false;
    finished.value = displayCount.value >= history.value.length;
  }, 500);
};

// 查看历史记录
const viewHistory = () => {
  // 这里可以触发父组件切换到翻译页面并显示对应的翻译结果
  // 暂时先简单处理，后续可以通过事件或路由实现
};

// 清空历史确认
const clearHistory = () => {
  showClearConfirm.value = true;
};

// 确认清空
const confirmClear = () => {
  userStore.clearHistory();
  showClearConfirm.value = false;
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  finished.value = displayCount.value >= history.value.length;
});</script><style scoped>.history-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.content {
  min-height: 400px;
}

.confirm-dialog {
  padding: 20px;
}

.confirm-dialog h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.confirm-dialog p {
  margin-bottom: 20px;
  color: #666;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.actions .van-button {
  flex: 1;
}</style>