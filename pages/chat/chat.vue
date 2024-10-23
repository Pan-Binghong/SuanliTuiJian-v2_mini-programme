<template>
  <view class="container">
    <view class="header">
      <text class="title" v-if="!isLoading">开始跟<text style="color: red; font-weight: bold;">俺</text>对话吧</text>
      <text class="title" v-else>对方正在输入中<text class="blinking-dots"><text>.</text><text>.</text><text>.</text></text></text>
    </view>
    
    <scroll-view class="chat-content" scroll-y>
      <view v-for="(message, index) in messages" :key="index" :class="['message-wrapper', message.type]">
        <image :src="message.type === 'user' ? '/static/user-avatar.png' : '/static/ai-avatar.png'" class="avatar" />
        <view class="message">
          <text>{{ message.content }}</text>
          <image src="/static/copy.png" class="copy-icon" @tap="copyMessage(message.content)" />
        </view>
      </view>
      <view v-if="isLoading" class="loading-container">
        <image class="loading-gif" src="/static/load.gif" mode="aspectFit"></image>
      </view>
    </scroll-view>
    
    <view class="input-area">
      <input type="text" v-model="userInput" placeholder="输入消息" :disabled="isLoading" />
      <button @tap="sendMessage" :disabled="isLoading">发送</button>
    </view>
  </view>
</template>

<script>
import { chatStore, chatMethods } from '../../utils/chat.js'

export default {
  data() {
    return {
      chatStore
    }
  },
  methods: {
    ...chatMethods,
    copyMessage(content) {
      uni.setClipboardData({
        data: content,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },
  onLoad() {
    this.initAccessToken()
  },
  computed: {
    userInput: {
      get() {
        return this.chatStore.userInput
      },
      set(value) {
        this.chatStore.userInput = value
      }
    },
    messages() {
      return this.chatStore.messages
    },
    isLoading() {
      return this.chatStore.isLoading
    }
  },
  onLoad() {
    this.initAccessToken()
  }
}
</script>

<style>
.container {
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.header {
  padding: 10px 15px;
  background-color: #ededed;
  text-align: center;
  border-bottom: 1px solid #d1d1d1;
}

.title {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
}

.chat-content {
  flex: 1;
  padding: 5px;
  overflow-y: auto;
  background-color: #f1f1f1;
}

.message-wrapper {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.user {
  flex-direction: row-reverse;
}

.ai {
  flex-direction: row;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  margin: 0 10px;
}

.message {
  max-width: 60%;
  padding: 10px;
  border-radius: 3px;
  font-size: 16px;
  line-height: 1.4;
  position: relative;
}

.copy-icon {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 5px;
  bottom: 5px;
  opacity: 0.6;
}

.user .message {
  background-color: #95ec69;
  color: #000000;
}

.ai .message {
  background-color: #ffffff;
  color: #000000;
}

.input-area {
  display: flex;
  padding: 10px;
  background-color: #f1f1f1;
  border-top: 1px solid #d1d1d1;
  position: sticky;
  bottom: 10px; /* 增加底部距离 */
}

.input-area input {
  flex: 1;
  padding: 8px 10px;
  margin-right: 10px;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  font-size: 16px;
  background-color: #ffffff;
  color: #000000;
}

.input-area button {
  width: 60px;
  height: 36px; /* 添加固定高度 */
  background-color: #07c160;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  padding: 0; /* 重置内边距 */
  line-height: 36px; /* 文字垂直居中 */
  text-align: center; /* 文字水平居中 */
}

/* 添加以下样式来重置按钮的默认样式 */
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.loading-gif {
  width: 30px;
  height: 30px;
}

.input-area input:disabled,
.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.blinking-dots text {
  opacity: 0.2;
  transition: opacity 0.3s ease;
}

.blinking-dots text:nth-child(1) {
  animation: blink1 1s infinite;
}

.blinking-dots text:nth-child(2) {
  animation: blink2 1s infinite;
}

.blinking-dots text:nth-child(3) {
  animation: blink3 1s infinite;
}

@keyframes blink1 {
  0%, 100% { opacity: 0.2; }
  20% { opacity: 1; }
}

@keyframes blink2 {
  0%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}

@keyframes blink3 {
  0%, 100% { opacity: 0.2; }
  60% { opacity: 1; }
}
</style>
