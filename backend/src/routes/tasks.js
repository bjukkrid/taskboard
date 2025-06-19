const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET /tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [['position', 'ASC']] });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks
router.post('/', async (req, res) => {
  try {
    const { title, column } = req.body;
    const task = await Task.create({
      title,
      status: column,
      position: Date.now(),
    });
    req.io.emit('task:create', task);
    await req.redis.publish('taskboard', JSON.stringify({ type: 'create', task }));
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id/move
router.put('/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { column, position } = req.body;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.status = column;
    task.position = position;
    await task.save();
    req.io.emit('task:move', task);
    await req.redis.publish('taskboard', JSON.stringify({ type: 'move', task }));
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id (update any field)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color } = req.body;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (color !== undefined) task.color = color;
    await task.save();
    req.io.emit('task:update', task);
    await req.redis.publish('taskboard', JSON.stringify({ type: 'update', task }));
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
