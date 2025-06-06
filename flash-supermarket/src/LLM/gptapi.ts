import axios from 'axios';

const apiKey = 'sk-2f734c45c1884ce2811340df1707ee4e';  // 你也可以直接写死：const apiKey = 'sk-...';
const apiBase = 'https://api.deepseek.com';

if (!apiKey) {
    throw new Error('请设置 OPENAI_API_KEY 环境变量');
}

const openai = axios.create({
    baseURL: apiBase,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    },
});

export async function chatWithGPT(system: string, user: string) {
    try {
        const response = await openai.post('/chat/completions', {
            model: 'deepseek-chat', // 也可以是 'gpt-3.5-turbo'
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            temperature: 0.7,
            response_format: {
                'type': 'json_object'
            }
        });

        const reply = JSON.parse(response.data.choices[0].message.content);
        return reply;
    } catch (error: any) {
        console.error('调用 OpenAI API 出错:', error.response?.data || error.message);
        throw error;
    }
}
