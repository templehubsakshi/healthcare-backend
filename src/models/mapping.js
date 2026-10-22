const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mapping = sequelize.define(
  'Mapping',
  {
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: 'patient_doctor_mappings',
    // a doctor can only be assigned to a patient once
    indexes: [{ unique: true, fields: ['patientId', 'doctorId'] }],
  }
);

module.exports = Mapping;
