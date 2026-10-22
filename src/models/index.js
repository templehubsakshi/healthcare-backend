const sequelize = require('../config/db');
const User = require('./user');
const Patient = require('./patient');
const Doctor = require('./doctor');
const Mapping = require('./mapping');

User.hasMany(Patient, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Doctor, { foreignKey: { name: 'createdBy', allowNull: false }, onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'createdBy' });

Patient.hasMany(Mapping, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Mapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Mapping, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = { sequelize, User, Patient, Doctor, Mapping };
