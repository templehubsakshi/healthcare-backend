const { Mapping, Patient, Doctor } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createMapping = asyncHandler(async (req, res) => {
  const patientId = req.body.patientId ?? req.body.patient;
  const doctorId = req.body.doctorId ?? req.body.doctor;

  const patient = await Patient.findOne({ where: { id: patientId, userId: req.user.id } });
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  const [mapping, created] = await Mapping.findOrCreate({ where: { patientId, doctorId } });
  if (!created) {
    throw new ApiError(409, 'This doctor is already assigned to the patient');
  }

  res.status(201).json({
    success: true,
    message: 'Doctor assigned to patient',
    data: {
      ...mapping.toJSON(),
      patient: { id: patient.id, name: patient.name },
      doctor: { id: doctor.id, name: doctor.name },
    },
  });
});

// only mappings of the logged-in user's patients are returned
const getMappings = asyncHandler(async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [
      { model: Patient, as: 'patient', attributes: ['id', 'name'], where: { userId: req.user.id } },
      { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, count: mappings.length, data: mappings });
});

const getDoctorsOfPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    where: { id: req.params.patientId, userId: req.user.id },
  });
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const mappings = await Mapping.findAll({
    where: { patientId: patient.id },
    include: [{ model: Doctor, as: 'doctor' }],
  });

  res.json({
    success: true,
    patient: { id: patient.id, name: patient.name },
    count: mappings.length,
    data: mappings.map((m) => ({ mappingId: m.id, ...m.doctor.toJSON() })),
  });
});

const deleteMapping = asyncHandler(async (req, res) => {
  const mapping = await Mapping.findOne({
    where: { id: req.params.id },
    include: [{ model: Patient, as: 'patient', attributes: ['id'], where: { userId: req.user.id } }],
  });
  if (!mapping) {
    throw new ApiError(404, 'Mapping not found');
  }

  await mapping.destroy();
  res.json({ success: true, message: 'Doctor removed from patient' });
});

module.exports = { createMapping, getMappings, getDoctorsOfPatient, deleteMapping };
