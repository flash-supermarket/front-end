<template>
    <top-bar :opacityValue="1"></top-bar>
    <div style="height: 90%; overflow: auto;">
        <div style="height: 20%; padding: 1rem; display: flex;">
            <div
                style=" margin-left: 5%; width: 40%; height: 80%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 1rem; box-shadow: 0 0 4px rgba(0,0,0,0.1); resize: none; justify-content: center; align-items: center;">
                <div style="display: flex; justify-content: flex-end; height: 65%;">
                    <textarea v-model="inputText" placeholder="让AI帮你撰写帖子..."
                        style="width: 100%; height: 100%; padding: 0.5rem; border: 0px silver; border-radius: 1rem; resize: none; font-size: 20px; outline: none; "></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" @click="handleSubmit" style="margin-top: 0.3rem;"
                        :disabled="canAskLLM">提交</el-button>
                </div>
            </div>
            <div style=" margin-left: 5%; width: 45%; height: 80%; align-items: center;">
                <input v-model="titleText" placeholder="标题..."
                    style="font-size: 20px; font-weight: 700;width: 75%; padding: 0.5rem;border: 1px solid rgba(0, 0, 0, 0.1); resize: none; outline: none; " />
                <el-button type="primary" @click="submitLeftList" style="margin-left: 5%;">完成</el-button>
                <textarea v-model="descriptionText" placeholder="简介..."
                    style="margin-top: 10px;font-size: 16px; font-weight: 700;width: 100%; height: 60%; padding: 0.5rem;border: 1px solid rgba(0, 0, 0, 0.1); resize: none; outline: none; "></textarea>
            </div>
        </div>


        <!-- Bottom content area (70%) -->
        <div style="height: 70%; display: flex; width: 94%; margin-left: 3%;">
            <!-- Left list (50%) -->
            <div
                style="flex: 1; overflow-y: auto; padding: 1.3rem; height: 100%; border: 1px solid #ccc; border-radius: 3%; box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);">
                <div v-for="(item, index) in leftList" :key="item.id"
                    style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border: 1px solid #ccc; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0,0,0,0.1); padding: 2%;">
                    <div style="display: flex; width: 93%;">
                        <img :src="item.image" alt="item"
                            style="width: 45%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
                        <div style="display: flex; flex-direction: column; width: 50%; margin-left: 5%;">
                            <span style="font-weight: bold;">商品名：{{ reduceStrLen(item.name, 100) }}</span>
                            <span style="font-size: 0.875rem; color: #666;margin-top: 3px;">价格：{{ item.price }}</span>
                            <span style="font-size: 0.75rem; color: #999;margin-top: 3px;">简介：{{
                                reduceStrLen(item.description.join(''), 380) }}</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <el-button @click="moveUp(index)" type="primary" style="margin-bottom: 0.25rem;" :icon="Top"
                            circle />
                        <el-button @click="moveDown(index)" type="primary"
                            style="margin-bottom: 0.25rem; margin-left: 0px;" :icon="Bottom" circle />
                        <el-button @click="removeFromLeft(index)" type="danger" style="margin-left: 0px;" :icon="Minus"
                            circle />
                    </div>
                </div>
                <div v-if="leftList.length == 0"
                    style="width: 100%; height: 70%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <img src="../assets/no_result.png" alt="item"
                        style="width: 40%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
                    <span style="font-size: 30px; font-weight: 700;">暂无商品</span>
                </div>
            </div>

            <!-- Right list (50%) -->
            <div style="height: 10px; flex: 0.05;">

            </div>
            <div
                style="flex: 1; padding: 1.3rem; overflow-y: auto; height: 100%; border: 1px solid #ccc; border-radius: 3%; box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 1rem; justify-content: center; ">
                    <el-input v-model="searchText" style="max-width: 600px" placeholder="Please input"
                        class="input-with-select">
                        <template #append>
                            <el-button :icon="Search" @click="handleChange" />
                        </template>
                    </el-input>
                    <!-- <img src="../assets/icon/search.png" style="width: 30px; margin-top: 30px;" /> -->
                </div>
                <div v-for="item in rightList" :key="item.id"
                    style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border: 1px solid #ccc; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0,0,0,0.1); padding: 2%;">
                    <div style="display: flex; width: 93%;">
                        <img :src="item.image" alt="item"
                            style="width: 45%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
                        <div style="display: flex; flex-direction: column; width: 50%; margin-left: 5%;">
                            <span style="font-weight: bold;">商品名：{{ reduceStrLen(item.name, 100) }}</span>
                            <span style="font-size: 0.875rem; color: #666; margin-top: 3px;">价格：{{ item.price }}</span>
                            <span style="font-size: 0.75rem; color: #999; margin-top: 3px;">简介：{{
                                reduceStrLen(item.description.join(''), 380) }}</span>
                        </div>
                    </div>
                    <el-button @click="addToLeft(item)" type="success" :icon="Plus" circle />
                </div>
                <div v-if="rightList.length == 0"
                    style="width: 100%; height: 70%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <img src="../assets/no_result.png" alt="item"
                        style="width: 40%; height: auto; object-fit: contain; margin-right: 0.5rem;" />
                    <span style="font-size: 30px; font-weight: 700;">暂无商品</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import topBar from "@/components/topBar.vue";
