# AI算力卡查询工具v2

## 项目简介

AI算力卡查询工具v2是一个微信小程序，旨在帮助用户快速查询和比较不同AI算力卡的参数。该工具提供了直观的界面，允许用户搜索特定型号的算力卡，查看详细参数，并进行多卡对比。

## 主要功能

1. **算力卡查询**：用户可以输入算力卡型号进行查询。
2. **参数详情展示**：展示选定算力卡的详细参数。
3. **多卡对比**：支持多个算力卡的参数对比。
4. **数据导出**：允许用户将对比结果导出为CSV格式。
5. **AI聊天功能**：集成了AI聊天功能，为用户提供智能交互体验。
6. **算力卡选型助手**：帮助用户根据需求选择合适的算力卡。

## 技术栈

- 前端框架：uni-app
- 开发语言：Vue.js, JavaScript
- API集成：百度智能云API（用于AI聊天功能）

## 项目结构

```bash
AI算力卡查询工具v2/
├── pages/
│ ├── index/ # 主页
│ ├── result/ # 查询结果页
│ ├── chat/ # AI聊天页面
│ ├── webview/ # 开发者博客页面
│ └── selection/ # 算力卡选型助手页面
├── utils/
│ ├── chipData.js # 算力卡数据
│ ├── searchUtils.js # 搜索功能工具
│ ├── exportUtils.js # 数据导出工具
│ └── chat.js # AI聊天功能
├── static/ # 静态资源
├── App.vue # 应用入口文件
├── main.js # 主入口文件
├── manifest.json # 应用配置文件
└── pages.json # 页面路由配置
```

## 安装和运行

1. 确保你的开发环境中已安装微信开发者工具。
2. 克隆本仓库到本地。
3. 使用微信开发者工具打开项目目录。
4. 在微信开发者工具中编译和预览项目。

## 环境变量

本项目使用了环境变量来存储API密钥。请确保在`utils/chat.js`文件中正确设置了以下环境变量：

```sh
VUE_APP_API_AK=your_api_ak_here
VUE_APP_API_SK=your_api_sk_here
```


## 贡献

欢迎对本项目提出建议或贡献代码。请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 将你的改动推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 联系方式

如有任何问题或建议，请联系开发者潘秉宏。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

## 部署说明

本项目基于 uni-app 开发，可以通过以下步骤进行部署：

### 方法 1：使用微信开发者工具（推荐新手使用）

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 克隆本仓库到本地：`git clone [仓库URL]`
3. 打开微信开发者工具，选择"导入项目"。
4. 选择项目目录，填入自己的小程序 AppID。
5. 在模拟器中预览效果，或者使用真机调试。
6. 开发完成后，点击"上传"按钮将代码上传到微信服务器。
7. 登录[微信公众平台](https://mp.weixin.qq.com/)，将开发版本设置为体验版或提交审核。

### 方法 2：使用命令行工具（推荐有经验的开发者使用）

1. 确保已安装 Node.js 和 npm。
2. 全局安装 Vue CLI：`npm install -g @vue/cli`
3. 安装 uni-app 命令行工具：`npm install -g @dcloudio/vue-cli-plugin-uni`
4. 克隆本仓库到本地：`git clone [仓库URL]`
5. 进入项目目录：`cd [项目名称]`
6. 安装依赖：`npm install`
7. 运行开发服务器：`npm run dev:mp-weixin`
8. 使用微信开发者工具打开项目目录下的 `dist/dev/mp-weixin` 文件夹。
9. 开发完成后，构建生产版本：`npm run build:mp-weixin`
10. 使用微信开发者工具打开 `dist/build/mp-weixin` 文件夹，上传代码到微信服务器。

### 注意事项

- 确保在 `manifest.json` 文件中正确配置了小程序的 AppID。
- 在发布前，请仔细检查 `pages.json` 中的页面配置是否正确。
- 如果使用了环境变量（如 API 密钥），请确保在生产环境中正确设置。
- 首次提交审核时，请准备好小程序的介绍、截图和类目信息。

有关 uni-app 开发的更多信息，请参考[官方文档](https://uniapp.dcloud.io/)。
