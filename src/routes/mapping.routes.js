const router = require('express').Router();
const controller = require('../controllers/mapping.controller');
const authenticate = require('../middleware/auth');
const { validateBody, validateIdParam } = require('../middleware/validate');
const validators = require('../validators/mapping.validator');

router.use(authenticate);

router.post('/', validateBody(validators.create), controller.createMapping);
router.get('/', controller.getMappings);
router.get('/:patientId', validateIdParam('patientId'), controller.getDoctorsOfPatient);
router.delete('/:id', validateIdParam(), controller.deleteMapping);

module.exports = router;
