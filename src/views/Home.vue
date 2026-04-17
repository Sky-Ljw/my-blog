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

    <!-- 英雄区 -->
    <section class="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">欢迎来到我的博客</h1>
        <p class="text-xl md:text-2xl max-w-2xl mx-auto">分享技术、生活、旅行和美食的点滴</p>
      </div>
    </section>

    <!-- 分类筛选 -->
    <section class="py-8 bg-light">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap gap-3 justify-center">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="filterByCategory(category.slug)"
            :class="[{
              'bg-primary text-white': activeCategory === category.slug,
              'bg-white text-dark hover:bg-primary/10': activeCategory !== category.slug
            }, 'px-4 py-2 rounded-full font-medium transition-colors']"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="card">
            <Skeleton type="card" />
          </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="post in filteredPosts" 
            :key="post.id"
            class="card"
          >
            <div class="mb-4">
              <img 
                :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(post.title)}&image_size=landscape_4_3`" 
                :alt="post.title"
                class="w-full h-48 object-cover rounded-md"
                loading="lazy"
              />
            </div>
            <div class="mb-2">
              <span class="text-sm text-gray-500">
                {{ new Date(post.created_at).toLocaleDateString() }}
              </span>
            </div>
            <h2 class="text-xl font-bold mb-2">
              <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
            </h2>
            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ post.content.substring(0, 150) }}...
            </p>
            <router-link :to="`/post/${post.id}`" class="text-primary font-medium hover:underline">
              阅读更多 →
            </router-link>
          </div>
        </div>
        <div v-if="!loading && filteredPosts.length === 0" class="text-center py-12">
          <p class="text-gray-600">暂无文章</p>
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
import Skeleton from '../components/Skeleton.vue';

export default {
  name: 'Home',
  components: {
    Skeleton
  },
  data() {
    return {
      posts: [],
      categories: [],
      activeCategory: null,
      loading: true
    };
  },
  computed: {
    filteredPosts() {
      if (!this.activeCategory) {
        return this.posts;
      }
      return this.posts.filter(post => {
        const category = this.categories.find(c => c.slug === this.activeCategory);
        return category && post.category_id === category.id;
      });
    }
  },
  mounted() {
    this.fetchPosts();
    this.fetchCategories();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        this.posts = data.posts;
      } catch (error) {
        console.error('Error fetching posts:', error);
        // 使用模拟数据
        this.posts = [
          {
            id: 1,
            title: 'Vue 3 新特性介绍',
            content: 'Vue 3 带来了许多令人兴奋的新特性，包括 Composition API、Teleport、Fragments 等。本文将详细介绍这些新特性的使用方法和最佳实践。',
            created_at: '2026-04-17',
            category_id: 1
          },
          {
            id: 2,
            title: '如何开始你的博客之旅',
            content: '博客是分享知识和经验的绝佳平台。本文将指导你如何选择平台、定位内容、建立受众群体，以及如何保持持续创作的动力。',
            created_at: '2026-04-16',
            category_id: 2
          },
          {
            id: 3,
            title: '日本京都旅行攻略',
            content: '京都作为日本的古都，拥有丰富的历史文化遗产。本文将分享京都的必访景点、美食推荐、交通指南，以及最佳旅行季节。',
            created_at: '2026-04-15',
            category_id: 3
          },
          {
            id: 4,
            title: '家常川菜 recipes',
            content: '川菜以其麻辣鲜香著称。本文将分享几道经典家常川菜的制作方法，包括麻婆豆腐、水煮鱼、宫保鸡丁等，让你在家也能享受正宗川菜。',
            created_at: '2026-04-14',
            category_id: 4
          }
        ];
      } finally {
        this.loading = false;
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
    filterByCategory(slug) {
      this.activeCategory = this.activeCategory === slug ? null : slug;
    }
  }
};
</script>