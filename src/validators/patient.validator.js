const Joi = require('joi');

const fields = {
  name: Joi.string().trim().min(2).max(100),
  age: Joi.number().integer().min(0).max(150),
  gender: Joi.string().valid('male', 'female', 'other'),
  phone: Joi.string().trim().max(20).allow(null).empty(''),
  address: Joi.string().trim().allow(null).empty(''),
  medicalHistory: Joi.string().trim().allow(null).empty(''),
};

const create = Joi.object({
  ...fields,
  name: fields.name.required(),
  age: fields.age.required(),
  gender: fields.gender.required(),
});

const update = Joi.object(fields).min(1);

module.exports = { create, update };
