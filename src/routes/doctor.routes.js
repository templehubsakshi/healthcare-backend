const router = require('express').Router();
const controller = require('../controllers/doctor.controller');
const authenticate = require('../middleware/auth');
const { validateBody, validateIdParam } = require('../middleware/validate');
const validators = require('../validators/doctor.validator');

router.use(authenticate);

router.post('/', validateBody(validators.create), controller.createDoctor);
router.get('/', controller.getDoctors);
router.get('/:id', validateIdParam(), controller.getDoctor);
router.put('/:id', validateIdParam(), validateBody(validators.update), controller.updateDoctor);
router.delete('/:id', validateIdParam(), controller.deleteDoctor);

module.exports = router;
