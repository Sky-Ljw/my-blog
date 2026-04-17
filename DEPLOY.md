# 部署指南：Netlify静态网站部署 & GitHub托管

## 项目介绍

本项目是一个基于Vue 3的静态博客网站，设计风格参考了 https://hui-home.cc.cd/ 网站，具有以下特点：

- 简洁的页面布局
- 响应式设计，支持移动端
- 优雅的悬停效果
- 清晰的文章列表展示

## 步骤1：创建GitHub仓库
1. 登录GitHub账号
2. 点击右上角的「+」号，选择「New repository」
3. 填写仓库名称（例如：my-blog）
4. 选择「Public」或「Private」
5. 点击「Create repository」

## 步骤2：推送代码到GitHub
在项目根目录执行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/my-blog.git

# 推送代码
git push -u origin master
```

## 步骤3：部署到Netlify
1. 登录Netlify账号（https://app.netlify.com/）
2. 点击「Add new site」→「Import an existing project」
3. 选择「GitHub」并授权
4. 选择刚刚创建的GitHub仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击「Deploy site」

## 步骤4：访问你的网站
Netlify会自动构建并部署你的网站，部署完成后会提供一个随机的域名（例如：your-site.netlify.app）。

你也可以在Netlify设置中添加自定义域名。

## 自动部署
每当你向GitHub仓库推送新的代码，Netlify会自动重新构建并部署你的网站。

## 项目结构
```
/workspace/workspace/
├── public/           # 静态资源
├── src/              # 源代码
│   ├── assets/       # 图片等资源
│   ├── components/   # Vue组件
│   ├── App.vue       # 主应用组件
│   └── main.js       # 入口文件
├── dist/             # 构建输出目录
└── package.json      # 项目配置
```

## 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 自定义内容

### 修改网站标题
编辑 `src/App.vue` 文件，修改以下代码：

```vue
<h1><a href="/" class="site-title">HuiStudy</a></h1>
```

### 修改底部链接
编辑 `src/App.vue` 文件，修改以下代码：

```vue
<p><a href="#" class="footer-link">imsyy</a></p>
```

### 添加新文章
编辑 `src/App.vue` 文件，在 `posts` 数组中添加新的文章对象：

```javascript
const posts = ref([
  {
    id: 1,
    title: '欢迎来到我的博客',
    date: '2024-01-01',
    content: '这是我的第一篇博客文章，记录我的学习和思考。'
  },
  // 添加更多文章...
])
```