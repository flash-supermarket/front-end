<template>
    <div class="container">
        <topBar :opacity-value="1" style="width: 100%; height: 60px;" />
        <div class="main" :style="{ opacity: bgOpacity }">
            <div class="title">
                <span>S</span>
                <span>h</span>
                <span>o</span>
                <span>p</span>
                <span>H</span>
                <span>u</span>
                <span>b</span>
            </div>
            <el-autocomplete ref="autocompleteRef" class="search-box" style="position:relative; 
                width: min(60%, 600px); 
                top: 300px; 
                left: calc(50% - (min(60%, 600px) + 60px)/ 2);
                height: 50px;"
                input-style="
                    height:40px; 
                    font-size:20px
                    background-color: transparent;" 
                :popper-options="{
                    modifiers: [
                        {
                            name: 'computeStyles',
                            options: {
                            gpuAcceleration: false,
                            adaptive: false
                            }
                        }
                    ]
                }" 
                :fit-input-width="true"
                v-model="state" :fetch-suggestions="querySearchAsync" placeholder="" @select="handleSelect"
             @keydown.enter="gotoSearch()" />
            <el-button type="primary" style="position: relative; 
                width:60px; 
                top: 300px; 
                left: calc(50% - (min(60%, 600px) + 60px)/ 2);
                height: 43px;
                background-color: #f8b811;
                border-color: #f8b811;" 
                @click="gotoSearch()">
                <el-icon class="el-icon--search" style="font-size: 20px;">
                    <Search />
                </el-icon>
            </el-button>
        </div>
        <div class="recommend">
          <div class="recommend-container">
            <el-tabs v-model="activeTab" class="recommend-tabs">
              <el-tab-pane label="推荐内容" name="default">
                <div class="tab-scroll">
                  <div class="tab-content">
                    <PostCard v-for="(post, i) in randomReco" :key="i" :post="post" />
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="关注的人" name="following">
                <div class="tab-scroll">
                  <div class="tab-content">
                    <PostCard v-for="(post, i) in follow_posts" :key="i" :post="post" />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="recommend-refreash" @click="refresh">
            点击刷新
          </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineComponent, computed, triggerRef } from 'vue'
import { useRouter } from 'vue-router';
import topBar from "@/components/topBar.vue"
import PostCard from "@/components/post.vue"
import { searchArticalIds4Home } from "@/es/createArtical"
defineComponent({
    components: {
        topBar
    }
});
interface LinkItem {
  value: string
  link: string
}
const recommend_posts = ref<string[]>([])
const follow_posts = [1, 1, 1, 1, 1, 1, 1, 1, 1]
const router = useRouter()
const links = ref<LinkItem[]>([])
const state = ref('')
const bgOpacity = ref(1)
const container = ref(null)
const autocompleteRef = ref(null)
const activeTab = ref('default')
const handleScroll = () => {
  const scrollTop = container.value.scrollTop;
  const clientHeight = container.value.clientHeight;
  const scrollPercent = scrollTop / clientHeight;
  if (scrollPercent < 0.5) {
    bgOpacity.value = 1
  }
  else if (scrollPercent < 1) {
    bgOpacity.value = (1 - scrollPercent) * 10 / 5
  }
  else {
    bgOpacity.value = 0
  }
};
const refresh = () => {
  console.log(recommend_posts.value);
  recommend_posts.value = shuffleArray([...recommend_posts.value]);
  console.log(recommend_posts.value);
  triggerRef(recommend_posts)
  triggerRef(randomReco)
}
const randomReco = computed(() => {
    return recommend_posts.value.slice(0, 9)
})
async function getLinks() {
    // let works = [];
    // let tmp;
    // if (state.value.length == 0) {
    //     tmp = await getRandomWork();
    // }
    // else {
    //     tmp = await searchWorksByTitle(state.value);
    // }
    // for (let work of tmp.hits.hits) {
    //     works.push({
    //     value: work._source.title,
    //     link: ''
    //     })
    // }
    // return works;
    return [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
        { value: 'babel', link: 'https://github.com/babel/babel' },
    ];
}

const createFilter = (queryString: string) => {
    return (restaurant: LinkItem) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}
const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
    links.value = await getLinks();
    const results = queryString
        ? links.value.filter(createFilter(queryString))
        : links.value
    cb(results)
}
const gotoSearch = () => {
  router.push({
    path: '/search',
    query: {
      q: state.value
    }
  });
}
const handleSelect = (item: Record<string, any>) => {
    console.log(item)
}
function shuffleArray<T>(array: T[]){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 随机选取一个索引
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
    }
    return array
}

onMounted(async () => {
    if (container.value) { container.value.addEventListener('scroll', handleScroll); }
    try {
      const res = await searchArticalIds4Home();
      recommend_posts.value = res || []
      recommend_posts.value = shuffleArray(recommend_posts.value);
    } catch (error) {
      console.error('获取数据失败:', error)
    }
});
</script>

<style scoped>
.el-scrollbar {
  width: 600px !important;
}

.container {
  background-color: rgb(244, 245, 247);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;
  /* IE/Edge 隐藏滚动条 */
}

.main {
  position: absolute;
  left: 0;
  width: 100%;
  height: 400px;
  top: 0;
}

.search-box {
  border: 1px solid #5698c3;
  border-radius: 6px;
  background-color: transparent;
  color: #5698c3;
  padding: 6px 10px;
}

.search-box input {
  background-color: transparent !important;
  border: none !important;
  color: #5698c3;
}
.title {
  font-size: 130px;
  color: #5698c3;
  position: absolute;
  top: calc(min(100px, 25vh));
  width: fit-content;
  transform: translateX(-50%);
  left: 50%;
}

.title>span {
  color: #5698c3;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: calc(min(130px, 10vw));
  font-weight: bold;
  animation: textColorChange 6s infinite alternate;
}

@keyframes textColorChange {
  0% {
    color: #11659a;
  }

  25% {
    color: #5698c3;
  }

  50% {
    color: #1e3b7a;
  }

  75% {
    color: #5698c3;
  }

  100% {
    color: #11659a;
  }
}

.title>span:nth-child(1) {
  animation-delay: 0s;
}

.title>span:nth-child(2) {
  animation-delay: 0.5s;
}

.title>span:nth-child(3) {
  animation-delay: 1.0s;
}

.title>span:nth-child(4) {
  animation-delay: 1.5s;
}

.title>span:nth-child(5) {
  animation-delay: 2.0s;
}

.title>span:nth-child(6) {
  animation-delay: 2.5s;
}

.title>span:nth-child(7) {
  animation-delay: 3.0s;
}

.recommend {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1000px;
  top: 400px;
}

.recommend-container {
  position: absolute;
  left: max(5%, 50% - 525px);
  width: min(calc(90% - 40px), 1010px);
  padding-left: 20px;
  padding-right: 20px;
  height: 970px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.recommend-tabs {
  font-family: Arial, Helvetica, sans-serif;
  --el-tabs-header-height: 48px;
}
.tab-scroll {
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none; /* Firefox */
}
.tab-content {
  padding: 20px;
  min-width: 1000px;
  color: #333;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.recommend-refreash {
  font-family: Arial, Helvetica, sans-serif;
  position: absolute;
  color: black;
  top: 930px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  cursor: pointer;
  width: max-content; 
}
.recommend-refreash:hover {
  color: #f8b811;
  text-decoration: underline;
}
</style>