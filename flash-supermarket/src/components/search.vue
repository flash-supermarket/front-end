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
                size=""
                style="width: 180px; float: right; margin-top:-5px;" />
                    
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
    right: 100px;
    width: min(60%, 600px);
    height: 40px;
}
.search-button {
    position: absolute;
    right: 50px;
    width: 50px;
    height: 40px;
    background-color: #f8b811;
    border-color: #f8b811;
}
</style>