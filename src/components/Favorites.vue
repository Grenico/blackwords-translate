<template><div class="favorites-page"><div class="header"><h1>我的收藏</h1><van-button type="danger" size="small" @click="clearFavorites">清空收藏</van-button></div><div class="content"><van-empty v-if="favorites.length === 0" description="暂无收藏术语" /><van-list
        v-else
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      ><van-cell
          v-for="item in displayFavorites"
          :key="item.id"
          :title="item.term"
          :value="item.meaning"
          is-link
          @click="viewFavorite"
        ><template #right-icon><van-button type="danger" size="small" plain @click.stop="removeFavorite(item.id)">删除</van-button></template></van-cell><van-popup v-model:show="showClearConfirm" position="center" :style="{ width: '80%', maxWidth: '300px' }"><div class="confirm-dialog"><h3>确认清空</h3><p>确定要清空所有收藏吗？</p><div class="actions"><van-button type="default" @click="showClearConfirm = false">取消</van-button><van-button type="danger" @click="confirmClear">确定</van-button></div></div></van-popup></van-list></div></div></template><script setup lang="ts">import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const loading = ref(false);
const finished = ref(true);
const showClearConfirm = ref(false);

// 收藏列表
const favorites = computed(() => userStore.favorites);

// 分页显示
const displayCount = ref(20);
const displayFavorites = computed(() => favorites.value.slice(0, displayCount.value));

// 加载更多
const loadMore = () => {
  loading.value = true;
  setTimeout(() => {
    displayCount.value += 20;
    loading.value = false;
    finished.value = displayCount.value >= favorites.value.length;
  }, 500);
};

// 查看收藏术语
const viewFavorite = () => {
  // 这里可以触发术语详情弹窗
};

// 删除收藏
const removeFavorite = (id: string) => {
  userStore.removeFavorite(id);
};

// 清空收藏确认
const clearFavorites = () => {
  showClearConfirm.value = true;
};

// 确认清空
const confirmClear = () => {
  userStore.favorites.forEach(favorite => {
    userStore.removeFavorite(favorite.id);
  });
  showClearConfirm.value = false;
};

onMounted(() => {
  finished.value = displayCount.value >= favorites.value.length;
});</script><style scoped>.favorites-page {
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