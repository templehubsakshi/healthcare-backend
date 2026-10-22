const Joi = require('joi');

const id = Joi.number().integer().min(1);

// accepts { patient, doctor } or { patientId, doctorId }
const create = Joi.object({
  patient: id,
  doctor: id,
  patientId: id,
  doctorId: id,
})
  .or('patient', 'patientId')
  .or('doctor', 'doctorId');

module.exports = { create };
