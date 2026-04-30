const express = require('express');
const app = express();

app.use(express.json());

// logging (biar kelihatan request masuk)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// test route
app.get('/', (req, res) => {
  res.send('API jalan');
});

// GET all
let tasks = [];
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST (validasi 400)
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Title tidak boleh kosong' });
  }

  const newTask = {
    id: tasks.length + 1,
    title
  };

  tasks.push(newTask);
  res.json(newTask);
});

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});