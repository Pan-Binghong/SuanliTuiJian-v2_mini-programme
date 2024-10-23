<template>
  <view class="container">
    <view class="header">
      <text class="title">算力选型</text>
    </view>
    
    <view class="content">
      <view v-if="currentStep === 1" class="question-container">
        <text class="question">请选择您的主要任务类型:</text>
        <button class="option-button" :class="{ selected: task === '训练' }" @click="selectTask('训练')">训练</button>
        <button class="option-button" :class="{ selected: task === '推理' }" @click="selectTask('推理')">推理</button>
      </view>

      <view v-if="currentStep > 1 && currentQuestion" class="question-container">
        <text class="question">问题{{ currentStep - 1 }}: {{ currentQuestion.question }}</text>
        <view v-for="(value, key) in currentQuestion.options" :key="key" class="option-container">
          <button 
            v-if="key !== '自定义'" 
            class="option-button" 
            :class="{ selected: isSelected(currentStep - 2, key) }" 
            @click="selectOption(currentStep - 2, key, value)"
          >
            {{ key }}: {{ value }}
          </button>
          <input 
            v-else
            v-model="customAnswers[currentStep - 2]" 
            class="option-button custom-input" 
            :class="{ selected: isSelected(currentStep - 2, '自定义') }"
            :placeholder="'自定义回答'" 
            @focus="selectOption(currentStep - 2, '自定义', customAnswers[currentStep - 2])"
            @input="updateCustomAnswer(currentStep - 2)"
          />
        </view>
      </view>

      <view v-if="showRecommendation" class="recommendation-container">
        <text class="recommendation-title">推荐结果:</text>
        <text class="recommendation-content">{{ recommendation }}</text>
      </view>
    </view>

    <view class="footer">
      <button v-if="currentStep > 1 && !showRecommendation" class="nav-button" @click="previousStep">上一步</button>
      <button v-if="!showRecommendation" class="nav-button" @click="nextStep">{{ isLastQuestion ? '提交' : '下一步' }}</button>
    </view>
  </view>
</template>

<script>
import { getAccessToken, sendMessageToAI } from '@/utils/chat.js'
import questionBank from '@/utils/questionBank.json'

export default {
  data() {
    return {
      currentStep: 1,
      task: '',
      answers: [],
      customAnswers: {},
      recommendation: '',
      questionBank: questionBank,
      accessToken: ''
    }
  },
  computed: {
    currentQuestion() {
      if (this.task && this.currentStep > 1 && this.currentStep <= this.questionBank[this.task].length + 1) {
        return this.questionBank[this.task][this.currentStep - 2];
      }
      return null;
    },
    isLastQuestion() {
      return this.task && (this.currentStep === this.questionBank[this.task].length + 1);
    },
    showRecommendation() {
      return this.task && (this.currentStep > this.questionBank[this.task].length + 1);
    }
  },
  methods: {
    selectTask(task) {
      this.task = task;
      this.answers = new Array(this.questionBank[task].length).fill(null);
      this.customAnswers = {};
      this.nextStep();
    },
    selectOption(index, key, value) {
      this.$set(this.answers, index, { [key]: value });
      if (key === '自定义') {
        this.$set(this.customAnswers, index, value);
      }
    },
    isSelected(index, key) {
      const answer = this.answers[index];
      return answer && Object.keys(answer)[0] === key;
    },
    nextStep() {
      if (this.isLastQuestion) {
        this.submitSelection();
      } else {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    async submitSelection() {
      const formattedAnswers = this.questionBank[this.task].map((question, index) => {
        const answer = this.answers[index];
        const key = answer ? Object.keys(answer)[0] : '未回答';
        const value = answer ? answer[key] : '';
        return `${question.question} ${key}: ${value}`;
      }).join('\n');

      const prompt = `你是一个算力选型专家，请根据以下用户的选择进行推荐,\
                      任务: ${this.task}\
                      选择: ${formattedAnswers}\
                      `;
      console.log('提交的选择:', prompt); // 在后台显示

      try {
        if (!this.accessToken) {
          this.accessToken = await getAccessToken();
        }

        const aiResponse = await sendMessageToAI(this.accessToken, prompt);
        this.recommendation = aiResponse;
        this.currentStep = this.questionBank[this.task].length + 2; // 直接跳到显示推荐结果的步骤
      } catch (error) {
        console.error('获取推荐失败', error);
        // 可以在这里添加错误提示
      }
    },
    updateCustomAnswer(index) {
      this.selectOption(index, '自定义', this.customAnswers[index]);
    }
  },
  async mounted() {
    try {
      this.accessToken = await getAccessToken();
    } catch (error) {
      console.error('初始化 access token 失败:', error);
      // 可以在这里添加错误提示
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f2f2f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.header {
  padding: 44px 16px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #c7c7cc;
}

.title {
  font-size: 34px;
  font-weight: bold;
  color: #000000;
}

.content {
  flex: 1;
  padding: 20px 16px;
}

.question-container {
  margin-bottom: 20px;
}

.question {
  font-size: 17px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
}

.option-container {
  margin-bottom: 8px;
}

.option-button {
  width: 100%;
  padding: 10px 16px;
  font-size: 16px;
  color: #007aff;
  background-color: #ffffff;
  border: 1px solid #007aff;
  border-radius: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.option-button.selected {
  color: #ffffff;
  background-color: #007aff;
}

.custom-input {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.custom-input::placeholder {
  color: #007aff;
}

.recommendation-container {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 10px;
}

.recommendation-title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
}

.recommendation-content {
  font-size: 17px;
  color: #3a3a3c;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #c7c7cc;
}

.nav-button {
  flex: 1;
  margin: 0 8px;
  padding: 12px 16px;
  font-size: 17px;
  color: #ffffff;
  background-color: #007aff;
  border: none;
  border-radius: 10px;
}
</style>
