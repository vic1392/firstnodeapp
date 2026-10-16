const express = require('express');
const db = require('./db');
const pkg = require('./package.json');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Task Manager API!',
    version: pkg.version,
    database: 'DynamoDB',
    endpoints: {
      'GET /tasks': 'Get all tasks',
      'POST /tasks': 'Create a new task',
      'GET /tasks/:id': 'Get a specific task',
      'DELETE /tasks/:id': 'Delete a task',
      'GET /health': 'Health check',
      'GET /version': 'API version'
    }
  });
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await db.getTask(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await db.createTask(req.body.title);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await db.deleteTask(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    database: 'connected'
  });
});

app.get('/version', (req, res) => {
  res.json({
    version: pkg.version,
    name: pkg.name,
    database: 'DynamoDB',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Task Manager API v${pkg.version} running on port ${PORT}`);
});
