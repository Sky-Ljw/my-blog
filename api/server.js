import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const port = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 文章相关API

// 获取文章列表
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ posts: rows });
    }
  });
});

// 获取文章详情
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.json({ post: row });
    }
  });
});

// 获取分类文章
app.get('/api/posts/category/:slug', (req, res) => {
  const { slug } = req.params;
  db.get('SELECT id FROM categories WHERE slug = ?', [slug], (err, category) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      db.all('SELECT * FROM posts WHERE category_id = ? ORDER BY created_at DESC', [category.id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ posts: rows });
        }
      });
    }
  });
});

// 评论相关API

// 获取文章评论
app.get('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM comments WHERE post_id = ? AND status = ? ORDER BY created_at ASC', [id, 'approved'], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ comments: rows });
    }
  });
});

// 创建评论
app.post('/api/comments', (req, res) => {
  const { postId, content, author, email } = req.body;
  db.run(
    'INSERT INTO comments (content, author, email, post_id, status) VALUES (?, ?, ?, ?, ?)',
    [content, author, email, postId, 'approved'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        db.get('SELECT * FROM comments WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json({ comment: row });
          }
        });
      }
    }
  );
});

// 分类相关API

// 获取分类列表
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ categories: rows });
    }
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});