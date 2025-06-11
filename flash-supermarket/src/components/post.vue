<template>
    <div class="post-card">
      <el-carousel
        :autoplay="false"
        trigger="hover"
        height="180px"
        arrow="hover"
        indicator-position="none"
        class="post-carousel"
        @click="goArticle"
      >
        <el-carousel-item
          v-for="(img, i) in validImages"
          :key="i"
        >
          <img :src="img" class="post-image" />
        </el-carousel-item>
      </el-carousel>
  
      <div class="post-title ellipsis" @click="goArticle">
        {{ validTitle }}
      </div>
  
      <div class="post-footer">
        <el-avatar class="useravatar" :src="validAvatar" size="small" @click="goUser"/>
        <span class="username" @click="goUser">{{ validUsername }}</span>
        <el-button class="like-button" type="text" size="small" icon @click="likeButtonFunc">
          <img v-if="!like_button" :src="heart" style="width: 14px;height: 14px;margin-right: 5px;" />
          <img v-if="like_button" :src="heartfill" style="width: 14px;height: 14px;margin-right: 5px;" />
          <span style="font-size: 14px; color: black">{{ validLikeNumber }}</span>
        </el-button>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElAvatar, ElCarousel, ElCarouselItem } from 'element-plus'
import { getUsername } from "../http/cookie";
import { searchArtical4Home } from "@/es/createArtical"
import { getPostLike, likePost, unlikePost } from "@/apis/post"
import heart from '../assets/heart.svg'
import heartfill from '../assets/heart.fill.svg'
import avatar from '../assets/avatar.png'
import 'element-plus/es/components/avatar/style/css'
import 'element-plus/es/components/carousel/style/css'
import 'element-plus/es/components/carousel-item/style/css'
const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})
const like_button = ref(false)
const resp = ref({})
const likeNumber = ref(null)
const DEFAULT_IMGS = []
const DEFAULT_AVATAR = avatar
const DEFAULT_TITLE = '无标题'
const DEFAULT_USERNAME = '匿名用户'
watch(
  () => props.post, // 监听 post 的变化
  async (newPost) => {
    try {
      const articles = await searchArtical4Home(newPost);
      resp.value = articles;
      const likes = await getPostLike(newPost);
      likeNumber.value = likes.data.length;
      const username = getUsername();
      like_button.value = likes.data.includes(username);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  },
  { immediate: true } // 初次也执行一次（等价于 onMounted）
)

const goUser = () => {
  console.log("go user!")
  const username = resp.value.authorName || DEFAULT_USERNAME;
  window.location.href = `/person/${username}`;
}
const goArticle = () => {
  window.location.href = `/article/${props.post}`;
}
const likeButtonFunc = async () => {
  try {
    if (like_button.value) {
      await unlikePost({
        "userName": getUsername(),
        "repositoryId": props.post
      });
    } else {
      await likePost({
        "userName": getUsername(),
        "repositoryId": props.post
      });
    }
    const likes = await getPostLike(props.post);
    likeNumber.value = likes.data.length;
    const username = await getUsername();
    like_button.value = likes.data.includes(username);
  } catch (error) {
    console.error(like_button.value ? '取消点赞失败:' : '点赞失败:', error);
  }
};
const validImages = computed(() => {
    const imgs = resp.value.images
    return Array.isArray(imgs) && imgs.length > 0 ? imgs : DEFAULT_IMGS
})
const validAvatar = computed(() => {
    return DEFAULT_AVATAR
})
const validTitle = computed(() => {
    return resp.value.title || DEFAULT_TITLE
}) 
const validUsername = computed(() => {
    return resp.value.authorName || DEFAULT_USERNAME
})
const validLikeNumber = computed(() => {
  return typeof likeNumber.value === 'number' ? likeNumber.value : ""
})
onMounted(async () => {
  try {
      const articles = await searchArtical4Home(props.post);
      resp.value = articles;
      const likes = await getPostLike(props.post);
      likeNumber.value = likes.data.length;
      const username = getUsername();
      like_button.value = likes.data.includes(username);
    } catch (error) {
      console.error('获取数据失败:', error)
    }
})
</script>

<style scoped>
.post-card {
    width: 300px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
}

.post-carousel {
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
}

.post-image {
    width: 100%;
    height: 180px;
    object-fit: fill;
    display: block;
}

.post-title {
    padding: 8px 12px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
}

.post-footer {
    display: flex;
    align-items: center;
    padding: 8px 12px 12px;
    gap: 8px;
    font-size: 14px;
    color: #666;
}

.username {
    font-weight: 500;
    color: #333;
    margin-right: auto;
    cursor: pointer;
}

.useravatar {
  cursor: pointer;
}
.likes {
    color: #e57373;
}

.like-button {
  cursor: pointer;
}

.ellipsis {
  white-space: nowrap;          /* 不换行 */
  overflow: hidden;             /* 超出容器隐藏 */
  text-overflow: ellipsis;      /* 超出部分用...显示 */
}
</style>
