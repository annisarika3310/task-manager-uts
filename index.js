const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// koneksi PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'task_manager',
  password: 'Ica3310', // ganti!
  port: 5432,
});

// cek koneksi
pool.connect()
  .then(() => console.log('DB CONNECTED'))
  .catch(err => console.error('DB ERROR:', err.message));

// middleware logging
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// test
app.get('/', (req, res) => {
  res.send('API jalan');
});

// GET semua task
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Title tidak boleh kosong' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Task dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// jalankan server
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});