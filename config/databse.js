const Sequelize = require('sequelize');
const sequelize = new Sequelize('ukk_hotel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log
});