import { searchAnyGoods, searchNGoods, searchQueryGoods } from "@/es/searchGoods"
import { chooseGoods, fixQuery, goods2ES, generateTitleAndDes } from '@/LLM/gpt4create';
import { alterArticle, getArticalNum, insertArtical } from "@/es/createArtical"
import { Plus, Minus, Top, Bottom, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'
import { getUsername } from '@/http/cookie'
import { useRoute } from 'vue-router';
import { search1Artical } from '@/es/createArtical'

interface Item {
    id: number
    image: string
    name: string
    price: string
    description: string[]
    category: string
}

const canAskLLM = ref(false);

const titleText = ref('')
const descriptionText = ref('')
const inputText = ref('')
const searchText = ref('')
const isEdit = ref(false)
const router = useRoute();
const repoId = ref(-1)


const handleSubmit = async () => {
    canAskLLM.value = true;
    await generateArtical(inputText.value);
    canAskLLM.value = false;
}

const handleChange = () => {
    searchGoods(searchText.value);
}

const leftList = ref<Item[]>([])
const rightList = ref<Item[]>([])

const submitLeftList = async () => {
    let userName = getUsername();
    if (typeof userName != 'string' || userName == '') {
        ElMessage({
            showClose: true,
            message: '未登录',
            type: 'error',
        })
        return;
    }
    if (titleText.value == '') {
        ElMessage({
            showClose: true,
            message: '文章标题不能为空',
            type: 'error',
        })
        return;
    }
    if (descriptionText.value == '') {
        ElMessage({
            showClose: true,
            message: '文章简介不能为空',
            type: 'error',
        })
        return;
    }
    if (leftList.value.length == 0) {
        ElMessage({
            showClose: true,
            message: '商品列表不能为空',
            type: 'error',
        })
        return;
    }

    let itemList = JSON.stringify(leftList.value);
    console.log(isEdit.value);
    if (isEdit.value == false) {
        let id = await getArticalNum();
        if (typeof id == 'number') {
            let articalBody = {
                userName: userName,
                title: titleText.value,
                description: descriptionText.value,
                id: id + 1,
                body: itemList
            }
            if (await insertArtical(articalBody)) {
                ElMessage({
                    showClose: true,
                    message: '创建成功',
                    type: 'success',
                })
                return;
            }
        }
        ElMessage({
            showClose: true,
            message: '创建失败，请重试',
            type: 'error',
        })
    } else {//编辑问卷
        let articalBody = {
            userName: userName,
            title: titleText.value,
            description: descriptionText.value,
            id: repoId.value,
            body: itemList
        }
        if (await alterArticle(articalBody)) {
            ElMessage({
                showClose: true,
                message: '编辑成功',
                type: 'success',
            })
            window.location.href = `/article/${repoId.value}`
        }
        ElMessage({
            showClose: true,
            message: '编辑失败，请重试',
            type: 'error',
        })

    }

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

const reduceStrLen = (str: string, maxLength: number) => {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength) + '...';
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
        for (let i = 0; i < 10 && i < rightList.value.length; i++) {
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

    let choosedGoods: string[] = []
    for (let choosedGood of leftList.value) {
        choosedGoods.push(choosedGood.name);
    }
    let output = await generateTitleAndDes(choosedGoods, query);
    titleText.value = output['title'];
    descriptionText.value = output['description'];
}

const searchLLMGoods = async (query) => {
    let goods = await searchAnyGoods(query);
    rightList.value = []
    for (let good of goods) {
        rightList.value.push(goods2item(good))
    }
}

onMounted(() => {
    const param = router.params.repoId
    repoId.value = param ? parseInt(param as string) : -1
    console.log(repoId.value)
    if (repoId.value !== -1) {
        search1Artical(repoId.value).then(res => {
            console.log(res);
            titleText.value = res._source.title;
            descriptionText.value = res._source.description;
            leftList.value = res._source.body;
            isEdit.value = true;
        })
    }

})

</script>

<style scoped></style>
