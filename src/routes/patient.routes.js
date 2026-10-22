const router = require('express').Router();
const controller = require('../controllers/patient.controller');
const authenticate = require('../middleware/auth');
const { validateBody, validateIdParam } = require('../middleware/validate');
const validators = require('../validators/patient.validator');

router.use(authenticate);

router.post('/', validateBody(validators.create), controller.createPatient);
router.get('/', controller.getPatients);
router.get('/:id', validateIdParam(), controller.getPatient);
router.put('/:id', validateIdParam(), validateBody(validators.update), controller.updatePatient);
router.delete('/:id', validateIdParam(), controller.deletePatient);

module.exports = router;
