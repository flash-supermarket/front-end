<template>
    <top-bar :opacityValue="1"></top-bar>
    <div class="create-article-container">
        <!-- Header Section with AI Assistant -->
        <div class="header-section">
            <div class="ai-assistant-panel">
                <div class="ai-header">
                    <div class="ai-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                            <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z" fill="currentColor"/>
                            <path d="M5 6L5.5 7.5L7 8L5.5 8.5L5 10L4.5 8.5L3 8L4.5 7.5L5 6Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3>AI 智能助手</h3>
                </div>
                <div class="ai-input-area">
                    <textarea 
                        v-model="inputText" 
                        placeholder="让AI帮你撰写帖子，描述你想要的商品组合..."
                        class="ai-textarea"
                        :disabled="canAskLLM"
                    ></textarea>
                    <el-button 
                        type="primary" 
                        @click="handleSubmit" 
                        class="ai-submit-btn"
                        :disabled="canAskLLM"
                        :loading="canAskLLM"
                    >
                        <span v-if="!canAskLLM">生成文章</span>
                        <span v-else>AI思考中...</span>
                    </el-button>
                </div>
            </div>
            
            <div class="article-info-panel">
                <div class="info-header">
                    <h3>文章信息</h3>
                </div>
                <div class="info-content">
                    <div class="title-input-group">
                        <label>文章标题</label>
                        <input 
                            v-model="titleText" 
                            placeholder="请输入文章标题..."
                            class="title-input"
                        />
                    </div>
                    <div class="description-input-group">
                        <label>文章简介</label>
                        <textarea 
                            v-model="descriptionText" 
                            placeholder="请输入文章简介..."
                            class="description-textarea"
                        ></textarea>
                    </div>
                    <el-button 
                        type="success" 
                        @click="submitLeftList" 
                        class="submit-article-btn"
                        :disabled="canAskLLM"
                    >
                        发布文章
                    </el-button>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Selected Products Panel -->
            <div class="selected-products-panel">
                <div class="panel-header">
                    <h3>已选商品 ({{ leftList.length }})</h3>
                    <div class="panel-actions">
                        <el-button size="small" type="info" @click="clearAll" :disabled="canAskLLM">
                            清空列表
                        </el-button>
                    </div>
                </div>
                <div class="products-container">
                    <div v-for="(item, index) in leftList" :key="item.id" class="product-card">
                        <div class="product-image">
                            <img :src="item.image" :alt="item.name" />
                            <div class="product-rank">{{ index + 1 }}</div>
                        </div>
                        <div class="product-info">
                            <h4 class="product-name">{{ reduceStrLen(item.name, 50) }}</h4>
                            <div class="product-price">¥{{ item.price }}</div>
                            <p class="product-description">{{ reduceStrLen(item.description.join(''), 100) }}</p>
                        </div>
                        <div class="product-actions">
                            <el-button @click="moveUp(index)" type="primary" size="small" :icon="Top" circle :disabled="canAskLLM || index === 0"/>
                            <el-button @click="moveDown(index)" type="primary" size="small" :icon="Bottom" circle :disabled="canAskLLM || index === leftList.length - 1"/>
                            <el-button @click="removeFromLeft(index)" type="danger" size="small" :icon="Minus" circle :disabled="canAskLLM"/>
                        </div>
                    </div>
                    <div v-if="leftList.length === 0" class="empty-state">
                        <div class="empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
                                <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H14V17H7V15Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <h4>暂无商品</h4>
                        <p>从右侧搜索并添加商品到您的文章</p>
                    </div>
                </div>
            </div>

            <!-- Search Panel -->
            <div class="search-panel">
                <div class="panel-header">
                    <h3>商品搜索</h3>
                </div>
                <div class="search-container">
                    <div class="search-input-group">
                        <el-input 
                            v-model="searchText" 
                            placeholder="搜索商品..."
                            class="search-input"
                            @keyup.enter="handleChange"
                        >
                            <template #append>
                                <el-button :icon="Search" @click="handleChange" :disabled="canAskLLM"/>
                            </template>
                        </el-input>
                    </div>
                    <div class="search-results">
                        <div v-for="item in rightList" :key="item.id" class="product-card search-result">
                            <div class="product-image">
                                <img :src="item.image" :alt="item.name" />
                            </div>
                            <div class="product-info">
                                <h4 class="product-name">{{ reduceStrLen(item.name, 50) }}</h4>
                                <div class="product-price">¥{{ item.price }}</div>
                                <p class="product-description">{{ reduceStrLen(item.description.join(''), 100) }}</p>
                            </div>
                            <div class="product-actions">
                                <el-button @click="addToLeft(item)" type="success" size="small" :icon="Plus" circle :disabled="canAskLLM"/>
                            </div>
                        </div>
                        <div v-if="rightList.length === 0" class="empty-state">
                            <div class="empty-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h4>暂无搜索结果</h4>
                            <p>尝试搜索其他关键词</p>
                        </div>
                    </div>
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
import { useRoute, useRouter } from 'vue-router';
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
const jumpRouter = useRouter()

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
                jumpRouter.push(`/article/${id + 1}`);
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
        }else{
            ElMessage({
            showClose: true,
            message: '编辑失败，请重试',
            type: 'error',
        })
        }
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
    for (let i = index;i<leftList.value.length - 1 ;i++) {
        leftList.value[i] = leftList.value[i + 1];
    }
    leftList.value.splice(leftList.value.length - 1, 1)
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

