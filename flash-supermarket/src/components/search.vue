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
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import topBar from "@/components/topBar.vue"
import PostCard from "@/components/post.vue"
const route = useRoute()
const router = useRouter()
const query = ref('')
defineComponent({
    components: {
        topBar
    }
});
const initials = [
    '按匹配程度递减',
    '按点赞量递减',
    '按发表时间递减',
]
const options = Array.from({ length: 3 }).map((_, idx) => ({
    value: `${idx}`,
    label: `${initials[idx % 10]}`,
}))
const value = ref(options[0].value);
const gotoSearch = () => {
  router.replace({
    path: '/search',
    query: {
      q: query.value
    }
  });
}
onMounted(() => {
  query.value = route.query.q || ''
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
</style>