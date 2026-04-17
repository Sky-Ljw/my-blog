<script setup>
import { ref } from 'vue'

const posts = ref([
  {
    id: 1,
    title: '欢迎来到我的博客',
    date: '2024-01-01',
    content: '这是我的第一篇博客文章，记录我的学习和思考。'
  },
  {
    id: 2,
    title: 'Vue 3 学习笔记',
    date: '2024-01-02',
    content: 'Vue 3 带来了很多新特性，如 Composition API、Teleport 等。'
  },
  {
    id: 3,
    title: 'Netlify 部署指南',
    date: '2024-01-03',
    content: 'Netlify 是一个非常方便的静态网站部署平台，支持自动部署和 HTTPS。'
  }
])
</script>

<template>
  <div class="app">
    <header class="header">
      <h1><a href="/" class="site-title">HuiStudy</a></h1>
    </header>
    <main class="main">
      <div class="posts">
        <div v-for="post in posts" :key="post.id" class="post">
          <h2 class="post-title">{{ post.title }}</h2>
          <div class="post-date">{{ post.date }}</div>
          <div class="post-content">{{ post.content }}</div>
        </div>
      </div>
    </main>
    <footer class="footer">
      <p><a href="#" class="footer-link">imsyy</a></p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.site-title {
  font-size: 2rem;
  color: #333;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.site-title:hover {
  color: #666;
}

.main {
  flex: 1;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post {
  background-color: white;
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 4px;
  transition: box-shadow 0.3s ease;
}

.post:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}

.post-date {
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 15px;
  font-style: italic;
}

.post-content {
  line-height: 1.6;
  color: #666;
  font-size: 0.95rem;
}

.footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
}

.footer-link {
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app {
    padding: 10px;
  }
  
  .site-title {
    font-size: 1.5rem;
  }
  
  .post {
    padding: 15px;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
}
</style>
