const router = require('express').Router();
const { register, login } = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validate');
const validators = require('../validators/auth.validator');

router.post('/register', validateBody(validators.register), register);
router.post('/login', validateBody(validators.login), login);

module.exports = router;