const clearAll = () => {
    leftList.value = [];
}

onMounted(() => {
    const param = router.params.repoId
    repoId.value = param ? parseInt(param as string) : -1
    console.log(repoId.value)
    if (repoId.value !== -1) {
        search1Artical(repoId.value).then(res => {
            console.log(res);
            titleText.value = "fuckBro";
            console.log(titleText.value);
            titleText.value = res._source.title;
            console.log(titleText.value)
            descriptionText.value = res._source.description;
            leftList.value = res._source.body;
            isEdit.value = true;
        })
    }

})

</script>

<style scoped>
.create-article-container {
    height: 90vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    overflow: hidden;
}

.header-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    height: 25%;
}

.ai-assistant-panel, .article-info-panel {
    flex: 1;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.ai-assistant-panel:hover, .article-info-panel:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.ai-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.ai-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: white;
}

.ai-icon svg {
    width: 24px;
    height: 24px;
}

.ai-header h3 {
    margin: 0;
    color: #333;
    font-weight: 600;
}

.ai-input-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ai-textarea {
    width: 100%;
    height: 80px;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    resize: none;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
}

.ai-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.ai-submit-btn {
    align-self: flex-end;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.ai-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.info-header h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-weight: 600;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.title-input-group, .description-input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.title-input-group label, .description-input-group label {
    font-weight: 600;
    color: #555;
    font-size: 14px;
}

.title-input {
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
}

.title-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.description-textarea {
    height: 80px;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    resize: none;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
}

.description-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-article-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.submit-article-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.main-content {
    display: flex;
    gap: 20px;
    height: 70%;
}

.selected-products-panel, .search-panel {
    flex: 1;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
}

.panel-header h3 {
    margin: 0;
    color: #333;
    font-weight: 600;
}

.products-container, .search-results {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
}

.products-container::-webkit-scrollbar, .search-results::-webkit-scrollbar {
    width: 6px;
}

.products-container::-webkit-scrollbar-track, .search-results::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.products-container::-webkit-scrollbar-thumb, .search-results::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.products-container::-webkit-scrollbar-thumb:hover, .search-results::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.product-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.product-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.product-card:hover::before {
    transform: scaleX(1);
}

.product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-image {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
}

.product-rank {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
}

.product-price {
    font-size: 18px;
    font-weight: bold;
    color: #e74c3c;
    margin-bottom: 5px;
}

.product-description {
    margin: 0;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
}

.product-actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-shrink: 0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #999;
    text-align: center;
}

.empty-icon {
    width: 60px;
    height: 60px;
    color: #ccc;
    margin-bottom: 15px;
}

.empty-icon svg {
    width: 100%;
    height: 100%;
}

.empty-state h4 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 600;
}

.empty-state p {
    margin: 0;
    font-size: 14px;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex: 1;
}

.search-input-group {
    margin-bottom: 10px;
}

.search-input {
    border-radius: 12px;
    overflow: hidden;
}

.search-input :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
    border-color: #667eea;
}

.search-input :deep(.el-input__wrapper.is-focus) {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-results {
    flex: 1;
}

/* Animation for new items */
.product-card {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Loading animation */
.ai-submit-btn:disabled {
    background: linear-gradient(135deg, #667eea, #764ba2);
    opacity: 0.7;
}

/* Responsive design */
@media (max-width: 1200px) {
    .header-section {
        flex-direction: column;
        height: auto;
    }
    
    .main-content {
        flex-direction: column;
        height: auto;
    }
    
    .selected-products-panel, .search-panel {
        height: 400px;
    }
}

@media (max-width: 768px) {
    .create-article-container {
        padding: 10px;
    }
    
    .product-card {
        flex-direction: column;
        text-align: center;
    }
    
    .product-actions {
        flex-direction: row;
        justify-content: center;
    }
}
</style>
