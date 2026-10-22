const { Doctor } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, buildMeta } = require('../utils/pagination');

const findDoctor = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }
  return doctor;
};

// any user can view doctors, but only the creator can change or remove one
const findOwnDoctor = async (id, userId) => {
  const doctor = await findDoctor(id);
  if (doctor.createdBy !== userId) {
    throw new ApiError(403, 'You can only modify doctors you added');
  }
  return doctor;
};

const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, message: 'Doctor created', data: doctor });
});

const getDoctors = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await Doctor.findAndCountAll({
    order: [['name', 'ASC']],
    limit,
    offset,
  });
  res.json({ success: true, data: rows, meta: buildMeta(page, limit, count) });
});

const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await findDoctor(req.params.id);
  res.json({ success: true, data: doctor });
});

const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await findOwnDoctor(req.params.id, req.user.id);
  await doctor.update(req.body);
  res.json({ success: true, message: 'Doctor updated', data: doctor });
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await findOwnDoctor(req.params.id, req.user.id);
  await doctor.destroy();
  res.json({ success: true, message: 'Doctor deleted' });
});

module.exports = { createDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };
