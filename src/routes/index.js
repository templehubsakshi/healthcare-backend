const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/patients', require('./patient.routes'));
router.use('/doctors', require('./doctor.routes'));
router.use('/mappings', require('./mapping.routes'));

module.exports = router;
