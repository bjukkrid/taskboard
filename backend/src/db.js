const { Sequelize } = require('sequelize');

// กำหนดค่าการเชื่อมต่อฐานข้อมูล
const sequelize = new Sequelize(
  process.env.DB_NAME || 'taskboard',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
