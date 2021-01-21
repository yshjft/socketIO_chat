const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
