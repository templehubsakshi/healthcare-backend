const { Patient } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, buildMeta } = require('../utils/pagination');

// patients are private to the user who created them
const findOwnPatient = async (id, userId) => {
  const patient = await Patient.findOne({ where: { id, userId } });
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }
  return patient;
};

const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...req.body, userId: req.user.id });
  res.status(201).json({ success: true, message: 'Patient created', data: patient });
});

const getPatients = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await Patient.findAndCountAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });
  res.json({ success: true, data: rows, meta: buildMeta(page, limit, count) });
});

const getPatient = asyncHandler(async (req, res) => {
  const patient = await findOwnPatient(req.params.id, req.user.id);
  res.json({ success: true, data: patient });
});

const updatePatient = asyncHandler(async (req, res) => {
  const patient = await findOwnPatient(req.params.id, req.user.id);
  await patient.update(req.body);
  res.json({ success: true, message: 'Patient updated', data: patient });
});

const deletePatient = asyncHandler(async (req, res) => {
  const patient = await findOwnPatient(req.params.id, req.user.id);
  await patient.destroy();
  res.json({ success: true, message: 'Patient deleted' });
});

module.exports = { createPatient, getPatients, getPatient, updatePatient, deletePatient };
