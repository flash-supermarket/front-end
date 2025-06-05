<template>
  <div style="height: 100vh; display: flex; flex-direction: column;">
    <!-- Top input area (30%) -->
    <div style="flex: 3; padding: 1rem; border-bottom: 1px solid #ccc; display: flex; align-items: center; justify-content: center;" @click="logGoods(2)">
      <input v-model="inputText" type="text" placeholder="Message ChatGPT..." style="width: 66%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 1rem; box-shadow: 0 0 4px rgba(0,0,0,0.1);" />
    </div>

    <!-- Bottom content area (70%) -->
    <div style="flex: 7; display: flex;">
      <!-- Left list (50%) -->
      <div style="flex: 1; overflow-y: auto; padding: 1rem; border-right: 1px solid #ccc;">
        <div v-for="(item, index) in leftList" :key="item.id" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border: 1px solid #ccc; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0,0,0,0.1);">
          <div style="display: flex; width: 80%;">
            <img :src="item.image" alt="item" style="width: 50%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
            <div style="display: flex; flex-direction: column; width: 50%;">
              <span style="font-weight: bold;">{{ item.name }}</span>
              <span style="font-size: 0.875rem; color: #666;">{{ item.price }}</span>
              <span style="font-size: 0.75rem; color: #999;">{{ item.description }}</span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <button @click="moveUp(index)" style="color: blue; margin-bottom: 0.25rem;">↑</button>
            <button @click="moveDown(index)" style="color: blue; margin-bottom: 0.25rem;">↓</button>
            <button @click="removeFromLeft(index)" style="color: red;">删除</button>
          </div>
        </div>
      </div>

      <!-- Right list (50%) -->
      <div style="flex: 1; padding: 1rem;">
        <div style="text-align: center; margin-bottom: 1rem;">
          <input v-model="searchText" type="text" placeholder="搜索..." style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 1rem; box-shadow: 0 0 4px rgba(0,0,0,0.1); width: 66%;" />
        </div>
        <div v-for="item in filteredRightList" :key="item.id" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border: 1px solid #ccc; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0,0,0,0.1);">
          <div style="display: flex; width: 80%;">
            <img :src="item.image" alt="item" style="width: 50%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
            <div style="display: flex; flex-direction: column; width: 50%;">
              <span style="font-weight: bold;">{{ item.name }}</span>
              <span style="font-size: 0.875rem; color: #666;">{{ item.price }}</span>
              <span style="font-size: 0.75rem; color: #999;">{{ item.description }}</span>
            </div>
          </div>
          <button @click="addToLeft(item)" style="color: green;">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { searchNGoods } from '@/es/searchGoods'

interface Item {
  id: number
  image: string
  name: string
  price: string
  description: string
}

const logGoods = (n) => {
    console.log(searchNGoods(n));
}

const inputText = ref('')
const searchText = ref('')

const leftList = ref<Item[]>([])
const rightList = ref<Item[]>([
  { id: 1, image: 'https://via.placeholder.com/50', name: '商品A', price: '¥100', description: '描述A' },
  { id: 2, image: 'https://via.placeholder.com/50', name: '商品B', price: '¥200', description: '描述B' },
  { id: 3, image: 'https://via.placeholder.com/50', name: '商品C', price: '¥300', description: '描述C' },
])

const filteredRightList = computed(() => {
  return rightList.value.filter(item => item.name.includes(searchText.value))
})

const addToLeft = (item: Item) => {
  if (!leftList.value.find(i => i.id === item.id)) {
    leftList.value.push(item)
  }
}

const removeFromLeft = (index: number) => {
  leftList.value.splice(index, 1)
}

const moveUp = (index: number) => {
  if (index > 0) {
    const temp = leftList.value[index - 1]
    leftList.value[index - 1] = leftList.value[index]
    leftList.value[index] = temp
  }
}

const moveDown = (index: number) => {
  if (index < leftList.value.length - 1) {
    const temp = leftList.value[index + 1]
    leftList.value[index + 1] = leftList.value[index]
    leftList.value[index] = temp
  }
}
</script>

<style scoped>
</style>
