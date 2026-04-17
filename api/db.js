import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// 创建数据库连接
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDatabase();
  }
});

// 初始化数据库
function initDatabase() {
  // 创建分类表
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating categories table:', err.message);
    } else {
      // 创建文章表
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          category_id INTEGER,
          status TEXT NOT NULL DEFAULT 'published',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating posts table:', err.message);
        } else {
          // 创建评论表
          db.run(`
            CREATE TABLE IF NOT EXISTS comments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              content TEXT NOT NULL,
              author TEXT NOT NULL,
              email TEXT NOT NULL,
              post_id INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'approved',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (post_id) REFERENCES posts(id)
            )
          `, (err) => {
            if (err) {
              console.error('Error creating comments table:', err.message);
            } else {
              // 创建索引
              db.run('CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id)');
              db.run('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)');

              // 检查是否需要初始化数据
              db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
                if (err) {
                  console.error('Error checking categories:', err.message);
                } else if (row && row.count === 0) {
                  // 初始化分类数据
                  const categories = [
                    { name: '技术', slug: 'tech' },
                    { name: '生活', slug: 'life' },
                    { name: '旅行', slug: 'travel' },
                    { name: '美食', slug: 'food' }
                  ];

                  let categoryCount = 0;
                  categories.forEach(category => {
                    db.run(
                      'INSERT INTO categories (name, slug) VALUES (?, ?)',
                      [category.name, category.slug],
                      () => {
                        categoryCount++;
                        if (categoryCount === categories.length) {
                          // 初始化文章数据
                          const posts = [
                            {
                              title: 'Vue 3 新特性介绍',
                              content: 'Vue 3 带来了许多令人兴奋的新特性，包括 Composition API、Teleport、Fragments 等。本文将详细介绍这些新特性的使用方法和最佳实践。Composition API 允许我们使用函数式的方式组织组件逻辑，使代码更加可维护。Teleport 让我们可以将组件渲染到 DOM 树的任意位置，非常适合模态框等场景。Fragments 则允许我们在组件中返回多个根节点，减少了不必要的 DOM 元素。',
                              slug: 'vue-3-features',
                              category_id: 1
                            },
                            {
                              title: '如何开始你的博客之旅',
                              content: '博客是分享知识和经验的绝佳平台。本文将指导你如何选择平台、定位内容、建立受众群体，以及如何保持持续创作的动力。选择合适的平台是成功的第一步，你可以选择 WordPress、Medium、GitHub Pages 等平台。定位内容时，要选择自己熟悉且感兴趣的领域，这样才能保持持续创作的热情。建立受众群体需要时间和耐心，你可以通过社交媒体、SEO 等方式来推广你的博客。',
                              slug: 'start-blogging',
                              category_id: 2
                            },
                            {
                              title: '日本京都旅行攻略',
                              content: '京都作为日本的古都，拥有丰富的历史文化遗产。本文将分享京都的必访景点、美食推荐、交通指南，以及最佳旅行季节。必访景点包括金阁寺、清水寺、伏见稻荷大社等。美食推荐包括京都拉面、抹茶甜点、怀石料理等。交通方面，你可以购买京都巴士一日券，方便游览各个景点。最佳旅行季节是春季（3-5月）和秋季（10-11月），分别可以欣赏樱花和红叶。',
                              slug: 'kyoto-travel-guide',
                              category_id: 3
                            },
                            {
                              title: '家常川菜 recipes',
                              content: '川菜以其麻辣鲜香著称。本文将分享几道经典家常川菜的制作方法，包括麻婆豆腐、水煮鱼、宫保鸡丁等，让你在家也能享受正宗川菜。麻婆豆腐的关键在于豆瓣酱和花椒的使用，要炒出红油和香味。水煮鱼则需要新鲜的鱼肉和滚烫的油，这样才能保持鱼肉的鲜嫩。宫保鸡丁则要注意火候和调味，酸甜麻辣的口感是其特色。',
                              slug: 'sichuan-recipes',
                              category_id: 4
                            }
                          ];

                          let postCount = 0;
                          posts.forEach(post => {
                            db.run(
                              'INSERT INTO posts (title, content, slug, category_id, status) VALUES (?, ?, ?, ?, ?)',
                              [post.title, post.content, post.slug, post.category_id, 'published'],
                              () => {
                                postCount++;
                                if (postCount === posts.length) {
                                  // 初始化评论数据
                                  const comments = [
                                    {
                                      content: '这篇文章非常详细，对我学习 Vue 3 很有帮助！',
                                      author: '张三',
                                      email: 'zhangsan@example.com',
                                      post_id: 1
                                    },
                                    {
                                      content: '期待更多关于 Composition API 的深入讲解',
                                      author: '李四',
                                      email: 'lisi@example.com',
                                      post_id: 1
                                    },
                                    {
                                      content: '我也想开始写博客，但是不知道从哪里入手',
                                      author: '王五',
                                      email: 'wangwu@example.com',
                                      post_id: 2
                                    },
                                    {
                                      content: '京都一直是我想去的地方，感谢分享！',
                                      author: '赵六',
                                      email: 'zhaoliu@example.com',
                                      post_id: 3
                                    }
                                  ];

                                  let commentCount = 0;
                                  comments.forEach(comment => {
                                    db.run(
                                      'INSERT INTO comments (content, author, email, post_id, status) VALUES (?, ?, ?, ?, ?)',
                                      [comment.content, comment.author, comment.email, comment.post_id, 'approved'],
                                      () => {
                                        commentCount++;
                                        if (commentCount === comments.length) {
                                          console.log('Database initialized with sample data.');
                                        }
                                      }
                                    );
                                  });
                                }
                              }
                            );
                          });
                        }
                      }
                    );
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

export default db;