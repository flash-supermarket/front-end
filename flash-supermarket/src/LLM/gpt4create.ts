import { chatWithGPT } from '@/LLM/gptapi'
import { chooseGoodsSystem, fixQuerySystem, goods2ESSystem, generateTitleAndDesSystem } from '@/LLM/prompts'

export async function fixQuery(query: string) {
    let reply = await chatWithGPT(fixQuerySystem, query)
    let goods_list: string[] = reply['goods_list'];
    if (!goods_list || goods_list.length === 0) {
        console.log(`query ${query} is not suitable or LLM is wrong, reply is ${reply}`);
        return []
    }
    return goods_list;
}

export async function goods2ES(goods: string) {
    let reply = await chatWithGPT(goods2ESSystem, goods);
    return reply;
}

export async function chooseGoods(name_list: string[], query: string) {
    let userPrompt = `query:
${query}

results:
`
    for(let i = 0;i<name_list.length;i++) {
        userPrompt += `${i}.\n${name_list[i]}\n`
    }

    let reply = await chatWithGPT(chooseGoodsSystem, userPrompt);
    if (reply['index'] && typeof reply['index'] == 'number') {
        return reply['index'];
    }
    else {
        return 0;
    }
}

export async function generateTitleAndDes(name_list: string[], query: string) {
    let userPrompt = `用户的要求：
${query}

用户选择的商品列表：
`
    for(let i = 0;i<name_list.length;i++) {
        userPrompt += `${name_list[i]}\n`
    }
    let reply = await chatWithGPT(generateTitleAndDesSystem, userPrompt);
    let title: string = ''
    let description: string = ''
    if (reply['title'] && typeof reply['title'] == 'string') {
        title = reply['title'];
    }
    if (reply['description'] && typeof reply['description'] == 'string') {
        description = reply['description'];
    }
    return {
        "title": title,
        "description": description
    }
}
