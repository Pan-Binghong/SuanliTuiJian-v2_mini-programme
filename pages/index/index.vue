<template>
	<view class="content">
		<view class="header">
			<image class="logo" src="/static/logo.png" @tap="goToChat"></image>
			<view class="text-area">
				<text class="title">{{title}}</text>
			</view>
			<div class="ai-avatar-container">
				<img src="/static/宝藏宝箱.png" class="ai-avatar" @tap="openSelection">
			</div>
		</view>
		<div class="search-container">
			<div class="input-wrapper">
				<!-- Add suggestions here, above the input -->
				<div v-if="suggestions.length > 0" class="suggestions">
					<div v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)" class="suggestion-item">
						{{ suggestion }}
					</div>
				</div>
				<input class="input" v-model="searchQuery" placeholder="请输入算力卡型号" @input="onInput"/>
			</div>
			<div class="button">
					<button class="search-button" @click="search">查询</button>
			</div>
		</div>
		<!-- Add this new block for error message -->
		<div v-if="errorMessage" class="error-message">
			{{ errorMessage }}
		</div>
		<div class="footer">
			<p class="disclaimer">此小程序由<span class="blog-link" @click="openBlog">潘秉宏</span>个人开发，仅供学习交流使用</p>
			<p class="disclaimer">
				如有疑问或建议，请<span class="contact-button" @click="showContactInfo">联系开发者</span>
			</p>
		</div>

		<!-- 简化的弹出框 -->
		<div v-if="contactInfoVisible" class="popup">
			<div class="popup-content">
				<p class="contact-info">19909442097</p>
				<button class="copy-button" @click="copyAndClose">复制</button>
			</div>
		</div>
	</view>
</template>

<script>
import chipData from '../../utils/chipData.js';
import { searchChips, checkChipExists } from '../../utils/searchUtils.js';
import openSelection from '../../utils/chooseGPUs.js';
	export default {
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '潘秉宏开发的第一个小程序',
		      path: '/pages/index/index'
		    }
		  },
		data() {
			return {
				title: '欢迎使用算力卡查询工具',
				searchQuery: '', // 存储输入的内容
				suggestions: [], // 存储建议列表
				errorMessage: '', // Add this line
				searchResults: [], // 存储搜索结果
				contactInfoVisible: false, // 控制联系方式的显示
				blogUrl: 'https://panpan02222.github.io/', // 开发者博客地址
			}
		},
		methods: {
			openSelection,
			showContactInfo() {
				this.contactInfoVisible = true;
			},
			copyAndClose() {
				uni.setClipboardData({
					data: '19909442097',
					success: () => {
						uni.showToast({ title: '已复制到剪贴板', icon: 'success' });
						this.contactInfoVisible = false;
					}
				});
			},
			openBlog() {
				// 使用微信小程序的API打开网页
				wx.navigateTo({
					url: `/pages/webview/webview?url=${encodeURIComponent(this.blogUrl)}`,
					fail: (err) => {
						console.error('Failed to open webview:', err);
						// 如果打开失败，可以尝试使用wx.showModal提示用户
						wx.showModal({
							title: '提示',
							content: '无法打开链接，请检查网络连接或稍后再试。',
							showCancel: false
						});
					}
				});
			},
			search() {
				console.log('Searching for:', this.searchQuery); // 添加日志
				console.log('ChipData:', chipData); // 添加日志以检查 chipData
				if (chipData[this.searchQuery]) {
					// Chip exists, proceed with navigation
					this.errorMessage = ''; // Clear any previous error message
					uni.navigateTo({
						url: `/pages/result/result?query=${this.searchQuery}`
					});
				} else {
					// Chip doesn't exist, show error message
					console.log('Chip not found'); // 添加日志
					this.errorMessage = '没有找到该型号，如需添加请联系管理员';
				}
			},
			onInput() {
				this.suggestions = searchChips(this.searchQuery);
			},

			selectSuggestion(suggestion) {
				this.searchQuery = suggestion;
				this.suggestions = [];
			},

			goToChat() {
				console.log('Attempting to navigate to chat page');
				uni.navigateTo({
					url: '/pages/chat/chat',
					success: function() {
						console.log('Navigation successful');
					},
					fail: function(error) {
						console.error('Navigation failed:', error);
					}
				});
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 50rpx;
		width: 100%;
		margin-bottom: auto;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: cneter;
		height: 100vh; /* 使内容占满整个视口高度 */
		background-color: #f5f5f5; /* 添加背景色 */
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
		margin-bottom: 10rpx; /* 减少标题与宝箱之间的间距 */
	}

	.title {
		font-size: 48rpx;
		color: #333; /* 修改标题颜色 */
		font-weight: bold; /* 加标题 */
	}
	.search-container {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		margin-top: auto;
		margin-bottom: auto;
	}

	.input-wrapper {
		position: relative;
		width: 320rpx; /* Increased to account for border */
		margin-right: 10rpx;
	}

	.input {
		width: 100%;
		height: 80rpx;
		padding: 0 10rpx;
		border: 1px solid #ccc;
		border-radius: 5rpx;
		font-size: 28rpx;
		text-align: center;
		box-sizing: border-box;
	}

	.suggestions {
		position: absolute;
		bottom: 100%;
		left: 0;
		width: 100%;
		max-height: 300rpx;
		overflow-y: auto;
		border: 1px solid #ccc;
		border-bottom: none;
		background-color: white;
		z-index: 1000;
		box-sizing: border-box;
	}

	.suggestion-item {
		padding: 10rpx;
		cursor: pointer;
		text-align: left;
	}

	.suggestion-item:hover {
		background-color: #f0f0f0;
	}

	.button {
		display: flex;
		justify-content: center;
	}

	.search-button {
		width: 150rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #007aff;
		color: #fff;
		border: none;
		border-radius: 5rpx;
		font-size: 28rpx;
		cursor: pointer;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.search-button:hover {
		background-color: #005bb5; /* 鼠标悬停时改变背景色 */
	}

	/* ... other existing styles ... */

	.error-message {
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 4rpx;
		padding: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		text-align: center;
		width: 80%;
	}

	.footer {
		margin-top: auto;
		padding: 10rpx;
		text-align: center;
		width: 100%;
	}

	.disclaimer {
		font-size: 24rpx;
		color: #999;
		margin: 5rpx 0;
		line-height: 1.2;
	}

	.contact-button {
		display: inline;
		background-color: transparent;
		border: none;
		color: #007AFF;
		padding: 0;
		font-size: 24rpx;
		margin-left: 10rpx;
	}

	.blog-link {
		color: #007AFF;
		text-decoration: none;
	}

	/* 简化的弹出框样式 */
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.popup-content {
		background-color: #F9F9F9;
		padding: 20rpx 30rpx;
		border-radius: 14rpx;
		text-align: center;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.contact-info {
		font-size: 34rpx;
		margin-bottom: 20rpx;
		color: #333;
	}

	.copy-button {
		background-color: #007AFF;
		border: none;
		color: white;
		padding: 10rpx 20rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		width: 100%;
	}
	.ai-avatar {
		width: 60rpx; /* 稍微增加宝箱大小 */
		height: 60rpx;
	}
</style>