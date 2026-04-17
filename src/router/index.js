import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PostDetail from '../views/PostDetail.vue';
import Category from '../views/Category.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    props: true
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: Category,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;