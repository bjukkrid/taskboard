require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('redis');
const sequelize = require('./db');
const Task = require('./models/task');
const tasksRouter = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Redis setup
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

// Middleware to inject io and redis into req
app.use((req, res, next) => {
  req.io = io;
  req.redis = redis;
  next();
});

// Use tasks router
app.use('/tasks', tasksRouter);

// WebSocket: Real-time updates (Sequelize)
io.on('connection', (socket) => {
  socket.on('task:move', async ({ id, column, position }) => {
    try {
      const task = await Task.findByPk(id);
      if (!task) return;
      task.status = column;
      task.position = position;
      await task.save();
      io.emit('task:move', task);
      await redis.publish('taskboard', JSON.stringify({ type: 'move', task }));
    } catch (err) {
      // handle error silently
      console.error('Error moving task:', err);
    }
  });
});

// Redis Pub/Sub: Broadcast to all Socket.IO clients
(async () => {
  const sub = createClient({ url: process.env.REDIS_URL });
  await sub.connect();
  await sub.subscribe('taskboard', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'move') io.emit('task:move', data.task);
    if (data.type === 'create') io.emit('task:create', data.task);
  });
})();

// Database connection and sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync(); // Create tables if not exist
    console.log('Models synchronized!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
