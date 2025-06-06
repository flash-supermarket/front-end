<template>
    <div class="post-card">
      <el-carousel
        :autoplay="false"
        trigger="hover"
        height="180px"
        arrow="hover"
        indicator-position="none"
        class="post-carousel"
      >
        <el-carousel-item
          v-for="(img, i) in validImages"
          :key="i"
        >
          <img :src="img" class="post-image" />
        </el-carousel-item>
      </el-carousel>
  
      <div class="post-title">
        {{ validTitle }}
      </div>
  
      <div class="post-footer">
        <el-avatar
          :src="validAvatar"
          size="small"
        />
        <span class="username">{{ validUsername }}</span>
        <el-button
          class="like-button"
          type="text"
          size="small"
          icon
        >
          <img :src="heart" style="
            width: 14px;
            height: 14px;
            margin-right: 5px;
          " />
          <span style="font-size: 14px; color: black">{{ validLikes }}</span>
        </el-button>
      </div>
    </div>
  </template>
  
<script setup>
import { computed } from 'vue'
import { ElAvatar, ElCarousel, ElCarouselItem } from 'element-plus'
import heart from '../assets/heart.svg'
import avatar from '../assets/avatar.png'
import 'element-plus/es/components/avatar/style/css'
import 'element-plus/es/components/carousel/style/css'
import 'element-plus/es/components/carousel-item/style/css'

const props = defineProps({
    post: {
        type: String,
        required: true
    }
})

const DEFAULT_IMGS = ['https://m.media-amazon.com/images/I/51tOc1LyXzL._AC_.jpg', 'https://m.media-amazon.com/images/I/41mGlnnob6L._AC_.jpg']
const DEFAULT_AVATAR = avatar
const DEFAULT_TITLE = '您的家装必备小清单'
const DEFAULT_USERNAME = '家装高手'
const DEFAULT_LIKES = 0
const validImages = computed(() => {
    const imgs = props.post?.images
    return Array.isArray(imgs) && imgs.length > 0 ? imgs : DEFAULT_IMGS
})
const validAvatar = computed(() => {
    return props.post?.avatar || DEFAULT_AVATAR
})
const validTitle = computed(() => {
    return props.post?.title || DEFAULT_TITLE
}) 
const validUsername = computed(() => {
    return props.post?.username || DEFAULT_USERNAME
})
const validLikes = computed(() => {
    const likes = props.post?.likes
    return typeof likes === 'number' ? likes : DEFAULT_LIKES
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
}

.likes {
    color: #e57373;
}
</style>
