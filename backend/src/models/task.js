const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('todo', 'inprogress', 'done'),
    allowNull: false,
    defaultValue: 'todo',
  },
  position: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#93c5fd', // default blue
  },
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
