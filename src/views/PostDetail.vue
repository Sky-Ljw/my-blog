<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-primary">
              博客网站
            </router-link>
          </div>
          <nav class="hidden md:flex space-x-8">
            <router-link to="/" class="text-dark hover:text-primary transition-colors">
              首页
            </router-link>
            <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.slug}`" class="text-dark hover:text-primary transition-colors">
              {{ category.name }}
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- 文章内容 -->
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <!-- 文章头部 -->
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ post.title }}</h1>
            <div class="flex items-center text-gray-500 mb-6">
              <span>{{ new Date(post.created_at).toLocaleDateString() }}</span>
              <span class="mx-2">•</span>
              <router-link :to="`/category/${postCategory.slug}`" class="text-primary hover:underline">
                {{ postCategory.name }}
              </router-link>
            </div>
            <div class="mb-6">
              <img 
                :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(post.title)}&image_size=landscape_16_9`" 
                :alt="post.title"
                class="w-full h-64 object-cover rounded-md"
              />
            </div>
          </div>

          <!-- 文章正文 -->
          <div class="prose prose-lg max-w-none mb-12">
            <p v-for="(paragraph, index) in post.content.split('。')" :key="index" class="mb-4">
              {{ paragraph }}。
            </p>
          </div>

          <!-- 评论区 -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">评论 ({{ comments.length }})</h2>
            
            <!-- 评论表单 -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4">发表评论</h3>
              <form @submit.prevent="submitComment" class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="newComment.author" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="newComment.email" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label for="content" class="block text-sm font-medium text-gray-700 mb-1">评论内容</label>
                  <textarea 
                    id="content" 
                    v-model="newComment.content" 
                    rows="4" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                  发表评论
                </button>
              </form>
            </div>

            <!-- 评论列表 -->
            <div class="space-y-6">
              <div v-for="comment in comments" :key="comment.id" class="bg-light p-4 rounded-md">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold">{{ comment.author }}</h4>
                  <span class="text-sm text-gray-500">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
                </div>
                <p class="text-gray-700">{{ comment.content }}</p>
              </div>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div>
            <h2 class="text-2xl font-bold mb-6">相关推荐</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="relatedPost in relatedPosts" 
                :key="relatedPost.id"
                class="card"
              >
                <h3 class="text-lg font-bold mb-2">
                  <router-link :to="`/post/${relatedPost.id}`">{{ relatedPost.title }}</router-link>
                </h3>
                <p class="text-gray-600 mb-2 line-clamp-2">
                  {{ relatedPost.content.substring(0, 100) }}...
                </p>
                <router-link :to="`/post/${relatedPost.id}`" class="text-primary font-medium hover:underline">
                  阅读更多 →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-dark text-white py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>© 2026 博客网站. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PostDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      post: {},
      comments: [],
      categories: [],
      relatedPosts: [],
      newComment: {
        author: '',
        email: '',
        content: ''
      }
    };
  },
  computed: {
    postCategory() {
      return this.categories.find(c => c.id === this.post.category_id) || { name: '未分类', slug: 'uncategorized' };
    }
  },
  mounted() {
    this.fetchPost();
    this.fetchComments();
    this.fetchCategories();
    this.fetchRelatedPosts();
  },
  methods: {
    async fetchPost() {
      try {
        const response = await fetch(`/api/posts/${this.id}`);
        const data = await response.json();
        this.post = data.post;
      } catch (error) {
        console.error('Error fetching post:', error);
        // 使用模拟数据
        this.post = {
          id: this.id,
          title: 'Vue 3 新特性介绍',
          content: 'Vue 3 带来了许多令人兴奋的新特性，包括 Composition API、Teleport、Fragments 等。本文将详细介绍这些新特性的使用方法和最佳实践。Composition API 允许我们使用函数式的方式组织组件逻辑，使代码更加可维护。Teleport 让我们可以将组件渲染到 DOM 树的任意位置，非常适合模态框等场景。Fragments 则允许我们在组件中返回多个根节点，减少了不必要的 DOM 元素。',
          created_at: '2026-04-17',
          category_id: 1
        };
      }
    },
    async fetchComments() {
      try {
        const response = await fetch(`/api/posts/${this.id}/comments`);
        const data = await response.json();
        this.comments = data.comments;
      } catch (error) {
        console.error('Error fetching comments:', error);
        // 使用模拟数据
        this.comments = [
          {
            id: 1,
            content: '这篇文章非常详细，对我学习 Vue 3 很有帮助！',
            author: '张三',
            email: 'zhangsan@example.com',
            created_at: '2026-04-17'
          },
          {
            id: 2,
            content: '期待更多关于 Composition API 的深入讲解',
            author: '李四',
            email: 'lisi@example.com',
            created_at: '2026-04-17'
          }
        ];
      }
    },
    async fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        this.categories = data.categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        // 使用模拟数据
        this.categories = [
          { id: 1, name: '技术', slug: 'tech' },
          { id: 2, name: '生活', slug: 'life' },
          { id: 3, name: '旅行', slug: 'travel' },
          { id: 4, name: '美食', slug: 'food' }
        ];
      }
    },
    async fetchRelatedPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        this.relatedPosts = data.posts.filter(p => p.id !== parseInt(this.id) && p.category_id === this.post.category_id).slice(0, 2);
      } catch (error) {
        console.error('Error fetching related posts:', error);
        // 使用模拟数据
        this.relatedPosts = [
          {
            id: 2,
            title: '如何开始你的博客之旅',
            content: '博客是分享知识和经验的绝佳平台。本文将指导你如何选择平台、定位内容、建立受众群体，以及如何保持持续创作的动力。',
            category_id: 2
          }
        ];
      }
    },
    async submitComment() {
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.newComment,
            postId: this.id
          })
        });
        const data = await response.json();
        this.comments.push(data.comment);
        // 重置表单
        this.newComment = {
          author: '',
          email: '',
          content: ''
        };
      } catch (error) {
        console.error('Error submitting comment:', error);
        // 模拟添加评论
        this.comments.push({
          id: Date.now(),
          ...this.newComment,
          created_at: new Date().toISOString()
        });
        // 重置表单
        this.newComment = {
          author: '',
          email: '',
          content: ''
        };
      }
    }
  }
};
</script>