const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define(
  'Patient',
  {
    name: { type: DataTypes.STRING(100), allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    phone: DataTypes.STRING(20),
    address: DataTypes.TEXT,
    medicalHistory: DataTypes.TEXT,
  },
  { tableName: 'patients' }
);

module.exports = Patient;
