const AK = process.env.VUE_APP_API_AK
const SK = process.env.VUE_APP_API_SK

export async function getAccessToken() {
  try {
    const res = await uni.request({
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`,
      method: 'POST'
    })
    return res.data.access_token
  } catch (error) {
    console.error('获取 access token 失败:', error)
    throw error
  }
}

export function sendMessageToAI(accessToken, userMessage) {
  console.log('开始发送消息', userMessage);
  const customPrompt = "你是一个由潘秉宏开发聊天机器人，请将用户的提问进行回答, \
  要求回答的答案需要符合以下要求: \
  1. 回答内容需要幽默风趣 \
  2. 回答内容需要符合社会主义核心价值观 \
  3. 回答内容需要符合法律法规 \
  4. 回答内容需要把'我'字换成'俺'字 \
  5. 回答内容需要把'你'字换成'你小子'字 \
  6. 回答的内容不需要出现Markdown格式 \
  7. 回答的字数不需要超过200个字符 \
  例如: \
  用户: 你是谁? \
  回答: 俺是一个由潘秉宏开发聊天机器人, 你小子有啥事? \
  "
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${accessToken}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        messages: [
          { role: 'user', content: customPrompt },
          { role: 'assistant', content: '好的，我明白了。我会按照你的要求来回答问题。' },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.95,
        top_p: 0.8,
        penalty_score: 1,
        enable_system_memory: false,
        disable_search: false,
        enable_citation: false
      },
      success: (res) => {
        console.log('收到响应', res);
        if (res.statusCode !== 200) {
          reject(new Error(`请求失败: ${res.statusCode}`));
        } else {
          resolve(res.data.result);
        }
      },
      fail: (error) => {
        console.error('发送消息失败:', error);
        reject(error);
      }
    });
  });
}

import Vue from 'vue'

export const chatStore = Vue.observable({
  userInput: '',
  messages: [],
  isLoading: false,
  accessToken: ''
})

export const chatMethods = {
  async initAccessToken() {
    try {
      chatStore.accessToken = await getAccessToken()
    } catch (error) {
      console.error('初始化 access token 失败:', error)
    }
  },

  async sendMessage() {
    if (chatStore.userInput.trim() && !chatStore.isLoading) {
      chatStore.isLoading = true // 设置加载状态为 true
      // 添加用户消息到消息列表
      chatStore.messages.push({
        type: 'user',
        content: chatStore.userInput
      })

      const userMessage = chatStore.userInput
      chatStore.userInput = ''

      try {
        const aiResponse = await sendMessageToAI(chatStore.accessToken, userMessage)
        
        // 添加 AI 回复到消息列表
        chatStore.messages.push({
          type: 'ai',
          content: aiResponse
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        // 可以在这里添加错误提示
      } finally {
        chatStore.isLoading = false // 设置加载状态为 false
      }
    }
  }
}

// 保持 getAccessToken 和 sendMessageToAI 函数不变
