// Import the Express library (our web server toolkit)
const express = require('express');

// Create a new web server
const app = express();

// Tell the server to understand JSON data (like a universal language)
app.use(express.json());

// A simple list to store tasks (in real apps, this would be a database)
let tasks = [
  { id: 1, title: 'Learn Jenkins', done: false },
  { id: 2, title: 'Deploy to AWS', done: false }
];

// Route: When someone visits the home page, show a welcome message
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Task Manager API!',
    version: '1.1.0',
    endpoints: {
      'GET /tasks': 'Get all tasks',
      'POST /tasks': 'Create a new task',
      'GET /tasks/:id': 'Get a single task by ID',
      'GET /health': 'Check if app is healthy',
      'GET /version': 'Get API version info'
    }
  });
});

// Route: Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// ✅ NEW: Get a single task by ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(task);
});

// Route: Health check (used by Kubernetes later to know if app is alive)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// ✅ NEW: Version endpoint — useful for verifying which build is deployed
app.get('/version', (req, res) => {
  res.json({
    version: '1.1.0',
    commit: process.env.GIT_COMMIT || 'unknown',
    port: PORT
  });
});

// Route: Create a new task
app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    done: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});
// New feature: Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'secret') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});
// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Task Manager API running on port ${PORT}`);
});
