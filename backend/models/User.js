const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatarUrl: {
    type: DataTypes.STRING,
  },
   name: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  githubToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
sequelize.sync({ force: true });

module.exports = User;
