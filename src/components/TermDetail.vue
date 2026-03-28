<template><van-action-sheet :show="show" :actions="actions" @select="onSelect" @close="close"/><van-popup :show="showPc" position="center" :style="{ width: '80%', maxWidth: '500px' }" @close="close"><div class="term-detail"><h3>{{ term?.term }}</h3><div class="category" v-if="term?.category.length"><span v-for="cat in term.category" :key="cat" class="category-tag">{{ cat }}</span></div><div class="meanings"><h4>释义</h4><ul><li v-for="(meaning, index) in term?.meanings" :key="index">{{ meaning }}</li></ul></div><div class="examples" v-if="term?.examples.length"><h4>例句</h4><p>{{ term.examples[0] }}</p></div><div class="risk" v-if="term?.risk"><h4>提示</h4><p>{{ term.risk }}</p></div><div class="actions"><van-button type="primary" @click="toggleFavorite">{{ isFavorite ? '取消收藏' : '收藏' }}</van-button><van-button @click="close">关闭</van-button></div></div></van-popup></template><script setup lang="ts">import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import type { BlackWord } from '../types';

const props = defineProps<{
  show: boolean;
  term: BlackWord | undefined;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const userStore = useUserStore();
const isMobile = ref(false);
const showPc = ref(false);

// 移动端actions
const actions = computed(() => {
  if (!props.term) return [];
  
  return [
    { name: props.term.term, subname: props.term.meanings[0], disabled: true },
    ...props.term.category.map(cat => ({ name: `场景: ${cat}`, disabled: true })),
    { name: '例句', subname: props.term.examples[0], disabled: true },
    { name: '提示', subname: props.term.risk, disabled: true },
    { name: isFavorite ? '取消收藏' : '收藏', type: 'primary' },
    { name: '关闭', type: 'default' },
  ];
});

// 判断是否已收藏
const isFavorite = computed(() => {
  return props.term ? userStore.isFavorite(props.term.id) : false;
});

// 切换收藏状态
const toggleFavorite = () => {
  if (!props.term) return;
  
  if (isFavorite.value) {
    userStore.removeFavorite(props.term.id);
  } else {
    userStore.addFavorite(props.term.id, props.term.term, props.term.meanings[0], props.term.category);
  }
};

// 关闭弹窗
const close = () => {
  emit('update:show', false);
};

// 移动端action选择
const onSelect = (action: any) => {
  if (action.name === '关闭') {
    close();
  } else if (action.name.includes('收藏')) {
    toggleFavorite();
  }
};

// 检测设备类型
onMounted(() => {
  isMobile.value = window.innerWidth< 768;
  if (isMobile.value) {
    showPc.value = false;
  } else {
    showPc.value = props.show;
  }

  window.addEventListener('resize', () =>{
    isMobile.value = window.innerWidth< 768;
    showPc.value = !isMobile.value && props.show;
  });
});</script><style scoped>.term-detail {
  padding: 20px;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.category {
  margin-bottom: 15px;
}

.category-tag {
  display: inline-block;
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.meanings,
.examples,
.risk {
  margin-bottom: 20px;
}

h4 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
  line-height: 1.5;
}

p {
  line-height: 1.5;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions .van-button {
  flex: 1;
}</style>