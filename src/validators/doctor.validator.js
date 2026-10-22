const Joi = require('joi');

const fields = {
  name: Joi.string().trim().min(2).max(100),
  specialization: Joi.string().trim().max(100),
  email: Joi.string().trim().lowercase().email().allow(null).empty(''),
  phone: Joi.string().trim().max(20).allow(null).empty(''),
  experienceYears: Joi.number().integer().min(0).max(80),
};

const create = Joi.object({
  ...fields,
  name: fields.name.required(),
  specialization: fields.specialization.required(),
});

const update = Joi.object(fields).min(1);

module.exports = { create, update };
