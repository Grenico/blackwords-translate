<script setup lang="ts">import { ref, computed, onMounted } from 'vue';
import Translation from './components/Translation.vue';
import History from './components/History.vue';
import Favorites from './components/Favorites.vue';
import { useUserStore } from './stores/userStore';

const userStore = useUserStore();
const active = ref('1');

// 初始化用户数据
onMounted(() => {
  userStore.initialize();
});

// 根据当前激活的标签页计算显示的组件
const currentPage = computed(() => {
  switch (active.value) {
    case '1':
      return Translation;
    case '2':
      return History;
    case '3':
      return Favorites;
    default:
      return Translation;
  }
});</script><template><div class="app"><component :is="currentPage" /><van-tabbar v-model="active" route><van-tabbar-item name="1" icon="home-o"><span>主页</span></van-tabbar-item><van-tabbar-item name="2" icon="clock-o"><span>历史</span></van-tabbar-item><van-tabbar-item name="3" icon="star-o"><span>收藏</span></van-tabbar-item></van-tabbar></div></template><style>* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
  padding-bottom: 50px;
}

.van-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}</style>
