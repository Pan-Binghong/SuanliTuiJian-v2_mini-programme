<template>
	<view class="result-content">
		<view class="table-container">
			<view class="table-header">
				<view class="table-cell">型号</view>
				<view class="table-cell">{{ query }}</view>
				<view class="table-cell" v-if="comparisonData">{{ comparisonQuery }}</view>
			</view>
			<view class="table-body">
				<view class="table-row" v-for="(value, key) in chipData[query]" :key="key">
					<view class="table-cell">{{ key }}</view>
					<view class="table-cell">{{ value }}</view>
					<view class="table-cell" v-if="comparisonData">{{ comparisonData[key] }}</view>
				</view>
			</view>
		</view>
		<view class="action-container">
			<view class="search-container">
				<view class="input-wrapper">
					<input class="input" v-model="searchQuery" placeholder="请输入型号进行对比" @input="onInput"/>
					<view v-if="suggestions.length > 0" class="suggestions">
						<view v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)" class="suggestion-item">
							{{ suggestion }}
						</view>
					</view>
				</view>
				<view class="button-group">
					<button class="action-button search-button" @click="search">查询</button>
					<button class="action-button export-button" @click="exportToCSV">复制CSV</button>
				</view>
			</view>
		</view>
		<view class="spacer"></view>
		<view class="suggested-text">
			<text class="suggestion">*训练推荐: A100, H100, 910B, H100</text>
			<text class="suggestion">*推理推荐: T4, 4090, V100, L40</text>
		</view>
	</view>
</template>

<script>
	import chipData from '../../utils/chipData.js'; // 导入 chipData
	import { searchChips } from '../../utils/searchUtils.js';
	import { exportToCSV } from '../../utils/exportUtils.js';

	export default {
		data() {
			return {
				query: '',
				chipData: chipData,
				searchQuery: '',
				suggestions: [],
				comparisonData: null,
				comparisonQuery: ''
			}
		},
		onLoad(options) {
			this.query = options.query;
		},
		methods: {
			onInput() {
				this.suggestions = searchChips(this.searchQuery);
			},
			selectSuggestion(suggestion) {
				this.searchQuery = suggestion;
				this.suggestions = [];
			},
			search() {
				if (this.chipData[this.searchQuery]) {
					this.comparisonData = this.chipData[this.searchQuery];
					this.comparisonQuery = this.searchQuery;
					this.searchQuery = '';
				} else {
					// 可以添加错误提示
					uni.showToast({
						title: '未找到该型号',
						icon: 'none'
					});
				}
			},
			async exportToCSV() {
				try {
					const message = await exportToCSV(this.query, this.comparisonQuery, this.chipData, this.comparisonData);
					this.showToast(message);
					// 可以在这里添加一些指导用户如何使用复制的内容的提示
					console.log('CSV内容已复制到剪贴板，可以粘贴到其他应用中查看');
				} catch (error) {
					console.error('导出CSV失败:', error);
					this.showToast('导出失败: ' + error);
				}
			},
			showToast(title) {
				uni.showToast({
					title: title,
					icon: 'none',
					duration: 3000
				});
			}
		}
	}
</script>

<style>
	.result-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 20rpx;
	}

	.table-container {
		width: 100%;
		max-width: 800rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 30rpx;
	}

	.table-header {
		display: flex;
		background-color: #007aff;
		color: #fff;
		font-weight: bold;
		font-size: 28rpx;
	}

	.table-body {
		max-height: 60vh;
		overflow-y: auto;
	}

	.table-row {
		display: flex;
		border-bottom: 1rpx solid #eee;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-cell {
		flex: 1;
		padding: 16rpx 10rpx;
		text-align: center;
		font-size: 24rpx;
		word-break: break-word;
	}

	.table-header .table-cell {
		padding: 20rpx 10rpx;
	}

	.search-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.input-wrapper {
		position: relative;
		flex: 1;
		margin-right: 20rpx;
	}

	.input {
		width: 100%;
		height: 80rpx;
		padding: 0 20rpx;
		border: 1px solid #ccc;
		border-radius: 5rpx;
		font-size: 28rpx;
		box-sizing: border-box;
	}

	.suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		max-height: 300rpx;
		overflow-y: auto;
		background-color: #fff;
		border: 1px solid #ccc;
		border-top: none;
		z-index: 1000;
	}

	.suggestion-item {
		padding: 10rpx 20rpx;
		font-size: 28rpx;
		cursor: pointer;
	}

	.suggestion-item:hover {
		background-color: #f0f0f0;
	}

	.button-group {
		display: flex;
		flex-shrink: 0;
	}

	.action-button {
		width: 120rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 26rpx;
		margin-left: 10rpx;
		padding: 0;
		box-sizing: border-box;
		white-space: nowrap;
	}

	.search-button {
		background-color: #007aff;
		color: #fff;
	}

	.export-button {
		background-color: #28a745;
		color: #fff;
	}

	.spacer {
		flex-grow: 1;
	}

	.suggested-text {
		width: 100%;
		max-width: 800rpx;
		padding: 20rpx;
		align-self: flex-start;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.suggestion {
		font-size: 24rpx;
		color: #999;
		line-height: 1.5;
	}
</style>