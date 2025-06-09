<template>
    <top-bar :opacityValue="1"></top-bar>
    <div style="height: 90%; overflow: auto;">
        <div
            style="height: 20%; padding: 1rem; flex-direction: column; ">
            <div
                style=" margin-left: 5%; width: 40%; height: 80%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 1rem; box-shadow: 0 0 4px rgba(0,0,0,0.1); resize: none; justify-content: center; align-items: center;">
                <div style="display: flex; justify-content: flex-end; height: 65%;">
                    <textarea v-model="inputText" placeholder="让AI帮你撰写帖子..."
                        style="width: 100%; height: 100%; padding: 0.5rem; border: 0px silver; border-radius: 1rem; resize: none; font-size: 20px; outline: none; "></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                    <button @click="handleSubmit"
                        style="margin-top: 0.3rem; padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; background-color: #007bff; color: white; cursor: pointer;">提交</button>
                </div>
            </div>
        </div>


        <!-- Bottom content area (70%) -->
        <div style="height: 70%; display: flex;">
            <!-- Left list (50%) -->
            <div style="flex: 1; overflow-y: auto; padding: 1rem; height: 100%;">
                <div v-for="(item, index) in leftList" :key="item.id"
                    style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border: 1px solid #ccc; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0,0,0,0.1);">
                    <div style="display: flex; width: 80%;">
                        <img :src="item.image" alt="item"
                            style="width: 50%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
                        <div style="display: flex; flex-direction: column; width: 50%;">
                            <span style="font-weight: bold;">商品名：{{ item.name }}</span>
                            <span style="font-size: 0.875rem; color: #666;">价格：{{ item.price }}</span>
                            <span style="font-size: 0.75rem; color: #999;">简介：{{ item.description[0] }}</span>
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
            <div style="flex: 1; padding: 1rem; overflow-y: auto; height: 100%;">
                <div style="text-align: center; margin-bottom: 1rem; justify-content: center; ">
                    <input v-model="searchText" type="text" placeholder="搜索..."
                        style="padding: 0.5rem; border: 1px solid #ccc; outline: none; border-radius: 1rem; box-shadow: 0 0 4px rgba(0,0,0,0.1); width: 66%;" 
                        @keydown.enter="handleChange"/>
                    <!-- <img src="../assets/icon/search.png" style="width: 30px; margin-top: 30px;" /> -->
                </div>
                <div v-for="item in rightList" :key="item.id"
                    style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border: 1px solid #ccc; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0,0,0,0.1);">
                    <div style="display: flex; width: 80%;">
                        <img :src="item.image" alt="item"
                            style="width: 50%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
                        <div style="display: flex; flex-direction: column; width: 50%;">
                            <span style="font-weight: bold;">商品名：{{ item.name }}</span>
                            <span style="font-size: 0.875rem; color: #666;">价格：{{ item.price }}</span>
                            <span style="font-size: 0.75rem; color: #999;">简介：{{ item.description[0] }}</span>
                        </div>
                    </div>
                    <!-- <button @click="addToLeft(item)" style="color: green;">添加</button> -->
                    <button @click="submitLeftList()" style="color: green;">添加</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import topBar from "@/components/topBar.vue";
import { searchAnyGoods, searchNGoods, searchQueryGoods } from "@/es/searchGoods"
import { chooseGoods, fixQuery, goods2ES } from '@/LLM/gpt4create';
import { insertArtical, search1Artical, searchArtical4Home } from "@/es/createArtical"

interface Item {
    id: number
    image: string
    name: string
    price: string
    description: string
    category: string
}

const inputText = ref('')
const searchText = ref('')

const handleSubmit = () => {
    generateArtical(inputText.value);
}

const handleChange = () => {
    searchGoods(searchText.value);
}

const leftList = ref<Item[]>([])
const rightList = ref<Item[]>([])

let mockUserName: string = 'lrl';
let mockTitle: string = 'test';
let mockDescription: string = '这是描述，我是你爹';
let mockArticalId: number = 1;

const submitLeftList = async () => {
    let itemList = JSON.stringify(leftList.value);
    let articalBody = {
        userName: mockUserName,
        title: mockTitle,
        description: mockDescription,
        id: mockArticalId,
        body: itemList
    }
    // insertArtical(articalBody);
    console.log(await searchArtical4Home());
}

const searchGoods = async (query: string) => {
    let goods = [];
    if (query === '') {
        goods = await searchNGoods(10);
    }
    else {
        goods = await searchQueryGoods(query);
    }
    rightList.value = []
    for (let good of goods) {
        rightList.value.push(goods2item(good))
    }
}

searchGoods('');

const goods2item = (goods): Item => {
    return {
        id: goods._id,
        image: goods._source.images[0].large,
        name: goods._source.title,
        price: goods._source.price,
        description: goods._source.description,
        category: goods._source.main_category
    }
}

const addToLeft = (item: Item) => {
    leftList.value.push(item);
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

const generateArtical = async (query: string) => {
    let failed_list = [];
    let good_list: string[] = await fixQuery(query);
    for (let goods of good_list) {
        let esQuery = await goods2ES(goods);
        searchText.value = goods;
        await searchLLMGoods(esQuery);

        let find_goods = [];
        for (let i = 0;i<10 && i < rightList.value.length;i++) {
            find_goods.push(rightList.value[i].name);
        }

        if (find_goods.length === 0) {
            failed_list.push(goods);
        }
        else {
            let index = await chooseGoods(find_goods, goods);
            leftList.value.push(rightList.value[index]);
        }
    }
}

const searchLLMGoods = async (query) => {
    let goods = await searchAnyGoods(query);
    rightList.value = []
    for (let good of goods) {
        rightList.value.push(goods2item(good))
    }
}
</script>

<style scoped>

</style>
