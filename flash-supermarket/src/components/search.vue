<template>
    <div class="container">
        <topBar :opacity-value="1" style="width: 100%; height: 60px;"/>
        <div class="search-block">
            <el-input v-model="query" 
                class="search-input" 
                placeholder="请输入" 
                @keyup.enter="gotoSearch">
            </el-input>
            <el-button type="primary" 
                class="search-button"
                @click="gotoSearch()">
                <el-icon class="el-icon--search" style="font-size: 20px;">
                    <Search/>
                </el-icon>
            </el-button>
            <el-select-v2 
                v-model="value" 
                :options="options"
                placeholder="请选择"
                class="search-select"/>
        </div>
        <div class="search-result">
            <div class="search-container">
                <div class="tab-scroll">
                    <div class="tab-content">
                        <PostCard v-for="post in search_article" :key="post" :post="post" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import topBar from "@/components/topBar.vue"
import PostCard from "@/components/post.vue"
import { searchArticalIdsByQuery } from "@/es/createArtical"
import { getPostLike } from "@/apis/post"
const route = useRoute()
const router = useRouter()
const query = ref('')
const search_result = ref([])
const search_article = computed(() => search_result.value)
defineComponent({
    components: {
        topBar
    }
});
const initials = [
    '按匹配程度递减',
    '按点赞量递减'
]
const options = Array.from({ length: 2 }).map((_, idx) => ({
    value: `${idx}`,
    label: `${initials[idx]}`,
}))
const value = ref(options[0].value);
watch(value, async (newval, oldval) => {
  if (oldval !== newval) {
    if (newval === '0') {
      try {
        const res = await searchArticalIdsByQuery(query.value);
        search_result.value = res;
      } catch (err) {
        console.error('Search error:', err);
      }
    } 
    else if (newval === '1') {
        try {
        const articles = search_result.value; // number[]
        const articlesWithLikes = await Promise.all(
          articles.map(async (id) => {
            const likeCount = await getPostLike(id);
            return { id, likeCount: likeCount.data.length };
          })
        );
        articlesWithLikes.sort((a, b) => b.likeCount - a.likeCount);
        search_result.value = articlesWithLikes.map(item => item.id);
        console.log('Sorted articles by likes:', articlesWithLikes);
      } catch (err) {
        console.error('点赞排序失败:', err);
      }
    }
  }
});


const gotoSearch = () => {
  router.replace({
    path: '/search',
    query: {
      q: query.value
    }
  });
  searchArticalIdsByQuery(query.value).then((res) => {
    search_result.value = res;
  }).catch((err) => {
    console.error('Search error:', err);
  });
}
onMounted(() => {
  query.value = route.query.q || ''
  searchArticalIdsByQuery(query.value).then((res) => {
    search_result.value = res;
  }).catch((err) => {
    console.error('Search error:', err);
  });
})
</script>

<style scoped>
.container {
  background-color: rgb(244, 245, 247);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.search-block {
    position: absolute;
    width: 100%;
    top: 100px;
}
.search-input {
    position: absolute;
    right: max(5% + 250px, 50% - 275px);
    width: 40%;
    height: 32px;
}
.search-button {
    position: absolute;
    right: max(5% + 200px, 50% - 325px);
    width: 32px;
    height: 32px;
    background-color: #f8b811;
    border-color: #f8b811;
}
.search-select {
    position: absolute;
    right: max(5%, 50% - 525px);
    width: 150px;
}
.search-result {
    position: absolute;
    left: 0;
    width: 100%;
    min-height: 200px;
    top: 170px;
}

.search-container {
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
.tab-scroll {
margin-top: 30px;
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none; /* Firefox */
}
.tab-content {
  padding: 16px;
  min-width: 1000px;
  color: #333;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>